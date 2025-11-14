'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [4719],
  {
    53250: function (e, t, r) {
      r.d(t, {
        D: function () {
          return T;
        },
      });
      var n = r(2265),
        i = r(54887),
        o = r(19493),
        l = r(61994),
        a = r(48777),
        c = r(14870),
        u = r(41637),
        s = r(40130);
      function f() {
        return (f = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function h(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          (t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n));
        }
        return r;
      }
      var d = {
        align: 'center',
        iconSize: 14,
        inactiveColor: '#ccc',
        layout: 'horizontal',
        verticalAlign: 'middle',
      };
      function p(e) {
        var t,
          { data: r, iconType: i, inactiveColor: o } = e,
          l = 32 / 6,
          a = 32 / 3,
          u = r.inactive ? o : r.color,
          s = null != i ? i : r.type;
        if ('none' === s) return null;
        if ('plainline' === s)
          return n.createElement('line', {
            strokeWidth: 4,
            fill: 'none',
            stroke: u,
            strokeDasharray: null === (t = r.payload) || void 0 === t ? void 0 : t.strokeDasharray,
            x1: 0,
            y1: 16,
            x2: 32,
            y2: 16,
            className: 'recharts-legend-icon',
          });
        if ('line' === s)
          return n.createElement('path', {
            strokeWidth: 4,
            fill: 'none',
            stroke: u,
            d: 'M0,'
              .concat(16, 'h')
              .concat(a, '\n            A')
              .concat(l, ',')
              .concat(l, ',0,1,1,')
              .concat(2 * a, ',')
              .concat(16, '\n            H')
              .concat(32, 'M')
              .concat(2 * a, ',')
              .concat(16, '\n            A')
              .concat(l, ',')
              .concat(l, ',0,1,1,')
              .concat(a, ',')
              .concat(16),
            className: 'recharts-legend-icon',
          });
        if ('rect' === s)
          return n.createElement('path', {
            stroke: 'none',
            fill: u,
            d: 'M0,'.concat(4, 'h').concat(32, 'v').concat(24, 'h').concat(-32, 'z'),
            className: 'recharts-legend-icon',
          });
        if (n.isValidElement(r.legendIcon)) {
          var f = (function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? h(Object(r), !0).forEach(function (t) {
                    var n, i;
                    ((n = t),
                      (i = r[t]),
                      (n = (function (e) {
                        var t = (function (e, t) {
                          if ('object' != typeof e || !e) return e;
                          var r = e[Symbol.toPrimitive];
                          if (void 0 !== r) {
                            var n = r.call(e, t || 'default');
                            if ('object' != typeof n) return n;
                            throw TypeError('@@toPrimitive must return a primitive value.');
                          }
                          return ('string' === t ? String : Number)(e);
                        })(e, 'string');
                        return 'symbol' == typeof t ? t : t + '';
                      })(n)) in e
                        ? Object.defineProperty(e, n, {
                            value: i,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                          })
                        : (e[n] = i));
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
                  : h(Object(r)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                    });
            }
            return e;
          })({}, r);
          return (delete f.legendIcon, n.cloneElement(r.legendIcon, f));
        }
        return n.createElement(c.v, {
          fill: u,
          cx: 16,
          cy: 16,
          size: 32,
          sizeType: 'diameter',
          type: s,
        });
      }
      function g(e) {
        var { payload: t, iconSize: r, layout: i, formatter: o, inactiveColor: c, iconType: s } = e,
          h = { x: 0, y: 0, width: 32, height: 32 },
          d = { display: 'horizontal' === i ? 'inline-block' : 'block', marginRight: 10 },
          g = { display: 'inline-block', verticalAlign: 'middle', marginRight: 4 };
        return t.map((t, i) => {
          var v = t.formatter || o,
            y = (0, l.W)({
              'recharts-legend-item': !0,
              ['legend-item-'.concat(i)]: !0,
              inactive: t.inactive,
            });
          if ('none' === t.type) return null;
          var m = t.inactive ? c : t.color,
            b = v ? v(t.value, t, i) : t.value;
          return n.createElement(
            'li',
            f({ className: y, style: d, key: 'legend-item-'.concat(i) }, (0, u.bw)(e, t, i)),
            n.createElement(
              a.T,
              {
                width: r,
                height: r,
                viewBox: h,
                style: g,
                'aria-label': ''.concat(b, ' legend icon'),
              },
              n.createElement(p, { data: t, iconType: s, inactiveColor: c })
            ),
            n.createElement(
              'span',
              { className: 'recharts-legend-item-text', style: { color: m } },
              b
            )
          );
        });
      }
      var v = (e) => {
          var t = (0, s.j)(e, d),
            { payload: r, layout: i, align: o } = t;
          return r && r.length
            ? n.createElement(
                'ul',
                {
                  className: 'recharts-default-legend',
                  style: { padding: 0, margin: 0, textAlign: 'horizontal' === i ? o : 'left' },
                },
                n.createElement(g, f({}, t, { payload: r }))
              )
            : null;
        },
        y = r(16630),
        m = r(93528),
        b = r(39040),
        O = r(85898),
        j = r(70030),
        w = r(35953),
        E = r(32738),
        P = ['contextPayload'];
      function x() {
        return (x = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function k(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          (t &&
            (n = n.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            r.push.apply(r, n));
        }
        return r;
      }
      function S(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? k(Object(r), !0).forEach(function (t) {
                var n, i;
                ((n = t),
                  (i = r[t]),
                  (n = (function (e) {
                    var t = (function (e, t) {
                      if ('object' != typeof e || !e) return e;
                      var r = e[Symbol.toPrimitive];
                      if (void 0 !== r) {
                        var n = r.call(e, t || 'default');
                        if ('object' != typeof n) return n;
                        throw TypeError('@@toPrimitive must return a primitive value.');
                      }
                      return ('string' === t ? String : Number)(e);
                    })(e, 'string');
                    return 'symbol' == typeof t ? t : t + '';
                  })(n)) in e
                    ? Object.defineProperty(e, n, {
                        value: i,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[n] = i));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : k(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      function z(e) {
        return e.value;
      }
      function N(e) {
        var { contextPayload: t } = e,
          r = (function (e, t) {
            if (null == e) return {};
            var r,
              n,
              i = (function (e, t) {
                if (null == e) return {};
                var r = {};
                for (var n in e)
                  if ({}.hasOwnProperty.call(e, n)) {
                    if (-1 !== t.indexOf(n)) continue;
                    r[n] = e[n];
                  }
                return r;
              })(e, t);
            if (Object.getOwnPropertySymbols) {
              var o = Object.getOwnPropertySymbols(e);
              for (n = 0; n < o.length; n++)
                ((r = o[n]),
                  -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
            }
            return i;
          })(e, P),
          i = (0, m.z)(t, e.payloadUniqBy, z),
          o = S(S({}, r), {}, { payload: i });
        return n.isValidElement(e.content)
          ? n.cloneElement(e.content, o)
          : 'function' == typeof e.content
            ? n.createElement(e.content, o)
            : n.createElement(v, o);
      }
      function D(e) {
        var t = (0, b.T)();
        return (
          (0, n.useEffect)(() => {
            t((0, E.ci)(e));
          }, [t, e]),
          null
        );
      }
      function C(e) {
        var t = (0, b.T)();
        return (
          (0, n.useEffect)(
            () => (
              t((0, E.gz)(e)),
              () => {
                t((0, E.gz)({ width: 0, height: 0 }));
              }
            ),
            [t, e]
          ),
          null
        );
      }
      var A = {
        align: 'center',
        iconSize: 14,
        itemSorter: 'value',
        layout: 'horizontal',
        verticalAlign: 'bottom',
      };
      function T(e) {
        var t,
          r = (0, s.j)(e, A),
          l = (0, b.C)(O.E$),
          a = (0, o.l)(),
          c = (0, w.h)(),
          { width: u, height: f, wrapperStyle: h, portal: d } = r,
          [p, g] = (0, j.B)([l]),
          v = (0, w.zn)(),
          m = (0, w.Mw)();
        if (null == v || null == m) return null;
        var E = v - ((null == c ? void 0 : c.left) || 0) - ((null == c ? void 0 : c.right) || 0),
          P =
            'vertical' === (t = r.layout) && (0, y.hj)(f)
              ? { height: f }
              : 'horizontal' === t
                ? { width: u || E }
                : null,
          k = d
            ? h
            : S(
                S(
                  {
                    position: 'absolute',
                    width: (null == P ? void 0 : P.width) || u || 'auto',
                    height: (null == P ? void 0 : P.height) || f || 'auto',
                  },
                  (function (e, t, r, n, i, o) {
                    var l,
                      a,
                      { layout: c, align: u, verticalAlign: s } = t;
                    return (
                      (e &&
                        ((void 0 !== e.left && null !== e.left) ||
                          (void 0 !== e.right && null !== e.right))) ||
                        (l =
                          'center' === u && 'vertical' === c
                            ? { left: ((n || 0) - o.width) / 2 }
                            : 'right' === u
                              ? { right: (r && r.right) || 0 }
                              : { left: (r && r.left) || 0 }),
                      (e &&
                        ((void 0 !== e.top && null !== e.top) ||
                          (void 0 !== e.bottom && null !== e.bottom))) ||
                        (a =
                          'middle' === s
                            ? { top: ((i || 0) - o.height) / 2 }
                            : 'bottom' === s
                              ? { bottom: (r && r.bottom) || 0 }
                              : { top: (r && r.top) || 0 }),
                      S(S({}, l), a)
                    );
                  })(h, r, c, v, m, p)
                ),
                h
              ),
          z = null != d ? d : a;
        if (null == z || null == l) return null;
        var T = n.createElement(
          'div',
          { className: 'recharts-legend-wrapper', style: k, ref: g },
          n.createElement(D, {
            layout: r.layout,
            align: r.align,
            verticalAlign: r.verticalAlign,
            itemSorter: r.itemSorter,
          }),
          n.createElement(C, { width: p.width, height: p.height }),
          n.createElement(
            N,
            x({}, r, P, { margin: c, chartWidth: v, chartHeight: m, contextPayload: l })
          )
        );
        return (0, i.createPortal)(T, z);
      }
      T.displayName = 'Legend';
    },
    34719: function (e, t, r) {
      (r.r(t),
        r.d(t, {
          ActivityBarChart: function () {
            return m;
          },
        }));
      var n = r(57437),
        i = r(2265),
        o = r(91436),
        l = r(77031),
        a = r(56940),
        c = r(97059),
        u = r(62994),
        s = r(78155),
        f = r(53250),
        h = r(90999),
        d = r(20407),
        p = r(98661),
        g = r(14258),
        v = r(78466);
      let y = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
      function m(e) {
        let { activities: t } = e,
          { lang: r } = (0, p.Q)(),
          m = (0, v.d)(),
          b = (0, i.useMemo)(() => {
            let e = new Map();
            for (let n of t) {
              let t = n.activityKey,
                i = e.get(t);
              i
                ? ((i.points += n.points), (i.count += 1))
                : e.set(t, { label: (0, g.Xr)(n, r), points: n.points, count: 1 });
            }
            return Array.from(e.values())
              .sort((e, t) => t.points - e.points)
              .slice(0, 7);
          }, [t, r]);
        return 0 === b.length
          ? (0, n.jsx)('div', {
              className: 'flex items-center justify-center h-64 text-gray-500',
              children: 'tr' === r ? 'Yeterli veri yok' : 'Not enough data',
            })
          : (0, n.jsx)(o.h, {
              width: '100%',
              height: m ? 250 : 350,
              children: (0, n.jsxs)(l.v, {
                data: b,
                margin: { top: 5, right: 10, left: 0, bottom: 60 },
                children: [
                  (0, n.jsx)(a.q, {
                    strokeDasharray: '3 3',
                    stroke: 'currentColor',
                    className: 'opacity-30',
                  }),
                  (0, n.jsx)(c.K, {
                    dataKey: 'label',
                    angle: -45,
                    textAnchor: 'end',
                    height: 80,
                    stroke: 'currentColor',
                    tick: { fill: 'currentColor', fontSize: 11 },
                  }),
                  (0, n.jsx)(u.B, {
                    stroke: 'currentColor',
                    tick: { fill: 'currentColor', fontSize: 12 },
                  }),
                  (0, n.jsx)(s.u, {
                    contentStyle: {
                      backgroundColor: 'var(--tw-bg-white)',
                      border: '1px solid var(--tw-border-gray-200)',
                      borderRadius: '0.5rem',
                    },
                    labelStyle: { color: 'var(--tw-text-gray-900)' },
                  }),
                  (0, n.jsx)(f.D, {}),
                  (0, n.jsx)(h.$, {
                    dataKey: 'points',
                    name: 'tr' === r ? 'Toplam Puan' : 'Total Points',
                    radius: [8, 8, 0, 0],
                    children: b.map((e, t) =>
                      (0, n.jsx)(d.b, { fill: y[t % y.length] }, 'cell-'.concat(t))
                    ),
                  }),
                ],
              }),
            });
      }
    },
  },
]);
