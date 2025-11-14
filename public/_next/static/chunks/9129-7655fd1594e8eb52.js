'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [9129],
  {
    10480: function (e, t, n) {
      n.d(t, {
        N: function () {
          return s;
        },
        P: function () {
          return u;
        },
      });
      var i = n(57437),
        r = n(2265),
        a = n(54887),
        o = n(78705),
        l = n(78466);
      let c = (0, r.createContext)(null);
      function s(e) {
        let { children: t } = e,
          [n, s] = (0, r.useState)([]),
          [u, d] = (0, r.useState)(!1),
          y = (0, l.d)();
        (0, r.useEffect)(() => {
          d(!0);
        }, []);
        let f = (0, r.useCallback)(function (e) {
          let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'success',
            n = Math.random().toString(36).slice(2);
          (s((i) => [...i, { id: n, message: e, type: t }]),
            setTimeout(() => {
              s((e) => e.filter((e) => e.id !== n));
            }, o.LS.TOAST_DURATION));
        }, []);
        return (0, i.jsxs)(c.Provider, {
          value: { showToast: f },
          children: [
            t,
            u &&
              (0, a.createPortal)(
                (0, i.jsx)('div', {
                  className: 'fixed z-[10000] flex flex-col gap-2 '.concat(
                    y ? 'bottom-4 left-4 right-4 safe-bottom' : 'bottom-4 right-4'
                  ),
                  children: n.map((e) =>
                    (0, i.jsx)(
                      'div',
                      {
                        className: ''
                          .concat(
                            y ? 'w-full max-w-sm' : 'max-w-md',
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
      function u() {
        let e = (0, r.useContext)(c);
        if (!e) throw Error('useToaster must be used within ToasterProvider');
        return e;
      }
    },
    14258: function (e, t, n) {
      function i(e, t) {
        return 'en' === t && e.labelEn ? e.labelEn : e.label;
      }
      function r(e, t) {
        return 'en' === t && e.unitEn ? e.unitEn : e.unit;
      }
      function a(e, t) {
        return 'en' === t && e.descriptionEn ? e.descriptionEn : e.description;
      }
      n.d(t, {
        Jt: function () {
          return r;
        },
        Xr: function () {
          return i;
        },
        dE: function () {
          return a;
        },
      });
    },
    13224: function (e, t, n) {
      n.d(t, {
        F: function () {
          return y;
        },
        X: function () {
          return d;
        },
      });
      var i = n(57437),
        r = n(2265),
        a = n(84247),
        o = n(24979),
        l = n(58151),
        c = n(60186),
        s = n(78705);
      let u = (0, r.createContext)(null);
      function d(e) {
        let { children: t } = e,
          { activities: n, hydrated: d } = (0, o.G$)(),
          { settings: y, hydrated: f } = (0, l.rV)(),
          [m, g] = (0, r.useState)([]),
          [p, h] = (0, r.useState)(!1),
          D = (null == y ? void 0 : y.dailyTarget) && y.dailyTarget > 0 ? y.dailyTarget : c.Dy;
        (0, r.useEffect)(() => {
          if (d && f)
            try {
              let e = localStorage.getItem(s.I.BADGES);
              if (e) {
                let t = JSON.parse(e).map((e) => ({
                  ...e,
                  unlockedAt: e.unlockedAt ? new Date(e.unlockedAt) : void 0,
                }));
                g(t);
              }
            } catch (e) {
              console.error('Failed to load badges:', e);
            } finally {
              h(!0);
            }
        }, [d, f]);
        let k = (0, r.useCallback)((e) => {
            try {
              (localStorage.setItem(s.I.BADGES, JSON.stringify(e)), g(e));
            } catch (e) {
              console.error('Failed to save badges:', e);
            }
          }, []),
          v = (0, r.useCallback)(() => {
            if (!p || 0 === n.length) return [];
            let e = new Set(m.map((e) => e.id)),
              t = (0, a.g)(n, y, D, m).filter((t) => !e.has(t.id));
            return t.length > 0 ? (k([...m, ...t]), t) : [];
          }, [n, y, D, m, p, k]),
          w = (0, r.useCallback)(
            (e) => {
              m.some((t) => t.id === e.id) || k([...m, { ...e, unlockedAt: new Date() }]);
            },
            [m, k]
          ),
          b = (0, r.useMemo)(
            () => ({ badges: m, hydrated: p, checkNewBadges: v, unlockBadge: w }),
            [m, p, v, w]
          );
        return (0, i.jsx)(u.Provider, { value: b, children: t });
      }
      function y() {
        let e = (0, r.useContext)(u);
        if (!e) throw Error('useBadges must be used within BadgeProvider');
        return e;
      }
    },
    84247: function (e, t, n) {
      n.d(t, {
        g: function () {
          return c;
        },
        y: function () {
          return l;
        },
      });
      var i = n(56942),
        r = n(60936),
        a = n(16357),
        o = n(5341);
      let l = {
        first_activity: {
          id: 'first_activity',
          name: { tr: 'İlk Adım', en: 'First Step' },
          description: { tr: 'İlk aktiviteni ekle', en: 'Add your first activity' },
          icon: '\uD83C\uDFAF',
          category: 'special',
          rarity: 'common',
        },
        streak_7: {
          id: 'streak_7',
          name: { tr: '7 G\xfcnl\xfck Seri', en: '7 Day Streak' },
          description: {
            tr: '7 g\xfcn \xfcst \xfcste hedefini tamamla',
            en: 'Complete your goal 7 days in a row',
          },
          icon: '\uD83D\uDD25',
          category: 'streak',
          rarity: 'common',
        },
        streak_30: {
          id: 'streak_30',
          name: { tr: '30 G\xfcnl\xfck Seri', en: '30 Day Streak' },
          description: {
            tr: '30 g\xfcn \xfcst \xfcste hedefini tamamla',
            en: 'Complete your goal 30 days in a row',
          },
          icon: '\uD83D\uDCAA',
          category: 'streak',
          rarity: 'rare',
        },
        streak_100: {
          id: 'streak_100',
          name: { tr: '100 G\xfcnl\xfck Seri', en: '100 Day Streak' },
          description: {
            tr: '100 g\xfcn \xfcst \xfcste hedefini tamamla',
            en: 'Complete your goal 100 days in a row',
          },
          icon: '\uD83D\uDC51',
          category: 'streak',
          rarity: 'legendary',
        },
        points_10k: {
          id: 'points_10k',
          name: { tr: '10K Puan', en: '10K Points' },
          description: { tr: 'Toplamda 10.000 puan kazan', en: 'Earn 10,000 total points' },
          icon: '⭐',
          category: 'points',
          rarity: 'common',
        },
        points_50k: {
          id: 'points_50k',
          name: { tr: '50K Puan', en: '50K Points' },
          description: { tr: 'Toplamda 50.000 puan kazan', en: 'Earn 50,000 total points' },
          icon: '\uD83C\uDF1F',
          category: 'points',
          rarity: 'rare',
        },
        points_100k: {
          id: 'points_100k',
          name: { tr: '100K Puan', en: '100K Points' },
          description: { tr: 'Toplamda 100.000 puan kazan', en: 'Earn 100,000 total points' },
          icon: '\uD83D\uDCAB',
          category: 'points',
          rarity: 'epic',
        },
        points_500k: {
          id: 'points_500k',
          name: { tr: '500K Puan', en: '500K Points' },
          description: { tr: 'Toplamda 500.000 puan kazan', en: 'Earn 500,000 total points' },
          icon: '\uD83C\uDFC6',
          category: 'points',
          rarity: 'legendary',
        },
        activities_100: {
          id: 'activities_100',
          name: { tr: '100 Aktivite', en: '100 Activities' },
          description: { tr: '100 aktivite ekle', en: 'Add 100 activities' },
          icon: '\uD83D\uDCDD',
          category: 'activities',
          rarity: 'common',
        },
        activities_500: {
          id: 'activities_500',
          name: { tr: '500 Aktivite', en: '500 Activities' },
          description: { tr: '500 aktivite ekle', en: 'Add 500 activities' },
          icon: '\uD83D\uDCCA',
          category: 'activities',
          rarity: 'rare',
        },
        activities_1000: {
          id: 'activities_1000',
          name: { tr: '1000 Aktivite', en: '1000 Activities' },
          description: { tr: '1000 aktivite ekle', en: 'Add 1000 activities' },
          icon: '\uD83C\uDF96️',
          category: 'activities',
          rarity: 'epic',
        },
        all_activities: {
          id: 'all_activities',
          name: { tr: 'T\xfcm Aktiviteler', en: 'All Activities' },
          description: { tr: 'T\xfcm aktivite t\xfcrlerini dene', en: 'Try all activity types' },
          icon: '\uD83C\uDFAF',
          category: 'special',
          rarity: 'rare',
        },
        weekend_warrior: {
          id: 'weekend_warrior',
          name: { tr: 'Hafta Sonu Savaş\xe7ısı', en: 'Weekend Warrior' },
          description: { tr: 'Hafta sonu aktiviteleri yap', en: 'Do activities on weekends' },
          icon: '\uD83C\uDFCB️',
          category: 'special',
          rarity: 'common',
        },
        early_bird: {
          id: 'early_bird',
          name: { tr: 'Erken Kuş', en: 'Early Bird' },
          description: { tr: 'Sabah 6-9 arası aktivite yap', en: 'Do activities between 6-9 AM' },
          icon: '\uD83C\uDF05',
          category: 'special',
          rarity: 'common',
        },
        night_owl: {
          id: 'night_owl',
          name: { tr: 'Gece Kuşu', en: 'Night Owl' },
          description: {
            tr: 'Gece 21-24 arası aktivite yap',
            en: 'Do activities between 9 PM-12 AM',
          },
          icon: '\uD83E\uDD89',
          category: 'special',
          rarity: 'common',
        },
        perfect_week: {
          id: 'perfect_week',
          name: { tr: 'M\xfckemmel Hafta', en: 'Perfect Week' },
          description: {
            tr: 'Bir hafta boyunca her g\xfcn hedefini tamamla',
            en: 'Complete your goal every day for a week',
          },
          icon: '✨',
          category: 'special',
          rarity: 'rare',
        },
        perfect_month: {
          id: 'perfect_month',
          name: { tr: 'M\xfckemmel Ay', en: 'Perfect Month' },
          description: {
            tr: 'Bir ay boyunca her g\xfcn hedefini tamamla',
            en: 'Complete your goal every day for a month',
          },
          icon: '\uD83D\uDC8E',
          category: 'special',
          rarity: 'epic',
        },
      };
      function c(e, t, n) {
        let c = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [],
          s = [],
          u = new Set(c.map((e) => e.id));
        if (0 === e.length) return s;
        let d = e.reduce((e, t) => e + t.points, 0),
          y = e.length,
          f = new Set(e.map((e) => e.activityKey)),
          m = new Map();
        for (let t of e) {
          let e = (0, i.b)((0, r.D)(t.performedAt)).toISOString();
          m.set(e, (m.get(e) || 0) + t.points);
        }
        let g = Array.from(m.entries())
            .map((e) => {
              let [t, n] = e;
              return { date: new Date(t), points: n };
            })
            .sort((e, t) => t.date.getTime() - e.date.getTime()),
          p = 0,
          h = (0, i.b)(new Date());
        for (let e of g)
          if ((0, a.K)(e.date, h) || (0, a.K)(e.date, (0, i.b)((0, o.k)(h, p)))) {
            if (e.points >= n) p++;
            else break;
          } else break;
        for (let [t, a] of Object.entries(l)) {
          if (u.has(t)) continue;
          let l = !1;
          switch (t) {
            case 'first_activity':
              l = y >= 1;
              break;
            case 'streak_7':
              l = p >= 7;
              break;
            case 'streak_30':
              l = p >= 30;
              break;
            case 'streak_100':
              l = p >= 100;
              break;
            case 'points_10k':
              l = d >= 1e4;
              break;
            case 'points_50k':
              l = d >= 5e4;
              break;
            case 'points_100k':
              l = d >= 1e5;
              break;
            case 'points_500k':
              l = d >= 5e5;
              break;
            case 'activities_100':
              l = y >= 100;
              break;
            case 'activities_500':
              l = y >= 500;
              break;
            case 'activities_1000':
              l = y >= 1e3;
              break;
            case 'all_activities':
              l = f.size >= 8;
              break;
            case 'weekend_warrior':
              l = e.some((e) => {
                let t = (0, r.D)(e.performedAt).getDay();
                return 0 === t || 6 === t;
              });
              break;
            case 'early_bird':
              l = e.some((e) => {
                let t = (0, r.D)(e.performedAt).getHours();
                return t >= 6 && t < 9;
              });
              break;
            case 'night_owl':
              l = e.some((e) => {
                let t = (0, r.D)(e.performedAt).getHours();
                return t >= 21 || t < 24;
              });
              break;
            case 'perfect_week':
              l = Array.from({ length: 7 }, (e, t) => (0, i.b)((0, o.k)(h, t))).every((e) => {
                let t = e.toISOString();
                return (m.get(t) || 0) >= n;
              });
              break;
            case 'perfect_month':
              l = Array.from({ length: 30 }, (e, t) => (0, i.b)((0, o.k)(h, t))).every((e) => {
                let t = e.toISOString();
                return (m.get(t) || 0) >= n;
              });
          }
          l && s.push({ ...a, unlockedAt: new Date() });
        }
        return s;
      }
    },
    6013: function (e, t, n) {
      n.d(t, {
        B: function () {
          return y;
        },
        U: function () {
          return d;
        },
      });
      var i = n(57437),
        r = n(2265),
        a = n(24979),
        o = n(58151),
        l = n(89805),
        c = n(78705),
        s = n(60186);
      let u = (0, r.createContext)(null);
      function d(e) {
        let { children: t } = e,
          { activities: n, hydrated: d } = (0, a.G$)(),
          { settings: y, hydrated: f } = (0, o.rV)(),
          [m, g] = (0, r.useState)([]),
          [p, h] = (0, r.useState)(!1);
        ((0, r.useEffect)(() => {
          var e, t;
          if (d && f)
            try {
              let t = localStorage.getItem(c.I.CHALLENGES);
              if (t) {
                let e = JSON.parse(t);
                if (
                  e.some(
                    (e) => 'weekly' === e.type && e.id.startsWith('weekly-') && 5e4 === e.target
                  )
                )
                  g(e);
                else {
                  let t = (0, l.sI)();
                  g([...e, t]);
                }
              } else {
                let t =
                    null !== (e = null == y ? void 0 : y.dailyTarget) && void 0 !== e ? e : s.Dy,
                  n = (0, l.x)(t),
                  i = (0, l.sI)();
                g([n, i]);
              }
            } catch (n) {
              console.error('Failed to load challenges:', n);
              let e = null !== (t = null == y ? void 0 : y.dailyTarget) && void 0 !== t ? t : s.Dy;
              g([(0, l.x)(e), (0, l.sI)()]);
            } finally {
              h(!0);
            }
        }, [d, f, null == y ? void 0 : y.dailyTarget]),
          (0, r.useEffect)(() => {
            if (!p || !(null == y ? void 0 : y.dailyTarget)) return;
            let e = m.find((e) => 'daily' === e.type && e.id.startsWith('daily-'));
            if (e && e.target !== y.dailyTarget) {
              let t = new Date().toISOString().split('T')[0];
              if (e.startDate.startsWith(t))
                g(m.map((t) => (t.id === e.id ? { ...t, target: y.dailyTarget } : t)));
              else {
                let t = (0, l.x)(y.dailyTarget);
                g([...m.filter((t) => t.id !== e.id), t]);
              }
            }
          }, [null == y ? void 0 : y.dailyTarget, p, m]));
        let D = (0, r.useCallback)((e) => {
          try {
            (localStorage.setItem(c.I.CHALLENGES, JSON.stringify(e)), g(e));
          } catch (e) {
            console.error('Failed to save challenges:', e);
          }
        }, []);
        (0, r.useEffect)(() => {
          if (!p || 0 === m.length) return;
          let e = m.map((e) => {
            let t = (0, l.zv)(e, n);
            return (0, l.eT)(e, t);
          });
          e.some((e, t) => {
            let n = m[t];
            return (
              e.status !== n.status || e.progress !== n.progress || e.completedAt !== n.completedAt
            );
          }) && D(e);
        }, [n, p, m, D]);
        let k = (0, r.useCallback)(
            (e) => {
              D([...m, e]);
            },
            [m, D]
          ),
          v = (0, r.useCallback)(
            (e, t) => {
              D(m.map((n) => (n.id === e ? { ...n, ...t } : n)));
            },
            [m, D]
          ),
          w = (0, r.useCallback)(
            (e) => {
              let t = m.find((t) => t.id === e);
              ((null == t ? void 0 : t.type) === 'daily' && t.id.startsWith('daily-')) ||
                D(m.filter((t) => t.id !== e));
            },
            [m, D]
          ),
          b = (0, r.useCallback)(
            (e) => {
              let t = m.find((t) => t.id === e);
              return t ? (0, l.zv)(t, n) : null;
            },
            [m, n]
          ),
          S = (0, r.useCallback)(
            () => m.filter((e) => (0, l.zv)(e, n).isCompleted && 'active' === e.status),
            [m, n]
          ),
          C = (0, r.useMemo)(
            () => ({
              challenges: m,
              hydrated: p,
              addChallenge: k,
              updateChallenge: v,
              deleteChallenge: w,
              getChallengeProgress: b,
              checkCompletedChallenges: S,
            }),
            [m, p, k, v, w, b, S]
          );
        return (0, i.jsx)(u.Provider, { value: C, children: t });
      }
      function y() {
        let e = (0, r.useContext)(u);
        if (!e) throw Error('useChallenges must be used within ChallengeProvider');
        return e;
      }
    },
    89805: function (e, t, n) {
      n.d(t, {
        TT: function () {
          return g;
        },
        Vg: function () {
          return h;
        },
        Zp: function () {
          return p;
        },
        bg: function () {
          return m;
        },
        eT: function () {
          return f;
        },
        sI: function () {
          return k;
        },
        x: function () {
          return D;
        },
        zv: function () {
          return y;
        },
      });
      var i = n(60936),
        r = n(95775),
        a = n(56942),
        o = n(7641),
        l = n(34479),
        c = n(65696),
        s = n(86035),
        u = n(63070),
        d = n(27742);
      function y(e, t) {
        let n;
        let o = (0, i.D)(e.startDate),
          l = e.endDate ? (0, i.D)(e.endDate) : new Date(),
          c = t
            .filter((e) => {
              let t = (0, i.D)(e.performedAt);
              return (0, r._)(t, { start: o, end: l });
            })
            .reduce((e, t) => e + t.points, 0),
          s = e.target;
        if ('active' === e.status && e.endDate) {
          let t = (0, i.D)(e.endDate),
            r = (0, a.b)(new Date());
          n = Math.max(0, Math.ceil((t.getTime() - r.getTime()) / 864e5));
        }
        return {
          current: c,
          target: s,
          percentage: s > 0 ? Math.min(100, (c / s) * 100) : 0,
          isCompleted: c >= s,
          daysRemaining: n,
        };
      }
      function f(e, t) {
        let n = new Date(),
          r = e.endDate ? (0, i.D)(e.endDate) : null;
        return r && n > r && 'active' === e.status
          ? t.isCompleted
            ? { ...e, status: 'completed', progress: t.current, completedAt: r.toISOString() }
            : { ...e, status: 'expired', progress: t.current }
          : t.isCompleted && 'active' === e.status
            ? { ...e, status: 'completed', progress: t.current, completedAt: n.toISOString() }
            : { ...e, progress: t.current };
      }
      function m(e, t) {
        let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
          i = arguments.length > 3 ? arguments[3] : void 0,
          r = (0, a.b)(n),
          c = (0, o.i)(n);
        return {
          id: 'daily-'.concat((0, l.WU)(r, 'yyyy-MM-dd'), '-').concat(Date.now()),
          type: 'daily',
          name: e,
          description: {
            tr: 'Bug\xfcn '.concat(t.toLocaleString('tr-TR'), ' puan hedefi'),
            en: "Today's ".concat(t.toLocaleString('en-US'), ' points goal'),
          },
          target: t,
          startDate: r.toISOString(),
          endDate: c.toISOString(),
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
          icon: i || '\uD83C\uDFAF',
        };
      }
      function g(e, t) {
        let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
          i = arguments.length > 3 ? arguments[3] : void 0,
          r = (0, c.z)(n, { weekStartsOn: 1 }),
          a = (0, s.v)(r, { weekStartsOn: 1 });
        return {
          id: 'weekly-'.concat((0, l.WU)(r, 'yyyy-MM-dd'), '-').concat(Date.now()),
          type: 'weekly',
          name: e,
          description: {
            tr: 'Bu hafta '.concat(t.toLocaleString('tr-TR'), ' puan hedefi'),
            en: "This week's ".concat(t.toLocaleString('en-US'), ' points goal'),
          },
          target: t,
          startDate: r.toISOString(),
          endDate: a.toISOString(),
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
          icon: i || '\uD83D\uDCC5',
        };
      }
      function p(e, t) {
        let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
          i = arguments.length > 3 ? arguments[3] : void 0,
          r = (0, u.N)(n),
          a = (0, d.V)(r);
        return {
          id: 'monthly-'.concat((0, l.WU)(r, 'yyyy-MM'), '-').concat(Date.now()),
          type: 'monthly',
          name: e,
          description: {
            tr: 'Bu ay '.concat(t.toLocaleString('tr-TR'), ' puan hedefi'),
            en: "This month's ".concat(t.toLocaleString('en-US'), ' points goal'),
          },
          target: t,
          startDate: r.toISOString(),
          endDate: a.toISOString(),
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
          icon: i || '\uD83D\uDCC6',
        };
      }
      function h(e, t, n, i, r, a) {
        return {
          id: 'custom-'.concat(Date.now()),
          type: 'custom',
          name: e,
          description: t,
          target: n,
          startDate: i.toISOString(),
          endDate: r.toISOString(),
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
          icon: a || '\uD83C\uDFC6',
        };
      }
      function D(e) {
        return m({ tr: 'G\xfcnl\xfck Hedef', en: 'Daily Goal' }, e, new Date(), '⭐');
      }
      function k() {
        return g({ tr: 'Haftalık Hedef', en: 'Weekly Goal' }, 5e4, new Date(), '\uD83D\uDD25');
      }
    },
    76376: function (e, t, n) {
      n.d(t, {
        Y: function () {
          return s;
        },
        l: function () {
          return u;
        },
      });
      var i = n(57437),
        r = n(2265),
        a = n(24979),
        o = n(16239),
        l = n(78705);
      let c = (0, r.createContext)(null);
      function s(e) {
        let { children: t } = e,
          { activities: n, hydrated: s } = (0, a.G$)(),
          [u, d] = (0, r.useState)(0),
          [y, f] = (0, r.useState)(!1),
          m = (0, r.useMemo)(() => (0, o.wD)(n), [n]);
        ((0, r.useEffect)(() => {
          if (s)
            try {
              let e = localStorage.getItem(l.I.LEVELS);
              if (e) {
                let t = JSON.parse(e);
                d(t.totalXP);
              } else d(m);
            } catch (e) {
              (console.error('Failed to load level data:', e), d(m));
            } finally {
              f(!0);
            }
        }, [s, m]),
          (0, r.useEffect)(() => {
            if (y)
              try {
                (localStorage.setItem(l.I.LEVELS, JSON.stringify({ totalXP: m })), d(m));
              } catch (e) {
                console.error('Failed to save level data:', e);
              }
          }, [m, y]));
        let g = (0, r.useMemo)(() => (0, o.jr)(m), [m]),
          p = (0, r.useCallback)(() => (y ? (0, o.VE)(u, m) : null), [u, m, y]),
          h = (0, r.useMemo)(() => ({ levelInfo: g, hydrated: y, checkLevelUp: p }), [g, y, p]);
        return (0, i.jsx)(c.Provider, { value: h, children: t });
      }
      function u() {
        let e = (0, r.useContext)(c);
        if (!e) throw Error('useLevel must be used within LevelProvider');
        return e;
      }
    },
    16239: function (e, t, n) {
      function i(e) {
        var t;
        return (t = e + 1) <= 1 ? 0 : Math.floor((1e3 * t * (t - 1)) / 2);
      }
      function r(e) {
        return e < 1e3 ? 1 : Math.max(1, Math.floor((-1 + Math.sqrt(1 + (8 * e) / 1e3)) / 2));
      }
      function a(e) {
        return e.reduce((e, t) => e + t.points, 0);
      }
      function o(e) {
        let t = r(e),
          n = i(t - 1),
          a = i(t),
          o = e - n,
          l = a - n;
        return {
          level: t,
          currentXP: o,
          xpForCurrentLevel: n,
          xpForNextLevel: a,
          progress: Math.min(1, Math.max(0, l > 0 ? o / l : 1)),
          totalXP: e,
        };
      }
      function l(e, t) {
        let n = r(e),
          i = r(t);
        return i > n ? i : null;
      }
      function c(e, t) {
        return e < 5
          ? 'tr' === t
            ? 'Başlangı\xe7'
            : 'Beginner'
          : e < 10
            ? 'tr' === t
              ? 'Acemi'
              : 'Novice'
            : e < 15
              ? 'tr' === t
                ? 'Deneyimli'
                : 'Experienced'
              : e < 20
                ? 'tr' === t
                  ? 'Uzman'
                  : 'Expert'
                : e < 30
                  ? 'tr' === t
                    ? 'Usta'
                    : 'Master'
                  : e < 40
                    ? 'tr' === t
                      ? 'Efsane'
                      : 'Legend'
                    : 'tr' === t
                      ? 'Efsanevi'
                      : 'Mythic';
      }
      n.d(t, {
        VE: function () {
          return l;
        },
        jr: function () {
          return o;
        },
        wD: function () {
          return a;
        },
        yF: function () {
          return c;
        },
      });
    },
    88270: function (e, t, n) {
      n.d(t, {
        BF: function () {
          return a;
        },
        dl: function () {
          return i;
        },
      });
      let i = {
        enabled: !1,
        dailyReminder: !0,
        dailyReminderTime: '20:00',
        goalCompletion: !0,
        streakReminder: !0,
        streakReminderTime: '21:00',
      };
      class r {
        static getInstance() {
          return (r.instance || (r.instance = new r()), r.instance);
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
              let n = new Notification(e, {
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                tag: 'sporttrack',
                requireInteraction: !1,
                ...t,
              });
              (setTimeout(() => {
                n.close();
              }, 5e3),
                (n.onclick = () => {
                  (window.focus(), n.close());
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
          let n = {
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
          await this.showNotification(n[e].title, {
            body: n[e].body,
            tag: 'goal-completion',
            requireInteraction: !0,
          });
        }
        async showStreakReminder(e, t) {
          if (!this.canNotify()) return;
          let n = {
            tr: {
              title: '\uD83D\uDD25 Seri Devam Ediyor!',
              body: ''.concat(t, ' g\xfcnl\xfck serin var! Bug\xfcn de hedefini tamamla!'),
            },
            en: {
              title: '\uD83D\uDD25 Streak Continues!',
              body: 'You have a '.concat(t, '-day streak! Complete your goal today too!'),
            },
          };
          await this.showNotification(n[e].title, { body: n[e].body, tag: 'streak-reminder' });
        }
        async showBadgeUnlocked(e, t, n) {
          if (!this.canNotify()) return;
          let i = {
            tr: {
              title: ''.concat(n, ' Yeni Rozet Kazandın!'),
              body: ''.concat(t, ' rozetini kazandın!'),
            },
            en: {
              title: ''.concat(n, ' New Badge Unlocked!'),
              body: 'You earned the '.concat(t, ' badge!'),
            },
          };
          await this.showNotification(i[e].title, {
            body: i[e].body,
            tag: 'badge-unlocked',
            requireInteraction: !0,
          });
        }
        async showLevelUp(e, t) {
          if (!this.canNotify()) return;
          let n = {
            tr: {
              title: '\uD83C\uDF89 Seviye Atladın!',
              body: 'Tebrikler! Seviye '.concat(t, "'e ulaştın!"),
            },
            en: {
              title: '\uD83C\uDF89 Level Up!',
              body: 'Congratulations! You reached level '.concat(t, '!'),
            },
          };
          await this.showNotification(n[e].title, {
            body: n[e].body,
            tag: 'level-up',
            requireInteraction: !0,
          });
        }
        async showChallengeCompleted(e, t, n) {
          if (!this.canNotify()) return;
          let i = {
            tr: {
              title: ''.concat(n, ' Zorluk Tamamlandı!'),
              body: 'Tebrikler! "'.concat(t, '" zorluğunu tamamladın!'),
            },
            en: {
              title: ''.concat(n, ' Challenge Completed!'),
              body: 'Congratulations! You completed the "'.concat(t, '" challenge!'),
            },
          };
          await this.showNotification(i[e].title, {
            body: i[e].body,
            tag: 'challenge-completed',
            requireInteraction: !0,
          });
        }
        startDailyReminderCheck(e, t, n) {
          (this.checkInterval && clearInterval(this.checkInterval),
            e.enabled &&
              e.dailyReminder &&
              (this.checkInterval = setInterval(() => {
                let t = new Date(),
                  [i, r] = e.dailyReminderTime.split(':').map(Number),
                  a = new Date();
                (a.setHours(i, r, 0, 0), 6e4 > Math.abs(t.getTime() - a.getTime()) && n());
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
      let a = r.getInstance();
    },
  },
]);
