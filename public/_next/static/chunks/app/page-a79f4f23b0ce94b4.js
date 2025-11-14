(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [1931],
  {
    40488: function (e, t, a) {
      Promise.resolve().then(a.bind(a, 42961));
    },
    42961: function (e, t, a) {
      'use strict';
      (a.r(t),
        a.d(t, {
          default: function () {
            return A;
          },
        }));
      var r = a(57437),
        i = a(2265),
        n = a(34479),
        o = a(8608),
        s = a(71598),
        l = a(98661),
        d = a(24979),
        c = a(58151),
        u = a(14258),
        m = a(78466),
        g = a(88270);
      let y = (0, i.memo)(function () {
        let { t: e, lang: t } = (0, l.Q)(),
          { settings: a, hydrated: y } = (0, c.rV)(),
          { hydrated: h } = (0, d.G$)(),
          b = (null == a ? void 0 : a.dailyTarget) && a.dailyTarget > 0 ? a.dailyTarget : 1e4,
          x = (0, d.bA)(b),
          f = (0, i.useMemo)(() => new Intl.NumberFormat('tr' === t ? 'tr-TR' : 'en-US'), [t]),
          k = 'tr' === t ? o.tr : s._,
          v = (0, m.d)(),
          [p, D] = (0, i.useState)('breakdown'),
          [w, j] = (0, i.useState)(!0),
          [N, C] = (0, i.useState)(!0),
          [A, z] = (0, i.useState)(!0),
          F = (t, a, i, n) => {
            if (!v)
              return (0, r.jsxs)('button', {
                type: 'button',
                className:
                  'flex w-full items-center justify-between text-sm font-bold text-gray-900 dark:text-white mb-3 transition-all duration-200 hover:text-brand',
                onClick: () => n(!i),
                'aria-expanded': i,
                'aria-controls': 'stats-section-'.concat(t),
                children: [
                  (0, r.jsx)('span', { className: 'font-bold', children: a }),
                  (0, r.jsx)('span', {
                    className:
                      'ml-2 text-lg font-bold transition-transform duration-300 ease-in-out text-brand dark:text-brand-light',
                    'aria-hidden': !0,
                    style: { transform: i ? 'rotate(0deg)' : 'rotate(-90deg)' },
                    children: '▼',
                  }),
                ],
              });
            let o = p === t;
            return (0, r.jsxs)('button', {
              type: 'button',
              className:
                'flex w-full items-center justify-between text-sm text-gray-800 dark:text-gray-200 font-semibold mb-3 transition-all duration-200 hover:text-gray-950 dark:hover:text-white',
              onClick: () => D(t),
              'aria-expanded': o,
              'aria-controls': 'stats-section-'.concat(t),
              'aria-label': e('stats.sectionToggle', { section: a }),
              children: [
                (0, r.jsx)('span', { children: a }),
                (0, r.jsx)('span', {
                  className:
                    'ml-2 text-lg font-bold transition-transform duration-300 ease-in-out text-brand dark:text-brand-light',
                  'aria-hidden': !0,
                  style: { transform: o ? 'rotate(0deg)' : 'rotate(-90deg)' },
                  children: '▼',
                }),
              ],
            });
          },
          S =
            x.targetPoints > 0
              ? Math.min(100, Math.round((x.todayPoints / x.targetPoints) * 100))
              : 0,
          E = x.todayPoints >= x.targetPoints,
          [M, T] = (0, i.useState)(!1),
          [P, B] = (0, i.useState)(!1),
          [I, H] = (0, i.useState)(!1),
          K = (0, i.useRef)(!1);
        return (
          (0, i.useEffect)(() => {
            if (E && !M) {
              (T(!0),
                B(!0),
                H(!0),
                !K.current &&
                  g.BF.canNotify() &&
                  (g.BF.showGoalCompletion(t, x.todayPoints), (K.current = !0)));
              let e = setTimeout(() => B(!1), 3e3),
                a = setTimeout(() => H(!1), 1e4);
              return () => {
                (clearTimeout(e), clearTimeout(a));
              };
            }
            E || (T(!1), H(!1), (K.current = !1));
          }, [E, M, x.todayPoints, t]),
          (0, r.jsxs)('div', {
            className: 'spacing-lg',
            children: [
              P &&
                (0, r.jsx)(r.Fragment, {
                  children: Array.from({ length: 30 }).map((e, t) =>
                    (0, r.jsx)(
                      'div',
                      {
                        className: 'confetti',
                        style: {
                          left: ''.concat(100 * Math.random(), '%'),
                          animationDelay: ''.concat(0.5 * Math.random(), 's'),
                          background: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'][
                            Math.floor(5 * Math.random())
                          ],
                          width: ''.concat(8 * Math.random() + 6, 'px'),
                          height: ''.concat(8 * Math.random() + 6, 'px'),
                          borderRadius: Math.random() > 0.5 ? '50%' : '0',
                        },
                      },
                      t
                    )
                  ),
                }),
              (0, r.jsxs)('div', {
                className:
                  'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300',
                children: [
                  (0, r.jsxs)('button', {
                    type: 'button',
                    className:
                      'flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-200 hover:text-brand',
                    onClick: () => j(!w),
                    'aria-expanded': w,
                    'aria-controls': 'stats-overview',
                    children: [
                      (0, r.jsx)('span', {
                        className: 'font-bold',
                        children: e('stats.overview') || 'Overview',
                      }),
                      (0, r.jsx)('span', {
                        className:
                          'ml-2 text-lg font-bold transition-transform duration-300 ease-in-out text-brand dark:text-brand-light',
                        'aria-hidden': !0,
                        style: { transform: w ? 'rotate(0deg)' : 'rotate(-90deg)' },
                        children: '▼',
                      }),
                    ],
                  }),
                  w &&
                    (0, r.jsxs)('div', {
                      id: 'stats-overview',
                      className: 'grid '
                        .concat(v ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3', ' ')
                        .concat(v ? 'gap-2.5' : 'gap-4'),
                      children: [
                        (0, r.jsxs)('div', {
                          className: 'stagger-item card-entrance '
                            .concat(
                              v ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                              ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                            )
                            .concat(
                              v ? 'p-3 space-y-1.5' : 'p-4 space-y-2',
                              ' shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover tilt-3d gpu-accelerated '
                            )
                            .concat(
                              I
                                ? 'goal-completed border-emerald-500 dark:border-emerald-400/50 ring-2 ring-emerald-500/20 dark:ring-emerald-400/20 pulse-glow-mobile'
                                : ''
                            ),
                          children: [
                            (0, r.jsx)('div', {
                              className: ''.concat(
                                v ? 'text-xs' : 'text-sm',
                                ' font-semibold text-gray-800 dark:text-gray-200'
                              ),
                              children: e('stats.todayPoints'),
                            }),
                            (0, r.jsx)('div', {
                              className: ''
                                .concat(
                                  v ? 'text-xl' : 'text-3xl',
                                  ' font-bold text-brand dark:text-brand-light transition-all duration-300 '
                                )
                                .concat(
                                  I
                                    ? 'points-value text-emerald-600 dark:text-emerald-400 number-count-mobile'
                                    : '',
                                  ' '
                                )
                                .concat(v ? 'number-count-mobile' : ''),
                              children: f.format(x.todayPoints),
                            }),
                            (0, r.jsxs)('div', {
                              className: ''.concat(
                                v ? 'text-xs' : 'text-sm',
                                ' text-gray-700 dark:text-gray-300 font-medium'
                              ),
                              children: [
                                e('stats.target'),
                                ': ',
                                f.format(x.targetPoints),
                                E &&
                                  (0, r.jsxs)('span', {
                                    className:
                                      'ml-1 text-green-600 dark:text-green-400 font-semibold',
                                    children: ['✓ ', e('stats.goalCompleted')],
                                  }),
                              ],
                            }),
                            (0, r.jsxs)('div', {
                              className: ''.concat(
                                v ? 'h-2.5' : 'h-2',
                                ' bg-gray-200 dark:bg-gray-800 rounded overflow-hidden relative'
                              ),
                              role: 'progressbar',
                              'aria-valuenow': S,
                              'aria-valuemin': 0,
                              'aria-valuemax': 100,
                              'aria-label': e('stats.progressLabel', {
                                current: x.todayPoints,
                                target: x.targetPoints,
                              }),
                              children: [
                                (0, r.jsx)('div', {
                                  className:
                                    'h-full rounded transition-all duration-500 ease-out animate-progress '
                                      .concat(v ? 'progress-fill-mobile' : '', ' ')
                                      .concat(
                                        I
                                          ? 'progress-bar'
                                          : 'bg-gradient-to-r from-brand to-brand-dark'
                                      ),
                                  style: { width: ''.concat(S, '%') },
                                }),
                                I &&
                                  (0, r.jsx)('div', {
                                    className:
                                      'absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-success',
                                  }),
                              ],
                            }),
                          ],
                        }),
                        (0, r.jsxs)('div', {
                          className: 'stagger-item card-entrance '
                            .concat(
                              v ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                              ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                            )
                            .concat(
                              v ? 'p-3 space-y-1.5' : 'p-4 space-y-2',
                              ' shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover tilt-3d gpu-accelerated'
                            ),
                          children: [
                            (0, r.jsx)('div', {
                              className: ''.concat(
                                v ? 'text-xs' : 'text-sm',
                                ' font-semibold text-gray-800 dark:text-gray-200'
                              ),
                              children: e('stats.totalPoints'),
                            }),
                            (0, r.jsx)('div', {
                              className: ''
                                .concat(
                                  v ? 'text-xl' : 'text-3xl',
                                  ' font-bold transition-all duration-300 text-gray-950 dark:text-gray-100 '
                                )
                                .concat(v ? 'number-count-mobile' : ''),
                              children: f.format(x.totalPoints),
                            }),
                            (0, r.jsx)('div', {
                              className: ''.concat(
                                v ? 'text-xs' : 'text-sm',
                                ' text-gray-700 dark:text-gray-300 font-semibold'
                              ),
                              children: e('stats.totalActivities', { count: x.totalActivities }),
                            }),
                          ],
                        }),
                        (0, r.jsxs)('div', {
                          className: 'stagger-item card-entrance '
                            .concat(
                              v ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                              ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                            )
                            .concat(
                              v ? 'p-3 space-y-1.5' : 'p-4 space-y-2',
                              ' shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover tilt-3d gpu-accelerated'
                            ),
                          children: [
                            (0, r.jsx)('div', {
                              className: ''.concat(
                                v ? 'text-xs' : 'text-sm',
                                ' font-semibold text-gray-800 dark:text-gray-200'
                              ),
                              children: e('stats.streak'),
                            }),
                            (0, r.jsx)('div', {
                              className: ''
                                .concat(
                                  v ? 'text-xl' : 'text-3xl',
                                  ' font-bold text-brand dark:text-brand-light transition-all duration-300 '
                                )
                                .concat(v ? 'number-count-mobile' : ''),
                              children: x.streakDays,
                            }),
                            (0, r.jsx)('div', {
                              className: ''.concat(
                                v ? 'text-xs' : 'text-sm',
                                ' text-gray-700 dark:text-gray-300 font-semibold'
                              ),
                              children: e('stats.streakDesc'),
                            }),
                          ],
                        }),
                        (0, r.jsxs)('div', {
                          className: 'stagger-item card-entrance '
                            .concat(
                              v ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                              ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                            )
                            .concat(
                              v ? 'p-3 space-y-1.5' : 'p-4 space-y-2',
                              ' shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover tilt-3d gpu-accelerated'
                            ),
                          children: [
                            (0, r.jsx)('div', {
                              className: ''.concat(
                                v ? 'text-xs' : 'text-sm',
                                ' font-semibold text-gray-800 dark:text-gray-200'
                              ),
                              children: e('stats.averageDaily'),
                            }),
                            (0, r.jsx)('div', {
                              className: ''
                                .concat(
                                  v ? 'text-xl' : 'text-3xl',
                                  ' font-bold transition-all duration-300 text-gray-950 dark:text-gray-100 '
                                )
                                .concat(v ? 'number-count-mobile' : ''),
                              children: f.format(
                                Math.round(x.totalPoints / Math.max(1, x.totalActivities))
                              ),
                            }),
                            (0, r.jsx)('div', {
                              className: ''.concat(
                                v ? 'text-xs' : 'text-sm',
                                ' text-gray-700 dark:text-gray-300 font-semibold'
                              ),
                              children: e('stats.perActivity'),
                            }),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
              (0, r.jsxs)('div', {
                className: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
                children: [
                  (0, r.jsxs)('div', {
                    className:
                      'card-entrance slide-in-left rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated',
                    children: [
                      F('breakdown', e('stats.breakdownToday'), N, C),
                      (v ? 'breakdown' === p : N) &&
                        (0, r.jsx)('div', {
                          id: 'stats-section-breakdown',
                          children:
                            0 === x.breakdownToday.length
                              ? (0, r.jsx)('div', {
                                  className: 'text-sm text-gray-700 dark:text-gray-300',
                                  children: e('stats.noActivityToday'),
                                })
                              : (0, r.jsx)('ul', {
                                  className: 'space-y-2',
                                  children: x.breakdownToday.map((a) =>
                                    (0, r.jsxs)(
                                      'li',
                                      {
                                        className:
                                          'flex items-center justify-between gap-3 border-2 rounded-lg px-3 py-2.5 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:shadow-md ',
                                        children: [
                                          (0, r.jsxs)('div', {
                                            className: 'flex items-center gap-3',
                                            children: [
                                              (0, r.jsx)('div', {
                                                className: 'text-xl',
                                                children: a.icon,
                                              }),
                                              (0, r.jsxs)('div', {
                                                children: [
                                                  (0, r.jsx)('div', {
                                                    className:
                                                      'text-sm font-bold text-gray-950 dark:text-gray-100',
                                                    children: (0, u.Xr)(a, t),
                                                  }),
                                                  (0, r.jsxs)('div', {
                                                    className:
                                                      'text-xs font-semibold text-gray-700 dark:text-gray-300',
                                                    children: [a.amount, ' ', (0, u.Jt)(a, t)],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, r.jsxs)('div', {
                                            className:
                                              'text-sm font-bold text-brand dark:text-brand-light',
                                            children: [
                                              '+',
                                              f.format(a.points),
                                              ' ',
                                              e('list.pointsUnit'),
                                            ],
                                          }),
                                        ],
                                      },
                                      a.key
                                    )
                                  ),
                                }),
                        }),
                    ],
                  }),
                  (0, r.jsxs)('div', {
                    className:
                      'rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300 hover-lift transition-smooth',
                    children: [
                      F('lastSeven', e('stats.lastSeven'), A, z),
                      (v ? 'lastSeven' === p : A) &&
                        (0, r.jsx)('div', {
                          id: 'stats-section-lastSeven',
                          children:
                            0 === x.lastSevenDays.length
                              ? (0, r.jsx)('div', {
                                  className: 'text-sm text-gray-700 dark:text-gray-300',
                                  children: e('stats.noData'),
                                })
                              : (0, r.jsx)('ul', {
                                  className: 'space-y-2',
                                  children: x.lastSevenDays.map((e) =>
                                    (0, r.jsxs)(
                                      'li',
                                      {
                                        className:
                                          'flex items-center justify-between gap-3 border-2 rounded-lg px-3 py-2.5 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:shadow-md ',
                                        children: [
                                          (0, r.jsx)('div', {
                                            className:
                                              'text-sm font-bold text-gray-950 dark:text-gray-100',
                                            children: (0, n.WU)(new Date(e.date), 'd MMMM EEEE', {
                                              locale: k,
                                            }),
                                          }),
                                          (0, r.jsxs)('div', {
                                            className:
                                              'text-sm font-bold text-gray-950 dark:text-gray-100',
                                            children: [
                                              f.format(e.points),
                                              ' /',
                                              ' ',
                                              f.format(x.targetPoints),
                                            ],
                                          }),
                                        ],
                                      },
                                      e.date
                                    )
                                  ),
                                }),
                        }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      });
      var h = a(27648),
        b = a(60186);
      let x = (0, i.memo)(function () {
        let { activities: e, hydrated: t } = (0, d.G$)(),
          { t: a, lang: g } = (0, l.Q)(),
          { settings: y } = (0, c.rV)(),
          x = (null == y ? void 0 : y.dailyTarget) && y.dailyTarget > 0 ? y.dailyTarget : b.Dy,
          f = (0, d.bA)(x),
          k = 'tr' === g ? o.tr : s._,
          v = (0, i.useMemo)(() => new Intl.NumberFormat('tr' === g ? 'tr-TR' : 'en-US'), [g]),
          p = (0, m.d)(),
          D = (0, i.useMemo)(() => {
            if (0 === e.length) return null;
            let t = new Map();
            for (let r of e) {
              var a;
              let e = new Date(r.performedAt).toISOString().slice(0, 10),
                i = null !== (a = t.get(e)) && void 0 !== a ? a : { points: 0 };
              ((i.points += r.points), t.set(e, i));
            }
            let r = null;
            return (
              t.forEach((e, t) => {
                (!r || e.points > r.points) && (r = { date: t, points: e.points });
              }),
              r
            );
          }, [e]),
          w = (0, i.useMemo)(() => {
            if (0 === e.length) return null;
            let t = new Map();
            for (let r of e) {
              var a;
              let e =
                null !== (a = t.get(r.activityKey)) && void 0 !== a
                  ? a
                  : { label: (0, u.Xr)(r, g), icon: r.icon, points: 0, count: 0 };
              ((e.points += r.points), (e.count += 1), t.set(r.activityKey, e));
            }
            let r = null;
            return (
              t.forEach((e) => {
                (!r || e.points > r.points) && (r = e);
              }),
              r
            );
          }, [e, g]),
          j = (0, i.useMemo)(() => {
            if (0 === e.length) return 0;
            let t = new Map();
            for (let r of e) {
              var a;
              let e = new Date(r.performedAt).toISOString().slice(0, 10);
              t.set(e, (null !== (a = t.get(e)) && void 0 !== a ? a : 0) + r.points);
            }
            let r = Array.from(t.values()).reduce((e, t) => e + t, 0);
            return t.size > 0 ? Math.round(r / t.size) : 0;
          }, [e]),
          N = (0, i.useMemo)(() => {
            let t = new Set();
            for (let a of e) t.add(new Date(a.performedAt).toISOString().slice(0, 10));
            return t.size;
          }, [e]);
        return (0, r.jsxs)('section', {
          className: 'mt-8 spacing-md',
          children: [
            (0, r.jsx)('h2', {
              className:
                'text-heading-3 uppercase tracking-wide text-gray-900 dark:text-gray-100 '.concat(
                  p ? 'text-sm' : ''
                ),
              children: a('stats.highlightsTitle'),
            }),
            (0, r.jsxs)('div', {
              className: 'grid '
                .concat(p ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', ' ')
                .concat(p ? 'gap-2.5' : 'spacing-md'),
              children: [
                (0, r.jsxs)('div', {
                  className: 'stagger-item stats-highlight-card card-entrance '
                    .concat(
                      p ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                      ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                    )
                    .concat(
                      p ? 'p-3' : 'p-4',
                      ' shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated'
                    ),
                  children: [
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        p ? 'text-xs' : 'text-sm',
                        ' font-semibold text-gray-800 dark:text-gray-200'
                      ),
                      children: a('stats.highlight.bestDay'),
                    }),
                    D
                      ? (0, r.jsxs)(r.Fragment, {
                          children: [
                            (0, r.jsx)('div', {
                              className: ''
                                .concat(
                                  p ? 'text-base' : 'text-lg',
                                  ' font-bold text-gray-950 dark:text-gray-100 '
                                )
                                .concat(p ? 'number-count-mobile' : 'number-transition'),
                              children: (0, n.WU)(new Date(D.date), 'd MMMM yyyy, EEEE', {
                                locale: k,
                              }),
                            }),
                            (0, r.jsxs)('div', {
                              className: ''
                                .concat(
                                  p ? 'text-xs' : 'text-sm',
                                  ' text-gray-700 dark:text-gray-300 font-semibold '
                                )
                                .concat(p ? 'number-count-mobile' : 'number-count'),
                              children: [v.format(D.points), ' ', a('list.pointsUnit')],
                            }),
                          ],
                        })
                      : (0, r.jsx)('div', {
                          className: ''.concat(
                            p ? 'text-xs' : 'text-sm',
                            ' text-gray-700 dark:text-gray-200 font-medium'
                          ),
                          children: a('stats.highlight.bestDayFallback'),
                        }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className: 'stagger-item stats-highlight-card card-entrance '
                    .concat(
                      p ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                      ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                    )
                    .concat(
                      p ? 'p-3' : 'p-4',
                      ' shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated'
                    ),
                  children: [
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        p ? 'text-xs' : 'text-sm',
                        ' font-semibold text-gray-800 dark:text-gray-200'
                      ),
                      children: a('stats.highlight.bestActivity'),
                    }),
                    w
                      ? (0, r.jsxs)(r.Fragment, {
                          children: [
                            (0, r.jsxs)('div', {
                              className: ''.concat(
                                p ? 'text-base' : 'text-lg',
                                ' font-bold flex items-center gap-2 text-gray-950 dark:text-gray-100'
                              ),
                              children: [
                                (0, r.jsx)('span', {
                                  className: p ? 'emoji-celebrate' : 'emoji-bounce',
                                  children: w.icon,
                                }),
                                (0, r.jsx)('span', {
                                  className: p ? 'number-count-mobile' : 'number-transition',
                                  children: w.label,
                                }),
                              ],
                            }),
                            (0, r.jsxs)('div', {
                              className: ''
                                .concat(
                                  p ? 'text-xs' : 'text-sm',
                                  ' text-gray-700 dark:text-gray-300 font-semibold '
                                )
                                .concat(p ? 'number-count-mobile' : 'number-count'),
                              children: [
                                v.format(w.points),
                                ' ',
                                a('list.pointsUnit'),
                                ' •',
                                ' ',
                                w.count,
                                ' ',
                                a('stats.highlight.sessions'),
                              ],
                            }),
                          ],
                        })
                      : (0, r.jsx)('div', {
                          className: ''.concat(
                            p ? 'text-xs' : 'text-sm',
                            ' text-gray-700 dark:text-gray-200 font-medium'
                          ),
                          children: a('stats.highlight.bestActivityFallback'),
                        }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className: 'stagger-item stats-highlight-card card-entrance '
                    .concat(
                      p ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                      ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                    )
                    .concat(
                      p ? 'p-3' : 'p-4',
                      ' shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated'
                    ),
                  children: [
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        p ? 'text-xs' : 'text-sm',
                        ' font-semibold text-gray-800 dark:text-gray-200'
                      ),
                      children: a('stats.highlight.currentStreak'),
                    }),
                    (0, r.jsx)('div', {
                      className: ''
                        .concat(
                          p ? 'text-base' : 'text-lg',
                          ' font-bold text-gray-950 dark:text-gray-100 '
                        )
                        .concat(p ? 'number-count-mobile' : 'number-transition'),
                      children: f.streakDays,
                    }),
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        p ? 'text-xs' : 'text-sm',
                        ' text-gray-700 dark:text-gray-300 font-semibold'
                      ),
                      children: a('stats.highlight.totalActivities', { count: f.totalActivities }),
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className: 'stagger-item stats-highlight-card card-entrance '
                    .concat(
                      p ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                      ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                    )
                    .concat(
                      p ? 'p-3' : 'p-4',
                      ' shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated'
                    ),
                  children: [
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        p ? 'text-xs' : 'text-sm',
                        ' font-semibold text-gray-800 dark:text-gray-200'
                      ),
                      children: a('stats.highlight.averageDaily'),
                    }),
                    (0, r.jsxs)('div', {
                      className: ''
                        .concat(
                          p ? 'text-base' : 'text-lg',
                          ' font-bold text-gray-950 dark:text-gray-100 '
                        )
                        .concat(p ? 'number-count-mobile' : 'number-transition'),
                      children: [v.format(j), ' ', a('list.pointsUnit')],
                    }),
                    (0, r.jsx)('div', {
                      className: ''
                        .concat(
                          p ? 'text-xs' : 'text-sm',
                          ' text-gray-700 dark:text-gray-300 font-semibold '
                        )
                        .concat(p ? 'number-count-mobile' : 'number-count'),
                      children: a('stats.highlight.totalDays', { count: N }),
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className: 'stagger-item stats-highlight-card card-entrance '
                    .concat(
                      p ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                      ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                    )
                    .concat(
                      p ? 'p-3' : 'p-4',
                      ' shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated'
                    ),
                  children: [
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        p ? 'text-xs' : 'text-sm',
                        ' font-semibold text-gray-800 dark:text-gray-200'
                      ),
                      children: a('stats.highlight.totalPoints'),
                    }),
                    (0, r.jsxs)('div', {
                      className: ''
                        .concat(
                          p ? 'text-base' : 'text-lg',
                          ' font-bold text-gray-950 dark:text-gray-100 '
                        )
                        .concat(p ? 'number-count-mobile' : 'number-transition'),
                      children: [v.format(f.totalPoints), ' ', a('list.pointsUnit')],
                    }),
                    (0, r.jsx)('div', {
                      className: ''
                        .concat(
                          p ? 'text-xs' : 'text-sm',
                          ' text-gray-700 dark:text-gray-300 font-semibold '
                        )
                        .concat(p ? 'number-count-mobile' : 'number-count'),
                      children: a('stats.highlight.totalActivities', { count: f.totalActivities }),
                    }),
                  ],
                }),
                (0, r.jsxs)('div', {
                  className: 'stagger-item stats-highlight-card card-entrance '
                    .concat(
                      p ? 'mobile-card-lift touch-feedback bounce-in-mobile' : '',
                      ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '
                    )
                    .concat(
                      p ? 'p-3' : 'p-4',
                      ' shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated'
                    ),
                  children: [
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        p ? 'text-xs' : 'text-sm',
                        ' font-semibold text-gray-800 dark:text-gray-200'
                      ),
                      children: a('stats.highlight.todayProgress'),
                    }),
                    (0, r.jsxs)('div', {
                      className: ''
                        .concat(
                          p ? 'text-base' : 'text-lg',
                          ' font-bold text-gray-950 dark:text-gray-100 '
                        )
                        .concat(p ? 'number-count-mobile' : 'number-transition'),
                      children: [v.format(f.todayPoints), ' /', ' ', v.format(f.targetPoints)],
                    }),
                    (0, r.jsxs)('div', {
                      className: ''
                        .concat(
                          p ? 'text-xs' : 'text-sm',
                          ' text-gray-700 dark:text-gray-300 font-semibold '
                        )
                        .concat(p ? 'number-count-mobile' : 'number-count'),
                      children: [
                        Math.round((f.todayPoints / f.targetPoints) * 100),
                        '%',
                        ' ',
                        a('stats.highlight.complete'),
                      ],
                    }),
                  ],
                }),
                (0, r.jsxs)(h.default, {
                  href: '/stats',
                  className:
                    'stagger-item card-entrance slide-in-right magnetic-hover hover-scale-glow rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-brand/10 via-brand/8 to-brand/5 dark:from-brand/20 dark:via-brand/15 dark:to-brand/10 '.concat(
                      p ? 'p-3' : 'p-4',
                      ' shadow-lg group  gpu-accelerated'
                    ),
                  children: [
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        'text-xs',
                        ' text-gray-700 dark:text-gray-200 font-medium mb-1'
                      ),
                      children: a('stats.detailed.title'),
                    }),
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        p ? 'text-sm' : 'text-lg',
                        ' font-bold text-gray-900 dark:text-white group-hover:text-brand transition-colors'
                      ),
                      children: a('stats.detailed.subtitle'),
                    }),
                    (0, r.jsxs)('div', {
                      className: ''.concat(
                        p ? 'text-[10px]' : 'text-xs',
                        ' text-gray-700 dark:text-gray-200 font-medium mt-2'
                      ),
                      children: ['→ ', a('nav.stats')],
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      });
      var f = a(10480),
        k = a(60923);
      let v = (0, i.memo)(function () {
          let { t: e, lang: t } = (0, l.Q)(),
            { addActivity: a } = (0, d.G$)(),
            { showToast: n } = (0, f.P)(),
            o = (0, m.d)(),
            s = (0, c.YG)(),
            [g, y] = (0, i.useState)(null),
            [h, b] = (0, i.useState)(null),
            { activities: x } = (0, d.G$)(),
            v = (0, i.useMemo)(() => {
              let e = new Map();
              return (x.forEach((t) => {
                let a = e.get(t.activityKey);
                if (a) a.count++;
                else {
                  let a = s.find((e) => e.key === t.activityKey);
                  a && e.set(t.activityKey, { definition: a, count: 1 });
                }
              }),
              0 === e.size)
                ? s.slice(0, 6).map((e) => ({ definition: e, count: 0 }))
                : Array.from(e.values())
                    .sort((e, t) => t.count - e.count)
                    .slice(0, 6);
            }, [s, x]),
            p = (0, i.useCallback)((e) => {
              b(e);
            }, []),
            D = (0, i.useCallback)(async () => {
              if (h && !g) {
                y(h.key);
                try {
                  (a({
                    definition: h,
                    amount: h.defaultAmount,
                    performedAt: new Date().toISOString(),
                  }),
                    n(
                      ''
                        .concat(h.icon, ' ')
                        .concat((0, u.Xr)(h, t), ' ')
                        .concat(e('quickAdd.added')),
                      'success'
                    ),
                    b(null));
                } catch (t) {
                  (console.error('Failed to add activity:', t), n(e('quickAdd.failed'), 'error'));
                } finally {
                  y(null);
                }
              }
            }, [h, g, a, n, e, t]),
            w = (0, i.useCallback)(() => {
              b(null);
            }, []);
          return 0 === v.length
            ? null
            : (0, r.jsxs)('div', {
                className: 'space-y-3',
                children: [
                  (0, r.jsxs)('div', {
                    className: 'flex items-center justify-between',
                    children: [
                      (0, r.jsx)('h3', {
                        className: ''.concat(
                          o ? 'text-lg' : 'text-xl',
                          ' font-bold text-gray-950 dark:text-white'
                        ),
                        children: e('quickAdd.title'),
                      }),
                      (0, r.jsx)('span', {
                        className: ''.concat(
                          o ? 'text-xs' : 'text-sm',
                          ' text-gray-700 dark:text-gray-200 font-semibold'
                        ),
                        children: e('quickAdd.subtitle'),
                      }),
                    ],
                  }),
                  (0, r.jsx)('div', {
                    className: 'grid '.concat(
                      o ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6',
                      ' gap-3 sm:gap-4'
                    ),
                    children: v.map((a) => {
                      let { definition: i } = a,
                        n = g === i.key;
                      return (0, r.jsxs)(
                        'button',
                        {
                          type: 'button',
                          onClick: () => p(i),
                          disabled: n,
                          className:
                            '\n                stagger-item touch-feedback mobile-press mobile-card-lift fade-in-scale-mobile\n                relative flex flex-col items-center justify-center gap-2\n                p-4 sm:p-5 rounded-xl border-2\n                transition-all duration-300\n                min-h-[90px] sm:min-h-[110px] min-w-[90px] sm:min-w-[110px]\n                gpu-accelerated\n                '.concat(
                              n
                                ? 'border-brand dark:border-brand/60 bg-gradient-to-br from-brand/20 to-brand/10 dark:from-brand/25 dark:to-brand/15 cursor-wait shadow-lg shadow-brand/20 dark:shadow-brand/30 pulse-glow-mobile'
                                : 'border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 hover:border-brand dark:hover:border-brand/60 hover:bg-gradient-to-br hover:from-brand/5 hover:via-brand/3 hover:to-brand/5 dark:hover:from-brand/10 dark:hover:via-brand/8 dark:hover:to-brand/10 hover:shadow-xl hover:shadow-brand/20 dark:hover:shadow-brand/30 scale-on-interact',
                              '\n                disabled:opacity-50 disabled:cursor-not-allowed group\n              '
                            ),
                          'aria-label': e('quickAdd.addActivityLabel', {
                            activity: (0, u.Xr)(i, t),
                          }),
                          'aria-busy': n,
                          'aria-disabled': n,
                          onKeyDown: (e) => {
                            ('Enter' !== e.key && ' ' !== e.key) || (e.preventDefault(), n || p(i));
                          },
                          children: [
                            (0, r.jsx)('div', {
                              className:
                                'text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform duration-300 '.concat(
                                  n ? 'icon-wiggle-mobile' : ''
                                ),
                              children: i.icon,
                            }),
                            (0, r.jsx)('div', {
                              className:
                                'text-xs sm:text-sm font-bold text-center text-gray-950 dark:text-gray-100 line-clamp-2 group-hover:text-brand transition-colors',
                              children: (0, u.Xr)(i, t),
                            }),
                            (0, r.jsxs)('div', {
                              className:
                                'text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold',
                              children: [i.defaultAmount, ' ', (0, u.Jt)(i, t)],
                            }),
                            n &&
                              (0, r.jsx)('div', {
                                className:
                                  'absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-xl ',
                                children: (0, r.jsx)('div', {
                                  className:
                                    'animate-spin rounded-full h-8 w-8 border-3 border-brand border-t-transparent',
                                }),
                              }),
                          ],
                        },
                        i.key
                      );
                    }),
                  }),
                  (0, r.jsx)(k.Q, {
                    open: !!h,
                    title: e('quickAdd.confirmTitle'),
                    message: h
                      ? e('quickAdd.confirmMessage', {
                          activity: (0, u.Xr)(h, t),
                          amount: String(h.defaultAmount),
                          unit: (0, u.Jt)(h, t),
                          points: String(h.defaultAmount * h.multiplier),
                        })
                      : '',
                    variant: 'default',
                    confirmLabel: e('quickAdd.confirmAdd'),
                    cancelLabel: e('form.cancel'),
                    onConfirm: D,
                    onCancel: w,
                  }),
                ],
              });
        }),
        p = [
          {
            id: 'morning-walk',
            name: { tr: 'Sabah Y\xfcr\xfcy\xfcş\xfc', en: 'Morning Walk' },
            description: {
              tr: 'G\xfcne başlamak i\xe7in ideal',
              en: 'Perfect way to start the day',
            },
            icon: '\uD83C\uDF05',
            activities: [{ activityKey: 'WALKING', amount: 1 }],
            estimatedPoints: 1e3,
            category: 'cardio',
          },
          {
            id: 'quick-cardio',
            name: { tr: 'Hızlı Kardiyo', en: 'Quick Cardio' },
            description: {
              tr: 'Kısa s\xfcreli kardiyovask\xfcler antrenman',
              en: 'Short cardiovascular workout',
            },
            icon: '⚡',
            activities: [
              { activityKey: 'RUNNING', amount: 0.5 },
              { activityKey: 'WALKING', amount: 0.5 },
            ],
            estimatedPoints: 1500,
            category: 'cardio',
          },
          {
            id: 'strength-basics',
            name: { tr: 'Temel G\xfc\xe7 Antrenmanı', en: 'Basic Strength Training' },
            description: {
              tr: 'Şınav ve mekik kombinasyonu',
              en: 'Push-up and sit-up combination',
            },
            icon: '\uD83D\uDCAA',
            activities: [
              { activityKey: 'PUSH_UP', amount: 1 },
              { activityKey: 'SIT_UP', amount: 1 },
            ],
            estimatedPoints: 600,
            category: 'strength',
          },
          {
            id: 'full-body',
            name: { tr: 'Tam V\xfccut Antrenmanı', en: 'Full Body Workout' },
            description: {
              tr: 'Kapsamlı antrenman kombinasyonu',
              en: 'Comprehensive workout combination',
            },
            icon: '\uD83D\uDD25',
            activities: [
              { activityKey: 'WALKING', amount: 0.5 },
              { activityKey: 'PUSH_UP', amount: 1 },
              { activityKey: 'SIT_UP', amount: 1 },
              { activityKey: 'WEIGHT_LIFTING', amount: 0.5 },
            ],
            estimatedPoints: 2e3,
            category: 'mixed',
          },
          {
            id: 'swim-session',
            name: { tr: 'Y\xfczme Seansı', en: 'Swimming Session' },
            description: { tr: 'Y\xfczme antrenmanı', en: 'Swimming workout' },
            icon: '\uD83C\uDFCA',
            activities: [{ activityKey: 'SWIMMING', amount: 1 }],
            estimatedPoints: 100,
            category: 'cardio',
          },
          {
            id: 'stair-climbing',
            name: { tr: 'Merdiven \xc7ıkma', en: 'Stair Climbing' },
            description: { tr: 'Merdiven \xe7ıkma antrenmanı', en: 'Stair climbing workout' },
            icon: '\uD83E\uDE9C',
            activities: [{ activityKey: 'STAIRS', amount: 1 }],
            estimatedPoints: 1e3,
            category: 'cardio',
          },
          {
            id: 'quick-strength',
            name: { tr: 'Hızlı G\xfc\xe7', en: 'Quick Strength' },
            description: { tr: 'Hızlı g\xfc\xe7 antrenmanı', en: 'Quick strength workout' },
            icon: '⚡\uD83D\uDCAA',
            activities: [
              { activityKey: 'PUSH_UP', amount: 0.5 },
              { activityKey: 'SIT_UP', amount: 0.5 },
            ],
            estimatedPoints: 300,
            category: 'quick',
          },
          {
            id: 'cardio-plus',
            name: { tr: 'Kardiyo Plus', en: 'Cardio Plus' },
            description: {
              tr: 'Yoğun kardiyovask\xfcler antrenman',
              en: 'Intense cardiovascular workout',
            },
            icon: '\uD83C\uDFC3\uD83D\uDCA8',
            activities: [
              { activityKey: 'RUNNING', amount: 1 },
              { activityKey: 'WALKING', amount: 1 },
            ],
            estimatedPoints: 2500,
            category: 'cardio',
          },
          {
            id: 'weight-training',
            name: { tr: 'Ağırlık Antrenmanı', en: 'Weight Training' },
            description: { tr: 'Ağırlık \xe7alışması', en: 'Weight lifting session' },
            icon: '\uD83C\uDFCB️',
            activities: [{ activityKey: 'WEIGHT_LIFTING', amount: 1 }],
            estimatedPoints: 300,
            category: 'strength',
          },
          {
            id: 'active-day',
            name: { tr: 'Aktif G\xfcn', en: 'Active Day' },
            description: {
              tr: 'G\xfcnl\xfck aktivite kombinasyonu',
              en: 'Daily activity combination',
            },
            icon: '\uD83C\uDF1F',
            activities: [
              { activityKey: 'WALKING', amount: 2 },
              { activityKey: 'STAIRS', amount: 0.5 },
            ],
            estimatedPoints: 3e3,
            category: 'mixed',
          },
        ],
        D = (0, i.memo)(function () {
          let { t: e, lang: t } = (0, l.Q)(),
            { addActivity: a } = (0, d.G$)(),
            { showToast: n } = (0, f.P)(),
            o = (0, m.d)(),
            s = (0, c.YG)(),
            [g, y] = (0, i.useState)(null),
            [h, b] = (0, i.useState)(!1),
            x = (0, i.useCallback)((e) => {
              y(e);
            }, []),
            v = (0, i.useCallback)(async () => {
              if (g && !h) {
                b(!0);
                try {
                  let r = new Date().toISOString();
                  for (let i of g.activities) {
                    let n = s.find((e) => e.key === i.activityKey);
                    if (!n) continue;
                    let o = Math.round(n.defaultAmount * i.amount);
                    a({
                      definition: n,
                      amount: o,
                      performedAt: r,
                      note: ''.concat(g.name[t], ' (').concat(e('templates.template'), ')'),
                    });
                  }
                  (n(
                    ''.concat(g.icon, ' ').concat(g.name[t], ' ').concat(e('templates.added')),
                    'success'
                  ),
                    y(null));
                } catch (t) {
                  (console.error('Failed to add template activities:', t),
                    n(e('templates.failed'), 'error'));
                } finally {
                  b(!1);
                }
              }
            }, [g, h, s, a, n, e, t]),
            D = (0, i.useCallback)(() => {
              y(null);
            }, []),
            w = (0, i.useMemo)(() => {
              let e = new Set();
              return (p.forEach((t) => e.add(t.category)), Array.from(e));
            }, []),
            j = (0, i.useMemo)(
              () =>
                w
                  .map((e) => ({ category: e, templates: p.filter((t) => t.category === e) }))
                  .filter((e) => e.templates.length > 0),
              [w]
            );
          return (0, r.jsxs)('div', {
            className: o ? 'space-y-3' : 'space-y-4',
            children: [
              (0, r.jsxs)('div', {
                className: 'flex items-center justify-between',
                children: [
                  (0, r.jsx)('h3', {
                    className: ''.concat(
                      o ? 'text-base' : 'text-lg sm:text-xl',
                      ' font-bold text-gray-950 dark:text-white'
                    ),
                    children: e('templates.title'),
                  }),
                  (0, r.jsx)('span', {
                    className: ''.concat(
                      o ? 'text-xs' : 'text-sm',
                      ' text-gray-700 dark:text-gray-200 font-semibold'
                    ),
                    children: e('templates.subtitle'),
                  }),
                ],
              }),
              j.map((a) => {
                let { category: i, templates: n } = a;
                return (0, r.jsxs)(
                  'div',
                  {
                    className: o ? 'space-y-2' : 'space-y-3',
                    children: [
                      (0, r.jsxs)('h4', {
                        className: ''.concat(
                          o ? 'text-[9px]' : 'text-[10px] sm:text-xs',
                          ' font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2'
                        ),
                        children: [
                          (0, r.jsx)('span', {
                            className: 'inline-block w-1 '.concat(
                              o ? 'h-3' : 'h-4',
                              ' bg-brand rounded-full'
                            ),
                          }),
                          e('templates.category.'.concat(i)),
                        ],
                      }),
                      (0, r.jsx)('div', {
                        className: 'grid '
                          .concat(
                            o ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                            ' '
                          )
                          .concat(o ? 'gap-2' : 'gap-3 sm:gap-4'),
                        children: n.map((a) =>
                          (0, r.jsxs)(
                            'button',
                            {
                              type: 'button',
                              onClick: () => x(a),
                              disabled: h,
                              className: 'stagger-item template-card-enhanced '
                                .concat(
                                  o
                                    ? 'touch-feedback mobile-press mobile-card-lift fade-in-scale-mobile'
                                    : 'ripple-effect magnetic-hover tilt-3d',
                                  ' relative flex flex-col items-start '
                                )
                                .concat(
                                  o
                                    ? 'gap-2 p-2.5 rounded-lg min-h-[100px]'
                                    : 'gap-3 p-4 rounded-xl min-h-[120px]',
                                  ' border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 hover:border-brand dark:hover:border-brand/60 hover:bg-gradient-to-br hover:from-brand/5 hover:via-brand/3 hover:to-brand/5 dark:hover:from-brand/10 dark:hover:via-brand/8 dark:hover:to-brand/10 hover:shadow-xl hover:shadow-brand/20 dark:hover:shadow-brand/30 transition-all duration-300 scale-on-interact disabled:opacity-50 disabled:cursor-not-allowed group gpu-accelerated'
                                ),
                              'aria-label': e('templates.selectTemplate', { template: a.name[t] }),
                              'aria-busy': h,
                              'aria-disabled': h,
                              onKeyDown: (e) => {
                                ('Enter' !== e.key && ' ' !== e.key) ||
                                  (e.preventDefault(), h || x(a));
                              },
                              children: [
                                (0, r.jsxs)('div', {
                                  className: 'flex items-start '.concat(
                                    o ? 'gap-2' : 'gap-3',
                                    ' w-full'
                                  ),
                                  children: [
                                    (0, r.jsx)('div', {
                                      className: ''.concat(
                                        o ? 'text-2xl' : 'text-3xl sm:text-4xl',
                                        ' transform group-hover:scale-110 transition-transform duration-300'
                                      ),
                                      children: a.icon,
                                    }),
                                    (0, r.jsxs)('div', {
                                      className: 'flex-1 text-left min-w-0',
                                      children: [
                                        (0, r.jsx)('div', {
                                          className: ''
                                            .concat(
                                              o ? 'text-sm' : 'text-base',
                                              ' font-bold text-gray-950 dark:text-white '
                                            )
                                            .concat(
                                              o ? 'mb-0.5' : 'mb-1',
                                              ' group-hover:text-brand transition-colors'
                                            ),
                                          children: a.name[t],
                                        }),
                                        (0, r.jsx)('div', {
                                          className: ''
                                            .concat(
                                              o ? 'text-xs' : 'text-sm',
                                              ' text-gray-700 dark:text-gray-300 font-semibold '
                                            )
                                            .concat(o ? 'leading-tight' : 'leading-relaxed'),
                                          children: a.description[t],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, r.jsxs)('div', {
                                  className: 'flex items-center '
                                    .concat(o ? 'gap-2' : 'gap-3', ' w-full ')
                                    .concat(
                                      o ? 'pt-1.5' : 'pt-2',
                                      ' border-t border-gray-300 dark:border-gray-600'
                                    ),
                                  children: [
                                    (0, r.jsxs)('div', {
                                      className: 'flex items-center '
                                        .concat(o ? 'gap-1' : 'gap-1.5', ' ')
                                        .concat(
                                          o ? 'text-xs' : 'text-sm',
                                          ' text-gray-700 dark:text-gray-200 font-semibold'
                                        ),
                                      children: [
                                        (0, r.jsx)('span', {
                                          className: 'font-bold',
                                          children: a.activities.length,
                                        }),
                                        (0, r.jsx)('span', { children: e('templates.activities') }),
                                      ],
                                    }),
                                    (0, r.jsx)('span', {
                                      className: 'text-gray-300 dark:text-gray-600',
                                      children: '•',
                                    }),
                                    (0, r.jsxs)('div', {
                                      className: 'flex items-center '
                                        .concat(o ? 'gap-1' : 'gap-1.5', ' ')
                                        .concat(o ? 'text-xs' : 'text-sm'),
                                      children: [
                                        (0, r.jsxs)('span', {
                                          className: 'font-bold text-brand',
                                          children: ['~', a.estimatedPoints],
                                        }),
                                        (0, r.jsx)('span', {
                                          className:
                                            'text-gray-600 dark:text-gray-400 font-semibold',
                                          children: e('templates.points'),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                h &&
                                  (0, r.jsx)('div', {
                                    className:
                                      'absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-xl ',
                                    children: (0, r.jsx)('div', {
                                      className:
                                        'animate-spin rounded-full h-8 w-8 border-3 border-brand border-t-transparent',
                                    }),
                                  }),
                              ],
                            },
                            a.id
                          )
                        ),
                      }),
                    ],
                  },
                  i
                );
              }),
              (0, r.jsx)(k.Q, {
                open: !!g,
                title: e('templates.confirmTitle'),
                message: g
                  ? e('templates.confirmMessage', {
                      template: g.name[t],
                      count: String(g.activities.length),
                      activities: g.activities
                        .map((e) => {
                          let a = s.find((t) => t.key === e.activityKey);
                          return a ? (0, u.Xr)(a, t) : '';
                        })
                        .filter(Boolean)
                        .join(', '),
                    })
                  : '',
                variant: 'default',
                confirmLabel: e('templates.confirmAdd'),
                cancelLabel: e('form.cancel'),
                onConfirm: v,
                onCancel: D,
              }),
            ],
          });
        }),
        w = {
          happy: {
            funny: [
              {
                tr: 'Mutluluğun zirvesindesin! Şimdi bu enerjiyi spora \xe7evir ve d\xfcnyayı fethet! \uD83C\uDF0D\uD83D\uDCAA',
                en: "You're at the peak of happiness! Now channel this energy into sports and conquer the world! \uD83C\uDF0D\uD83D\uDCAA",
                emoji: '\uD83C\uDF0D',
              },
              {
                tr: 'Mutlu musun? Harika! Şimdi mutluluğunu hareketle ta\xe7landır. Koş, zıpla, dans et! \uD83C\uDF89',
                en: 'Are you happy? Great! Now crown your happiness with movement. Run, jump, dance! \uD83C\uDF89',
                emoji: '\uD83C\uDF89',
              },
              {
                tr: 'Mutluluk hormonları salgılıyorsun, şimdi endorfinleri de ekle! Spor yap, \xe7ifte mutluluk kazan! \uD83C\uDF8A',
                en: "You're releasing happiness hormones, now add endorphins too! Exercise, get double happiness! \uD83C\uDF8A",
                emoji: '\uD83C\uDF8A',
              },
              {
                tr: 'Mutlu bir g\xfcn ge\xe7iriyorsun! Bu g\xfczel g\xfcn\xfc bir aktiviteyle ta\xe7landırmak ister misin? \uD83D\uDC51',
                en: "You're having a happy day! Would you like to crown this beautiful day with an activity? \uD83D\uDC51",
                emoji: '\uD83D\uDC51',
              },
              {
                tr: 'Mutluluk bulaşıcıdır ama spor yapmak daha bulaşıcıdır! Hadi başlayalım! \uD83E\uDDA0\uD83D\uDCAA',
                en: "Happiness is contagious but exercising is even more contagious! Let's start! \uD83E\uDDA0\uD83D\uDCAA",
                emoji: '\uD83E\uDDA0',
              },
            ],
            serious: [
              {
                tr: 'Mutluluğunuzu korumak i\xe7in d\xfczenli fiziksel aktivite \xf6nemlidir. Bug\xfcn hedefinize ulaşmak i\xe7in bir adım atın.',
                en: 'Regular physical activity is important to maintain your happiness. Take a step today to reach your goal.',
                emoji: '\uD83D\uDCCA',
              },
              {
                tr: 'Pozitif ruh hali, fiziksel aktiviteyle desteklendiğinde daha kalıcı olur. Bug\xfcnk\xfc hedefinize odaklanın.',
                en: "A positive mood becomes more lasting when supported by physical activity. Focus on today's goal.",
                emoji: '\uD83C\uDFAF',
              },
              {
                tr: 'Mutluluk ve sağlık birbirini tamamlar. Bug\xfcnk\xfc aktivitelerinizle bu dengeyi koruyun.',
                en: "Happiness and health complement each other. Maintain this balance with today's activities.",
                emoji: '⚖️',
              },
            ],
            motivational: [
              {
                tr: 'Mutlu bir ruh haliyle başladığın bu g\xfcn\xfc, hedefini tamamlayarak ta\xe7landır!',
                en: 'Crown this day you started with a happy mood by completing your goal!',
                emoji: '✨',
              },
              {
                tr: 'Mutluluğun enerjisini kullanarak bug\xfcnk\xfc hedefine ulaş!',
                en: "Reach today's goal using the energy of your happiness!",
                emoji: '⚡',
              },
              {
                tr: 'Mutlu olduğun bu anı, sağlıklı bir aktiviteyle daha da g\xfczelleştir!',
                en: 'Make this moment of happiness even more beautiful with a healthy activity!',
                emoji: '\uD83D\uDC8E',
              },
            ],
          },
          cheerful: {
            funny: [
              {
                tr: 'Neşeli misin? M\xfckemmel! Şimdi bu neşeyi hareket enerjisine \xe7evir ve zıpla zıpla zıpla! \uD83E\uDD98',
                en: 'Are you cheerful? Perfect! Now convert this cheerfulness into movement energy and jump jump jump! \uD83E\uDD98',
                emoji: '\uD83E\uDD98',
              },
              {
                tr: 'Neşeli bir ruh halindesin! Bu enerjiyi kullanarak bug\xfcnk\xfc hedefini bir \xe7ırpıda tamamla! \uD83D\uDE80',
                en: "You're in a cheerful mood! Use this energy to complete today's goal in one go! \uD83D\uDE80",
                emoji: '\uD83D\uDE80',
              },
              {
                tr: 'Neşen bulaşıcı! Şimdi bu neşeyi spor yaparak \xe7oğalt ve herkese yay! \uD83C\uDF88',
                en: 'Your cheerfulness is contagious! Now multiply this cheerfulness by exercising and spread it to everyone! \uD83C\uDF88',
                emoji: '\uD83C\uDF88',
              },
              {
                tr: 'Neşeli bir g\xfcn! Bu g\xfczel g\xfcn\xfc bir aktiviteyle daha da g\xfczelleştir. Hadi başla! \uD83C\uDF08',
                en: "A cheerful day! Make this beautiful day even more beautiful with an activity. Let's start! \uD83C\uDF08",
                emoji: '\uD83C\uDF08',
              },
              {
                tr: 'Neşeli ruh halin var! Şimdi bu neşeyi fiziksel aktiviteye d\xf6n\xfcşt\xfcr ve \xe7ifte kazan! \uD83C\uDFAA',
                en: 'You have a cheerful mood! Now convert this cheerfulness into physical activity and double win! \uD83C\uDFAA',
                emoji: '\uD83C\uDFAA',
              },
              {
                tr: 'Neşeli misin? Harika! Şimdi bu neşeyi kullanarak hedefini tamamla ve daha da neşeli ol! \uD83C\uDFAD',
                en: 'Are you cheerful? Great! Now use this cheerfulness to complete your goal and be even more cheerful! \uD83C\uDFAD',
                emoji: '\uD83C\uDFAD',
              },
            ],
            serious: [
              {
                tr: 'Neşeli bir ruh hali, fiziksel aktivite i\xe7in m\xfckemmel bir başlangı\xe7 noktasıdır. Bug\xfcnk\xfc hedefinize odaklanın.',
                en: "A cheerful mood is an excellent starting point for physical activity. Focus on today's goal.",
                emoji: '\uD83D\uDCC8',
              },
              {
                tr: 'Pozitif enerjinizi fiziksel aktiviteye y\xf6nlendirerek hem ruhsal hem fiziksel sağlığınızı destekleyin.',
                en: 'Direct your positive energy to physical activity to support both your mental and physical health.',
                emoji: '\uD83E\uDDD8',
              },
            ],
            motivational: [
              {
                tr: 'Neşeli ruh halinle bug\xfcnk\xfc hedefini tamamla ve bu g\xfczel g\xfcn\xfc ta\xe7landır!',
                en: "Complete today's goal with your cheerful mood and crown this beautiful day!",
                emoji: '\uD83D\uDC51',
              },
              {
                tr: 'Neşenin g\xfcc\xfcn\xfc kullanarak bug\xfcnk\xfc aktivitelerini tamamla!',
                en: "Complete today's activities using the power of your cheerfulness!",
                emoji: '\uD83D\uDCAA',
              },
              {
                tr: 'Neşeli bir g\xfcn ge\xe7iriyorsun! Bu g\xfczel g\xfcn\xfc bir aktiviteyle daha da g\xfczelleştir!',
                en: "You're having a cheerful day! Make this beautiful day even more beautiful with an activity!",
                emoji: '\uD83C\uDF1F',
              },
            ],
          },
          sad: {
            funny: [
              {
                tr: '\xdczg\xfcn m\xfcs\xfcn? Tamam, anlıyorum. Ama biliyor musun? Spor yapmak \xfcz\xfcnt\xfcy\xfc kovmanın en eğlenceli yolu! Hadi, bir şeyler yapalım! \uD83C\uDFAA',
                en: "Are you sad? Okay, I understand. But you know what? Exercise is the funniest way to chase away sadness! Come on, let's do something! \uD83C\uDFAA",
                emoji: '\uD83C\uDFAA',
              },
              {
                tr: '\xdczg\xfcn hissediyorsun ama endorfinler \xfcz\xfcnt\xfcy\xfc yener! Hadi biraz hareket edelim, belki g\xfcl\xfcmsersin! \uD83D\uDE0A',
                en: "You feel sad but endorphins beat sadness! Let's move a bit, maybe you'll smile! \uD83D\uDE0A",
                emoji: '\uD83D\uDE0A',
              },
              {
                tr: '\xdcz\xfcnt\xfc ge\xe7icidir ama spor yapmanın verdiği mutluluk kalıcıdır! Hadi başlayalım! \uD83C\uDF88',
                en: "Sadness is temporary but the happiness from exercising is lasting! Let's start! \uD83C\uDF88",
                emoji: '\uD83C\uDF88',
              },
              {
                tr: '\xdczg\xfcn m\xfcs\xfcn? Tamam, ama şunu bil: Spor yapmak \xfcz\xfcnt\xfcy\xfc kovmanın en iyi yoludur! Hadi deneyelim! \uD83E\uDDB8',
                en: "Are you sad? Okay, but know this: Exercise is the best way to chase away sadness! Let's try! \uD83E\uDDB8",
                emoji: '\uD83E\uDDB8',
              },
              {
                tr: '\xdcz\xfcnt\xfc bir duygudur ama spor yapmak bir \xe7\xf6z\xfcmd\xfcr! Hadi biraz hareket edelim! \uD83C\uDFC3',
                en: "Sadness is an emotion but exercise is a solution! Let's move a bit! \uD83C\uDFC3",
                emoji: '\uD83C\uDFC3',
              },
            ],
            serious: [
              {
                tr: '\xdczg\xfcn hissettiğinizde fiziksel aktivite, ruh halinizi iyileştirmenin bilimsel olarak kanıtlanmış bir yoludur. Bug\xfcn k\xfc\xe7\xfck bir adım atın.',
                en: 'When you feel sad, physical activity is a scientifically proven way to improve your mood. Take a small step today.',
                emoji: '\uD83D\uDD2C',
              },
              {
                tr: 'D\xfczenli egzersiz, depresyon ve \xfcz\xfcnt\xfc belirtilerini azaltmada etkilidir. Bug\xfcnk\xfc hedefinize odaklanın.',
                en: "Regular exercise is effective in reducing symptoms of depression and sadness. Focus on today's goal.",
                emoji: '\uD83D\uDCCA',
              },
              {
                tr: 'Fiziksel aktivite, beyinde mutluluk hormonlarının salınımını artırır. Bug\xfcn bir aktivite yapmayı d\xfcş\xfcn\xfcn.',
                en: 'Physical activity increases the release of happiness hormones in the brain. Consider doing an activity today.',
                emoji: '\uD83E\uDDE0',
              },
            ],
            motivational: [
              {
                tr: '\xdcz\xfcnt\xfc ge\xe7icidir ama sen g\xfc\xe7l\xfcs\xfcn. Bug\xfcnk\xfc hedefine ulaşarak kendini g\xfc\xe7lendir!',
                en: "Sadness is temporary but you are strong. Strengthen yourself by reaching today's goal!",
                emoji: '\uD83D\uDCAA',
              },
              {
                tr: 'Her zor g\xfcn, seni daha g\xfc\xe7l\xfc yapar. Bug\xfcnk\xfc aktivitelerinle bu g\xfcc\xfc artır!',
                en: "Every difficult day makes you stronger. Increase this strength with today's activities!",
                emoji: '\uD83C\uDF1F',
              },
              {
                tr: '\xdcz\xfcnt\xfc seni durduramaz. Bug\xfcnk\xfc hedefine ulaş ve kendini gururlandır!',
                en: "Sadness cannot stop you. Reach today's goal and make yourself proud!",
                emoji: '\uD83C\uDFC6',
              },
              {
                tr: 'Zor g\xfcnler ge\xe7er ama senin g\xfcc\xfcn kalıcıdır. Bug\xfcnk\xfc hedefini tamamla!',
                en: "Difficult days pass but your strength is lasting. Complete today's goal!",
                emoji: '⚡',
              },
            ],
          },
          unhappy: {
            funny: [
              {
                tr: 'Mutsuz musun? Tamam, anlıyorum. Ama şunu bil: Spor yapmak mutsuzluğu kovmanın en eğlenceli yolu! Hadi deneyelim! \uD83C\uDFAD',
                en: "Are you unhappy? Okay, I understand. But know this: Exercise is the funniest way to chase away unhappiness! Let's try! \uD83C\uDFAD",
                emoji: '\uD83C\uDFAD',
              },
              {
                tr: 'Mutsuz hissediyorsun ama endorfinler mutsuzluğu yener! Hadi biraz hareket edelim! \uD83C\uDFAA',
                en: "You feel unhappy but endorphins beat unhappiness! Let's move a bit! \uD83C\uDFAA",
                emoji: '\uD83C\uDFAA',
              },
              {
                tr: 'Mutsuzluk ge\xe7icidir ama spor yapmanın verdiği mutluluk kalıcıdır! Hadi başlayalım! \uD83C\uDF88',
                en: "Unhappiness is temporary but the happiness from exercising is lasting! Let's start! \uD83C\uDF88",
                emoji: '\uD83C\uDF88',
              },
              {
                tr: 'Mutsuz musun? Tamam, ama şunu bil: Spor yapmak mutsuzluğu kovmanın en iyi yoludur! Hadi deneyelim! \uD83E\uDDB8',
                en: "Are you unhappy? Okay, but know this: Exercise is the best way to chase away unhappiness! Let's try! \uD83E\uDDB8",
                emoji: '\uD83E\uDDB8',
              },
              {
                tr: 'Mutsuzluk bir duygudur ama spor yapmak bir \xe7\xf6z\xfcmd\xfcr! Hadi biraz hareket edelim! \uD83C\uDFC3',
                en: "Unhappiness is an emotion but exercise is a solution! Let's move a bit! \uD83C\uDFC3",
                emoji: '\uD83C\uDFC3',
              },
            ],
            serious: [
              {
                tr: 'Mutsuz hissettiğinizde fiziksel aktivite, ruh halinizi iyileştirmenin bilimsel olarak kanıtlanmış bir yoludur. Bug\xfcn k\xfc\xe7\xfck bir adım atın.',
                en: 'When you feel unhappy, physical activity is a scientifically proven way to improve your mood. Take a small step today.',
                emoji: '\uD83D\uDD2C',
              },
              {
                tr: 'D\xfczenli egzersiz, olumsuz duyguları y\xf6netmede etkilidir. Bug\xfcnk\xfc hedefinize odaklanın.',
                en: "Regular exercise is effective in managing negative emotions. Focus on today's goal.",
                emoji: '\uD83D\uDCCA',
              },
              {
                tr: 'Fiziksel aktivite, beyinde mutluluk hormonlarının salınımını artırır. Bug\xfcn bir aktivite yapmayı d\xfcş\xfcn\xfcn.',
                en: 'Physical activity increases the release of happiness hormones in the brain. Consider doing an activity today.',
                emoji: '\uD83E\uDDE0',
              },
            ],
            motivational: [
              {
                tr: 'Mutsuzluk ge\xe7icidir ama sen g\xfc\xe7l\xfcs\xfcn. Bug\xfcnk\xfc hedefine ulaşarak kendini g\xfc\xe7lendir!',
                en: "Unhappiness is temporary but you are strong. Strengthen yourself by reaching today's goal!",
                emoji: '\uD83D\uDCAA',
              },
              {
                tr: 'Her zor g\xfcn, seni daha g\xfc\xe7l\xfc yapar. Bug\xfcnk\xfc aktivitelerinle bu g\xfcc\xfc artır!',
                en: "Every difficult day makes you stronger. Increase this strength with today's activities!",
                emoji: '\uD83C\uDF1F',
              },
              {
                tr: 'Mutsuzluk seni durduramaz. Bug\xfcnk\xfc hedefine ulaş ve kendini gururlandır!',
                en: "Unhappiness cannot stop you. Reach today's goal and make yourself proud!",
                emoji: '\uD83C\uDFC6',
              },
              {
                tr: 'Zor g\xfcnler ge\xe7er ama senin g\xfcc\xfcn kalıcıdır. Bug\xfcnk\xfc hedefini tamamla!',
                en: "Difficult days pass but your strength is lasting. Complete today's goal!",
                emoji: '⚡',
              },
            ],
          },
          tired: {
            funny: [
              {
                tr: 'Yorgun musun? Anladım, ama şunu bil: Bazen yorgunluk sadece hareketsizlikten kaynaklanır! Hadi biraz hareket edelim, belki enerjin gelir! ⚡',
                en: "Are you tired? I understand, but know this: Sometimes tiredness comes from just being inactive! Let's move a bit, maybe your energy will come! ⚡",
                emoji: '⚡',
              },
              {
                tr: 'Yorgun hissediyorsun ama hafif bir aktivite enerji verebilir! Denemeye değer, değil mi? \uD83C\uDFAF',
                en: 'You feel tired but a light activity can give energy! Worth a try, right? \uD83C\uDFAF',
                emoji: '\uD83C\uDFAF',
              },
              {
                tr: 'Yorgun musun? Tamam, ama şunu bil: Bazen en iyi dinlenme aktif dinlenmedir! Hadi hafif bir şeyler yapalım! \uD83E\uDDD8',
                en: "Are you tired? Okay, but know this: Sometimes the best rest is active rest! Let's do something light! \uD83E\uDDD8",
                emoji: '\uD83E\uDDD8',
              },
              {
                tr: 'Yorgunluk ge\xe7icidir ama spor yapmanın verdiği enerji kalıcıdır! Hadi başlayalım! \uD83D\uDE80',
                en: "Tiredness is temporary but the energy from exercising is lasting! Let's start! \uD83D\uDE80",
                emoji: '\uD83D\uDE80',
              },
              {
                tr: 'Yorgun musun? Tamam, ama şunu bil: Hafif bir aktivite yorgunluğu kovabilir! Hadi deneyelim! \uD83C\uDFAA',
                en: "Are you tired? Okay, but know this: A light activity can chase away tiredness! Let's try! \uD83C\uDFAA",
                emoji: '\uD83C\uDFAA',
              },
              {
                tr: 'Yorgunluk bir duygudur ama spor yapmak bir \xe7\xf6z\xfcmd\xfcr! Hadi biraz hareket edelim! \uD83C\uDFC3',
                en: "Tiredness is an emotion but exercise is a solution! Let's move a bit! \uD83C\uDFC3",
                emoji: '\uD83C\uDFC3',
              },
            ],
            serious: [
              {
                tr: 'Yorgun hissettiğinizde hafif fiziksel aktivite, enerji seviyenizi artırabilir. Bug\xfcn k\xfc\xe7\xfck bir adım atmayı d\xfcş\xfcn\xfcn.',
                en: 'When you feel tired, light physical activity can increase your energy level. Consider taking a small step today.',
                emoji: '\uD83D\uDD0B',
              },
              {
                tr: 'Kronik yorgunluk durumunda, doktorunuza danışın. Hafif aktiviteler enerji seviyenizi destekleyebilir.',
                en: 'In case of chronic fatigue, consult your doctor. Light activities can support your energy level.',
                emoji: '\uD83C\uDFE5',
              },
              {
                tr: 'D\xfczenli hafif egzersiz, yorgunluk belirtilerini azaltmada etkilidir. Bug\xfcnk\xfc hedefinize odaklanın.',
                en: "Regular light exercise is effective in reducing fatigue symptoms. Focus on today's goal.",
                emoji: '\uD83D\uDCCA',
              },
            ],
            motivational: [
              {
                tr: 'Yorgunluk ge\xe7icidir ama sen g\xfc\xe7l\xfcs\xfcn. Bug\xfcnk\xfc hedefine ulaşarak kendini g\xfc\xe7lendir!',
                en: "Tiredness is temporary but you are strong. Strengthen yourself by reaching today's goal!",
                emoji: '\uD83D\uDCAA',
              },
              {
                tr: 'Her zor g\xfcn, seni daha g\xfc\xe7l\xfc yapar. Bug\xfcnk\xfc aktivitelerinle bu g\xfcc\xfc artır!',
                en: "Every difficult day makes you stronger. Increase this strength with today's activities!",
                emoji: '\uD83C\uDF1F',
              },
              {
                tr: 'Yorgunluk seni durduramaz. Bug\xfcnk\xfc hedefine ulaş ve kendini gururlandır!',
                en: "Tiredness cannot stop you. Reach today's goal and make yourself proud!",
                emoji: '\uD83C\uDFC6',
              },
              {
                tr: 'Zor g\xfcnler ge\xe7er ama senin g\xfcc\xfcn kalıcıdır. Bug\xfcnk\xfc hedefini tamamla!',
                en: "Difficult days pass but your strength is lasting. Complete today's goal!",
                emoji: '⚡',
              },
            ],
          },
        },
        j = {
          funny: [
            {
              tr: 'Hadi başlayalım! Bug\xfcn hen\xfcz aktivite yok ama bu değişebilir! \uD83D\uDE80',
              en: "Let's get started! No activities today yet but this can change! \uD83D\uDE80",
              emoji: '\uD83D\uDE80',
            },
            {
              tr: 'Yan gelip yatma zamanı değil! Hadi biraz hareket edelim! \uD83D\uDCAA',
              en: "It's not time to lie down! Let's move a bit! \uD83D\uDCAA",
              emoji: '\uD83D\uDCAA',
            },
            {
              tr: 'Hedefin altındasın ama bu bir sorun değil, bir fırsat! Hadi başla! \uD83C\uDFAF',
              en: "You're below your goal but this is not a problem, it's an opportunity! Let's start! \uD83C\uDFAF",
              emoji: '\uD83C\uDFAF',
            },
          ],
          serious: [
            {
              tr: 'Bug\xfcn hen\xfcz aktivite kaydetmediniz. G\xfcnl\xfck hedefinize ulaşmak i\xe7in bir aktivite eklemeyi d\xfcş\xfcn\xfcn.',
              en: "You haven't logged any activities today. Consider adding an activity to reach your daily goal.",
              emoji: '\uD83D\uDCCA',
            },
          ],
          motivational: [
            {
              tr: 'Her yolculuk tek bir adımla başlar. Bug\xfcn ilk adımı at!',
              en: 'Every journey begins with a single step. Take the first step today!',
              emoji: '\uD83D\uDC63',
            },
          ],
        };
      var N = a(56942),
        C = a(16357);
      function A() {
        let { t: e, lang: t } = (0, l.Q)(),
          { settings: a } = (0, c.rV)(),
          { activities: n } = (0, d.G$)(),
          o = (0, m.d)(),
          s = (null == a ? void 0 : a.dailyTarget) && a.dailyTarget > 0 ? a.dailyTarget : 1e4,
          u = (0, d.bA)(s),
          g = (null == a ? void 0 : a.name)
            ? e('header.greeting', { name: a.name })
            : e('header.overviewTitle'),
          b = (0, i.useMemo)(() => {
            let e = (0, N.b)(new Date());
            return n.filter((t) => (0, C.K)((0, N.b)(new Date(t.performedAt)), e));
          }, [n]),
          f = s > 0 ? Math.min(100, Math.round((u.todayPoints / s) * 100)) : 0,
          [k, p] = (0, i.useState)(!1),
          [A, z] = (0, i.useState)(null);
        ((0, i.useEffect)(() => {
          p(!0);
        }, []),
          (0, i.useEffect)(() => {
            if (k) {
              var e;
              z(
                (function (e, t) {
                  let a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
                  if (!t && 0 === e) {
                    let e = a ? w[a] : j,
                      t = [...e.funny, ...e.motivational];
                    return 0 === t.length ? null : t[Math.floor(Math.random() * t.length)];
                  }
                  let r = a ? w[a] : j,
                    i = 'motivational',
                    n =
                      r[
                        (i =
                          e < 25
                            ? Math.random() > 0.5
                              ? 'funny'
                              : 'motivational'
                            : e < 50
                              ? 'motivational'
                              : e < 75
                                ? Math.random() > 0.3
                                  ? 'motivational'
                                  : 'funny'
                                : 'motivational')
                      ];
                  if (0 === n.length) {
                    let e = j[i];
                    return 0 === e.length ? null : e[Math.floor(Math.random() * e.length)];
                  }
                  return n[Math.floor(Math.random() * n.length)];
                })(
                  f,
                  b.length > 0,
                  null !== (e = null == a ? void 0 : a.mood) && void 0 !== e ? e : null
                )
              );
            }
          }, [k, f, b.length, null == a ? void 0 : a.mood]));
        let [F, S] = (0, i.useState)(!0);
        return (
          (0, i.useEffect)(() => {
            if (A && k) {
              S(!0);
              let e = setTimeout(() => {
                S(!1);
              }, 5e3);
              return () => clearTimeout(e);
            }
          }, [A, k]),
          (0, r.jsxs)('div', {
            className: 'space-y-4 sm:space-y-6 page-transition',
            children: [
              (0, r.jsxs)('div', {
                className: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
                children: [
                  (0, r.jsxs)('div', {
                    className: o ? 'title-entrance' : '',
                    children: [
                      (0, r.jsx)('h1', {
                        className: 'text-2xl sm:text-3xl font-bold '.concat(
                          o ? 'text-brand dark:text-brand-light' : 'text-gray-950 dark:text-white'
                        ),
                        children: g,
                      }),
                      (0, r.jsx)('p', {
                        className:
                          'text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium leading-relaxed',
                        children: e('header.overviewSubtitle'),
                      }),
                    ],
                  }),
                  (0, r.jsx)(h.default, {
                    href: '/add',
                    className:
                      'px-3 py-2 rounded bg-brand text-white hover:bg-brand-dark text-xs sm:text-sm shadow self-start sm:self-auto btn-enhanced '.concat(
                        o ? 'touch-feedback mobile-press bounce-in-mobile' : 'ripple-effect',
                        ' scale-on-interact'
                      ),
                    'aria-label': e('actions.addActivity'),
                    'data-tour-id': 'add-activity',
                    children: e('actions.addActivity'),
                  }),
                ],
              }),
              A &&
                F &&
                (0, r.jsxs)('div', {
                  className:
                    'motivational-card glow-border rounded-xl border-2 border-brand/40 dark:border-brand/50 p-5 sm:p-6 shadow-2xl '
                      .concat(
                        o
                          ? 'motivational-entrance slide-in-bottom-mobile'
                          : 'animate-slide-in-right',
                        ' transition-all duration-500 overflow-hidden relative '
                      )
                      .concat(F ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'),
                  children: [
                    (0, r.jsx)('div', { className: 'pattern-overlay' }),
                    (0, r.jsx)('div', { className: 'quote-shimmer' }),
                    (0, r.jsxs)('div', {
                      className: 'flex items-center gap-4 relative z-50',
                      children: [
                        (0, r.jsx)('span', {
                          className: 'text-3xl sm:text-4xl '.concat(
                            o ? 'emoji-celebrate' : 'emoji-bounce',
                            ' flex-shrink-0'
                          ),
                          children: A.emoji,
                        }),
                        (0, r.jsx)('p', {
                          className:
                            'text-sm sm:text-base md:text-lg font-bold text-gray-950 dark:text-white flex-1 leading-relaxed',
                          style: { textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' },
                          children: 'tr' === t ? A.tr : A.en,
                        }),
                      ],
                    }),
                    (0, r.jsx)('div', { className: 'sparkle sparkle-enhanced' }),
                    (0, r.jsx)('div', { className: 'sparkle sparkle-enhanced' }),
                  ],
                }),
              (0, r.jsxs)('div', {
                className: 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6',
                children: [
                  (0, r.jsx)('div', { className: 'lg:col-span-1', children: (0, r.jsx)(y, {}) }),
                  (0, r.jsx)('div', { className: 'lg:col-span-1', children: (0, r.jsx)(x, {}) }),
                ],
              }),
              (0, r.jsx)(v, {}),
              (0, r.jsx)(D, {}),
            ],
          })
        );
      }
    },
    60923: function (e, t, a) {
      'use strict';
      a.d(t, {
        Q: function () {
          return l;
        },
      });
      var r = a(57437),
        i = a(54887),
        n = a(2265),
        o = a(98661),
        s = a(78466);
      function l(e) {
        let {
            open: t,
            title: a,
            message: l,
            confirmLabel: d,
            cancelLabel: c,
            onConfirm: u,
            onCancel: m,
            variant: g = 'default',
          } = e,
          { t: y } = (0, o.Q)(),
          [h, b] = (0, n.useState)(!1),
          x = (0, s.d)();
        if (
          ((0, n.useEffect)(() => {
            b(!0);
          }, []),
          (0, n.useEffect)(
            () => (
              t ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = ''),
              () => {
                document.body.style.overflow = '';
              }
            ),
            [t]
          ),
          (0, n.useEffect)(() => {
            if (!t) return;
            let e = (e) => {
              'Escape' === e.key && m();
            };
            return (
              document.addEventListener('keydown', e),
              () => document.removeEventListener('keydown', e)
            );
          }, [t, m]),
          !h || !t)
        )
          return null;
        let f = () => {
            m();
          },
          k = (0, r.jsx)('div', {
            className: 'fixed inset-0 z-[9999] flex '
              .concat(x ? 'items-end' : 'items-center justify-center', ' bg-black/50 ')
              .concat(x ? '' : 'backdrop-blur-sm', ' ')
              .concat(x ? 'backdrop-fade' : 'animate-fade-in', ' safe-bottom'),
            onClick: (e) => {
              e.target === e.currentTarget && f();
            },
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'confirm-dialog-title',
            'aria-describedby': 'confirm-dialog-message',
            children: (0, r.jsx)('div', {
              className:
                'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                  x
                    ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto slide-up-bottom'
                    : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-md w-full mx-4 animate-scale-in',
                  ' border-2 border-gray-200 dark:border-gray-700'
                ),
              children: (0, r.jsxs)('div', {
                className: ''.concat('p-6'),
                children: [
                  (0, r.jsx)('h2', {
                    id: 'confirm-dialog-title',
                    className: ''.concat(
                      x ? 'text-xl' : 'text-lg',
                      ' font-bold text-gray-950 dark:text-white mb-2'
                    ),
                    children: a,
                  }),
                  (0, r.jsx)('p', {
                    id: 'confirm-dialog-message',
                    className: ''.concat(
                      x ? 'text-base' : 'text-sm',
                      ' font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed'
                    ),
                    children: l,
                  }),
                  (0, r.jsxs)('div', {
                    className: 'flex items-center '.concat(
                      x ? 'flex-col-reverse gap-2' : 'justify-end gap-3'
                    ),
                    children: [
                      (0, r.jsx)('button', {
                        type: 'button',
                        onClick: f,
                        className: ''.concat(
                          x ? 'w-full min-h-[44px] touch-feedback mobile-press' : 'px-4 py-2',
                          ' text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 active:scale-95'
                        ),
                        'aria-label': c || y('form.cancel'),
                        children: c || y('form.cancel'),
                      }),
                      (0, r.jsx)('button', {
                        type: 'button',
                        onClick: () => {
                          u();
                        },
                        className: ''
                          .concat(
                            x ? 'w-full min-h-[44px] touch-feedback mobile-press' : 'px-4 py-2',
                            ' text-sm font-semibold text-white rounded-lg transition-all duration-200 active:scale-95 hover:shadow-xl '
                          )
                          .concat(
                            'danger' === g
                              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600'
                              : 'bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand'
                          ),
                        'aria-label': d || y('form.confirm'),
                        autoFocus: !0,
                        children: d || y('form.confirm'),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          });
        return (0, i.createPortal)(k, document.body);
      }
    },
    10480: function (e, t, a) {
      'use strict';
      a.d(t, {
        N: function () {
          return d;
        },
        P: function () {
          return c;
        },
      });
      var r = a(57437),
        i = a(2265),
        n = a(54887),
        o = a(78705),
        s = a(78466);
      let l = (0, i.createContext)(null);
      function d(e) {
        let { children: t } = e,
          [a, d] = (0, i.useState)([]),
          [c, u] = (0, i.useState)(!1),
          m = (0, s.d)();
        (0, i.useEffect)(() => {
          u(!0);
        }, []);
        let g = (0, i.useCallback)(function (e) {
          let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'success',
            a = Math.random().toString(36).slice(2);
          (d((r) => [...r, { id: a, message: e, type: t }]),
            setTimeout(() => {
              d((e) => e.filter((e) => e.id !== a));
            }, o.LS.TOAST_DURATION));
        }, []);
        return (0, r.jsxs)(l.Provider, {
          value: { showToast: g },
          children: [
            t,
            c &&
              (0, n.createPortal)(
                (0, r.jsx)('div', {
                  className: 'fixed z-[10000] flex flex-col gap-2 '.concat(
                    m ? 'bottom-4 left-4 right-4 safe-bottom' : 'bottom-4 right-4'
                  ),
                  children: a.map((e) =>
                    (0, r.jsx)(
                      'div',
                      {
                        className: ''
                          .concat(
                            m ? 'w-full max-w-sm' : 'max-w-md',
                            ' px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in-right transition-all duration-300 whitespace-pre-line '
                          )
                          .concat(
                            'success' === e.type
                              ? 'bg-green-500 text-white'
                              : 'error' === e.type
                                ? 'bg-red-500 text-white'
                                : 'bg-blue-500 text-white'
                          ),
                        role: 'alert',
                        'aria-live': 'error' === e.type ? 'assertive' : 'polite',
                        'aria-atomic': 'true',
                        children: e.message,
                      },
                      e.id
                    )
                  ),
                }),
                document.body
              ),
          ],
        });
      }
      function c() {
        let e = (0, i.useContext)(l);
        if (!e) throw Error('useToaster must be used within ToasterProvider');
        return e;
      }
    },
    14258: function (e, t, a) {
      'use strict';
      function r(e, t) {
        return 'en' === t && e.labelEn ? e.labelEn : e.label;
      }
      function i(e, t) {
        return 'en' === t && e.unitEn ? e.unitEn : e.unit;
      }
      function n(e, t) {
        return 'en' === t && e.descriptionEn ? e.descriptionEn : e.description;
      }
      a.d(t, {
        Jt: function () {
          return i;
        },
        Xr: function () {
          return r;
        },
        dE: function () {
          return n;
        },
      });
    },
    88270: function (e, t, a) {
      'use strict';
      a.d(t, {
        BF: function () {
          return n;
        },
        dl: function () {
          return r;
        },
      });
      let r = {
        enabled: !1,
        dailyReminder: !0,
        dailyReminderTime: '20:00',
        goalCompletion: !0,
        streakReminder: !0,
        streakReminderTime: '21:00',
      };
      class i {
        static getInstance() {
          return (i.instance || (i.instance = new i()), i.instance);
        }
        async requestPermission() {
          if (!('Notification' in window)) return 'denied';
          if ('granted' === this.permission) return 'granted';
          try {
            let e = await Notification.requestPermission();
            return ((this.permission = e), this.permission);
          } catch (e) {
            return (console.error('Error requesting notification permission:', e), 'denied');
          }
        }
        getPermission() {
          return this.permission;
        }
        canNotify() {
          return 'granted' === this.permission;
        }
        async showNotification(e, t) {
          if (this.canNotify())
            try {
              let a = new Notification(e, {
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                tag: 'sporttrack',
                requireInteraction: !1,
                ...t,
              });
              (setTimeout(() => {
                a.close();
              }, 5e3),
                (a.onclick = () => {
                  (window.focus(), a.close());
                }));
            } catch (e) {
              console.error('Error showing notification:', e);
            }
        }
        async showDailyReminder(e) {
          if (!this.canNotify()) return;
          let t = {
            tr: {
              title: 'G\xfcnl\xfck Hedefin',
              body: 'Bug\xfcn hedefini tamamlamayı unutma! \uD83D\uDCAA',
            },
            en: {
              title: 'Daily Goal',
              body: "Don't forget to complete your goal today! \uD83D\uDCAA",
            },
          };
          await this.showNotification(t[e].title, { body: t[e].body, tag: 'daily-reminder' });
        }
        async showGoalCompletion(e, t) {
          if (!this.canNotify()) return;
          let a = {
            tr: {
              title: '\uD83C\uDF89 Hedef Tamamlandı!',
              body: 'Tebrikler! Bug\xfcn '.concat(t.toLocaleString('tr-TR'), ' puan kazandın!'),
            },
            en: {
              title: '\uD83C\uDF89 Goal Completed!',
              body: 'Congratulations! You earned '.concat(
                t.toLocaleString('en-US'),
                ' points today!'
              ),
            },
          };
          await this.showNotification(a[e].title, {
            body: a[e].body,
            tag: 'goal-completion',
            requireInteraction: !0,
          });
        }
        async showStreakReminder(e, t) {
          if (!this.canNotify()) return;
          let a = {
            tr: {
              title: '\uD83D\uDD25 Seri Devam Ediyor!',
              body: ''.concat(t, ' g\xfcnl\xfck serin var! Bug\xfcn de hedefini tamamla!'),
            },
            en: {
              title: '\uD83D\uDD25 Streak Continues!',
              body: 'You have a '.concat(t, '-day streak! Complete your goal today too!'),
            },
          };
          await this.showNotification(a[e].title, { body: a[e].body, tag: 'streak-reminder' });
        }
        async showBadgeUnlocked(e, t, a) {
          if (!this.canNotify()) return;
          let r = {
            tr: {
              title: ''.concat(a, ' Yeni Rozet Kazandın!'),
              body: ''.concat(t, ' rozetini kazandın!'),
            },
            en: {
              title: ''.concat(a, ' New Badge Unlocked!'),
              body: 'You earned the '.concat(t, ' badge!'),
            },
          };
          await this.showNotification(r[e].title, {
            body: r[e].body,
            tag: 'badge-unlocked',
            requireInteraction: !0,
          });
        }
        async showLevelUp(e, t) {
          if (!this.canNotify()) return;
          let a = {
            tr: {
              title: '\uD83C\uDF89 Seviye Atladın!',
              body: 'Tebrikler! Seviye '.concat(t, "'e ulaştın!"),
            },
            en: {
              title: '\uD83C\uDF89 Level Up!',
              body: 'Congratulations! You reached level '.concat(t, '!'),
            },
          };
          await this.showNotification(a[e].title, {
            body: a[e].body,
            tag: 'level-up',
            requireInteraction: !0,
          });
        }
        async showChallengeCompleted(e, t, a) {
          if (!this.canNotify()) return;
          let r = {
            tr: {
              title: ''.concat(a, ' Zorluk Tamamlandı!'),
              body: 'Tebrikler! "'.concat(t, '" zorluğunu tamamladın!'),
            },
            en: {
              title: ''.concat(a, ' Challenge Completed!'),
              body: 'Congratulations! You completed the "'.concat(t, '" challenge!'),
            },
          };
          await this.showNotification(r[e].title, {
            body: r[e].body,
            tag: 'challenge-completed',
            requireInteraction: !0,
          });
        }
        startDailyReminderCheck(e, t, a) {
          (this.checkInterval && clearInterval(this.checkInterval),
            e.enabled &&
              e.dailyReminder &&
              (this.checkInterval = setInterval(() => {
                let t = new Date(),
                  [r, i] = e.dailyReminderTime.split(':').map(Number),
                  n = new Date();
                (n.setHours(r, i, 0, 0), 6e4 > Math.abs(t.getTime() - n.getTime()) && a());
              }, 6e4)));
        }
        stopDailyReminderCheck() {
          this.checkInterval && (clearInterval(this.checkInterval), (this.checkInterval = null));
        }
        constructor() {
          ((this.permission = 'default'),
            (this.checkInterval = null),
            'Notification' in window && (this.permission = Notification.permission));
        }
      }
      let n = i.getInstance();
    },
  },
  function (e) {
    (e.O(0, [6317, 9750, 2174, 2971, 2117, 1744], function () {
      return e((e.s = 40488));
    }),
      (_N_E = e.O()));
  },
]);
