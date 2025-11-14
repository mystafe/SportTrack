(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [3185],
  {
    41550: function (e, t, r) {
      (Promise.resolve().then(r.t.bind(r, 2778, 23)),
        Promise.resolve().then(r.bind(r, 92834)),
        Promise.resolve().then(r.bind(r, 12106)),
        Promise.resolve().then(r.bind(r, 98727)),
        Promise.resolve().then(r.bind(r, 22583)),
        Promise.resolve().then(r.bind(r, 55859)));
    },
    60923: function (e, t, r) {
      'use strict';
      r.d(t, {
        Q: function () {
          return l;
        },
      });
      var a = r(57437),
        n = r(54887),
        o = r(2265),
        s = r(98661),
        i = r(78466);
      function l(e) {
        let {
            open: t,
            title: r,
            message: l,
            confirmLabel: d,
            cancelLabel: c,
            onConfirm: u,
            onCancel: g,
            variant: m = 'default',
          } = e,
          { t: y } = (0, s.Q)(),
          [x, h] = (0, o.useState)(!1),
          p = (0, i.d)();
        if (
          ((0, o.useEffect)(() => {
            h(!0);
          }, []),
          (0, o.useEffect)(
            () => (
              t ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = ''),
              () => {
                document.body.style.overflow = '';
              }
            ),
            [t]
          ),
          (0, o.useEffect)(() => {
            if (!t) return;
            let e = (e) => {
              'Escape' === e.key && g();
            };
            return (
              document.addEventListener('keydown', e),
              () => document.removeEventListener('keydown', e)
            );
          }, [t, g]),
          !x || !t)
        )
          return null;
        let b = () => {
            g();
          },
          f = (0, a.jsx)('div', {
            className: 'fixed inset-0 z-[9999] flex '
              .concat(p ? 'items-end' : 'items-center justify-center', ' bg-black/50 ')
              .concat(p ? '' : 'backdrop-blur-sm', ' ')
              .concat(p ? 'backdrop-fade' : 'animate-fade-in', ' safe-bottom'),
            onClick: (e) => {
              e.target === e.currentTarget && b();
            },
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'confirm-dialog-title',
            'aria-describedby': 'confirm-dialog-message',
            children: (0, a.jsx)('div', {
              className:
                'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                  p
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
                      p ? 'text-xl' : 'text-lg',
                      ' font-bold text-gray-950 dark:text-white mb-2'
                    ),
                    children: r,
                  }),
                  (0, a.jsx)('p', {
                    id: 'confirm-dialog-message',
                    className: ''.concat(
                      p ? 'text-base' : 'text-sm',
                      ' font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed'
                    ),
                    children: l,
                  }),
                  (0, a.jsxs)('div', {
                    className: 'flex items-center '.concat(
                      p ? 'flex-col-reverse gap-2' : 'justify-end gap-3'
                    ),
                    children: [
                      (0, a.jsx)('button', {
                        type: 'button',
                        onClick: b,
                        className: ''.concat(
                          p ? 'w-full min-h-[44px] touch-feedback mobile-press' : 'px-4 py-2',
                          ' text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 active:scale-95'
                        ),
                        'aria-label': c || y('form.cancel'),
                        children: c || y('form.cancel'),
                      }),
                      (0, a.jsx)('button', {
                        type: 'button',
                        onClick: () => {
                          u();
                        },
                        className: ''
                          .concat(
                            p ? 'w-full min-h-[44px] touch-feedback mobile-press' : 'px-4 py-2',
                            ' text-sm font-semibold text-white rounded-lg transition-all duration-200 active:scale-95 hover:shadow-xl '
                          )
                          .concat(
                            'danger' === m
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
        return (0, n.createPortal)(f, document.body);
      }
    },
    92834: function (e, t, r) {
      'use strict';
      r.d(t, {
        Footer: function () {
          return s;
        },
      });
      var a = r(57437),
        n = r(98661),
        o = r(78466);
      function s() {
        let { t: e } = (0, n.Q)(),
          t = (0, o.d)();
        return (0, a.jsxs)('footer', {
          className: 'container py-10 '.concat(
            t ? 'mb-20' : 'mb-24',
            ' safe-bottom text-sm text-gray-500 dark:text-gray-400 flex flex-row items-center justify-between gap-2'
          ),
          children: [
            (0, a.jsxs)('span', {
              className: 'font-medium',
              children: [
                '\xa9 ',
                new Date().getFullYear(),
                ' SportTrack \xb7 ',
                e('footer.byName'),
              ],
            }),
            (0, a.jsxs)('span', {
              className: 'font-semibold',
              children: [
                'v0.14.8 ',
                (0, a.jsx)('span', { className: 'uppercase tracking-wide', children: 'beta' }),
              ],
            }),
          ],
        });
      }
    },
    12106: function (e, t, r) {
      'use strict';
      r.d(t, {
        Header: function () {
          return $;
        },
      });
      var a = r(57437),
        n = r(2265),
        o = r(27648),
        s = r(78705);
      function i() {
        let [e, t] = (0, n.useState)('system');
        function r(e) {
          let t = document.documentElement,
            r = window.matchMedia('(prefers-color-scheme: dark)').matches;
          t.classList.toggle('dark', 'dark' === e || ('system' === e && r));
        }
        function o(e) {
          (t(e), localStorage.setItem(s.I.THEME, e), r(e));
        }
        return (
          (0, n.useEffect)(() => {
            let e = localStorage.getItem(s.I.THEME);
            e ? (t(e), r(e)) : r('system');
          }, []),
          (0, a.jsxs)('div', {
            className:
              'inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-0.5 sm:p-1',
            children: [
              (0, a.jsx)('button', {
                type: 'button',
                className:
                  'px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded transition-all duration-200 hover:scale-110 active:scale-95 '.concat(
                    'light' === e
                      ? 'bg-brand text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ),
                onClick: () => o('light'),
                'aria-pressed': 'light' === e,
                title: 'Light',
                children: '☀️',
              }),
              (0, a.jsx)('button', {
                type: 'button',
                className:
                  'px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded transition-all duration-200 hover:scale-110 active:scale-95 '.concat(
                    'system' === e
                      ? 'bg-brand text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ),
                onClick: () => o('system'),
                'aria-pressed': 'system' === e,
                title: 'System',
                children: '\uD83D\uDDA5️',
              }),
              (0, a.jsx)('button', {
                type: 'button',
                className:
                  'px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded transition-all duration-200 hover:scale-110 active:scale-95 '.concat(
                    'dark' === e
                      ? 'bg-brand text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ),
                onClick: () => o('dark'),
                'aria-pressed': 'dark' === e,
                title: 'Dark',
                children: '\uD83C\uDF19',
              }),
            ],
          })
        );
      }
      var l = r(98661);
      function d() {
        let { lang: e, setLang: t } = (0, l.Q)();
        return (0, a.jsx)('div', {
          className:
            'inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-0.5 sm:p-1',
          children: [
            { code: 'tr', label: 'TR' },
            { code: 'en', label: 'EN' },
          ].map((r) =>
            (0, a.jsx)(
              'button',
              {
                type: 'button',
                className:
                  'px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded transition-all duration-200 hover:scale-110 active:scale-95 '.concat(
                    e === r.code
                      ? 'bg-brand text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ),
                onClick: () => t(r.code),
                'aria-pressed': e === r.code,
                children: r.label,
              },
              r.code
            )
          ),
        });
      }
      var c = r(54887),
        u = r(58151),
        g = r(60186),
        m = r(24979),
        y = r(10480),
        x = r(14258),
        h = r(60936),
        p = r(34479),
        b = r(8608),
        f = r(71598);
      async function v(e, t, a) {
        let { jsPDF: n } = await Promise.all([r.e(3125), r.e(2505), r.e(8758)]).then(
            r.bind(r, 53375)
          ),
          o = (await r.e(6994).then(r.bind(r, 46994))).default,
          s = 'tr' === a.language ? b.tr : f._,
          i = 'tr' === a.language ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy HH:mm',
          l = e;
        a.dateRange &&
          (l = e.filter((e) => {
            let t = (0, h.D)(e.performedAt);
            return t >= a.dateRange.start && t <= a.dateRange.end;
          }));
        let d = new n();
        (d.internal.pageSize.getWidth(), d.internal.pageSize.getHeight());
        let c = 14,
          u = 'tr' === a.language ? 'SportTrack Aktivite Raporu' : 'SportTrack Activity Report';
        if ((d.setFontSize(18), d.setFont('helvetica', 'bold'), d.text(u, 14, c), (c += 10), t)) {
          (d.setFontSize(11), d.setFont('helvetica', 'normal'));
          let e = t.mood
              ? 'tr' === a.language
                ? ' | Ruh Hali: '.concat(
                    'happy' === t.mood
                      ? 'Mutlu'
                      : 'cheerful' === t.mood
                        ? 'Neşeli'
                        : 'sad' === t.mood
                          ? '\xdczg\xfcn'
                          : 'unhappy' === t.mood
                            ? 'Mutsuz'
                            : 'tired' === t.mood
                              ? 'Yorgun/Hasta'
                              : ''
                  )
                : ' | Mood: '.concat(
                    'happy' === t.mood
                      ? 'Happy'
                      : 'cheerful' === t.mood
                        ? 'Cheerful'
                        : 'sad' === t.mood
                          ? 'Sad'
                          : 'unhappy' === t.mood
                            ? 'Unhappy'
                            : 'tired' === t.mood
                              ? 'Tired/Sick'
                              : ''
                  )
              : '',
            r =
              'tr' === a.language
                ? 'Kullanıcı: '
                    .concat(t.name, ' | G\xfcnl\xfck Hedef: ')
                    .concat(t.dailyTarget.toLocaleString(), ' puan')
                    .concat(e)
                : 'User: '
                    .concat(t.name, ' | Daily Goal: ')
                    .concat(t.dailyTarget.toLocaleString(), ' points')
                    .concat(e);
          (d.text(r, 14, c), (c += 8));
        }
        if (a.dateRange) {
          let e =
            'tr' === a.language
              ? 'Tarih Aralığı: '
                  .concat((0, p.WU)(a.dateRange.start, 'dd.MM.yyyy', { locale: s }), ' - ')
                  .concat((0, p.WU)(a.dateRange.end, 'dd.MM.yyyy', { locale: s }))
              : 'Date Range: '
                  .concat((0, p.WU)(a.dateRange.start, 'MM/dd/yyyy', { locale: s }), ' - ')
                  .concat((0, p.WU)(a.dateRange.end, 'MM/dd/yyyy', { locale: s }));
          (d.text(e, 14, c), (c += 8));
        }
        let g =
          'tr' === a.language
            ? 'Rapor Tarihi: '.concat((0, p.WU)(new Date(), 'dd.MM.yyyy HH:mm', { locale: s }))
            : 'Report Date: '.concat((0, p.WU)(new Date(), 'MM/dd/yyyy HH:mm', { locale: s }));
        (d.text(g, 14, c), (c += 10));
        let m = l.length,
          y = l.reduce((e, t) => e + t.points, 0),
          v = m > 0 ? Math.round(y / m) : 0,
          k = 'tr' === a.language ? '\xd6zet' : 'Summary';
        (d.setFontSize(14),
          d.setFont('helvetica', 'bold'),
          d.text(k, 14, c),
          (c += 8),
          d.setFontSize(10),
          d.setFont('helvetica', 'normal'),
          ('tr' === a.language
            ? [
                'Toplam Aktivite: '.concat(m),
                'Toplam Puan: '.concat(y.toLocaleString()),
                'Ortalama Puan: '.concat(v.toLocaleString()),
              ]
            : [
                'Total Activities: '.concat(m),
                'Total Points: '.concat(y.toLocaleString()),
                'Average Points: '.concat(v.toLocaleString()),
              ]
          ).forEach((e) => {
            (d.text(e, 19, c), (c += 6));
          }),
          (c += 5),
          o(d, {
            head:
              'tr' === a.language
                ? [['Tarih', 'Aktivite', 'Miktar', 'Birim', 'Puan', 'Not']]
                : [['Date', 'Activity', 'Amount', 'Unit', 'Points', 'Note']],
            body: l.map((e) => {
              let t = (0, h.D)(e.performedAt);
              return [
                (0, p.WU)(t, i, { locale: s }),
                (0, x.Xr)(e, a.language),
                String(e.amount),
                (0, x.Jt)(e, a.language),
                String(e.points),
                e.note || '',
              ];
            }),
            startY: c,
            margin: { left: 14, right: 14 },
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            columnStyles: {
              0: { cellWidth: 35 },
              1: { cellWidth: 40 },
              2: { cellWidth: 20 },
              3: { cellWidth: 25 },
              4: { cellWidth: 20 },
              5: { cellWidth: 50 },
            },
          }),
          d.save('sporttrack-report-'.concat((0, p.WU)(new Date(), 'yyyy-MM-dd'), '.pdf')));
      }
      var k = r(78466),
        w = r(56942),
        j = r(7641),
        N = r(5341);
      function S(e) {
        let { open: t, onClose: r } = e,
          { activities: o } = (0, m.G$)(),
          { settings: s } = (0, u.rV)(),
          { t: i, lang: d } = (0, l.Q)(),
          { showToast: g } = (0, y.P)(),
          S = (0, k.d)(),
          [C, D] = (0, n.useState)('csv'),
          [E, T] = (0, n.useState)('all'),
          [L, z] = (0, n.useState)(''),
          [I, R] = (0, n.useState)(''),
          [A, F] = (0, n.useState)(!1);
        if (!t) return null;
        let M = async () => {
            F(!0);
            try {
              let e;
              if ('custom' === E) {
                if (!L || !I) {
                  (g(i('export.dateRangeRequired'), 'error'), F(!1));
                  return;
                }
                e = { start: (0, w.b)(new Date(L)), end: (0, j.i)(new Date(I)) };
              } else
                '7days' === E
                  ? (e = { start: (0, w.b)((0, N.k)(new Date(), 7)), end: (0, j.i)(new Date()) })
                  : '30days' === E &&
                    (e = { start: (0, w.b)((0, N.k)(new Date(), 30)), end: (0, j.i)(new Date()) });
              let t = { format: C, dateRange: e, language: d };
              ('csv' === C
                ? ((function (e, t, r) {
                    let a = 'tr' === r.language ? b.tr : f._,
                      n = 'tr' === r.language ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy HH:mm',
                      o = e;
                    r.dateRange &&
                      (o = e.filter((e) => {
                        let t = (0, h.D)(e.performedAt);
                        return t >= r.dateRange.start && t <= r.dateRange.end;
                      }));
                    let s =
                        'tr' === r.language
                          ? ['Tarih', 'Saat', 'Aktivite', 'Miktar', 'Birim', 'Puan', 'Not']
                          : ['Date', 'Time', 'Activity', 'Amount', 'Unit', 'Points', 'Note'],
                      i = o.map((e) => {
                        let t = (0, h.D)(e.performedAt),
                          [o, s] = (0, p.WU)(t, n, { locale: a }).split(' ');
                        return [
                          o,
                          s || '',
                          (0, x.Xr)(e, r.language),
                          String(e.amount),
                          (0, x.Jt)(e, r.language),
                          String(e.points),
                          e.note || '',
                        ];
                      }),
                      l = o.reduce((e, t) => e + t.points, 0),
                      d = 'tr' === r.language ? 'TOPLAM' : 'TOTAL';
                    i.push(['', '', '', '', '', d, String(l)]);
                    let c = [
                        s.join(','),
                        ...i.map((e) =>
                          e.map((e) => '"'.concat(String(e).replace(/"/g, '""'), '"')).join(',')
                        ),
                      ].join('\n'),
                      u = new Blob(['\uFEFF' + c], { type: 'text/csv;charset=utf-8;' }),
                      g = URL.createObjectURL(u),
                      m = document.createElement('a');
                    ((m.href = g),
                      (m.download = 'sporttrack-export-'.concat(
                        (0, p.WU)(new Date(), 'yyyy-MM-dd'),
                        '.csv'
                      )),
                      document.body.appendChild(m),
                      m.click(),
                      document.body.removeChild(m),
                      URL.revokeObjectURL(g));
                  })(o, 0, t),
                  g(i('export.csvSuccess'), 'success'))
                : 'pdf' === C
                  ? (await v(o, s, t), g(i('export.pdfSuccess'), 'success'))
                  : 'json' === C &&
                    ((function (e, t, r) {
                      let a = e;
                      r.dateRange &&
                        (a = e.filter((e) => {
                          let t = (0, h.D)(e.performedAt);
                          return t >= r.dateRange.start && t <= r.dateRange.end;
                        }));
                      let n = new Blob(
                          [
                            JSON.stringify(
                              {
                                activities: a,
                                settings: t || null,
                                exportDate: new Date().toISOString(),
                                version: '0.14.1',
                                dateRange: r.dateRange
                                  ? {
                                      start: r.dateRange.start.toISOString(),
                                      end: r.dateRange.end.toISOString(),
                                    }
                                  : null,
                                summary: {
                                  totalActivities: a.length,
                                  totalPoints: a.reduce((e, t) => e + t.points, 0),
                                  averagePoints:
                                    a.length > 0
                                      ? Math.round(a.reduce((e, t) => e + t.points, 0) / a.length)
                                      : 0,
                                },
                              },
                              null,
                              2
                            ),
                          ],
                          { type: 'application/json' }
                        ),
                        o = URL.createObjectURL(n),
                        s = document.createElement('a');
                      ((s.href = o),
                        (s.download = 'sporttrack-backup-'.concat(
                          (0, p.WU)(new Date(), 'yyyy-MM-dd'),
                          '.json'
                        )),
                        document.body.appendChild(s),
                        s.click(),
                        document.body.removeChild(s),
                        URL.revokeObjectURL(o));
                    })(o, s, t),
                    g(i('export.jsonSuccess'), 'success')),
                r());
            } catch (e) {
              (console.error('Export failed:', e), g(i('export.failed'), 'error'));
            } finally {
              F(!1);
            }
          },
          H = (0, a.jsx)('div', {
            className: 'fixed inset-0 z-[9999] flex '
              .concat(S ? 'items-end' : 'items-center justify-center', ' bg-black/50 ')
              .concat(S ? '' : 'backdrop-blur-sm', ' animate-fade-in safe-bottom'),
            onClick: (e) => {
              e.target === e.currentTarget && r();
            },
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'export-dialog-title',
            children: (0, a.jsx)('div', {
              className:
                'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 '.concat(
                  S
                    ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto'
                    : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-md w-full mx-4',
                  ' border-2 border-gray-200 dark:border-gray-700 animate-scale-in'
                ),
              children: (0, a.jsxs)('div', {
                className: ''.concat('p-6'),
                children: [
                  (0, a.jsx)('h2', {
                    id: 'export-dialog-title',
                    className: ''.concat(
                      S ? 'text-xl' : 'text-lg',
                      ' font-bold text-gray-950 dark:text-white mb-4'
                    ),
                    children: i('export.title'),
                  }),
                  (0, a.jsxs)('div', {
                    className: 'mb-4',
                    children: [
                      (0, a.jsx)('label', {
                        className:
                          'block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2',
                        children: i('export.format'),
                      }),
                      (0, a.jsxs)('div', {
                        className: 'flex '.concat(S ? 'flex-col' : 'flex-row', ' gap-2'),
                        children: [
                          (0, a.jsx)('button', {
                            type: 'button',
                            onClick: () => D('csv'),
                            className:
                              'flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 '.concat(
                                'csv' === C
                                  ? 'bg-gradient-to-r from-brand to-brand-dark text-white border-brand shadow-md'
                                  : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                              ),
                            children: 'CSV',
                          }),
                          (0, a.jsx)('button', {
                            type: 'button',
                            onClick: () => D('pdf'),
                            className:
                              'flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 '.concat(
                                'pdf' === C
                                  ? 'bg-gradient-to-r from-brand to-brand-dark text-white border-brand shadow-md'
                                  : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                              ),
                            children: 'PDF',
                          }),
                          (0, a.jsx)('button', {
                            type: 'button',
                            onClick: () => D('json'),
                            className:
                              'flex-1 px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 '.concat(
                                'json' === C
                                  ? 'bg-gradient-to-r from-brand to-brand-dark text-white border-brand shadow-md'
                                  : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
                              ),
                            children: 'JSON',
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, a.jsxs)('div', {
                    className: 'mb-4',
                    children: [
                      (0, a.jsx)('label', {
                        className:
                          'block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2',
                        children: i('export.dateRange'),
                      }),
                      (0, a.jsxs)('select', {
                        value: E,
                        onChange: (e) => T(e.target.value),
                        className:
                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced',
                        children: [
                          (0, a.jsx)('option', { value: 'all', children: i('export.allTime') }),
                          (0, a.jsx)('option', { value: '7days', children: i('export.last7Days') }),
                          (0, a.jsx)('option', {
                            value: '30days',
                            children: i('export.last30Days'),
                          }),
                          (0, a.jsx)('option', {
                            value: 'custom',
                            children: i('export.customRange'),
                          }),
                        ],
                      }),
                    ],
                  }),
                  'custom' === E &&
                    (0, a.jsxs)('div', {
                      className: 'mb-4 grid grid-cols-2 gap-2',
                      children: [
                        (0, a.jsxs)('div', {
                          children: [
                            (0, a.jsx)('label', {
                              className: 'block text-xs text-gray-600 dark:text-gray-400 mb-1',
                              children: i('export.startDate'),
                            }),
                            (0, a.jsx)('input', {
                              type: 'date',
                              value: L,
                              onChange: (e) => z(e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced',
                            }),
                          ],
                        }),
                        (0, a.jsxs)('div', {
                          children: [
                            (0, a.jsx)('label', {
                              className: 'block text-xs text-gray-600 dark:text-gray-400 mb-1',
                              children: i('export.endDate'),
                            }),
                            (0, a.jsx)('input', {
                              type: 'date',
                              value: I,
                              onChange: (e) => R(e.target.value),
                              max: (0, p.WU)(new Date(), 'yyyy-MM-dd'),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-sm input-enhanced',
                            }),
                          ],
                        }),
                      ],
                    }),
                  (0, a.jsxs)('div', {
                    className: 'flex items-center '.concat(
                      S ? 'flex-col-reverse gap-2' : 'justify-end gap-3'
                    ),
                    children: [
                      (0, a.jsx)('button', {
                        type: 'button',
                        onClick: r,
                        className: ''.concat(
                          S ? 'w-full min-h-[44px]' : 'px-4 py-2',
                          ' text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 active:scale-95'
                        ),
                        children: i('form.cancel'),
                      }),
                      (0, a.jsx)('button', {
                        type: 'button',
                        onClick: M,
                        disabled: A,
                        className: ''.concat(
                          S ? 'w-full min-h-[44px]' : 'px-4 py-2',
                          ' text-sm font-semibold text-white rounded-lg transition-all duration-300 active:scale-95 hover:shadow-xl bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand disabled:opacity-50 disabled:hover:scale-100 shadow-md'
                        ),
                        children: A ? '...' : i('export.export'),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          });
        return (0, c.createPortal)(H, document.body);
      }
      function C(e) {
        let t = [],
          r = [],
          a = e.split('\n').filter((e) => e.trim());
        if (0 === a.length)
          return {
            success: !1,
            data: [],
            errors: ['CSV file is empty'],
            totalRecords: 0,
            dateRange: null,
          };
        let n = 0,
          o = a[0].toLowerCase();
        (o.includes('date') || o.includes('type') || o.includes('value')) && (n = 1);
        let s = 0,
          i = [];
        for (let e = n; e < a.length; e++) {
          let n = a[e].trim();
          if (n)
            try {
              let a = E(n);
              if (a.length < 3) {
                t.push('Line '.concat(e + 1, ': Insufficient columns'));
                continue;
              }
              let o = T(a, ['date', 'time', 'timestamp']),
                l = T(a, ['value', 'count', 'steps']),
                d = T(a, ['type', 'category']),
                c = T(a, ['source', 'sourcename', 'source name']);
              if (-1 === o || -1 === l) {
                t.push('Line '.concat(e + 1, ': Missing required columns (date or value)'));
                continue;
              }
              let u = a[o].trim(),
                g = a[l].trim(),
                m = d >= 0 ? a[d].trim().toLowerCase() : '';
              if (d >= 0 && !m.includes('step') && !m.includes('count')) continue;
              let y = L(u);
              if (!y) {
                t.push('Line '.concat(e + 1, ': Invalid date format: ').concat(u));
                continue;
              }
              let x = parseFloat(g);
              if (isNaN(x) || x < 0) {
                t.push('Line '.concat(e + 1, ': Invalid step count: ').concat(g));
                continue;
              }
              let h = c >= 0 ? a[c].trim() : void 0,
                p = y.toISOString().split('T')[0],
                b = r.findIndex((e) => e.date === p);
              (b >= 0
                ? (r[b].steps += x)
                : (r.push({ date: p, steps: Math.round(x), sourceName: h }), i.push(p)),
                s++);
            } catch (r) {
              t.push(
                'Line '.concat(e + 1, ': ').concat(r instanceof Error ? r.message : 'Parse error')
              );
            }
        }
        r.sort((e, t) => e.date.localeCompare(t.date));
        let l = i.length > 0 ? { start: i[0], end: i[i.length - 1] } : null;
        return {
          success: r.length > 0,
          data: r,
          errors: t.slice(0, 10),
          totalRecords: s,
          dateRange: l,
        };
      }
      async function D(e, t) {
        let r = [],
          a = new Map(),
          n = e.split('\n').filter((e) => e.trim()),
          o = n.length;
        if (0 === o)
          return {
            success: !1,
            data: [],
            errors: ['CSV file is empty'],
            totalRecords: 0,
            dateRange: null,
          };
        let s = 0,
          i = n[0].toLowerCase();
        (i.includes('date') || i.includes('type') || i.includes('value')) && (s = 1);
        let l = 0,
          d = [];
        for (let e = s; e < n.length; e += 1e3) {
          let s = Math.min(e + 1e3, n.length);
          for (let t = e; t < s; t++) {
            let e = n[t].trim();
            if (e)
              try {
                let n = E(e);
                if (n.length < 3) {
                  r.push('Line '.concat(t + 1, ': Insufficient columns'));
                  continue;
                }
                let o = T(n, ['date', 'time', 'timestamp']),
                  s = T(n, ['value', 'count', 'steps']),
                  i = T(n, ['type', 'category']),
                  c = T(n, ['source', 'sourcename', 'source name']);
                if (-1 === o || -1 === s) continue;
                let u = n[o].trim(),
                  g = n[s].trim(),
                  m = i >= 0 ? n[i].trim().toLowerCase() : '';
                if (i >= 0 && !m.includes('step') && !m.includes('count')) continue;
                let y = L(u);
                if (!y) continue;
                let x = parseFloat(g);
                if (isNaN(x) || x < 0) continue;
                let h = c >= 0 ? n[c].trim() : void 0,
                  p = y.toISOString().split('T')[0],
                  b = a.get(p);
                (b
                  ? (b.steps += Math.round(x))
                  : (a.set(p, { steps: Math.round(x), sourceName: h }), d.push(p)),
                  l++);
              } catch (e) {
                r.push(
                  'Line '.concat(t + 1, ': ').concat(e instanceof Error ? e.message : 'Parse error')
                );
              }
          }
          (t && t({ processed: l, total: o, percentage: Math.round((l / o) * 100) }),
            await new Promise((e) => setTimeout(e, 0)));
        }
        let c = Array.from(a.entries())
            .map((e) => {
              let [t, r] = e;
              return { date: t, steps: r.steps, sourceName: r.sourceName };
            })
            .sort((e, t) => e.date.localeCompare(t.date)),
          u = d.length > 0 ? { start: d[0], end: d[d.length - 1] } : null;
        return {
          success: c.length > 0,
          data: c,
          errors: r.slice(0, 20),
          totalRecords: l,
          dateRange: u,
        };
      }
      function E(e) {
        let t = [],
          r = '',
          a = !1;
        for (let n = 0; n < e.length; n++) {
          let o = e[n];
          '"' === o ? (a = !a) : ',' !== o || a ? (r += o) : (t.push(r), (r = ''));
        }
        return (t.push(r), t);
      }
      function T(e, t) {
        for (let r = 0; r < e.length; r++) {
          let a = e[r].toLowerCase().trim();
          if (t.some((e) => a.includes(e))) return r;
        }
        return -1;
      }
      function L(e) {
        if (!e) return null;
        let t = new Date(e);
        if (!isNaN(t.getTime())) return t;
        for (let r of [
          /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/,
          /(\d{4})-(\d{2})-(\d{2})/,
          /(\d{2})\/(\d{2})\/(\d{4})/,
        ]) {
          let a = e.match(r);
          if (
            a &&
            (/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/ === r
              ? (t = new Date(
                  ''
                    .concat(a[1], '-')
                    .concat(a[2], '-')
                    .concat(a[3], 'T')
                    .concat(a[4], ':')
                    .concat(a[5], ':')
                    .concat(a[6])
                ))
              : /(\d{4})-(\d{2})-(\d{2})/ === r
                ? (t = new Date(''.concat(a[1], '-').concat(a[2], '-').concat(a[3])))
                : /(\d{2})\/(\d{2})\/(\d{4})/ === r &&
                  (t = new Date(''.concat(a[3], '-').concat(a[1], '-').concat(a[2]))),
            !isNaN(t.getTime()))
          )
            return t;
        }
        return null;
      }
      async function z(e, t) {
        let r = [],
          a = new Map();
        try {
          let n;
          if (
            !(n = e instanceof ArrayBuffer ? new TextDecoder('utf-8').decode(e) : e) ||
            0 === n.trim().length
          )
            return {
              success: !1,
              data: [],
              errors: ['XML file is empty or contains no data.'],
              totalRecords: 0,
              dateRange: null,
            };
          let o = new Blob([n]).size / 1048576;
          o > 500 &&
            r.push('Large file detected ('.concat(Math.round(o), 'MB). Processing may take time.'));
          let s = new DOMParser().parseFromString(n, 'text/xml'),
            i = s.querySelector('parsererror');
          if (i) {
            let e = i.textContent || 'Unknown parsing error';
            if (e.includes('Document is empty') || n.trim().length < 100)
              return {
                success: !1,
                data: [],
                errors: [
                  'XML file appears to be empty or invalid. Please ensure you exported the correct file from Apple Health.',
                ],
                totalRecords: 0,
                dateRange: null,
              };
            return {
              success: !1,
              data: [],
              errors: ['XML parsing error: ' + e],
              totalRecords: 0,
              dateRange: null,
            };
          }
          if (!s.querySelector('HealthData'))
            return {
              success: !1,
              data: [],
              errors: [
                'Invalid Apple Health XML format. The file does not contain HealthData element.',
              ],
              totalRecords: 0,
              dateRange: null,
            };
          let l = s.querySelectorAll('Record[type="HKQuantityTypeIdentifierStepCount"]'),
            d = l.length,
            c = 0;
          (t && d > 0 && t({ processed: 0, total: d, percentage: 0 }),
            await new Promise((e) => {
              let n = (o) => {
                let s = 0;
                for (; s < l.length && (!o || o.timeRemaining() > 0); ) {
                  let e = l[s];
                  try {
                    let t = e.querySelector('value'),
                      r = e.querySelector('startDate'),
                      n = e.querySelector('sourceName');
                    if (t && r) {
                      var i;
                      let e = parseFloat(t.textContent || '0'),
                        o = r.textContent || '',
                        s =
                          null == n
                            ? void 0
                            : null === (i = n.textContent) || void 0 === i
                              ? void 0
                              : i.trim();
                      if (!isNaN(e) && e >= 0) {
                        let t = (function (e) {
                          if (!e) return null;
                          let t = new Date(e);
                          if (!isNaN(t.getTime())) return t;
                          let r = e.match(
                            /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})(\s+[+-]\d{4})?/
                          );
                          return r &&
                            !isNaN(
                              (t = new Date(
                                ''
                                  .concat(r[1], '-')
                                  .concat(r[2], '-')
                                  .concat(r[3], 'T')
                                  .concat(r[4], ':')
                                  .concat(r[5], ':')
                                  .concat(r[6])
                                  .concat(r[7] || '+0000')
                              )).getTime()
                            )
                            ? t
                            : null;
                        })(o);
                        if (t) {
                          let r = t.toISOString().split('T')[0],
                            n = a.get(r);
                          n
                            ? (n.steps += Math.round(e))
                            : a.set(r, { steps: Math.round(e), sourceName: s });
                        }
                      }
                    }
                  } catch (e) {
                    r.push(
                      'Record '
                        .concat(s + 1, ': ')
                        .concat(e instanceof Error ? e.message : 'Unknown error')
                    );
                  }
                  (c++,
                    s++,
                    t &&
                      (c % 100 == 0 || c === d) &&
                      t({ processed: c, total: d, percentage: Math.round((c / d) * 100) }));
                }
                s < l.length
                  ? 'undefined' != typeof requestIdleCallback
                    ? requestIdleCallback(n)
                    : setTimeout(() => n(), 0)
                  : e();
              };
              'undefined' != typeof requestIdleCallback ? requestIdleCallback(n) : n();
            }));
          let u = Array.from(a.entries())
              .map((e) => {
                let [t, r] = e;
                return { date: t, steps: r.steps, sourceName: r.sourceName };
              })
              .sort((e, t) => e.date.localeCompare(t.date)),
            g = u.map((e) => e.date),
            m = g.length > 0 ? { start: g[0], end: g[g.length - 1] } : null;
          return {
            success: u.length > 0,
            data: u,
            errors: r.slice(0, 20),
            totalRecords: c,
            dateRange: m,
          };
        } catch (e) {
          return {
            success: !1,
            data: [],
            errors: [
              'XML parsing failed: '.concat(e instanceof Error ? e.message : 'Unknown error'),
            ],
            totalRecords: 0,
            dateRange: null,
          };
        }
      }
      async function I(e, t) {
        let r = e.size / 1048576;
        if (e.size > 2097152e3)
          return {
            success: !1,
            data: [],
            errors: [
              'File too large ('.concat(Math.round(r), 'MB). Maximum size is ').concat(2e3, 'MB.'),
            ],
            totalRecords: 0,
            dateRange: null,
          };
        let a = e.name.toLowerCase(),
          n = a.endsWith('.xml') || a.endsWith('.xml.gz');
        try {
          if ((r > 500 && (null == t || t({ processed: 0, total: 0, percentage: 0 })), r > 1e3)) {
            let r = await e.arrayBuffer(),
              a = new TextDecoder('utf-8'),
              o = '',
              s = 0;
            for (let e = 0; e < r.byteLength; e += 104857600) {
              let n = r.slice(e, Math.min(e + 104857600, r.byteLength)),
                i = a.decode(n, { stream: e + 104857600 < r.byteLength });
              if (((o += i), (s += n.byteLength), t)) {
                let e = Math.round((s / r.byteLength) * 100);
                t({
                  processed: Math.round(s / 1024),
                  total: Math.round(r.byteLength / 1024),
                  percentage: e,
                });
              }
              await new Promise((e) => setTimeout(e, 0));
            }
            if (n) return await z(o, t);
            return C(o);
          }
          let a = await new Promise((a, n) => {
            let o = new FileReader(),
              s = null;
            ((o.onload = (e) => {
              s && clearTimeout(s);
              try {
                var t;
                if (null === (t = e.target) || void 0 === t ? void 0 : t.result) {
                  if (e.target.result instanceof ArrayBuffer) {
                    if (0 === e.target.result.byteLength) {
                      n(Error('File is empty'));
                      return;
                    }
                    a(e.target.result);
                  } else {
                    let t = e.target.result;
                    if (!t || 0 === t.trim().length) {
                      n(Error('File is empty'));
                      return;
                    }
                    a(t);
                  }
                } else n(Error('Failed to read file content'));
              } catch (t) {
                let e = t instanceof Error ? t.message : 'Unknown error';
                e.includes('length') || e.includes('Invalid string')
                  ? n(
                      Error(
                        'File is too large to process as text ('.concat(
                          Math.round(r),
                          'MB). Please try exporting a smaller date range from Apple Health.'
                        )
                      )
                    )
                  : n(Error('Failed to decode file: '.concat(e)));
              }
            }),
              (o.onerror = () => {
                (s && clearTimeout(s),
                  n(
                    Error(
                      'File reading error. The file may be corrupted or too large for your browser.'
                    )
                  ));
              }),
              (o.onprogress = (e) => {
                if (e.lengthComputable && r > 100) {
                  let r = Math.round((e.loaded / e.total) * 100);
                  null == t ||
                    t({
                      processed: Math.round(e.loaded / 1024),
                      total: Math.round(e.total / 1024),
                      percentage: r,
                    });
                }
              }),
              r > 500 &&
                (s = setTimeout(() => {
                  (o.abort(),
                    n(
                      Error(
                        'File reading timeout. The file ('.concat(
                          Math.round(r),
                          'MB) is too large to process. Please try splitting it or using a smaller date range.'
                        )
                      )
                    ));
                }, 3e5)),
              r > 50 ? o.readAsArrayBuffer(e) : o.readAsText(e, 'UTF-8'));
          });
          if (n) return await z(a, t);
          {
            let e;
            try {
              if (a instanceof ArrayBuffer) {
                if (r > 50) {
                  let t = new TextDecoder('utf-8'),
                    r = [];
                  for (let e = 0; e < a.byteLength; e += 52428800) {
                    let n = a.slice(e, Math.min(e + 52428800, a.byteLength)),
                      o = t.decode(n, { stream: e + 52428800 < a.byteLength });
                    (r.push(o), await new Promise((e) => setTimeout(e, 0)));
                  }
                  e = r.join('');
                } else e = new TextDecoder('utf-8').decode(a);
              } else e = a;
              if (!e || 0 === e.trim().length)
                return {
                  success: !1,
                  data: [],
                  errors: ['CSV file is empty or contains no data.'],
                  totalRecords: 0,
                  dateRange: null,
                };
              if (r > 100) return await D(e, t);
              return C(e);
            } catch (t) {
              let e = t instanceof Error ? t.message : 'Unknown error';
              if (
                e.includes('length') ||
                e.includes('Invalid string') ||
                e.includes('Maximum call stack')
              )
                return {
                  success: !1,
                  data: [],
                  errors: [
                    'CSV file is too large to process ('.concat(
                      Math.round(r),
                      'MB). Please try exporting a smaller date range from Apple Health, or use XML format instead.'
                    ),
                  ],
                  totalRecords: 0,
                  dateRange: null,
                };
              return {
                success: !1,
                data: [],
                errors: ['Failed to read CSV file: '.concat(e)],
                totalRecords: 0,
                dateRange: null,
              };
            }
          }
        } catch (t) {
          let e = t instanceof Error ? t.message : 'Unknown error';
          if (e.includes('memory') || e.includes('quota'))
            return {
              success: !1,
              data: [],
              errors: [
                'File is too large for your browser to process ('.concat(
                  Math.round(r),
                  'MB). Try using a smaller date range or split the file.'
                ),
              ],
              totalRecords: 0,
              dateRange: null,
            };
          return {
            success: !1,
            data: [],
            errors: ['Failed to read file: '.concat(e)],
            totalRecords: 0,
            dateRange: null,
          };
        }
      }
      var R = r(60923);
      function A() {
        var e, t;
        let { t: r, lang: o } = (0, l.Q)(),
          { showToast: s } = (0, y.P)(),
          { activities: i, addActivity: d, deleteActivity: c } = (0, m.G$)(),
          x = (0, u.YG)(),
          h = (0, k.d)(),
          p = (0, n.useRef)(null),
          [b, f] = (0, n.useState)(!1),
          [v, j] = (0, n.useState)(null),
          [N, S] = (0, n.useState)(null),
          [C, D] = (0, n.useState)(!1),
          E = x.find((e) => 'WALKING' === e.key) || g.u6.WALKING,
          T = async (e) => {
            var t;
            let a = null === (t = e.target.files) || void 0 === t ? void 0 : t[0];
            if (!a) return;
            let n = a.name.toLowerCase();
            if (
              !(
                n.endsWith('.csv') ||
                n.endsWith('.xml') ||
                n.endsWith('.xml.gz') ||
                'text/csv' === a.type ||
                'application/csv' === a.type ||
                'text/xml' === a.type ||
                'application/xml' === a.type ||
                'application/gzip' === a.type ||
                '' === a.type
              )
            ) {
              (s(
                'Invalid file type: '.concat(a.name, '. Please select a CSV or XML file.'),
                'error'
              ),
                p.current && (p.current.value = ''));
              return;
            }
            let o = a.size / 1048576;
            if (
              o > 100 &&
              !window.confirm(r('appleHealth.largeFileWarning', { size: Math.round(o).toString() }))
            ) {
              p.current && (p.current.value = '');
              return;
            }
            (f(!0), j({ processed: 0, total: 0, percentage: 0 }));
            try {
              let e = await I(a, (e) => {
                j(e);
              });
              if ((j(null), !e.success || 0 === e.data.length)) {
                let t =
                  e.errors.length > 0
                    ? e.errors.slice(0, 3).join(', ')
                    : 'No step data found in file';
                (s(
                  r('appleHealth.parseFailed', { errors: t }) || 'Failed to parse file: '.concat(t),
                  'error'
                ),
                  f(!1),
                  p.current && (p.current.value = ''));
                return;
              }
              (S({
                data: e.data,
                totalRecords: e.totalRecords,
                dateRange: e.dateRange,
                errors: e.errors,
              }),
                D(!0),
                f(!1));
            } catch (e) {
              (console.error('Failed to parse Apple Health file:', e),
                j(null),
                s(
                  r('appleHealth.parseFailed', {
                    errors: e instanceof Error ? e.message : 'Unknown error',
                  }),
                  'error'
                ),
                f(!1),
                p.current && (p.current.value = ''));
            }
          };
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsxs)('label', {
              className: 'px-2 py-1 '.concat(
                h ? 'min-h-[36px] min-w-[80px]' : '',
                ' text-[10px] sm:text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 cursor-pointer touch-feedback mobile-press flex items-center justify-center'
              ),
              children: [
                (0, a.jsx)('input', {
                  ref: p,
                  type: 'file',
                  accept:
                    '.csv,.xml,.xml.gz,text/csv,application/csv,application/xml,text/xml,application/gzip',
                  onChange: T,
                  disabled: b,
                  className: 'hidden',
                  'aria-label': r('appleHealth.importLabel'),
                }),
                (0, a.jsxs)('span', {
                  className: 'flex items-center gap-1',
                  children: [
                    b ? '⏳' : '\uD83D\uDCF1',
                    (0, a.jsx)('span', {
                      className: h ? 'text-[9px]' : '',
                      children: r('appleHealth.import'),
                    }),
                  ],
                }),
              ],
            }),
            b &&
              v &&
              v.total > 0 &&
              (0, a.jsxs)('div', {
                className: 'mt-2 space-y-1',
                children: [
                  (0, a.jsx)('div', {
                    className: 'text-xs text-gray-600 dark:text-gray-400',
                    children: r('appleHealth.processing', {
                      processed: String(v.processed),
                      total: String(v.total),
                      percentage: String(v.percentage),
                    }),
                  }),
                  (0, a.jsx)('div', {
                    className: 'w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2',
                    children: (0, a.jsx)('div', {
                      className: 'bg-brand h-2 rounded-full transition-all duration-300',
                      style: { width: ''.concat(v.percentage, '%') },
                    }),
                  }),
                ],
              }),
            (0, a.jsx)(R.Q, {
              open: C && !!N,
              title: r('appleHealth.confirmTitle'),
              message: N
                ? r('appleHealth.confirmMessage', {
                    count: String(N.data.length),
                    start: (null === (e = N.dateRange) || void 0 === e ? void 0 : e.start) || '',
                    end: (null === (t = N.dateRange) || void 0 === t ? void 0 : t.end) || '',
                    existing: String(i.filter((e) => 'WALKING' === e.activityKey).length),
                  })
                : '',
              variant: 'default',
              confirmLabel: r('appleHealth.confirmImport'),
              onConfirm: () => {
                if (N && E)
                  try {
                    let e = i.filter((e) => 'WALKING' === e.activityKey);
                    (e.forEach((e) => {
                      c(e.id);
                    }),
                      N.data.forEach((e) => {
                        let t = new Date(e.date),
                          r = (0, w.b)(t).toISOString();
                        d({
                          definition: E,
                          amount: e.steps,
                          performedAt: r,
                          note: e.sourceName
                            ? 'Apple Health ('.concat(e.sourceName, ')')
                            : 'Apple Health',
                        });
                      }),
                      s(
                        r('appleHealth.importSuccess', {
                          count: String(N.data.length),
                          replaced: String(e.length),
                        }),
                        'success'
                      ),
                      S(null),
                      D(!1),
                      p.current && (p.current.value = ''));
                  } catch (e) {
                    (console.error('Failed to import Apple Health data:', e),
                      s(r('appleHealth.importFailed'), 'error'));
                  }
              },
              onCancel: () => {
                (S(null), D(!1), p.current && (p.current.value = ''));
              },
            }),
          ],
        });
      }
      function F() {
        let { activities: e } = (0, m.G$)(),
          { settings: t } = (0, u.rV)(),
          { t: r } = (0, l.Q)(),
          { showToast: o } = (0, y.P)(),
          i = (0, k.d)(),
          d = (0, n.useRef)(null),
          [c, g] = (0, n.useState)(!1),
          [x, h] = (0, n.useState)(!1),
          p = async (e) => {
            var t;
            let a = null === (t = e.target.files) || void 0 === t ? void 0 : t[0];
            if (a) {
              g(!0);
              try {
                let e = await a.text(),
                  t = JSON.parse(e);
                if (!t.activities || !Array.isArray(t.activities))
                  throw Error('Invalid file format: activities missing');
                if (!t.settings) throw Error('Invalid file format: settings missing');
                let n = t.activities.filter(
                  (e) =>
                    e &&
                    'string' == typeof e.id &&
                    'string' == typeof e.activityKey &&
                    'number' == typeof e.amount &&
                    'number' == typeof e.points &&
                    'string' == typeof e.performedAt
                );
                if (0 === n.length && t.activities.length > 0)
                  throw Error('No valid activities found in file');
                if (
                  !window.confirm(
                    r('data.importConfirm', {
                      activities: String(n.length),
                      settings: t.settings.name || 'Unknown',
                    })
                  )
                ) {
                  (g(!1), d.current && (d.current.value = ''));
                  return;
                }
                (localStorage.setItem(s.I.ACTIVITIES, JSON.stringify(n)),
                  localStorage.setItem(s.I.SETTINGS, JSON.stringify(t.settings)),
                  window.location.reload());
              } catch (e) {
                (console.error('Import failed:', e),
                  o(e instanceof Error ? e.message : r('data.importFailed'), 'error'),
                  g(!1),
                  d.current && (d.current.value = ''));
              }
            }
          };
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsxs)('div', {
              className: 'flex items-center gap-2',
              children: [
                (0, a.jsxs)('button', {
                  type: 'button',
                  onClick: () => h(!0),
                  className:
                    'px-2 py-1 text-[10px] sm:text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 font-semibold',
                  title: r('data.exportTooltip'),
                  'aria-label': r('data.exportTooltip'),
                  children: ['\uD83D\uDCBE ', r('data.export')],
                }),
                (0, a.jsxs)('label', {
                  className:
                    'px-2 py-1 text-[10px] sm:text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 cursor-pointer font-semibold',
                  children: [
                    (0, a.jsx)('input', {
                      ref: d,
                      type: 'file',
                      accept: '.json',
                      onChange: p,
                      disabled: c,
                      className: 'hidden',
                      'aria-label': r('data.importTooltip'),
                    }),
                    c ? '⏳' : '\uD83D\uDCE5',
                    ' ',
                    r('data.import'),
                  ],
                }),
                !i && (0, a.jsx)(A, {}),
              ],
            }),
            (0, a.jsx)(S, { open: x, onClose: () => h(!1) }),
          ],
        });
      }
      var M = r(88270);
      function H() {
        let { t: e, lang: t } = (0, l.Q)(),
          { settings: r } = (0, u.rV)(),
          { showToast: o } = (0, y.P)();
        (0, k.d)();
        let [i, d] = (0, n.useState)(M.dl),
          [c, g] = (0, n.useState)('default'),
          [m, x] = (0, n.useState)(!1);
        (0, n.useEffect)(() => {
          (x('Notification' in window), g(M.BF.getPermission()));
          try {
            let e = localStorage.getItem(s.I.NOTIFICATIONS);
            e && d(JSON.parse(e));
          } catch (e) {
            console.error('Failed to load notification settings:', e);
          }
        }, []);
        let h = (r) => {
            try {
              (localStorage.setItem(s.I.NOTIFICATIONS, JSON.stringify(r)),
                d(r),
                r.enabled && r.dailyReminder
                  ? M.BF.startDailyReminderCheck(r, t, () => {
                      M.BF.showDailyReminder(t);
                    })
                  : M.BF.stopDailyReminderCheck());
            } catch (t) {
              (console.error('Failed to save notification settings:', t),
                o(e('notifications.saveFailed'), 'error'));
            }
          },
          p = async () => {
            let t = await M.BF.requestPermission();
            (g(t),
              'granted' === t
                ? (o(e('notifications.permissionGranted'), 'success'), h({ ...i, enabled: !0 }))
                : o(e('notifications.permissionDenied'), 'error'));
          },
          b = (e, t) => {
            h({ ...i, [e]: t });
          };
        return m
          ? (0, a.jsxs)('div', {
              className: 'space-y-4',
              children: [
                (0, a.jsxs)('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    (0, a.jsxs)('div', {
                      children: [
                        (0, a.jsx)('div', {
                          className: 'font-bold text-sm text-gray-950 dark:text-white',
                          children: e('notifications.title'),
                        }),
                        (0, a.jsx)('div', {
                          className: 'text-xs font-medium text-gray-600 dark:text-gray-400 mt-1',
                          children: e('notifications.subtitle'),
                        }),
                      ],
                    }),
                    (0, a.jsx)('button', {
                      type: 'button',
                      onClick: () => b('enabled', !i.enabled),
                      className:
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 '.concat(
                          i.enabled
                            ? 'bg-gradient-to-r from-brand to-brand-dark shadow-md'
                            : 'bg-gray-300 dark:bg-gray-700'
                        ),
                      children: (0, a.jsx)('span', {
                        className:
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform '.concat(
                            i.enabled ? 'translate-x-6' : 'translate-x-1'
                          ),
                      }),
                    }),
                  ],
                }),
                'granted' !== c &&
                  (0, a.jsx)('button', {
                    type: 'button',
                    onClick: p,
                    className:
                      'w-full px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300',
                    children: e('notifications.requestPermission'),
                  }),
                'granted' === c &&
                  i.enabled &&
                  (0, a.jsxs)('div', {
                    className:
                      'space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/30 to-transparent dark:from-gray-800/30 dark:to-transparent rounded-r-lg py-2',
                    children: [
                      (0, a.jsxs)('div', {
                        className: 'space-y-2',
                        children: [
                          (0, a.jsxs)('div', {
                            className: 'flex items-center justify-between',
                            children: [
                              (0, a.jsx)('label', {
                                className: 'text-sm font-semibold text-gray-800 dark:text-gray-200',
                                children: e('notifications.dailyReminder'),
                              }),
                              (0, a.jsx)('button', {
                                type: 'button',
                                onClick: () => b('dailyReminder', !i.dailyReminder),
                                className:
                                  'relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 '.concat(
                                    i.dailyReminder
                                      ? 'bg-gradient-to-r from-brand to-brand-dark shadow-md'
                                      : 'bg-gray-300 dark:bg-gray-700'
                                  ),
                                children: (0, a.jsx)('span', {
                                  className:
                                    'inline-block h-3 w-3 transform rounded-full bg-white transition-transform '.concat(
                                      i.dailyReminder ? 'translate-x-5' : 'translate-x-1'
                                    ),
                                }),
                              }),
                            ],
                          }),
                          i.dailyReminder &&
                            (0, a.jsx)('input', {
                              type: 'time',
                              value: i.dailyReminderTime,
                              onChange: (e) => b('dailyReminderTime', e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                            }),
                        ],
                      }),
                      (0, a.jsxs)('div', {
                        className: 'flex items-center justify-between',
                        children: [
                          (0, a.jsx)('label', {
                            className: 'text-sm font-semibold text-gray-800 dark:text-gray-200',
                            children: e('notifications.goalCompletion'),
                          }),
                          (0, a.jsx)('button', {
                            type: 'button',
                            onClick: () => b('goalCompletion', !i.goalCompletion),
                            className:
                              'relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 '.concat(
                                i.goalCompletion
                                  ? 'bg-gradient-to-r from-brand to-brand-dark shadow-md'
                                  : 'bg-gray-300 dark:bg-gray-700'
                              ),
                            children: (0, a.jsx)('span', {
                              className:
                                'inline-block h-3 w-3 transform rounded-full bg-white transition-transform '.concat(
                                  i.goalCompletion ? 'translate-x-5' : 'translate-x-1'
                                ),
                            }),
                          }),
                        ],
                      }),
                      (0, a.jsxs)('div', {
                        className: 'space-y-2',
                        children: [
                          (0, a.jsxs)('div', {
                            className: 'flex items-center justify-between',
                            children: [
                              (0, a.jsx)('label', {
                                className: 'text-sm font-semibold text-gray-800 dark:text-gray-200',
                                children: e('notifications.streakReminder'),
                              }),
                              (0, a.jsx)('button', {
                                type: 'button',
                                onClick: () => b('streakReminder', !i.streakReminder),
                                className:
                                  'relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 '.concat(
                                    i.streakReminder
                                      ? 'bg-gradient-to-r from-brand to-brand-dark shadow-md'
                                      : 'bg-gray-300 dark:bg-gray-700'
                                  ),
                                children: (0, a.jsx)('span', {
                                  className:
                                    'inline-block h-3 w-3 transform rounded-full bg-white transition-transform '.concat(
                                      i.streakReminder ? 'translate-x-5' : 'translate-x-1'
                                    ),
                                }),
                              }),
                            ],
                          }),
                          i.streakReminder &&
                            (0, a.jsx)('input', {
                              type: 'time',
                              value: i.streakReminderTime,
                              onChange: (e) => b('streakReminderTime', e.target.value),
                              className:
                                'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced',
                            }),
                        ],
                      }),
                    ],
                  }),
              ],
            })
          : (0, a.jsx)('div', {
              className: 'text-sm font-medium text-gray-600 dark:text-gray-400',
              children: e('notifications.notSupported'),
            });
      }
      var B = r(76376),
        G = r(16239);
      function P() {
        let { levelInfo: e, hydrated: t } = (0, B.l)(),
          { t: r, lang: n } = (0, l.Q)();
        if (!t) return null;
        let o = (0, G.yF)(e.level, n),
          s = e.xpForNextLevel - e.xpForCurrentLevel,
          i = s - e.currentXP;
        return (0, a.jsxs)('div', {
          className: 'space-y-2',
          children: [
            (0, a.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                (0, a.jsx)('span', {
                  className: 'text-xs font-medium text-gray-600 dark:text-gray-300',
                  children: r('level.level'),
                }),
                (0, a.jsxs)('span', {
                  className: 'text-xs font-semibold text-brand',
                  children: [r('level.level'), ' ', e.level, ' \xb7 ', o],
                }),
              ],
            }),
            (0, a.jsxs)('div', {
              className: 'space-y-1',
              children: [
                (0, a.jsxs)('div', {
                  className:
                    'flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400',
                  children: [
                    (0, a.jsxs)('span', {
                      children: [
                        e.currentXP.toLocaleString(),
                        ' / ',
                        s.toLocaleString(),
                        ' ',
                        r('level.xp'),
                      ],
                    }),
                    (0, a.jsxs)('span', { children: [Math.round(100 * e.progress), '%'] }),
                  ],
                }),
                (0, a.jsx)('div', {
                  className: 'w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden',
                  children: (0, a.jsx)('div', {
                    className: 'h-full bg-brand transition-all duration-500 ease-out',
                    style: { width: ''.concat(100 * e.progress, '%') },
                  }),
                }),
                (0, a.jsx)('div', {
                  className: 'text-[10px] text-gray-500 dark:text-gray-400',
                  children:
                    i > 0
                      ? (0, a.jsxs)('span', {
                          children: [
                            i.toLocaleString(),
                            ' ',
                            r('level.xpNeeded'),
                            ' ',
                            r('level.nextLevel'),
                          ],
                        })
                      : (0, a.jsxs)('span', { children: [r('level.level'), ' ', e.level] }),
                }),
              ],
            }),
          ],
        });
      }
      function O() {
        let { t: e, lang: t } = (0, l.Q)(),
          r = (0, k.d)(),
          [o, s] = (0, n.useState)(!1);
        return (0, a.jsxs)('div', {
          className:
            'rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-4 space-y-3',
          children: [
            (0, a.jsxs)('button', {
              type: 'button',
              onClick: () => s(!o),
              className: 'w-full flex items-center justify-between gap-2 text-left',
              'aria-expanded': o,
              children: [
                (0, a.jsxs)('div', {
                  className: 'flex items-center gap-2',
                  children: [
                    (0, a.jsx)('span', { className: 'text-xl', children: '\uD83D\uDCF1' }),
                    (0, a.jsx)('span', {
                      className: ''.concat(
                        r ? 'text-sm' : 'text-base',
                        ' font-semibold text-gray-900 dark:text-white'
                      ),
                      children: e('appleHealth.guideTitle'),
                    }),
                  ],
                }),
                (0, a.jsx)('span', {
                  className:
                    'text-gray-500 dark:text-gray-400 transition-transform duration-200 '.concat(
                      o ? 'rotate-180' : ''
                    ),
                  children: '▼',
                }),
              ],
            }),
            o &&
              (0, a.jsxs)('div', {
                className:
                  'space-y-3 pt-2 border-t border-blue-200 dark:border-blue-800 animate-fade-in',
                children: [
                  (0, a.jsxs)('div', {
                    className: 'space-y-2',
                    children: [
                      (0, a.jsx)('h4', {
                        className: ''.concat(
                          r ? 'text-xs' : 'text-sm',
                          ' font-semibold text-gray-900 dark:text-white'
                        ),
                        children: e('appleHealth.step1'),
                      }),
                      (0, a.jsxs)('ol', {
                        className: ''.concat(
                          r ? 'text-xs' : 'text-sm',
                          ' text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside ml-2'
                        ),
                        children: [
                          (0, a.jsx)('li', { children: e('appleHealth.step1a') }),
                          (0, a.jsx)('li', { children: e('appleHealth.step1b') }),
                          (0, a.jsx)('li', { children: e('appleHealth.step1c') }),
                        ],
                      }),
                    ],
                  }),
                  (0, a.jsxs)('div', {
                    className: 'space-y-2',
                    children: [
                      (0, a.jsx)('h4', {
                        className: ''.concat(
                          r ? 'text-xs' : 'text-sm',
                          ' font-semibold text-gray-900 dark:text-white'
                        ),
                        children: e('appleHealth.step2'),
                      }),
                      (0, a.jsx)('p', {
                        className: ''.concat(
                          r ? 'text-xs' : 'text-sm',
                          ' text-gray-700 dark:text-gray-300'
                        ),
                        children: e('appleHealth.step2a'),
                      }),
                      (0, a.jsx)('div', {
                        className:
                          'bg-white dark:bg-gray-800 rounded p-3 text-xs font-mono text-gray-800 dark:text-gray-200',
                        children: e('appleHealth.step2b'),
                      }),
                    ],
                  }),
                  (0, a.jsxs)('div', {
                    className: 'space-y-2',
                    children: [
                      (0, a.jsx)('h4', {
                        className: ''.concat(
                          r ? 'text-xs' : 'text-sm',
                          ' font-semibold text-gray-900 dark:text-white'
                        ),
                        children: e('appleHealth.step3'),
                      }),
                      (0, a.jsx)('p', {
                        className: ''.concat(
                          r ? 'text-xs' : 'text-sm',
                          ' text-gray-700 dark:text-gray-300'
                        ),
                        children: e('appleHealth.step3a'),
                      }),
                    ],
                  }),
                  (0, a.jsx)('div', {
                    className:
                      'rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3 border border-blue-200 dark:border-blue-800',
                    children: (0, a.jsxs)('p', {
                      className: ''.concat(
                        r ? 'text-xs' : 'text-sm',
                        ' text-blue-900 dark:text-blue-200 font-medium'
                      ),
                      children: ['⚠️ ', e('appleHealth.note')],
                    }),
                  }),
                ],
              }),
          ],
        });
      }
      var U = r(76564),
        W = r(6863);
      function K(e) {
        let { open: t, onClose: r, initialMode: o = 'login' } = e,
          [s, i] = (0, n.useState)(o),
          [d, u] = (0, n.useState)(''),
          [g, m] = (0, n.useState)(''),
          [x, h] = (0, n.useState)(''),
          [p, b] = (0, n.useState)(!1),
          [f, v] = (0, n.useState)(!1),
          { login: w, register: j, loginWithGoogle: N, resetPasswordEmail: S } = (0, U.a)(),
          { t: C, lang: D } = (0, l.Q)(),
          E = (0, k.d)(),
          { showToast: T } = (0, y.P)();
        if (
          ((0, n.useEffect)(() => {
            v(!0);
          }, []),
          (0, n.useEffect)(() => {
            t && i(o);
          }, [t, o]),
          !t || !f)
        )
          return null;
        let L = async (e) => {
            (e.preventDefault(), b(!0));
            try {
              'login' === s
                ? (await w(d, g),
                  T('tr' === D ? 'Giriş başarılı!' : 'Login successful!', 'success'),
                  r())
                : 'signup' === s
                  ? (await j(d, g, x || void 0),
                    T('tr' === D ? 'Kayıt başarılı!' : 'Registration successful!', 'success'),
                    r())
                  : 'reset' === s &&
                    (await S(d),
                    T(
                      'tr' === D
                        ? 'Şifre sıfırlama e-postası g\xf6nderildi'
                        : 'Password reset email sent',
                      'success'
                    ),
                    i('login'));
            } catch (e) {
              T(
                e instanceof Error
                  ? e.message
                  : 'tr' === D
                    ? 'Bir hata oluştu'
                    : 'An error occurred',
                'error'
              );
            } finally {
              b(!1);
            }
          },
          z = async () => {
            b(!0);
            try {
              (await N(), T('tr' === D ? 'Giriş başarılı!' : 'Login successful!', 'success'), r());
            } catch (e) {
              T(
                e instanceof Error
                  ? e.message.includes('GOOGLE_SIGNIN_NOT_ENABLED') ||
                    e.message.includes('CONFIGURATION_NOT_FOUND') ||
                    e.message.includes('not enabled')
                    ? 'tr' === D
                      ? '❌ Google Sign-In etkinleştirilmemiş!\n\nFirebase Console → Authentication → Sign-in method → Google → Enable → Save'
                      : '❌ Google Sign-In not enabled!\n\nFirebase Console → Authentication → Sign-in method → Google → Enable → Save'
                    : e.message.includes('Popup closed')
                      ? 'tr' === D
                        ? 'Giriş penceresi kapatıldı'
                        : 'Sign-in popup was closed'
                      : e.message.includes('Popup blocked')
                        ? 'tr' === D
                          ? 'Giriş penceresi tarayıcı tarafından engellendi. L\xfctfen popup engelleyiciyi kapatın.'
                          : 'Sign-in popup was blocked by browser. Please disable popup blocker.'
                        : e.message
                  : 'tr' === D
                    ? 'Google ile giriş başarısız'
                    : 'Google login failed',
                'error'
              );
            } finally {
              b(!1);
            }
          },
          I = (0, a.jsx)('div', {
            className:
              'fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-4 overflow-y-auto',
            onClick: r,
            children: (0, a.jsxs)('div', {
              className: ''.concat(
                E ? 'w-full' : 'w-full max-w-md',
                ' bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-6 my-auto'
              ),
              onClick: (e) => e.stopPropagation(),
              children: [
                (0, a.jsxs)('div', {
                  className: 'flex items-center justify-between mb-6',
                  children: [
                    (0, a.jsx)('h2', {
                      className: ''.concat(
                        E ? 'text-xl' : 'text-2xl',
                        ' font-bold text-gray-950 dark:text-white'
                      ),
                      children:
                        'login' === s
                          ? 'tr' === D
                            ? 'Giriş Yap'
                            : 'Sign In'
                          : 'signup' === s
                            ? 'tr' === D
                              ? 'Kayıt Ol'
                              : 'Sign Up'
                            : 'tr' === D
                              ? 'Şifre Sıfırla'
                              : 'Reset Password',
                    }),
                    (0, a.jsx)('button', {
                      onClick: r,
                      className:
                        'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl',
                      'aria-label': 'tr' === D ? 'Kapat' : 'Close',
                      children: '\xd7',
                    }),
                  ],
                }),
                (0, a.jsxs)('form', {
                  onSubmit: L,
                  className: 'space-y-4',
                  children: [
                    'signup' === s &&
                      (0, a.jsxs)('div', {
                        children: [
                          (0, a.jsx)('label', {
                            className:
                              'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1',
                            children: 'tr' === D ? 'İsim' : 'Name',
                          }),
                          (0, a.jsx)('input', {
                            type: 'text',
                            value: x,
                            onChange: (e) => h(e.target.value),
                            className:
                              'w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-950 dark:text-white focus:border-brand dark:focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                            placeholder: 'tr' === D ? 'İsim (opsiyonel)' : 'Name (optional)',
                          }),
                        ],
                      }),
                    (0, a.jsxs)('div', {
                      children: [
                        (0, a.jsx)('label', {
                          className:
                            'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1',
                          children: 'tr' === D ? 'E-posta' : 'Email',
                        }),
                        (0, a.jsx)('input', {
                          type: 'email',
                          value: d,
                          onChange: (e) => u(e.target.value),
                          required: !0,
                          className:
                            'w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-950 dark:text-white focus:border-brand dark:focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                          placeholder: 'tr' === D ? 'ornek@email.com' : 'example@email.com',
                        }),
                      ],
                    }),
                    'reset' !== s &&
                      (0, a.jsxs)('div', {
                        children: [
                          (0, a.jsx)('label', {
                            className:
                              'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1',
                            children: 'tr' === D ? 'Şifre' : 'Password',
                          }),
                          (0, a.jsx)('input', {
                            type: 'password',
                            value: g,
                            onChange: (e) => m(e.target.value),
                            required: !0,
                            minLength: 6,
                            className:
                              'w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-950 dark:text-white focus:border-brand dark:focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                            placeholder:
                              'tr' === D ? 'Şifre (min. 6 karakter)' : 'Password (min. 6 chars)',
                          }),
                        ],
                      }),
                    (0, a.jsx)('button', {
                      type: 'submit',
                      disabled: p,
                      className:
                        'w-full py-2.5 px-4 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg font-semibold hover:from-brand-dark hover:to-brand transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed '.concat(
                          E ? 'touch-feedback mobile-press' : ''
                        ),
                      children: p
                        ? '...'
                        : 'login' === s
                          ? 'tr' === D
                            ? 'Giriş Yap'
                            : 'Sign In'
                          : 'signup' === s
                            ? 'tr' === D
                              ? 'Kayıt Ol'
                              : 'Sign Up'
                            : 'tr' === D
                              ? 'G\xf6nder'
                              : 'Send',
                    }),
                  ],
                }),
                'login' === s &&
                  (0, a.jsxs)(a.Fragment, {
                    children: [
                      (0, a.jsxs)('div', {
                        className: 'my-4 flex items-center gap-2',
                        children: [
                          (0, a.jsx)('div', {
                            className: 'flex-1 h-px bg-gray-200 dark:bg-gray-700',
                          }),
                          (0, a.jsx)('span', {
                            className: 'text-xs text-gray-500 dark:text-gray-400',
                            children: 'tr' === D ? 'veya' : 'or',
                          }),
                          (0, a.jsx)('div', {
                            className: 'flex-1 h-px bg-gray-200 dark:bg-gray-700',
                          }),
                        ],
                      }),
                      (0, a.jsxs)('button', {
                        onClick: z,
                        disabled: p,
                        className:
                          'w-full py-2.5 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2',
                        children: [
                          (0, a.jsx)('span', { children: '\uD83D\uDD35' }),
                          'tr' === D ? 'Google ile Giriş' : 'Sign in with Google',
                        ],
                      }),
                    ],
                  }),
                (0, a.jsx)('div', {
                  className: 'mt-4 text-center',
                  children:
                    'login' === s
                      ? (0, a.jsxs)(a.Fragment, {
                          children: [
                            (0, a.jsx)('button', {
                              onClick: () => i('reset'),
                              className:
                                'text-sm text-brand hover:text-brand-dark dark:text-brand-light',
                              children: 'tr' === D ? 'Şifremi unuttum' : 'Forgot password?',
                            }),
                            (0, a.jsxs)('div', {
                              className: 'mt-2',
                              children: [
                                (0, a.jsx)('span', {
                                  className: 'text-sm text-gray-600 dark:text-gray-400',
                                  children:
                                    'tr' === D ? 'Hesabın yok mu? ' : "Don't have an account? ",
                                }),
                                (0, a.jsx)('button', {
                                  onClick: () => i('signup'),
                                  className:
                                    'text-sm text-brand hover:text-brand-dark dark:text-brand-light font-semibold',
                                  children: 'tr' === D ? 'Kayıt ol' : 'Sign up',
                                }),
                              ],
                            }),
                          ],
                        })
                      : 'signup' === s
                        ? (0, a.jsxs)('div', {
                            children: [
                              (0, a.jsx)('span', {
                                className: 'text-sm text-gray-600 dark:text-gray-400',
                                children:
                                  'tr' === D
                                    ? 'Zaten hesabın var mı? '
                                    : 'Already have an account? ',
                              }),
                              (0, a.jsx)('button', {
                                onClick: () => i('login'),
                                className:
                                  'text-sm text-brand hover:text-brand-dark dark:text-brand-light font-semibold',
                                children: 'tr' === D ? 'Giriş yap' : 'Sign in',
                              }),
                            ],
                          })
                        : (0, a.jsx)('button', {
                            onClick: () => i('login'),
                            className:
                              'text-sm text-brand hover:text-brand-dark dark:text-brand-light',
                            children: 'tr' === D ? '← Geri d\xf6n' : '← Back',
                          }),
                }),
              ],
            }),
          });
        return (0, c.createPortal)(I, document.body);
      }
      var _ = r(13224),
        Y = r(6013);
      function V(e) {
        let { open: t, onResolve: r, onCancel: o, localCount: s, cloudCount: i } = e,
          { lang: d } = (0, l.Q)(),
          c = (0, k.d)(),
          [u, g] = (0, n.useState)('newest');
        return t
          ? (0, a.jsx)('div', {
              className:
                'fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm',
              onClick: o,
              children: (0, a.jsxs)('div', {
                className: ''.concat(
                  c ? 'w-full mx-4' : 'w-full max-w-md',
                  ' bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-6'
                ),
                onClick: (e) => e.stopPropagation(),
                children: [
                  (0, a.jsx)('h2', {
                    className: ''.concat(
                      c ? 'text-xl' : 'text-2xl',
                      ' font-bold text-gray-950 dark:text-white mb-4'
                    ),
                    children: 'tr' === d ? 'Senkronizasyon \xc7akışması' : 'Sync Conflict',
                  }),
                  (0, a.jsx)('p', {
                    className: 'text-sm text-gray-600 dark:text-gray-400 mb-6',
                    children:
                      'tr' === d
                        ? 'Yerel ve bulut verileriniz arasında farklılıklar var. Nasıl devam etmek istersiniz?'
                        : 'There are differences between your local and cloud data. How would you like to proceed?',
                  }),
                  (0, a.jsxs)('div', {
                    className: 'space-y-4 mb-6',
                    children: [
                      (0, a.jsxs)('div', {
                        className: 'grid grid-cols-2 gap-4 text-xs',
                        children: [
                          (0, a.jsxs)('div', {
                            className: 'bg-gray-50 dark:bg-gray-900 p-3 rounded-lg',
                            children: [
                              (0, a.jsx)('div', {
                                className: 'font-semibold text-gray-700 dark:text-gray-300 mb-1',
                                children: 'tr' === d ? 'Yerel' : 'Local',
                              }),
                              (0, a.jsxs)('div', {
                                className: 'text-gray-600 dark:text-gray-400',
                                children: [
                                  s.activities,
                                  ' ',
                                  'tr' === d ? 'aktivite' : 'activities',
                                ],
                              }),
                              (0, a.jsxs)('div', {
                                className: 'text-gray-600 dark:text-gray-400',
                                children: [s.badges, ' ', 'tr' === d ? 'rozet' : 'badges'],
                              }),
                              (0, a.jsxs)('div', {
                                className: 'text-gray-600 dark:text-gray-400',
                                children: [s.challenges, ' ', 'tr' === d ? 'hedef' : 'challenges'],
                              }),
                            ],
                          }),
                          (0, a.jsxs)('div', {
                            className: 'bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg',
                            children: [
                              (0, a.jsx)('div', {
                                className: 'font-semibold text-blue-700 dark:text-blue-300 mb-1',
                                children: 'tr' === d ? 'Bulut' : 'Cloud',
                              }),
                              (0, a.jsxs)('div', {
                                className: 'text-blue-600 dark:text-blue-400',
                                children: [
                                  i.activities,
                                  ' ',
                                  'tr' === d ? 'aktivite' : 'activities',
                                ],
                              }),
                              (0, a.jsxs)('div', {
                                className: 'text-blue-600 dark:text-blue-400',
                                children: [i.badges, ' ', 'tr' === d ? 'rozet' : 'badges'],
                              }),
                              (0, a.jsxs)('div', {
                                className: 'text-blue-600 dark:text-blue-400',
                                children: [i.challenges, ' ', 'tr' === d ? 'hedef' : 'challenges'],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, a.jsxs)('div', {
                        className: 'space-y-2',
                        children: [
                          (0, a.jsxs)('label', {
                            className:
                              'flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                            children: [
                              (0, a.jsx)('input', {
                                type: 'radio',
                                name: 'strategy',
                                value: 'newest',
                                checked: 'newest' === u,
                                onChange: () => g('newest'),
                                className: 'text-brand',
                              }),
                              (0, a.jsx)('span', {
                                className: 'text-sm text-gray-700 dark:text-gray-300',
                                children: 'tr' === d ? 'En yeni veriyi kullan' : 'Use newest data',
                              }),
                            ],
                          }),
                          (0, a.jsxs)('label', {
                            className:
                              'flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                            children: [
                              (0, a.jsx)('input', {
                                type: 'radio',
                                name: 'strategy',
                                value: 'merge',
                                checked: 'merge' === u,
                                onChange: () => g('merge'),
                                className: 'text-brand',
                              }),
                              (0, a.jsx)('span', {
                                className: 'text-sm text-gray-700 dark:text-gray-300',
                                children: 'tr' === d ? 'Birleştir' : 'Merge',
                              }),
                            ],
                          }),
                          (0, a.jsxs)('label', {
                            className:
                              'flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                            children: [
                              (0, a.jsx)('input', {
                                type: 'radio',
                                name: 'strategy',
                                value: 'local',
                                checked: 'local' === u,
                                onChange: () => g('local'),
                                className: 'text-brand',
                              }),
                              (0, a.jsx)('span', {
                                className: 'text-sm text-gray-700 dark:text-gray-300',
                                children: 'tr' === d ? 'Yerel veriyi kullan' : 'Use local data',
                              }),
                            ],
                          }),
                          (0, a.jsxs)('label', {
                            className:
                              'flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                            children: [
                              (0, a.jsx)('input', {
                                type: 'radio',
                                name: 'strategy',
                                value: 'cloud',
                                checked: 'cloud' === u,
                                onChange: () => g('cloud'),
                                className: 'text-brand',
                              }),
                              (0, a.jsx)('span', {
                                className: 'text-sm text-gray-700 dark:text-gray-300',
                                children: 'tr' === d ? 'Bulut verisini kullan' : 'Use cloud data',
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, a.jsxs)('div', {
                    className: 'flex gap-2',
                    children: [
                      (0, a.jsx)('button', {
                        onClick: o,
                        className:
                          'flex-1 px-4 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold',
                        children: 'tr' === d ? 'İptal' : 'Cancel',
                      }),
                      (0, a.jsx)('button', {
                        onClick: () => r(u),
                        className:
                          'flex-1 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300',
                        children: 'tr' === d ? 'Devam Et' : 'Continue',
                      }),
                    ],
                  }),
                ],
              }),
            })
          : null;
      }
      function Q() {
        let { user: e, isAuthenticated: t, logout: r, isConfigured: o } = (0, U.a)(),
          { syncState: s, syncToCloud: i, syncFromCloud: d } = (0, W.V)(),
          { activities: c } = (0, m.G$)(),
          { settings: g, saveSettings: x } = (0, u.rV)(),
          { badges: h } = (0, _.F)(),
          { challenges: p } = (0, Y.B)(),
          { t: b, lang: f } = (0, l.Q)();
        (0, k.d)();
        let { showToast: v } = (0, y.P)(),
          [w, j] = (0, n.useState)(!1),
          [N, S] = (0, n.useState)(!1),
          [C, D] = (0, n.useState)(!1),
          [E, T] = (0, n.useState)(null);
        if (!o)
          return (0, a.jsx)('div', {
            className: 'text-xs text-gray-500 dark:text-gray-400',
            children: 'tr' === f ? 'Cloud Sync yapılandırılmamış' : 'Cloud Sync not configured',
          });
        let L = async () => {
            if (!t) {
              j(!0);
              return;
            }
            S(!0);
            try {
              (await i({ activities: c, settings: g, badges: h, challenges: p }),
                v('tr' === f ? 'Buluta senkronize edildi!' : 'Synced to cloud!', 'success'));
            } catch (e) {
              v('tr' === f ? 'Senkronizasyon hatası' : 'Sync error', 'error');
            } finally {
              S(!1);
            }
          },
          z = (e, t) =>
            e.activities.length !== t.activities.length ||
            e.badges.length !== t.badges.length ||
            e.challenges.length !== t.challenges.length ||
            JSON.stringify(e.settings) !== JSON.stringify(t.settings),
          I = async (e, t) => {
            (!(function (e, t) {
              let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'newest';
              switch (r) {
                case 'local':
                  return;
                case 'cloud':
                  return (t.activities, t.settings, t.badges, t.challenges);
                case 'merge':
                  return (function (e, t) {
                    let r = new Map(e.activities.map((e) => [e.id, e]));
                    ((t.activities || []).forEach((e) => {
                      r.set(e.id, e);
                    }),
                      Array.from(r.values()),
                      t.settings || e.settings);
                    let a = new Map(e.badges.map((e) => [e.id, e]));
                    ((t.badges || []).forEach((e) => {
                      a.set(e.id, e);
                    }),
                      Array.from(a.values()));
                    let n = new Map(e.challenges.map((e) => [e.id, e]));
                    ((t.challenges || []).forEach((e) => {
                      n.set(e.id, e);
                    }),
                      Array.from(n.values()));
                  })(e, t);
                default:
                  return (function (e, t) {
                    var r;
                    let a = (function () {
                      try {
                        let e = localStorage.getItem('sporttrack_last_sync');
                        if (e) return new Date(e);
                      } catch (e) {
                        console.error('Failed to get local last modified:', e);
                      }
                      return new Date(0);
                    })();
                    ((null === (r = t.metadata) || void 0 === r ? void 0 : r.lastModified) ||
                      new Date(0)) > a &&
                      (t.activities || e.activities,
                      t.settings || e.settings,
                      t.badges || e.badges,
                      t.challenges || e.challenges);
                  })(e, t);
              }
            })({ activities: c, settings: g, badges: h, challenges: p }, e, t),
              (function () {
                try {
                  localStorage.setItem('sporttrack_last_sync', new Date().toISOString());
                } catch (e) {
                  console.error('Failed to save local last modified:', e);
                }
              })(),
              v('tr' === f ? 'Veriler uygulandı!' : 'Data applied!', 'success'));
          },
          R = async (e) => {
            if (E) {
              (D(!1), S(!0));
              try {
                await I(E.cloud, e);
              } catch (e) {
                v(
                  'tr' === f ? '\xc7akışma \xe7\xf6z\xfcm\xfc hatası' : 'Conflict resolution error',
                  'error'
                );
              } finally {
                (S(!1), T(null));
              }
            }
          },
          A = async () => {
            if (!t) {
              j(!0);
              return;
            }
            S(!0);
            try {
              let e = await d();
              if (e) {
                let t = { activities: c, settings: g, badges: h, challenges: p };
                z(t, e)
                  ? (T({ local: t, cloud: e }), D(!0))
                  : (await I(e, 'cloud'),
                    v(
                      'tr' === f ? 'Buluttan senkronize edildi!' : 'Synced from cloud!',
                      'success'
                    ));
              }
            } catch (e) {
              v('tr' === f ? 'Senkronizasyon hatası' : 'Sync error', 'error');
            } finally {
              S(!1);
            }
          },
          F = async () => {
            try {
              var e, t;
              (await r(),
                x({
                  name: '',
                  dailyTarget:
                    null !== (e = null == g ? void 0 : g.dailyTarget) && void 0 !== e ? e : 1e4,
                  customActivities:
                    null !== (t = null == g ? void 0 : g.customActivities) && void 0 !== t ? t : [],
                  mood: null == g ? void 0 : g.mood,
                }),
                v('tr' === f ? '\xc7ıkış yapıldı' : 'Logged out', 'success'));
            } catch (e) {
              v('tr' === f ? '\xc7ıkış hatası' : 'Logout error', 'error');
            }
          };
        return (0, a.jsxs)(a.Fragment, {
          children: [
            (0, a.jsxs)('div', {
              className: 'space-y-3',
              children: [
                (0, a.jsxs)('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    (0, a.jsxs)('div', {
                      children: [
                        (0, a.jsx)('div', {
                          className: 'font-bold text-sm text-gray-950 dark:text-white',
                          children: 'Cloud Sync',
                        }),
                        (0, a.jsx)('div', {
                          className: 'text-xs font-medium text-gray-600 dark:text-gray-400 mt-1',
                          children: t
                            ? (null == e ? void 0 : e.email)
                              ? ''
                                  .concat('tr' === f ? 'Giriş yapıldı: ' : 'Signed in: ')
                                  .concat(e.email)
                              : 'tr' === f
                                ? 'Giriş yapıldı'
                                : 'Signed in'
                            : 'tr' === f
                              ? 'Verilerinizi bulutta saklayın'
                              : 'Store your data in the cloud',
                        }),
                      ],
                    }),
                    (0, a.jsx)('div', {
                      className: 'text-xs px-2 py-1 rounded '.concat(
                        t
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      ),
                      children: t
                        ? 'tr' === f
                          ? 'Bağlı'
                          : 'Connected'
                        : 'tr' === f
                          ? 'Bağlı Değil'
                          : 'Not Connected',
                    }),
                  ],
                }),
                t
                  ? (0, a.jsxs)('div', {
                      className: 'space-y-2',
                      children: [
                        (0, a.jsxs)('div', {
                          className: 'flex gap-2',
                          children: [
                            (0, a.jsx)('button', {
                              type: 'button',
                              onClick: L,
                              disabled: N || 'syncing' === s.status,
                              className:
                                'flex-1 px-3 py-2 text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-50',
                              children:
                                N || 'syncing' === s.status
                                  ? '...'
                                  : 'tr' === f
                                    ? 'Y\xfckle'
                                    : 'Upload',
                            }),
                            (0, a.jsx)('button', {
                              type: 'button',
                              onClick: A,
                              disabled: N || 'syncing' === s.status,
                              className:
                                'flex-1 px-3 py-2 text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-50',
                              children:
                                N || 'syncing' === s.status
                                  ? '...'
                                  : 'tr' === f
                                    ? 'İndir'
                                    : 'Download',
                            }),
                          ],
                        }),
                        (0, a.jsx)('button', {
                          type: 'button',
                          onClick: F,
                          className:
                            'w-full px-3 py-2 text-xs rounded-lg border-2 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-red-900/10 hover:from-red-100 hover:to-red-50 dark:hover:from-red-800/30 transition-all duration-200 text-red-700 dark:text-red-400 font-semibold',
                          children: 'tr' === f ? '\xc7ıkış Yap' : 'Sign Out',
                        }),
                      ],
                    })
                  : (0, a.jsx)('button', {
                      type: 'button',
                      onClick: () => j(!0),
                      className:
                        'w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300',
                      children: 'tr' === f ? 'Giriş Yap / Kayıt Ol' : 'Sign In / Sign Up',
                    }),
                'error' === s.status &&
                  s.error &&
                  (0, a.jsx)('div', {
                    className: 'text-xs text-red-500 dark:text-red-400',
                    children: s.error,
                  }),
              ],
            }),
            w && (0, a.jsx)(K, { open: w, onClose: () => j(!1) }),
            C &&
              E &&
              (0, a.jsx)(V, {
                open: C,
                onResolve: R,
                onCancel: () => {
                  (D(!1), T(null));
                },
                localCount: {
                  activities: E.local.activities.length,
                  badges: E.local.badges.length,
                  challenges: E.local.challenges.length,
                },
                cloudCount: {
                  activities: E.cloud.activities.length,
                  badges: E.cloud.badges.length,
                  challenges: E.cloud.challenges.length,
                },
              }),
          ],
        });
      }
      var q = r(26294);
      function X() {
        var e, t, r;
        let { triggerButton: o } =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          { settings: m, hydrated: y, saveSettings: x } = (0, u.rV)(),
          { t: h, lang: p } = (0, l.Q)(),
          b = (0, k.d)(),
          f = (0, q.a)(),
          { isAuthenticated: v, isConfigured: w, user: j } = (0, U.a)(),
          [N, S] = (0, n.useState)(!1),
          [C, D] = (0, n.useState)(!1),
          [E, T] = (0, n.useState)(
            null !== (e = null == m ? void 0 : m.name) && void 0 !== e ? e : ''
          ),
          [L, z] = (0, n.useState)(
            String(null !== (t = null == m ? void 0 : m.dailyTarget) && void 0 !== t ? t : g.Dy)
          ),
          [I, R] = (0, n.useState)(
            null !== (r = null == m ? void 0 : m.mood) && void 0 !== r ? r : null
          ),
          [M, B] = (0, n.useState)(null),
          G = (0, n.useRef)(!1);
        if (
          ((0, n.useEffect)(() => {
            if (m) {
              var e;
              (T(m.name || ''),
                z(String(m.dailyTarget)),
                R(null !== (e = m.mood) && void 0 !== e ? e : null));
            }
          }, [m]),
          (0, n.useEffect)(() => {
            if (
              v &&
              (null == j ? void 0 : j.displayName) &&
              !G.current &&
              (!(null == m ? void 0 : m.name) || m.name !== j.displayName)
            ) {
              var e, t;
              ((G.current = !0),
                x({
                  name: j.displayName,
                  dailyTarget:
                    null !== (e = null == m ? void 0 : m.dailyTarget) && void 0 !== e ? e : g.Dy,
                  customActivities:
                    null !== (t = null == m ? void 0 : m.customActivities) && void 0 !== t ? t : [],
                  mood: null == m ? void 0 : m.mood,
                }));
            }
            !v &&
              ((G.current = !1),
              (null == m ? void 0 : m.name) &&
                '' !== m.name.trim() &&
                x({
                  name: '',
                  dailyTarget: m.dailyTarget,
                  customActivities: m.customActivities,
                  mood: m.mood,
                }));
          }, [v, null == j ? void 0 : j.displayName]),
          !y)
        )
          return null;
        let W =
            N && !C
              ? (0, a.jsx)('div', {
                  className:
                    'fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-4 overflow-y-auto',
                  onClick: (e) => {
                    e.target === e.currentTarget &&
                      m &&
                      (S(!1), B(null), T(m.name || ''), z(String(m.dailyTarget)));
                  },
                  children: (0, a.jsxs)('div', {
                    className:
                      'relative w-full max-w-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-4 sm:p-6 my-auto max-h-[90vh] overflow-y-auto',
                    children: [
                      (0, a.jsxs)('div', {
                        className: 'mb-4 pb-3 border-b border-gray-200 dark:border-gray-700',
                        children: [
                          (0, a.jsxs)('h2', {
                            className: ''.concat(
                              b ? 'text-base' : 'text-lg',
                              ' font-bold text-gray-950 dark:text-white flex items-center gap-2'
                            ),
                            children: [
                              (0, a.jsx)('span', { children: '⚙️' }),
                              v ? ('tr' === p ? 'Ayarlar' : 'Settings') : h('settings.title'),
                            ],
                          }),
                          (0, a.jsx)('p', {
                            className: ''.concat(
                              b ? 'text-xs' : 'text-sm',
                              ' font-medium text-gray-600 dark:text-gray-400 mt-0.5'
                            ),
                            children: v
                              ? 'tr' === p
                                ? 'Hesap ayarlarınızı ve uygulama tercihlerinizi y\xf6netin.'
                                : 'Manage your account settings and app preferences.'
                              : h('settings.subtitle'),
                          }),
                        ],
                      }),
                      (0, a.jsxs)('form', {
                        className: 'space-y-3',
                        onSubmit: function (e) {
                          var t;
                          e.preventDefault();
                          let r = E.trim();
                          if (!r && !v) {
                            B('tr' === p ? 'L\xfctfen bir isim girin' : 'Please enter a name');
                            return;
                          }
                          let a = Number(L);
                          if (!Number.isFinite(a) || a <= 0) {
                            B(h('settings.errors.targetPositive'));
                            return;
                          }
                          if (a < s.bB.DAILY_TARGET_MIN || a > s.bB.DAILY_TARGET_MAX) {
                            B(h('settings.errors.targetRange'));
                            return;
                          }
                          (x({
                            name:
                              r || (v && (null == j ? void 0 : j.displayName) ? j.displayName : ''),
                            dailyTarget: Math.round(a),
                            customActivities:
                              null !== (t = null == m ? void 0 : m.customActivities) && void 0 !== t
                                ? t
                                : [],
                            mood: null != I ? I : void 0,
                          }),
                            S(!1),
                            B(null));
                        },
                        children: [
                          v
                            ? (0, a.jsxs)(a.Fragment, {
                                children: [
                                  ((null == j ? void 0 : j.displayName) ||
                                    (null == m ? void 0 : m.name)) &&
                                    (0, a.jsx)('div', {
                                      className:
                                        'mb-3 pb-3 border-b border-gray-200 dark:border-gray-700',
                                      children: (0, a.jsxs)('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          (0, a.jsx)('span', {
                                            className: 'text-lg',
                                            children: '\uD83D\uDC64',
                                          }),
                                          (0, a.jsx)('span', {
                                            className: ''.concat(
                                              b ? 'text-sm' : 'text-base',
                                              ' font-semibold text-gray-900 dark:text-white'
                                            ),
                                            children:
                                              (null == j ? void 0 : j.displayName) ||
                                              (null == m ? void 0 : m.name),
                                          }),
                                        ],
                                      }),
                                    }),
                                  (0, a.jsxs)('label', {
                                    className: 'block space-y-1.5',
                                    children: [
                                      (0, a.jsx)('span', {
                                        className: ''.concat(
                                          b ? 'text-[11px]' : 'text-xs',
                                          ' font-semibold text-gray-700 dark:text-gray-300'
                                        ),
                                        children: h('settings.goalLabel'),
                                      }),
                                      (0, a.jsx)('input', {
                                        type: 'number',
                                        min: s.bB.DAILY_TARGET_MIN,
                                        max: s.bB.DAILY_TARGET_MAX,
                                        step: 100,
                                        value: L,
                                        onChange: (e) => z(e.target.value),
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            b ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-base',
                                            ' bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
                                          ),
                                        placeholder: '10000',
                                      }),
                                    ],
                                  }),
                                  (0, a.jsxs)('label', {
                                    className: 'block space-y-1.5',
                                    children: [
                                      (0, a.jsx)('span', {
                                        className: ''.concat(
                                          b ? 'text-[11px]' : 'text-xs',
                                          ' font-semibold text-gray-700 dark:text-gray-300'
                                        ),
                                        children: h('settings.moodLabel'),
                                      }),
                                      (0, a.jsxs)('select', {
                                        value: I || '',
                                        onChange: (e) => R(e.target.value || null),
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            b ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-base',
                                            ' bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
                                          ),
                                        children: [
                                          (0, a.jsx)('option', {
                                            value: '',
                                            children: h('settings.moodNone'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'happy',
                                            children: h('settings.moodHappy'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'cheerful',
                                            children: h('settings.moodCheerful'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'sad',
                                            children: h('settings.moodSad'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'unhappy',
                                            children: h('settings.moodUnhappy'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'tired',
                                            children: h('settings.moodTired'),
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, a.jsx)('div', {
                                    className: 'pt-2 border-t border-gray-200 dark:border-gray-700',
                                    children: (0, a.jsx)(P, {}),
                                  }),
                                  (0, a.jsxs)('div', {
                                    className:
                                      'pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3',
                                    children: [
                                      (0, a.jsxs)('div', {
                                        children: [
                                          (0, a.jsxs)('span', {
                                            className: ''.concat(
                                              b ? 'text-[10px]' : 'text-xs',
                                              ' font-medium text-gray-600 dark:text-gray-300 block mb-2'
                                            ),
                                            children: [h('data.export'), ' / ', h('data.import')],
                                          }),
                                          (0, a.jsx)(F, {}),
                                        ],
                                      }),
                                      (0, a.jsxs)('div', {
                                        children: [
                                          (0, a.jsx)('span', {
                                            className: ''.concat(
                                              b ? 'text-[10px]' : 'text-xs',
                                              ' font-medium text-gray-600 dark:text-gray-300 block mb-2'
                                            ),
                                            children: h('nav.main'),
                                          }),
                                          (0, a.jsxs)('div', {
                                            className: 'flex items-center gap-3',
                                            children: [(0, a.jsx)(d, {}), (0, a.jsx)(i, {})],
                                          }),
                                        ],
                                      }),
                                      (0, a.jsx)('div', { children: (0, a.jsx)(H, {}) }),
                                      (0, a.jsx)('div', { children: (0, a.jsx)(Q, {}) }),
                                      f &&
                                        (0, a.jsxs)('div', {
                                          children: [
                                            (0, a.jsx)('span', {
                                              className: ''.concat(
                                                b ? 'text-[10px]' : 'text-xs',
                                                ' font-medium text-gray-600 dark:text-gray-300 block mb-2'
                                              ),
                                              children: h('settings.keyboardShortcuts'),
                                            }),
                                            (0, a.jsx)('p', {
                                              className: ''.concat(
                                                b ? 'text-[9px]' : 'text-xs',
                                                ' text-gray-500 dark:text-gray-400 mb-2'
                                              ),
                                              children: h('settings.keyboardShortcutsHint'),
                                            }),
                                            (0, a.jsx)('button', {
                                              type: 'button',
                                              onClick: () => f.showHelp(),
                                              className: 'px-3 py-1.5 '.concat(
                                                b ? 'text-[10px]' : 'text-xs',
                                                ' rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold'
                                              ),
                                              children: h('settings.keyboardShortcuts'),
                                            }),
                                          ],
                                        }),
                                      (0, a.jsx)('div', {
                                        children: (0, a.jsxs)('button', {
                                          type: 'button',
                                          onClick: () => {
                                            window.resetOnboarding && window.resetOnboarding();
                                          },
                                          className: 'w-full px-3 py-1.5 '.concat(
                                            b ? 'text-[10px]' : 'text-xs',
                                            ' rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300 font-semibold'
                                          ),
                                          children: [
                                            '\uD83C\uDF93 ',
                                            h('settings.showOnboarding') || 'Show Onboarding Tour',
                                          ],
                                        }),
                                      }),
                                      (0, a.jsxs)('div', {
                                        children: [
                                          (0, a.jsx)('span', {
                                            className: ''.concat(
                                              b ? 'text-[10px]' : 'text-xs',
                                              ' font-medium text-gray-600 dark:text-gray-300 block mb-2'
                                            ),
                                            children: h('appleHealth.import'),
                                          }),
                                          (0, a.jsxs)('div', {
                                            className: 'space-y-2',
                                            children: [(0, a.jsx)(A, {}), (0, a.jsx)(O, {})],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : (0, a.jsxs)(a.Fragment, {
                                children: [
                                  w &&
                                    (0, a.jsxs)('div', {
                                      className:
                                        'mb-4 pb-4 border-b border-gray-200 dark:border-gray-700',
                                      children: [
                                        (0, a.jsx)('h3', {
                                          className: ''.concat(
                                            b ? 'text-sm' : 'text-base',
                                            ' font-semibold text-gray-900 dark:text-white mb-3'
                                          ),
                                          children: h('nav.login') || 'Login',
                                        }),
                                        (0, a.jsxs)('button', {
                                          type: 'button',
                                          onClick: () => {
                                            (S(!1),
                                              B(null),
                                              setTimeout(() => {
                                                D(!0);
                                              }, 300));
                                          },
                                          className: 'w-full px-4 py-2.5 '.concat(
                                            b ? 'text-sm' : 'text-base',
                                            ' rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300'
                                          ),
                                          children: [
                                            h('nav.login') || 'Login',
                                            ' / ',
                                            h('auth.signUp') || 'Sign Up',
                                          ],
                                        }),
                                      ],
                                    }),
                                  (0, a.jsxs)('label', {
                                    className: 'block space-y-1.5',
                                    children: [
                                      (0, a.jsx)('span', {
                                        className: ''.concat(
                                          b ? 'text-[11px]' : 'text-xs',
                                          ' font-semibold text-gray-700 dark:text-gray-300'
                                        ),
                                        children: h('settings.nameLabel'),
                                      }),
                                      (0, a.jsx)('input', {
                                        type: 'text',
                                        value: E,
                                        onChange: (e) => T(e.target.value),
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            b ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-base',
                                            ' bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
                                          ),
                                        placeholder: 'tr' === p ? 'İsminiz' : 'Your name',
                                      }),
                                    ],
                                  }),
                                  (0, a.jsxs)('label', {
                                    className: 'block space-y-1.5',
                                    children: [
                                      (0, a.jsx)('span', {
                                        className: ''.concat(
                                          b ? 'text-[11px]' : 'text-xs',
                                          ' font-semibold text-gray-700 dark:text-gray-300'
                                        ),
                                        children: h('settings.goalLabel'),
                                      }),
                                      (0, a.jsx)('input', {
                                        type: 'number',
                                        min: s.bB.DAILY_TARGET_MIN,
                                        max: s.bB.DAILY_TARGET_MAX,
                                        step: 100,
                                        value: L,
                                        onChange: (e) => z(e.target.value),
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            b ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-base',
                                            ' bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
                                          ),
                                        placeholder: '10000',
                                      }),
                                    ],
                                  }),
                                  (0, a.jsxs)('label', {
                                    className: 'block space-y-1.5',
                                    children: [
                                      (0, a.jsx)('span', {
                                        className: ''.concat(
                                          b ? 'text-[11px]' : 'text-xs',
                                          ' font-semibold text-gray-700 dark:text-gray-300'
                                        ),
                                        children: h('settings.moodLabel'),
                                      }),
                                      (0, a.jsxs)('select', {
                                        value: I || '',
                                        onChange: (e) => R(e.target.value || null),
                                        className:
                                          'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                            b ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-base',
                                            ' bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
                                          ),
                                        children: [
                                          (0, a.jsx)('option', {
                                            value: '',
                                            children: h('settings.moodNone'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'happy',
                                            children: h('settings.moodHappy'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'cheerful',
                                            children: h('settings.moodCheerful'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'sad',
                                            children: h('settings.moodSad'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'unhappy',
                                            children: h('settings.moodUnhappy'),
                                          }),
                                          (0, a.jsx)('option', {
                                            value: 'tired',
                                            children: h('settings.moodTired'),
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, a.jsxs)('div', {
                                    className: 'pt-2 border-t border-gray-200 dark:border-gray-700',
                                    children: [
                                      (0, a.jsxs)('span', {
                                        className: ''.concat(
                                          b ? 'text-[10px]' : 'text-xs',
                                          ' font-medium text-gray-600 dark:text-gray-300 block mb-2'
                                        ),
                                        children: [h('data.export'), ' / ', h('data.import')],
                                      }),
                                      (0, a.jsx)(F, {}),
                                    ],
                                  }),
                                  (0, a.jsxs)('div', {
                                    className: 'pt-2 border-t border-gray-200 dark:border-gray-700',
                                    children: [
                                      (0, a.jsx)('span', {
                                        className: ''.concat(
                                          b ? 'text-[10px]' : 'text-xs',
                                          ' font-medium text-gray-600 dark:text-gray-300 block mb-2'
                                        ),
                                        children: h('nav.main'),
                                      }),
                                      (0, a.jsxs)('div', {
                                        className: 'flex items-center gap-3',
                                        children: [(0, a.jsx)(d, {}), (0, a.jsx)(i, {})],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                          M
                            ? (0, a.jsx)('p', {
                                className: ''.concat(
                                  b ? 'text-xs' : 'text-sm',
                                  ' text-red-500 font-medium'
                                ),
                                children: M,
                              })
                            : null,
                          (0, a.jsxs)('div', {
                            className: 'pt-3 flex '.concat(b ? 'gap-1.5' : 'gap-2'),
                            children: [
                              (0, a.jsx)('button', {
                                type: 'submit',
                                className: 'flex-1 px-3 py-1.5 '.concat(
                                  b ? 'text-xs' : 'text-sm',
                                  ' rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300'
                                ),
                                children: h('settings.save') || 'Save',
                              }),
                              (0, a.jsx)('button', {
                                type: 'button',
                                onClick: () => {
                                  (S(!1),
                                    B(null),
                                    m && (T(m.name || ''), z(String(m.dailyTarget))));
                                },
                                className: 'px-3 py-1.5 '.concat(
                                  b ? 'text-xs' : 'text-sm',
                                  ' rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold'
                                ),
                                children: h('form.cancel'),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                })
              : null,
          _ =
            v && (null == j ? void 0 : j.displayName)
              ? j.displayName
              : (null == m ? void 0 : m.name) && '' !== m.name.trim()
                ? m.name
                : '\uD83D\uDC64';
        return (0, a.jsxs)(a.Fragment, {
          children: [
            o
              ? (0, a.jsx)('div', {
                  onClick: () => S(!0),
                  className: 'cursor-pointer',
                  children: o,
                })
              : (0, a.jsxs)('button', {
                  type: 'button',
                  onClick: () => S(!0),
                  className: ''.concat(
                    b
                      ? 'px-2.5 py-2 min-h-[36px] min-w-[44px] text-xs rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 gap-1.5 overflow-hidden max-w-[140px] sm:max-w-none'
                      : 'px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2 max-w-[160px]',
                    ' truncate'
                  ),
                  title: _,
                  'aria-label': _,
                  'data-tour-id': 'profile',
                  children: [
                    (0, a.jsx)('span', {
                      className: ''.concat(b ? 'text-[10px] sm:text-xs' : 'text-xs', ' truncate'),
                      children:
                        b && 'string' == typeof _ && _.length > 7 ? _.substring(0, 7) + '...' : _,
                    }),
                    (0, a.jsx)('span', {
                      className: ''.concat('text-xs', ' flex-shrink-0'),
                      children: '⚙️',
                    }),
                  ],
                }),
            W ? (0, c.createPortal)(W, document.body) : null,
            C &&
              (0, a.jsx)(K, {
                open: C,
                onClose: () => {
                  D(!1);
                },
              }),
          ],
        });
      }
      function J() {
        return (0, k.d)()
          ? (0, a.jsxs)('div', {
              className: 'flex items-center gap-2',
              children: [
                (0, a.jsx)('div', {
                  className: 'relative',
                  children: (0, a.jsxs)('svg', {
                    width: '28',
                    height: '28',
                    viewBox: '0 0 40 40',
                    className: 'drop-shadow-sm',
                    'aria-hidden': 'true',
                    children: [
                      (0, a.jsxs)('defs', {
                        children: [
                          (0, a.jsxs)('linearGradient', {
                            id: 'logoGradient',
                            x1: '0%',
                            y1: '0%',
                            x2: '100%',
                            y2: '100%',
                            children: [
                              (0, a.jsx)('stop', { offset: '0%', stopColor: '#0ea5e9' }),
                              (0, a.jsx)('stop', { offset: '100%', stopColor: '#0284c7' }),
                            ],
                          }),
                          (0, a.jsxs)('filter', {
                            id: 'glow',
                            children: [
                              (0, a.jsx)('feGaussianBlur', {
                                stdDeviation: '2',
                                result: 'coloredBlur',
                              }),
                              (0, a.jsxs)('feMerge', {
                                children: [
                                  (0, a.jsx)('feMergeNode', { in: 'coloredBlur' }),
                                  (0, a.jsx)('feMergeNode', { in: 'SourceGraphic' }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, a.jsx)('circle', {
                        cx: '20',
                        cy: '20',
                        r: '18',
                        fill: 'url(#logoGradient)',
                        className: 'dark:opacity-90',
                      }),
                      (0, a.jsx)('path', {
                        d: 'M 12 28 L 14 24 L 16 26 L 18 22 L 20 24 L 22 20 L 24 22 L 26 18 L 28 20',
                        stroke: 'white',
                        strokeWidth: '2.5',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        fill: 'none',
                        filter: 'url(#glow)',
                      }),
                      (0, a.jsx)('circle', {
                        cx: '12',
                        cy: '28',
                        r: '2.5',
                        fill: 'white',
                        filter: 'url(#glow)',
                      }),
                    ],
                  }),
                }),
                (0, a.jsxs)('div', {
                  className: 'flex flex-col leading-tight',
                  children: [
                    (0, a.jsx)('span', {
                      className:
                        'font-bold text-lg sm:text-xl bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent',
                      children: 'sport',
                    }),
                    (0, a.jsx)('span', {
                      className:
                        'font-bold text-lg sm:text-xl bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent',
                      children: 'track',
                    }),
                  ],
                }),
              ],
            })
          : (0, a.jsxs)('div', {
              className: 'flex items-center gap-2',
              children: [
                (0, a.jsx)('div', {
                  className: 'relative',
                  children: (0, a.jsxs)('svg', {
                    width: '36',
                    height: '36',
                    viewBox: '0 0 40 40',
                    className: 'drop-shadow-md transition-transform duration-300 hover:scale-110',
                    'aria-hidden': 'true',
                    children: [
                      (0, a.jsxs)('defs', {
                        children: [
                          (0, a.jsxs)('linearGradient', {
                            id: 'logoGradientDesktop',
                            x1: '0%',
                            y1: '0%',
                            x2: '100%',
                            y2: '100%',
                            children: [
                              (0, a.jsx)('stop', { offset: '0%', stopColor: '#0ea5e9' }),
                              (0, a.jsx)('stop', { offset: '50%', stopColor: '#38bdf8' }),
                              (0, a.jsx)('stop', { offset: '100%', stopColor: '#0284c7' }),
                            ],
                          }),
                          (0, a.jsxs)('filter', {
                            id: 'glowDesktop',
                            children: [
                              (0, a.jsx)('feGaussianBlur', {
                                stdDeviation: '2.5',
                                result: 'coloredBlur',
                              }),
                              (0, a.jsxs)('feMerge', {
                                children: [
                                  (0, a.jsx)('feMergeNode', { in: 'coloredBlur' }),
                                  (0, a.jsx)('feMergeNode', { in: 'SourceGraphic' }),
                                ],
                              }),
                            ],
                          }),
                          (0, a.jsx)('animateTransform', {
                            attributeName: 'transform',
                            attributeType: 'XML',
                            type: 'rotate',
                            from: '0 20 20',
                            to: '360 20 20',
                            dur: '20s',
                            repeatCount: 'indefinite',
                          }),
                        ],
                      }),
                      (0, a.jsx)('circle', {
                        cx: '20',
                        cy: '20',
                        r: '18',
                        fill: 'url(#logoGradientDesktop)',
                        className: 'dark:opacity-90',
                        opacity: '0.95',
                        children: (0, a.jsx)('animate', {
                          attributeName: 'opacity',
                          values: '0.9;1;0.9',
                          dur: '3s',
                          repeatCount: 'indefinite',
                        }),
                      }),
                      (0, a.jsx)('path', {
                        d: 'M 12 28 L 14 24 L 16 26 L 18 22 L 20 24 L 22 20 L 24 22 L 26 18 L 28 20',
                        stroke: 'white',
                        strokeWidth: '2.5',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        fill: 'none',
                        filter: 'url(#glowDesktop)',
                        children: (0, a.jsx)('animate', {
                          attributeName: 'stroke-dasharray',
                          values: '0,20;10,10;0,20',
                          dur: '2s',
                          repeatCount: 'indefinite',
                        }),
                      }),
                      (0, a.jsx)('circle', {
                        cx: '12',
                        cy: '28',
                        r: '2.5',
                        fill: 'white',
                        filter: 'url(#glowDesktop)',
                        children: (0, a.jsx)('animate', {
                          attributeName: 'cy',
                          values: '28;26;28',
                          dur: '1.5s',
                          repeatCount: 'indefinite',
                        }),
                      }),
                    ],
                  }),
                }),
                (0, a.jsx)('span', {
                  className:
                    'font-bold text-xl bg-gradient-to-r from-brand via-brand-light to-brand-dark bg-clip-text text-transparent tracking-tight',
                  children: 'SportTrack',
                }),
              ],
            });
      }
      function Z() {
        let { syncState: e, isConfigured: t } = (0, W.V)(),
          { lang: r } = (0, l.Q)(),
          n = (0, k.d)(),
          o = 'tr' === r ? b.tr : f._;
        return t
          ? (0, a.jsxs)('div', {
              className: 'flex items-center gap-1.5 '.concat(n ? 'text-xs' : 'text-sm', ' ').concat(
                (() => {
                  switch (e.status) {
                    case 'syncing':
                      return 'text-blue-500';
                    case 'synced':
                      return 'text-green-500';
                    case 'error':
                      return 'text-red-500';
                    case 'offline':
                      return 'text-gray-500';
                    default:
                      return 'text-gray-400';
                  }
                })()
              ),
              title: (() => {
                switch (e.status) {
                  case 'syncing':
                    return 'tr' === r ? 'Senkronize ediliyor...' : 'Syncing...';
                  case 'synced':
                    return e.lastSyncAt
                      ? 'tr' === r
                        ? 'Son senkronizasyon: '.concat(
                            (0, p.WU)(e.lastSyncAt, 'HH:mm', { locale: o })
                          )
                        : 'Last sync: '.concat((0, p.WU)(e.lastSyncAt, 'HH:mm', { locale: o }))
                      : 'tr' === r
                        ? 'Senkronize edildi'
                        : 'Synced';
                  case 'error':
                    return 'tr' === r ? 'Senkronizasyon hatası' : 'Sync error';
                  case 'offline':
                    return 'tr' === r ? '\xc7evrimdışı' : 'Offline';
                  default:
                    return '';
                }
              })(),
              children: [
                (0, a.jsx)('span', {
                  className: 'syncing' === e.status ? 'animate-spin' : '',
                  children: (() => {
                    switch (e.status) {
                      case 'syncing':
                        return '\uD83D\uDD04';
                      case 'synced':
                      default:
                        return '☁️';
                      case 'error':
                        return '⚠️';
                      case 'offline':
                        return '\uD83D\uDCF4';
                    }
                  })(),
                }),
                !n &&
                  'synced' === e.status &&
                  e.lastSyncAt &&
                  (0, a.jsx)('span', {
                    className: 'text-gray-500 dark:text-gray-400',
                    children: (0, p.WU)(e.lastSyncAt, 'HH:mm', { locale: o }),
                  }),
              ],
            })
          : null;
      }
      function $() {
        let { t: e } = (0, l.Q)(),
          t = (0, k.d)(),
          { isAuthenticated: r, isConfigured: s } = (0, U.a)(),
          { settings: c } = (0, u.rV)(),
          [g, m] = (0, n.useState)(!1);
        return (0, a.jsxs)('header', {
          className:
            'border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 backdrop-blur sticky top-0 z-40 safe-top',
          children: [
            (0, a.jsxs)('nav', {
              className: 'container flex items-center justify-between h-16 sm:h-12 min-w-0',
              role: 'navigation',
              'aria-label': e('nav.main'),
              children: [
                (0, a.jsx)(o.default, {
                  href: '/',
                  className: 'flex-shrink-0',
                  'aria-label': e('nav.home'),
                  children: (0, a.jsx)(J, {}),
                }),
                (0, a.jsxs)('div', {
                  className:
                    'flex items-center gap-1 sm:gap-1.5 sm:gap-2 text-xs sm:text-sm min-w-0 flex-1 justify-end',
                  children: [
                    (0, a.jsxs)('div', {
                      className: 'flex items-center gap-0.5 sm:gap-1 flex-shrink-0',
                      children: [
                        (0, a.jsxs)(o.default, {
                          href: '/activities',
                          className: 'nav-icon nav-icon-activities '.concat(
                            t ? 'touch-feedback mobile-press' : '',
                            ' min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-lg sm:text-xl transition-all duration-500 rounded-full relative overflow-hidden group'
                          ),
                          'aria-label': e('nav.activities'),
                          'data-tour-id': 'activities',
                          children: [
                            (0, a.jsx)('span', {
                              className: 'relative z-10 group-hover:scale-125 '
                                .concat(
                                  t ? 'group-active:scale-90' : 'group-active:scale-95',
                                  ' transition-transform duration-300 filter drop-shadow-sm '
                                )
                                .concat(t ? 'icon-wiggle-mobile' : ''),
                              children: '\uD83C\uDFC3',
                            }),
                            (0, a.jsx)('div', {
                              className:
                                'absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-600/20 dark:from-blue-400/30 dark:via-cyan-400/30 dark:to-blue-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm',
                            }),
                            (0, a.jsx)('div', {
                              className:
                                'absolute inset-0 border-2 border-transparent group-hover:border-blue-400/50 dark:group-hover:border-blue-400/70 group-active:border-blue-400/70 dark:group-active:border-blue-400/80 rounded-full transition-all duration-500',
                            }),
                          ],
                        }),
                        (0, a.jsxs)(o.default, {
                          href: '/stats',
                          className: 'nav-icon nav-icon-stats '.concat(
                            t ? 'touch-feedback mobile-press' : '',
                            ' min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-lg sm:text-xl transition-all duration-500 rounded-full relative overflow-hidden group'
                          ),
                          'aria-label': e('nav.stats'),
                          'data-tour-id': 'stats',
                          children: [
                            (0, a.jsx)('span', {
                              className: 'relative z-10 group-hover:scale-125 '
                                .concat(
                                  t ? 'group-active:scale-90' : 'group-active:scale-95',
                                  ' transition-transform duration-300 filter drop-shadow-sm '
                                )
                                .concat(t ? 'icon-wiggle-mobile' : ''),
                              children: '\uD83D\uDCCA',
                            }),
                            (0, a.jsx)('div', {
                              className:
                                'absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-600/20 dark:from-green-400/30 dark:via-emerald-400/30 dark:to-green-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm',
                            }),
                            (0, a.jsx)('div', {
                              className:
                                'absolute inset-0 border-2 border-transparent group-hover:border-green-400/50 dark:group-hover:border-green-400/70 group-active:border-green-400/70 dark:group-active:border-green-400/80 rounded-full transition-all duration-500',
                            }),
                          ],
                        }),
                        (0, a.jsxs)(o.default, {
                          href: '/achievements',
                          className: 'nav-icon nav-icon-achievements '.concat(
                            t ? 'touch-feedback mobile-press' : '',
                            ' min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-lg sm:text-xl transition-all duration-500 rounded-full relative overflow-hidden group'
                          ),
                          'aria-label': e('nav.achievements'),
                          'data-tour-id': 'achievements',
                          children: [
                            (0, a.jsx)('span', {
                              className: 'relative z-10 group-hover:scale-125 '
                                .concat(
                                  t ? 'group-active:scale-90' : 'group-active:scale-95',
                                  ' transition-transform duration-300 filter drop-shadow-sm '
                                )
                                .concat(t ? 'icon-wiggle-mobile' : ''),
                              children: '\uD83C\uDFC6',
                            }),
                            (0, a.jsx)('div', {
                              className:
                                'absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-amber-500/20 to-yellow-600/20 dark:from-yellow-400/30 dark:via-amber-400/30 dark:to-yellow-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm',
                            }),
                            (0, a.jsx)('div', {
                              className:
                                'absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 dark:group-hover:border-yellow-400/70 group-active:border-yellow-400/70 dark:group-active:border-yellow-400/80 rounded-full transition-all duration-500',
                            }),
                          ],
                        }),
                        (0, a.jsxs)(o.default, {
                          href: '/challenges',
                          className: 'nav-icon nav-icon-challenges '.concat(
                            t ? 'touch-feedback mobile-press' : '',
                            ' min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-lg sm:text-xl transition-all duration-500 rounded-full relative overflow-hidden group'
                          ),
                          'aria-label': e('nav.challenges'),
                          'data-tour-id': 'challenges',
                          children: [
                            (0, a.jsx)('span', {
                              className: 'relative z-10 group-hover:scale-125 '
                                .concat(
                                  t ? 'group-active:scale-90' : 'group-active:scale-95',
                                  ' transition-transform duration-300 filter drop-shadow-sm '
                                )
                                .concat(t ? 'icon-wiggle-mobile' : ''),
                              children: '\uD83C\uDFAF',
                            }),
                            (0, a.jsx)('div', {
                              className:
                                'absolute inset-0 bg-gradient-to-br from-red-500/20 via-rose-500/20 to-red-600/20 dark:from-red-400/30 dark:via-rose-400/30 dark:to-red-500/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 rounded-full blur-sm',
                            }),
                            (0, a.jsx)('div', {
                              className:
                                'absolute inset-0 border-2 border-transparent group-hover:border-red-400/50 dark:group-hover:border-red-400/70 group-active:border-red-400/70 dark:group-active:border-red-400/80 rounded-full transition-all duration-500',
                            }),
                          ],
                        }),
                      ],
                    }),
                    !t &&
                      (0, a.jsxs)(a.Fragment, {
                        children: [
                          s &&
                            (0, a.jsx)('button', {
                              onClick: () => m(!0),
                              className: 'flex items-center gap-1.5 '.concat(
                                t ? 'text-xs' : 'text-sm',
                                ' text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
                              ),
                              'aria-label': r
                                ? e('nav.logout') || 'Logout'
                                : e('nav.login') || 'Login',
                              children: r ? '\uD83D\uDC64' : '\uD83D\uDD10',
                            }),
                          (0, a.jsx)(Z, {}),
                          (0, a.jsx)(F, {}),
                          (0, a.jsx)(d, {}),
                          (0, a.jsx)(i, {}),
                          (0, a.jsx)(X, {}),
                        ],
                      }),
                    t && (0, a.jsx)(X, {}),
                  ],
                }),
              ],
            }),
            g && (0, a.jsx)(K, { open: g, onClose: () => m(!1) }),
          ],
        });
      }
    },
    26294: function (e, t, r) {
      'use strict';
      r.d(t, {
        W: function () {
          return c;
        },
        a: function () {
          return d;
        },
      });
      var a = r(57437),
        n = r(2265),
        o = r(99376),
        s = r(98661),
        i = r(78466);
      let l = (0, n.createContext)(null);
      function d() {
        return (0, n.useContext)(l);
      }
      function c() {
        let e = (0, o.useRouter)(),
          { t, lang: r } = (0, s.Q)(),
          d = (0, i.d)(),
          [c, u] = (0, n.useState)(!1);
        (0, n.useEffect)(() => {
          if (d) return;
          let t = [
              {
                key: 'g h',
                description: 'tr' === r ? 'Ana sayfaya git' : 'Go to Home',
                action: () => e.push('/'),
                category: 'navigation',
              },
              {
                key: 'g a',
                description: 'tr' === r ? 'Aktiviteler sayfasına git' : 'Go to Activities',
                action: () => e.push('/activities'),
                category: 'navigation',
              },
              {
                key: 'g s',
                description: 'tr' === r ? 'İstatistikler sayfasına git' : 'Go to Statistics',
                action: () => e.push('/stats'),
                category: 'navigation',
              },
              {
                key: 'g c',
                description: 'tr' === r ? 'Zorluklar sayfasına git' : 'Go to Challenges',
                action: () => e.push('/challenges'),
                category: 'navigation',
              },
              {
                key: 'g t',
                description: 'tr' === r ? 'Başarımlar sayfasına git' : 'Go to Achievements',
                action: () => e.push('/achievements'),
                category: 'navigation',
              },
              {
                key: 'a',
                description: 'tr' === r ? 'Yeni aktivite ekle' : 'Add new activity',
                action: () => e.push('/add'),
                category: 'actions',
              },
              {
                key: '?',
                description: 'tr' === r ? 'Kısayolları g\xf6ster/gizle' : 'Show/hide shortcuts',
                action: () => u((e) => !e),
                category: 'general',
              },
              {
                key: 'Esc',
                description: 'tr' === r ? "Dialog'ları kapat" : 'Close dialogs',
                action: () => {
                  let e = new KeyboardEvent('keydown', { key: 'Escape', bubbles: !0 });
                  document.dispatchEvent(e);
                },
                category: 'general',
              },
            ],
            a = [],
            n = null,
            o = (e) => {
              let r = e.target;
              if (
                'INPUT' !== r.tagName &&
                'TEXTAREA' !== r.tagName &&
                !r.isContentEditable &&
                'date' !== r.type &&
                'time' !== r.type
              ) {
                if ('Escape' === e.key) {
                  let e = t.find((e) => 'Esc' === e.key);
                  e && e.action();
                  return;
                }
                if ('?' === e.key && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  e.preventDefault();
                  let r = t.find((e) => '?' === e.key);
                  r && r.action();
                  return;
                }
                if ('g' === e.key && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  (e.preventDefault(),
                    a.push('g'),
                    (n = setTimeout(() => {
                      a = [];
                    }, 1e3)));
                  return;
                }
                if (a.includes('g') && 1 === e.key.length) {
                  e.preventDefault();
                  let r = ''.concat(a[0], ' ').concat(e.key),
                    o = t.find((e) => e.key === r);
                  (o && o.action(), (a = []), n && (clearTimeout(n), (n = null)));
                  return;
                }
                if (1 === e.key.length && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  let r = t.find((t) => t.key === e.key && 1 === t.key.length);
                  r && (e.preventDefault(), r.action());
                }
              }
            };
          return (
            window.addEventListener('keydown', o),
            () => {
              (window.removeEventListener('keydown', o), n && clearTimeout(n));
            }
          );
        }, [e, r, d]);
        let g = { showHelp: () => u(!0) };
        if (d) return null;
        if (!c) return (0, a.jsx)(l.Provider, { value: g, children: null });
        let m = {
          navigation: [
            { key: 'g h', description: 'tr' === r ? 'Ana sayfaya git' : 'Go to Home' },
            {
              key: 'g a',
              description: 'tr' === r ? 'Aktiviteler sayfasına git' : 'Go to Activities',
            },
            {
              key: 'g s',
              description: 'tr' === r ? 'İstatistikler sayfasına git' : 'Go to Statistics',
            },
            {
              key: 'g c',
              description: 'tr' === r ? 'Zorluklar sayfasına git' : 'Go to Challenges',
            },
            {
              key: 'g t',
              description: 'tr' === r ? 'Başarımlar sayfasına git' : 'Go to Achievements',
            },
          ],
          actions: [
            { key: 'a', description: 'tr' === r ? 'Yeni aktivite ekle' : 'Add new activity' },
          ],
          general: [
            {
              key: '?',
              description: 'tr' === r ? 'Kısayolları g\xf6ster/gizle' : 'Show/hide shortcuts',
            },
            { key: 'Esc', description: 'tr' === r ? "Dialog'ları kapat" : 'Close dialogs' },
          ],
        };
        return (0, a.jsx)(l.Provider, {
          value: g,
          children: (0, a.jsx)('div', {
            className:
              'fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in',
            onClick: () => u(!1),
            children: (0, a.jsxs)('div', {
              className:
                'bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-w-2xl w-full mx-4 p-6 animate-scale-in',
              onClick: (e) => e.stopPropagation(),
              children: [
                (0, a.jsxs)('div', {
                  className: 'flex items-center justify-between mb-6',
                  children: [
                    (0, a.jsx)('h2', {
                      className: 'text-2xl font-bold text-gray-900 dark:text-white',
                      children: 'tr' === r ? '⌨️ Klavye Kısayolları' : '⌨️ Keyboard Shortcuts',
                    }),
                    (0, a.jsx)('button', {
                      onClick: () => u(!1),
                      className:
                        'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none transition-colors',
                      'aria-label': 'tr' === r ? 'Kapat' : 'Close',
                      children: '\xd7',
                    }),
                  ],
                }),
                (0, a.jsxs)('div', {
                  className: 'space-y-6',
                  children: [
                    (0, a.jsxs)('div', {
                      children: [
                        (0, a.jsx)('h3', {
                          className:
                            'text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3',
                          children: 'tr' === r ? 'Navigasyon' : 'Navigation',
                        }),
                        (0, a.jsx)('div', {
                          className: 'space-y-2',
                          children: m.navigation.map((e) =>
                            (0, a.jsxs)(
                              'div',
                              {
                                className:
                                  'flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700',
                                children: [
                                  (0, a.jsx)('span', {
                                    className: 'text-sm text-gray-600 dark:text-gray-400',
                                    children: e.description,
                                  }),
                                  (0, a.jsx)('kbd', {
                                    className:
                                      'px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded',
                                    children: e.key,
                                  }),
                                ],
                              },
                              e.key
                            )
                          ),
                        }),
                      ],
                    }),
                    (0, a.jsxs)('div', {
                      children: [
                        (0, a.jsx)('h3', {
                          className:
                            'text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3',
                          children: 'tr' === r ? 'Aksiyonlar' : 'Actions',
                        }),
                        (0, a.jsx)('div', {
                          className: 'space-y-2',
                          children: m.actions.map((e) =>
                            (0, a.jsxs)(
                              'div',
                              {
                                className:
                                  'flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700',
                                children: [
                                  (0, a.jsx)('span', {
                                    className: 'text-sm text-gray-600 dark:text-gray-400',
                                    children: e.description,
                                  }),
                                  (0, a.jsx)('kbd', {
                                    className:
                                      'px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded',
                                    children: e.key,
                                  }),
                                ],
                              },
                              e.key
                            )
                          ),
                        }),
                      ],
                    }),
                    (0, a.jsxs)('div', {
                      children: [
                        (0, a.jsx)('h3', {
                          className:
                            'text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3',
                          children: 'tr' === r ? 'Genel' : 'General',
                        }),
                        (0, a.jsx)('div', {
                          className: 'space-y-2',
                          children: m.general.map((e) =>
                            (0, a.jsxs)(
                              'div',
                              {
                                className:
                                  'flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700',
                                children: [
                                  (0, a.jsx)('span', {
                                    className: 'text-sm text-gray-600 dark:text-gray-400',
                                    children: e.description,
                                  }),
                                  (0, a.jsx)('kbd', {
                                    className:
                                      'px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded',
                                    children: e.key,
                                  }),
                                ],
                              },
                              e.key
                            )
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
                (0, a.jsx)('div', {
                  className: 'mt-6 pt-4 border-t border-gray-200 dark:border-gray-700',
                  children: (0, a.jsx)('p', {
                    className: 'text-xs text-gray-500 dark:text-gray-400 text-center',
                    children:
                      'tr' === r
                        ? 'Kısayolları g\xf6rmek i\xe7in her zaman ? tuşuna basabilirsiniz'
                        : 'Press ? anytime to see shortcuts',
                  }),
                }),
              ],
            }),
          }),
        });
      }
    },
    98727: function (e, t, r) {
      'use strict';
      r.d(t, {
        Providers: function () {
          return A;
        },
      });
      var a = r(57437),
        n = r(98661),
        o = r(24979),
        s = r(58151),
        i = r(13224),
        l = r(76376),
        d = r(6013),
        c = r(10480),
        u = r(2265);
      function g() {
        let e = (0, o.G$)(),
          { showToast: t } = (0, c.P)(),
          { t: r } = (0, n.Q)();
        return (
          (0, u.useEffect)(() => {
            if (!e.storageError) return;
            let a = '';
            switch (e.storageError) {
              case 'parse':
                a = r('errors.storageParseFailed');
                break;
              case 'quota':
                a = r('errors.storageQuotaExceeded');
                break;
              case 'save':
                a = r('errors.storageSaveFailed');
            }
            a && (t(a, 'error'), e.clearStorageError());
          }, [e.storageError, t, r, e]),
          null
        );
      }
      function m() {
        let { t: e } = (0, n.Q)(),
          [t, r] = (0, u.useState)(null),
          [o, s] = (0, u.useState)(!1);
        (0, u.useEffect)(() => {
          let e = (e) => {
            (e.preventDefault(), r(e), setTimeout(() => s(!0), 3e3));
          };
          return (
            window.addEventListener('beforeinstallprompt', e),
            window.matchMedia('(display-mode: standalone)').matches && s(!1),
            () => {
              window.removeEventListener('beforeinstallprompt', e);
            }
          );
        }, []);
        let i = async () => {
          if (!t) return;
          t.prompt();
          let { outcome: e } = await t.userChoice;
          ('accepted' === e && s(!1), r(null));
        };
        return ((0, u.useEffect)(() => {
          'true' === sessionStorage.getItem('pwa-install-dismissed') && s(!1);
        }, []),
        o && t)
          ? (0, a.jsx)('div', {
              className:
                'fixed bottom-4 left-4 right-4 z-[10001] safe-bottom animate-slide-in-right flex justify-center',
              children: (0, a.jsx)('div', {
                className: 'w-full max-w-md mx-auto',
                children: (0, a.jsxs)('div', {
                  className:
                    'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3',
                  children: [
                    (0, a.jsxs)('div', {
                      className: 'flex-1 min-w-0',
                      children: [
                        (0, a.jsx)('div', {
                          className:
                            'font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 text-gray-950 dark:text-white',
                          children: e('pwa.installTitle'),
                        }),
                        (0, a.jsx)('div', {
                          className:
                            'text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed',
                          children: e('pwa.installDescription'),
                        }),
                      ],
                    }),
                    (0, a.jsxs)('div', {
                      className: 'flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto',
                      children: [
                        (0, a.jsx)('button', {
                          onClick: () => {
                            (s(!1), sessionStorage.setItem('pwa-install-dismissed', 'true'));
                          },
                          className:
                            'flex-1 sm:flex-none px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold text-gray-700 dark:text-gray-300',
                          children: e('pwa.dismiss'),
                        }),
                        (0, a.jsx)('button', {
                          onClick: i,
                          className:
                            'flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand transition-all duration-200 font-semibold shadow-md hover:shadow-lg',
                          children: e('pwa.install'),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            })
          : null;
      }
      var y = r(88270),
        x = r(78705),
        h = r(60186);
      function p() {
        let { lang: e } = (0, n.Q)(),
          { settings: t } = (0, s.rV)(),
          r = (null == t ? void 0 : t.dailyTarget) && t.dailyTarget > 0 ? t.dailyTarget : h.Dy,
          a = (0, o.bA)(r);
        return (
          (0, u.useEffect)(() => {
            let t = y.dl;
            try {
              let e = localStorage.getItem(x.I.NOTIFICATIONS);
              e && (t = JSON.parse(e));
            } catch (e) {
              console.error('Failed to load notification settings:', e);
            }
            if (
              (t.enabled &&
                t.dailyReminder &&
                y.BF.startDailyReminderCheck(t, e, () => {
                  y.BF.showDailyReminder(e);
                }),
              t.enabled && t.streakReminder && a.streakDays > 0)
            ) {
              let r = () => {
                  let r = new Date(),
                    [n, o] = t.streakReminderTime.split(':').map(Number),
                    s = new Date();
                  (s.setHours(n, o, 0, 0),
                    6e4 > Math.abs(r.getTime() - s.getTime()) &&
                      y.BF.showStreakReminder(e, a.streakDays));
                },
                n = setInterval(r, 6e4);
              return (
                r(),
                () => {
                  (clearInterval(n), y.BF.stopDailyReminderCheck());
                }
              );
            }
            return () => {
              y.BF.stopDailyReminderCheck();
            };
          }, [e, a.streakDays]),
          null
        );
      }
      var b = r(99376),
        f = r(54887),
        v = r(78466);
      function k(e) {
        let { steps: t, onComplete: r, onSkip: o } = e,
          { t: s, lang: i } = (0, n.Q)(),
          [l, d] = (0, u.useState)(0),
          [c, g] = (0, u.useState)(null),
          [m, y] = (0, u.useState)(null),
          x = (0, u.useRef)(null),
          h = (0, u.useRef)(null),
          p = (0, v.d)(),
          b = (0, u.useRef)(null),
          k = (0, u.useRef)(Date.now()),
          w = t[l];
        ((0, u.useEffect)(() => {
          let e = () => {
            (b.current && clearTimeout(b.current),
              (k.current = Date.now()),
              (b.current = setTimeout(() => {
                Date.now() - k.current >= 3e4 && o();
              }, 3e4)));
          };
          e();
          let t = () => {
            ((k.current = Date.now()), e());
          };
          return (
            window.addEventListener('click', t),
            window.addEventListener('keydown', t),
            window.addEventListener('scroll', t),
            () => {
              (b.current && clearTimeout(b.current),
                window.removeEventListener('click', t),
                window.removeEventListener('keydown', t),
                window.removeEventListener('scroll', t));
            }
          );
        }, [l, o]),
          (0, u.useEffect)(() => {
            if (l >= t.length) {
              r();
              return;
            }
            let e = t[l];
            (e.action && e.action(),
              setTimeout(() => {
                let t = null;
                try {
                  t = document.querySelector(e.target);
                } catch (o) {
                  var r, a, n;
                  if (e.target.includes('data-tour-id')) {
                    let a =
                      null === (r = e.target.match(/data-tour-id="([^"]+)"/)) || void 0 === r
                        ? void 0
                        : r[1];
                    a && (t = document.querySelector('[data-tour-id="'.concat(a, '"]')));
                  } else if (e.target.includes('href')) {
                    let r =
                      null === (a = e.target.match(/href="([^"]+)"/)) || void 0 === a
                        ? void 0
                        : a[1];
                    r && (t = document.querySelector('a[href="'.concat(r, '"]')));
                  } else if (e.target.includes('aria-label')) {
                    let r =
                      null === (n = e.target.match(/aria-label[*]="([^"]+)"/)) || void 0 === n
                        ? void 0
                        : n[1];
                    r &&
                      (t = Array.from(document.querySelectorAll('button, a')).find((e) => {
                        var t;
                        return null === (t = e.getAttribute('aria-label')) || void 0 === t
                          ? void 0
                          : t.includes(r);
                      }));
                  }
                }
                if (t) {
                  (g(t), j(t));
                  let e = t.getBoundingClientRect();
                  if (
                    !(e.top >= 0 && e.bottom <= window.innerHeight) ||
                    e.bottom > 0.8 * window.innerHeight
                  ) {
                    let t = e.top + window.scrollY - window.innerHeight / 2;
                    window.scrollTo({ top: Math.max(0, t), behavior: 'smooth' });
                  }
                } else
                  console.warn(
                    'Onboarding: Could not find element with selector: '.concat(e.target)
                  );
              }, 300));
          }, [l, t, r]),
          (0, u.useEffect)(() => {
            if (!c) return;
            let e = () => {
              let e = c.getBoundingClientRect();
              y({
                top: e.top + window.scrollY,
                left: e.left + window.scrollX,
                width: e.width,
                height: e.height,
              });
            };
            return (
              e(),
              window.addEventListener('scroll', e, !0),
              window.addEventListener('resize', e),
              () => {
                (window.removeEventListener('scroll', e, !0),
                  window.removeEventListener('resize', e));
              }
            );
          }, [c]));
        let j = (e) => {
            let t = e.getBoundingClientRect();
            y({
              top: t.top + window.scrollY,
              left: t.left + window.scrollX,
              width: t.width,
              height: t.height,
            });
          },
          N = () => {
            o();
          };
        if (!w || !m) return null;
        let S = w.position || (p ? 'bottom' : 'right'),
          C = {};
        window.innerWidth;
        let D = window.innerHeight;
        m.top;
        let E = m.top + m.height > 0.7 * D;
        switch ((m.left, m.left, m.width, S)) {
          case 'top':
            C = {
              bottom: ''.concat(m.height + 16, 'px'),
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '90vw',
            };
            break;
          case 'bottom':
            C = E
              ? {
                  bottom: ''.concat(m.height + 16, 'px'),
                  left: '50%',
                  transform: 'translateX(-50%)',
                  maxWidth: '90vw',
                }
              : {
                  top: ''.concat(m.top + m.height + 16, 'px'),
                  left: '50%',
                  transform: 'translateX(-50%)',
                  maxWidth: '90vw',
                };
            break;
          case 'left':
            C = {
              right: ''.concat(m.width + 16, 'px'),
              top: '50%',
              transform: 'translateY(-50%)',
              maxWidth: '40vw',
            };
            break;
          case 'right':
            C = {
              left: ''.concat(m.left + m.width + 16, 'px'),
              top: '50%',
              transform: 'translateY(-50%)',
              maxWidth: '40vw',
            };
            break;
          case 'center':
            C = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '90vw' };
        }
        return (
          void 0 !== C.top &&
            'string' == typeof C.top &&
            parseInt(C.top) + 200 > D &&
            (C.top = ''.concat(Math.max(20, D - 250), 'px')),
          (0, f.createPortal)(
            (0, a.jsxs)(a.Fragment, {
              children: [
                (0, a.jsx)('div', {
                  ref: x,
                  className:
                    'fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px] animate-fade-in',
                  onClick: N,
                  'aria-hidden': 'true',
                }),
                m &&
                  (0, a.jsx)('div', {
                    className:
                      'fixed z-[9999] rounded-xl border-4 border-brand animate-scale-in pointer-events-none',
                    style: {
                      top: ''.concat(m.top - 4, 'px'),
                      left: ''.concat(m.left - 4, 'px'),
                      width: ''.concat(m.width + 8, 'px'),
                      height: ''.concat(m.height + 8, 'px'),
                      boxShadow:
                        '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 0 4px #0ea5e9, 0 0 40px rgba(14, 165, 233, 1), 0 0 80px rgba(14, 165, 233, 0.6), inset 0 0 30px rgba(14, 165, 233, 0.4)',
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
                      zIndex: 9999,
                      filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.8))',
                    },
                  }),
                (0, a.jsx)('div', {
                  ref: h,
                  className: 'fixed z-[10000] '.concat(
                    p ? 'w-[calc(100vw-2rem)] max-w-sm' : 'w-80',
                    ' bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-brand/30 p-4 sm:p-6 animate-scale-in'
                  ),
                  style: { ...C, ...('center' === S ? {} : { position: 'absolute' }) },
                  children: (0, a.jsxs)('div', {
                    className: 'space-y-3',
                    children: [
                      (0, a.jsxs)('div', {
                        className: 'flex items-start justify-between gap-2',
                        children: [
                          (0, a.jsx)('h3', {
                            className: 'text-lg font-bold text-gray-900 dark:text-white',
                            children: w.title,
                          }),
                          (0, a.jsx)('button', {
                            onClick: N,
                            className:
                              'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xl leading-none',
                            'aria-label': s('onboarding.skip'),
                            children: '\xd7',
                          }),
                        ],
                      }),
                      (0, a.jsx)('p', {
                        className: 'text-sm text-gray-600 dark:text-gray-300 leading-relaxed',
                        children: w.content,
                      }),
                      (0, a.jsxs)('div', {
                        className:
                          'flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700',
                        children: [
                          (0, a.jsxs)('div', {
                            className: 'text-xs text-gray-500 dark:text-gray-400',
                            children: [l + 1, ' / ', t.length],
                          }),
                          (0, a.jsxs)('div', {
                            className: 'flex items-center gap-2',
                            children: [
                              l > 0 &&
                                (0, a.jsx)('button', {
                                  onClick: () => {
                                    l > 0 && d(l - 1);
                                  },
                                  className:
                                    'px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                                  children: s('onboarding.previous'),
                                }),
                              (0, a.jsx)('button', {
                                onClick: () => {
                                  l < t.length - 1 ? d(l + 1) : r();
                                },
                                className:
                                  'px-4 py-1.5 text-xs rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors font-medium',
                                children: s(
                                  l === t.length - 1 ? 'onboarding.finish' : 'onboarding.next'
                                ),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
            document.body
          )
        );
      }
      function w() {
        let { t: e, lang: t } = (0, n.Q)(),
          { settings: r, hydrated: i } = (0, s.rV)(),
          { activities: l, hydrated: d } = (0, o.G$)();
        (0, b.useRouter)();
        let [c, g] = (0, u.useState)(!1),
          [m, y] = (0, u.useState)(!0);
        return ((0, u.useEffect)(() => {
          if (!i || !d) return;
          let e = localStorage.getItem(x.I.ONBOARDING_COMPLETED),
            t = !(null == r ? void 0 : r.name) || 0 === l.length;
          !e &&
            t &&
            (y(!1),
            setTimeout(() => {
              g(!0);
            }, 1e3));
        }, [i, d, r, l]),
        (window.resetOnboarding = () => {
          (localStorage.removeItem(x.I.ONBOARDING_COMPLETED),
            y(!1),
            setTimeout(() => {
              g(!0);
            }, 500));
        }),
        !c || m)
          ? null
          : (0, a.jsx)(k, {
              steps: [
                {
                  id: 'welcome',
                  target: 'body',
                  title: 'tr' === t ? 'Hoş Geldiniz! \uD83D\uDC4B' : 'Welcome! \uD83D\uDC4B',
                  content:
                    'tr' === t
                      ? "SportTrack'e hoş geldiniz! Bu kısa turda size uygulamanın temel \xf6zelliklerini g\xf6stereceğiz."
                      : "Welcome to SportTrack! In this short tour, we'll show you the basic features of the app.",
                  position: 'center',
                  action: () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  },
                },
                {
                  id: 'add-activity',
                  target: 'a[href="/add"]',
                  title: 'tr' === t ? 'Aktivite Ekleme ➕' : 'Add Activity ➕',
                  content:
                    'tr' === t
                      ? 'Bu butona tıklayarak yeni aktiviteler ekleyebilirsiniz. Aktivite t\xfcr\xfc, miktar ve not ekleyebilirsiniz.'
                      : 'Click this button to add new activities. You can add activity type, amount, and notes.',
                  position: 'bottom',
                },
                {
                  id: 'stats',
                  target: 'a[href="/stats"]',
                  title: 'tr' === t ? 'İstatistikler \uD83D\uDCCA' : 'Statistics \uD83D\uDCCA',
                  content:
                    'tr' === t
                      ? 'Detaylı istatistiklerinizi, grafiklerinizi ve analizlerinizi buradan g\xf6r\xfcnt\xfcleyebilirsiniz.'
                      : 'View your detailed statistics, charts, and analyses here.',
                  position: 'bottom',
                },
                {
                  id: 'activities',
                  target: '[data-tour-id="activities"]',
                  title: 'tr' === t ? 'Aktiviteler \uD83C\uDFC3' : 'Activities \uD83C\uDFC3',
                  content:
                    'tr' === t
                      ? 'T\xfcm aktivitelerinizi buradan g\xf6r\xfcnt\xfcleyebilir, d\xfczenleyebilir ve filtreleyebilirsiniz.'
                      : 'View, edit, and filter all your activities here.',
                  position: 'bottom',
                },
                {
                  id: 'achievements',
                  target: 'a[href="/achievements"]',
                  title: 'tr' === t ? 'Başarımlar \uD83C\uDFC6' : 'Achievements \uD83C\uDFC6',
                  content:
                    'tr' === t
                      ? 'Kazandığınız rozetleri ve başarımlarınızı buradan g\xf6r\xfcnt\xfcleyebilirsiniz.'
                      : 'View your badges and achievements here.',
                  position: 'bottom',
                },
                {
                  id: 'challenges',
                  target: 'a[href="/challenges"]',
                  title: 'tr' === t ? 'Hedefler \uD83C\uDFAF' : 'Goals \uD83C\uDFAF',
                  content:
                    'tr' === t
                      ? 'G\xfcnl\xfck, haftalık ve \xf6zel hedefler oluşturup takip edebilirsiniz.'
                      : 'Create and track daily, weekly, and custom goals.',
                  position: 'bottom',
                },
                {
                  id: 'profile',
                  target: '[data-tour-id="profile"]',
                  title:
                    'tr' === t ? 'Profil Ayarları \uD83D\uDC64' : 'Profile Settings \uD83D\uDC64',
                  content:
                    'tr' === t
                      ? 'Buradan profil bilgilerinizi, g\xfcnl\xfck hedefinizi ve ruh halinizi ayarlayabilirsiniz.'
                      : 'Here you can set your profile information, daily target, and mood.',
                  position: 'bottom',
                },
                {
                  id: 'complete',
                  target: 'body',
                  title: 'tr' === t ? 'Hazırsınız! \uD83C\uDF89' : "You're Ready! \uD83C\uDF89",
                  content:
                    'tr' === t
                      ? "Artık SportTrack'i kullanmaya başlayabilirsiniz! İyi antrenmanlar! \uD83D\uDCAA"
                      : "You're now ready to use SportTrack! Happy training! \uD83D\uDCAA",
                  position: 'center',
                },
              ],
              onComplete: () => {
                (localStorage.setItem(x.I.ONBOARDING_COMPLETED, 'true'), g(!1), y(!0));
              },
              onSkip: () => {
                (localStorage.setItem(x.I.ONBOARDING_COMPLETED, 'true'), g(!1), y(!0));
              },
            });
      }
      var j = r(26294);
      function N() {
        let { badges: e, checkNewBadges: t } = (0, i.F)(),
          { lang: r } = (0, n.Q)(),
          o = (0, b.useRouter)(),
          s = (0, v.d)(),
          [l, d] = (0, u.useState)([]),
          [c, g] = (0, u.useState)(null),
          [m, y] = (0, u.useState)(!1),
          [x, h] = (0, u.useState)(!1),
          [p, f] = (0, u.useState)(new Set());
        (0, u.useEffect)(() => {
          let e = t();
          if (e.length > 0) {
            let t = e.filter((e) => !p.has(e.id));
            t.length > 0 &&
              (d((e) => [...e, ...t]),
              f((e) => {
                let r = new Set(e);
                return (t.forEach((e) => r.add(e.id)), r);
              }));
          }
        }, [e, t, p]);
        let k = (0, u.useCallback)(() => {
          (h(!0),
            setTimeout(() => {
              (y(!1), g(null), d((e) => e.slice(1)), h(!1));
            }, 300));
        }, []);
        return ((0, u.useEffect)(() => {
          if (l.length > 0 && !c && !m) {
            (g(l[0]), y(!0), h(!1));
            let e = setTimeout(() => {
              k();
            }, 5e3);
            return () => clearTimeout(e);
          }
        }, [l, c, m, k]),
        c && m)
          ? (0, a.jsx)('div', {
              className:
                'fixed inset-0 z-[100] flex items-center justify-center pointer-events-none',
              onClick: () => {
                (k(),
                  setTimeout(() => {
                    o.push('/achievements');
                  }, 150));
              },
              children: (0, a.jsxs)('div', {
                className: ''
                  .concat(
                    s ? 'px-4 py-3' : 'px-6 py-4',
                    ' rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-500 shadow-2xl border-4 border-yellow-300 dark:border-yellow-400 cursor-pointer pointer-events-auto transform transition-all duration-300 '
                  )
                  .concat(
                    x ? 'opacity-0 scale-90' : 'opacity-100 scale-100',
                    ' animate-badge-unlock-center'
                  ),
                onClick: (e) => e.stopPropagation(),
                children: [
                  (0, a.jsxs)('div', {
                    className: 'flex flex-col items-center gap-2',
                    children: [
                      (0, a.jsx)('div', {
                        className: ''.concat(s ? 'text-5xl' : 'text-6xl', ' animate-badge-bounce'),
                        children: c.icon,
                      }),
                      (0, a.jsx)('div', {
                        className: ''.concat(
                          s ? 'text-sm' : 'text-base',
                          ' font-bold text-white text-center'
                        ),
                        children: 'tr' === r ? 'Yeni Rozet Kazandın!' : 'New Badge Unlocked!',
                      }),
                      (0, a.jsx)('div', {
                        className: ''.concat(
                          s ? 'text-xs' : 'text-sm',
                          ' font-semibold text-white/90 text-center'
                        ),
                        children: c.name[r],
                      }),
                      c.description &&
                        (0, a.jsx)('div', {
                          className: ''.concat(
                            s ? 'text-[10px]' : 'text-xs',
                            ' text-white/80 text-center max-w-xs'
                          ),
                          children: c.description[r],
                        }),
                      (0, a.jsx)('div', {
                        className: ''.concat(
                          s ? 'text-[10px]' : 'text-xs',
                          ' text-white/70 text-center mt-1 italic'
                        ),
                        children:
                          'tr' === r
                            ? 'Tıklayarak rozetlerini g\xf6r'
                            : 'Click to view your badges',
                      }),
                    ],
                  }),
                  Array.from({ length: 12 }).map((e, t) =>
                    (0, a.jsx)(
                      'div',
                      {
                        className: 'absolute badge-sparkle',
                        style: {
                          left: ''.concat(100 * Math.random(), '%'),
                          top: ''.concat(100 * Math.random(), '%'),
                          animationDelay: ''.concat(0.5 * Math.random(), 's'),
                        },
                        children: '✨',
                      },
                      t
                    )
                  ),
                ],
              }),
            })
          : null;
      }
      var S = r(21903);
      function C() {
        let { isOffline: e } = (0, S.k)(),
          { t, lang: r } = (0, n.Q)(),
          o = (0, v.d)();
        return e
          ? (0, a.jsx)('div', {
              className:
                'fixed top-0 left-0 right-0 z-[10000] bg-red-500 dark:bg-red-600 text-white text-center '.concat(
                  o ? 'py-2 px-4 text-xs' : 'py-2.5 px-6 text-sm',
                  ' font-semibold shadow-lg animate-slide-in-down'
                ),
              role: 'alert',
              'aria-live': 'assertive',
              children: (0, a.jsxs)('div', {
                className: 'flex items-center justify-center gap-2',
                children: [
                  (0, a.jsx)('span', { className: 'text-base', children: '⚠️' }),
                  (0, a.jsx)('span', {
                    children:
                      'tr' === r
                        ? 'İnternet bağlantısı yok. Offline modda \xe7alışıyorsunuz.'
                        : 'No internet connection. You are working offline.',
                  }),
                ],
              }),
            })
          : null;
      }
      class D extends u.Component {
        static getDerivedStateFromError(e) {
          return { hasError: !0, error: e };
        }
        componentDidCatch(e, t) {
          console.error('ErrorBoundary caught an error:', e, t);
        }
        render() {
          return this.state.hasError
            ? this.props.fallback
              ? this.props.fallback
              : (0, a.jsx)(E, { error: this.state.error })
            : this.props.children;
        }
        constructor(e) {
          (super(e), (this.state = { hasError: !1, error: null }));
        }
      }
      function E(e) {
        let { error: t } = e,
          { t: r, lang: o } = (0, n.Q)(),
          s = (0, v.d)();
        return (0, a.jsx)('div', {
          className: 'min-h-screen flex items-center justify-center p-4 '.concat(
            s ? 'py-8' : 'py-12'
          ),
          children: (0, a.jsx)('div', {
            className:
              'max-w-md w-full rounded-xl border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-white via-red-50/50 to-white dark:from-gray-900/95 dark:via-red-900/20 dark:to-gray-900/95 '.concat(
                s ? 'p-6' : 'p-8',
                ' shadow-xl'
              ),
            children: (0, a.jsxs)('div', {
              className: 'text-center',
              children: [
                (0, a.jsx)('div', {
                  className: ''
                    .concat(s ? 'text-5xl' : 'text-6xl', ' mb-4 ')
                    .concat(s ? 'emoji-celebrate' : 'emoji-bounce'),
                  children: '⚠️',
                }),
                (0, a.jsx)('h1', {
                  className: ''.concat(
                    s ? 'text-xl' : 'text-2xl',
                    ' font-bold text-gray-950 dark:text-gray-100 mb-2'
                  ),
                  children: 'tr' === o ? 'Bir Hata Oluştu' : 'Something Went Wrong',
                }),
                (0, a.jsx)('p', {
                  className: ''.concat(
                    s ? 'text-sm' : 'text-base',
                    ' text-gray-700 dark:text-gray-300 mb-6'
                  ),
                  children:
                    'tr' === o
                      ? '\xdczg\xfcn\xfcz, beklenmeyen bir hata oluştu. L\xfctfen sayfayı yenileyin veya daha sonra tekrar deneyin.'
                      : 'Sorry, an unexpected error occurred. Please refresh the page or try again later.',
                }),
                t && !1,
                (0, a.jsxs)('div', {
                  className: 'flex '.concat(s ? 'flex-col' : 'flex-row', ' gap-3 justify-center'),
                  children: [
                    (0, a.jsx)('button', {
                      onClick: () => {
                        window.location.reload();
                      },
                      className:
                        'px-6 py-3 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg hover:from-brand-dark hover:to-brand font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl '.concat(
                          s
                            ? 'touch-feedback mobile-press bounce-in-mobile w-full'
                            : 'btn-enhanced scale-on-interact'
                        ),
                      children: 'tr' === o ? 'Sayfayı Yenile' : 'Reload Page',
                    }),
                    (0, a.jsx)('button', {
                      onClick: () => {
                        (localStorage.clear(), window.location.reload());
                      },
                      className:
                        'px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl '.concat(
                          s
                            ? 'touch-feedback mobile-press bounce-in-mobile w-full'
                            : 'btn-enhanced scale-on-interact'
                        ),
                      children: 'tr' === o ? 'Verileri Sıfırla' : 'Reset Data',
                    }),
                  ],
                }),
              ],
            }),
          }),
        });
      }
      var T = r(76564),
        L = r(6863),
        z = r(38471);
      function I(e) {
        let { children: t } = e;
        return (
          !(function () {
            let { isAuthenticated: e, isConfigured: t } = (0, T.a)(),
              { syncToCloud: r } = (0, L.V)(),
              { activities: a, hydrated: n } = (0, o.G$)(),
              { settings: l, hydrated: c } = (0, s.rV)(),
              { badges: g, hydrated: m } = (0, i.F)(),
              { challenges: y, hydrated: x } = (0, d.B)(),
              h = (0, u.useRef)(null),
              p = (0, u.useRef)({ activities: 0, settings: null, badges: 0, challenges: 0 }),
              b = n && c && m && x;
            ((0, u.useEffect)(() => {
              if (!e || !t || !b) return;
              let n = a.length !== p.current.activities,
                o = null !== l && JSON.stringify(l) !== p.current.settings,
                s = g.length !== p.current.badges,
                i = y.length !== p.current.challenges;
              if (n || o || s || i)
                return (
                  h.current && clearTimeout(h.current),
                  (h.current = setTimeout(() => {
                    (r({ activities: a, settings: l, badges: g, challenges: y }).catch((e) => {
                      console.error('Auto-sync failed:', e);
                    }),
                      (p.current = {
                        activities: a.length,
                        settings: l ? JSON.stringify(l) : null,
                        badges: g.length,
                        challenges: y.length,
                      }));
                  }, 2e3)),
                  () => {
                    h.current && clearTimeout(h.current);
                  }
                );
            }, [e, t, b, a, l, g, y, r]),
              (0, u.useEffect)(
                () => () => {
                  h.current && clearTimeout(h.current);
                },
                []
              ));
          })(),
          !(function () {
            let { isAuthenticated: e, isConfigured: t } = (0, T.a)(),
              { activities: r, hydrated: a } = (0, o.G$)(),
              { settings: n, hydrated: l, saveSettings: c } = (0, s.rV)(),
              { badges: g, hydrated: m } = (0, i.F)(),
              { challenges: y, hydrated: x } = (0, d.B)(),
              h = a && l && m && x;
            (0, u.useEffect)(() => {
              if (!e || !t || !h) return;
              let a = z.L.subscribeToCloud((e) => {
                if (e) {
                  if (e.activities && Array.isArray(e.activities)) {
                    e.activities.map((e) => e.id).filter(Boolean);
                    let t = new Set(r.map((e) => e.id));
                    e.activities.filter((e) => e.id && !t.has(e.id)).length > 0 &&
                      console.log('Cloud has new activities, but bulk add not implemented');
                  }
                  if (
                    (e.settings &&
                      JSON.stringify(e.settings) !== (n ? JSON.stringify(n) : null) &&
                      c(e.settings),
                    e.badges && Array.isArray(e.badges))
                  ) {
                    e.badges.map((e) => e.id).filter(Boolean);
                    let t = new Set(g.map((e) => e.id));
                    e.badges.filter((e) => e.id && !t.has(e.id)).length > 0 &&
                      console.log('Cloud has new badges, but bulk add not implemented');
                  }
                  if (e.challenges && Array.isArray(e.challenges)) {
                    e.challenges.map((e) => e.id).filter(Boolean);
                    let t = new Set(y.map((e) => e.id));
                    e.challenges.filter((e) => e.id && !t.has(e.id)).length > 0 &&
                      console.log('Cloud has new challenges, but bulk add not implemented');
                  }
                }
              });
              return () => {
                a();
              };
            }, [e, t, h, r, n, g, y, c]);
          })(),
          (0, a.jsx)(a.Fragment, { children: t })
        );
      }
      function R() {
        let { settings: e, hydrated: t, saveSettings: r } = (0, s.rV)(),
          { t: o, lang: i } = (0, n.Q)(),
          l = (0, v.d)(),
          { isAuthenticated: d } = (0, T.a)(),
          [c, g] = (0, u.useState)(!1),
          [m, y] = (0, u.useState)(''),
          [x, h] = (0, u.useState)(null);
        if (
          ((0, u.useEffect)(() => {
            if (!t) return;
            if (d) {
              g(!1);
              return;
            }
            let r = 'true' === localStorage.getItem('onboarding_completed'),
              a = 'true' === localStorage.getItem('name_dialog_shown');
            !r || a || d || ((null == e ? void 0 : e.name) && '' !== e.name.trim())
              ? g(!1)
              : setTimeout(() => {
                  g(!0);
                }, 500);
          }, [t, d, e]),
          !t || d || ((null == e ? void 0 : e.name) && '' !== e.name.trim()))
        )
          return null;
        let p = c
          ? (0, a.jsx)('div', {
              className:
                'fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 px-4 py-4 overflow-y-auto',
              onClick: (e) => {
                (e.target, e.currentTarget);
              },
              children: (0, a.jsxs)('div', {
                className:
                  'relative w-full max-w-md rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-5 sm:p-6 my-auto',
                children: [
                  (0, a.jsxs)('div', {
                    className: 'mb-4 pb-3 border-b border-gray-200 dark:border-gray-700',
                    children: [
                      (0, a.jsxs)('h2', {
                        className: ''.concat(
                          l ? 'text-base' : 'text-lg',
                          ' font-bold text-gray-950 dark:text-white flex items-center gap-2'
                        ),
                        children: [
                          (0, a.jsx)('span', { children: '\uD83D\uDC4B' }),
                          'tr' === i ? 'Bize Kendinizden Bahsedin' : 'Tell Us About You',
                        ],
                      }),
                      (0, a.jsx)('p', {
                        className: ''.concat(
                          l ? 'text-xs' : 'text-sm',
                          ' font-medium text-gray-600 dark:text-gray-400 mt-0.5'
                        ),
                        children:
                          'tr' === i
                            ? 'Kişiselleştirilmiş bir deneyim i\xe7in isminizi girin'
                            : 'Enter your name for a personalized experience',
                      }),
                    ],
                  }),
                  (0, a.jsxs)('form', {
                    className: 'space-y-3',
                    onSubmit: function (t) {
                      var a, n;
                      t.preventDefault();
                      let o = m.trim();
                      if (!o) {
                        h('tr' === i ? 'L\xfctfen bir isim girin' : 'Please enter a name');
                        return;
                      }
                      (r({
                        name: o,
                        dailyTarget:
                          null !== (a = null == e ? void 0 : e.dailyTarget) && void 0 !== a
                            ? a
                            : 1e4,
                        customActivities:
                          null !== (n = null == e ? void 0 : e.customActivities) && void 0 !== n
                            ? n
                            : [],
                        mood: null == e ? void 0 : e.mood,
                      }),
                        localStorage.setItem('name_dialog_shown', 'true'),
                        g(!1),
                        h(null));
                    },
                    children: [
                      (0, a.jsxs)('label', {
                        className: 'block space-y-1.5',
                        children: [
                          (0, a.jsx)('span', {
                            className: ''.concat(
                              l ? 'text-[11px]' : 'text-xs',
                              ' font-semibold text-gray-700 dark:text-gray-300'
                            ),
                            children: o('settings.nameLabel'),
                          }),
                          (0, a.jsx)('input', {
                            type: 'text',
                            value: m,
                            onChange: (e) => {
                              (y(e.target.value), h(null));
                            },
                            className:
                              'w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg '.concat(
                                l ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-base',
                                ' bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all'
                              ),
                            placeholder: 'tr' === i ? 'İsminiz' : 'Your name',
                            autoFocus: !0,
                          }),
                        ],
                      }),
                      x
                        ? (0, a.jsx)('p', {
                            className: ''.concat(
                              l ? 'text-xs' : 'text-sm',
                              ' text-red-500 font-medium'
                            ),
                            children: x,
                          })
                        : null,
                      (0, a.jsx)('div', {
                        className: 'pt-2',
                        children: (0, a.jsx)('button', {
                          type: 'submit',
                          className: 'w-full px-4 py-2.5 '.concat(
                            l ? 'text-sm' : 'text-base',
                            ' rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300'
                          ),
                          children: o('settings.save') || 'Save',
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            })
          : null;
        return (0, a.jsx)(a.Fragment, {
          children: p ? (0, f.createPortal)(p, document.body) : null,
        });
      }
      function A(e) {
        let { children: t } = e;
        return (0, a.jsx)(D, {
          children: (0, a.jsx)(n.b, {
            children: (0, a.jsx)(s.mu, {
              children: (0, a.jsx)(o.QO, {
                children: (0, a.jsx)(l.Y, {
                  children: (0, a.jsx)(d.U, {
                    children: (0, a.jsx)(i.X, {
                      children: (0, a.jsx)(c.N, {
                        children: (0, a.jsxs)(I, {
                          children: [
                            (0, a.jsx)(g, {}),
                            (0, a.jsx)(m, {}),
                            (0, a.jsx)(p, {}),
                            (0, a.jsx)(w, {}),
                            (0, a.jsx)(j.W, {}),
                            (0, a.jsx)(N, {}),
                            (0, a.jsx)(C, {}),
                            (0, a.jsx)(R, {}),
                            t,
                          ],
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        });
      }
    },
    22583: function (e, t, r) {
      'use strict';
      r.d(t, {
        QuoteTicker: function () {
          return d;
        },
      });
      var a = r(57437),
        n = r(2265);
      let o = [
        {
          tr: 'Her adım, hedefe giden yolda bir zaferdir.',
          en: 'Every step is a victory on the path to your goal.',
        },
        {
          tr: 'Bug\xfcn yaptığın k\xfc\xe7\xfck \xe7abalar, yarın b\xfcy\xfck farklar yaratır.',
          en: "Today's small efforts create tomorrow's big differences.",
        },
        {
          tr: 'Spor yapmak sadece v\xfccudu değil, ruhu da g\xfc\xe7lendirir.',
          en: 'Exercise strengthens not just the body, but the soul.',
        },
        {
          tr: 'Hedefine ulaşmak i\xe7in ilk adımı at: Bug\xfcn başla!',
          en: 'Take the first step toward your goal: Start today!',
        },
        {
          tr: 'Her g\xfcn biraz daha iyi olmak i\xe7in \xe7alış.',
          en: 'Work to be a little better every day.',
        },
        {
          tr: 'Başarı, k\xfc\xe7\xfck \xe7abaların toplamıdır.',
          en: 'Success is the sum of small efforts.',
        },
        {
          tr: 'V\xfccudunun sınırlarını zorla, zihninin sınırlarını aş.',
          en: "Push your body's limits, exceed your mind's boundaries.",
        },
        {
          tr: 'Bug\xfcn yapmadığın egzersiz, yarın pişman olacağın se\xe7imdir.',
          en: "The exercise you skip today is the regret you'll have tomorrow.",
        },
        {
          tr: 'Hedefine giden yol, her g\xfcn atılan k\xfc\xe7\xfck adımlarla başlar.',
          en: 'The path to your goal starts with small steps taken every day.',
        },
        {
          tr: 'Spor yapmak bir yaşam tarzıdır, bir g\xf6rev değil.',
          en: 'Exercise is a lifestyle, not a chore.',
        },
        {
          tr: 'Disiplin, motivasyon bittiğinde devreye girer.',
          en: 'Discipline kicks in when motivation runs out.',
        },
        {
          tr: 'Zor g\xfcnler ge\xe7er, ama g\xfc\xe7l\xfc insanlar kalır.',
          en: 'Tough days pass, but strong people remain.',
        },
        {
          tr: 'Başarısızlık, başarıya giden yolun bir par\xe7asıdır.',
          en: 'Failure is part of the path to success.',
        },
        { tr: 'Kendinle yarış, başkalarıyla değil.', en: 'Race against yourself, not others.' },
        {
          tr: 'Her şampiyon bir zamanlar başlangı\xe7taydı.',
          en: 'Every champion was once a beginner.',
        },
        { tr: 'Sınırlar sadece kafanda var.', en: 'Limits exist only in your mind.' },
        {
          tr: 'Bug\xfcn yapabileceğin en iyi şey, d\xfcn yapmadığın şeydir.',
          en: "The best thing you can do today is what you didn't do yesterday.",
        },
        { tr: 'Hedefler hayaller değil, planlardır.', en: 'Goals are not dreams, they are plans.' },
        {
          tr: 'İlerleme m\xfckemmellikten daha \xf6nemlidir.',
          en: 'Progress is more important than perfection.',
        },
        {
          tr: 'Kendine inan, \xe7\xfcnk\xfc başka kimse yapmayacak.',
          en: 'Believe in yourself, because no one else will.',
        },
        { tr: 'Her g\xfcn yeni bir başlangı\xe7tır.', en: 'Every day is a new beginning.' },
        {
          tr: 'Zorluklar seni durduramaz, sadece yavaşlatabilir.',
          en: "Challenges can't stop you, they can only slow you down.",
        },
        {
          tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
          en: 'Success is the meeting of preparation and opportunity.',
        },
        {
          tr: 'Kendini geliştirmek, en iyi yatırımdır.',
          en: 'Investing in yourself is the best investment.',
        },
        { tr: 'Hedeflerine ulaşmak i\xe7in sabırlı ol.', en: 'Be patient in reaching your goals.' },
        { tr: 'Her g\xfcn biraz daha ileri git.', en: 'Go a little further each day.' },
        {
          tr: 'G\xfc\xe7l\xfc olmak i\xe7in zayıf olmak gerekir.',
          en: 'You must be weak to become strong.',
        },
        {
          tr: 'Başarı, k\xfc\xe7\xfck \xe7abaların tekrarıdır.',
          en: 'Success is the repetition of small efforts.',
        },
        {
          tr: 'Kendini zorla, \xe7\xfcnk\xfc kimse senin i\xe7in yapmayacak.',
          en: 'Push yourself, because no one else will do it for you.',
        },
        {
          tr: 'Her şey imkansız g\xf6r\xfcn\xfcr, ta ki yapılana kadar.',
          en: "Everything seems impossible until it's done.",
        },
        { tr: 'Bug\xfcn\xfcn işini yarına bırakma.', en: "Don't leave today's work for tomorrow." },
        {
          tr: 'Hedeflerin i\xe7in \xe7alış, hayallerin i\xe7in değil.',
          en: 'Work for your goals, not your dreams.',
        },
        {
          tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
          en: 'Success is the meeting of preparation and opportunity.',
        },
        {
          tr: 'Kendini geliştirmek, en iyi yatırımdır.',
          en: 'Investing in yourself is the best investment.',
        },
        { tr: 'Her g\xfcn biraz daha ileri git.', en: 'Go a little further each day.' },
        {
          tr: 'G\xfc\xe7l\xfc olmak i\xe7in zayıf olmak gerekir.',
          en: 'You must be weak to become strong.',
        },
        {
          tr: 'Başarı, k\xfc\xe7\xfck \xe7abaların tekrarıdır.',
          en: 'Success is the repetition of small efforts.',
        },
        {
          tr: 'Kendini zorla, \xe7\xfcnk\xfc kimse senin i\xe7in yapmayacak.',
          en: 'Push yourself, because no one else will do it for you.',
        },
        {
          tr: 'Her şey imkansız g\xf6r\xfcn\xfcr, ta ki yapılana kadar.',
          en: "Everything seems impossible until it's done.",
        },
        { tr: 'Bug\xfcn\xfcn işini yarına bırakma.', en: "Don't leave today's work for tomorrow." },
        {
          tr: 'Hedeflerin i\xe7in \xe7alış, hayallerin i\xe7in değil.',
          en: 'Work for your goals, not your dreams.',
        },
        {
          tr: 'V\xfccudun bir tapınaktır, ona saygı g\xf6ster.',
          en: 'Your body is a temple, respect it.',
        },
        {
          tr: 'Zorlu antrenmanlar, g\xfc\xe7l\xfc karakterler yaratır.',
          en: 'Tough workouts build strong characters.',
        },
        {
          tr: 'Bug\xfcn yapmadığın şey, yarın seni geride bırakır.',
          en: "What you don't do today will leave you behind tomorrow.",
        },
        {
          tr: 'Spor yapmak, kendine yapabileceğin en iyi yatırımdır.',
          en: 'Exercise is the best investment you can make in yourself.',
        },
        {
          tr: 'Her ter damlası, başarıya giden yolda bir adımdır.',
          en: 'Every drop of sweat is a step toward success.',
        },
        {
          tr: 'G\xfc\xe7l\xfc olmak bir se\xe7imdir, zayıf olmak değil.',
          en: 'Being strong is a choice, not being weak.',
        },
        {
          tr: 'Hedeflerin i\xe7in m\xfccadele et, pes etme.',
          en: 'Fight for your goals, never give up.',
        },
        {
          tr: 'Spor yapmak, hayat kalitesini artırır.',
          en: 'Exercise improves your quality of life.',
        },
        {
          tr: 'K\xfc\xe7\xfck başlangı\xe7lar, b\xfcy\xfck sonu\xe7lar doğurur.',
          en: 'Small beginnings lead to great results.',
        },
        {
          tr: 'Her g\xfcn bir fırsattır, onu değerlendir.',
          en: 'Every day is an opportunity, make the most of it.',
        },
        { tr: 'Başarı, tutarlılığın \xe7ocuğudur.', en: 'Success is the child of consistency.' },
        {
          tr: 'V\xfccudunun sınırlarını keşfet, sonra onları aş.',
          en: "Discover your body's limits, then exceed them.",
        },
        {
          tr: 'Spor yapmak, zihinsel g\xfcc\xfc de geliştirir.',
          en: 'Exercise also develops mental strength.',
        },
        {
          tr: 'Her antrenman, seni daha iyi bir versiyona d\xf6n\xfcşt\xfcr\xfcr.',
          en: 'Every workout transforms you into a better version.',
        },
        {
          tr: 'Hedeflerin i\xe7in \xe7alışmak, hayallerin i\xe7in değil.',
          en: 'Work for your goals, not your dreams.',
        },
        {
          tr: 'G\xfc\xe7l\xfc olmak, zorlu g\xfcnlerde ortaya \xe7ıkar.',
          en: 'Strength shows itself in tough days.',
        },
        {
          tr: 'Spor yapmak, kendine verdiğin bir s\xf6zd\xfcr.',
          en: 'Exercise is a promise you make to yourself.',
        },
        { tr: 'Her g\xfcn biraz daha g\xfc\xe7l\xfc ol.', en: 'Get a little stronger every day.' },
        {
          tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
          en: 'Success is when preparation meets opportunity.',
        },
        {
          tr: 'V\xfccudunun sınırlarını zorla, zihninin sınırlarını aş.',
          en: "Push your body's limits, exceed your mind's boundaries.",
        },
        {
          tr: 'Her adım, hedefe giden yolda bir zaferdir.',
          en: 'Every step is a victory on the path to your goal.',
        },
        {
          tr: 'Spor yapmak, kendine yapabileceğin en iyi yatırımdır.',
          en: 'Exercise is the best investment you can make in yourself.',
        },
        {
          tr: 'Disiplin, motivasyon bittiğinde devreye girer.',
          en: 'Discipline kicks in when motivation runs out.',
        },
        {
          tr: 'Her g\xfcn yeni bir başlangı\xe7, yeni bir fırsat.',
          en: 'Every day is a new beginning, a new opportunity.',
        },
        {
          tr: 'Başarı, k\xfc\xe7\xfck \xe7abaların tekrarıdır.',
          en: 'Success is the repetition of small efforts.',
        },
        {
          tr: 'Kendini zorla, \xe7\xfcnk\xfc kimse senin i\xe7in yapmayacak.',
          en: 'Push yourself, because no one else will do it for you.',
        },
        {
          tr: 'Her şey imkansız g\xf6r\xfcn\xfcr, ta ki yapılana kadar.',
          en: "Everything seems impossible until it's done.",
        },
        {
          tr: 'Spor yapmak, hayat kalitesini artırır.',
          en: 'Exercise improves your quality of life.',
        },
        {
          tr: 'G\xfc\xe7l\xfc olmak bir se\xe7imdir, zayıf olmak değil.',
          en: 'Being strong is a choice, not being weak.',
        },
        {
          tr: 'Her ter damlası, başarıya giden yolda bir adımdır.',
          en: 'Every drop of sweat is a step toward success.',
        },
        {
          tr: 'K\xfc\xe7\xfck başlangı\xe7lar, b\xfcy\xfck sonu\xe7lar doğurur.',
          en: 'Small beginnings lead to great results.',
        },
        { tr: 'Başarı, tutarlılığın \xe7ocuğudur.', en: 'Success is the child of consistency.' },
        {
          tr: 'Her antrenman, seni daha iyi bir versiyona d\xf6n\xfcşt\xfcr\xfcr.',
          en: 'Every workout transforms you into a better version.',
        },
        {
          tr: 'Spor yapmak, kendine verdiğin bir s\xf6zd\xfcr.',
          en: 'Exercise is a promise you make to yourself.',
        },
        { tr: 'Her g\xfcn biraz daha g\xfc\xe7l\xfc ol.', en: 'Get a little stronger every day.' },
        {
          tr: 'V\xfccudunun sınırlarını keşfet, sonra onları aş.',
          en: "Discover your body's limits, then exceed them.",
        },
        {
          tr: 'Spor yapmak, zihinsel g\xfcc\xfc de geliştirir.',
          en: 'Exercise also develops mental strength.',
        },
        {
          tr: 'G\xfc\xe7l\xfc olmak, zorlu g\xfcnlerde ortaya \xe7ıkar.',
          en: 'Strength shows itself in tough days.',
        },
        {
          tr: 'Her g\xfcn yeni bir başlangı\xe7, yeni bir fırsat.',
          en: 'Every day is a new beginning, a new opportunity.',
        },
        {
          tr: 'Zorlu antrenmanlar, g\xfc\xe7l\xfc karakterler yaratır.',
          en: 'Tough workouts build strong characters.',
        },
        {
          tr: 'Bug\xfcn yapmadığın şey, yarın seni geride bırakır.',
          en: "What you don't do today will leave you behind tomorrow.",
        },
        {
          tr: 'V\xfccudun bir tapınaktır, ona saygı g\xf6ster.',
          en: 'Your body is a temple, respect it.',
        },
        {
          tr: 'Hedeflerin i\xe7in m\xfccadele et, pes etme.',
          en: 'Fight for your goals, never give up.',
        },
        {
          tr: 'Her g\xfcn bir fırsattır, onu değerlendir.',
          en: 'Every day is an opportunity, make the most of it.',
        },
      ];
      function s() {
        return o[Math.floor(Math.random() * o.length)];
      }
      var i = r(98661),
        l = r(78466);
      function d() {
        let { lang: e } = (0, i.Q)(),
          t = (0, l.d)(),
          [r, o] = (0, n.useState)(null),
          [d, c] = (0, n.useState)(!1),
          [u, g] = (0, n.useState)(!1),
          m = (0, n.useRef)(null),
          y = (0, n.useRef)(null);
        if (
          ((0, n.useEffect)(() => {
            (c(!0), o(s()));
            let e = setInterval(() => {
              (g(!0),
                setTimeout(() => {
                  (g(!1),
                    setTimeout(() => {
                      o(s());
                    }, 500));
                }, 2e3));
            }, 15e3);
            return () => clearInterval(e);
          }, []),
          !d || !r)
        )
          return null;
        let x = 'tr' === e ? r.tr : r.en;
        return (0, a.jsx)('div', {
          ref: m,
          className:
            'fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand/30 via-brand/25 to-brand/30 dark:from-brand/40 dark:via-brand/30 dark:to-brand/40 border-t-2 border-brand/70 dark:border-brand/80 '.concat(
              t ? 'py-2.5' : 'py-3',
              ' overflow-hidden safe-bottom shadow-2xl backdrop-blur-lg'
            ),
          children: (0, a.jsxs)('div', {
            className:
              'relative w-full h-full flex items-center justify-center min-h-[2.5rem] sm:min-h-[2.75rem]',
            children: [
              (0, a.jsx)('div', {
                className:
                  'absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-brand/30 via-brand/15 to-transparent dark:from-brand/40 dark:via-brand/20 z-10 pointer-events-none',
              }),
              (0, a.jsx)('div', {
                className:
                  'absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-brand/30 via-brand/15 to-transparent dark:from-brand/40 dark:via-brand/20 z-10 pointer-events-none',
              }),
              (0, a.jsx)('div', {
                className:
                  'absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand/80 dark:bg-brand/90 z-10 animate-pulse shadow-lg',
              }),
              (0, a.jsx)('div', {
                className:
                  'absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand/80 dark:bg-brand/90 z-10 animate-pulse shadow-lg',
                style: { animationDelay: '0.5s' },
              }),
              (0, a.jsx)('div', {
                ref: y,
                className: 'quote-ticker-marquee flex-1 flex items-center justify-center '
                  .concat(
                    t ? 'text-xs' : 'text-base',
                    ' text-gray-950 dark:text-white font-black italic '
                  )
                  .concat(u ? 'quote-ticker-glow' : '', ' drop-shadow-lg'),
                children: (0, a.jsx)('div', {
                  className: 'quote-ticker-content flex items-center h-full',
                  children: Array.from({ length: 6 }).map((e, t) =>
                    (0, a.jsxs)(
                      'span',
                      {
                        className: 'inline-flex items-center whitespace-nowrap h-full',
                        children: [
                          (0, a.jsx)('span', {
                            className: 'px-1 flex items-center h-full',
                            children: x,
                          }),
                          t < 5 &&
                            (0, a.jsx)('span', {
                              className:
                                'mx-6 sm:mx-8 opacity-70 text-brand dark:text-brand-light text-lg flex items-center h-full',
                              children: '✦',
                            }),
                        ],
                      },
                      t
                    )
                  ),
                }),
              }),
              (0, a.jsx)('div', {
                className:
                  'absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none',
              }),
            ],
          }),
        });
      }
    },
    55859: function (e, t, r) {
      'use strict';
      r.d(t, {
        ScrollToTop: function () {
          return i;
        },
      });
      var a = r(57437),
        n = r(2265),
        o = r(78466),
        s = r(98661);
      function i() {
        let [e, t] = (0, n.useState)(!1),
          [r, i] = (0, n.useState)(!1),
          l = (0, o.d)(),
          { t: d } = (0, s.Q)();
        return ((0, n.useEffect)(() => {
          i(!0);
        }, []),
        (0, n.useEffect)(() => {
          if (!r) return;
          let e = () => {
            let e = window.pageYOffset || document.documentElement.scrollTop || 0,
              r = document.documentElement.scrollHeight,
              a = window.innerHeight;
            t(r > a + 50 && (e > 30 || r > a + 150));
          };
          (e(),
            window.addEventListener('scroll', e, { passive: !0, capture: !0 }),
            window.addEventListener('wheel', e, { passive: !0 }),
            window.addEventListener('touchmove', e, { passive: !0 }),
            window.addEventListener('resize', e, { passive: !0 }));
          let a = [setTimeout(e, 100), setTimeout(e, 500), setTimeout(e, 1e3), setTimeout(e, 2e3)];
          return () => {
            (window.removeEventListener('scroll', e, !0),
              window.removeEventListener('wheel', e),
              window.removeEventListener('touchmove', e),
              window.removeEventListener('resize', e),
              a.forEach((e) => clearTimeout(e)));
          };
        }, [r]),
        r)
          ? (0, a.jsx)('div', {
              className: 'fixed '
                .concat(
                  l ? 'bottom-52' : 'bottom-48',
                  ' right-4 sm:right-6 z-[99999] transition-all duration-500 ease-in-out '
                )
                .concat(
                  e
                    ? 'opacity-100 pointer-events-auto translate-y-0 scale-100'
                    : 'opacity-0 pointer-events-none translate-y-4 scale-90'
                ),
              style: {
                willChange: 'opacity, transform',
                position: 'fixed',
                visibility: e ? 'visible' : 'hidden',
              },
              children: (0, a.jsxs)('button', {
                onClick: () => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                },
                className: ''
                  .concat(
                    l ? 'w-16 h-16' : 'w-20 h-20',
                    ' rounded-full bg-gradient-to-br from-brand via-brand-dark to-brand text-white shadow-2xl hover:shadow-brand/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center '
                  )
                  .concat(
                    l ? 'touch-feedback mobile-press' : '',
                    ' border-4 border-white/40 dark:border-white/30 animate-bounce-subtle relative overflow-visible'
                  ),
                'aria-label': d('scrollToTop') || 'Scroll to top',
                title: d('scrollToTop') || 'Scroll to top',
                children: [
                  (0, a.jsx)('span', {
                    className: ''.concat(
                      l ? 'text-3xl' : 'text-4xl',
                      ' font-black drop-shadow-2xl relative z-10'
                    ),
                    children: '↑',
                  }),
                  (0, a.jsx)('div', {
                    className:
                      'absolute inset-0 rounded-full bg-brand/50 blur-xl -z-10 animate-pulse',
                  }),
                  (0, a.jsx)('div', {
                    className:
                      'absolute inset-0 rounded-full bg-brand/30 blur-2xl -z-20 animate-pulse',
                    style: { animationDelay: '0.5s' },
                  }),
                  (0, a.jsx)('div', {
                    className:
                      'absolute inset-0 rounded-full border-4 border-brand/60 animate-ping opacity-50 -z-30',
                  }),
                  (0, a.jsx)('div', {
                    className:
                      'absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50',
                  }),
                ],
              }),
            })
          : null;
      }
    },
    76564: function (e, t, r) {
      'use strict';
      r.d(t, {
        a: function () {
          return m;
        },
      });
      var a = r(2265),
        n = r(60532),
        o = r(82148),
        s = r(38471);
      async function i(e, t) {
        if (!n.I8) throw Error('Firebase auth not initialized');
        let r = (await (0, o.e5)(n.I8, e, t)).user;
        return (
          s.L.setUserId(r.uid),
          { uid: r.uid, email: r.email, displayName: r.displayName, photoURL: r.photoURL }
        );
      }
      async function l(e, t, r) {
        if (!n.I8) throw Error('Firebase auth not initialized');
        let a = (await (0, o.Xb)(n.I8, e, t)).user;
        return (
          r && n.I8.currentUser && (await (0, o.ck)(n.I8.currentUser, { displayName: r })),
          s.L.setUserId(a.uid),
          { uid: a.uid, email: a.email, displayName: r || a.displayName, photoURL: a.photoURL }
        );
      }
      async function d() {
        if (!n.I8) throw Error('Firebase auth not initialized');
        try {
          let e = new o.hJ();
          (e.addScope('profile'), e.addScope('email'));
          let t = (await (0, o.rh)(n.I8, e)).user;
          return (
            s.L.setUserId(t.uid),
            { uid: t.uid, email: t.email, displayName: t.displayName, photoURL: t.photoURL }
          );
        } catch (o) {
          var e, t, r;
          if ((null == o ? void 0 : o.code) === 'auth/popup-closed-by-user')
            throw Error('Popup closed by user');
          if ((null == o ? void 0 : o.code) === 'auth/popup-blocked')
            throw Error('Popup blocked by browser');
          let a =
              (null == o ? void 0 : o.message) ||
              (null == o ? void 0 : null === (e = o.error) || void 0 === e ? void 0 : e.message) ||
              '',
            n =
              (null == o ? void 0 : o.code) ||
              (null == o ? void 0 : null === (t = o.error) || void 0 === t ? void 0 : t.code) ||
              '';
          if (
            a.includes('CONFIGURATION_NOT_FOUND') ||
            'CONFIGURATION_NOT_FOUND' === n ||
            a.includes('configuration not found') ||
            ((null == o ? void 0 : null === (r = o.error) || void 0 === r ? void 0 : r.errors) &&
              o.error.errors.some((e) => 'CONFIGURATION_NOT_FOUND' === e.message))
          )
            throw Error(
              'GOOGLE_SIGNIN_NOT_ENABLED: Google Sign-In is not enabled in Firebase Console. Please go to Firebase Console → Authentication → Sign-in method → Google → Enable → Save'
            );
          throw o;
        }
      }
      async function c() {
        if (!n.I8) throw Error('Firebase auth not initialized');
        (await (0, o.w7)(n.I8), s.L.setUserId(null), s.L.cleanup());
      }
      async function u(e) {
        if (!n.I8) throw Error('Firebase auth not initialized');
        await (0, o.LS)(n.I8, e);
      }
      function g(e) {
        return e
          ? { uid: e.uid, email: e.email, displayName: e.displayName, photoURL: e.photoURL }
          : null;
      }
      function m() {
        let [e, t] = (0, a.useState)(null),
          [r, m] = (0, a.useState)(!0),
          [y, x] = (0, a.useState)(null),
          h = (0, n.Wn)();
        (0, a.useEffect)(() => {
          if (!h) {
            m(!1);
            return;
          }
          let e = setTimeout(() => {
            var e;
            let r = (null === n.I8 || void 0 === n.I8 ? void 0 : n.I8.currentUser) || null;
            (r && t(g(r)), m(!1));
            let a =
              ((e = (e) => {
                (t(e), m(!1));
              }),
              n.I8
                ? (0, o.Aj)(n.I8, (t) => {
                    t ? (s.L.setUserId(t.uid), e(g(t))) : (s.L.setUserId(null), e(null));
                  })
                : () => {});
            return () => {
              a();
            };
          }, 100);
          return () => {
            clearTimeout(e);
          };
        }, [h]);
        let p = (0, a.useCallback)(async (e, r) => {
            try {
              (x(null), m(!0));
              let a = await i(e, r);
              return (t(a), a);
            } catch (e) {
              throw (x(e instanceof Error ? e.message : 'Login failed'), e);
            } finally {
              m(!1);
            }
          }, []),
          b = (0, a.useCallback)(async (e, r, a) => {
            try {
              (x(null), m(!0));
              let n = await l(e, r, a);
              return (t(n), n);
            } catch (e) {
              throw (x(e instanceof Error ? e.message : 'Registration failed'), e);
            } finally {
              m(!1);
            }
          }, []);
        return {
          user: e,
          loading: r,
          error: y,
          isAuthenticated: !!e,
          isConfigured: h,
          login: p,
          register: b,
          loginWithGoogle: (0, a.useCallback)(async () => {
            try {
              (x(null), m(!0));
              let e = await d();
              return (t(e), e);
            } catch (e) {
              throw (x(e instanceof Error ? e.message : 'Google login failed'), e);
            } finally {
              m(!1);
            }
          }, []),
          logout: (0, a.useCallback)(async () => {
            try {
              (x(null), await c(), t(null));
            } catch (e) {
              throw (x(e instanceof Error ? e.message : 'Logout failed'), e);
            }
          }, []),
          resetPasswordEmail: (0, a.useCallback)(async (e) => {
            try {
              (x(null), await u(e));
            } catch (e) {
              throw (x(e instanceof Error ? e.message : 'Password reset failed'), e);
            }
          }, []),
        };
      }
    },
    6863: function (e, t, r) {
      'use strict';
      r.d(t, {
        V: function () {
          return s;
        },
      });
      var a = r(2265),
        n = r(38471),
        o = r(21903);
      function s() {
        let { isOnline: e } = (0, o.k)(),
          [t, r] = (0, a.useState)({
            status: 'idle',
            lastSyncAt: null,
            error: null,
            pendingChanges: 0,
          }),
          s = n.L.isConfigured(),
          i = (0, a.useCallback)(function (e) {
            let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
            r((r) => ({ ...r, status: e, error: t }));
          }, []),
          l = (0, a.useCallback)(
            async (t) => {
              if (!s || !e) {
                i('offline');
                return;
              }
              try {
                (i('syncing'),
                  await n.L.uploadToCloud(t),
                  i('synced'),
                  r((e) => ({ ...e, lastSyncAt: new Date(), pendingChanges: 0 })));
              } catch (e) {
                i('error', e instanceof Error ? e.message : 'Sync failed');
              }
            },
            [s, e, i]
          ),
          d = (0, a.useCallback)(async () => {
            if (!s || !e) return (i('offline'), null);
            try {
              i('syncing');
              let e = await n.L.downloadFromCloud();
              return (i('synced'), r((e) => ({ ...e, lastSyncAt: new Date() })), e);
            } catch (e) {
              return (i('error', e instanceof Error ? e.message : 'Sync failed'), null);
            }
          }, [s, e, i]);
        return (
          (0, a.useEffect)(() => {
            e || 'syncing' !== t.status || i('offline');
          }, [e, t.status, i]),
          { syncState: t, syncToCloud: l, syncFromCloud: d, isConfigured: s, isOnline: e }
        );
      }
    },
    21903: function (e, t, r) {
      'use strict';
      r.d(t, {
        k: function () {
          return n;
        },
      });
      var a = r(2265);
      function n() {
        let [e, t] = (0, a.useState)(() => navigator.onLine);
        return (
          (0, a.useEffect)(() => {
            let e = () => t(!0),
              r = () => t(!1);
            return (
              window.addEventListener('online', e),
              window.addEventListener('offline', r),
              () => {
                (window.removeEventListener('online', e), window.removeEventListener('offline', r));
              }
            );
          }, []),
          { isOnline: e, isOffline: !e }
        );
      }
    },
    38471: function (e, t, r) {
      'use strict';
      r.d(t, {
        L: function () {
          return s;
        },
      });
      var a = r(60532),
        n = r(5978);
      class o {
        setUserId(e) {
          this.userId = e;
        }
        getUserId() {
          return this.userId;
        }
        isConfigured() {
          return !!((0, a.Wn)() && this.userId);
        }
        getUserDocRef() {
          if (!this.userId || !a.db)
            throw Error('Firebase not configured or user not authenticated');
          return (0, n.JU)(a.db, 'users', this.userId);
        }
        async uploadToCloud(e) {
          if (!this.isConfigured()) throw Error('Cloud sync not configured');
          try {
            let t = this.getUserDocRef(),
              r = { lastModified: new Date(), version: Date.now(), userId: this.userId },
              a = {
                activities: e.activities,
                settings: e.settings,
                badges: e.badges,
                challenges: e.challenges,
                metadata: r,
              };
            await (0, n.pl)(t, { ...a, metadata: { ...r, lastModified: (0, n.Bt)() } });
          } catch (e) {
            throw (console.error('Failed to upload to cloud:', e), e);
          }
        }
        async downloadFromCloud() {
          if (!this.isConfigured()) throw Error('Cloud sync not configured');
          try {
            var e, t;
            let r = this.getUserDocRef(),
              a = await (0, n.QT)(r);
            if (!a.exists()) return null;
            let o = a.data(),
              s = null === (e = o.metadata) || void 0 === e ? void 0 : e.lastModified;
            return {
              activities: o.activities || [],
              settings: o.settings || null,
              badges: o.badges || [],
              challenges: o.challenges || [],
              metadata: {
                lastModified: s ? s.toDate() : new Date(),
                version: (null === (t = o.metadata) || void 0 === t ? void 0 : t.version) || 0,
                userId: this.userId,
              },
            };
          } catch (e) {
            throw (console.error('Failed to download from cloud:', e), e);
          }
        }
        subscribeToCloud(e) {
          if (!this.isConfigured()) return () => {};
          try {
            let t = this.getUserDocRef(),
              r = (0, n.cf)(
                t,
                (t) => {
                  if (t.exists()) {
                    var r, a;
                    let n = t.data(),
                      o = null === (r = n.metadata) || void 0 === r ? void 0 : r.lastModified;
                    e({
                      activities: n.activities || [],
                      settings: n.settings || null,
                      badges: n.badges || [],
                      challenges: n.challenges || [],
                      metadata: {
                        lastModified: o ? o.toDate() : new Date(),
                        version:
                          (null === (a = n.metadata) || void 0 === a ? void 0 : a.version) || 0,
                        userId: this.userId,
                      },
                    });
                  } else e(null);
                },
                (t) => {
                  (console.error('Cloud sync subscription error:', t), e(null));
                }
              ),
              a = 'sync-'.concat(Date.now());
            return (
              this.syncListeners.set(a, r),
              () => {
                (r(), this.syncListeners.delete(a));
              }
            );
          } catch (e) {
            return (console.error('Failed to subscribe to cloud:', e), () => {});
          }
        }
        cleanup() {
          (this.syncListeners.forEach((e) => e()), this.syncListeners.clear());
        }
        constructor() {
          ((this.userId = null), (this.syncListeners = new Map()));
        }
      }
      let s = new o();
    },
    60532: function (e, t, r) {
      'use strict';
      r.d(t, {
        I8: function () {
          return l;
        },
        Wn: function () {
          return c;
        },
        db: function () {
          return d;
        },
      });
      var a = r(738),
        n = r(82148),
        o = r(5978);
      let s = {
          apiKey: 'AIzaSyCcTFviw8VTA1eVaYpxyIktcwKGQHJkfMU',
          authDomain: 'sporttrack-c3b18.firebaseapp.com',
          projectId: 'sporttrack-c3b18',
          storageBucket: 'sporttrack-c3b18.firebasestorage.app',
          messagingSenderId: '816124129314',
          appId: '1:816124129314:web:ab408fc33d4927f04dda7b',
          measurementId: 'G-NCF59DNNEF',
        },
        i = null,
        l = null,
        d = null;
      if (s.apiKey && s.projectId && '' !== s.apiKey && '' !== s.projectId) {
        if (0 === (0, a.C6)().length)
          try {
            ((i = (0, a.ZF)(s)), (l = (0, n.v0)(i)), (d = (0, o.ad)(i)));
          } catch (e) {
            (console.error('Firebase initialization error:', e),
              (i = null),
              (l = null),
              (d = null));
          }
        else ((i = (0, a.C6)()[0]), (l = (0, n.v0)(i)), (d = (0, o.ad)(i)));
      }
      let c = () => !!i && !!l && !!d;
    },
    2778: function () {},
  },
  function (e) {
    (e.O(0, [2461, 1324, 3609, 6317, 4609, 9750, 1592, 2174, 9129, 2971, 2117, 1744], function () {
      return e((e.s = 41550));
    }),
      (_N_E = e.O()));
  },
]);
