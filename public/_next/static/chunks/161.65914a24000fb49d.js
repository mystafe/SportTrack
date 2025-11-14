'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [161],
  {
    30161: function (e, a, t) {
      (t.r(a),
        t.d(a, {
          ChallengeCard: function () {
            return h;
          },
        }));
      var n = t(57437),
        r = t(2265),
        i = t(98661),
        s = t(6013),
        o = t(34479),
        d = t(60936),
        l = t(8608),
        c = t(71598),
        m = t(78466);
      let h = (0, r.memo)(function (e) {
        let { challenge: a, onEdit: t, onDelete: r } = e,
          { t: h, lang: u } = (0, i.Q)(),
          { getChallengeProgress: y } = (0, s.B)(),
          g = y(a.id),
          k = 'tr' === u ? l.tr : c._,
          b = (0, m.d)();
        if (!g) return null;
        let f = (0, o.WU)((0, d.D)(a.startDate), 'dd MMM yyyy', { locale: k }),
          x = a.endDate ? (0, o.WU)((0, d.D)(a.endDate), 'dd MMM yyyy', { locale: k }) : null;
        return (0, n.jsxs)('div', {
          className: 'card-entrance rounded-xl border-2 '.concat(b ? 'p-3' : 'p-4', ' ').concat(
            (() => {
              switch (a.status) {
                case 'completed':
                  return 'border-green-500 bg-green-50 dark:bg-green-900/20';
                case 'failed':
                case 'expired':
                  return 'border-red-500 bg-red-50 dark:bg-red-900/20';
                default:
                  return 'border-brand bg-brand/5';
              }
            })(),
            ' transition-all duration-300 hover:shadow-xl shadow-md bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95'
          ),
          children: [
            (0, n.jsxs)('div', {
              className: 'flex items-start justify-between mb-3',
              children: [
                (0, n.jsxs)('div', {
                  className: 'flex items-center gap-2',
                  children: [
                    (0, n.jsx)('span', {
                      className: ''.concat(b ? 'text-xl' : 'text-2xl sm:text-3xl', ' emoji-bounce'),
                      children: (() => {
                        switch (a.status) {
                          case 'completed':
                            return '✅';
                          case 'failed':
                          case 'expired':
                            return '❌';
                          default:
                            return a.icon || '\uD83C\uDFAF';
                        }
                      })(),
                    }),
                    (0, n.jsxs)('div', {
                      children: [
                        (0, n.jsx)('h3', {
                          className: 'text-heading-3 text-gray-950 dark:text-white '.concat(
                            b ? 'text-sm' : ''
                          ),
                          children: a.name[u],
                        }),
                        (0, n.jsx)('p', {
                          className: 'text-label text-gray-700 dark:text-gray-300',
                          children: h('challenges.'.concat(a.type)),
                        }),
                      ],
                    }),
                  ],
                }),
                (0, n.jsxs)('div', {
                  className: 'flex items-center gap-1',
                  children: [
                    (0, n.jsx)('button', {
                      type: 'button',
                      onClick: t,
                      className: ''
                        .concat(
                          b ? 'p-2 min-h-[36px] min-w-[36px]' : 'p-1.5',
                          ' text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-110 active:scale-95 transition-all duration-200 '
                        )
                        .concat(b ? 'touch-feedback mobile-press' : ''),
                      'aria-label': h('challenges.editChallenge'),
                      children: '✏️',
                    }),
                    'daily' === a.type && a.id.startsWith('daily-')
                      ? null
                      : (0, n.jsx)('button', {
                          type: 'button',
                          onClick: r,
                          className: ''
                            .concat(
                              b ? 'p-2 min-h-[36px] min-w-[36px]' : 'p-1.5',
                              ' text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:scale-110 active:scale-95 transition-all duration-200 '
                            )
                            .concat(b ? 'touch-feedback mobile-press' : ''),
                          'aria-label': h('challenges.deleteChallenge'),
                          children: '\uD83D\uDDD1️',
                        }),
                  ],
                }),
              ],
            }),
            (0, n.jsx)('p', {
              className: 'text-body text-gray-700 dark:text-gray-300 mb-3 leading-relaxed',
              children: a.description[u],
            }),
            (0, n.jsxs)('div', {
              className: 'space-y-2',
              children: [
                (0, n.jsxs)('div', {
                  className: 'flex items-center justify-between '.concat(b ? 'text-xs' : 'text-sm'),
                  children: [
                    (0, n.jsx)('span', {
                      className: 'font-semibold text-gray-700 dark:text-gray-300',
                      children: h('challenges.progress'),
                    }),
                    (0, n.jsxs)('span', {
                      className: 'font-bold text-gray-950 dark:text-white',
                      children: [
                        g.current.toLocaleString(),
                        ' / ',
                        g.target.toLocaleString(),
                        ' ',
                        h('level.xp'),
                      ],
                    }),
                  ],
                }),
                (0, n.jsx)('div', {
                  className: 'w-full '.concat(
                    b ? 'h-2.5' : 'h-3',
                    ' bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner'
                  ),
                  children: (0, n.jsx)('div', {
                    className: 'h-full transition-all duration-500 shadow-sm '.concat(
                      'completed' === a.status
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'expired' === a.status || 'failed' === a.status
                          ? 'bg-gradient-to-r from-red-500 to-rose-500'
                          : 'bg-gradient-to-r from-brand to-brand-dark'
                    ),
                    style: { width: ''.concat(Math.min(100, g.percentage), '%') },
                  }),
                }),
                (0, n.jsxs)('div', {
                  className: 'flex items-center justify-between '.concat(
                    b ? 'text-xs' : 'text-sm',
                    ' font-semibold text-gray-600 dark:text-gray-400'
                  ),
                  children: [
                    (0, n.jsxs)('span', { children: [Math.round(g.percentage), '%'] }),
                    void 0 !== g.daysRemaining &&
                      g.daysRemaining > 0 &&
                      (0, n.jsxs)('span', {
                        children: [g.daysRemaining, ' ', h('challenges.daysRemaining')],
                      }),
                  ],
                }),
                (0, n.jsxs)('div', {
                  className: ''.concat(
                    b ? 'text-xs' : 'text-sm',
                    ' font-medium text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700'
                  ),
                  children: [f, ' ', x && '- '.concat(x)],
                }),
              ],
            }),
          ],
        });
      });
    },
    8608: function (e, a, t) {
      t.d(a, {
        tr: function () {
          return c;
        },
      });
      let n = {
        lessThanXSeconds: { one: 'bir saniyeden az', other: '{{count}} saniyeden az' },
        xSeconds: { one: '1 saniye', other: '{{count}} saniye' },
        halfAMinute: 'yarım dakika',
        lessThanXMinutes: { one: 'bir dakikadan az', other: '{{count}} dakikadan az' },
        xMinutes: { one: '1 dakika', other: '{{count}} dakika' },
        aboutXHours: { one: 'yaklaşık 1 saat', other: 'yaklaşık {{count}} saat' },
        xHours: { one: '1 saat', other: '{{count}} saat' },
        xDays: { one: '1 g\xfcn', other: '{{count}} g\xfcn' },
        aboutXWeeks: { one: 'yaklaşık 1 hafta', other: 'yaklaşık {{count}} hafta' },
        xWeeks: { one: '1 hafta', other: '{{count}} hafta' },
        aboutXMonths: { one: 'yaklaşık 1 ay', other: 'yaklaşık {{count}} ay' },
        xMonths: { one: '1 ay', other: '{{count}} ay' },
        aboutXYears: { one: 'yaklaşık 1 yıl', other: 'yaklaşık {{count}} yıl' },
        xYears: { one: '1 yıl', other: '{{count}} yıl' },
        overXYears: { one: '1 yıldan fazla', other: '{{count}} yıldan fazla' },
        almostXYears: { one: 'neredeyse 1 yıl', other: 'neredeyse {{count}} yıl' },
      };
      var r = t(12694);
      let i = {
          date: (0, r.l)({
            formats: {
              full: 'd MMMM y EEEE',
              long: 'd MMMM y',
              medium: 'd MMM y',
              short: 'dd.MM.yyyy',
            },
            defaultWidth: 'full',
          }),
          time: (0, r.l)({
            formats: {
              full: 'HH:mm:ss zzzz',
              long: 'HH:mm:ss z',
              medium: 'HH:mm:ss',
              short: 'HH:mm',
            },
            defaultWidth: 'full',
          }),
          dateTime: (0, r.l)({
            formats: {
              full: "{{date}} 'saat' {{time}}",
              long: "{{date}} 'saat' {{time}}",
              medium: '{{date}}, {{time}}',
              short: '{{date}}, {{time}}',
            },
            defaultWidth: 'full',
          }),
        },
        s = {
          lastWeek: "'ge\xe7en hafta' eeee 'saat' p",
          yesterday: "'d\xfcn saat' p",
          today: "'bug\xfcn saat' p",
          tomorrow: "'yarın saat' p",
          nextWeek: "eeee 'saat' p",
          other: 'P',
        };
      var o = t(55195);
      let d = {
        ordinalNumber: (e, a) => Number(e) + '.',
        era: (0, o.Y)({
          values: {
            narrow: ['M\xd6', 'MS'],
            abbreviated: ['M\xd6', 'MS'],
            wide: ['Milattan \xd6nce', 'Milattan Sonra'],
          },
          defaultWidth: 'wide',
        }),
        quarter: (0, o.Y)({
          values: {
            narrow: ['1', '2', '3', '4'],
            abbreviated: ['1\xc7', '2\xc7', '3\xc7', '4\xc7'],
            wide: [
              'İlk \xe7eyrek',
              'İkinci \xc7eyrek',
              '\xdc\xe7\xfcnc\xfc \xe7eyrek',
              'Son \xe7eyrek',
            ],
          },
          defaultWidth: 'wide',
          argumentCallback: (e) => Number(e) - 1,
        }),
        month: (0, o.Y)({
          values: {
            narrow: ['O', 'Ş', 'M', 'N', 'M', 'H', 'T', 'A', 'E', 'E', 'K', 'A'],
            abbreviated: [
              'Oca',
              'Şub',
              'Mar',
              'Nis',
              'May',
              'Haz',
              'Tem',
              'Ağu',
              'Eyl',
              'Eki',
              'Kas',
              'Ara',
            ],
            wide: [
              'Ocak',
              'Şubat',
              'Mart',
              'Nisan',
              'Mayıs',
              'Haziran',
              'Temmuz',
              'Ağustos',
              'Eyl\xfcl',
              'Ekim',
              'Kasım',
              'Aralık',
            ],
          },
          defaultWidth: 'wide',
        }),
        day: (0, o.Y)({
          values: {
            narrow: ['P', 'P', 'S', '\xc7', 'P', 'C', 'C'],
            short: ['Pz', 'Pt', 'Sa', '\xc7a', 'Pe', 'Cu', 'Ct'],
            abbreviated: ['Paz', 'Pzt', 'Sal', '\xc7ar', 'Per', 'Cum', 'Cts'],
            wide: ['Pazar', 'Pazartesi', 'Salı', '\xc7arşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
          },
          defaultWidth: 'wide',
        }),
        dayPeriod: (0, o.Y)({
          values: {
            narrow: {
              am: '\xf6\xf6',
              pm: '\xf6s',
              midnight: 'gy',
              noon: '\xf6',
              morning: 'sa',
              afternoon: '\xf6s',
              evening: 'ak',
              night: 'ge',
            },
            abbreviated: {
              am: '\xd6\xd6',
              pm: '\xd6S',
              midnight: 'gece yarısı',
              noon: '\xf6ğle',
              morning: 'sabah',
              afternoon: '\xf6ğleden sonra',
              evening: 'akşam',
              night: 'gece',
            },
            wide: {
              am: '\xd6.\xd6.',
              pm: '\xd6.S.',
              midnight: 'gece yarısı',
              noon: '\xf6ğle',
              morning: 'sabah',
              afternoon: '\xf6ğleden sonra',
              evening: 'akşam',
              night: 'gece',
            },
          },
          defaultWidth: 'wide',
          formattingValues: {
            narrow: {
              am: '\xf6\xf6',
              pm: '\xf6s',
              midnight: 'gy',
              noon: '\xf6',
              morning: 'sa',
              afternoon: '\xf6s',
              evening: 'ak',
              night: 'ge',
            },
            abbreviated: {
              am: '\xd6\xd6',
              pm: '\xd6S',
              midnight: 'gece yarısı',
              noon: '\xf6ğlen',
              morning: 'sabahleyin',
              afternoon: '\xf6ğleden sonra',
              evening: 'akşamleyin',
              night: 'geceleyin',
            },
            wide: {
              am: '\xf6.\xf6.',
              pm: '\xf6.s.',
              midnight: 'gece yarısı',
              noon: '\xf6ğlen',
              morning: 'sabahleyin',
              afternoon: '\xf6ğleden sonra',
              evening: 'akşamleyin',
              night: 'geceleyin',
            },
          },
          defaultFormattingWidth: 'wide',
        }),
      };
      var l = t(83922);
      let c = {
        code: 'tr',
        formatDistance: (e, a, t) => {
          let r;
          let i = n[e];
          return ((r =
            'string' == typeof i
              ? i
              : 1 === a
                ? i.one
                : i.other.replace('{{count}}', a.toString())),
          null == t ? void 0 : t.addSuffix)
            ? t.comparison && t.comparison > 0
              ? r + ' sonra'
              : r + ' \xf6nce'
            : r;
        },
        formatLong: i,
        formatRelative: (e, a, t, n) => s[e],
        localize: d,
        match: {
          ordinalNumber: (0, t(75381).y)({
            matchPattern: /^(\d+)(\.)?/i,
            parsePattern: /\d+/i,
            valueCallback: function (e) {
              return parseInt(e, 10);
            },
          }),
          era: (0, l.t)({
            matchPatterns: {
              narrow: /^(mö|ms)/i,
              abbreviated: /^(mö|ms)/i,
              wide: /^(milattan önce|milattan sonra)/i,
            },
            defaultMatchWidth: 'wide',
            parsePatterns: { any: [/(^mö|^milattan önce)/i, /(^ms|^milattan sonra)/i] },
            defaultParseWidth: 'any',
          }),
          quarter: (0, l.t)({
            matchPatterns: {
              narrow: /^[1234]/i,
              abbreviated: /^[1234]ç/i,
              wide: /^((i|İ)lk|(i|İ)kinci|üçüncü|son) çeyrek/i,
            },
            defaultMatchWidth: 'wide',
            parsePatterns: {
              any: [/1/i, /2/i, /3/i, /4/i],
              abbreviated: [/1ç/i, /2ç/i, /3ç/i, /4ç/i],
              wide: [/^(i|İ)lk çeyrek/i, /(i|İ)kinci çeyrek/i, /üçüncü çeyrek/i, /son çeyrek/i],
            },
            defaultParseWidth: 'any',
            valueCallback: (e) => e + 1,
          }),
          month: (0, l.t)({
            matchPatterns: {
              narrow: /^[oşmnhtaek]/i,
              abbreviated: /^(oca|şub|mar|nis|may|haz|tem|ağu|eyl|eki|kas|ara)/i,
              wide: /^(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/i,
            },
            defaultMatchWidth: 'wide',
            parsePatterns: {
              narrow: [
                /^o/i,
                /^ş/i,
                /^m/i,
                /^n/i,
                /^m/i,
                /^h/i,
                /^t/i,
                /^a/i,
                /^e/i,
                /^e/i,
                /^k/i,
                /^a/i,
              ],
              any: [
                /^o/i,
                /^ş/i,
                /^mar/i,
                /^n/i,
                /^may/i,
                /^h/i,
                /^t/i,
                /^ağ/i,
                /^ey/i,
                /^ek/i,
                /^k/i,
                /^ar/i,
              ],
            },
            defaultParseWidth: 'any',
          }),
          day: (0, l.t)({
            matchPatterns: {
              narrow: /^[psçc]/i,
              short: /^(pz|pt|sa|ça|pe|cu|ct)/i,
              abbreviated: /^(paz|pzt|sal|çar|per|cum|cts)/i,
              wide: /^(pazar(?!tesi)|pazartesi|salı|çarşamba|perşembe|cuma(?!rtesi)|cumartesi)/i,
            },
            defaultMatchWidth: 'wide',
            parsePatterns: {
              narrow: [/^p/i, /^p/i, /^s/i, /^ç/i, /^p/i, /^c/i, /^c/i],
              any: [/^pz/i, /^pt/i, /^sa/i, /^ça/i, /^pe/i, /^cu/i, /^ct/i],
              wide: [
                /^pazar(?!tesi)/i,
                /^pazartesi/i,
                /^salı/i,
                /^çarşamba/i,
                /^perşembe/i,
                /^cuma(?!rtesi)/i,
                /^cumartesi/i,
              ],
            },
            defaultParseWidth: 'any',
          }),
          dayPeriod: (0, l.t)({
            matchPatterns: {
              narrow: /^(öö|ös|gy|ö|sa|ös|ak|ge)/i,
              any: /^(ö\.?\s?[ös]\.?|öğleden sonra|gece yarısı|öğle|(sabah|öğ|akşam|gece)(leyin))/i,
            },
            defaultMatchWidth: 'any',
            parsePatterns: {
              any: {
                am: /^ö\.?ö\.?/i,
                pm: /^ö\.?s\.?/i,
                midnight: /^(gy|gece yarısı)/i,
                noon: /^öğ/i,
                morning: /^sa/i,
                afternoon: /^öğleden sonra/i,
                evening: /^ak/i,
                night: /^ge/i,
              },
            },
            defaultParseWidth: 'any',
          }),
        },
        options: { weekStartsOn: 1, firstWeekContainsDate: 1 },
      };
    },
  },
]);
