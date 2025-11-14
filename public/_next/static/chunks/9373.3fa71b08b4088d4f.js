'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [9373],
  {
    49373: function (e, t, r) {
      (r.r(t),
        r.d(t, {
          ActivityPieChart: function () {
            return v;
          },
        }));
      var n = r(57437),
        a = r(2265),
        c = r(91436),
        l = r(86810),
        i = r(10062),
        o = r(20407),
        u = r(78155),
        s = r(53250),
        d = r(98661),
        h = r(14258),
        f = r(78466);
      let b = [
        '#0ea5e9',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#ec4899',
        '#06b6d4',
        '#84cc16',
        '#f97316',
        '#6366f1',
      ];
      function v(e) {
        let { activities: t } = e,
          { lang: r } = (0, d.Q)(),
          v = (0, f.d)(),
          x = (0, a.useMemo)(() => {
            let e = new Map();
            for (let n of t) {
              let t = n.activityKey,
                a = e.get(t);
              a
                ? ((a.value += n.points), (a.count += 1))
                : e.set(t, { name: (0, h.Xr)(n, r), value: n.points, count: 1 });
            }
            return Array.from(e.values()).sort((e, t) => t.value - e.value);
          }, [t, r]);
        return 0 === x.length
          ? (0, n.jsx)('div', {
              className: 'flex items-center justify-center h-64 text-gray-500',
              children: 'tr' === r ? 'Yeterli veri yok' : 'Not enough data',
            })
          : (0, n.jsx)(c.h, {
              width: '100%',
              height: v ? 300 : 400,
              children: (0, n.jsxs)(l.u, {
                children: [
                  (0, n.jsx)(i.b, {
                    data: x,
                    cx: '50%',
                    cy: '50%',
                    labelLine: !1,
                    label: (e) =>
                      !e.percent || e.percent < 0.05
                        ? ''
                        : ''.concat(e.name || '', ': ').concat((100 * e.percent).toFixed(0), '%'),
                    outerRadius: v ? 80 : 120,
                    fill: '#8884d8',
                    dataKey: 'value',
                    children: x.map((e, t) =>
                      (0, n.jsx)(o.b, { fill: b[t % b.length] }, 'cell-'.concat(t))
                    ),
                  }),
                  (0, n.jsx)(u.u, {
                    contentStyle: {
                      backgroundColor: 'var(--tw-bg-white)',
                      border: '1px solid var(--tw-border-gray-200)',
                      borderRadius: '0.5rem',
                    },
                    labelStyle: { color: 'var(--tw-text-gray-900)' },
                  }),
                  (0, n.jsx)(s.D, {
                    verticalAlign: 'bottom',
                    height: 36,
                    formatter: (e) => {
                      let t = x.find((t) => t.name === e);
                      return t ? ''.concat(e, ' (').concat(t.count, 'x)') : e;
                    },
                  }),
                ],
              }),
            });
      }
      window.innerWidth;
    },
  },
]);
