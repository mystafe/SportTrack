'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [5854],
  {
    45854: function (e, r, t) {
      (t.r(r),
        t.d(r, {
          ActivityHeatmap: function () {
            return m;
          },
        }));
      var a = t(57437),
        s = t(2265),
        n = t(36502),
        l = t(99649),
        d = t(54886),
        i = t(56942),
        c = t(60936),
        g = t(34479),
        o = t(98661),
        u = t(78466);
      function m(e) {
        let { activities: r, target: t } = e,
          { lang: m } = (0, o.Q)(),
          y = (0, u.d)(),
          h = (0, s.useMemo)(() => {
            let e = new Date(),
              a = (0, n.e)(e),
              s = (function (e) {
                let r = (0, l.Q)(e),
                  t = r.getFullYear();
                return (r.setFullYear(t + 1, 0, 0), r.setHours(23, 59, 59, 999), r);
              })(e),
              o = (0, d.D)({ start: a, end: s }),
              u = new Map();
            for (let e of r) {
              let r = (0, i.b)((0, c.D)(e.performedAt)),
                t = (0, g.WU)(r, 'yyyy-MM-dd');
              u.set(t, (u.get(t) || 0) + e.points);
            }
            return o.map((e) => {
              let r = (0, g.WU)(e, 'yyyy-MM-dd'),
                a = u.get(r) || 0,
                s = a >= t ? 4 : a >= 0.75 * t ? 3 : a >= 0.5 * t ? 2 : a > 0 ? 1 : 0;
              return { date: e, key: r, points: a, intensity: s };
            });
          }, [r, t]),
          f = (e) => {
            switch (e) {
              case 4:
                return 'bg-green-600 dark:bg-green-500';
              case 3:
                return 'bg-green-400 dark:bg-green-600';
              case 2:
                return 'bg-yellow-400 dark:bg-yellow-600';
              case 1:
                return 'bg-gray-300 dark:bg-gray-600';
              default:
                return 'bg-gray-100 dark:bg-gray-800';
            }
          },
          x = (0, s.useMemo)(() => {
            let e = [],
              r = [];
            for (let t of h) {
              let a = t.date.getDay();
              (r.push(t), (6 === a || t === h[h.length - 1]) && (e.push([...r]), (r = [])));
            }
            return e;
          }, [h]);
        return 0 === h.length
          ? (0, a.jsx)('div', {
              className: 'flex items-center justify-center h-64 text-gray-500',
              children: 'tr' === m ? 'Yeterli veri yok' : 'Not enough data',
            })
          : (0, a.jsxs)('div', {
              className: 'overflow-x-auto',
              children: [
                (0, a.jsx)('div', {
                  className: 'inline-block min-w-full',
                  children: (0, a.jsx)('div', {
                    className: 'grid '.concat(
                      y ? 'grid-cols-7' : 'grid-cols-[repeat(53,minmax(0,1fr))]',
                      ' gap-1'
                    ),
                    children: x.map((e, r) =>
                      (0, a.jsx)(
                        'div',
                        {
                          className: 'flex flex-col gap-1',
                          children: e.map((e, r) =>
                            (0, a.jsx)(
                              'div',
                              {
                                className: 'w-3 h-3 '.concat(
                                  f(e.intensity),
                                  ' rounded-sm transition-all hover:scale-125 hover:z-10'
                                ),
                                title: ''
                                  .concat((0, g.WU)(e.date, 'MMM d, yyyy'), ': ')
                                  .concat(e.points, ' ')
                                  .concat('tr' === m ? 'puan' : 'points'),
                              },
                              e.key
                            )
                          ),
                        },
                        r
                      )
                    ),
                  }),
                }),
                (0, a.jsxs)('div', {
                  className: 'flex items-center justify-between mt-4 text-xs text-gray-500',
                  children: [
                    (0, a.jsx)('span', { children: 'tr' === m ? 'Daha az' : 'Less' }),
                    (0, a.jsxs)('div', {
                      className: 'flex items-center gap-1',
                      children: [
                        (0, a.jsx)('div', {
                          className: 'w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm',
                        }),
                        (0, a.jsx)('div', {
                          className: 'w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-sm',
                        }),
                        (0, a.jsx)('div', {
                          className: 'w-3 h-3 bg-yellow-400 dark:bg-yellow-600 rounded-sm',
                        }),
                        (0, a.jsx)('div', {
                          className: 'w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm',
                        }),
                        (0, a.jsx)('div', {
                          className: 'w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm',
                        }),
                      ],
                    }),
                    (0, a.jsx)('span', { children: 'tr' === m ? 'Daha fazla' : 'More' }),
                  ],
                }),
              ],
            });
      }
    },
    54886: function (e, r, t) {
      t.d(r, {
        D: function () {
          return s;
        },
      });
      var a = t(99649);
      function s(e, r) {
        var t;
        let s = (0, a.Q)(e.start),
          n = (0, a.Q)(e.end),
          l = +s > +n,
          d = l ? +s : +n,
          i = l ? n : s;
        i.setHours(0, 0, 0, 0);
        let c = null !== (t = null == r ? void 0 : r.step) && void 0 !== t ? t : 1;
        if (!c) return [];
        c < 0 && ((c = -c), (l = !l));
        let g = [];
        for (; +i <= d; ) (g.push((0, a.Q)(i)), i.setDate(i.getDate() + c), i.setHours(0, 0, 0, 0));
        return l ? g.reverse() : g;
      }
    },
  },
]);
