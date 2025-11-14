'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [5122],
  {
    15122: function (e, t, a) {
      (a.r(t),
        a.d(t, {
          PersonalRecords: function () {
            return p;
          },
        }));
      var r = a(57437),
        s = a(2265),
        i = a(98661),
        l = a(24979),
        n = a(58151),
        o = a(60186),
        d = a(56942),
        c = a(60936);
      function u(e, t) {
        switch (e.type) {
          case 'points':
            return ''
              .concat(e.value.toLocaleString('tr' === t ? 'tr-TR' : 'en-US'), ' ')
              .concat('tr' === t ? 'puan' : 'points');
          case 'amount':
            return e.value.toLocaleString('tr' === t ? 'tr-TR' : 'en-US');
          case 'streak':
            return ''.concat(e.value, ' ').concat('tr' === t ? 'g\xfcn' : 'days');
          case 'speed':
            return ''.concat(e.value, ' ').concat('tr' === t ? 'saat' : 'hours');
          default:
            return String(e.value);
        }
      }
      var m = a(34479),
        g = a(8608),
        h = a(71598),
        x = a(78466);
      let p = (0, s.memo)(function () {
        let { activities: e, hydrated: t } = (0, l.G$)(),
          { settings: a } = (0, n.rV)(),
          { t: p, lang: y } = (0, i.Q)(),
          v = (0, x.d)(),
          b = 'tr' === y ? g.tr : h._,
          f = (null == a ? void 0 : a.dailyTarget) && a.dailyTarget > 0 ? a.dailyTarget : o.Dy,
          k = (0, s.useMemo)(
            () =>
              t && 0 !== e.length
                ? (function (e, t) {
                    if (0 === e.length) return [];
                    let a = [],
                      r = new Map();
                    for (let t of e) {
                      let e = (0, d.b)((0, c.D)(t.performedAt)),
                        a = e.toISOString(),
                        s = r.get(a);
                      s
                        ? ((s.points += t.points), s.activities.push(t))
                        : r.set(a, { date: e, points: t.points, activities: [t] });
                    }
                    let s = Array.from(r.values()).sort(
                      (e, t) => e.date.getTime() - t.date.getTime()
                    );
                    if (s.length > 0) {
                      let e = s.reduce((e, t) => (t.points > e.points ? t : e));
                      a.push({
                        id: 'best-day',
                        type: 'points',
                        value: e.points,
                        date: e.date.toISOString(),
                        label: { tr: 'En İyi G\xfcn', en: 'Best Day' },
                        icon: '⭐',
                      });
                    }
                    let i = 0,
                      l = null,
                      n = null,
                      o = 0,
                      u = null;
                    for (let e of s)
                      e.points >= t
                        ? (0 === o && (u = e.date), ++o > i && ((i = o), (l = u), (n = e.date)))
                        : ((o = 0), (u = null));
                    i > 0 &&
                      l &&
                      n &&
                      a.push({
                        id: 'longest-streak',
                        type: 'streak',
                        value: i,
                        date: l.toISOString(),
                        label: { tr: 'En Uzun Seri', en: 'Longest Streak' },
                        icon: '\uD83D\uDD25',
                      });
                    let m = [];
                    for (let e of s)
                      if (e.points >= t) {
                        let a = [...e.activities].sort(
                            (e, t) =>
                              (0, c.D)(e.performedAt).getTime() - (0, c.D)(t.performedAt).getTime()
                          ),
                          r = 0;
                        for (let e of a)
                          if ((r += e.points) >= t) {
                            let t = (0, c.D)(e.performedAt),
                              a = (0, d.b)(t),
                              r = (t.getTime() - a.getTime()) / 36e5;
                            m.push({ hours: r, date: t.toISOString() });
                            break;
                          }
                      }
                    if (m.length > 0) {
                      let e = m.reduce((e, t) => (t.hours < e.hours ? t : e));
                      a.push({
                        id: 'fastest-goal',
                        type: 'speed',
                        value: Math.round(10 * e.hours) / 10,
                        date: e.date,
                        label: { tr: 'En Hızlı Hedef Tamamlama', en: 'Fastest Goal Completion' },
                        icon: '⚡',
                      });
                    }
                    let g = new Map();
                    for (let t of e) {
                      let e = t.activityKey,
                        a = g.get(e) || [];
                      (a.push(t), g.set(e, a));
                    }
                    for (let [e, t] of g.entries()) {
                      if (0 === t.length) continue;
                      let r = t.reduce((e, t) => (t.points > e.points ? t : e)),
                        s = t.reduce((e, t) => (t.amount > e.amount ? t : e));
                      (a.push({
                        id: 'activity-'.concat(e, '-points'),
                        type: 'points',
                        activityKey: e,
                        value: r.points,
                        date: r.performedAt,
                        label: {
                          tr: ''.concat(t[0].label, ' - En Y\xfcksek Puan'),
                          en: ''.concat(t[0].labelEn || t[0].label, ' - Best Points'),
                        },
                        icon: t[0].icon || '\uD83C\uDFC3',
                      }),
                        a.push({
                          id: 'activity-'.concat(e, '-amount'),
                          type: 'amount',
                          activityKey: e,
                          value: s.amount,
                          date: s.performedAt,
                          label: {
                            tr: ''.concat(t[0].label, ' - En Y\xfcksek Miktar'),
                            en: ''.concat(t[0].labelEn || t[0].label, ' - Best Amount'),
                          },
                          icon: t[0].icon || '\uD83C\uDFC3',
                        }));
                    }
                    return a;
                  })(e, f)
                : [],
            [e, f, t]
          ),
          j = (0, s.useMemo)(() => {
            let e = { overall: [], activities: [] };
            for (let t of k) t.activityKey ? e.activities.push(t) : e.overall.push(t);
            return e;
          }, [k]);
        return t && 0 !== k.length
          ? (0, r.jsxs)('div', {
              className: 'spacing-lg',
              children: [
                (0, r.jsxs)('div', {
                  children: [
                    (0, r.jsx)('h2', {
                      className: 'text-heading-3 text-gray-900 dark:text-white mb-4',
                      children: p('records.title'),
                    }),
                    (0, r.jsx)('p', {
                      className: 'text-body text-gray-600 dark:text-gray-400 mb-4',
                      children: p('records.subtitle'),
                    }),
                  ],
                }),
                j.overall.length > 0 &&
                  (0, r.jsxs)('div', {
                    children: [
                      (0, r.jsx)('h3', {
                        className: 'text-sm font-medium text-gray-700 dark:text-gray-300 mb-3',
                        children: p('records.overall'),
                      }),
                      (0, r.jsx)('div', {
                        className: 'grid '.concat(
                          v ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3',
                          ' spacing-sm'
                        ),
                        children: j.overall.map((e) =>
                          (0, r.jsxs)(
                            'div',
                            {
                              className:
                                'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300',
                              children: [
                                (0, r.jsx)('div', {
                                  className: 'flex items-start justify-between mb-2',
                                  children: (0, r.jsxs)('div', {
                                    className: 'flex items-center gap-2',
                                    children: [
                                      (0, r.jsx)('span', {
                                        className: 'text-2xl',
                                        children: e.icon,
                                      }),
                                      (0, r.jsx)('div', {
                                        children: (0, r.jsx)('h4', {
                                          className:
                                            'text-sm font-semibold text-gray-900 dark:text-white',
                                          children: e.label[y],
                                        }),
                                      }),
                                    ],
                                  }),
                                }),
                                (0, r.jsx)('div', {
                                  className: ''.concat(
                                    v ? 'text-base' : 'text-lg',
                                    ' font-bold text-brand dark:text-brand-light mb-1'
                                  ),
                                  children: u(e, y),
                                }),
                                (0, r.jsx)('div', {
                                  className: 'text-body-small text-gray-600 dark:text-gray-400',
                                  children: (0, m.WU)((0, c.D)(e.date), 'dd MMM yyyy', {
                                    locale: b,
                                  }),
                                }),
                              ],
                            },
                            e.id
                          )
                        ),
                      }),
                    ],
                  }),
                j.activities.length > 0 &&
                  (0, r.jsxs)('div', {
                    children: [
                      (0, r.jsx)('h3', {
                        className: 'text-sm font-medium text-gray-700 dark:text-gray-300 mb-3',
                        children: p('records.byActivity'),
                      }),
                      (0, r.jsx)('div', {
                        className: 'grid '.concat(
                          v ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3',
                          ' spacing-sm'
                        ),
                        children: j.activities.map((e) =>
                          (0, r.jsxs)(
                            'div',
                            {
                              className:
                                'card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300',
                              children: [
                                (0, r.jsx)('div', {
                                  className: 'flex items-start justify-between mb-2',
                                  children: (0, r.jsxs)('div', {
                                    className: 'flex items-center gap-2',
                                    children: [
                                      (0, r.jsx)('span', {
                                        className: 'text-xl',
                                        children: e.icon,
                                      }),
                                      (0, r.jsx)('div', {
                                        children: (0, r.jsx)('h4', {
                                          className:
                                            'text-xs font-semibold text-gray-900 dark:text-white',
                                          children: e.label[y],
                                        }),
                                      }),
                                    ],
                                  }),
                                }),
                                (0, r.jsx)('div', {
                                  className: ''.concat(
                                    v ? 'text-sm' : 'text-base',
                                    ' font-bold text-brand dark:text-brand-light mb-1'
                                  ),
                                  children: u(e, y),
                                }),
                                (0, r.jsx)('div', {
                                  className: 'text-body-small text-gray-600 dark:text-gray-400',
                                  children: (0, m.WU)((0, c.D)(e.date), 'dd MMM yyyy', {
                                    locale: b,
                                  }),
                                }),
                              ],
                            },
                            e.id
                          )
                        ),
                      }),
                    ],
                  }),
              ],
            })
          : null;
      });
    },
  },
]);
