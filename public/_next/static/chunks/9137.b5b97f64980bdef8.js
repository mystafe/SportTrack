'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [9137],
  {
    79137: function (e, r, a) {
      (a.r(r),
        a.d(r, {
          ChallengeDialog: function () {
            return c;
          },
        }));
      var t = a(57437),
        l = a(2265),
        n = a(54887),
        d = a(98661),
        o = a(58151),
        s = a(89805),
        g = a(78466);
      function i(e) {
        let r = e.getFullYear(),
          a = ''.concat(e.getMonth() + 1).padStart(2, '0'),
          t = ''.concat(e.getDate()).padStart(2, '0');
        return ''.concat(r, '-').concat(a, '-').concat(t);
      }
      function c(e) {
        let { open: r, challenge: a, onClose: c, onSave: u } = e,
          { t: y, lang: h } = (0, d.Q)(),
          { settings: x } = (0, o.rV)(),
          m = (0, g.d)(),
          [b, k] = (0, l.useState)('daily'),
          [p, f] = (0, l.useState)(''),
          [v, w] = (0, l.useState)(''),
          [j, N] = (0, l.useState)(''),
          [D, C] = (0, l.useState)(''),
          [S, F] = (0, l.useState)(''),
          [T, E] = (0, l.useState)(i(new Date())),
          [q, A] = (0, l.useState)(i(new Date())),
          [_, M] = (0, l.useState)('\uD83C\uDFAF');
        if (
          ((0, l.useEffect)(() => {
            if (a)
              (k(a.type),
                f(a.name.tr),
                w(a.name.en),
                N(a.description.tr),
                C(a.description.en),
                F(String(a.target)),
                E(i(new Date(a.startDate))),
                a.endDate && A(i(new Date(a.endDate))),
                M(a.icon || '\uD83C\uDFAF'));
            else {
              var e;
              (k('daily'),
                f(''),
                w(''),
                N(''),
                C(''),
                F(
                  String(
                    null !== (e = null == x ? void 0 : x.dailyTarget) && void 0 !== e ? e : 1e4
                  )
                ),
                E(i(new Date())),
                A(i(new Date())),
                M('\uD83C\uDFAF'));
            }
          }, [a, null == x ? void 0 : x.dailyTarget]),
          !r)
        )
          return null;
        let P = (0, t.jsx)('div', {
          className:
            'fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-4 overflow-y-auto',
          onClick: (e) => {
            e.target === e.currentTarget && c();
          },
          children: (0, t.jsxs)('div', {
            className: 'relative w-full '.concat(
              m ? 'max-w-full' : 'max-w-md',
              ' rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-4 sm:p-6 space-y-4 my-auto'
            ),
            children: [
              (0, t.jsx)('div', {
                children: (0, t.jsx)('h2', {
                  className: 'text-lg font-bold text-gray-950 dark:text-white',
                  children: a ? y('challenges.editChallenge') : y('challenges.addChallenge'),
                }),
              }),
              (0, t.jsxs)('form', {
                onSubmit: (e) => {
                  let r;
                  e.preventDefault();
                  let a = Number(S);
                  if (!a || a <= 0) return;
                  let t = new Date(T),
                    l = new Date(q);
                  switch (b) {
                    case 'daily':
                      r = (0, s.bg)({ tr: p || y('challenges.daily'), en: v || 'Daily' }, a, t, _);
                      break;
                    case 'weekly':
                      r = (0, s.TT)(
                        { tr: p || y('challenges.weekly'), en: v || 'Weekly' },
                        a,
                        t,
                        _
                      );
                      break;
                    case 'monthly':
                      r = (0, s.Zp)(
                        { tr: p || y('challenges.monthly'), en: v || 'Monthly' },
                        a,
                        t,
                        _
                      );
                      break;
                    case 'custom':
                      if (!p && !v) return;
                      r = (0, s.Vg)({ tr: p, en: v }, { tr: j, en: D }, a, t, l, _);
                  }
                  u(r);
                },
                className: 'space-y-4',
                children: [
                  (0, t.jsxs)('div', {
                    children: [
                      (0, t.jsxs)('label', {
                        className:
                          'text-xs font-semibold text-gray-800 dark:text-gray-200 block mb-2',
                        children: [
                          y('challenges.custom'),
                          ' / ',
                          y('challenges.daily'),
                          ' / ',
                          y('challenges.weekly'),
                          ' /',
                          ' ',
                          y('challenges.monthly'),
                        ],
                      }),
                      (0, t.jsxs)('select', {
                        value: b,
                        onChange: (e) => k(e.target.value),
                        className:
                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                        children: [
                          (0, t.jsx)('option', { value: 'daily', children: y('challenges.daily') }),
                          (0, t.jsx)('option', {
                            value: 'weekly',
                            children: y('challenges.weekly'),
                          }),
                          (0, t.jsx)('option', {
                            value: 'monthly',
                            children: y('challenges.monthly'),
                          }),
                          (0, t.jsx)('option', {
                            value: 'custom',
                            children: y('challenges.custom'),
                          }),
                        ],
                      }),
                    ],
                  }),
                  'custom' === b &&
                    (0, t.jsxs)(t.Fragment, {
                      children: [
                        (0, t.jsxs)('div', {
                          children: [
                            (0, t.jsxs)('label', {
                              className:
                                'text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2',
                              children: [y('challenges.name'), ' (TR)'],
                            }),
                            (0, t.jsx)('input', {
                              type: 'text',
                              value: p,
                              onChange: (e) => f(e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                              required: !0,
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          children: [
                            (0, t.jsxs)('label', {
                              className:
                                'text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2',
                              children: [y('challenges.name'), ' (EN)'],
                            }),
                            (0, t.jsx)('input', {
                              type: 'text',
                              value: v,
                              onChange: (e) => w(e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                              required: !0,
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          children: [
                            (0, t.jsxs)('label', {
                              className:
                                'text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2',
                              children: [y('challenges.description'), ' (TR)'],
                            }),
                            (0, t.jsx)('textarea', {
                              value: j,
                              onChange: (e) => N(e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                              rows: 2,
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          children: [
                            (0, t.jsxs)('label', {
                              className:
                                'text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2',
                              children: [y('challenges.description'), ' (EN)'],
                            }),
                            (0, t.jsx)('textarea', {
                              value: D,
                              onChange: (e) => C(e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                              rows: 2,
                            }),
                          ],
                        }),
                      ],
                    }),
                  (0, t.jsxs)('div', {
                    children: [
                      (0, t.jsx)('label', {
                        className:
                          'text-xs font-semibold text-gray-800 dark:text-gray-200 block mb-2',
                        children: y('challenges.targetPoints'),
                      }),
                      (0, t.jsx)('input', {
                        type: 'number',
                        value: S,
                        onChange: (e) => F(e.target.value),
                        className:
                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                        min: '1',
                        required: !0,
                      }),
                    ],
                  }),
                  'custom' === b &&
                    (0, t.jsxs)(t.Fragment, {
                      children: [
                        (0, t.jsxs)('div', {
                          children: [
                            (0, t.jsx)('label', {
                              className:
                                'text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2',
                              children: y('challenges.startDate'),
                            }),
                            (0, t.jsx)('input', {
                              type: 'date',
                              value: T,
                              onChange: (e) => E(e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                              required: !0,
                            }),
                          ],
                        }),
                        (0, t.jsxs)('div', {
                          children: [
                            (0, t.jsx)('label', {
                              className:
                                'text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2',
                              children: y('challenges.endDate'),
                            }),
                            (0, t.jsx)('input', {
                              type: 'date',
                              value: q,
                              onChange: (e) => A(e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                              required: !0,
                            }),
                          ],
                        }),
                      ],
                    }),
                  (0, t.jsxs)('div', {
                    children: [
                      (0, t.jsx)('label', {
                        className:
                          'text-xs font-semibold text-gray-800 dark:text-gray-200 block mb-2',
                        children: 'Emoji/Icon',
                      }),
                      (0, t.jsx)('input', {
                        type: 'text',
                        value: _,
                        onChange: (e) => M(e.target.value),
                        className:
                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                        placeholder: '\uD83C\uDFAF',
                      }),
                    ],
                  }),
                  (0, t.jsxs)('div', {
                    className: 'flex items-center justify-end gap-2 pt-2',
                    children: [
                      (0, t.jsx)('button', {
                        type: 'button',
                        onClick: c,
                        className:
                          'px-3 py-2 text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold',
                        children: y('challenges.cancel'),
                      }),
                      (0, t.jsx)('button', {
                        type: 'submit',
                        className:
                          'px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300',
                        children: y('challenges.save'),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        });
        return (0, n.createPortal)(P, document.body);
      }
    },
  },
]);
