import { loadConfig } from './config';
import { createGateway } from './gateway';
import { Hub } from './hub';
import { createLogger, systemClock, TestClock } from './util';

const config = loadConfig();
const log = createLogger();
const hub = new Hub(config, config.testMode ? new TestClock() : systemClock, log);
const gateway = createGateway(hub);

hub.start();
gateway.server.listen(config.port, config.host, () => {
  log.info('server_listening', { port: config.port, testMode: config.testMode });
});

/** SIGTERM: stop accepting rooms, tell everyone, close sockets, exit. */
function shutdown(): void {
  hub.shuttingDown = true;
  hub.stop();
  for (const room of [...hub.rooms.values()]) hub.dispose(room, 'SERVER_RESTART');
  gateway.close();
  setTimeout(() => process.exit(0), 500).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
