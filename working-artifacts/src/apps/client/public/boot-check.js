/*
 * Runs before the app. Plain ES5, no dependencies, same-origin (CSP friendly).
 * 1. Applies the saved text size and motion preference before first paint.
 * 2. Feature-detects hard requirements (no user-agent sniffing).
 * 3. If the bundle fails to load or mount, shows a plain-HTML message.
 */
(function () {
  var doc = document;
  var root = doc.documentElement;

  try {
    var saved = JSON.parse(localStorage.getItem('wb.settings') || '{}');
    if (saved.textScale === 125 || saved.textScale === 150) {
      root.style.setProperty('--text-scale', String(saved.textScale / 100));
    }
    if (saved.motion === 'on') root.setAttribute('data-motion', 'reduced');
    else if (saved.motion !== 'off' && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.setAttribute('data-motion', 'reduced');
    }
  } catch (e) {
    /* storage unavailable: defaults apply */
  }

  function show(title, text, withReload) {
    var html =
      '<main style="font-family:system-ui,sans-serif;font-size:1.125rem;line-height:1.5;max-width:36rem;margin:0 auto;padding:1.5rem;color:#1F1A3D;background:#FFF8EC;min-height:100vh">' +
      '<h1 style="font-size:2rem;line-height:1.2">' + title + '</h1><p>' + text + '</p>' +
      (withReload ? '<p><a href="" style="display:inline-block;min-height:48px;padding:12px 20px;background:#5B3FD9;color:#fff;border-radius:16px;text-decoration:none;font-weight:700">Reload</a></p>' : '') +
      '</main>';
    doc.body.innerHTML = html;
  }

  var supported = true;
  try {
    supported =
      typeof WebSocket !== 'undefined' &&
      typeof Promise !== 'undefined' &&
      typeof fetch !== 'undefined' &&
      typeof Map !== 'undefined' &&
      typeof Set !== 'undefined' &&
      typeof URL !== 'undefined' &&
      typeof Intl !== 'undefined' &&
      typeof HTMLDialogElement !== 'undefined' &&
      typeof HTMLDialogElement.prototype.showModal === 'function';
  } catch (e) {
    supported = false;
  }

  function onReady(fn) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  if (!supported) {
    onReady(function () {
      show(
        'This game needs a newer browser',
        'Please try the latest Chrome, Edge, Firefox, or Safari (iOS 16 or newer, or Android Chrome).',
        false
      );
    });
    return;
  }

  var failed = false;
  function fail() {
    if (failed) return;
    failed = true;
    show('Something went wrong loading the game', 'Check your connection and try again.', true);
  }

  window.addEventListener(
    'error',
    function (event) {
      var t = event && event.target;
      if (t && t.tagName === 'SCRIPT') onReady(fail);
    },
    true
  );

  setTimeout(function () {
    if (!window.__wbMounted) onReady(fail);
  }, 10000);
})();
