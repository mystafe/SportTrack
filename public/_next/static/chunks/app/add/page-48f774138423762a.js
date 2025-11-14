(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [6853],
  {
    93042: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 53379));
    },
    99376: function (e, t, r) {
      'use strict';
      var n = r(35475);
      r.o(n, 'useRouter') &&
        r.d(t, {
          useRouter: function () {
            return n.useRouter;
          },
        });
    },
    53379: function (e, t, r) {
      'use strict';
      (r.r(t),
        r.d(t, {
          default: function () {
            return c;
          },
        }));
      var n = r(57437),
        s = r(25284),
        a = r(98661),
        i = r(99376),
        o = r(78466);
      function c() {
        let { t: e } = (0, a.Q)(),
          t = (0, i.useRouter)(),
          r = (0, o.d)();
        return (0, n.jsxs)('div', {
          className: 'space-y-4 sm:space-y-6',
          children: [
            (0, n.jsx)('div', {
              className: 'flex items-center justify-between',
              children: (0, n.jsxs)('h1', {
                className: 'text-2xl sm:text-3xl font-bold flex items-center gap-2 '.concat(
                  r ? 'title-entrance' : ''
                ),
                children: [
                  (0, n.jsx)('span', {
                    className: 'text-2xl sm:text-3xl '.concat(
                      r ? 'emoji-celebrate' : 'emoji-bounce'
                    ),
                    children: '➕',
                  }),
                  (0, n.jsx)('span', {
                    className: 'text-gray-950 dark:text-white',
                    children: e('actions.addActivity'),
                  }),
                ],
              }),
            }),
            (0, n.jsx)('div', {
              className: ''.concat(
                r ? 'rounded-lg p-3' : 'rounded-xl p-4 sm:p-6',
                ' border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-md hover:shadow-xl transition-shadow duration-300'
              ),
              children: (0, n.jsx)(s.W, {
                onCreated: () => {
                  setTimeout(() => {
                    t.push('/activities');
                  }, 500);
                },
              }),
            }),
          ],
        });
      }
    },
    16357: function (e, t, r) {
      'use strict';
      r.d(t, {
        K: function () {
          return s;
        },
      });
      var n = r(56942);
      function s(e, t) {
        return +(0, n.b)(e) == +(0, n.b)(t);
      }
    },
  },
  function (e) {
    (e.O(0, [6317, 2174, 9129, 7219, 2971, 2117, 1744], function () {
      return e((e.s = 93042));
    }),
      (_N_E = e.O()));
  },
]);
