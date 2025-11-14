'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [6410],
  {
    66410: function (t, e, a) {
      (a.r(e),
        a.d(e, {
          PeriodComparison: function () {
            return T;
          },
        }));
      var i = a(57437),
        r = a(2265),
        o = a(98661),
        n = a(24979),
        s = a(58151),
        l = a(60186),
        c = a(86035),
        d = a(56942),
        g = a(60936),
        v = a(95775),
        x = a(34479),
        m = a(27742),
        u = a(65696),
        y = a(59121),
        p = a(63070),
        h = a(99649),
        b = a(63497);
      function f(t, e, a) {
        let i = (0, c.v)(e, { weekStartsOn: 1 }),
          r = (0, d.b)(e),
          o = (0, d.b)(i),
          n = t.filter((t) => {
            let e = (0, g.D)(t.performedAt);
            return (0, v._)((0, d.b)(e), { start: r, end: o });
          }),
          s = new Map(),
          l = 0,
          m = 0,
          u = new Map();
        for (let t of n) {
          ((l += t.points), m++);
          let e = (0, x.WU)((0, d.b)((0, g.D)(t.performedAt)), 'yyyy-MM-dd'),
            a = s.get(e) || { points: 0, count: 0 };
          ((a.points += t.points), a.count++, s.set(e, a));
          let i = t.activityKey,
            r = u.get(i) || { label: t.label, icon: t.icon, points: 0, count: 0 };
          ((r.points += t.points), r.count++, u.set(i, r));
        }
        let y = s.size,
          p = Array.from(s.values()).filter((t) => t.points >= a).length,
          h = y > 0 ? Math.round(l / y) : 0,
          b = null;
        if (u.size > 0) {
          var f;
          let t = Array.from(u.values()).reduce((t, e) => (e.points > t.points ? e : t)),
            e =
              null ===
                (f = Array.from(u.entries()).find((e) => {
                  let [a, i] = e;
                  return i === t;
                })) || void 0 === f
                ? void 0
                : f[0];
          e && (b = { key: e, label: t.label, icon: t.icon, points: t.points, count: t.count });
        }
        return {
          period: (0, x.WU)(e, 'yyyy-MM-dd'),
          startDate: r,
          endDate: o,
          totalPoints: l,
          totalActivities: m,
          averageDailyPoints: h,
          daysWithActivities: y,
          completionRate: Math.round((p / 7) * 100),
          topActivity: b,
        };
      }
      function j(t, e, a) {
        let i = (0, m.V)(e),
          r = (0, d.b)(e),
          o = (0, d.b)(i),
          n = t.filter((t) => {
            let e = (0, g.D)(t.performedAt);
            return (0, v._)((0, d.b)(e), { start: r, end: o });
          }),
          s = new Map(),
          l = 0,
          c = 0,
          u = new Map();
        for (let t of n) {
          ((l += t.points), c++);
          let e = (0, x.WU)((0, d.b)((0, g.D)(t.performedAt)), 'yyyy-MM-dd'),
            a = s.get(e) || { points: 0, count: 0 };
          ((a.points += t.points), a.count++, s.set(e, a));
          let i = t.activityKey,
            r = u.get(i) || { label: t.label, icon: t.icon, points: 0, count: 0 };
          ((r.points += t.points), r.count++, u.set(i, r));
        }
        let y = s.size,
          p = Math.ceil((o.getTime() - r.getTime()) / 864e5) + 1,
          h = Array.from(s.values()).filter((t) => t.points >= a).length,
          b = y > 0 ? Math.round(l / y) : 0,
          f = null;
        if (u.size > 0) {
          var j;
          let t = Array.from(u.values()).reduce((t, e) => (e.points > t.points ? e : t)),
            e =
              null ===
                (j = Array.from(u.entries()).find((e) => {
                  let [a, i] = e;
                  return i === t;
                })) || void 0 === j
                ? void 0
                : j[0];
          e && (f = { key: e, label: t.label, icon: t.icon, points: t.points, count: t.count });
        }
        return {
          period: (0, x.WU)(e, 'yyyy-MM'),
          startDate: r,
          endDate: o,
          totalPoints: l,
          totalActivities: c,
          averageDailyPoints: b,
          daysWithActivities: y,
          completionRate: p > 0 ? Math.round((h / p) * 100) : 0,
          topActivity: f,
        };
      }
      var k = a(8608),
        P = a(71598),
        N = a(78466),
        D = a(91436),
        M = a(77031),
        w = a(56940),
        R = a(97059),
        A = a(62994),
        S = a(78155),
        U = a(90999);
      let T = (0, r.memo)(function () {
        let { activities: t, hydrated: e } = (0, n.G$)(),
          { settings: a } = (0, s.rV)(),
          { t: c, lang: d } = (0, o.Q)(),
          g = (0, N.d)(),
          v = 'tr' === d ? k.tr : P._,
          m = (null == a ? void 0 : a.dailyTarget) && a.dailyTarget > 0 ? a.dailyTarget : l.Dy,
          T = (0, r.useMemo)(
            () =>
              e && 0 !== t.length
                ? (function (t, e) {
                    let a =
                        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
                      i = (0, u.z)(a, { weekStartsOn: 1 }),
                      r = (0, y.E)(i, -7),
                      o = f(t, i, e),
                      n = f(t, r, e);
                    if (0 === o.totalActivities && 0 === n.totalActivities) return null;
                    let s = {
                      points: o.totalPoints - n.totalPoints,
                      pointsPercent:
                        n.totalPoints > 0
                          ? Math.round(((o.totalPoints - n.totalPoints) / n.totalPoints) * 100)
                          : o.totalPoints > 0
                            ? 100
                            : 0,
                      activities: o.totalActivities - n.totalActivities,
                      activitiesPercent:
                        n.totalActivities > 0
                          ? Math.round(
                              ((o.totalActivities - n.totalActivities) / n.totalActivities) * 100
                            )
                          : o.totalActivities > 0
                            ? 100
                            : 0,
                      averageDaily: o.averageDailyPoints - n.averageDailyPoints,
                      averageDailyPercent:
                        n.averageDailyPoints > 0
                          ? Math.round(
                              ((o.averageDailyPoints - n.averageDailyPoints) /
                                n.averageDailyPoints) *
                                100
                            )
                          : o.averageDailyPoints > 0
                            ? 100
                            : 0,
                      completionRate: o.completionRate - n.completionRate,
                      completionRatePercent:
                        n.completionRate > 0
                          ? Math.round(
                              ((o.completionRate - n.completionRate) / n.completionRate) * 100
                            )
                          : o.completionRate > 0
                            ? 100
                            : 0,
                    };
                    return { current: o, previous: n, change: s };
                  })(t, m)
                : null,
            [t, m, e]
          ),
          K = (0, r.useMemo)(
            () =>
              e && 0 !== t.length
                ? (function (t, e) {
                    let a =
                        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
                      i = (0, p.N)(a),
                      r = (function (t, e) {
                        let a = (0, h.Q)(t);
                        if (isNaN(-1)) return (0, b.L)(t, NaN);
                        let i = a.getDate(),
                          r = (0, b.L)(t, a.getTime());
                        return (r.setMonth(a.getMonth() + e + 1, 0), i >= r.getDate())
                          ? r
                          : (a.setFullYear(r.getFullYear(), r.getMonth(), i), a);
                      })(i, -1),
                      o = j(t, i, e),
                      n = j(t, r, e);
                    if (0 === o.totalActivities && 0 === n.totalActivities) return null;
                    let s = {
                      points: o.totalPoints - n.totalPoints,
                      pointsPercent:
                        n.totalPoints > 0
                          ? Math.round(((o.totalPoints - n.totalPoints) / n.totalPoints) * 100)
                          : o.totalPoints > 0
                            ? 100
                            : 0,
                      activities: o.totalActivities - n.totalActivities,
                      activitiesPercent:
                        n.totalActivities > 0
                          ? Math.round(
                              ((o.totalActivities - n.totalActivities) / n.totalActivities) * 100
                            )
                          : o.totalActivities > 0
                            ? 100
                            : 0,
                      averageDaily: o.averageDailyPoints - n.averageDailyPoints,
                      averageDailyPercent:
                        n.averageDailyPoints > 0
                          ? Math.round(
                              ((o.averageDailyPoints - n.averageDailyPoints) /
                                n.averageDailyPoints) *
                                100
                            )
                          : o.averageDailyPoints > 0
                            ? 100
                            : 0,
                      completionRate: o.completionRate - n.completionRate,
                      completionRatePercent:
                        n.completionRate > 0
                          ? Math.round(
                              ((o.completionRate - n.completionRate) / n.completionRate) * 100
                            )
                          : o.completionRate > 0
                            ? 100
                            : 0,
                    };
                    return { current: o, previous: n, change: s };
                  })(t, m)
                : null,
            [t, m, e]
          ),
          z = (t, e, a) => {
            let r = t >= 0 ? '+' : '';
            return (0, i.jsxs)('span', {
              className: a
                ? t >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
                : t >= 0
                  ? 'text-red-600'
                  : 'text-green-600',
              children: [r, t.toLocaleString('tr' === d ? 'tr-TR' : 'en-US'), ' (', r, e, '%)'],
            });
          };
        return e && (T || K)
          ? (0, i.jsxs)('div', {
              className: 'spacing-lg',
              children: [
                (0, i.jsxs)('div', {
                  children: [
                    (0, i.jsx)('h2', {
                      className: 'text-heading-3 text-gray-900 dark:text-white mb-4',
                      children: c('comparison.title'),
                    }),
                    (0, i.jsx)('p', {
                      className: 'text-body text-gray-600 dark:text-gray-400 mb-4',
                      children: c('comparison.subtitle'),
                    }),
                  ],
                }),
                T &&
                  (0, i.jsxs)('div', {
                    className:
                      'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
                    children: [
                      (0, i.jsx)('h3', {
                        className: 'text-heading-3 text-gray-900 dark:text-white mb-4',
                        children: c('comparison.weekly'),
                      }),
                      (0, i.jsxs)('div', {
                        className: 'space-y-4',
                        children: [
                          (0, i.jsxs)('div', {
                            className: 'grid '.concat(g ? 'grid-cols-2' : 'grid-cols-4', ' gap-3'),
                            children: [
                              (0, i.jsxs)('div', {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-700 p-3',
                                children: [
                                  (0, i.jsx)('div', {
                                    className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                                    children: c('comparison.totalPoints'),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-lg font-bold text-gray-900 dark:text-white',
                                    children: T.current.totalPoints.toLocaleString(
                                      'tr' === d ? 'tr-TR' : 'en-US'
                                    ),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-xs mt-1',
                                    children: z(T.change.points, T.change.pointsPercent, !1),
                                  }),
                                ],
                              }),
                              (0, i.jsxs)('div', {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-700 p-3',
                                children: [
                                  (0, i.jsx)('div', {
                                    className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                                    children: c('comparison.totalActivities'),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-lg font-bold text-gray-900 dark:text-white',
                                    children: T.current.totalActivities,
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-xs mt-1',
                                    children: z(
                                      T.change.activities,
                                      T.change.activitiesPercent,
                                      !1
                                    ),
                                  }),
                                ],
                              }),
                              (0, i.jsxs)('div', {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-700 p-3',
                                children: [
                                  (0, i.jsx)('div', {
                                    className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                                    children: c('comparison.avgDaily'),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-lg font-bold text-gray-900 dark:text-white',
                                    children: T.current.averageDailyPoints.toLocaleString(
                                      'tr' === d ? 'tr-TR' : 'en-US'
                                    ),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-xs mt-1',
                                    children: z(
                                      T.change.averageDaily,
                                      T.change.averageDailyPercent,
                                      !1
                                    ),
                                  }),
                                ],
                              }),
                              (0, i.jsxs)('div', {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-700 p-3',
                                children: [
                                  (0, i.jsx)('div', {
                                    className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                                    children: c('comparison.completionRate'),
                                  }),
                                  (0, i.jsxs)('div', {
                                    className: 'text-lg font-bold text-gray-900 dark:text-white',
                                    children: [T.current.completionRate, '%'],
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-xs mt-1',
                                    children: z(
                                      T.change.completionRate,
                                      T.change.completionRatePercent,
                                      !0
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, i.jsx)('div', {
                            className: 'mt-4',
                            children: (0, i.jsx)(D.h, {
                              width: '100%',
                              height: g ? 200 : 250,
                              children: (0, i.jsxs)(M.v, {
                                data: [
                                  {
                                    period: (0, x.WU)(T.previous.startDate, 'dd MMM', {
                                      locale: v,
                                    }),
                                    points: T.previous.totalPoints,
                                    activities: T.previous.totalActivities,
                                  },
                                  {
                                    period: (0, x.WU)(T.current.startDate, 'dd MMM', { locale: v }),
                                    points: T.current.totalPoints,
                                    activities: T.current.totalActivities,
                                  },
                                ],
                                children: [
                                  (0, i.jsx)(w.q, { strokeDasharray: '3 3', stroke: '#e5e7eb' }),
                                  (0, i.jsx)(R.K, {
                                    dataKey: 'period',
                                    tick: { fontSize: g ? 10 : 12 },
                                  }),
                                  (0, i.jsx)(A.B, { tick: { fontSize: g ? 10 : 12 } }),
                                  (0, i.jsx)(S.u, {
                                    formatter: (t) => [
                                      t.toLocaleString('tr' === d ? 'tr-TR' : 'en-US'),
                                      '',
                                    ],
                                    labelStyle: { color: '#374151' },
                                    contentStyle: {
                                      backgroundColor: '#fff',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '8px',
                                    },
                                  }),
                                  (0, i.jsx)(U.$, {
                                    dataKey: 'points',
                                    fill: '#3b82f6',
                                    name: c('comparison.points'),
                                  }),
                                  (0, i.jsx)(U.$, {
                                    dataKey: 'activities',
                                    fill: '#10b981',
                                    name: c('comparison.activities'),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                K &&
                  (0, i.jsxs)('div', {
                    className:
                      'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300',
                    children: [
                      (0, i.jsx)('h3', {
                        className: 'text-heading-3 text-gray-900 dark:text-white mb-4',
                        children: c('comparison.monthly'),
                      }),
                      (0, i.jsxs)('div', {
                        className: 'space-y-4',
                        children: [
                          (0, i.jsxs)('div', {
                            className: 'grid '.concat(g ? 'grid-cols-2' : 'grid-cols-4', ' gap-3'),
                            children: [
                              (0, i.jsxs)('div', {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-700 p-3',
                                children: [
                                  (0, i.jsx)('div', {
                                    className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                                    children: c('comparison.totalPoints'),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-lg font-bold text-gray-900 dark:text-white',
                                    children: K.current.totalPoints.toLocaleString(
                                      'tr' === d ? 'tr-TR' : 'en-US'
                                    ),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-xs mt-1',
                                    children: z(K.change.points, K.change.pointsPercent, !1),
                                  }),
                                ],
                              }),
                              (0, i.jsxs)('div', {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-700 p-3',
                                children: [
                                  (0, i.jsx)('div', {
                                    className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                                    children: c('comparison.totalActivities'),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-lg font-bold text-gray-900 dark:text-white',
                                    children: K.current.totalActivities,
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-xs mt-1',
                                    children: z(
                                      K.change.activities,
                                      K.change.activitiesPercent,
                                      !1
                                    ),
                                  }),
                                ],
                              }),
                              (0, i.jsxs)('div', {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-700 p-3',
                                children: [
                                  (0, i.jsx)('div', {
                                    className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                                    children: c('comparison.avgDaily'),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-lg font-bold text-gray-900 dark:text-white',
                                    children: K.current.averageDailyPoints.toLocaleString(
                                      'tr' === d ? 'tr-TR' : 'en-US'
                                    ),
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-xs mt-1',
                                    children: z(
                                      K.change.averageDaily,
                                      K.change.averageDailyPercent,
                                      !1
                                    ),
                                  }),
                                ],
                              }),
                              (0, i.jsxs)('div', {
                                className:
                                  'rounded-lg border border-gray-200 dark:border-gray-700 p-3',
                                children: [
                                  (0, i.jsx)('div', {
                                    className: 'text-xs text-gray-500 dark:text-gray-400 mb-1',
                                    children: c('comparison.completionRate'),
                                  }),
                                  (0, i.jsxs)('div', {
                                    className: 'text-lg font-bold text-gray-900 dark:text-white',
                                    children: [K.current.completionRate, '%'],
                                  }),
                                  (0, i.jsx)('div', {
                                    className: 'text-xs mt-1',
                                    children: z(
                                      K.change.completionRate,
                                      K.change.completionRatePercent,
                                      !0
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, i.jsx)('div', {
                            className: 'mt-4',
                            children: (0, i.jsx)(D.h, {
                              width: '100%',
                              height: g ? 200 : 250,
                              children: (0, i.jsxs)(M.v, {
                                data: [
                                  {
                                    period: (0, x.WU)(K.previous.startDate, 'MMM yyyy', {
                                      locale: v,
                                    }),
                                    points: K.previous.totalPoints,
                                    activities: K.previous.totalActivities,
                                  },
                                  {
                                    period: (0, x.WU)(K.current.startDate, 'MMM yyyy', {
                                      locale: v,
                                    }),
                                    points: K.current.totalPoints,
                                    activities: K.current.totalActivities,
                                  },
                                ],
                                children: [
                                  (0, i.jsx)(w.q, { strokeDasharray: '3 3', stroke: '#e5e7eb' }),
                                  (0, i.jsx)(R.K, {
                                    dataKey: 'period',
                                    tick: { fontSize: g ? 10 : 12 },
                                  }),
                                  (0, i.jsx)(A.B, { tick: { fontSize: g ? 10 : 12 } }),
                                  (0, i.jsx)(S.u, {
                                    formatter: (t) => [
                                      t.toLocaleString('tr' === d ? 'tr-TR' : 'en-US'),
                                      '',
                                    ],
                                    labelStyle: { color: '#374151' },
                                    contentStyle: {
                                      backgroundColor: '#fff',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '8px',
                                    },
                                  }),
                                  (0, i.jsx)(U.$, {
                                    dataKey: 'points',
                                    fill: '#3b82f6',
                                    name: c('comparison.points'),
                                  }),
                                  (0, i.jsx)(U.$, {
                                    dataKey: 'activities',
                                    fill: '#10b981',
                                    name: c('comparison.activities'),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            })
          : null;
      });
    },
    27742: function (t, e, a) {
      a.d(e, {
        V: function () {
          return r;
        },
      });
      var i = a(99649);
      function r(t) {
        let e = (0, i.Q)(t),
          a = e.getMonth();
        return (e.setFullYear(e.getFullYear(), a + 1, 0), e.setHours(23, 59, 59, 999), e);
      }
    },
    86035: function (t, e, a) {
      a.d(e, {
        v: function () {
          return o;
        },
      });
      var i = a(99649),
        r = a(55528);
      function o(t, e) {
        var a, o, n, s, l, c, d, g;
        let v = (0, r.j)(),
          x =
            null !==
              (g =
                null !==
                  (d =
                    null !==
                      (c =
                        null !== (l = null == e ? void 0 : e.weekStartsOn) && void 0 !== l
                          ? l
                          : null == e
                            ? void 0
                            : null === (o = e.locale) || void 0 === o
                              ? void 0
                              : null === (a = o.options) || void 0 === a
                                ? void 0
                                : a.weekStartsOn) && void 0 !== c
                      ? c
                      : v.weekStartsOn) && void 0 !== d
                  ? d
                  : null === (s = v.locale) || void 0 === s
                    ? void 0
                    : null === (n = s.options) || void 0 === n
                      ? void 0
                      : n.weekStartsOn) && void 0 !== g
              ? g
              : 0,
          m = (0, i.Q)(t),
          u = m.getDay();
        return (
          m.setDate(m.getDate() + ((u < x ? -7 : 0) + 6 - (u - x))),
          m.setHours(23, 59, 59, 999),
          m
        );
      }
    },
    95775: function (t, e, a) {
      a.d(e, {
        _: function () {
          return r;
        },
      });
      var i = a(99649);
      function r(t, e) {
        let a = +(0, i.Q)(t),
          [r, o] = [+(0, i.Q)(e.start), +(0, i.Q)(e.end)].sort((t, e) => t - e);
        return a >= r && a <= o;
      }
    },
    63070: function (t, e, a) {
      a.d(e, {
        N: function () {
          return r;
        },
      });
      var i = a(99649);
      function r(t) {
        let e = (0, i.Q)(t);
        return (e.setDate(1), e.setHours(0, 0, 0, 0), e);
      }
    },
  },
]);
