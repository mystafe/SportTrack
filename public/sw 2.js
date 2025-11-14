if (!self.define) {
  let s,
    e = {};
  const a = (a, t) => (
    (a = new URL(a + '.js', t).href),
    e[a] ||
      new Promise((e) => {
        if ('document' in self) {
          const s = document.createElement('script');
          ((s.src = a), (s.onload = e), document.head.appendChild(s));
        } else ((s = a), importScripts(a), e());
      }).then(() => {
        let s = e[a];
        if (!s) throw new Error(`Module ${a} didn’t register its module`);
        return s;
      })
  );
  self.define = (t, n) => {
    const c = s || ('document' in self ? document.currentScript.src : '') || location.href;
    if (e[c]) return;
    let i = {};
    const r = (s) => a(s, c),
      d = { module: { uri: c }, exports: i, require: r };
    e[c] = Promise.all(t.map((s) => d[s] || r(s))).then((s) => (n(...s), i));
  };
}
define(['./workbox-cb477421'], function (s) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    s.clientsClaim(),
    s.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: 'c4c12240b2c6a8c899479814844b751e' },
        { url: '/_next/static/chunks/1592-e7d7cc6d9036b93b.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/161.65914a24000fb49d.js', revision: '65914a24000fb49d' },
        { url: '/_next/static/chunks/164f4fb6.10a714ad3abcc305.js', revision: '10a714ad3abcc305' },
        { url: '/_next/static/chunks/2117-0b7da321297a1fcd.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/2174-041e848e85b56332.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/2610.7eba0112a4e7a785.js', revision: '7eba0112a4e7a785' },
        { url: '/_next/static/chunks/2f0b94e8.452a2d27023d71da.js', revision: '452a2d27023d71da' },
        { url: '/_next/static/chunks/3265.198d13db3da2802f.js', revision: '198d13db3da2802f' },
        { url: '/_next/static/chunks/3540.887d9c32f3e9ce3e.js', revision: '887d9c32f3e9ce3e' },
        { url: '/_next/static/chunks/3958.8c63daaaca1c225c.js', revision: '8c63daaaca1c225c' },
        { url: '/_next/static/chunks/3969.9d29b44469f21d25.js', revision: '9d29b44469f21d25' },
        { url: '/_next/static/chunks/4609-33aa487dff03a9fd.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/4702.c84a486ff8c7e8b2.js', revision: 'c84a486ff8c7e8b2' },
        { url: '/_next/static/chunks/4719.93069cb6b421e71f.js', revision: '93069cb6b421e71f' },
        { url: '/_next/static/chunks/5020-ff29716354ba75c0.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/5122.76e929b4100dcea0.js', revision: '76e929b4100dcea0' },
        { url: '/_next/static/chunks/5159.cd8ef00d8c6a7728.js', revision: 'cd8ef00d8c6a7728' },
        { url: '/_next/static/chunks/5854.395e2e0247612a89.js', revision: '395e2e0247612a89' },
        { url: '/_next/static/chunks/5989.79be04e1ffb796a3.js', revision: '79be04e1ffb796a3' },
        { url: '/_next/static/chunks/6317-1ada6022afab2427.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/6410.229efa91cc68aacd.js', revision: '229efa91cc68aacd' },
        { url: '/_next/static/chunks/6994.ea1a4c533ab004fb.js', revision: 'ea1a4c533ab004fb' },
        { url: '/_next/static/chunks/7219-e255abdb25f91252.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        {
          url: '/_next/static/chunks/7508b87c-5bb5f250f8394685.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        { url: '/_next/static/chunks/7887.32ba16e8ce650719.js', revision: '32ba16e8ce650719' },
        { url: '/_next/static/chunks/8406.99ea9ac0c0e3052f.js', revision: '99ea9ac0c0e3052f' },
        { url: '/_next/static/chunks/8758.6d2e237b08163e73.js', revision: '6d2e237b08163e73' },
        { url: '/_next/static/chunks/8848.604d673e614d3feb.js', revision: '604d673e614d3feb' },
        { url: '/_next/static/chunks/9013-a5f868050f543c2d.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/9129-8a1bd24fa5266e65.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/9137.b5b97f64980bdef8.js', revision: 'b5b97f64980bdef8' },
        { url: '/_next/static/chunks/9373.3fa71b08b4088d4f.js', revision: '3fa71b08b4088d4f' },
        { url: '/_next/static/chunks/9750-c9f60b4121ad0b00.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        { url: '/_next/static/chunks/ad2866b8.1fd5edbd6b1bba26.js', revision: '1fd5edbd6b1bba26' },
        {
          url: '/_next/static/chunks/app/_not-found/page-79ea6d6fd5d752cd.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/app/achievements/page-5116a1687ba2c240.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/app/activities/page-85bfec5b3477e2f8.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/app/add/page-48f774138423762a.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/app/challenges/page-85d57ce025f7f7cf.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/app/layout-11f18e3d15fe425b.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/app/page-ca1e7a97a3edccf5.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/app/stats/page-7ad1f71a13d87ff5.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        { url: '/_next/static/chunks/bc98253f.5b0f4fe717c5b99c.js', revision: '5b0f4fe717c5b99c' },
        {
          url: '/_next/static/chunks/eaa9a3dd-ff28f4ab5ad46ff0.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/fd9d1056-a782a1354edc6d46.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/framework-8e0e0f4a6b83a956.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        { url: '/_next/static/chunks/main-4d5477fb7c7fc53b.js', revision: 'wIJDpCnZxGGQ5pptasUdV' },
        {
          url: '/_next/static/chunks/main-app-7e7166932e228fa6.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/pages/_app-3c9ca398d360b709.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/pages/_error-cf5ca766ac8f493f.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-52f9a85422bee557.js',
          revision: 'wIJDpCnZxGGQ5pptasUdV',
        },
        { url: '/_next/static/css/e1bd02cbb392b0a2.css', revision: 'e1bd02cbb392b0a2' },
        {
          url: '/_next/static/wIJDpCnZxGGQ5pptasUdV/_buildManifest.js',
          revision: '6310079bf1ae7bebeb6a2135896e4564',
        },
        {
          url: '/_next/static/wIJDpCnZxGGQ5pptasUdV/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/icon-192.png', revision: 'f829b914fc47cfc9c0747c119c27cf1b' },
        { url: '/icon-512.png', revision: 'f829b914fc47cfc9c0747c119c27cf1b' },
        { url: '/icon-placeholder.md', revision: '4159458da9d3686b9e961619cf9c7aa9' },
        { url: '/icon.svg', revision: 'c3d46ab5311878e0e51aacbe53045bef' },
        { url: '/manifest.json', revision: 'e592703ee8ea2bc415b4fcb1e28c6fa1' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(
      '/',
      new s.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: s, response: e, event: a, state: t }) =>
              e && 'opaqueredirect' === e.type
                ? new Response(e.body, { status: 200, statusText: 'OK', headers: e.headers })
                : e,
          },
        ],
      }),
      'GET'
    ),
    s.registerRoute(
      /^https?.*/,
      new s.NetworkFirst({
        cacheName: 'offlineCache',
        plugins: [new s.ExpirationPlugin({ maxEntries: 200 })],
      }),
      'GET'
    ));
});
