'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [7887],
  {
    17887: function (t, e, r) {
      (r.r(e),
        r.d(e, {
          ActivityTimeAnalysis: function () {
            return u;
          },
        }));
      var a = r(57437),
        s = r(2265),
        i = r(98661),
        o = r(60936),
        d = r(78466),
        n = r(91436),
        l = r(77031),
        c = r(56940),
        h = r(97059),
        x = r(62994),
        y = r(78155),
        g = r(90999),
        m = r(20407);
      let u = (0, s.memo)(function (t) {
        let { activities: e } = t,
          { t: r, lang: u } = (0, i.Q)(),
          b = (0, d.d)(),
          p = (0, s.useMemo)(() => {
            let t = new Map();
            for (let e = 0; e < 24; e++) t.set(e, { count: 0, points: 0 });
            for (let r of e) {
              let e = (0, o.D)(r.performedAt).getHours(),
                a = t.get(e);
              (a.count++, (a.points += r.points));
            }
            return Array.from(t.entries())
              .map((t) => {
                let [e, r] = t;
                return {
                  hour: e,
                  hourLabel: ''.concat(e, ':00'),
                  count: r.count,
                  points: r.points,
                };
              })
              .filter((t) => t.count > 0 || t.points > 0);
          }, [e]),
          f = (0, s.useMemo)(() => {
            let t = new Map();
            for (let e = 0; e < 7; e++) t.set(e, { count: 0, points: 0 });
            for (let r of e) {
              let e = (0, o.D)(r.performedAt).getDay(),
                a = t.get(e);
              (a.count++, (a.points += r.points));
            }
            let r =
              'tr' === u
                ? ['Pazar', 'Pazartesi', 'Salı', '\xc7arşamba', 'Perşembe', 'Cuma', 'Cumartesi']
                : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return Array.from(t.entries())
              .map((t) => {
                let [e, a] = t;
                return { day: e, dayLabel: r[e], count: a.count, points: a.points };
              })
              .sort((t, e) => (0 === t.day ? 6 : t.day - 1) - (0 === e.day ? 6 : e.day - 1));
          }, [e, u]),
          v = (0, s.useMemo)(
            () => (0 === p.length ? null : p.reduce((t, e) => (e.points > t.points ? e : t))),
            [p]
          ),
          k = (0, s.useMemo)(
            () => (0 === f.length ? null : f.reduce((t, e) => (e.points > t.points ? e : t))),
            [f]
          );
        return 0 === e.length
          ? null
          : (0, a.jsxs)('div', {
              className: 'spacing-lg',
              children: [
                (0, a.jsxs)('div', {
                  children: [
                    (0, a.jsx)('h2', {
                      className: 'text-heading-3 text-gray-900 dark:text-white mb-4',
                      children: r('timeAnalysis.title'),
                    }),
                    (0, a.jsx)('p', {
                      className: 'text-body text-gray-600 dark:text-gray-400 mb-4',
                      children: r('timeAnalysis.subtitle'),
                    }),
                  ],
                }),
                (v || k) &&
                  (0, a.jsxs)('div', {
                    className: 'grid '.concat(b ? 'grid-cols-1' : 'grid-cols-2', ' spacing-md'),
                    children: [
                      v &&
                        (0, a.jsxs)('div', {
                          className:
                            'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300',
                          children: [
                            (0, a.jsx)('div', {
                              className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                              children: r('timeAnalysis.mostActiveHour'),
                            }),
                            (0, a.jsx)('div', {
                              className: 'text-lg font-bold text-brand',
                              children: v.hourLabel,
                            }),
                            (0, a.jsxs)('div', {
                              className: 'text-xs text-gray-600 dark:text-gray-400 mt-1',
                              children: [
                                v.points.toLocaleString('tr' === u ? 'tr-TR' : 'en-US'),
                                ' ',
                                r('level.xp'),
                                ' • ',
                                v.count,
                                ' ',
                                r('timeAnalysis.activities'),
                              ],
                            }),
                          ],
                        }),
                      k &&
                        (0, a.jsxs)('div', {
                          className:
                            'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300',
                          children: [
                            (0, a.jsx)('div', {
                              className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                              children: r('timeAnalysis.mostActiveDay'),
                            }),
                            (0, a.jsx)('div', {
                              className: 'text-lg font-bold text-brand',
                              children: k.dayLabel,
                            }),
                            (0, a.jsxs)('div', {
                              className: 'text-xs text-gray-600 dark:text-gray-400 mt-1',
                              children: [
                                k.points.toLocaleString('tr' === u ? 'tr-TR' : 'en-US'),
                                ' ',
                                r('level.xp'),
                                ' • ',
                                k.count,
                                ' ',
                                r('timeAnalysis.activities'),
                              ],
                            }),
                          ],
                        }),
                    ],
                  }),
                p.length > 0 &&
                  (0, a.jsxs)('div', {
                    className:
                      'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
                    children: [
                      (0, a.jsx)('h3', {
                        className: 'text-heading-3 text-gray-900 dark:text-white mb-4',
                        children: r('timeAnalysis.hourDistribution'),
                      }),
                      (0, a.jsx)(n.h, {
                        width: '100%',
                        height: b ? 200 : 300,
                        children: (0, a.jsxs)(l.v, {
                          data: p,
                          children: [
                            (0, a.jsx)(c.q, { strokeDasharray: '3 3', stroke: '#e5e7eb' }),
                            (0, a.jsx)(h.K, {
                              dataKey: 'hourLabel',
                              tick: { fontSize: b ? 10 : 12 },
                              angle: b ? -45 : 0,
                              textAnchor: b ? 'end' : 'middle',
                              height: b ? 60 : 40,
                            }),
                            (0, a.jsx)(x.B, { tick: { fontSize: b ? 10 : 12 } }),
                            (0, a.jsx)(y.u, {
                              formatter: (t) => [
                                ''
                                  .concat(t.toLocaleString('tr' === u ? 'tr-TR' : 'en-US'), ' ')
                                  .concat(r('level.xp')),
                                r('timeAnalysis.points'),
                              ],
                              labelStyle: { color: '#374151' },
                              contentStyle: {
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                              },
                            }),
                            (0, a.jsx)(g.$, {
                              dataKey: 'points',
                              fill: '#3b82f6',
                              children: p.map((t, e) =>
                                (0, a.jsx)(
                                  m.b,
                                  {
                                    fill:
                                      t.hour === (null == v ? void 0 : v.hour)
                                        ? '#10b981'
                                        : '#3b82f6',
                                  },
                                  'cell-'.concat(e)
                                )
                              ),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                f.length > 0 &&
                  (0, a.jsxs)('div', {
                    className:
                      'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
                    children: [
                      (0, a.jsx)('h3', {
                        className: 'text-heading-3 text-gray-900 dark:text-white mb-4',
                        children: r('timeAnalysis.dayDistribution'),
                      }),
                      (0, a.jsx)(n.h, {
                        width: '100%',
                        height: b ? 200 : 300,
                        children: (0, a.jsxs)(l.v, {
                          data: f,
                          children: [
                            (0, a.jsx)(c.q, { strokeDasharray: '3 3', stroke: '#e5e7eb' }),
                            (0, a.jsx)(h.K, {
                              dataKey: 'dayLabel',
                              tick: { fontSize: b ? 10 : 12 },
                              angle: b ? -45 : 0,
                              textAnchor: b ? 'end' : 'middle',
                              height: b ? 60 : 40,
                            }),
                            (0, a.jsx)(x.B, { tick: { fontSize: b ? 10 : 12 } }),
                            (0, a.jsx)(y.u, {
                              formatter: (t) => [
                                ''
                                  .concat(t.toLocaleString('tr' === u ? 'tr-TR' : 'en-US'), ' ')
                                  .concat(r('level.xp')),
                                r('timeAnalysis.points'),
                              ],
                              labelStyle: { color: '#374151' },
                              contentStyle: {
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                              },
                            }),
                            (0, a.jsx)(g.$, {
                              dataKey: 'points',
                              fill: '#3b82f6',
                              children: f.map((t, e) =>
                                (0, a.jsx)(
                                  m.b,
                                  {
                                    fill:
                                      t.day === (null == k ? void 0 : k.day)
                                        ? '#10b981'
                                        : '#3b82f6',
                                  },
                                  'cell-'.concat(e)
                                )
                              ),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
              ],
            });
      });
    },
  },
]);
