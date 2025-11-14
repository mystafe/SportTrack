'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [2610],
  {
    52610: function (t, e, a) {
      (a.r(e),
        a.d(e, {
          ActivityTypeTrend: function () {
            return D;
          },
        }));
      var r = a(57437),
        i = a(2265),
        n = a(98661),
        s = a(24979),
        d = a(56942),
        o = a(5341),
        l = a(54886),
        c = a(34479),
        y = a(60936),
        x = a(58151),
        g = a(14258),
        h = a(78466),
        m = a(91436),
        u = a(21156),
        f = a(56940),
        p = a(97059),
        b = a(62994),
        v = a(78155),
        j = a(53250),
        k = a(55487),
        w = a(8608),
        N = a(71598);
      let D = (0, i.memo)(function () {
        let { t, lang: e } = (0, n.Q)(),
          { activities: a, hydrated: D } = (0, s.G$)(),
          M = (0, x.YG)(),
          K = (0, h.d)(),
          T = 'tr' === e ? w.tr : N._,
          [P, C] = (0, i.useState)(30),
          E = (0, i.useMemo)(
            () =>
              D && 0 !== a.length
                ? (function (t) {
                    let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 30;
                    if (0 === t.length) return [];
                    let a = (0, d.b)(new Date()),
                      r = (0, o.k)(a, e - 1),
                      i = (0, l.D)({ start: r, end: a }),
                      n = new Map(),
                      s = new Map();
                    return (
                      i.forEach((t) => {
                        let e = (0, c.WU)(t, 'yyyy-MM-dd');
                        s.set(e, new Map());
                      }),
                      t.forEach((t) => {
                        let e = (0, d.b)((0, y.D)(t.performedAt)),
                          o = (0, c.WU)(e, 'yyyy-MM-dd');
                        if (e < r || e > a) return;
                        let l = s.get(o);
                        if (!l) return;
                        let x = l.get(t.activityKey);
                        (x
                          ? (x.count++, (x.points += t.points), (x.amount += t.amount))
                          : l.set(t.activityKey, { count: 1, points: t.points, amount: t.amount }),
                          n.has(t.activityKey) ||
                            n.set(t.activityKey, {
                              activityKey: t.activityKey,
                              label: t.label,
                              icon: t.icon,
                              dailyData: i.map((t) => ({
                                date: (0, c.WU)(t, 'yyyy-MM-dd'),
                                count: 0,
                                points: 0,
                                amount: 0,
                              })),
                              totalCount: 0,
                              totalPoints: 0,
                              averagePerDay: 0,
                            }));
                      }),
                      i.forEach((t) => {
                        let e = (0, c.WU)(t, 'yyyy-MM-dd'),
                          a = s.get(e);
                        a &&
                          a.forEach((t, a) => {
                            let r = n.get(a);
                            if (r) {
                              let a = r.dailyData.find((t) => t.date === e);
                              a &&
                                ((a.count = t.count), (a.points = t.points), (a.amount = t.amount));
                            }
                          });
                      }),
                      Array.from(n.values())
                        .map((t) => {
                          let e = t.dailyData.filter((t) => t.count > 0).length,
                            a = t.dailyData.reduce((t, e) => t + e.count, 0),
                            r = t.dailyData.reduce((t, e) => t + e.points, 0);
                          return {
                            ...t,
                            totalCount: a,
                            totalPoints: r,
                            averagePerDay: e > 0 ? Math.round(r / e) : 0,
                          };
                        })
                        .sort((t, e) => e.totalPoints - t.totalPoints)
                    );
                  })(a, P)
                : [],
            [a, D, P]
          ),
          S = (0, i.useMemo)(
            () =>
              (function (t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5;
                return t.slice(0, e);
              })(E, 5),
            [E]
          ),
          W = (0, i.useMemo)(() => {
            if (0 === S.length) return [];
            let t = new Map();
            return (
              S.forEach((e) => {
                e.dailyData.forEach((a) => {
                  (t.has(a.date) || t.set(a.date, { date: a.date }),
                    (t.get(a.date)[e.activityKey] = a.points));
                });
              }),
              Array.from(t.values())
                .sort((t, e) => t.date.localeCompare(e.date))
                .map((t) => ({
                  ...t,
                  dateLabel: (0, c.WU)((0, y.D)(t.date), 'd MMM', { locale: T }),
                }))
            );
          }, [S, T]);
        if (!D) return null;
        if (0 === E.length)
          return (0, r.jsxs)('section', {
            className: 'mt-8 spacing-md',
            children: [
              (0, r.jsxs)('div', {
                children: [
                  (0, r.jsx)('h2', {
                    className: 'text-heading-3 text-gray-900 dark:text-white',
                    children: t('activityTrend.title'),
                  }),
                  (0, r.jsx)('p', {
                    className: 'text-body text-gray-600 dark:text-gray-400 mt-1',
                    children: t('activityTrend.subtitle'),
                  }),
                ],
              }),
              (0, r.jsx)('div', {
                className:
                  'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-6 shadow-md',
                children: (0, r.jsx)('p', {
                  className: 'text-body text-gray-600 dark:text-gray-400 text-center',
                  children: t('activityTrend.noData'),
                }),
              }),
            ],
          });
        let U = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
        return (0, r.jsxs)('section', {
          className: 'mt-8 spacing-md',
          children: [
            (0, r.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                (0, r.jsxs)('div', {
                  children: [
                    (0, r.jsx)('h2', {
                      className: 'text-heading-3 text-gray-900 dark:text-white',
                      children: t('activityTrend.title'),
                    }),
                    (0, r.jsx)('p', {
                      className: 'text-body text-gray-600 dark:text-gray-400 mt-1',
                      children: t('activityTrend.subtitle'),
                    }),
                  ],
                }),
                (0, r.jsx)('div', {
                  className: 'flex items-center gap-2',
                  children: [7, 30, 90].map((t) =>
                    (0, r.jsxs)(
                      'button',
                      {
                        onClick: () => C(t),
                        className: 'px-2 py-1 text-xs rounded transition-colors '.concat(
                          P === t
                            ? 'bg-brand text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        ),
                        children: [t, ' ', 'tr' === e ? 'g\xfcn' : 'days'],
                      },
                      t
                    )
                  ),
                }),
              ],
            }),
            (0, r.jsx)('div', {
              className:
                'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
              children:
                0 === W.length
                  ? (0, r.jsx)('p', {
                      className: 'text-sm text-gray-600 dark:text-gray-400 text-center',
                      children: t('activityTrend.noData'),
                    })
                  : (0, r.jsxs)('div', {
                      className: 'space-y-4',
                      children: [
                        (0, r.jsx)(m.h, {
                          width: '100%',
                          height: K ? 250 : 350,
                          children: (0, r.jsxs)(u.w, {
                            data: W,
                            margin: { top: 5, right: 20, left: 0, bottom: 5 },
                            children: [
                              (0, r.jsx)(f.q, { strokeDasharray: '3 3', stroke: '#e5e7eb' }),
                              (0, r.jsx)(p.K, {
                                dataKey: 'dateLabel',
                                stroke: '#6b7280',
                                fontSize: K ? 10 : 12,
                                tick: { fill: '#6b7280' },
                              }),
                              (0, r.jsx)(b.B, {
                                stroke: '#6b7280',
                                fontSize: K ? 10 : 12,
                                tick: { fill: '#6b7280' },
                              }),
                              (0, r.jsx)(v.u, {
                                contentStyle: {
                                  backgroundColor: 'white',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  fontSize: K ? '12px' : '14px',
                                },
                              }),
                              (0, r.jsx)(j.D, { wrapperStyle: { fontSize: K ? '10px' : '12px' } }),
                              S.map((t, a) => {
                                let i = M.find((e) => e.key === t.activityKey),
                                  n = i ? (0, g.Xr)(i, e) : t.label;
                                return (0, r.jsx)(
                                  k.x,
                                  {
                                    type: 'monotone',
                                    dataKey: t.activityKey,
                                    name: ''.concat(t.icon, ' ').concat(n),
                                    stroke: U[a % U.length],
                                    strokeWidth: 2,
                                    dot: !1,
                                    activeDot: { r: 4 },
                                  },
                                  t.activityKey
                                );
                              }),
                            ],
                          }),
                        }),
                        (0, r.jsx)('div', {
                          className: 'grid '.concat(
                            K ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3',
                            ' gap-3 mt-4'
                          ),
                          children: S.map((a, i) =>
                            (0, r.jsxs)(
                              'div',
                              {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-3',
                                children: [
                                  (0, r.jsxs)('div', {
                                    className: 'flex items-center gap-2 mb-2',
                                    children: [
                                      (0, r.jsx)('span', {
                                        className: 'text-xl',
                                        children: a.icon,
                                      }),
                                      (0, r.jsx)('span', {
                                        className: ''.concat(
                                          K ? 'text-xs' : 'text-sm',
                                          ' font-semibold text-gray-900 dark:text-white'
                                        ),
                                        children: (() => {
                                          let t = M.find((t) => t.key === a.activityKey);
                                          return t ? (0, g.Xr)(t, e) : a.label;
                                        })(),
                                      }),
                                    ],
                                  }),
                                  (0, r.jsxs)('div', {
                                    className: 'space-y-1',
                                    children: [
                                      (0, r.jsxs)('div', {
                                        className:
                                          'flex justify-between text-xs text-gray-600 dark:text-gray-400',
                                        children: [
                                          (0, r.jsx)('span', {
                                            children: t('activityTrend.totalCount'),
                                          }),
                                          (0, r.jsx)('span', {
                                            className: 'font-medium',
                                            children: a.totalCount,
                                          }),
                                        ],
                                      }),
                                      (0, r.jsxs)('div', {
                                        className:
                                          'flex justify-between text-xs text-gray-600 dark:text-gray-400',
                                        children: [
                                          (0, r.jsx)('span', {
                                            children: t('activityTrend.totalPoints'),
                                          }),
                                          (0, r.jsx)('span', {
                                            className: 'font-medium text-brand',
                                            children: a.totalPoints.toLocaleString(),
                                          }),
                                        ],
                                      }),
                                      (0, r.jsxs)('div', {
                                        className:
                                          'flex justify-between text-xs text-gray-600 dark:text-gray-400',
                                        children: [
                                          (0, r.jsx)('span', {
                                            children: t('activityTrend.avgPerDay'),
                                          }),
                                          (0, r.jsx)('span', {
                                            className: 'font-medium',
                                            children: a.averagePerDay,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              a.activityKey
                            )
                          ),
                        }),
                      ],
                    }),
            }),
          ],
        });
      });
    },
    54886: function (t, e, a) {
      a.d(e, {
        D: function () {
          return i;
        },
      });
      var r = a(99649);
      function i(t, e) {
        var a;
        let i = (0, r.Q)(t.start),
          n = (0, r.Q)(t.end),
          s = +i > +n,
          d = s ? +i : +n,
          o = s ? n : i;
        o.setHours(0, 0, 0, 0);
        let l = null !== (a = null == e ? void 0 : e.step) && void 0 !== a ? a : 1;
        if (!l) return [];
        l < 0 && ((l = -l), (s = !s));
        let c = [];
        for (; +o <= d; ) (c.push((0, r.Q)(o)), o.setDate(o.getDate() + l), o.setHours(0, 0, 0, 0));
        return s ? c.reverse() : c;
      }
    },
  },
]);
