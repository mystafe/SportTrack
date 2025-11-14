'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [3265],
  {
    86810: function (e, t, n) {
      n.d(t, {
        u: function () {
          return O;
        },
      });
      var r = n(2265),
        a = n(31057),
        i = n(1769),
        l = n(1196),
        o = n(87235),
        c = n(15317),
        u = n(39040),
        s = n(27410);
      function f(e) {
        var t = (0, u.T)();
        return (
          (0, r.useEffect)(() => {
            t((0, s.a)(e));
          }, [t, e]),
          null
        );
      }
      var d = n(37274),
        p = n(40130),
        m = ['layout'];
      function v() {
        return (v = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }).apply(null, arguments);
      }
      var y = {
          accessibilityLayer: !0,
          stackOffset: 'none',
          barCategoryGap: '10%',
          barGap: 4,
          margin: { top: 5, right: 5, bottom: 5, left: 5 },
          reverseStackOrder: !1,
          syncMethod: 'index',
          layout: 'radial',
          responsive: !1,
        },
        g = (0, r.forwardRef)(function (e, t) {
          var n,
            a = (0, p.j)(e.categoricalChartProps, y),
            { layout: u } = a,
            s = (function (e, t) {
              if (null == e) return {};
              var n,
                r,
                a = (function (e, t) {
                  if (null == e) return {};
                  var n = {};
                  for (var r in e)
                    if ({}.hasOwnProperty.call(e, r)) {
                      if (-1 !== t.indexOf(r)) continue;
                      n[r] = e[r];
                    }
                  return n;
                })(e, t);
              if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(e);
                for (r = 0; r < i.length; r++)
                  ((n = i[r]),
                    -1 === t.indexOf(n) && {}.propertyIsEnumerable.call(e, n) && (a[n] = e[n]));
              }
              return a;
            })(a, m),
            {
              chartName: g,
              defaultTooltipEventType: b,
              validateTooltipEventTypes: h,
              tooltipPayloadSearcher: O,
            } = e;
          return r.createElement(
            i.M,
            {
              preloadedState: {
                options: {
                  chartName: g,
                  defaultTooltipEventType: b,
                  validateTooltipEventTypes: h,
                  tooltipPayloadSearcher: O,
                  eventEmitter: void 0,
                },
              },
              reduxStoreName: null !== (n = a.id) && void 0 !== n ? n : g,
            },
            r.createElement(l.gt, { chartData: a.data }),
            r.createElement(o.v, { layout: u, margin: a.margin }),
            r.createElement(c.b, {
              baseValue: void 0,
              accessibilityLayer: a.accessibilityLayer,
              barCategoryGap: a.barCategoryGap,
              maxBarSize: a.maxBarSize,
              stackOffset: a.stackOffset,
              barGap: a.barGap,
              barSize: a.barSize,
              syncId: a.syncId,
              syncMethod: a.syncMethod,
              className: a.className,
            }),
            r.createElement(f, {
              cx: a.cx,
              cy: a.cy,
              startAngle: a.startAngle,
              endAngle: a.endAngle,
              innerRadius: a.innerRadius,
              outerRadius: a.outerRadius,
            }),
            r.createElement(d.r, v({}, s, { ref: t }))
          );
        }),
        b = ['item'],
        h = {
          layout: 'centric',
          startAngle: 0,
          endAngle: 360,
          cx: '50%',
          cy: '50%',
          innerRadius: 0,
          outerRadius: '80%',
        },
        O = (0, r.forwardRef)((e, t) => {
          var n = (0, p.j)(e, h);
          return r.createElement(g, {
            chartName: 'PieChart',
            defaultTooltipEventType: 'item',
            validateTooltipEventTypes: b,
            tooltipPayloadSearcher: a.NL,
            categoricalChartProps: n,
            ref: t,
          });
        });
    },
    20407: function (e, t, n) {
      n.d(t, {
        b: function () {
          return r;
        },
      });
      var r = (e) => null;
      r.displayName = 'Cell';
    },
    53250: function (e, t, n) {
      n.d(t, {
        D: function () {
          return M;
        },
      });
      var r = n(2265),
        a = n(54887),
        i = n(19493),
        l = n(61994),
        o = n(48777),
        c = n(14870),
        u = n(41637),
        s = n(40130);
      function f() {
        return (f = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }).apply(null, arguments);
      }
      function d(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      var p = {
        align: 'center',
        iconSize: 14,
        inactiveColor: '#ccc',
        layout: 'horizontal',
        verticalAlign: 'middle',
      };
      function m(e) {
        var t,
          { data: n, iconType: a, inactiveColor: i } = e,
          l = 32 / 6,
          o = 32 / 3,
          u = n.inactive ? i : n.color,
          s = null != a ? a : n.type;
        if ('none' === s) return null;
        if ('plainline' === s)
          return r.createElement('line', {
            strokeWidth: 4,
            fill: 'none',
            stroke: u,
            strokeDasharray: null === (t = n.payload) || void 0 === t ? void 0 : t.strokeDasharray,
            x1: 0,
            y1: 16,
            x2: 32,
            y2: 16,
            className: 'recharts-legend-icon',
          });
        if ('line' === s)
          return r.createElement('path', {
            strokeWidth: 4,
            fill: 'none',
            stroke: u,
            d: 'M0,'
              .concat(16, 'h')
              .concat(o, '\n            A')
              .concat(l, ',')
              .concat(l, ',0,1,1,')
              .concat(2 * o, ',')
              .concat(16, '\n            H')
              .concat(32, 'M')
              .concat(2 * o, ',')
              .concat(16, '\n            A')
              .concat(l, ',')
              .concat(l, ',0,1,1,')
              .concat(o, ',')
              .concat(16),
            className: 'recharts-legend-icon',
          });
        if ('rect' === s)
          return r.createElement('path', {
            stroke: 'none',
            fill: u,
            d: 'M0,'.concat(4, 'h').concat(32, 'v').concat(24, 'h').concat(-32, 'z'),
            className: 'recharts-legend-icon',
          });
        if (r.isValidElement(n.legendIcon)) {
          var f = (function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? d(Object(n), !0).forEach(function (t) {
                    var r, a;
                    ((r = t),
                      (a = n[t]),
                      (r = (function (e) {
                        var t = (function (e, t) {
                          if ('object' != typeof e || !e) return e;
                          var n = e[Symbol.toPrimitive];
                          if (void 0 !== n) {
                            var r = n.call(e, t || 'default');
                            if ('object' != typeof r) return r;
                            throw TypeError('@@toPrimitive must return a primitive value.');
                          }
                          return ('string' === t ? String : Number)(e);
                        })(e, 'string');
                        return 'symbol' == typeof t ? t : t + '';
                      })(r)) in e
                        ? Object.defineProperty(e, r, {
                            value: a,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                          })
                        : (e[r] = a));
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                  : d(Object(n)).forEach(function (t) {
                      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                    });
            }
            return e;
          })({}, n);
          return (delete f.legendIcon, r.cloneElement(n.legendIcon, f));
        }
        return r.createElement(c.v, {
          fill: u,
          cx: 16,
          cy: 16,
          size: 32,
          sizeType: 'diameter',
          type: s,
        });
      }
      function v(e) {
        var { payload: t, iconSize: n, layout: a, formatter: i, inactiveColor: c, iconType: s } = e,
          d = { x: 0, y: 0, width: 32, height: 32 },
          p = { display: 'horizontal' === a ? 'inline-block' : 'block', marginRight: 10 },
          v = { display: 'inline-block', verticalAlign: 'middle', marginRight: 4 };
        return t.map((t, a) => {
          var y = t.formatter || i,
            g = (0, l.W)({
              'recharts-legend-item': !0,
              ['legend-item-'.concat(a)]: !0,
              inactive: t.inactive,
            });
          if ('none' === t.type) return null;
          var b = t.inactive ? c : t.color,
            h = y ? y(t.value, t, a) : t.value;
          return r.createElement(
            'li',
            f({ className: g, style: p, key: 'legend-item-'.concat(a) }, (0, u.bw)(e, t, a)),
            r.createElement(
              o.T,
              {
                width: n,
                height: n,
                viewBox: d,
                style: v,
                'aria-label': ''.concat(h, ' legend icon'),
              },
              r.createElement(m, { data: t, iconType: s, inactiveColor: c })
            ),
            r.createElement(
              'span',
              { className: 'recharts-legend-item-text', style: { color: b } },
              h
            )
          );
        });
      }
      var y = (e) => {
          var t = (0, s.j)(e, p),
            { payload: n, layout: a, align: i } = t;
          return n && n.length
            ? r.createElement(
                'ul',
                {
                  className: 'recharts-default-legend',
                  style: { padding: 0, margin: 0, textAlign: 'horizontal' === a ? i : 'left' },
                },
                r.createElement(v, f({}, t, { payload: n }))
              )
            : null;
        },
        g = n(16630),
        b = n(93528),
        h = n(39040),
        O = n(85898),
        E = n(70030),
        P = n(35953),
        j = n(32738),
        w = ['contextPayload'];
      function A() {
        return (A = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }).apply(null, arguments);
      }
      function x(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function S(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? x(Object(n), !0).forEach(function (t) {
                var r, a;
                ((r = t),
                  (a = n[t]),
                  (r = (function (e) {
                    var t = (function (e, t) {
                      if ('object' != typeof e || !e) return e;
                      var n = e[Symbol.toPrimitive];
                      if (void 0 !== n) {
                        var r = n.call(e, t || 'default');
                        if ('object' != typeof r) return r;
                        throw TypeError('@@toPrimitive must return a primitive value.');
                      }
                      return ('string' === t ? String : Number)(e);
                    })(e, 'string');
                    return 'symbol' == typeof t ? t : t + '';
                  })(r)) in e
                    ? Object.defineProperty(e, r, {
                        value: a,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[r] = a));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : x(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      function R(e) {
        return e.value;
      }
      function k(e) {
        var { contextPayload: t } = e,
          n = (function (e, t) {
            if (null == e) return {};
            var n,
              r,
              a = (function (e, t) {
                if (null == e) return {};
                var n = {};
                for (var r in e)
                  if ({}.hasOwnProperty.call(e, r)) {
                    if (-1 !== t.indexOf(r)) continue;
                    n[r] = e[r];
                  }
                return n;
              })(e, t);
            if (Object.getOwnPropertySymbols) {
              var i = Object.getOwnPropertySymbols(e);
              for (r = 0; r < i.length; r++)
                ((n = i[r]),
                  -1 === t.indexOf(n) && {}.propertyIsEnumerable.call(e, n) && (a[n] = e[n]));
            }
            return a;
          })(e, w),
          a = (0, b.z)(t, e.payloadUniqBy, R),
          i = S(S({}, n), {}, { payload: a });
        return r.isValidElement(e.content)
          ? r.cloneElement(e.content, i)
          : 'function' == typeof e.content
            ? r.createElement(e.content, i)
            : r.createElement(y, i);
      }
      function N(e) {
        var t = (0, h.T)();
        return (
          (0, r.useEffect)(() => {
            t((0, j.ci)(e));
          }, [t, e]),
          null
        );
      }
      function D(e) {
        var t = (0, h.T)();
        return (
          (0, r.useEffect)(
            () => (
              t((0, j.gz)(e)),
              () => {
                t((0, j.gz)({ width: 0, height: 0 }));
              }
            ),
            [t, e]
          ),
          null
        );
      }
      var z = {
        align: 'center',
        iconSize: 14,
        itemSorter: 'value',
        layout: 'horizontal',
        verticalAlign: 'bottom',
      };
      function M(e) {
        var t,
          n = (0, s.j)(e, z),
          l = (0, h.C)(O.E$),
          o = (0, i.l)(),
          c = (0, P.h)(),
          { width: u, height: f, wrapperStyle: d, portal: p } = n,
          [m, v] = (0, E.B)([l]),
          y = (0, P.zn)(),
          b = (0, P.Mw)();
        if (null == y || null == b) return null;
        var j = y - ((null == c ? void 0 : c.left) || 0) - ((null == c ? void 0 : c.right) || 0),
          w =
            'vertical' === (t = n.layout) && (0, g.hj)(f)
              ? { height: f }
              : 'horizontal' === t
                ? { width: u || j }
                : null,
          x = p
            ? d
            : S(
                S(
                  {
                    position: 'absolute',
                    width: (null == w ? void 0 : w.width) || u || 'auto',
                    height: (null == w ? void 0 : w.height) || f || 'auto',
                  },
                  (function (e, t, n, r, a, i) {
                    var l,
                      o,
                      { layout: c, align: u, verticalAlign: s } = t;
                    return (
                      (e &&
                        ((void 0 !== e.left && null !== e.left) ||
                          (void 0 !== e.right && null !== e.right))) ||
                        (l =
                          'center' === u && 'vertical' === c
                            ? { left: ((r || 0) - i.width) / 2 }
                            : 'right' === u
                              ? { right: (n && n.right) || 0 }
                              : { left: (n && n.left) || 0 }),
                      (e &&
                        ((void 0 !== e.top && null !== e.top) ||
                          (void 0 !== e.bottom && null !== e.bottom))) ||
                        (o =
                          'middle' === s
                            ? { top: ((a || 0) - i.height) / 2 }
                            : 'bottom' === s
                              ? { bottom: (n && n.bottom) || 0 }
                              : { top: (n && n.top) || 0 }),
                      S(S({}, l), o)
                    );
                  })(d, n, c, y, b, m)
                ),
                d
              ),
          R = null != p ? p : o;
        if (null == R || null == l) return null;
        var M = r.createElement(
          'div',
          { className: 'recharts-legend-wrapper', style: x, ref: v },
          r.createElement(N, {
            layout: n.layout,
            align: n.align,
            verticalAlign: n.verticalAlign,
            itemSorter: n.itemSorter,
          }),
          r.createElement(D, { width: m.width, height: m.height }),
          r.createElement(
            k,
            A({}, n, w, { margin: c, chartWidth: y, chartHeight: b, contextPayload: l })
          )
        );
        return (0, a.createPortal)(M, R);
      }
      M.displayName = 'Legend';
    },
    44296: function (e, t, n) {
      n.d(t, {
        Df: function () {
          return i;
        },
        nC: function () {
          return o;
        },
        oQ: function () {
          return l;
        },
      });
      var r = n(39040),
        a = n(64725),
        i = (e, t) => {
          var n = (0, r.T)();
          return (r, i) => (l) => {
            (null == e || e(r, i, l),
              n(
                (0, a.M1)({
                  activeIndex: String(i),
                  activeDataKey: t,
                  activeCoordinate: r.tooltipPosition,
                })
              ));
          };
        },
        l = (e) => {
          var t = (0, r.T)();
          return (n, r) => (i) => {
            (null == e || e(n, r, i), t((0, a.Vg)()));
          };
        },
        o = (e, t) => {
          var n = (0, r.T)();
          return (r, i) => (l) => {
            (null == e || e(r, i, l),
              n(
                (0, a.O_)({
                  activeIndex: String(i),
                  activeDataKey: t,
                  activeCoordinate: r.tooltipPosition,
                })
              ));
          };
        };
    },
    10062: function (e, t, n) {
      n.d(t, {
        b: function () {
          return ek;
        },
        w: function () {
          return ew;
        },
      });
      var r = n(2265),
        a = n(15870),
        i = n.n(a),
        l = n(61994),
        o = n(92713),
        c = n(22932),
        u = n(74653),
        s = n(49037),
        f = n(9666),
        d = n(35953),
        p = n(40304),
        m = n(56462),
        v = n(33968),
        y = (e) => e.graphicalItems.polarItems,
        g = (0, o.P1)([p.z, m.l], f.YZ),
        b = (0, o.P1)([y, f.fW, g], f.$B),
        h = (0, o.P1)([b], f.bU),
        O = (0, o.P1)([h, c.RV], f.tZ),
        E = (0, o.P1)([O, f.fW, b], f.UA);
      (0, o.P1)([O, f.fW, b], (e, t, n) =>
        n.length > 0
          ? e
              .flatMap((e) =>
                n.flatMap((n) => {
                  var r;
                  return {
                    value: (0, s.F$)(e, null !== (r = t.dataKey) && void 0 !== r ? r : n.dataKey),
                    errorDomain: [],
                  };
                })
              )
              .filter(Boolean)
          : (null == t ? void 0 : t.dataKey) != null
            ? e.map((e) => ({ value: (0, s.F$)(e, t.dataKey), errorDomain: [] }))
            : e.map((e) => ({ value: e, errorDomain: [] }))
      );
      var P = () => void 0,
        j = (0, o.P1)([O, f.fW, b, f.Qt, p.z], f.yN),
        w = (0, o.P1)([f.fW, f.KB, f.Z2, P, j, P, d.rE, p.z], f.E8),
        A = (0, o.P1)([f.fW, d.rE, O, E, v.Qw, p.z, w], f.l_),
        x = (0, o.P1)([A, f.fW, f.cV], f.vb);
      function S(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function R(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? S(Object(n), !0).forEach(function (t) {
                var r, a;
                ((r = t),
                  (a = n[t]),
                  (r = (function (e) {
                    var t = (function (e, t) {
                      if ('object' != typeof e || !e) return e;
                      var n = e[Symbol.toPrimitive];
                      if (void 0 !== n) {
                        var r = n.call(e, t || 'default');
                        if ('object' != typeof r) return r;
                        throw TypeError('@@toPrimitive must return a primitive value.');
                      }
                      return ('string' === t ? String : Number)(e);
                    })(e, 'string');
                    return 'symbol' == typeof t ? t : t + '';
                  })(r)) in e
                    ? Object.defineProperty(e, r, {
                        value: a,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[r] = a));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : S(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      (0, o.P1)([f.fW, A, x, p.z], f.kO);
      var k = (0, o.P1)([y, (e, t) => t], (e, t) =>
          e.filter((e) => 'pie' === e.type).find((e) => e.id === t)
        ),
        N = [],
        D = (e, t, n) => ((null == n ? void 0 : n.length) === 0 ? N : n),
        z = (0, o.P1)([c.RV, k, D], (e, t, n) => {
          var r,
            { chartData: a } = e;
          if (
            null != t &&
            (((r = (null == t ? void 0 : t.data) != null && t.data.length > 0 ? t.data : a) &&
              r.length) ||
              null == n ||
              (r = n.map((e) => R(R({}, t.presentationProps), e.props))),
            null != r)
          )
            return r;
        }),
        M = (0, o.P1)([z, k, D], (e, t, n) => {
          if (null != e && null != t)
            return e.map((e, r) => {
              var a,
                i,
                l = (0, s.F$)(e, t.nameKey, t.name);
              return (
                (i =
                  null != n &&
                  null !== (a = n[r]) &&
                  void 0 !== a &&
                  null !== (a = a.props) &&
                  void 0 !== a &&
                  a.fill
                    ? n[r].props.fill
                    : 'object' == typeof e && null != e && 'fill' in e
                      ? e.fill
                      : t.fill),
                { value: (0, s.hn)(l, t.dataKey), color: i, payload: e, type: t.legendType }
              );
            });
        }),
        I = (0, o.P1)([z, k, D, u.DX], (e, t, n, r) => {
          if (null != t && null != e)
            return ew({ offset: r, pieSettings: t, displayedData: e, cells: n });
        }),
        T = n(39040),
        C = n(9841),
        K = n(57165),
        W = n(58811),
        L = n(20407),
        $ = n(82944),
        B = n(34067),
        V = n(39206),
        F = n(16630),
        q = n(41637),
        G = n(11638),
        _ = n(44296),
        Y = n(35623),
        H = n(31944),
        Q = n(62658),
        U = n(78487),
        X = n(59087),
        Z = n(40130),
        J = n(24917),
        ee = n(13790),
        et = n(51221),
        en = n(9775),
        er = n(58772),
        ea = n(48002),
        ei = n(73928),
        el = ['onMouseEnter', 'onClick', 'onMouseLeave'],
        eo = ['id'],
        ec = ['id'];
      function eu(e, t) {
        if (null == e) return {};
        var n,
          r,
          a = (function (e, t) {
            if (null == e) return {};
            var n = {};
            for (var r in e)
              if ({}.hasOwnProperty.call(e, r)) {
                if (-1 !== t.indexOf(r)) continue;
                n[r] = e[r];
              }
            return n;
          })(e, t);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(e);
          for (r = 0; r < i.length; r++)
            ((n = i[r]),
              -1 === t.indexOf(n) && {}.propertyIsEnumerable.call(e, n) && (a[n] = e[n]));
        }
        return a;
      }
      function es(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function ef(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? es(Object(n), !0).forEach(function (t) {
                var r, a;
                ((r = t),
                  (a = n[t]),
                  (r = (function (e) {
                    var t = (function (e, t) {
                      if ('object' != typeof e || !e) return e;
                      var n = e[Symbol.toPrimitive];
                      if (void 0 !== n) {
                        var r = n.call(e, t || 'default');
                        if ('object' != typeof r) return r;
                        throw TypeError('@@toPrimitive must return a primitive value.');
                      }
                      return ('string' === t ? String : Number)(e);
                    })(e, 'string');
                    return 'symbol' == typeof t ? t : t + '';
                  })(r)) in e
                    ? Object.defineProperty(e, r, {
                        value: a,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[r] = a));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : es(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      function ed() {
        return (ed = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }).apply(null, arguments);
      }
      function ep(e) {
        var t = (0, r.useMemo)(() => (0, $.NN)(e.children, L.b), [e.children]),
          n = (0, T.C)((n) => M(n, e.id, t));
        return null == n ? null : r.createElement(Q.t, { legendPayload: n });
      }
      function em(e) {
        var {
          dataKey: t,
          nameKey: n,
          sectors: r,
          stroke: a,
          strokeWidth: i,
          fill: l,
          name: o,
          hide: c,
          tooltipType: u,
        } = e;
        return {
          dataDefinedOnItem: r.map((e) => e.tooltipPayload),
          positions: r.map((e) => e.tooltipPosition),
          settings: {
            stroke: a,
            strokeWidth: i,
            fill: l,
            dataKey: t,
            nameKey: n,
            name: (0, s.hn)(o, t),
            hide: c,
            type: u,
            color: l,
            unit: '',
          },
        };
      }
      var ev = (e, t) => (e > t ? 'start' : e < t ? 'end' : 'middle'),
        ey = (e, t, n) =>
          'function' == typeof t ? (0, F.h1)(t(e), n, 0.8 * n) : (0, F.h1)(t, n, 0.8 * n),
        eg = (e, t, n) => {
          var { top: r, left: a, width: i, height: l } = t,
            o = (0, V.$4)(i, l),
            c = a + (0, F.h1)(e.cx, i, i / 2),
            u = r + (0, F.h1)(e.cy, l, l / 2);
          return {
            cx: c,
            cy: u,
            innerRadius: (0, F.h1)(e.innerRadius, o, 0),
            outerRadius: ey(n, e.outerRadius, o),
            maxRadius: e.maxRadius || Math.sqrt(i * i + l * l) / 2,
          };
        },
        eb = (e, t) => (0, F.uY)(t - e) * Math.min(Math.abs(t - e), 360),
        eh = (e, t) => {
          if (r.isValidElement(e)) return r.cloneElement(e, t);
          if ('function' == typeof e) return e(t);
          var n = (0, l.W)('recharts-pie-label-line', 'boolean' != typeof e ? e.className : '');
          return r.createElement(K.H, ed({}, t, { type: 'linear', className: n }));
        },
        eO = (e, t, n) => {
          if (r.isValidElement(e)) return r.cloneElement(e, t);
          var a = n;
          if ('function' == typeof e && ((a = e(t)), r.isValidElement(a))) return a;
          var i = (0, l.W)(
            'recharts-pie-label-text',
            e && 'object' == typeof e && 'className' in e && 'string' == typeof e.className
              ? e.className
              : ''
          );
          return r.createElement(W.xv, ed({}, t, { alignmentBaseline: 'middle', className: i }), a);
        };
      function eE(e) {
        var { sectors: t, props: n, showLabels: a } = e,
          { label: i, labelLine: l, dataKey: o } = n;
        if (!a || !i || !t) return null;
        var c = (0, et.qq)(n),
          u = (0, et.qM)(i),
          f = (0, et.qM)(l),
          d =
            ('object' == typeof i &&
              'offsetRadius' in i &&
              'number' == typeof i.offsetRadius &&
              i.offsetRadius) ||
            20,
          p = t.map((e, t) => {
            var n = (e.startAngle + e.endAngle) / 2,
              a = (0, V.op)(e.cx, e.cy, e.outerRadius + d, n),
              p = ef(
                ef(ef(ef({}, c), e), {}, { stroke: 'none' }, u),
                {},
                { index: t, textAnchor: ev(a.x, e.cx) },
                a
              ),
              m = ef(
                ef(ef(ef({}, c), e), {}, { fill: 'none', stroke: e.fill }, f),
                {},
                { index: t, points: [(0, V.op)(e.cx, e.cy, e.outerRadius, n), a], key: 'line' }
              );
            return r.createElement(
              ea.$,
              {
                zIndex: ei.N.label,
                key: 'label-'
                  .concat(e.startAngle, '-')
                  .concat(e.endAngle, '-')
                  .concat(e.midAngle, '-')
                  .concat(t),
              },
              r.createElement(C.m, null, l && eh(l, m), eO(i, p, (0, s.F$)(e, o)))
            );
          });
        return r.createElement(C.m, { className: 'recharts-pie-labels' }, p);
      }
      function eP(e) {
        var { sectors: t, props: n, showLabels: a } = e,
          { label: i } = n;
        return 'object' == typeof i && null != i && 'position' in i
          ? r.createElement(er.Ly, { label: i })
          : r.createElement(eE, { sectors: t, props: n, showLabels: a });
      }
      function ej(e) {
        var { sectors: t, activeShape: n, inactiveShape: a, allOtherPieProps: i } = e,
          l = (0, T.C)(H.Ve),
          { onMouseEnter: o, onClick: c, onMouseLeave: u } = i,
          s = eu(i, el),
          f = (0, _.Df)(o, i.dataKey),
          d = (0, _.oQ)(u),
          p = (0, _.nC)(c, i.dataKey);
        return null == t || 0 === t.length
          ? null
          : r.createElement(
              r.Fragment,
              null,
              t.map((e, o) => {
                if (
                  (null == e ? void 0 : e.startAngle) === 0 &&
                  (null == e ? void 0 : e.endAngle) === 0 &&
                  1 !== t.length
                )
                  return null;
                var c = n && String(o) === l,
                  u = c ? n : l ? a : null,
                  m = ef(
                    ef({}, e),
                    {},
                    { stroke: e.stroke, tabIndex: -1, [U.Gh]: o, [U.aN]: i.dataKey }
                  );
                return r.createElement(
                  C.m,
                  ed(
                    {
                      key: 'sector-'
                        .concat(null == e ? void 0 : e.startAngle, '-')
                        .concat(null == e ? void 0 : e.endAngle, '-')
                        .concat(e.midAngle, '-')
                        .concat(o),
                      tabIndex: -1,
                      className: 'recharts-pie-sector',
                    },
                    (0, q.bw)(s, e, o),
                    { onMouseEnter: f(e, o), onMouseLeave: d(e, o), onClick: p(e, o) }
                  ),
                  r.createElement(G.b, ed({ option: u, isActive: c, shapeType: 'sector' }, m))
                );
              })
            );
      }
      function ew(e) {
        var t,
          n,
          r,
          { pieSettings: a, displayedData: i, cells: l, offset: o } = e,
          {
            cornerRadius: c,
            startAngle: u,
            endAngle: f,
            dataKey: d,
            nameKey: p,
            tooltipType: m,
          } = a,
          v = Math.abs(a.minAngle),
          y = eb(u, f),
          g = Math.abs(y),
          b = i.length <= 1 ? 0 : null !== (t = a.paddingAngle) && void 0 !== t ? t : 0,
          h = i.filter((e) => 0 !== (0, s.F$)(e, d, 0)).length,
          O = g - h * v - (g >= 360 ? h : h - 1) * b,
          E = i.reduce((e, t) => {
            var n = (0, s.F$)(t, d, 0);
            return e + ((0, F.hj)(n) ? n : 0);
          }, 0);
        return (
          E > 0 &&
            (n = i.map((e, t) => {
              var n,
                i = (0, s.F$)(e, d, 0),
                f = (0, s.F$)(e, p, t),
                g = eg(a, o, e),
                h = ((0, F.hj)(i) ? i : 0) / E,
                P = ef(ef({}, e), l && l[t] && l[t].props),
                j =
                  (n = t ? r.endAngle + (0, F.uY)(y) * b * (0 !== i ? 1 : 0) : u) +
                  (0, F.uY)(y) * ((0 !== i ? v : 0) + h * O),
                w = (n + j) / 2,
                A = (g.innerRadius + g.outerRadius) / 2,
                x = [{ name: f, value: i, payload: P, dataKey: d, type: m }],
                S = (0, V.op)(g.cx, g.cy, A, w);
              return (r = ef(
                ef(
                  ef(
                    ef({}, a.presentationProps),
                    {},
                    {
                      percent: h,
                      cornerRadius: 'string' == typeof c ? parseFloat(c) : c,
                      name: f,
                      tooltipPayload: x,
                      midAngle: w,
                      middleRadius: A,
                      tooltipPosition: S,
                    },
                    P
                  ),
                  g
                ),
                {},
                { value: i, startAngle: n, endAngle: j, payload: P, paddingAngle: (0, F.uY)(y) * b }
              ));
            })),
          n
        );
      }
      function eA(e) {
        var { showLabels: t, sectors: n, children: a } = e,
          i = (0, r.useMemo)(
            () =>
              t && n
                ? n.map((e) => ({
                    value: e.value,
                    payload: e.payload,
                    clockWise: !1,
                    parentViewBox: void 0,
                    viewBox: {
                      cx: e.cx,
                      cy: e.cy,
                      innerRadius: e.innerRadius,
                      outerRadius: e.outerRadius,
                      startAngle: e.startAngle,
                      endAngle: e.endAngle,
                      clockWise: !1,
                    },
                    fill: e.fill,
                  }))
                : [],
            [n, t]
          );
        return r.createElement(er.lD, { value: t ? i : void 0 }, a);
      }
      function ex(e) {
        var { props: t, previousSectorsRef: n } = e,
          {
            sectors: a,
            isAnimationActive: l,
            animationBegin: o,
            animationDuration: c,
            animationEasing: u,
            activeShape: s,
            inactiveShape: f,
            onAnimationStart: d,
            onAnimationEnd: p,
          } = t,
          m = (0, X.i)(t, 'recharts-pie-'),
          v = n.current,
          [y, g] = (0, r.useState)(!1),
          b = (0, r.useCallback)(() => {
            ('function' == typeof p && p(), g(!1));
          }, [p]),
          h = (0, r.useCallback)(() => {
            ('function' == typeof d && d(), g(!0));
          }, [d]);
        return r.createElement(
          eA,
          { showLabels: !y, sectors: a },
          r.createElement(
            en.H,
            {
              animationId: m,
              begin: o,
              duration: c,
              isActive: l,
              easing: u,
              onAnimationStart: h,
              onAnimationEnd: b,
              key: m,
            },
            (e) => {
              var l = [],
                o = a && a[0],
                c = null == o ? void 0 : o.startAngle;
              return (
                null == a ||
                  a.forEach((t, n) => {
                    var r = v && v[n],
                      a = n > 0 ? i()(t, 'paddingAngle', 0) : 0;
                    if (r) {
                      var o = (0, F.sX)(r.endAngle - r.startAngle, t.endAngle - t.startAngle, e),
                        u = ef(ef({}, t), {}, { startAngle: c + a, endAngle: c + o + a });
                      (l.push(u), (c = u.endAngle));
                    } else {
                      var { endAngle: s, startAngle: f } = t,
                        d = (0, F.sX)(0, s - f, e),
                        p = ef(ef({}, t), {}, { startAngle: c + a, endAngle: c + d + a });
                      (l.push(p), (c = p.endAngle));
                    }
                  }),
                (n.current = l),
                r.createElement(
                  C.m,
                  null,
                  r.createElement(ej, {
                    sectors: l,
                    activeShape: s,
                    inactiveShape: f,
                    allOtherPieProps: t,
                  })
                )
              );
            }
          ),
          r.createElement(eP, { showLabels: !y, sectors: a, props: t }),
          t.children
        );
      }
      var eS = {
        animationBegin: 400,
        animationDuration: 1500,
        animationEasing: 'ease',
        cx: '50%',
        cy: '50%',
        dataKey: 'value',
        endAngle: 360,
        fill: '#808080',
        hide: !1,
        innerRadius: 0,
        isAnimationActive: !B.x.isSsr,
        labelLine: !0,
        legendType: 'rect',
        minAngle: 0,
        nameKey: 'name',
        outerRadius: '80%',
        paddingAngle: 0,
        rootTabIndex: 0,
        startAngle: 0,
        stroke: '#fff',
        zIndex: ei.N.area,
      };
      function eR(e) {
        var { id: t } = e,
          n = eu(e, eo),
          { hide: a, className: i, rootTabIndex: o } = e,
          c = (0, r.useMemo)(() => (0, $.NN)(e.children, L.b), [e.children]),
          u = (0, T.C)((e) => I(e, t, c)),
          s = (0, r.useRef)(null),
          f = (0, l.W)('recharts-pie', i);
        return a || null == u
          ? ((s.current = null), r.createElement(C.m, { tabIndex: o, className: f }))
          : r.createElement(
              ea.$,
              { zIndex: e.zIndex },
              r.createElement(Y.k, { fn: em, args: ef(ef({}, e), {}, { sectors: u }) }),
              r.createElement(
                C.m,
                { tabIndex: o, className: f },
                r.createElement(ex, {
                  props: ef(ef({}, n), {}, { sectors: u }),
                  previousSectorsRef: s,
                })
              )
            );
      }
      function ek(e) {
        var t = (0, Z.j)(e, eS),
          { id: n } = t,
          a = eu(t, ec),
          i = (0, et.qq)(a);
        return r.createElement(J.o, { id: n, type: 'pie' }, (e) =>
          r.createElement(
            r.Fragment,
            null,
            r.createElement(ee.E, {
              type: 'pie',
              id: e,
              data: a.data,
              dataKey: a.dataKey,
              hide: a.hide,
              angleAxisId: 0,
              radiusAxisId: 0,
              name: a.name,
              nameKey: a.nameKey,
              tooltipType: a.tooltipType,
              legendType: a.legendType,
              fill: a.fill,
              cx: a.cx,
              cy: a.cy,
              startAngle: a.startAngle,
              endAngle: a.endAngle,
              paddingAngle: a.paddingAngle,
              minAngle: a.minAngle,
              innerRadius: a.innerRadius,
              outerRadius: a.outerRadius,
              cornerRadius: a.cornerRadius,
              presentationProps: i,
              maxRadius: t.maxRadius,
            }),
            r.createElement(ep, ed({}, a, { id: e })),
            r.createElement(eR, ed({}, a, { id: e }))
          )
        );
      }
      ek.displayName = 'Pie';
    },
  },
]);
