(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [2740],
  {
    13508: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 2387));
    },
    2387: function (e, t, a) {
      'use strict';
      (a.r(t),
        a.d(t, {
          default: function () {
            return S;
          },
        }));
      var r = a(57437),
        s = a(2265),
        d = a(56942),
        i = a(60936),
        o = a(16357),
        n = a(34479),
        l = a(8608),
        c = a(71598),
        g = a(98661),
        m = a(24979),
        h = a(58151),
        x = a(60186),
        y = a(14258),
        b = a(78466),
        u = a(81178);
      function f() {
        return (0, r.jsx)('div', {
          className: 'w-full h-[300px] sm:h-[400px] flex items-center justify-center',
          children: (0, r.jsx)('div', {
            className:
              'w-full h-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 animate-pulse',
          }),
        });
      }
      let v = (0, s.lazy)(() =>
          Promise.all([a.e(4609), a.e(3540), a.e(4702), a.e(5989), a.e(5159)])
            .then(a.bind(a, 95159))
            .then((e) => ({ default: e.TrendChart }))
        ),
        k = (0, s.lazy)(() =>
          Promise.all([a.e(4609), a.e(3540), a.e(4702), a.e(8406), a.e(4719)])
            .then(a.bind(a, 34719))
            .then((e) => ({ default: e.ActivityBarChart }))
        ),
        j = (0, s.lazy)(() =>
          Promise.all([a.e(4609), a.e(3540), a.e(3265), a.e(9373)])
            .then(a.bind(a, 49373))
            .then((e) => ({ default: e.ActivityPieChart }))
        ),
        p = (0, s.lazy)(() =>
          a
            .e(5854)
            .then(a.bind(a, 45854))
            .then((e) => ({ default: e.ActivityHeatmap }))
        ),
        w = (0, s.lazy)(() =>
          a
            .e(5122)
            .then(a.bind(a, 15122))
            .then((e) => ({ default: e.PersonalRecords }))
        ),
        N = (0, s.lazy)(() =>
          Promise.all([a.e(4609), a.e(3540), a.e(4702), a.e(8406), a.e(7887)])
            .then(a.bind(a, 17887))
            .then((e) => ({ default: e.ActivityTimeAnalysis }))
        ),
        M = (0, s.lazy)(() =>
          Promise.all([a.e(4609), a.e(3540), a.e(4702), a.e(8406), a.e(6410)])
            .then(a.bind(a, 66410))
            .then((e) => ({ default: e.PeriodComparison }))
        ),
        A = (0, s.lazy)(() =>
          a
            .e(3958)
            .then(a.bind(a, 3958))
            .then((e) => ({ default: e.DurationStats }))
        ),
        P = (0, s.lazy)(() =>
          Promise.all([a.e(4609), a.e(3540), a.e(4702), a.e(5989), a.e(2610)])
            .then(a.bind(a, 52610))
            .then((e) => ({ default: e.ActivityTypeTrend }))
        );
      function S() {
        let { t: e, lang: t } = (0, g.Q)(),
          { activities: a, hydrated: S } = (0, m.G$)(),
          { settings: E } = (0, h.rV)(),
          D = (null == E ? void 0 : E.dailyTarget) && E.dailyTarget > 0 ? E.dailyTarget : x.Dy,
          T = (0, m.bA)(D),
          C = 'tr' === t ? l.tr : c._,
          U = (0, b.d)(),
          [z, _] = (0, s.useState)(null),
          [I, O] = (0, s.useState)(30),
          W = (0, s.useMemo)(() => new Intl.NumberFormat('tr' === t ? 'tr-TR' : 'en-US'), [t]),
          X = (0, s.useMemo)(() => {
            if (0 === a.length) return [];
            let e = new Map();
            for (let t of a) {
              let a = (0, d.b)((0, i.D)(t.performedAt)),
                r = a.toISOString(),
                s = e.get(r);
              s
                ? ((s.points += t.points), s.activities.push(t))
                : e.set(r, { date: a, points: t.points, activities: [t] });
            }
            return Array.from(e.values()).sort((e, t) => t.date.getTime() - e.date.getTime());
          }, [a]),
          J = (0, s.useMemo)(() => {
            if (0 === X.length) return 0;
            let e = [...X].sort((e, t) => e.date.getTime() - t.date.getTime()),
              t = 0,
              a = 0;
            for (let r of e) r.points >= D ? (t = Math.max(t, ++a)) : (a = 0);
            return t;
          }, [X, D]),
          K = (0, s.useMemo)(
            () =>
              0 === X.length
                ? 0
                : Math.round((X.filter((e) => e.points >= D).length / X.length) * 100),
            [X, D]
          ),
          Q = (0, s.useMemo)(() => {
            let e = new Map();
            for (let r of a) {
              let a = r.activityKey,
                s = e.get(a);
              s
                ? (s.count++, (s.totalPoints += r.points), (s.totalAmount += r.amount))
                : e.set(a, {
                    label: (0, y.Xr)(r, t),
                    icon: r.icon,
                    count: 1,
                    totalPoints: r.points,
                    totalAmount: r.amount,
                    unit: (0, y.Jt)(r, t),
                  });
            }
            return Array.from(e.values()).sort((e, t) => t.totalPoints - e.totalPoints);
          }, [a, t]),
          R = (0, s.useMemo)(() => {
            if (!z) return [];
            let e = (0, d.b)((0, i.D)(z + 'T00:00:00'));
            return a
              .filter((t) => (0, o.K)((0, d.b)((0, i.D)(t.performedAt)), e))
              .sort(
                (e, t) => (0, i.D)(t.performedAt).getTime() - (0, i.D)(e.performedAt).getTime()
              );
          }, [z, a]),
          B = (0, s.useMemo)(() => {
            if (!z) return null;
            let e = (0, d.b)((0, i.D)(z + 'T00:00:00'));
            return X.find((t) => (0, o.K)(t.date, e));
          }, [z, X]);
        return S
          ? (0, r.jsxs)('div', {
              className: 'space-y-4 sm:space-y-6 page-transition',
              children: [
                (0, r.jsxs)('h1', {
                  className: 'stats-title '.concat(
                    U ? 'title-entrance' : '',
                    ' text-2xl sm:text-3xl font-bold flex items-center gap-2'
                  ),
                  children: [
                    (0, r.jsx)('span', {
                      className: 'text-2xl sm:text-3xl icon-rotate '.concat(
                        U ? 'icon-wiggle-mobile' : 'emoji-bounce'
                      ),
                      children: '\uD83D\uDCCA',
                    }),
                    (0, r.jsx)('span', {
                      className: 'text-gray-950 dark:text-white',
                      children: e('nav.stats'),
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className: 'grid '
                    .concat(U ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', ' ')
                    .concat(U ? 'gap-2' : 'gap-4'),
                  children: [
                    (0, r.jsxs)('div', {
                      className: 'stagger-item card-entrance '
                        .concat(
                          U ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                          ' stats-highlight-card rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                        )
                        .concat(
                          U ? 'p-2.5' : 'p-4',
                          ' shadow-md hover:shadow-xl transition-shadow duration-300 gpu-accelerated'
                        ),
                      children: [
                        (0, r.jsx)('div', {
                          className: ''.concat(
                            U ? 'text-[10px]' : 'text-xs',
                            ' font-semibold text-gray-700 dark:text-gray-300 mb-1'
                          ),
                          children: e('stats.detailed.totalActivities'),
                        }),
                        (0, r.jsx)('div', {
                          className: ''
                            .concat(
                              U ? 'text-lg' : 'text-2xl',
                              ' font-bold text-gray-950 dark:text-gray-100 '
                            )
                            .concat(U ? 'number-count-mobile' : 'number-transition'),
                          children: W.format(a.length),
                        }),
                      ],
                    }),
                    (0, r.jsxs)('div', {
                      className: 'stagger-item card-entrance '
                        .concat(
                          U ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                          ' stats-highlight-card rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                        )
                        .concat(
                          U ? 'p-2.5' : 'p-4',
                          ' shadow-md hover:shadow-xl transition-shadow duration-300 gpu-accelerated'
                        ),
                      children: [
                        (0, r.jsx)('div', {
                          className: ''.concat(
                            U ? 'text-[10px]' : 'text-xs',
                            ' font-semibold text-gray-700 dark:text-gray-300 mb-1'
                          ),
                          children: e('stats.detailed.totalSessions'),
                        }),
                        (0, r.jsx)('div', {
                          className: ''
                            .concat(
                              U ? 'text-lg' : 'text-2xl',
                              ' font-bold text-gray-950 dark:text-gray-100 '
                            )
                            .concat(U ? 'number-count-mobile' : 'number-transition'),
                          children: W.format(X.length),
                        }),
                      ],
                    }),
                    (0, r.jsxs)('div', {
                      className: 'stagger-item card-entrance '
                        .concat(
                          U ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                          ' stats-highlight-card rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                        )
                        .concat(
                          U ? 'p-2.5' : 'p-4',
                          ' shadow-md hover:shadow-xl transition-shadow duration-300 gpu-accelerated'
                        ),
                      children: [
                        (0, r.jsx)('div', {
                          className: ''.concat(
                            U ? 'text-[10px]' : 'text-xs',
                            ' font-semibold text-gray-700 dark:text-gray-300 mb-1'
                          ),
                          children: e('stats.detailed.averagePerDay'),
                        }),
                        (0, r.jsxs)('div', {
                          className: ''
                            .concat(
                              U ? 'text-lg' : 'text-2xl',
                              ' font-bold text-gray-950 dark:text-gray-100 '
                            )
                            .concat(U ? 'number-count-mobile' : 'number-transition'),
                          children: [
                            X.length > 0
                              ? W.format(Math.round(X.reduce((e, t) => e + t.points, 0) / X.length))
                              : '0',
                            ' ',
                            e('list.pointsUnit'),
                          ],
                        }),
                      ],
                    }),
                    (0, r.jsxs)('div', {
                      className: 'stagger-item card-entrance '
                        .concat(
                          U ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                          ' stats-highlight-card rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                        )
                        .concat(
                          U ? 'p-2.5' : 'p-4',
                          ' shadow-md hover:shadow-xl transition-shadow duration-300 gpu-accelerated'
                        ),
                      children: [
                        (0, r.jsx)('div', {
                          className: ''.concat(
                            U ? 'text-[10px]' : 'text-xs',
                            ' font-semibold text-gray-700 dark:text-gray-300 mb-1'
                          ),
                          children: e('stats.detailed.bestStreak'),
                        }),
                        (0, r.jsxs)('div', {
                          className: ''
                            .concat(
                              U ? 'text-lg' : 'text-2xl',
                              ' font-bold text-gray-950 dark:text-gray-100 '
                            )
                            .concat(U ? 'number-count-mobile' : 'number-transition'),
                          children: [J, ' ', e('stats.highlight.sessions')],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className:
                    'chart-container card-entrance slide-in-left rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated',
                  children: [
                    (0, r.jsx)('h2', {
                      className: 'text-lg font-bold text-gray-950 dark:text-white mb-4',
                      children: e('stats.detailed.activityBreakdown'),
                    }),
                    0 === Q.length
                      ? (0, r.jsx)('p', {
                          className: 'text-sm text-gray-600 dark:text-gray-400',
                          children: e('stats.detailed.noActivities'),
                        })
                      : (0, r.jsx)('div', {
                          className: 'space-y-3',
                          children: Q.map((t) =>
                            (0, r.jsxs)(
                              'div',
                              {
                                className:
                                  'flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/50 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30 hover:shadow-md transition-all duration-300',
                                children: [
                                  (0, r.jsxs)('div', {
                                    className: 'flex items-center gap-3',
                                    children: [
                                      (0, r.jsx)('span', {
                                        className: 'text-2xl '.concat(
                                          U ? 'emoji-celebrate' : 'emoji-bounce'
                                        ),
                                        children: t.icon,
                                      }),
                                      (0, r.jsxs)('div', {
                                        children: [
                                          (0, r.jsx)('div', {
                                            className: 'font-bold text-gray-950 dark:text-gray-100',
                                            children: t.label,
                                          }),
                                          (0, r.jsxs)('div', {
                                            className:
                                              'text-xs font-semibold text-gray-600 dark:text-gray-400',
                                            children: [
                                              t.count,
                                              ' ',
                                              (t.count, e('stats.highlight.sessions')),
                                              ' ',
                                              '• ',
                                              W.format(t.totalAmount),
                                              ' ',
                                              t.unit,
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, r.jsxs)('div', {
                                    className: 'text-right',
                                    children: [
                                      (0, r.jsxs)('div', {
                                        className: 'font-bold text-gray-950 dark:text-gray-100',
                                        children: [
                                          W.format(t.totalPoints),
                                          ' ',
                                          e('list.pointsUnit'),
                                        ],
                                      }),
                                      (0, r.jsxs)('div', {
                                        className:
                                          'text-xs font-semibold text-gray-600 dark:text-gray-400',
                                        children: [
                                          Math.round((t.totalPoints / T.totalPoints) * 100),
                                          '%',
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              t.label
                            )
                          ),
                        }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className:
                    'rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
                  children: [
                    (0, r.jsxs)('div', {
                      className: 'flex items-center justify-between mb-4',
                      children: [
                        (0, r.jsx)('h2', {
                          className: 'text-lg font-bold text-gray-950 dark:text-white',
                          children: e('stats.detailed.trendChart'),
                        }),
                        (0, r.jsx)('div', {
                          className: 'flex items-center gap-2',
                          children: [7, 30, 90].map((e) =>
                            (0, r.jsxs)(
                              'button',
                              {
                                onClick: () => O(e),
                                className:
                                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 '.concat(
                                    I === e
                                      ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-md'
                                      : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-md'
                                  ),
                                children: [e, ' ', 'tr' === t ? 'g\xfcn' : 'days'],
                              },
                              e
                            )
                          ),
                        }),
                      ],
                    }),
                    (0, r.jsx)(s.Suspense, {
                      fallback: (0, r.jsx)(f, {}),
                      children: (0, r.jsx)(v, { activities: a, target: D, days: I }),
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className: 'grid '.concat(
                    U ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2',
                    ' gap-4 sm:gap-6'
                  ),
                  children: [
                    (0, r.jsxs)('div', {
                      className:
                        'chart-container card-entrance slide-in-left rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated',
                      children: [
                        (0, r.jsx)('h2', {
                          className: 'text-lg font-bold text-gray-950 dark:text-white mb-4',
                          children: e('stats.detailed.activityComparison'),
                        }),
                        (0, r.jsx)(s.Suspense, {
                          fallback: (0, r.jsx)(f, {}),
                          children: (0, r.jsx)(k, { activities: a }),
                        }),
                      ],
                    }),
                    (0, r.jsxs)('div', {
                      className:
                        'chart-container card-entrance slide-in-right rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated',
                      children: [
                        (0, r.jsx)('h2', {
                          className: 'text-lg font-bold text-gray-950 dark:text-white mb-4',
                          children: e('stats.detailed.activityDistribution'),
                        }),
                        (0, r.jsx)(s.Suspense, {
                          fallback: (0, r.jsx)(f, {}),
                          children: (0, r.jsx)(j, { activities: a }),
                        }),
                      ],
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className:
                    'rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
                  children: [
                    (0, r.jsx)('h2', {
                      className: 'text-lg font-bold text-gray-950 dark:text-white mb-4',
                      children: e('stats.detailed.activityHeatmap'),
                    }),
                    (0, r.jsx)(s.Suspense, {
                      fallback: (0, r.jsx)(f, {}),
                      children: (0, r.jsx)(p, { activities: a, target: D }),
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className:
                    'rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
                  children: [
                    (0, r.jsx)('h2', {
                      className: 'text-lg font-bold text-gray-950 dark:text-white mb-4',
                      children: e('stats.detailed.dailyStats'),
                    }),
                    (0, r.jsxs)('div', {
                      className: 'mb-4',
                      children: [
                        (0, r.jsx)('label', {
                          className: 'block text-sm font-medium mb-2',
                          children: e('stats.detailed.selectDate'),
                        }),
                        (0, r.jsx)('input', {
                          type: 'date',
                          value: z || '',
                          onChange: (e) => _(e.target.value || null),
                          max: (0, n.WU)(new Date(), 'yyyy-MM-dd'),
                          className:
                            'w-full sm:w-auto border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 focus:border-brand dark:focus:border-brand/60 focus:ring-2 focus:ring-brand/20 dark:focus:ring-brand/30 transition-all duration-200 input-enhanced',
                        }),
                      ],
                    }),
                    z &&
                      B &&
                      (0, r.jsxs)('div', {
                        className:
                          'mb-6 p-4 rounded-lg bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-800/50 border-2 border-gray-200 dark:border-gray-700 shadow-sm',
                        children: [
                          (0, r.jsx)('h3', {
                            className: 'font-bold text-gray-950 dark:text-white mb-2',
                            children: (0, n.WU)(B.date, 'd MMMM yyyy, EEEE', { locale: C }),
                          }),
                          (0, r.jsxs)('div', {
                            className: 'grid grid-cols-2 gap-4 mb-4',
                            children: [
                              (0, r.jsxs)('div', {
                                children: [
                                  (0, r.jsx)('div', {
                                    className: 'text-xs text-gray-500',
                                    children: e('stats.totalPoints'),
                                  }),
                                  (0, r.jsxs)('div', {
                                    className: 'text-lg font-semibold',
                                    children: [
                                      W.format(B.points),
                                      ' /',
                                      ' ',
                                      W.format(D),
                                      ' ',
                                      e('list.pointsUnit'),
                                    ],
                                  }),
                                  (0, r.jsxs)('div', {
                                    className: 'text-xs text-gray-500',
                                    children: [
                                      Math.round((B.points / D) * 100),
                                      '%',
                                      ' ',
                                      e('stats.highlight.complete'),
                                    ],
                                  }),
                                ],
                              }),
                              (0, r.jsxs)('div', {
                                children: [
                                  (0, r.jsx)('div', {
                                    className: 'text-xs text-gray-500',
                                    children: e('stats.detailed.totalActivities'),
                                  }),
                                  (0, r.jsx)('div', {
                                    className: 'text-lg font-semibold',
                                    children: B.activities.length,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, r.jsxs)('div', {
                            children: [
                              (0, r.jsx)('div', {
                                className: 'text-xs text-gray-500 mb-2',
                                children: e('stats.detailed.activitiesOnDay'),
                              }),
                              (0, r.jsx)('div', {
                                className: 'space-y-2',
                                children: R.map((a) =>
                                  (0, r.jsxs)(
                                    'div',
                                    {
                                      className:
                                        'flex items-center justify-between p-2 rounded border border-gray-200 dark:border-gray-700',
                                      children: [
                                        (0, r.jsxs)('div', {
                                          className: 'flex items-center gap-2',
                                          children: [
                                            (0, r.jsx)('span', { children: a.icon }),
                                            (0, r.jsx)('span', {
                                              className: 'text-sm',
                                              children: (0, y.Xr)(a, t),
                                            }),
                                          ],
                                        }),
                                        (0, r.jsxs)('div', {
                                          className: 'text-sm font-medium',
                                          children: [
                                            W.format(a.amount),
                                            ' ',
                                            (0, y.Jt)(a, t),
                                            ' •',
                                            ' ',
                                            W.format(a.points),
                                            ' ',
                                            e('list.pointsUnit'),
                                          ],
                                        }),
                                      ],
                                    },
                                    a.id
                                  )
                                ),
                              }),
                            ],
                          }),
                        ],
                      }),
                    (0, r.jsx)('div', {
                      className: 'max-h-[600px] overflow-y-auto',
                      children:
                        0 === X.length
                          ? (0, r.jsx)('p', {
                              className: 'text-sm text-gray-600 dark:text-gray-400',
                              children: e('stats.detailed.noActivities'),
                            })
                          : (0, r.jsx)('div', {
                              className: 'space-y-2',
                              children: X.map((t) => {
                                let a = (0, n.WU)(t.date, 'yyyy-MM-dd'),
                                  s = z === a,
                                  d = t.points >= D;
                                return (0, r.jsxs)(
                                  'button',
                                  {
                                    type: 'button',
                                    onClick: () => _(s ? null : a),
                                    className:
                                      'w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 text-left '.concat(
                                        s
                                          ? 'border-brand bg-gradient-to-r from-brand/15 via-brand/10 to-brand/15 dark:from-brand/25 dark:via-brand/20 dark:to-brand/25 shadow-md'
                                          : 'border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-800/30 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30 hover:shadow-md'
                                      ),
                                    children: [
                                      (0, r.jsxs)('div', {
                                        className: 'flex items-center gap-3',
                                        children: [
                                          (0, r.jsx)('div', {
                                            className: 'w-2 h-2 rounded-full '.concat(
                                              d ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                            ),
                                          }),
                                          (0, r.jsxs)('div', {
                                            children: [
                                              (0, r.jsx)('div', {
                                                className: 'font-medium',
                                                children: (0, n.WU)(t.date, 'd MMMM yyyy, EEEE', {
                                                  locale: C,
                                                }),
                                              }),
                                              (0, r.jsxs)('div', {
                                                className: 'text-xs text-gray-500',
                                                children: [
                                                  t.activities.length,
                                                  ' ',
                                                  (t.activities.length,
                                                  e('stats.highlight.sessions')),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, r.jsxs)('div', {
                                        className: 'text-right',
                                        children: [
                                          (0, r.jsxs)('div', {
                                            className: 'font-semibold '.concat(
                                              d ? 'text-green-600 dark:text-green-400' : ''
                                            ),
                                            children: [
                                              W.format(t.points),
                                              ' / ',
                                              W.format(D),
                                              ' ',
                                              e('list.pointsUnit'),
                                            ],
                                          }),
                                          (0, r.jsxs)('div', {
                                            className: 'text-xs text-gray-500',
                                            children: [Math.round((t.points / D) * 100), '%'],
                                          }),
                                        ],
                                      }),
                                    ],
                                  },
                                  a
                                );
                              }),
                            }),
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className:
                    'rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
                  children: [
                    (0, r.jsx)('h2', {
                      className: 'text-lg font-bold text-gray-950 dark:text-white mb-4',
                      children: e('stats.detailed.completionRate'),
                    }),
                    (0, r.jsxs)('div', {
                      className: 'flex items-center gap-4',
                      children: [
                        (0, r.jsx)('div', {
                          className: 'flex-1',
                          children: (0, r.jsx)('div', {
                            className:
                              'h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden',
                            children: (0, r.jsx)('div', {
                              className: 'h-full bg-brand transition-all duration-500',
                              style: { width: ''.concat(K, '%') },
                            }),
                          }),
                        }),
                        (0, r.jsxs)('div', { className: 'text-2xl font-bold', children: [K, '%'] }),
                      ],
                    }),
                    (0, r.jsxs)('div', {
                      className: 'text-xs text-gray-500 mt-2',
                      children: [
                        X.filter((e) => e.points >= D).length,
                        ' / ',
                        X.length,
                        ' ',
                        e('stats.detailed.totalSessions'),
                      ],
                    }),
                  ],
                }),
                (0, r.jsx)(s.Suspense, {
                  fallback: (0, r.jsx)('div', { className: 'h-32 skeleton rounded-lg' }),
                  children: (0, r.jsx)(w, {}),
                }),
                (0, r.jsx)(s.Suspense, {
                  fallback: (0, r.jsx)('div', { className: 'h-32 skeleton rounded-lg' }),
                  children: (0, r.jsx)(N, { activities: a }),
                }),
                (0, r.jsx)(s.Suspense, {
                  fallback: (0, r.jsx)('div', { className: 'h-32 skeleton rounded-lg' }),
                  children: (0, r.jsx)(M, {}),
                }),
                (0, r.jsx)(s.Suspense, {
                  fallback: (0, r.jsx)('div', { className: 'h-32 skeleton rounded-lg' }),
                  children: (0, r.jsx)(A, {}),
                }),
                (0, r.jsx)(s.Suspense, {
                  fallback: (0, r.jsx)('div', { className: 'h-32 skeleton rounded-lg' }),
                  children: (0, r.jsx)(P, {}),
                }),
              ],
            })
          : (0, r.jsxs)('div', {
              className: 'space-y-4 sm:space-y-6',
              children: [
                (0, r.jsx)(u.IZ, {}),
                (0, r.jsx)('div', {
                  className: 'grid '
                    .concat(U ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', ' ')
                    .concat(U ? 'gap-2' : 'gap-4'),
                  children: [1, 2, 3, 4].map((e) =>
                    (0, r.jsxs)(
                      'div',
                      {
                        className:
                          'rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 skeleton',
                        children: [
                          (0, r.jsx)('div', { className: 'h-4 w-24 rounded skeleton mb-3' }),
                          (0, r.jsx)('div', { className: 'h-8 w-32 rounded skeleton' }),
                        ],
                      },
                      e
                    )
                  ),
                }),
              ],
            });
      }
    },
    81178: function (e, t, a) {
      'use strict';
      a.d(t, {
        IZ: function () {
          return i;
        },
        VQ: function () {
          return d;
        },
        XQ: function () {
          return s;
        },
      });
      var r = a(57437);
      function s() {
        return (0, r.jsx)('div', {
          className:
            'rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 skeleton',
          children: (0, r.jsxs)('div', {
            className: 'space-y-4',
            children: [
              (0, r.jsxs)('div', {
                className: 'flex items-center justify-between',
                children: [
                  (0, r.jsx)('div', { className: 'h-6 w-32 rounded skeleton' }),
                  (0, r.jsx)('div', { className: 'h-5 w-16 rounded skeleton' }),
                ],
              }),
              (0, r.jsx)('div', { className: 'h-4 w-full rounded skeleton' }),
              (0, r.jsx)('div', { className: 'h-4 w-3/4 rounded skeleton' }),
              (0, r.jsx)('div', {
                className: 'h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden',
                children: (0, r.jsx)('div', {
                  className: 'h-full w-1/3 bg-gray-300 dark:bg-gray-700 rounded-full skeleton',
                }),
              }),
              (0, r.jsxs)('div', {
                className: 'flex items-center justify-between',
                children: [
                  (0, r.jsx)('div', { className: 'h-4 w-24 rounded skeleton' }),
                  (0, r.jsx)('div', { className: 'h-8 w-20 rounded-lg skeleton' }),
                ],
              }),
            ],
          }),
        });
      }
      function d() {
        return (0, r.jsx)('div', {
          className:
            'rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-3 sm:p-4 skeleton',
          children: (0, r.jsxs)('div', {
            className: 'space-y-3',
            children: [
              (0, r.jsx)('div', { className: 'h-12 w-12 mx-auto rounded-lg skeleton' }),
              (0, r.jsx)('div', { className: 'h-5 w-full rounded skeleton' }),
              (0, r.jsx)('div', { className: 'h-4 w-3/4 mx-auto rounded skeleton' }),
              (0, r.jsxs)('div', {
                className: 'flex items-center justify-between',
                children: [
                  (0, r.jsx)('div', { className: 'h-5 w-16 rounded-full skeleton' }),
                  (0, r.jsx)('div', { className: 'h-4 w-12 rounded skeleton' }),
                ],
              }),
            ],
          }),
        });
      }
      function i() {
        return (0, r.jsx)('div', {
          className: 'space-y-6',
          children: (0, r.jsxs)('div', {
            className: 'animate-pulse space-y-4',
            children: [
              (0, r.jsx)('div', {
                className: 'h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3 skeleton',
              }),
              (0, r.jsx)('div', {
                className: 'h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 skeleton',
              }),
            ],
          }),
        });
      }
    },
    14258: function (e, t, a) {
      'use strict';
      function r(e, t) {
        return 'en' === t && e.labelEn ? e.labelEn : e.label;
      }
      function s(e, t) {
        return 'en' === t && e.unitEn ? e.unitEn : e.unit;
      }
      function d(e, t) {
        return 'en' === t && e.descriptionEn ? e.descriptionEn : e.description;
      }
      a.d(t, {
        Jt: function () {
          return s;
        },
        Xr: function () {
          return r;
        },
        dE: function () {
          return d;
        },
      });
    },
  },
  function (e) {
    (e.O(0, [6317, 5020, 2174, 2971, 2117, 1744], function () {
      return e((e.s = 13508));
    }),
      (_N_E = e.O()));
  },
]);
