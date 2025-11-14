(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [9018],
  {
    59187: function (e, t, r) {
      Promise.resolve().then(r.bind(r, 35201));
    },
    35201: function (e, t, r) {
      'use strict';
      (r.r(t),
        r.d(t, {
          default: function () {
            return N;
          },
        }));
      var a = r(57437),
        s = r(25284),
        i = r(2265),
        n = r(98661),
        o = r(24979),
        l = r(58151),
        d = r(14258),
        c = r(78466),
        x = r(34479),
        m = r(7641),
        u = r(56942),
        g = r(5341),
        p = r(60936),
        b = r(8608),
        y = r(71598);
      let h = (0, i.memo)(function (e) {
          let { filters: t, onFiltersChange: r } = e,
            { t: s, lang: m } = (0, n.Q)(),
            u = (0, c.d)(),
            { activities: g } = (0, o.G$)(),
            p = (0, l.YG)();
          'tr' === m ? b.tr : y._;
          let h = (0, i.useMemo)(() => Array.from(new Set(g.map((e) => e.activityKey))), [g]),
            f = (0, i.useCallback)(
              (e, a) => {
                r({ ...t, [e]: a });
              },
              [t, r]
            );
          return (0, a.jsxs)('div', {
            className:
              'space-y-2.5 sm:space-y-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-2.5 sm:p-3 shadow-md hover:shadow-xl transition-shadow duration-300',
            children: [
              (0, a.jsx)('h3', {
                className: ''.concat(
                  u ? 'text-xs' : 'text-sm',
                  ' font-bold text-gray-950 dark:text-white'
                ),
                children: s('filters.title'),
              }),
              (0, a.jsxs)('div', {
                className: 'space-y-1.5',
                children: [
                  (0, a.jsx)('label', {
                    className: ''.concat(
                      u ? 'text-[10px]' : 'text-xs',
                      ' font-semibold text-gray-800 dark:text-gray-200'
                    ),
                    children: s('filters.dateRange'),
                  }),
                  (0, a.jsx)('div', {
                    className: 'grid '.concat(u ? 'grid-cols-3' : 'grid-cols-5', ' gap-1.5'),
                    children: ['all', 'today', 'week', 'month', 'custom'].map((e) =>
                      (0, a.jsx)(
                        'button',
                        {
                          type: 'button',
                          onClick: () => f('dateRange', e),
                          className: 'px-2 py-1 '
                            .concat(
                              u ? 'text-[10px]' : 'text-xs',
                              ' rounded-lg border-2 font-semibold transition-all duration-200 '
                            )
                            .concat(
                              t.dateRange === e
                                ? 'bg-gradient-to-r from-brand to-brand-dark text-white border-brand shadow-md'
                                : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                            ),
                          children: s('filters.dateRange.'.concat(e)),
                        },
                        e
                      )
                    ),
                  }),
                  'custom' === t.dateRange &&
                    (0, a.jsxs)('div', {
                      className: 'grid grid-cols-2 gap-1.5 mt-1.5',
                      children: [
                        (0, a.jsx)('input', {
                          type: 'date',
                          value: t.customStart || '',
                          onChange: (e) => f('customStart', e.target.value),
                          max: (0, x.WU)(new Date(), 'yyyy-MM-dd'),
                          className:
                            'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 '.concat(
                              u ? 'text-[10px]' : 'text-xs',
                              ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                            ),
                        }),
                        (0, a.jsx)('input', {
                          type: 'date',
                          value: t.customEnd || '',
                          onChange: (e) => f('customEnd', e.target.value),
                          max: (0, x.WU)(new Date(), 'yyyy-MM-dd'),
                          className:
                            'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 '.concat(
                              u ? 'text-[10px]' : 'text-xs',
                              ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                            ),
                        }),
                      ],
                    }),
                ],
              }),
              (0, a.jsxs)('div', {
                className: 'space-y-1.5',
                children: [
                  (0, a.jsx)('label', {
                    className: ''.concat(
                      u ? 'text-[10px]' : 'text-xs',
                      ' font-semibold text-gray-800 dark:text-gray-200'
                    ),
                    children: s('filters.category'),
                  }),
                  (0, a.jsxs)('select', {
                    value: t.category,
                    onChange: (e) => f('category', e.target.value),
                    className:
                      'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 '.concat(
                        u ? 'text-[10px]' : 'text-xs',
                        ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                      ),
                    children: [
                      (0, a.jsx)('option', { value: 'all', children: s('filters.allCategories') }),
                      (0, a.jsx)('option', {
                        value: 'cardio',
                        children: s('filters.category.cardio'),
                      }),
                      (0, a.jsx)('option', {
                        value: 'strength',
                        children: s('filters.category.strength'),
                      }),
                      (0, a.jsx)('option', {
                        value: 'flexibility',
                        children: s('filters.category.flexibility'),
                      }),
                      (0, a.jsx)('option', {
                        value: 'sports',
                        children: s('filters.category.sports'),
                      }),
                      (0, a.jsx)('option', {
                        value: 'other',
                        children: s('filters.category.other'),
                      }),
                    ],
                  }),
                ],
              }),
              (0, a.jsxs)('div', {
                className: 'space-y-1.5',
                children: [
                  (0, a.jsx)('label', {
                    className: ''.concat(
                      u ? 'text-[10px]' : 'text-xs',
                      ' font-semibold text-gray-800 dark:text-gray-200'
                    ),
                    children: s('filters.activityType'),
                  }),
                  (0, a.jsxs)('select', {
                    value: t.activityType,
                    onChange: (e) => f('activityType', e.target.value),
                    className:
                      'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 '.concat(
                        u ? 'text-[10px]' : 'text-xs',
                        ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                      ),
                    children: [
                      (0, a.jsx)('option', { value: 'all', children: s('filters.allActivities') }),
                      h.map((e) => {
                        let t = p.find((t) => t.key === e);
                        return t
                          ? (0, a.jsx)('option', { value: e, children: (0, d.Xr)(t, m) }, e)
                          : null;
                      }),
                    ],
                  }),
                ],
              }),
              (0, a.jsxs)('div', {
                className: 'space-y-1.5',
                children: [
                  (0, a.jsx)('label', {
                    className: ''.concat(
                      u ? 'text-[10px]' : 'text-xs',
                      ' font-semibold text-gray-800 dark:text-gray-200'
                    ),
                    children: s('filters.search'),
                  }),
                  (0, a.jsx)('input', {
                    type: 'text',
                    value: t.searchQuery,
                    onChange: (e) => f('searchQuery', e.target.value),
                    placeholder: s('filters.searchPlaceholder'),
                    className:
                      'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 '.concat(
                        u ? 'text-[10px]' : 'text-xs',
                        ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                      ),
                  }),
                ],
              }),
              (0, a.jsxs)('div', {
                className: 'space-y-1.5',
                children: [
                  (0, a.jsx)('label', {
                    className: ''.concat(
                      u ? 'text-[10px]' : 'text-xs',
                      ' font-semibold text-gray-800 dark:text-gray-200'
                    ),
                    children: s('filters.sortBy'),
                  }),
                  (0, a.jsxs)('select', {
                    value: t.sortBy,
                    onChange: (e) => f('sortBy', e.target.value),
                    className:
                      'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 '.concat(
                        u ? 'text-[10px]' : 'text-xs',
                        ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                      ),
                    children: [
                      (0, a.jsx)('option', {
                        value: 'date-desc',
                        children: s('filters.sort.dateDesc'),
                      }),
                      (0, a.jsx)('option', {
                        value: 'date-asc',
                        children: s('filters.sort.dateAsc'),
                      }),
                      (0, a.jsx)('option', {
                        value: 'points-desc',
                        children: s('filters.sort.pointsDesc'),
                      }),
                      (0, a.jsx)('option', {
                        value: 'points-asc',
                        children: s('filters.sort.pointsAsc'),
                      }),
                    ],
                  }),
                ],
              }),
              ('all' !== t.dateRange ||
                'all' !== t.activityType ||
                'all' !== t.category ||
                t.searchQuery) &&
                (0, a.jsx)('button', {
                  type: 'button',
                  onClick: () =>
                    r({
                      dateRange: 'all',
                      activityType: 'all',
                      category: 'all',
                      searchQuery: '',
                      sortBy: 'date-desc',
                    }),
                  className: 'w-full px-2 py-1 '.concat(
                    u ? 'text-[10px]' : 'text-xs',
                    ' rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold'
                  ),
                  children: s('filters.clear'),
                }),
            ],
          });
        }),
        f = {
          id: '',
          label: '',
          labelEn: '',
          icon: '',
          unit: '',
          unitEn: '',
          multiplier: 1,
          defaultAmount: '10',
          description: '',
          descriptionEn: '',
        };
      function v() {
        let { t: e, lang: t } = (0, n.Q)(),
          r = (0, c.d)(),
          {
            settings: s,
            addCustomActivity: x,
            updateCustomActivity: m,
            removeCustomActivity: u,
          } = (0, l.rV)(),
          { activities: g } = (0, o.G$)(),
          p = (0, l.YG)(),
          b = (0, i.useMemo)(() => {
            var e;
            let t = new Set();
            return (
              null !== (e = null == s ? void 0 : s.customActivities) && void 0 !== e ? e : []
            ).filter((e) => !t.has(e.id) && (t.add(e.id), !0));
          }, [null == s ? void 0 : s.customActivities]),
          [y, h] = (0, i.useState)(!1),
          [v, k] = (0, i.useState)(null),
          [j, w] = (0, i.useState)(f),
          [N, E] = (0, i.useState)(null),
          D = (0, i.useMemo)(() => new Set(g.map((e) => e.activityKey)), [g]),
          C = (0, i.useMemo)(() => p.filter((e) => !e.isCustom), [p]),
          A = null !== v;
        function S() {
          (k(null), w(f), E(null));
        }
        function T() {
          (h(!1), S());
        }
        function M(e) {
          var t, r, a, s;
          let i = 'id' in e ? e.id : e.key;
          (k(i),
            w({
              id: i,
              label: e.label,
              labelEn: null !== (t = e.labelEn) && void 0 !== t ? t : '',
              icon: e.icon,
              unit: e.unit,
              unitEn: null !== (r = e.unitEn) && void 0 !== r ? r : '',
              multiplier: e.multiplier,
              defaultAmount: String(e.defaultAmount),
              description: null !== (a = e.description) && void 0 !== a ? a : '',
              descriptionEn: null !== (s = e.descriptionEn) && void 0 !== s ? s : '',
            }),
            h(!0));
        }
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsxs)('button', {
              type: 'button',
              onClick: function () {
                (h(!0), S());
              },
              className:
                'px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 dark:from-purple-600 dark:via-purple-700 dark:to-indigo-700 text-white hover:from-purple-600 hover:via-indigo-600 hover:to-purple-600 dark:hover:from-purple-700 dark:hover:via-indigo-700 dark:hover:to-purple-700 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 '.concat(
                  r
                    ? 'touch-feedback mobile-press bounce-in-mobile'
                    : 'btn-enhanced scale-on-interact',
                  ' active:scale-95 flex items-center gap-1.5'
                ),
              'aria-label': e('activities.custom.manageButton'),
              children: [
                (0, a.jsx)('span', { className: 'text-sm', children: '⚙️' }),
                (0, a.jsx)('span', { children: e('activities.custom.manageButton') }),
              ],
            }),
            y
              ? (0, a.jsx)('div', {
                  className:
                    'fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 sm:px-4 py-4 overflow-y-auto',
                  onClick: (e) => {
                    e.target === e.currentTarget && T();
                  },
                  children: (0, a.jsxs)('div', {
                    className:
                      'w-full max-w-2xl rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 my-auto max-h-[90vh] overflow-y-auto',
                    children: [
                      (0, a.jsxs)('div', {
                        className:
                          'flex items-start justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 border-gray-200 dark:border-gray-700',
                        children: [
                          (0, a.jsxs)('div', {
                            children: [
                              (0, a.jsx)('h2', {
                                className:
                                  'text-sm sm:text-base font-bold text-gray-950 dark:text-white',
                                children: e('activities.custom.title'),
                              }),
                              (0, a.jsx)('p', {
                                className:
                                  'text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5',
                                children: e('activities.custom.subtitle'),
                              }),
                            ],
                          }),
                          (0, a.jsx)('button', {
                            className:
                              'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 text-lg sm:text-xl flex-shrink-0 ml-2',
                            onClick: T,
                            'aria-label': e('form.cancel'),
                            children: '✕',
                          }),
                        ],
                      }),
                      (0, a.jsxs)('div', {
                        className:
                          'grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 py-3',
                        children: [
                          (0, a.jsxs)('form', {
                            className: 'space-y-3',
                            onSubmit: function (t) {
                              t.preventDefault();
                              let r = j.label.trim();
                              if (!r) {
                                E(e('activities.custom.errors.label'));
                                return;
                              }
                              if (!j.icon.trim()) {
                                E(e('activities.custom.errors.icon'));
                                return;
                              }
                              if (!j.unit.trim()) {
                                E(e('activities.custom.errors.unit'));
                                return;
                              }
                              if (!Number.isFinite(j.multiplier) || j.multiplier <= 0) {
                                E(e('activities.custom.errors.multiplier'));
                                return;
                              }
                              let a = Number(j.defaultAmount);
                              if (!Number.isFinite(a) || a <= 0) {
                                E(e('activities.custom.errors.defaultAmount'));
                                return;
                              }
                              let s = A
                                ? j.id
                                : r
                                    .toLowerCase()
                                    .trim()
                                    .replace(/[^a-z0-9]+/g, '-')
                                    .replace(/^-+|-+$/g, '') || 'custom-'.concat(Date.now());
                              if (!A && (p.some((e) => e.key === s) || b.some((e) => e.id === s))) {
                                E(e('activities.custom.errors.duplicate'));
                                return;
                              }
                              let i = j.labelEn.trim() || r,
                                n = j.unitEn.trim() || j.unit.trim(),
                                o = j.descriptionEn.trim() || j.description.trim() || void 0,
                                l = {
                                  id: s,
                                  label: r,
                                  labelEn: i !== r ? i : void 0,
                                  icon: j.icon,
                                  unit: j.unit.trim(),
                                  unitEn: n !== j.unit.trim() ? n : void 0,
                                  multiplier: Math.round(10 * j.multiplier) / 10,
                                  defaultAmount: Math.round(a),
                                  description: j.description.trim() || void 0,
                                  descriptionEn: o,
                                };
                              (A ? m(s, l) : x(l), S(), h(!1));
                            },
                            children: [
                              (0, a.jsxs)('div', {
                                className: 'grid '.concat(
                                  r ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2',
                                  ' gap-2'
                                ),
                                children: [
                                  (0, a.jsxs)('div', {
                                    children: [
                                      (0, a.jsxs)('label', {
                                        className: 'block '.concat(
                                          r ? 'text-[10px]' : 'text-xs',
                                          ' font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap'
                                        ),
                                        children: [
                                          e('activities.custom.fields.label'),
                                          ' ',
                                          (0, a.jsxs)('span', {
                                            className: 'text-[7px] font-normal',
                                            children: ['(', 'tr' === t ? 'TR' : 'EN', ')'],
                                          }),
                                        ],
                                      }),
                                      (0, a.jsx)('input', {
                                        type: 'text',
                                        value: 'tr' === t ? j.label : j.labelEn,
                                        onChange: (e) => {
                                          'tr' === t
                                            ? w((t) => ({ ...t, label: e.target.value }))
                                            : w((t) => ({ ...t, labelEn: e.target.value }));
                                        },
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            r ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm',
                                            ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                                          ),
                                        placeholder:
                                          'tr' === t
                                            ? e('activities.custom.placeholders.label')
                                            : 'e.g. Swimming',
                                        required: !0,
                                      }),
                                      'en' === t &&
                                        '' === j.label.trim() &&
                                        '' !== j.labelEn.trim() &&
                                        (0, a.jsx)('p', {
                                          className: 'text-[10px] text-gray-500 -mt-1',
                                          children:
                                            'Boş bırakılırsa T\xfcrk\xe7e adı kullanılacak.',
                                        }),
                                    ],
                                  }),
                                  (0, a.jsxs)('div', {
                                    children: [
                                      (0, a.jsxs)('label', {
                                        className: 'block '.concat(
                                          r ? 'text-[10px]' : 'text-xs',
                                          ' font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap'
                                        ),
                                        children: [
                                          e('activities.custom.fields.label'),
                                          ' ',
                                          (0, a.jsxs)('span', {
                                            className: 'text-[7px] font-normal',
                                            children: [
                                              '(',
                                              'tr' === t ? 'EN' : 'TR',
                                              ' - ',
                                              e('activities.custom.fields.optional'),
                                              ')',
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, a.jsx)('input', {
                                        type: 'text',
                                        value: 'tr' === t ? j.labelEn : j.label,
                                        onChange: (e) => {
                                          'tr' === t
                                            ? w((t) => ({ ...t, labelEn: e.target.value }))
                                            : w((t) => ({ ...t, label: e.target.value }));
                                        },
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            r ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm',
                                            ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                                          ),
                                        placeholder:
                                          'tr' === t ? 'e.g. Swimming' : '\xd6rn. Y\xfczme',
                                      }),
                                      'tr' === t &&
                                        '' === j.labelEn.trim() &&
                                        '' !== j.label.trim() &&
                                        (0, a.jsx)('p', {
                                          className: 'text-[10px] text-gray-500 -mt-1',
                                          children: 'If left empty, the Turkish name will be used.',
                                        }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, a.jsxs)('div', {
                                className: 'grid grid-cols-3 gap-2',
                                children: [
                                  (0, a.jsxs)('label', {
                                    className:
                                      'block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1',
                                    children: [
                                      e('activities.custom.fields.icon'),
                                      (0, a.jsx)('input', {
                                        type: 'text',
                                        maxLength: 4,
                                        value: j.icon,
                                        onChange: (e) => w((t) => ({ ...t, icon: e.target.value })),
                                        className:
                                          'mt-1 w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                                        placeholder: '\uD83C\uDFCA',
                                        required: !0,
                                      }),
                                    ],
                                  }),
                                  (0, a.jsxs)('label', {
                                    className:
                                      'block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1',
                                    children: [
                                      e('activities.custom.fields.multiplier'),
                                      (0, a.jsx)('input', {
                                        type: 'number',
                                        min: 0.1,
                                        step: 0.1,
                                        value: j.multiplier,
                                        onChange: (e) =>
                                          w((t) => ({ ...t, multiplier: Number(e.target.value) })),
                                        className:
                                          'mt-1 w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                                        required: !0,
                                      }),
                                    ],
                                  }),
                                  (0, a.jsxs)('label', {
                                    className:
                                      'block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1',
                                    children: [
                                      e('activities.custom.fields.defaultAmount'),
                                      (0, a.jsx)('input', {
                                        type: 'number',
                                        min: 1,
                                        step: 1,
                                        value: j.defaultAmount,
                                        onChange: (e) =>
                                          w((t) => ({ ...t, defaultAmount: e.target.value })),
                                        className:
                                          'mt-1 w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                                        required: !0,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, a.jsxs)('div', {
                                className: 'grid '.concat(
                                  r ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2',
                                  ' gap-2'
                                ),
                                children: [
                                  (0, a.jsxs)('div', {
                                    children: [
                                      (0, a.jsxs)('label', {
                                        className: 'block '.concat(
                                          r ? 'text-[10px]' : 'text-xs',
                                          ' font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap'
                                        ),
                                        children: [
                                          e('activities.custom.fields.unit'),
                                          ' ',
                                          (0, a.jsxs)('span', {
                                            className: 'text-[7px] font-normal',
                                            children: ['(', 'tr' === t ? 'TR' : 'EN', ')'],
                                          }),
                                        ],
                                      }),
                                      (0, a.jsx)('input', {
                                        type: 'text',
                                        value: 'tr' === t ? j.unit : j.unitEn,
                                        onChange: (e) => {
                                          'tr' === t
                                            ? w((t) => ({ ...t, unit: e.target.value }))
                                            : w((t) => ({ ...t, unitEn: e.target.value }));
                                        },
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            r ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm',
                                            ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                                          ),
                                        placeholder:
                                          'tr' === t
                                            ? e('activities.custom.placeholders.unit')
                                            : 'e.g. minutes',
                                        required: !0,
                                      }),
                                      'en' === t &&
                                        '' === j.unit.trim() &&
                                        '' !== j.unitEn.trim() &&
                                        (0, a.jsx)('p', {
                                          className: 'text-[10px] text-gray-500 -mt-1',
                                          children:
                                            'Boş bırakılırsa T\xfcrk\xe7e birimi kullanılacak.',
                                        }),
                                    ],
                                  }),
                                  (0, a.jsxs)('div', {
                                    children: [
                                      (0, a.jsxs)('label', {
                                        className: 'block '.concat(
                                          r ? 'text-[10px]' : 'text-xs',
                                          ' font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap'
                                        ),
                                        children: [
                                          e('activities.custom.fields.unit'),
                                          ' ',
                                          (0, a.jsxs)('span', {
                                            className: 'text-[7px] font-normal',
                                            children: [
                                              '(',
                                              'tr' === t ? 'EN' : 'TR',
                                              ' - ',
                                              e('activities.custom.fields.optional'),
                                              ')',
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, a.jsx)('input', {
                                        type: 'text',
                                        value: 'tr' === t ? j.unitEn : j.unit,
                                        onChange: (e) => {
                                          'tr' === t
                                            ? w((t) => ({ ...t, unitEn: e.target.value }))
                                            : w((t) => ({ ...t, unit: e.target.value }));
                                        },
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            r ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm',
                                            ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced'
                                          ),
                                        placeholder: 'tr' === t ? 'e.g. minutes' : '\xd6rn. dakika',
                                      }),
                                      'tr' === t &&
                                        '' === j.unitEn.trim() &&
                                        '' !== j.unit.trim() &&
                                        (0, a.jsx)('p', {
                                          className: 'text-[10px] text-gray-500 -mt-1',
                                          children: 'If left empty, the Turkish unit will be used.',
                                        }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, a.jsxs)('div', {
                                className: 'grid '.concat(
                                  r ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2',
                                  ' gap-2'
                                ),
                                children: [
                                  (0, a.jsxs)('div', {
                                    children: [
                                      (0, a.jsxs)('label', {
                                        className: 'block '.concat(
                                          r ? 'text-[10px]' : 'text-xs',
                                          ' font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap'
                                        ),
                                        children: [
                                          e('activities.custom.fields.description'),
                                          ' ',
                                          (0, a.jsxs)('span', {
                                            className: 'text-[7px] font-normal',
                                            children: ['(', 'tr' === t ? 'TR' : 'EN', ')'],
                                          }),
                                        ],
                                      }),
                                      (0, a.jsx)('textarea', {
                                        value: 'tr' === t ? j.description : j.descriptionEn,
                                        onChange: (e) => {
                                          'tr' === t
                                            ? w((t) => ({ ...t, description: e.target.value }))
                                            : w((t) => ({ ...t, descriptionEn: e.target.value }));
                                        },
                                        rows: r ? 1 : 2,
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            r ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm',
                                            ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced resize-none'
                                          ),
                                        placeholder:
                                          'tr' === t
                                            ? e('activities.custom.placeholders.description')
                                            : e('activities.custom.placeholders.descriptionEn'),
                                      }),
                                    ],
                                  }),
                                  (0, a.jsxs)('div', {
                                    children: [
                                      (0, a.jsxs)('label', {
                                        className: 'block '.concat(
                                          r ? 'text-[10px]' : 'text-xs',
                                          ' font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap'
                                        ),
                                        children: [
                                          e('activities.custom.fields.description'),
                                          ' ',
                                          (0, a.jsxs)('span', {
                                            className: 'text-[7px] font-normal',
                                            children: [
                                              '(',
                                              'tr' === t ? 'EN' : 'TR',
                                              ' - ',
                                              e('activities.custom.fields.optional'),
                                              ')',
                                            ],
                                          }),
                                        ],
                                      }),
                                      (0, a.jsx)('textarea', {
                                        value: 'tr' === t ? j.descriptionEn : j.description,
                                        onChange: (e) => {
                                          'tr' === t
                                            ? w((t) => ({ ...t, descriptionEn: e.target.value }))
                                            : w((t) => ({ ...t, description: e.target.value }));
                                        },
                                        rows: r ? 1 : 2,
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            r ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm',
                                            ' bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced resize-none'
                                          ),
                                        placeholder:
                                          'tr' === t
                                            ? e('activities.custom.placeholders.descriptionEn')
                                            : 'A\xe7ıklama girin',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (() => {
                                let r = 'tr' === t,
                                  s = j.description.trim(),
                                  i = j.descriptionEn.trim();
                                return (r ? '' === i && '' !== s : '' === s && '' !== i)
                                  ? (0, a.jsx)('p', {
                                      className: 'text-[10px] text-gray-500 -mt-1',
                                      children: e('activities.custom.fields.descriptionHint'),
                                    })
                                  : null;
                              })(),
                              N
                                ? (0, a.jsx)('p', {
                                    className: 'text-xs text-red-500',
                                    children: N,
                                  })
                                : null,
                              (0, a.jsxs)('div', {
                                className: 'flex items-center justify-end gap-2 pt-1',
                                children: [
                                  (0, a.jsx)('button', {
                                    type: 'button',
                                    onClick: T,
                                    className:
                                      'px-2.5 py-1.5 text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold',
                                    children: e('form.cancel'),
                                  }),
                                  (0, a.jsx)('button', {
                                    type: 'submit',
                                    className:
                                      'px-2.5 py-1.5 text-xs rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300',
                                    children: A
                                      ? e('activities.custom.save')
                                      : e('activities.custom.add'),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, a.jsxs)('div', {
                            className: 'space-y-2.5',
                            children: [
                              (0, a.jsxs)('section', {
                                className: 'space-y-1.5',
                                children: [
                                  (0, a.jsx)('h3', {
                                    className:
                                      'text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500',
                                    children: e('activities.custom.customList'),
                                  }),
                                  0 === b.length
                                    ? (0, a.jsx)('p', {
                                        className:
                                          'text-[10px] sm:text-xs text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded px-2 py-3',
                                        children: e('activities.custom.empty'),
                                      })
                                    : (0, a.jsx)('ul', {
                                        className: 'space-y-1.5',
                                        children: b.map((r) =>
                                          (0, a.jsxs)(
                                            'li',
                                            {
                                              className:
                                                'border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/50 px-2 py-1.5 flex items-center justify-between gap-2 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30 transition-all duration-200',
                                              children: [
                                                (0, a.jsxs)('div', {
                                                  className: 'min-w-0 flex-1',
                                                  children: [
                                                    (0, a.jsxs)('div', {
                                                      className:
                                                        'text-xs sm:text-sm font-bold flex items-center gap-1.5 truncate text-gray-950 dark:text-gray-100',
                                                      children: [
                                                        r.icon &&
                                                          (0, a.jsx)('span', { children: r.icon }),
                                                        (0, a.jsx)('span', {
                                                          className: 'truncate',
                                                          children: (0, d.Xr)(r, t),
                                                        }),
                                                      ],
                                                    }),
                                                    (0, a.jsxs)('div', {
                                                      className:
                                                        'text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400',
                                                      children: [
                                                        r.multiplier,
                                                        'x • ',
                                                        r.defaultAmount,
                                                        ' ',
                                                        (0, d.Jt)(r, t),
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                (0, a.jsxs)('div', {
                                                  className:
                                                    'flex items-center gap-1.5 text-[10px] sm:text-xs flex-shrink-0',
                                                  children: [
                                                    (0, a.jsx)('button', {
                                                      className:
                                                        'text-brand dark:text-brand-light hover:text-brand-dark dark:hover:text-brand font-semibold hover:underline px-1 transition-all duration-200',
                                                      onClick: () => M(r),
                                                      children: e('activities.custom.edit'),
                                                    }),
                                                    (0, a.jsx)('button', {
                                                      className:
                                                        'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold hover:underline px-1 transition-all duration-200',
                                                      onClick: () =>
                                                        (function (t) {
                                                          if (C.some((e) => e.key === t)) {
                                                            alert(
                                                              e(
                                                                'activities.custom.errors.cannotDeleteBase'
                                                              )
                                                            );
                                                            return;
                                                          }
                                                          if (D.has(t)) {
                                                            alert(
                                                              e('activities.custom.errors.inUse')
                                                            );
                                                            return;
                                                          }
                                                          confirm(
                                                            e('activities.custom.confirmDelete')
                                                          ) && (u(t), v === t && S());
                                                        })(r.id),
                                                      children: e('activities.custom.remove'),
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            },
                                            r.id
                                          )
                                        ),
                                      }),
                                ],
                              }),
                              (0, a.jsxs)('section', {
                                className: 'space-y-1.5',
                                children: [
                                  (0, a.jsx)('h3', {
                                    className:
                                      'text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500',
                                    children: e('activities.custom.baseList'),
                                  }),
                                  (0, a.jsx)('ul', {
                                    className:
                                      'space-y-1.5 max-h-40 sm:max-h-48 overflow-auto pr-1',
                                    children: C.map((r) =>
                                      (0, a.jsxs)(
                                        'li',
                                        {
                                          className:
                                            'border border-dashed border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 flex items-center justify-between gap-2',
                                          children: [
                                            (0, a.jsxs)('div', {
                                              className: 'min-w-0 flex-1',
                                              children: [
                                                (0, a.jsxs)('div', {
                                                  className:
                                                    'font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-200 flex items-center gap-1.5',
                                                  children: [
                                                    r.icon &&
                                                      (0, a.jsx)('span', { children: r.icon }),
                                                    (0, a.jsx)('span', {
                                                      children: (0, d.Xr)(r, t),
                                                    }),
                                                  ],
                                                }),
                                                (0, a.jsxs)('div', {
                                                  className:
                                                    'text-[10px] sm:text-xs text-gray-500 mt-0.5',
                                                  children: [
                                                    r.multiplier,
                                                    'x • ',
                                                    r.defaultAmount,
                                                    ' ',
                                                    (0, d.Jt)(r, t),
                                                  ],
                                                }),
                                              ],
                                            }),
                                            (0, a.jsx)('div', {
                                              className:
                                                'flex items-center gap-1.5 text-[10px] sm:text-xs flex-shrink-0',
                                              children: (0, a.jsx)('button', {
                                                className: 'text-brand hover:underline px-1',
                                                onClick: () => M(r),
                                                children: e('activities.custom.edit'),
                                              }),
                                            }),
                                          ],
                                        },
                                        r.key
                                      )
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                })
              : null,
          ],
        });
      }
      var k = r(10480),
        j = r(60923),
        w = r(27648);
      function N() {
        let { t: e } = (0, n.Q)(),
          t = (0, c.d)();
        return (0, a.jsxs)('div', {
          className: 'space-y-4 sm:space-y-5',
          children: [
            (0, a.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                (0, a.jsxs)('h1', {
                  className: 'text-2xl sm:text-3xl font-bold flex items-center gap-2 '.concat(
                    t ? 'title-entrance' : ''
                  ),
                  children: [
                    (0, a.jsx)('span', {
                      className: 'text-2xl sm:text-3xl '.concat(
                        t ? 'emoji-celebrate' : 'emoji-bounce'
                      ),
                      children: '\uD83D\uDCDD',
                    }),
                    (0, a.jsx)('span', {
                      className: 'text-gray-950 dark:text-white',
                      children: e('nav.activities'),
                    }),
                  ],
                }),
                (0, a.jsxs)('div', {
                  className: 'flex items-center gap-2',
                  children: [
                    (0, a.jsx)(w.default, {
                      href: '/add',
                      className:
                        'px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand text-xs sm:text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 '.concat(
                          t
                            ? 'touch-feedback mobile-press bounce-in-mobile'
                            : 'btn-enhanced scale-on-interact',
                          ' active:scale-95'
                        ),
                      'aria-label': e('actions.addActivity'),
                      children: e('actions.addActivity'),
                    }),
                    (0, a.jsx)(v, {}),
                  ],
                }),
              ],
            }),
            (0, a.jsx)(E, {}),
          ],
        });
      }
      function E() {
        var e;
        let { t, lang: r } = (0, n.Q)(),
          l = (0, c.d)(),
          { activities: f, deleteActivity: v, hydrated: w } = (0, o.G$)(),
          { showToast: N } = (0, k.P)(),
          [E, D] = (0, i.useState)(null),
          [C, A] = (0, i.useState)(null),
          [S, T] = (0, i.useState)({
            dateRange: 'all',
            activityType: 'all',
            category: 'all',
            searchQuery: '',
            sortBy: 'date-desc',
          }),
          M = (function (e) {
            let { activities: t } = (0, o.G$)(),
              { lang: r } = (0, n.Q)();
            return (0, i.useMemo)(() => {
              let a = [...t];
              if ('all' !== e.dateRange) {
                let t;
                let r = new Date(),
                  s = (0, m.i)(r);
                switch (e.dateRange) {
                  case 'today':
                    t = (0, u.b)(r);
                    break;
                  case 'week':
                    t = (0, u.b)((0, g.k)(r, 6));
                    break;
                  case 'month':
                    t = (0, u.b)((0, g.k)(r, 29));
                    break;
                  case 'custom':
                    if (!e.customStart || !e.customEnd) return a;
                    ((t = (0, u.b)(new Date(e.customStart))),
                      (s = (0, m.i)(new Date(e.customEnd))));
                    break;
                  default:
                    return a;
                }
                a = a.filter((e) => {
                  let r = (0, p.D)(e.performedAt);
                  return r >= t && r <= s;
                });
              }
              if (
                ('all' !== e.activityType &&
                  (a = a.filter((t) => t.activityKey === e.activityType)),
                e.searchQuery)
              ) {
                let t = e.searchQuery.toLowerCase();
                a = a.filter((e) => {
                  var a;
                  return (
                    ('tr' === r ? e.label : e.labelEn || e.label).toLowerCase().includes(t) ||
                    (null === (a = e.note) || void 0 === a
                      ? void 0
                      : a.toLowerCase().includes(t)) ||
                    e.activityKey.toLowerCase().includes(t)
                  );
                });
              }
              return (
                a.sort((t, r) => {
                  switch (e.sortBy) {
                    case 'date-desc':
                      return new Date(r.performedAt).getTime() - new Date(t.performedAt).getTime();
                    case 'date-asc':
                      return new Date(t.performedAt).getTime() - new Date(r.performedAt).getTime();
                    case 'points-desc':
                      return r.points - t.points;
                    case 'points-asc':
                      return t.points - r.points;
                    default:
                      return 0;
                  }
                }),
                a
              );
            }, [t, e, r]);
          })(S),
          R = (0, i.useMemo)(() => new Intl.NumberFormat('tr' === r ? 'tr-TR' : 'en-US'), [r]),
          Q = (0, i.useMemo)(
            () =>
              new Intl.DateTimeFormat('tr' === r ? 'tr-TR' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            [r]
          ),
          B = 'tr' === r ? b.tr : y._,
          L = (0, i.useMemo)(() => (0, u.b)(new Date()).toISOString(), []),
          F = (0, i.useMemo)(() => {
            var e;
            return E && null !== (e = f.find((e) => e.id === E)) && void 0 !== e ? e : null;
          }, [f, E]),
          z = (0, i.useMemo)(() => {
            let e = new Map();
            for (let r of M) {
              var t;
              let a = (0, u.b)(new Date(r.performedAt)).toISOString();
              e.set(a, [...(null !== (t = e.get(a)) && void 0 !== t ? t : []), r]);
            }
            return Array.from(e.entries())
              .map((e) => {
                let [t, r] = e;
                return {
                  day: t,
                  acts: r.sort((e, t) => +new Date(t.performedAt) - +new Date(e.performedAt)),
                };
              })
              .sort((e, t) => +new Date(t.day) - +new Date(e.day));
          }, [M]),
          U = (0, i.useMemo)(
            () => ({ totalPoints: M.reduce((e, t) => e + t.points, 0), totalCount: M.length }),
            [M]
          );
        return (0, a.jsxs)('div', {
          className: 'space-y-3 sm:space-y-4',
          children: [
            (0, a.jsx)(h, { filters: S, onFiltersChange: T }),
            ('all' !== S.dateRange ||
              'all' !== S.activityType ||
              'all' !== S.category ||
              S.searchQuery) &&
              (0, a.jsx)('div', {
                className:
                  'rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 px-3 py-2 shadow-md hover:shadow-xl transition-shadow duration-300',
                children: (0, a.jsxs)('div', {
                  className: 'flex items-center justify-between text-xs',
                  children: [
                    (0, a.jsx)('span', {
                      className: 'font-semibold text-gray-800 dark:text-gray-200',
                      children: t('filters.results'),
                    }),
                    (0, a.jsxs)('div', {
                      className: 'text-gray-700 dark:text-gray-200 font-semibold',
                      children: [
                        U.totalCount,
                        ' ',
                        t('filters.activities'),
                        ' \xb7',
                        ' ',
                        R.format(U.totalPoints),
                        ' ',
                        t('list.pointsUnit'),
                      ],
                    }),
                  ],
                }),
              }),
            (0, a.jsxs)('div', {
              className: 'space-y-2',
              children: [
                (0, a.jsxs)('div', {
                  className:
                    'flex items-center justify-between text-xs sm:text-sm font-medium px-1',
                  children: [
                    (0, a.jsx)('span', { children: t('list.records') }),
                    M.length !== f.length &&
                      (0, a.jsxs)('span', {
                        className:
                          'text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium',
                        children: [M.length, ' / ', f.length],
                      }),
                  ],
                }),
                (0, a.jsxs)('div', {
                  className:
                    'rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden',
                  children: [
                    0 === M.length
                      ? (0, a.jsxs)('div', {
                          className: 'p-12 text-center',
                          children: [
                            (0, a.jsx)('div', {
                              className: ''
                                .concat(l ? 'text-5xl' : 'text-6xl', ' mb-4 ')
                                .concat(l ? 'emoji-celebrate' : 'emoji-bounce'),
                              children: '\uD83D\uDD0D',
                            }),
                            (0, a.jsx)('p', {
                              className: ''.concat(
                                l ? 'text-base' : 'text-lg',
                                ' font-bold text-gray-950 dark:text-gray-100 mb-2'
                              ),
                              children: t('filters.noResults'),
                            }),
                            (0, a.jsx)('p', {
                              className: ''.concat(
                                l ? 'text-xs' : 'text-sm',
                                ' text-gray-600 dark:text-gray-400'
                              ),
                              children:
                                'tr' === r
                                  ? 'Filtreleri değiştirerek tekrar deneyin.'
                                  : 'Try changing the filters.',
                            }),
                          ],
                        })
                      : F
                        ? (0, a.jsxs)('div', {
                            className: 'border-b border-gray-200 dark:border-gray-800',
                            children: [
                              (0, a.jsxs)('div', {
                                className:
                                  'flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200',
                                children: [
                                  (0, a.jsx)('span', { children: t('list.editingTitle') }),
                                  (0, a.jsx)('button', {
                                    className: 'text-xs underline-offset-2 hover:underline',
                                    onClick: () => D(null),
                                    children: t('form.cancel'),
                                  }),
                                ],
                              }),
                              (0, a.jsx)('div', {
                                className: 'px-3 pb-3',
                                children: (0, a.jsx)(s.W, {
                                  initial: {
                                    id: F.id,
                                    activityKey: F.activityKey,
                                    label: F.label,
                                    labelEn: F.labelEn,
                                    icon: F.icon,
                                    unit: F.unit,
                                    unitEn: F.unitEn,
                                    multiplier: F.multiplier,
                                    amount: F.amount,
                                    note: null !== (e = F.note) && void 0 !== e ? e : '',
                                    performedAt: F.performedAt,
                                  },
                                  onSaved: () => {
                                    D(null);
                                  },
                                  onCancel: () => D(null),
                                }),
                              }),
                            ],
                          })
                        : null,
                    (0, a.jsx)(j.Q, {
                      open: !!C,
                      title: t('list.deleteConfirmTitle'),
                      message: C
                        ? t('list.deleteConfirmMessage', { activity: (0, d.Xr)(C.activity, r) })
                        : '',
                      variant: 'danger',
                      confirmLabel: t('list.delete'),
                      onConfirm: () => {
                        C &&
                          (v(C.id),
                          N(t('toast.activityDeleted'), 'success'),
                          E === C.id && D(null),
                          A(null));
                      },
                      onCancel: () => A(null),
                    }),
                    w
                      ? 0 === M.length
                        ? (0, a.jsx)('div', {
                            className:
                              'p-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium',
                            children: t('filters.noResults'),
                          })
                        : (0, a.jsx)('div', {
                            className: 'space-y-1',
                            children: z.map((e, s) => {
                              let { day: i, acts: n } = e;
                              return (0, a.jsxs)(
                                'div',
                                {
                                  className: 'space-y-1',
                                  children: [
                                    (0, a.jsx)('div', {
                                      className:
                                        'sticky top-0 z-10 date-header-entrance bg-gradient-to-r from-brand/10 via-brand/5 to-brand/10 dark:from-brand/20 dark:via-brand/10 dark:to-brand/20 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-900 dark:text-white border-b-2 border-brand/30 dark:border-brand/40 rounded-t-xl shadow-sm',
                                      children: (0, a.jsxs)('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          (0, a.jsx)('span', {
                                            className: 'text-brand dark:text-brand-light',
                                            children: '\uD83D\uDCC5',
                                          }),
                                          (0, a.jsx)('span', {
                                            className: 'drop-shadow-sm',
                                            children: (0, x.WU)(new Date(i), 'd MMMM EEEE', {
                                              locale: B,
                                            }),
                                          }),
                                        ],
                                      }),
                                    }),
                                    (0, a.jsx)('ul', {
                                      className: 'space-y-2 px-1 pb-2',
                                      children: n.map((e, i) => {
                                        let n =
                                          (0, u.b)(new Date(e.performedAt)).toISOString() === L;
                                        return (0, a.jsxs)(
                                          'li',
                                          {
                                            className:
                                              'activity-card-entrance activity-card-shimmer activity-card-hover activity-ripple gpu-accelerated group relative rounded-2xl '
                                                .concat(
                                                  n
                                                    ? 'ring-4 ring-brand/40 dark:ring-brand/50 shadow-2xl'
                                                    : 'shadow-lg',
                                                  ' border-2 '
                                                )
                                                .concat(
                                                  n
                                                    ? 'border-brand/50 dark:border-brand/60'
                                                    : 'border-gray-300/60 dark:border-gray-600/60',
                                                  ' bg-gradient-to-br '
                                                )
                                                .concat(
                                                  n
                                                    ? 'from-brand/10 via-white to-brand/5 dark:from-brand/20 dark:via-gray-900 dark:to-brand/10'
                                                    : 'from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
                                                  ' px-5 py-4 hover:shadow-2xl transition-all duration-300 overflow-hidden'
                                                ),
                                            style: {
                                              animationDelay: ''.concat(0.1 * s + 0.05 * i, 's'),
                                            },
                                            children: [
                                              (0, a.jsx)('div', {
                                                className:
                                                  'absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand/5 dark:from-brand/20 dark:via-transparent dark:to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none',
                                              }),
                                              (0, a.jsx)('div', {
                                                className:
                                                  'absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl pointer-events-none',
                                              }),
                                              (0, a.jsxs)('div', {
                                                className: 'relative z-10',
                                                children: [
                                                  (0, a.jsxs)('div', {
                                                    className:
                                                      'flex items-start justify-between gap-3 mb-3',
                                                    children: [
                                                      (0, a.jsxs)('div', {
                                                        className:
                                                          'flex items-center gap-3 flex-1 min-w-0',
                                                        children: [
                                                          (0, a.jsxs)('div', {
                                                            className: 'relative '
                                                              .concat(
                                                                l ? 'text-3xl' : 'text-4xl',
                                                                ' activity-icon-float '
                                                              )
                                                              .concat(
                                                                l
                                                                  ? 'emoji-celebrate'
                                                                  : 'emoji-bounce'
                                                              ),
                                                            children: [
                                                              e.icon,
                                                              n &&
                                                                (0, a.jsx)('span', {
                                                                  className:
                                                                    'absolute -top-1 -right-1 text-xs animate-pulse',
                                                                  children: '⭐',
                                                                }),
                                                            ],
                                                          }),
                                                          (0, a.jsxs)('div', {
                                                            className: 'flex-1 min-w-0',
                                                            children: [
                                                              (0, a.jsx)('h3', {
                                                                className: ''.concat(
                                                                  l ? 'text-lg' : 'text-xl',
                                                                  ' font-black text-gray-950 dark:text-white mb-1 drop-shadow-sm truncate'
                                                                ),
                                                                children: (0, d.Xr)(e, r),
                                                              }),
                                                              (0, a.jsxs)('div', {
                                                                className:
                                                                  'inline-flex items-center rounded-full points-badge-animated bg-gradient-to-r from-brand via-brand-dark to-brand text-white px-3 py-1 text-xs sm:text-sm font-black whitespace-nowrap border-2 border-white/30 dark:border-white/20 shadow-xl',
                                                                children: [
                                                                  (0, a.jsx)('span', {
                                                                    className:
                                                                      'text-sm drop-shadow-md',
                                                                    children: '✨',
                                                                  }),
                                                                  (0, a.jsx)('span', {
                                                                    className: 'ml-2 font-black',
                                                                    children: R.format(e.points),
                                                                  }),
                                                                  (0, a.jsx)('span', {
                                                                    className:
                                                                      'ml-1.5 text-[10px] opacity-95 font-bold',
                                                                    children: t('list.pointsUnit'),
                                                                  }),
                                                                ],
                                                              }),
                                                            ],
                                                          }),
                                                        ],
                                                      }),
                                                      n &&
                                                        (0, a.jsx)('span', {
                                                          className:
                                                            'px-2 py-1 rounded-lg bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide border border-green-500/30',
                                                          children: 'Bug\xfcn',
                                                        }),
                                                    ],
                                                  }),
                                                  (0, a.jsxs)('div', {
                                                    className: ''.concat(
                                                      l ? 'text-xs' : 'text-sm',
                                                      ' text-gray-700 dark:text-gray-300 mb-3 font-bold flex items-center gap-2 flex-wrap'
                                                    ),
                                                    children: [
                                                      (0, a.jsxs)('div', {
                                                        className:
                                                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50',
                                                        children: [
                                                          (0, a.jsx)('span', {
                                                            className: 'text-base',
                                                            children: '\uD83D\uDD50',
                                                          }),
                                                          (0, a.jsx)('span', {
                                                            children: Q.format(
                                                              new Date(e.performedAt)
                                                            ),
                                                          }),
                                                        ],
                                                      }),
                                                      (0, a.jsxs)('div', {
                                                        className:
                                                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50',
                                                        children: [
                                                          (0, a.jsx)('span', {
                                                            className: 'text-base',
                                                            children: '\uD83D\uDCCA',
                                                          }),
                                                          (0, a.jsx)('span', {
                                                            className: 'font-black',
                                                            children: e.amount,
                                                          }),
                                                          (0, a.jsx)('span', {
                                                            children: (0, d.Jt)(e, r),
                                                          }),
                                                        ],
                                                      }),
                                                      (0, a.jsxs)('div', {
                                                        className:
                                                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-800 dark:text-purple-300 border border-purple-300/50 dark:border-purple-700/50',
                                                        children: [
                                                          (0, a.jsx)('span', {
                                                            className: 'text-base',
                                                            children: '⚡',
                                                          }),
                                                          (0, a.jsxs)('span', {
                                                            className: 'font-black',
                                                            children: [e.multiplier, 'x'],
                                                          }),
                                                        ],
                                                      }),
                                                      e.duration &&
                                                        e.duration > 0 &&
                                                        (0, a.jsxs)('div', {
                                                          className:
                                                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-100/80 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-700/50',
                                                          children: [
                                                            (0, a.jsx)('span', {
                                                              className: 'text-base',
                                                              children: '⏱️',
                                                            }),
                                                            (0, a.jsx)('span', {
                                                              className: 'font-black',
                                                              children: (function (e, t) {
                                                                let r = Math.floor(e / 3600),
                                                                  a = Math.floor((e % 3600) / 60),
                                                                  s = e % 60;
                                                                return r > 0
                                                                  ? ''
                                                                      .concat(r, ':')
                                                                      .concat(
                                                                        String(a).padStart(2, '0'),
                                                                        ':'
                                                                      )
                                                                      .concat(
                                                                        String(s).padStart(2, '0')
                                                                      )
                                                                  : ''
                                                                      .concat(a, ':')
                                                                      .concat(
                                                                        String(s).padStart(2, '0')
                                                                      );
                                                              })(e.duration, 0),
                                                            }),
                                                          ],
                                                        }),
                                                    ],
                                                  }),
                                                  e.note &&
                                                    (0, a.jsxs)('div', {
                                                      className: ''.concat(
                                                        l ? 'text-xs' : 'text-sm',
                                                        ' mb-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-100/90 to-gray-50/90 dark:from-gray-800/80 dark:to-gray-700/80 border-l-4 border-brand/60 dark:border-brand/70 text-gray-800 dark:text-gray-200 line-clamp-2 font-semibold italic shadow-inner'
                                                      ),
                                                      children: [
                                                        (0, a.jsx)('span', {
                                                          className:
                                                            'text-brand dark:text-brand-light mr-1',
                                                          children: '"',
                                                        }),
                                                        e.note,
                                                        (0, a.jsx)('span', {
                                                          className:
                                                            'text-brand dark:text-brand-light ml-1',
                                                          children: '"',
                                                        }),
                                                      ],
                                                    }),
                                                  (0, a.jsxs)('div', {
                                                    className:
                                                      'flex items-center gap-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300',
                                                    children: [
                                                      (0, a.jsxs)('button', {
                                                        className:
                                                          'flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2',
                                                        onClick: () => D(e.id),
                                                        children: [
                                                          (0, a.jsx)('span', {
                                                            className: 'text-base',
                                                            children: '✏️',
                                                          }),
                                                          (0, a.jsx)('span', {
                                                            children: t('list.edit'),
                                                          }),
                                                        ],
                                                      }),
                                                      (0, a.jsxs)('button', {
                                                        className:
                                                          'flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center justify-center gap-2',
                                                        disabled: !n,
                                                        title: n
                                                          ? void 0
                                                          : t('list.deleteDisabled'),
                                                        onClick: () => {
                                                          n && A({ id: e.id, activity: e });
                                                        },
                                                        children: [
                                                          (0, a.jsx)('span', {
                                                            className: 'text-base',
                                                            children: '\uD83D\uDDD1️',
                                                          }),
                                                          (0, a.jsx)('span', {
                                                            children: t('list.delete'),
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          },
                                          e.id
                                        );
                                      }),
                                    }),
                                  ],
                                },
                                i
                              );
                            }),
                          })
                      : (0, a.jsxs)('div', {
                          className: 'p-3 space-y-2',
                          children: [
                            (0, a.jsx)('div', { className: 'h-5 w-32 rounded skeleton' }),
                            (0, a.jsx)('div', { className: 'h-10 rounded skeleton' }),
                            (0, a.jsx)('div', { className: 'h-10 rounded skeleton' }),
                          ],
                        }),
                  ],
                }),
              ],
            }),
          ],
        });
      }
    },
    60923: function (e, t, r) {
      'use strict';
      r.d(t, {
        Q: function () {
          return l;
        },
      });
      var a = r(57437),
        s = r(54887),
        i = r(2265),
        n = r(98661),
        o = r(78466);
      function l(e) {
        let {
            open: t,
            title: r,
            message: l,
            confirmLabel: d,
            cancelLabel: c,
            onConfirm: x,
            onCancel: m,
            variant: u = 'default',
          } = e,
          { t: g } = (0, n.Q)(),
          [p, b] = (0, i.useState)(!1),
          y = (0, o.d)();
        if (
          ((0, i.useEffect)(() => {
            b(!0);
          }, []),
          (0, i.useEffect)(
            () => (
              t ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = ''),
              () => {
                document.body.style.overflow = '';
              }
            ),
            [t]
          ),
          (0, i.useEffect)(() => {
            if (!t) return;
            let e = (e) => {
              'Escape' === e.key && m();
            };
            return (
              document.addEventListener('keydown', e),
              () => document.removeEventListener('keydown', e)
            );
          }, [t, m]),
          !p || !t)
        )
          return null;
        let h = () => {
            m();
          },
          f = (0, a.jsx)('div', {
            className: 'fixed inset-0 z-[9999] flex '
              .concat(y ? 'items-end' : 'items-center justify-center', ' bg-black/50 ')
              .concat(y ? '' : 'backdrop-blur-sm', ' ')
              .concat(y ? 'backdrop-fade' : 'animate-fade-in', ' safe-bottom'),
            onClick: (e) => {
              e.target === e.currentTarget && h();
            },
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'confirm-dialog-title',
            'aria-describedby': 'confirm-dialog-message',
            children: (0, a.jsx)('div', {
              className:
                'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                  y
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
                      y ? 'text-xl' : 'text-lg',
                      ' font-bold text-gray-950 dark:text-white mb-2'
                    ),
                    children: r,
                  }),
                  (0, a.jsx)('p', {
                    id: 'confirm-dialog-message',
                    className: ''.concat(
                      y ? 'text-base' : 'text-sm',
                      ' font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed'
                    ),
                    children: l,
                  }),
                  (0, a.jsxs)('div', {
                    className: 'flex items-center '.concat(
                      y ? 'flex-col-reverse gap-2' : 'justify-end gap-3'
                    ),
                    children: [
                      (0, a.jsx)('button', {
                        type: 'button',
                        onClick: h,
                        className: ''.concat(
                          y ? 'w-full min-h-[44px] touch-feedback mobile-press' : 'px-4 py-2',
                          ' text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 active:scale-95'
                        ),
                        'aria-label': c || g('form.cancel'),
                        children: c || g('form.cancel'),
                      }),
                      (0, a.jsx)('button', {
                        type: 'button',
                        onClick: () => {
                          x();
                        },
                        className: ''
                          .concat(
                            y ? 'w-full min-h-[44px] touch-feedback mobile-press' : 'px-4 py-2',
                            ' text-sm font-semibold text-white rounded-lg transition-all duration-200 active:scale-95 hover:shadow-xl '
                          )
                          .concat(
                            'danger' === u
                              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600'
                              : 'bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand'
                          ),
                        'aria-label': d || g('form.confirm'),
                        autoFocus: !0,
                        children: d || g('form.confirm'),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          });
        return (0, s.createPortal)(f, document.body);
      }
    },
  },
  function (e) {
    (e.O(0, [6317, 9750, 2174, 9129, 7219, 2971, 2117, 1744], function () {
      return e((e.s = 59187));
    }),
      (_N_E = e.O()));
  },
]);
