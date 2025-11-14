'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [7219],
  {
    25284: function (e, t, a) {
      a.d(t, {
        W: function () {
          return x;
        },
      });
      var r = a(57437),
        n = a(2265),
        o = a(98661),
        l = a(24979),
        i = a(58151),
        d = a(14258),
        s = a(10480),
        c = a(78466),
        u = a(13224),
        m = a(76376),
        g = a(6013),
        f = a(88270);
      function y(e) {
        let t = e.getFullYear(),
          a = ''.concat(e.getMonth() + 1).padStart(2, '0'),
          r = ''.concat(e.getDate()).padStart(2, '0'),
          n = ''.concat(e.getHours()).padStart(2, '0'),
          o = ''.concat(e.getMinutes()).padStart(2, '0');
        return ''.concat(t, '-').concat(a, '-').concat(r, 'T').concat(n, ':').concat(o);
      }
      function x(e) {
        var t, a, x, v, p, h, b, k, N, w, D, j, S, C, A, T;
        let { onCreated: F, onSaved: U, onCancel: E, initial: M } = e,
          I = (0, c.d)(),
          O = (0, i.YG)(),
          K = M
            ? {
                key: M.activityKey,
                label: null !== (D = M.label) && void 0 !== D ? D : M.activityKey,
                labelEn: M.labelEn,
                icon: null !== (j = M.icon) && void 0 !== j ? j : '\uD83C\uDFC3',
                unit: null !== (S = M.unit) && void 0 !== S ? S : '',
                unitEn: M.unitEn,
                multiplier: null !== (C = M.multiplier) && void 0 !== C ? C : 1,
                defaultAmount: null !== (A = M.amount) && void 0 !== A ? A : 10,
                isCustom: null === (T = M.isCustom) || void 0 === T || T,
              }
            : void 0,
          Q = (0, n.useMemo)(
            () => (K ? (O.some((e) => e.key === K.key) ? O : [...O, K]) : O),
            [O, K]
          ),
          Y = (0, n.useMemo)(() => {
            let e = new Set(),
              t = [];
            for (let a of Q) e.has(a.key) || (e.add(a.key), t.push(a));
            return t;
          }, [Q]),
          H = (0, n.useMemo)(() => Object.fromEntries(Y.map((e) => [e.key, e])), [Y]),
          { addActivity: L, updateActivity: Z } = (0, l.G$)(),
          { t: $, lang: z } = (0, o.Q)(),
          { showToast: B } = (0, s.P)(),
          { checkNewBadges: J } = (0, u.F)(),
          { checkLevelUp: _ } = (0, m.l)(),
          { checkCompletedChallenges: G } = (0, g.B)(),
          { settings: W } = (0, i.rV)(),
          P = (0, n.useMemo)(() => new Intl.NumberFormat('tr' === z ? 'tr-TR' : 'en-US'), [z]),
          [q, R] = (0, n.useState)(
            null !==
              (v =
                null !== (x = null == M ? void 0 : M.activityKey) && void 0 !== x
                  ? x
                  : null === (t = Y[0]) || void 0 === t
                    ? void 0
                    : t.key) && void 0 !== v
              ? v
              : 'WALKING'
          ),
          [V, X] = (0, n.useState)(
            (null == M ? void 0 : M.performedAt) ? y(new Date(M.performedAt)) : ''
          ),
          [ee, et] = (0, n.useState)(
            (null == M ? void 0 : M.amount)
              ? String(M.amount)
              : String(
                  null !==
                    (h =
                      null !== (p = null == K ? void 0 : K.defaultAmount) && void 0 !== p
                        ? p
                        : null === (a = Y[0]) || void 0 === a
                          ? void 0
                          : a.defaultAmount) && void 0 !== h
                    ? h
                    : 10
                )
          ),
          [ea, er] = (0, n.useState)(
            null !== (b = null == M ? void 0 : M.note) && void 0 !== b ? b : ''
          ),
          [en, eo] = (0, n.useState)(!1),
          el =
            null !==
              (w =
                null !== (N = null !== (k = H[q]) && void 0 !== k ? k : K) && void 0 !== N
                  ? N
                  : Y.find((e) => e.key === q)) && void 0 !== w
              ? w
              : Y[0];
        if (!el) return null;
        let ei = Math.max(0, Math.round((Number(ee) || 0) * el.multiplier)),
          ed = P.format(ei),
          es = !!(null == M ? void 0 : M.id);
        async function ec(e) {
          (e.preventDefault(), eo(!0));
          let t = V ? new Date(V).toISOString() : new Date().toISOString();
          try {
            if (!el) {
              let e =
                'tr' === z ? 'L\xfctfen bir aktivite se\xe7in.' : 'Please select an activity.';
              (B(e, 'error'), eo(!1));
              return;
            }
            let e = Number(ee) || 0;
            if (e <= 0) {
              let e =
                'tr' === z
                  ? "Miktar 0'dan b\xfcy\xfck bir sayı olmalıdır."
                  : 'Amount must be a number greater than 0.';
              (B(e, 'error'), eo(!1));
              return;
            }
            (null == M ? void 0 : M.id)
              ? (Z(M.id, { definition: el, amount: e, note: ea || void 0, performedAt: t }),
                B($('toast.activityUpdated'), 'success'),
                null == U || U(),
                null == E || E())
              : (L({ definition: el, amount: e, note: ea || void 0, performedAt: t }),
                B($('toast.activityAdded'), 'success'),
                setTimeout(() => {
                  let e = J();
                  e.length > 0 &&
                    e.forEach((e) => {
                      f.BF.showBadgeUnlocked(z, e.name[z], e.icon);
                    });
                  let t = _();
                  t &&
                    (B(
                      ''
                        .concat($('level.levelUp'), ' ')
                        .concat($('level.level'), ' ')
                        .concat(t, '! \uD83C\uDF89'),
                      'success'
                    ),
                    f.BF.showLevelUp(z, t));
                  let a = G();
                  a.length > 0 &&
                    a.forEach((e) => {
                      (B(
                        ''
                          .concat(e.icon || '\uD83C\uDFAF', ' ')
                          .concat($('challenges.completedMessage', { name: e.name[z] })),
                        'success'
                      ),
                        f.BF.showChallengeCompleted(z, e.name[z], e.icon || '\uD83C\uDFAF'));
                    });
                }, 500),
                et(String(el.defaultAmount)),
                er(''),
                X(y(new Date())),
                null == F || F(),
                F ||
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 2e3));
          } finally {
            eo(!1);
          }
        }
        return (
          (0, n.useEffect)(() => {
            var e, t, a;
            if (M)
              (R(M.activityKey),
                et(String(M.amount)),
                er(null !== (e = M.note) && void 0 !== e ? e : ''),
                X(y(new Date(M.performedAt))));
            else {
              let e = Y[0];
              (R(null !== (t = null == e ? void 0 : e.key) && void 0 !== t ? t : 'WALKING'),
                et(
                  String(
                    null !== (a = null == e ? void 0 : e.defaultAmount) && void 0 !== a ? a : 10
                  )
                ),
                er(''),
                X(''));
            }
          }, [M, Y]),
          (0, n.useEffect)(() => {
            M || V || X(y(new Date()));
          }, [M, V]),
          (0, r.jsxs)('form', {
            onSubmit: ec,
            className: I ? 'space-y-3' : 'space-y-5',
            children: [
              (0, r.jsxs)('div', {
                className: I ? 'space-y-1.5' : 'space-y-2',
                children: [
                  (0, r.jsx)('div', {
                    className: ''.concat(
                      I ? 'text-xs' : 'text-sm',
                      ' font-semibold text-gray-800 dark:text-gray-200'
                    ),
                    children: $('form.selectActivity'),
                  }),
                  (0, r.jsx)('div', {
                    className: 'grid grid-cols-2 sm:grid-cols-3 '.concat(I ? 'gap-2' : 'gap-3'),
                    children: Y.map((e) => {
                      let t = e.key === q;
                      return (0, r.jsxs)(
                        'button',
                        {
                          type: 'button',
                          onClick: () => {
                            (R(e.key),
                              et((t) =>
                                es && (null == M ? void 0 : M.activityKey) === e.key
                                  ? t
                                  : String(e.defaultAmount)
                              ));
                          },
                          className:
                            'activity-select-btn stagger-item ripple-effect magnetic-hover gpu-accelerated text-left '
                              .concat(I ? 'rounded-lg' : 'rounded-xl', ' border-2 ')
                              .concat(
                                I ? 'px-2 py-1.5' : 'px-3 py-2',
                                ' shadow-md hover:shadow-xl transition-all duration-300 '
                              )
                              .concat(
                                t
                                  ? 'active border-brand dark:border-brand/60 bg-gradient-to-br from-brand/10 via-brand/5 to-brand/10 dark:from-brand/20 dark:via-brand/10 dark:to-brand/20 ring-2 ring-brand/30 dark:ring-brand/20 scale-105'
                                  : 'border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 hover:from-gray-100 hover:via-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-800 scale-on-interact'
                              ),
                          'aria-pressed': t,
                          'aria-label': $('form.selectActivityLabel', {
                            activity: (0, d.Xr)(e, z),
                          }),
                          onKeyDown: (t) => {
                            ('Enter' === t.key || ' ' === t.key) &&
                              (t.preventDefault(), R(e.key), et(String(e.defaultAmount)));
                          },
                          children: [
                            (0, r.jsxs)('div', {
                              className: 'flex items-center justify-between',
                              children: [
                                (0, r.jsx)('div', {
                                  className: ''
                                    .concat(
                                      I ? 'text-lg' : 'text-xl',
                                      ' transition-transform duration-300 '
                                    )
                                    .concat(t ? 'activity-icon-pulse' : ''),
                                  children: e.icon,
                                }),
                                (0, r.jsxs)('div', {
                                  className: ''.concat(
                                    I ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5',
                                    ' rounded-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 font-bold border border-gray-200 dark:border-gray-700'
                                  ),
                                  children: [e.multiplier, 'x'],
                                }),
                              ],
                            }),
                            (0, r.jsx)('div', {
                              className: ''
                                .concat(I ? 'mt-1' : 'mt-2', ' ')
                                .concat(
                                  I ? 'text-xs' : 'text-sm',
                                  ' font-bold transition-colors text-gray-950 dark:text-gray-100'
                                ),
                              children: (0, d.Xr)(e, z),
                            }),
                            (0, r.jsxs)('div', {
                              className: ''.concat(
                                I ? 'text-[10px]' : 'text-xs',
                                ' font-medium text-gray-600 dark:text-gray-400'
                              ),
                              children: [e.defaultAmount, ' ', (0, d.Jt)(e, z)],
                            }),
                          ],
                        },
                        e.key
                      );
                    }),
                  }),
                ],
              }),
              (0, r.jsx)('div', {
                className: 'grid grid-cols-1 sm:grid-cols-2 '.concat(I ? 'gap-2' : 'gap-3'),
                children: (0, r.jsxs)('label', {
                  className: ''.concat(I ? 'space-y-0.5' : 'space-y-1', ' min-w-0 max-w-full'),
                  children: [
                    (0, r.jsx)('div', {
                      className: ''.concat(
                        I ? 'text-xs' : 'text-sm',
                        ' font-semibold text-gray-800 dark:text-gray-200'
                      ),
                      children: $('form.datetime'),
                    }),
                    (0, r.jsx)('input', {
                      type: 'datetime-local',
                      value: V,
                      onChange: (e) => X(e.target.value),
                      className: 'input-enhanced w-full border-2 '.concat(
                        I
                          ? 'rounded-lg px-2.5 py-2 min-h-[40px] text-xs'
                          : 'rounded-lg px-3 py-3 min-h-[44px] text-sm',
                        ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 min-w-0 max-w-full transition-all duration-200'
                      ),
                      required: !0,
                    }),
                  ],
                }),
              }),
              (0, r.jsx)('div', {
                className: I ? 'space-y-2' : 'space-y-3',
                children: (0, r.jsxs)('label', {
                  className: ''.concat(I ? 'space-y-0.5' : 'space-y-1', ' block'),
                  children: [
                    (0, r.jsxs)('div', {
                      className: ''.concat(
                        I ? 'text-xs' : 'text-sm',
                        ' font-semibold text-gray-800 dark:text-gray-200'
                      ),
                      children: [$('form.amount'), ' (', (0, d.Jt)(el, z), ')'],
                    }),
                    (0, r.jsx)('input', {
                      type: 'number',
                      min: 1,
                      step: 1,
                      value: ee,
                      onChange: (e) => et(e.target.value),
                      className: 'input-enhanced w-full border '.concat(
                        I
                          ? 'rounded-md px-2.5 py-2 min-h-[40px] text-xs'
                          : 'rounded-lg px-3 py-3 min-h-[44px] text-sm',
                        ' bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-all duration-200'
                      ),
                      required: !0,
                      'aria-label': ''.concat($('form.amount'), ' (').concat((0, d.Jt)(el, z), ')'),
                      'aria-describedby': (0, d.dE)(el, z) ? 'amount-description' : void 0,
                    }),
                    (0, d.dE)(el, z)
                      ? (0, r.jsx)('div', {
                          id: 'amount-description',
                          className: ''.concat(
                            I ? 'text-[10px]' : 'text-xs',
                            ' text-gray-500 dark:text-gray-400'
                          ),
                          role: 'note',
                          children: (0, d.dE)(el, z),
                        })
                      : null,
                    (0, r.jsxs)('div', {
                      className: ''
                        .concat(
                          I ? 'text-[9px]' : 'text-[10px]',
                          ' text-gray-500 dark:text-gray-400 '
                        )
                        .concat(I ? 'mt-0.5' : 'mt-1', ' flex items-center gap-2'),
                      children: [
                        (0, r.jsxs)('span', { children: [el.multiplier, 'x'] }),
                        (0, r.jsx)('span', { children: '\xb7' }),
                        (0, r.jsxs)('span', { children: [$('form.points'), ': ', ed] }),
                      ],
                    }),
                  ],
                }),
              }),
              (0, r.jsxs)('label', {
                className: ''.concat(I ? 'space-y-0.5' : 'space-y-1', ' block'),
                children: [
                  (0, r.jsx)('div', {
                    className: ''.concat(
                      I ? 'text-xs' : 'text-sm',
                      ' font-semibold text-gray-800 dark:text-gray-200'
                    ),
                    children: $('form.noteOptional'),
                  }),
                  (0, r.jsx)('textarea', {
                    value: ea,
                    onChange: (e) => er(e.target.value),
                    className: 'input-enhanced w-full border-2 '.concat(
                      I
                        ? 'rounded-lg px-2.5 py-2 min-h-[70px] text-xs'
                        : 'rounded-lg px-3 py-3 min-h-[88px] text-sm',
                      ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200'
                    ),
                    rows: I ? 2 : 3,
                    placeholder: $('form.notePlaceholder'),
                    'aria-label': $('form.noteOptional'),
                  }),
                ],
              }),
              (0, r.jsxs)('div', {
                className: 'flex items-center '
                  .concat(I ? 'gap-1.5' : 'gap-2', ' ')
                  .concat(I && !es ? 'flex-col' : ''),
                children: [
                  (0, r.jsx)('button', {
                    type: 'submit',
                    disabled: en,
                    className: 'btn-enhanced '
                      .concat(I ? 'touch-feedback mobile-press' : 'ripple-effect', ' button-glow ')
                      .concat(I && !es ? 'w-full' : '', ' ')
                      .concat(
                        I
                          ? 'px-3 py-2 min-h-[40px] text-xs rounded-lg bounce-in-mobile'
                          : 'px-4 py-3 min-h-[44px] text-sm rounded-lg',
                        ' bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold disabled:opacity-50 shadow-md hover:shadow-xl transition-all duration-300 scale-on-interact disabled:hover:scale-100'
                      ),
                    'aria-label': en ? $('form.loading') : es ? $('form.save') : $('form.add'),
                    'aria-busy': en,
                    children: en ? '...' : es ? $('form.save') : $('form.add'),
                  }),
                  es
                    ? (0, r.jsx)('button', {
                        type: 'button',
                        onClick: E,
                        className: ''.concat(
                          I
                            ? 'px-3 py-2 min-h-[40px] text-xs rounded-lg'
                            : 'px-4 py-3 min-h-[44px] text-sm rounded-lg',
                          ' border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 font-semibold hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 active:scale-95'
                        ),
                        children: $('form.cancel'),
                      })
                    : null,
                ],
              }),
            ],
          })
        );
      }
    },
    7641: function (e, t, a) {
      a.d(t, {
        i: function () {
          return n;
        },
      });
      var r = a(99649);
      function n(e) {
        let t = (0, r.Q)(e);
        return (t.setHours(23, 59, 59, 999), t);
      }
    },
    27742: function (e, t, a) {
      a.d(t, {
        V: function () {
          return n;
        },
      });
      var r = a(99649);
      function n(e) {
        let t = (0, r.Q)(e),
          a = t.getMonth();
        return (t.setFullYear(t.getFullYear(), a + 1, 0), t.setHours(23, 59, 59, 999), t);
      }
    },
    86035: function (e, t, a) {
      a.d(t, {
        v: function () {
          return o;
        },
      });
      var r = a(99649),
        n = a(55528);
      function o(e, t) {
        var a, o, l, i, d, s, c, u;
        let m = (0, n.j)(),
          g =
            null !==
              (u =
                null !==
                  (c =
                    null !==
                      (s =
                        null !== (d = null == t ? void 0 : t.weekStartsOn) && void 0 !== d
                          ? d
                          : null == t
                            ? void 0
                            : null === (o = t.locale) || void 0 === o
                              ? void 0
                              : null === (a = o.options) || void 0 === a
                                ? void 0
                                : a.weekStartsOn) && void 0 !== s
                      ? s
                      : m.weekStartsOn) && void 0 !== c
                  ? c
                  : null === (i = m.locale) || void 0 === i
                    ? void 0
                    : null === (l = i.options) || void 0 === l
                      ? void 0
                      : l.weekStartsOn) && void 0 !== u
              ? u
              : 0,
          f = (0, r.Q)(e),
          y = f.getDay();
        return (
          f.setDate(f.getDate() + ((y < g ? -7 : 0) + 6 - (y - g))),
          f.setHours(23, 59, 59, 999),
          f
        );
      }
    },
    95775: function (e, t, a) {
      a.d(t, {
        _: function () {
          return n;
        },
      });
      var r = a(99649);
      function n(e, t) {
        let a = +(0, r.Q)(e),
          [n, o] = [+(0, r.Q)(t.start), +(0, r.Q)(t.end)].sort((e, t) => e - t);
        return a >= n && a <= o;
      }
    },
    60936: function (e, t, a) {
      a.d(t, {
        D: function () {
          return n;
        },
      });
      var r = a(78198);
      function n(e, t) {
        var a;
        let n, g;
        let f = null !== (a = null == t ? void 0 : t.additionalDigits) && void 0 !== a ? a : 2,
          y = (function (e) {
            let t;
            let a = {},
              r = e.split(o.dateTimeDelimiter);
            if (r.length > 2) return a;
            if (
              (/:/.test(r[0])
                ? (t = r[0])
                : ((a.date = r[0]),
                  (t = r[1]),
                  o.timeZoneDelimiter.test(a.date) &&
                    ((a.date = e.split(o.timeZoneDelimiter)[0]),
                    (t = e.substr(a.date.length, e.length)))),
              t)
            ) {
              let e = o.timezone.exec(t);
              e ? ((a.time = t.replace(e[1], '')), (a.timezone = e[1])) : (a.time = t);
            }
            return a;
          })(e);
        if (y.date) {
          let e = (function (e, t) {
            let a = RegExp(
                '^(?:(\\d{4}|[+-]\\d{' + (4 + t) + '})|(\\d{2}|[+-]\\d{' + (2 + t) + '})$)'
              ),
              r = e.match(a);
            if (!r) return { year: NaN, restDateString: '' };
            let n = r[1] ? parseInt(r[1]) : null,
              o = r[2] ? parseInt(r[2]) : null;
            return {
              year: null === o ? n : 100 * o,
              restDateString: e.slice((r[1] || r[2]).length),
            };
          })(y.date, f);
          n = (function (e, t) {
            if (null === t) return new Date(NaN);
            let a = e.match(l);
            if (!a) return new Date(NaN);
            let r = !!a[4],
              n = s(a[1]),
              o = s(a[2]) - 1,
              i = s(a[3]),
              d = s(a[4]),
              c = s(a[5]) - 1;
            if (r)
              return d >= 1 && d <= 53 && c >= 0 && c <= 6
                ? (function (e, t, a) {
                    let r = new Date(0);
                    r.setUTCFullYear(e, 0, 4);
                    let n = r.getUTCDay() || 7;
                    return (r.setUTCDate(r.getUTCDate() + ((t - 1) * 7 + a + 1 - n)), r);
                  })(t, d, c)
                : new Date(NaN);
            {
              let e = new Date(0);
              return o >= 0 &&
                o <= 11 &&
                i >= 1 &&
                i <= (u[o] || (m(t) ? 29 : 28)) &&
                n >= 1 &&
                n <= (m(t) ? 366 : 365)
                ? (e.setUTCFullYear(t, o, Math.max(n, i)), e)
                : new Date(NaN);
            }
          })(e.restDateString, e.year);
        }
        if (!n || isNaN(n.getTime())) return new Date(NaN);
        let x = n.getTime(),
          v = 0;
        if (
          y.time &&
          isNaN(
            (v = (function (e) {
              let t = e.match(i);
              if (!t) return NaN;
              let a = c(t[1]),
                n = c(t[2]),
                o = c(t[3]);
              return (
                24 === a
                  ? 0 === n && 0 === o
                  : o >= 0 && o < 60 && n >= 0 && n < 60 && a >= 0 && a < 25
              )
                ? a * r.vh + n * r.yJ + 1e3 * o
                : NaN;
            })(y.time))
          )
        )
          return new Date(NaN);
        if (y.timezone) {
          if (
            isNaN(
              (g = (function (e) {
                if ('Z' === e) return 0;
                let t = e.match(d);
                if (!t) return 0;
                let a = '+' === t[1] ? -1 : 1,
                  n = parseInt(t[2]),
                  o = (t[3] && parseInt(t[3])) || 0;
                return o >= 0 && o <= 59 ? a * (n * r.vh + o * r.yJ) : NaN;
              })(y.timezone))
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
        return new Date(x + v + g);
      }
      let o = { dateTimeDelimiter: /[T ]/, timeZoneDelimiter: /[Z ]/i, timezone: /([Z+-].*)$/ },
        l = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,
        i = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,
        d = /^([+-])(\d{2})(?::?(\d{2}))?$/;
      function s(e) {
        return e ? parseInt(e) : 1;
      }
      function c(e) {
        return (e && parseFloat(e.replace(',', '.'))) || 0;
      }
      let u = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function m(e) {
        return e % 400 == 0 || (e % 4 == 0 && e % 100 != 0);
      }
    },
    63070: function (e, t, a) {
      a.d(t, {
        N: function () {
          return n;
        },
      });
      var r = a(99649);
      function n(e) {
        let t = (0, r.Q)(e);
        return (t.setDate(1), t.setHours(0, 0, 0, 0), t);
      }
    },
  },
]);
