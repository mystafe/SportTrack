(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [395],
  {
    56674: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 37214));
    },
    37214: function (e, t, r) {
      'use strict';
      (r.r(t),
        r.d(t, {
          default: function () {
            return g;
          },
        }));
      var a = r(57437),
        n = r(2265),
        l = r(98661),
        i = r(6013),
        s = r(78466),
        o = r(60923),
        d = r(81178);
      let c = (0, n.lazy)(() =>
          r
            .e(161)
            .then(r.bind(r, 30161))
            .then((e) => ({ default: e.ChallengeCard }))
        ),
        u = (0, n.lazy)(() =>
          r
            .e(9137)
            .then(r.bind(r, 79137))
            .then((e) => ({ default: e.ChallengeDialog }))
        );
      function g() {
        let {
            challenges: e,
            hydrated: t,
            addChallenge: r,
            updateChallenge: g,
            deleteChallenge: m,
          } = (0, i.B)(),
          { t: f, lang: h } = (0, l.Q)(),
          x = (0, s.d)(),
          [v, y] = (0, n.useState)(!1),
          [b, p] = (0, n.useState)(null),
          [k, w] = (0, n.useState)(null);
        if (!t)
          return (0, a.jsxs)('div', {
            className: 'container py-6 sm:py-8',
            children: [
              (0, a.jsx)(d.IZ, {}),
              (0, a.jsx)('div', {
                className: 'mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
                children: [1, 2, 3].map((e) => (0, a.jsx)(d.XQ, {}, e)),
              }),
            ],
          });
        let D = e.filter((e) => 'active' === e.status),
          N = e.filter((e) => 'completed' === e.status),
          j = e.filter((e) => 'expired' === e.status || 'failed' === e.status),
          S = () => {
            (p(null), y(!0));
          },
          C = (e) => {
            (p(e), y(!0));
          },
          T = (e) => {
            w(e);
          };
        return (0, a.jsxs)('div', {
          className: 'container py-6 sm:py-8 page-transition',
          children: [
            (0, a.jsxs)('div', {
              className: 'mb-6',
              children: [
                (0, a.jsxs)('h1', {
                  className: 'text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-2 '.concat(
                    x ? 'title-entrance' : ''
                  ),
                  children: [
                    (0, a.jsx)('span', {
                      className: 'text-2xl sm:text-3xl '.concat(
                        x ? 'emoji-celebrate' : 'emoji-bounce'
                      ),
                      children: '\uD83C\uDFAF',
                    }),
                    (0, a.jsx)('span', {
                      className: 'text-gray-950 dark:text-white',
                      children: f('challenges.title'),
                    }),
                  ],
                }),
                (0, a.jsx)('p', {
                  className:
                    'text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 leading-relaxed',
                  children: f('challenges.subtitle'),
                }),
              ],
            }),
            (0, a.jsx)('div', {
              className: 'mb-6',
              children: (0, a.jsxs)('button', {
                type: 'button',
                onClick: S,
                className:
                  'px-4 py-2 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg hover:from-brand-dark hover:to-brand font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl '.concat(
                    x
                      ? 'touch-feedback mobile-press bounce-in-mobile'
                      : 'btn-enhanced scale-on-interact'
                  ),
                children: ['+ ', f('challenges.addChallenge')],
              }),
            }),
            0 === e.length
              ? (0, a.jsxs)('div', {
                  className:
                    'card-entrance text-center py-16 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-md hover:shadow-xl transition-shadow duration-300',
                  children: [
                    (0, a.jsx)('div', {
                      className: ''
                        .concat(x ? 'text-5xl' : 'text-6xl', ' mb-4 ')
                        .concat(x ? 'emoji-celebrate' : 'emoji-bounce'),
                      children: '\uD83C\uDFAF',
                    }),
                    (0, a.jsx)('p', {
                      className: ''.concat(
                        x ? 'text-lg' : 'text-xl',
                        ' font-bold text-gray-950 dark:text-gray-100 mb-2'
                      ),
                      children: f('challenges.noChallenges'),
                    }),
                    (0, a.jsx)('p', {
                      className: ''.concat(
                        x ? 'text-sm' : 'text-base',
                        ' text-gray-600 dark:text-gray-400 mb-6'
                      ),
                      children:
                        'tr' === h
                          ? 'İlk hedefini oluştur ve başarıya ulaş!'
                          : 'Create your first goal and achieve success!',
                    }),
                    (0, a.jsxs)('button', {
                      type: 'button',
                      onClick: S,
                      className:
                        'px-6 py-3 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg hover:from-brand-dark hover:to-brand font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl '.concat(
                          x
                            ? 'touch-feedback mobile-press bounce-in-mobile'
                            : 'btn-enhanced scale-on-interact'
                        ),
                      children: ['+ ', f('challenges.addChallenge')],
                    }),
                  ],
                })
              : (0, a.jsxs)('div', {
                  className: 'space-y-8',
                  children: [
                    D.length > 0 &&
                      (0, a.jsxs)('div', {
                        children: [
                          (0, a.jsx)('h2', {
                            className:
                              'text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-4',
                            children: f('challenges.active'),
                          }),
                          (0, a.jsx)('div', {
                            className: 'grid '.concat(
                              x ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3',
                              ' gap-4'
                            ),
                            children: D.map((e) =>
                              (0, a.jsx)(
                                n.Suspense,
                                {
                                  fallback: (0, a.jsx)(d.XQ, {}),
                                  children: (0, a.jsx)(c, {
                                    challenge: e,
                                    onEdit: () => C(e),
                                    onDelete: () => T(e),
                                  }),
                                },
                                e.id
                              )
                            ),
                          }),
                        ],
                      }),
                    N.length > 0 &&
                      (0, a.jsxs)('div', {
                        children: [
                          (0, a.jsx)('h2', {
                            className:
                              'text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-4',
                            children: f('challenges.completed'),
                          }),
                          (0, a.jsx)('div', {
                            className: 'grid '.concat(
                              x ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3',
                              ' gap-4'
                            ),
                            children: N.map((e) =>
                              (0, a.jsx)(
                                n.Suspense,
                                {
                                  fallback: (0, a.jsx)(d.XQ, {}),
                                  children: (0, a.jsx)(c, {
                                    challenge: e,
                                    onEdit: () => C(e),
                                    onDelete: () => T(e),
                                  }),
                                },
                                e.id
                              )
                            ),
                          }),
                        ],
                      }),
                    j.length > 0 &&
                      (0, a.jsxs)('div', {
                        children: [
                          (0, a.jsx)('h2', {
                            className:
                              'text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-4',
                            children: f('challenges.expired'),
                          }),
                          (0, a.jsx)('div', {
                            className: 'grid '.concat(
                              x ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3',
                              ' gap-4'
                            ),
                            children: j.map((e) =>
                              (0, a.jsx)(
                                n.Suspense,
                                {
                                  fallback: (0, a.jsx)(d.XQ, {}),
                                  children: (0, a.jsx)(c, {
                                    challenge: e,
                                    onEdit: () => C(e),
                                    onDelete: () => T(e),
                                  }),
                                },
                                e.id
                              )
                            ),
                          }),
                        ],
                      }),
                  ],
                }),
            v &&
              (0, a.jsx)(n.Suspense, {
                fallback: null,
                children: (0, a.jsx)(u, {
                  open: v,
                  challenge: b,
                  onClose: () => {
                    (y(!1), p(null));
                  },
                  onSave: (e) => {
                    (b ? g(b.id, e) : r(e), y(!1), p(null));
                  },
                }),
              }),
            (0, a.jsx)(o.Q, {
              open: !!k,
              title: f('challenges.deleteChallenge'),
              message: f('challenges.deleteConfirm'),
              variant: 'danger',
              confirmLabel: f('form.confirm'),
              cancelLabel: f('form.cancel'),
              onConfirm: () => {
                k && (m(k.id), w(null));
              },
              onCancel: () => w(null),
            }),
          ],
        });
      }
    },
    60923: function (e, t, r) {
      'use strict';
      r.d(t, {
        Q: function () {
          return o;
        },
      });
      var a = r(57437),
        n = r(54887),
        l = r(2265),
        i = r(98661),
        s = r(78466);
      function o(e) {
        let {
            open: t,
            title: r,
            message: o,
            confirmLabel: d,
            cancelLabel: c,
            onConfirm: u,
            onCancel: g,
            variant: m = 'default',
          } = e,
          { t: f } = (0, i.Q)(),
          [h, x] = (0, l.useState)(!1),
          v = (0, s.d)();
        if (
          ((0, l.useEffect)(() => {
            x(!0);
          }, []),
          (0, l.useEffect)(
            () => (
              t ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = ''),
              () => {
                document.body.style.overflow = '';
              }
            ),
            [t]
          ),
          (0, l.useEffect)(() => {
            if (!t) return;
            let e = (e) => {
              'Escape' === e.key && g();
            };
            return (
              document.addEventListener('keydown', e),
              () => document.removeEventListener('keydown', e)
            );
          }, [t, g]),
          !h || !t)
        )
          return null;
        let y = () => {
            g();
          },
          b = (0, a.jsx)('div', {
            className: 'fixed inset-0 z-[9999] flex '
              .concat(v ? 'items-end' : 'items-center justify-center', ' bg-black/50 ')
              .concat(v ? '' : 'backdrop-blur-sm', ' ')
              .concat(v ? 'backdrop-fade' : 'animate-fade-in', ' safe-bottom'),
            onClick: (e) => {
              e.target === e.currentTarget && y();
            },
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'confirm-dialog-title',
            'aria-describedby': 'confirm-dialog-message',
            children: (0, a.jsx)('div', {
              className:
                'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                  v
                    ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto slide-up-bottom'
                    : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-md w-full mx-4 animate-scale-in',
                  ' border-2 border-gray-200 dark:border-gray-700'
                ),
              children: (0, a.jsxs)('div', {
                className: ''.concat('p-6'),
                children: [
                  (0, a.jsx)('h2', {
                    id: 'confirm-dialog-title',
                    className: ''.concat(
                      v ? 'text-xl' : 'text-lg',
                      ' font-bold text-gray-950 dark:text-white mb-2'
                    ),
                    children: r,
                  }),
                  (0, a.jsx)('p', {
                    id: 'confirm-dialog-message',
                    className: ''.concat(
                      v ? 'text-base' : 'text-sm',
                      ' font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed'
                    ),
                    children: o,
                  }),
                  (0, a.jsxs)('div', {
                    className: 'flex items-center '.concat(
                      v ? 'flex-col-reverse gap-2' : 'justify-end gap-3'
                    ),
                    children: [
                      (0, a.jsx)('button', {
                        type: 'button',
                        onClick: y,
                        className: ''.concat(
                          v ? 'w-full min-h-[44px] touch-feedback mobile-press' : 'px-4 py-2',
                          ' text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 active:scale-95'
                        ),
                        'aria-label': c || f('form.cancel'),
                        children: c || f('form.cancel'),
                      }),
                      (0, a.jsx)('button', {
                        type: 'button',
                        onClick: () => {
                          u();
                        },
                        className: ''
                          .concat(
                            v ? 'w-full min-h-[44px] touch-feedback mobile-press' : 'px-4 py-2',
                            ' text-sm font-semibold text-white rounded-lg transition-all duration-200 active:scale-95 hover:shadow-xl '
                          )
                          .concat(
                            'danger' === m
                              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600'
                              : 'bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand'
                          ),
                        'aria-label': d || f('form.confirm'),
                        autoFocus: !0,
                        children: d || f('form.confirm'),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          });
        return (0, n.createPortal)(b, document.body);
      }
    },
    81178: function (e, t, r) {
      'use strict';
      r.d(t, {
        IZ: function () {
          return i;
        },
        VQ: function () {
          return l;
        },
        XQ: function () {
          return n;
        },
      });
      var a = r(57437);
      function n() {
        return (0, a.jsx)('div', {
          className:
            'rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 skeleton',
          children: (0, a.jsxs)('div', {
            className: 'space-y-4',
            children: [
              (0, a.jsxs)('div', {
                className: 'flex items-center justify-between',
                children: [
                  (0, a.jsx)('div', { className: 'h-6 w-32 rounded skeleton' }),
                  (0, a.jsx)('div', { className: 'h-5 w-16 rounded skeleton' }),
                ],
              }),
              (0, a.jsx)('div', { className: 'h-4 w-full rounded skeleton' }),
              (0, a.jsx)('div', { className: 'h-4 w-3/4 rounded skeleton' }),
              (0, a.jsx)('div', {
                className: 'h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden',
                children: (0, a.jsx)('div', {
                  className: 'h-full w-1/3 bg-gray-300 dark:bg-gray-700 rounded-full skeleton',
                }),
              }),
              (0, a.jsxs)('div', {
                className: 'flex items-center justify-between',
                children: [
                  (0, a.jsx)('div', { className: 'h-4 w-24 rounded skeleton' }),
                  (0, a.jsx)('div', { className: 'h-8 w-20 rounded-lg skeleton' }),
                ],
              }),
            ],
          }),
        });
      }
      function l() {
        return (0, a.jsx)('div', {
          className:
            'rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-3 sm:p-4 skeleton',
          children: (0, a.jsxs)('div', {
            className: 'space-y-3',
            children: [
              (0, a.jsx)('div', { className: 'h-12 w-12 mx-auto rounded-lg skeleton' }),
              (0, a.jsx)('div', { className: 'h-5 w-full rounded skeleton' }),
              (0, a.jsx)('div', { className: 'h-4 w-3/4 mx-auto rounded skeleton' }),
              (0, a.jsxs)('div', {
                className: 'flex items-center justify-between',
                children: [
                  (0, a.jsx)('div', { className: 'h-5 w-16 rounded-full skeleton' }),
                  (0, a.jsx)('div', { className: 'h-4 w-12 rounded skeleton' }),
                ],
              }),
            ],
          }),
        });
      }
      function i() {
        return (0, a.jsx)('div', {
          className: 'space-y-6',
          children: (0, a.jsxs)('div', {
            className: 'animate-pulse space-y-4',
            children: [
              (0, a.jsx)('div', {
                className: 'h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3 skeleton',
              }),
              (0, a.jsx)('div', {
                className: 'h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 skeleton',
              }),
            ],
          }),
        });
      }
    },
    6013: function (e, t, r) {
      'use strict';
      r.d(t, {
        B: function () {
          return g;
        },
        U: function () {
          return u;
        },
      });
      var a = r(57437),
        n = r(2265),
        l = r(24979),
        i = r(58151),
        s = r(89805),
        o = r(78705),
        d = r(60186);
      let c = (0, n.createContext)(null);
      function u(e) {
        let { children: t } = e,
          { activities: r, hydrated: u } = (0, l.G$)(),
          { settings: g, hydrated: m } = (0, i.rV)(),
          [f, h] = (0, n.useState)([]),
          [x, v] = (0, n.useState)(!1);
        ((0, n.useEffect)(() => {
          var e, t;
          if (u && m)
            try {
              let t = localStorage.getItem(o.I.CHALLENGES);
              if (t) {
                let e = JSON.parse(t);
                if (
                  e.some(
                    (e) => 'weekly' === e.type && e.id.startsWith('weekly-') && 5e4 === e.target
                  )
                )
                  h(e);
                else {
                  let t = (0, s.sI)();
                  h([...e, t]);
                }
              } else {
                let t =
                    null !== (e = null == g ? void 0 : g.dailyTarget) && void 0 !== e ? e : d.Dy,
                  r = (0, s.x)(t),
                  a = (0, s.sI)();
                h([r, a]);
              }
            } catch (r) {
              console.error('Failed to load challenges:', r);
              let e = null !== (t = null == g ? void 0 : g.dailyTarget) && void 0 !== t ? t : d.Dy;
              h([(0, s.x)(e), (0, s.sI)()]);
            } finally {
              v(!0);
            }
        }, [u, m, null == g ? void 0 : g.dailyTarget]),
          (0, n.useEffect)(() => {
            if (!x || !(null == g ? void 0 : g.dailyTarget)) return;
            let e = f.find((e) => 'daily' === e.type && e.id.startsWith('daily-'));
            if (e && e.target !== g.dailyTarget) {
              let t = new Date().toISOString().split('T')[0];
              if (e.startDate.startsWith(t))
                h(f.map((t) => (t.id === e.id ? { ...t, target: g.dailyTarget } : t)));
              else {
                let t = (0, s.x)(g.dailyTarget);
                h([...f.filter((t) => t.id !== e.id), t]);
              }
            }
          }, [null == g ? void 0 : g.dailyTarget, x, f]));
        let y = (0, n.useCallback)((e) => {
          try {
            (localStorage.setItem(o.I.CHALLENGES, JSON.stringify(e)), h(e));
          } catch (e) {
            console.error('Failed to save challenges:', e);
          }
        }, []);
        (0, n.useEffect)(() => {
          if (!x || 0 === f.length) return;
          let e = f.map((e) => {
            let t = (0, s.zv)(e, r);
            return (0, s.eT)(e, t);
          });
          e.some((e, t) => {
            let r = f[t];
            return (
              e.status !== r.status || e.progress !== r.progress || e.completedAt !== r.completedAt
            );
          }) && y(e);
        }, [r, x, f, y]);
        let b = (0, n.useCallback)(
            (e) => {
              y([...f, e]);
            },
            [f, y]
          ),
          p = (0, n.useCallback)(
            (e, t) => {
              y(f.map((r) => (r.id === e ? { ...r, ...t } : r)));
            },
            [f, y]
          ),
          k = (0, n.useCallback)(
            (e) => {
              let t = f.find((t) => t.id === e);
              ((null == t ? void 0 : t.type) === 'daily' && t.id.startsWith('daily-')) ||
                y(f.filter((t) => t.id !== e));
            },
            [f, y]
          ),
          w = (0, n.useCallback)(
            (e) => {
              let t = f.find((t) => t.id === e);
              return t ? (0, s.zv)(t, r) : null;
            },
            [f, r]
          ),
          D = (0, n.useCallback)(
            () => f.filter((e) => (0, s.zv)(e, r).isCompleted && 'active' === e.status),
            [f, r]
          ),
          N = (0, n.useMemo)(
            () => ({
              challenges: f,
              hydrated: x,
              addChallenge: b,
              updateChallenge: p,
              deleteChallenge: k,
              getChallengeProgress: w,
              checkCompletedChallenges: D,
            }),
            [f, x, b, p, k, w, D]
          );
        return (0, a.jsx)(c.Provider, { value: N, children: t });
      }
      function g() {
        let e = (0, n.useContext)(c);
        if (!e) throw Error('useChallenges must be used within ChallengeProvider');
        return e;
      }
    },
    89805: function (e, t, r) {
      'use strict';
      r.d(t, {
        TT: function () {
          return h;
        },
        Vg: function () {
          return v;
        },
        Zp: function () {
          return x;
        },
        bg: function () {
          return f;
        },
        eT: function () {
          return m;
        },
        sI: function () {
          return b;
        },
        x: function () {
          return y;
        },
        zv: function () {
          return g;
        },
      });
      var a = r(60936),
        n = r(95775),
        l = r(56942),
        i = r(7641),
        s = r(34479),
        o = r(65696),
        d = r(86035),
        c = r(63070),
        u = r(27742);
      function g(e, t) {
        let r;
        let i = (0, a.D)(e.startDate),
          s = e.endDate ? (0, a.D)(e.endDate) : new Date(),
          o = t
            .filter((e) => {
              let t = (0, a.D)(e.performedAt);
              return (0, n._)(t, { start: i, end: s });
            })
            .reduce((e, t) => e + t.points, 0),
          d = e.target;
        if ('active' === e.status && e.endDate) {
          let t = (0, a.D)(e.endDate),
            n = (0, l.b)(new Date());
          r = Math.max(0, Math.ceil((t.getTime() - n.getTime()) / 864e5));
        }
        return {
          current: o,
          target: d,
          percentage: d > 0 ? Math.min(100, (o / d) * 100) : 0,
          isCompleted: o >= d,
          daysRemaining: r,
        };
      }
      function m(e, t) {
        let r = new Date(),
          n = e.endDate ? (0, a.D)(e.endDate) : null;
        return n && r > n && 'active' === e.status
          ? t.isCompleted
            ? { ...e, status: 'completed', progress: t.current, completedAt: n.toISOString() }
            : { ...e, status: 'expired', progress: t.current }
          : t.isCompleted && 'active' === e.status
            ? { ...e, status: 'completed', progress: t.current, completedAt: r.toISOString() }
            : { ...e, progress: t.current };
      }
      function f(e, t) {
        let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
          a = arguments.length > 3 ? arguments[3] : void 0,
          n = (0, l.b)(r),
          o = (0, i.i)(r);
        return {
          id: 'daily-'.concat((0, s.WU)(n, 'yyyy-MM-dd'), '-').concat(Date.now()),
          type: 'daily',
          name: e,
          description: {
            tr: 'Bug\xfcn '.concat(t.toLocaleString('tr-TR'), ' puan hedefi'),
            en: "Today's ".concat(t.toLocaleString('en-US'), ' points goal'),
          },
          target: t,
          startDate: n.toISOString(),
          endDate: o.toISOString(),
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
          icon: a || '\uD83C\uDFAF',
        };
      }
      function h(e, t) {
        let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
          a = arguments.length > 3 ? arguments[3] : void 0,
          n = (0, o.z)(r, { weekStartsOn: 1 }),
          l = (0, d.v)(n, { weekStartsOn: 1 });
        return {
          id: 'weekly-'.concat((0, s.WU)(n, 'yyyy-MM-dd'), '-').concat(Date.now()),
          type: 'weekly',
          name: e,
          description: {
            tr: 'Bu hafta '.concat(t.toLocaleString('tr-TR'), ' puan hedefi'),
            en: "This week's ".concat(t.toLocaleString('en-US'), ' points goal'),
          },
          target: t,
          startDate: n.toISOString(),
          endDate: l.toISOString(),
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
          icon: a || '\uD83D\uDCC5',
        };
      }
      function x(e, t) {
        let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
          a = arguments.length > 3 ? arguments[3] : void 0,
          n = (0, c.N)(r),
          l = (0, u.V)(n);
        return {
          id: 'monthly-'.concat((0, s.WU)(n, 'yyyy-MM'), '-').concat(Date.now()),
          type: 'monthly',
          name: e,
          description: {
            tr: 'Bu ay '.concat(t.toLocaleString('tr-TR'), ' puan hedefi'),
            en: "This month's ".concat(t.toLocaleString('en-US'), ' points goal'),
          },
          target: t,
          startDate: n.toISOString(),
          endDate: l.toISOString(),
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
          icon: a || '\uD83D\uDCC6',
        };
      }
      function v(e, t, r, a, n, l) {
        return {
          id: 'custom-'.concat(Date.now()),
          type: 'custom',
          name: e,
          description: t,
          target: r,
          startDate: a.toISOString(),
          endDate: n.toISOString(),
          status: 'active',
          progress: 0,
          createdAt: new Date().toISOString(),
          icon: l || '\uD83C\uDFC6',
        };
      }
      function y(e) {
        return f({ tr: 'G\xfcnl\xfck Hedef', en: 'Daily Goal' }, e, new Date(), '⭐');
      }
      function b() {
        return h({ tr: 'Haftalık Hedef', en: 'Weekly Goal' }, 5e4, new Date(), '\uD83D\uDD25');
      }
    },
    7641: function (e, t, r) {
      'use strict';
      r.d(t, {
        i: function () {
          return n;
        },
      });
      var a = r(99649);
      function n(e) {
        let t = (0, a.Q)(e);
        return (t.setHours(23, 59, 59, 999), t);
      }
    },
    27742: function (e, t, r) {
      'use strict';
      r.d(t, {
        V: function () {
          return n;
        },
      });
      var a = r(99649);
      function n(e) {
        let t = (0, a.Q)(e),
          r = t.getMonth();
        return (t.setFullYear(t.getFullYear(), r + 1, 0), t.setHours(23, 59, 59, 999), t);
      }
    },
    86035: function (e, t, r) {
      'use strict';
      r.d(t, {
        v: function () {
          return l;
        },
      });
      var a = r(99649),
        n = r(55528);
      function l(e, t) {
        var r, l, i, s, o, d, c, u;
        let g = (0, n.j)(),
          m =
            null !==
              (u =
                null !==
                  (c =
                    null !==
                      (d =
                        null !== (o = null == t ? void 0 : t.weekStartsOn) && void 0 !== o
                          ? o
                          : null == t
                            ? void 0
                            : null === (l = t.locale) || void 0 === l
                              ? void 0
                              : null === (r = l.options) || void 0 === r
                                ? void 0
                                : r.weekStartsOn) && void 0 !== d
                      ? d
                      : g.weekStartsOn) && void 0 !== c
                  ? c
                  : null === (s = g.locale) || void 0 === s
                    ? void 0
                    : null === (i = s.options) || void 0 === i
                      ? void 0
                      : i.weekStartsOn) && void 0 !== u
              ? u
              : 0,
          f = (0, a.Q)(e),
          h = f.getDay();
        return (
          f.setDate(f.getDate() + ((h < m ? -7 : 0) + 6 - (h - m))),
          f.setHours(23, 59, 59, 999),
          f
        );
      }
    },
    95775: function (e, t, r) {
      'use strict';
      r.d(t, {
        _: function () {
          return n;
        },
      });
      var a = r(99649);
      function n(e, t) {
        let r = +(0, a.Q)(e),
          [n, l] = [+(0, a.Q)(t.start), +(0, a.Q)(t.end)].sort((e, t) => e - t);
        return r >= n && r <= l;
      }
    },
    60936: function (e, t, r) {
      'use strict';
      r.d(t, {
        D: function () {
          return n;
        },
      });
      var a = r(78198);
      function n(e, t) {
        var r;
        let n, m;
        let f = null !== (r = null == t ? void 0 : t.additionalDigits) && void 0 !== r ? r : 2,
          h = (function (e) {
            let t;
            let r = {},
              a = e.split(l.dateTimeDelimiter);
            if (a.length > 2) return r;
            if (
              (/:/.test(a[0])
                ? (t = a[0])
                : ((r.date = a[0]),
                  (t = a[1]),
                  l.timeZoneDelimiter.test(r.date) &&
                    ((r.date = e.split(l.timeZoneDelimiter)[0]),
                    (t = e.substr(r.date.length, e.length)))),
              t)
            ) {
              let e = l.timezone.exec(t);
              e ? ((r.time = t.replace(e[1], '')), (r.timezone = e[1])) : (r.time = t);
            }
            return r;
          })(e);
        if (h.date) {
          let e = (function (e, t) {
            let r = RegExp(
                '^(?:(\\d{4}|[+-]\\d{' + (4 + t) + '})|(\\d{2}|[+-]\\d{' + (2 + t) + '})$)'
              ),
              a = e.match(r);
            if (!a) return { year: NaN, restDateString: '' };
            let n = a[1] ? parseInt(a[1]) : null,
              l = a[2] ? parseInt(a[2]) : null;
            return {
              year: null === l ? n : 100 * l,
              restDateString: e.slice((a[1] || a[2]).length),
            };
          })(h.date, f);
          n = (function (e, t) {
            if (null === t) return new Date(NaN);
            let r = e.match(i);
            if (!r) return new Date(NaN);
            let a = !!r[4],
              n = d(r[1]),
              l = d(r[2]) - 1,
              s = d(r[3]),
              o = d(r[4]),
              c = d(r[5]) - 1;
            if (a)
              return o >= 1 && o <= 53 && c >= 0 && c <= 6
                ? (function (e, t, r) {
                    let a = new Date(0);
                    a.setUTCFullYear(e, 0, 4);
                    let n = a.getUTCDay() || 7;
                    return (a.setUTCDate(a.getUTCDate() + ((t - 1) * 7 + r + 1 - n)), a);
                  })(t, o, c)
                : new Date(NaN);
            {
              let e = new Date(0);
              return l >= 0 &&
                l <= 11 &&
                s >= 1 &&
                s <= (u[l] || (g(t) ? 29 : 28)) &&
                n >= 1 &&
                n <= (g(t) ? 366 : 365)
                ? (e.setUTCFullYear(t, l, Math.max(n, s)), e)
                : new Date(NaN);
            }
          })(e.restDateString, e.year);
        }
        if (!n || isNaN(n.getTime())) return new Date(NaN);
        let x = n.getTime(),
          v = 0;
        if (
          h.time &&
          isNaN(
            (v = (function (e) {
              let t = e.match(s);
              if (!t) return NaN;
              let r = c(t[1]),
                n = c(t[2]),
                l = c(t[3]);
              return (
                24 === r
                  ? 0 === n && 0 === l
                  : l >= 0 && l < 60 && n >= 0 && n < 60 && r >= 0 && r < 25
              )
                ? r * a.vh + n * a.yJ + 1e3 * l
                : NaN;
            })(h.time))
          )
        )
          return new Date(NaN);
        if (h.timezone) {
          if (
            isNaN(
              (m = (function (e) {
                if ('Z' === e) return 0;
                let t = e.match(o);
                if (!t) return 0;
                let r = '+' === t[1] ? -1 : 1,
                  n = parseInt(t[2]),
                  l = (t[3] && parseInt(t[3])) || 0;
                return l >= 0 && l <= 59 ? r * (n * a.vh + l * a.yJ) : NaN;
              })(h.timezone))
            )
          )
            return new Date(NaN);
        } else {
          let e = new Date(x + v),
            t = new Date(0);
          return (
            t.setFullYear(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()),
            t.setHours(
              e.getUTCHours(),
              e.getUTCMinutes(),
              e.getUTCSeconds(),
              e.getUTCMilliseconds()
            ),
            t
          );
        }
        return new Date(x + v + m);
      }
      let l = { dateTimeDelimiter: /[T ]/, timeZoneDelimiter: /[Z ]/i, timezone: /([Z+-].*)$/ },
        i = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,
        s = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,
        o = /^([+-])(\d{2})(?::?(\d{2}))?$/;
      function d(e) {
        return e ? parseInt(e) : 1;
      }
      function c(e) {
        return (e && parseFloat(e.replace(',', '.'))) || 0;
      }
      let u = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function g(e) {
        return e % 400 == 0 || (e % 4 == 0 && e % 100 != 0);
      }
    },
    63070: function (e, t, r) {
      'use strict';
      r.d(t, {
        N: function () {
          return n;
        },
      });
      var a = r(99649);
      function n(e) {
        let t = (0, a.Q)(e);
        return (t.setDate(1), t.setHours(0, 0, 0, 0), t);
      }
    },
  },
  function (e) {
    (e.O(0, [6317, 2174, 2971, 2117, 1744], function () {
      return e((e.s = 56674));
    }),
      (_N_E = e.O()));
  },
]);
