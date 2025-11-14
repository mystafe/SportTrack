'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [3958],
  {
    3958: function (a, t, r) {
      (r.r(t),
        r.d(t, {
          DurationStats: function () {
            return h;
          },
        }));
      var e = r(57437),
        d = r(2265),
        o = r(34479),
        n = r(8608),
        s = r(71598),
        i = r(98661),
        c = r(24979),
        l = r(56942),
        g = r(60936);
      function y(a, t) {
        if (0 === a) return 'tr' === t ? '0 saniye' : '0 seconds';
        let r = Math.floor(a / 3600),
          e = Math.floor((a % 3600) / 60),
          d = a % 60,
          o = [];
        return (
          r > 0 &&
            o.push(
              'tr' === t
                ? ''.concat(r, ' ').concat('saat')
                : ''.concat(r, ' ').concat(1 === r ? 'hour' : 'hours')
            ),
          e > 0 &&
            o.push(
              'tr' === t
                ? ''.concat(e, ' ').concat('dakika')
                : ''.concat(e, ' ').concat(1 === e ? 'minute' : 'minutes')
            ),
          d > 0 &&
            0 === r &&
            o.push(
              'tr' === t
                ? ''.concat(d, ' ').concat('saniye')
                : ''.concat(d, ' ').concat(1 === d ? 'second' : 'seconds')
            ),
          o.join(' ') || ('tr' === t ? '0 saniye' : '0 seconds')
        );
      }
      var x = r(78466);
      let h = (0, d.memo)(function () {
        let { t: a, lang: t } = (0, i.Q)(),
          { activities: r, hydrated: h } = (0, c.G$)(),
          u = (0, x.d)(),
          m = 'tr' === t ? n.tr : s._,
          b = (0, d.useMemo)(
            () =>
              h && 0 !== r.length
                ? (function (a) {
                    if (0 === a.length)
                      return {
                        averageDailyDuration: 0,
                        totalDuration: 0,
                        daysWithDuration: 0,
                        longestDayDuration: 0,
                        longestDayDate: null,
                      };
                    let t = new Map();
                    for (let e of a)
                      if (e.duration && e.duration > 0) {
                        var r;
                        let a = (0, l.b)((0, g.D)(e.performedAt)).toISOString();
                        t.set(a, (null !== (r = t.get(a)) && void 0 !== r ? r : 0) + e.duration);
                      }
                    let e = Array.from(t.values()),
                      d = e.length,
                      o = e.reduce((a, t) => a + t, 0),
                      n = 0,
                      s = null;
                    for (let [a, r] of t.entries()) r > n && ((n = r), (s = a));
                    return {
                      averageDailyDuration: d > 0 ? Math.round(o / d) : 0,
                      totalDuration: o,
                      daysWithDuration: d,
                      longestDayDuration: n,
                      longestDayDate: s,
                    };
                  })(r)
                : null,
            [r, h]
          );
        return h
          ? b && 0 !== b.daysWithDuration
            ? (0, e.jsxs)('section', {
                className: 'mt-8 spacing-md',
                children: [
                  (0, e.jsxs)('div', {
                    children: [
                      (0, e.jsx)('h2', {
                        className: 'text-heading-3 text-gray-900 dark:text-white',
                        children: a('stats.duration.title'),
                      }),
                      (0, e.jsx)('p', {
                        className: 'text-body text-gray-600 dark:text-gray-400 mt-1',
                        children: a('stats.duration.subtitle'),
                      }),
                    ],
                  }),
                  (0, e.jsxs)('div', {
                    className: 'grid '.concat(
                      u ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4',
                      ' spacing-md'
                    ),
                    children: [
                      (0, e.jsxs)('div', {
                        className:
                          'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                            u ? 'p-3 space-y-1.5' : 'p-4 space-y-2',
                            ' shadow-md hover:shadow-xl transition-shadow duration-300'
                          ),
                        children: [
                          (0, e.jsx)('div', {
                            className: 'text-label text-gray-700 dark:text-gray-300',
                            children: a('stats.duration.averageDaily'),
                          }),
                          (0, e.jsx)('div', {
                            className: ''.concat(
                              u ? 'text-lg' : 'text-2xl',
                              ' font-bold text-brand dark:text-brand-light'
                            ),
                            children: y(b.averageDailyDuration, t),
                          }),
                        ],
                      }),
                      (0, e.jsxs)('div', {
                        className:
                          'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                            u ? 'p-3 space-y-1.5' : 'p-4 space-y-2',
                            ' shadow-md hover:shadow-xl transition-shadow duration-300'
                          ),
                        children: [
                          (0, e.jsx)('div', {
                            className: 'text-label text-gray-700 dark:text-gray-300',
                            children: a('stats.duration.totalDuration'),
                          }),
                          (0, e.jsx)('div', {
                            className: ''.concat(
                              u ? 'text-lg' : 'text-2xl',
                              ' font-bold text-gray-950 dark:text-gray-100'
                            ),
                            children: y(b.totalDuration, t),
                          }),
                        ],
                      }),
                      (0, e.jsxs)('div', {
                        className:
                          'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                            u ? 'p-3 space-y-1.5' : 'p-4 space-y-2',
                            ' shadow-md hover:shadow-xl transition-shadow duration-300'
                          ),
                        children: [
                          (0, e.jsx)('div', {
                            className: 'text-label text-gray-700 dark:text-gray-300',
                            children: a('stats.duration.daysWithDuration'),
                          }),
                          (0, e.jsx)('div', {
                            className: ''.concat(
                              u ? 'text-lg' : 'text-2xl',
                              ' font-bold text-gray-950 dark:text-gray-100'
                            ),
                            children: b.daysWithDuration,
                          }),
                        ],
                      }),
                      (0, e.jsxs)('div', {
                        className:
                          'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                            u ? 'p-3 space-y-1.5' : 'p-4 space-y-2',
                            ' shadow-md hover:shadow-xl transition-shadow duration-300'
                          ),
                        children: [
                          (0, e.jsx)('div', {
                            className: 'text-label text-gray-700 dark:text-gray-300',
                            children: a('stats.duration.longestDay'),
                          }),
                          (0, e.jsx)('div', {
                            className: ''.concat(
                              u ? 'text-lg' : 'text-2xl',
                              ' font-bold text-brand dark:text-brand-light'
                            ),
                            children: y(b.longestDayDuration, t),
                          }),
                          b.longestDayDate &&
                            (0, e.jsx)('div', {
                              className: 'text-body-small text-gray-600 dark:text-gray-400',
                              children: (0, o.WU)(new Date(b.longestDayDate), 'd MMM yyyy', {
                                locale: m,
                              }),
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              })
            : (0, e.jsxs)('section', {
                className: 'mt-8 spacing-md',
                children: [
                  (0, e.jsxs)('div', {
                    children: [
                      (0, e.jsx)('h2', {
                        className: 'text-heading-3 text-gray-900 dark:text-white',
                        children: a('stats.duration.title'),
                      }),
                      (0, e.jsx)('p', {
                        className: 'text-body text-gray-600 dark:text-gray-400 mt-1',
                        children: a('stats.duration.subtitle'),
                      }),
                    ],
                  }),
                  (0, e.jsx)('div', {
                    className:
                      'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-6 shadow-md',
                    children: (0, e.jsx)('p', {
                      className: 'text-body text-gray-600 dark:text-gray-400 text-center',
                      children: a('stats.duration.noDurationData'),
                    }),
                  }),
                ],
              })
          : null;
      });
    },
  },
]);
