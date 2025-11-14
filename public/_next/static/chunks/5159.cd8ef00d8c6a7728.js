'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [5159],
  {
    95159: function (t, e, r) {
      (r.r(e),
        r.d(e, {
          TrendChart: function () {
            return j;
          },
        }));
      var o = r(57437),
        a = r(2265),
        s = r(91436),
        n = r(21156),
        l = r(56940),
        i = r(97059),
        d = r(62994),
        c = r(78155),
        u = r(53250),
        h = r(55487),
        k = r(56942),
        x = r(5341),
        f = r(34479),
        b = r(8608),
        g = r(71598),
        m = r(98661),
        y = r(60936),
        p = r(78466);
      function j(t) {
        let { activities: e, target: r, days: j } = t,
          { lang: w } = (0, m.Q)(),
          C = (0, p.d)(),
          v = 'tr' === w ? b.tr : g._,
          M = (0, a.useMemo)(() => {
            let t = (0, k.b)(new Date()),
              o = [];
            for (let a = j - 1; a >= 0; a--) {
              let s = (0, x.k)(t, a),
                n = s.toISOString(),
                l = (0, k.b)(s),
                i = e
                  .filter((t) => (0, k.b)((0, y.D)(t.performedAt)).getTime() === l.getTime())
                  .reduce((t, e) => t + e.points, 0);
              o.push({
                date: n,
                points: i,
                target: r,
                dateLabel: (0, f.WU)(s, 7 === j ? 'EEE' : 30 === j ? 'd MMM' : 'MMM d', {
                  locale: v,
                }),
              });
            }
            return o;
          }, [e, r, j, v]);
        return 0 === M.length
          ? (0, o.jsx)('div', {
              className: 'flex items-center justify-center h-64 text-gray-500',
              children: 'tr' === w ? 'Yeterli veri yok' : 'Not enough data',
            })
          : (0, o.jsx)(s.h, {
              width: '100%',
              height: C ? 250 : 300,
              children: (0, o.jsxs)(n.w, {
                data: M,
                margin: { top: 5, right: 10, left: 0, bottom: 5 },
                children: [
                  (0, o.jsx)(l.q, {
                    strokeDasharray: '3 3',
                    stroke: 'currentColor',
                    className: 'opacity-30',
                  }),
                  (0, o.jsx)(i.K, {
                    dataKey: 'dateLabel',
                    stroke: 'currentColor',
                    className: 'text-xs',
                    tick: { fill: 'currentColor', fontSize: 12 },
                  }),
                  (0, o.jsx)(d.B, {
                    stroke: 'currentColor',
                    tick: { fill: 'currentColor', fontSize: 12 },
                  }),
                  (0, o.jsx)(c.u, {
                    contentStyle: {
                      backgroundColor: 'var(--tw-bg-white)',
                      border: '1px solid var(--tw-border-gray-200)',
                      borderRadius: '0.5rem',
                    },
                    labelStyle: { color: 'var(--tw-text-gray-900)' },
                  }),
                  (0, o.jsx)(u.D, {}),
                  (0, o.jsx)(h.x, {
                    type: 'monotone',
                    dataKey: 'points',
                    stroke: '#0ea5e9',
                    strokeWidth: 2,
                    dot: { r: 4 },
                    activeDot: { r: 6 },
                    name: 'tr' === w ? 'Puanlar' : 'Points',
                  }),
                  (0, o.jsx)(h.x, {
                    type: 'monotone',
                    dataKey: 'target',
                    stroke: '#10b981',
                    strokeWidth: 2,
                    strokeDasharray: '5 5',
                    dot: !1,
                    name: 'tr' === w ? 'Hedef' : 'Target',
                  }),
                ],
              }),
            });
      }
    },
  },
]);
