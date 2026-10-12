import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { Duplex } from 'node:stream';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { WebSocketServer } from 'ws';
import { PROTOCOL_VERSION } from '@wb/protocol';
import { Connection } from './connection';
import { handleFrame } from './pipeline';
import { TokenBucket } from './limits';
import type { Hub } from './hub';
import { TestClock } from './util';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

/** Client IP from the socket, or X-Forwarded-For only from a trusted proxy. */
function clientIp(req: IncomingMessage, trusted: string[]): string {
  const remote = req.socket.remoteAddress ?? 'unknown';
  if (trusted.includes(remote)) {
    const forwarded = req.headers['x-forwarded-for'];
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
    if (first) return first;
  }
  return remote;
}

function originAllowed(req: IncomingMessage, hub: Hub): boolean {
  const origin = req.headers.origin;
  const { allowedOrigins, production } = hub.config;
  if (allowedOrigins.length > 0) return origin !== undefined && allowedOrigins.includes(origin);
  if (!origin) return true;
  if (!production) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function securityHeaders(req: IncomingMessage, hub: Hub): Record<string, string> {
  const host = req.headers.host ?? '';
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "media-src 'self' blob:",
    `connect-src 'self' wss://${host} ws://${host}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'none'",
  ].join('; ');
  const headers: Record<string, string> = {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  };
  if (hub.config.production) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }
  return headers;
}

function serveStatic(req: IncomingMessage, res: ServerResponse, hub: Hub, dir: string): void {
  const headers = securityHeaders(req, hub);
  const url = new URL(req.url ?? '/', 'http://localhost');
  const root = resolve(dir);
  let decoded: string;
  try {
    decoded = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400, headers).end('Bad request');
    return;
  }
  let file = resolve(join(root, normalize(decoded)));
  const inside = file === root || file.startsWith(root + sep);
  const isFile = inside && existsSync(file) && statSync(file).isFile();

  if (!isFile) {
    // SPA fallback for route-like paths; real missing assets stay 404.
    if (extname(url.pathname) !== '') {
      res.writeHead(404, headers).end('Not found');
      return;
    }
    file = join(root, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404, headers).end('Client build not found. Run "pnpm build" first.');
      return;
    }
  }
  const ext = extname(file);
  const immutable = file.includes(`${sep}assets${sep}`);
  res.writeHead(200, {
    ...headers,
    'Content-Type': MIME[ext] ?? 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  if (req.method === 'HEAD') return void res.end();
  createReadStream(file).pipe(res);
}

function onHttp(hub: Hub, req: IncomingMessage, res: ServerResponse): void {
  try {
    route(hub, req, res);
  } catch {
    // A malformed request must never take the process down.
    if (!res.headersSent) res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad request');
  }
}

function route(hub: Hub, req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (url.pathname === '/healthz') return void res.writeHead(200).end('ok');
  if (url.pathname === '/readyz') {
    res.writeHead(hub.shuttingDown ? 503 : 200, { 'Content-Type': 'application/json' });
    return void res.end(JSON.stringify({ ready: !hub.shuttingDown, rooms: hub.rooms.size }));
  }
  if (hub.config.testMode && url.pathname === '/test/clock/advance' && req.method === 'POST') {
    if (hub.clock instanceof TestClock) {
      hub.clock.advance(Number(url.searchParams.get('ms') ?? 0) || 0);
      hub.sweep();
      return void res.writeHead(200).end('ok');
    }
  }
  if (hub.config.staticDir && (req.method === 'GET' || req.method === 'HEAD')) {
    return serveStatic(req, res, hub, hub.config.staticDir);
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
}

export function createGateway(hub: Hub): { server: Server; close: () => void } {
  const { config } = hub;
  const server = createServer((req, res) => onHttp(hub, req, res));
  const wss = new WebSocketServer({ noServer: true, maxPayload: config.maxMessageBytes });

  server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const reject = (status: string): void => {
      socket.write(`HTTP/1.1 ${status}\r\nConnection: close\r\n\r\n`);
      socket.destroy();
    };
    let path = '';
    try {
      path = new URL(req.url ?? '/', 'http://localhost').pathname;
    } catch {
      return reject('400 Bad Request');
    }
    if (path !== '/ws') return reject('404 Not Found');
    if (!originAllowed(req, hub)) return reject('403 Forbidden');
    if (hub.shuttingDown) return reject('503 Service Unavailable');

    const ip = clientIp(req, config.trustedProxies);
    if (hub.newConnections.isBlocked(ip)) return reject('429 Too Many Requests');
    hub.newConnections.hit(ip);

    wss.handleUpgrade(req, socket, head, (ws) => {
      const conn = new Connection(
        ws,
        ip,
        new TokenBucket(config.msgRate, config.msgBurst, hub.clock),
        hub.clock.now(),
      );
      hub.connections.add(conn);
      hub.send(conn, 'hello', { serverTime: hub.clock.now(), protocol: PROTOCOL_VERSION });
      ws.on('message', (data, isBinary) => {
        try {
          handleFrame(hub, conn, data, isBinary);
        } catch {
          hub.log.error('frame_failed');
          conn.close(1011, 'server error');
        }
      });
      ws.on('close', () => hub.onClose(conn));
      ws.on('error', () => ws.terminate());
    });
  });

  return {
    server,
    close: () => {
      for (const c of hub.connections) c.close(1001, 'server shutting down');
      wss.close();
      server.close();
    },
  };
}
