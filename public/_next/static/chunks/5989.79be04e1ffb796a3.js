'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [5989],
  {
    55487: function (e, t, r) {
      r.d(t, {
        x: function () {
          return eP;
        },
        r: function () {
          return eO;
        },
      });
      var n = r(2265),
        i = r(61994),
        a = r(9841),
        l = r(58772),
        o = r(41637),
        c = r(51221),
        u = r(16630);
      function s() {
        return (s = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      var f = (e) => {
          var { cx: t, cy: r, r: a, className: l } = e,
            f = (0, i.W)('recharts-dot', l);
          return (0, u.hj)(t) && (0, u.hj)(r) && (0, u.hj)(a)
            ? n.createElement(
                'circle',
                s({}, (0, c.qq)(e), (0, o.Ym)(e), { className: f, cx: t, cy: r, r: a })
              )
            : null;
        },
        p = r(82944),
        v = r(33414),
        d = r(48002),
        y = r(73928),
        m = ['points'];
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
      function b(e) {
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
      }
      function g() {
        return (g = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function O(e) {
        var { option: t, dotProps: r, className: a } = e;
        if ((0, n.isValidElement)(t)) return (0, n.cloneElement)(t, r);
        if ('function' == typeof t) return t(r);
        var l = (0, i.W)(a, 'boolean' != typeof t ? t.className : ''),
          o = null != r ? r : {},
          { points: c } = o,
          u = (function (e, t) {
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
              var a = Object.getOwnPropertySymbols(e);
              for (n = 0; n < a.length; n++)
                ((r = a[n]),
                  -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
            }
            return i;
          })(o, m);
        return n.createElement(f, g({}, u, { className: l }));
      }
      function P(e) {
        var {
          points: t,
          dot: r,
          className: i,
          dotClassName: l,
          dataKey: o,
          baseProps: c,
          needClip: u,
          clipPathId: s,
          zIndex: f = y.N.scatter,
        } = e;
        if (null == t || (!r && 1 !== t.length)) return null;
        var m = (0, p.W0)(r),
          h = (0, v.v)(r),
          P = t.map((e, i) => {
            var a,
              u,
              s = b(
                b(b({ r: 3 }, c), h),
                {},
                {
                  index: i,
                  cx: null !== (a = e.x) && void 0 !== a ? a : void 0,
                  cy: null !== (u = e.y) && void 0 !== u ? u : void 0,
                  dataKey: o,
                  value: e.value,
                  payload: e.payload,
                  points: t,
                }
              );
            return n.createElement(O, {
              key: 'dot-'.concat(i),
              option: r,
              dotProps: s,
              className: l,
            });
          }),
          j = {};
        return (
          u && null != s && (j.clipPath = 'url(#clipPath-'.concat(m ? '' : 'dots-').concat(s, ')')),
          n.createElement(d.$, { zIndex: f }, n.createElement(a.m, g({ className: i }, j), P))
        );
      }
      var j = r(34067),
        E = r(49037),
        w = r(39040),
        x = r(31944),
        N = r(7986);
      function A(e, t) {
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
      function k(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? A(Object(r), !0).forEach(function (t) {
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
              : A(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      var D = (e) => {
        var t,
          { point: r, childIndex: i, mainColor: l, activeDot: u, dataKey: s } = e;
        if (!1 === u || null == r.x || null == r.y) return null;
        var p = k(
          k(
            k(
              {},
              {
                index: i,
                dataKey: s,
                cx: r.x,
                cy: r.y,
                r: 4,
                fill: null != l ? l : 'none',
                strokeWidth: 2,
                stroke: '#fff',
                payload: r.payload,
                value: r.value,
              }
            ),
            (0, c.qM)(u)
          ),
          (0, o.Ym)(u)
        );
        return (
          (t = (0, n.isValidElement)(u)
            ? (0, n.cloneElement)(u, p)
            : 'function' == typeof u
              ? u(p)
              : n.createElement(f, p)),
          n.createElement(a.m, { className: 'recharts-active-dot' }, t)
        );
      };
      function S(e) {
        var {
            points: t,
            mainColor: r,
            activeDot: i,
            itemDataKey: a,
            zIndex: l = y.N.activeDot,
          } = e,
          o = (0, w.C)(x.Ve),
          c = (0, N.mE)();
        if (null == t || null == c) return null;
        var s = t.find((e) => c.includes(e.payload));
        return (0, u.Rw)(s)
          ? null
          : n.createElement(
              d.$,
              { zIndex: l },
              n.createElement(D, {
                point: s,
                childIndex: Number(o),
                mainColor: r,
                dataKey: a,
                activeDot: i,
              })
            );
      }
      var I = r(35623),
        z = r(84815),
        T = r(45702),
        C = r(35953),
        W = r(58735),
        R = r(92713),
        V = r(22932),
        L = r(9666),
        M = (e, t, r, n) => (0, L.AS)(e, 'xAxis', t, n),
        B = (e, t, r, n) => (0, L.bY)(e, 'xAxis', t, n),
        $ = (e, t, r, n) => (0, L.AS)(e, 'yAxis', r, n),
        q = (e, t, r, n) => (0, L.bY)(e, 'yAxis', r, n),
        K = (0, R.P1)([C.rE, M, $, B, q], (e, t, r, n, i) =>
          (0, E.NA)(e, 'xAxis') ? (0, E.zT)(t, n, !1) : (0, E.zT)(r, i, !1)
        );
      function F(e) {
        return 'line' === e.type;
      }
      var H = (0, R.P1)([L.bm, (e, t, r, n, i) => i], (e, t) =>
          e.filter(F).find((e) => e.id === t)
        ),
        X = (0, R.P1)([C.rE, M, $, B, q, H, K, V.hA], (e, t, r, n, i, a, l, o) => {
          var c,
            { chartData: u, dataStartIndex: s, dataEndIndex: f } = o;
          if (
            null != a &&
            null != t &&
            null != r &&
            null != n &&
            null != i &&
            0 !== n.length &&
            0 !== i.length &&
            null != l
          ) {
            var { dataKey: p, data: v } = a;
            if (
              null != (c = null != v && v.length > 0 ? v : null == u ? void 0 : u.slice(s, f + 1))
            )
              return eO({
                layout: e,
                xAxis: t,
                yAxis: r,
                xAxisTicks: n,
                yAxisTicks: i,
                dataKey: p,
                bandSize: l,
                displayedData: c,
              });
          }
        }),
        Y = r(62658),
        _ = r(59087),
        U = r(40130),
        G = r(24917),
        J = r(13790),
        Q = r(9775),
        Z = r(11638),
        ee = ['id'],
        et = ['type', 'layout', 'connectNulls', 'needClip', 'shape'],
        er = [
          'activeDot',
          'animateNewValues',
          'animationBegin',
          'animationDuration',
          'animationEasing',
          'connectNulls',
          'dot',
          'hide',
          'isAnimationActive',
          'label',
          'legendType',
          'xAxisId',
          'yAxisId',
          'id',
        ];
      function en() {
        return (en = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function ei(e, t) {
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
      function ea(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ei(Object(r), !0).forEach(function (t) {
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
              : ei(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      function el(e, t) {
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
          var a = Object.getOwnPropertySymbols(e);
          for (n = 0; n < a.length; n++)
            ((r = a[n]),
              -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
        }
        return i;
      }
      var eo = (e) => {
        var { dataKey: t, name: r, stroke: n, legendType: i, hide: a } = e;
        return [{ inactive: a, dataKey: t, type: i, color: n, value: (0, E.hn)(r, t), payload: e }];
      };
      function ec(e) {
        var {
          dataKey: t,
          data: r,
          stroke: n,
          strokeWidth: i,
          fill: a,
          name: l,
          hide: o,
          unit: c,
        } = e;
        return {
          dataDefinedOnItem: r,
          positions: void 0,
          settings: {
            stroke: n,
            strokeWidth: i,
            fill: a,
            dataKey: t,
            nameKey: void 0,
            name: (0, E.hn)(l, t),
            hide: o,
            type: e.tooltipType,
            color: e.stroke,
            unit: c,
          },
        };
      }
      var eu = (e, t) => ''.concat(t, 'px ').concat(e - t, 'px'),
        es = (e, t, r) => {
          var n = r.reduce((e, t) => e + t);
          if (!n) return eu(t, e);
          for (var i = e % n, a = t - e, l = [], o = 0, c = 0; o < r.length; c += r[o], ++o)
            if (c + r[o] > i) {
              l = [...r.slice(0, o), i - c];
              break;
            }
          var u = l.length % 2 == 0 ? [0, a] : [a];
          return [
            ...(function (e, t) {
              for (var r = e.length % 2 != 0 ? [...e, 0] : e, n = [], i = 0; i < t; ++i)
                n = [...n, ...r];
              return n;
            })(r, Math.floor(e / n)),
            ...l,
            ...u,
          ]
            .map((e) => ''.concat(e, 'px'))
            .join(', ');
        };
      function ef(e) {
        var { clipPathId: t, points: r, props: i } = e,
          { dot: a, dataKey: l, needClip: o } = i,
          { id: u } = i,
          s = el(i, ee),
          f = (0, c.qq)(s);
        return n.createElement(P, {
          points: r,
          dot: a,
          className: 'recharts-line-dots',
          dotClassName: 'recharts-line-dot',
          dataKey: l,
          baseProps: f,
          needClip: o,
          clipPathId: t,
        });
      }
      function ep(e) {
        var { showLabels: t, children: r, points: i } = e,
          a = (0, n.useMemo)(
            () =>
              null == i
                ? void 0
                : i.map((e) => {
                    var t,
                      r,
                      n = {
                        x: null !== (t = e.x) && void 0 !== t ? t : 0,
                        y: null !== (r = e.y) && void 0 !== r ? r : 0,
                        width: 0,
                        lowerWidth: 0,
                        upperWidth: 0,
                        height: 0,
                      };
                    return ea(
                      ea({}, n),
                      {},
                      {
                        value: e.value,
                        payload: e.payload,
                        viewBox: n,
                        parentViewBox: void 0,
                        fill: void 0,
                      }
                    );
                  }),
            [i]
          );
        return n.createElement(l.yc, { value: t ? a : void 0 }, r);
      }
      function ev(e) {
        var { clipPathId: t, pathRef: r, points: i, strokeDasharray: a, props: l } = e,
          { type: o, layout: c, connectNulls: u, needClip: s, shape: f } = l,
          p = el(l, et),
          d = ea(
            ea({}, (0, v.S)(p)),
            {},
            {
              fill: 'none',
              className: 'recharts-line-curve',
              clipPath: s ? 'url(#clipPath-'.concat(t, ')') : void 0,
              points: i,
              type: o,
              layout: c,
              connectNulls: u,
              strokeDasharray: null != a ? a : l.strokeDasharray,
            }
          );
        return n.createElement(
          n.Fragment,
          null,
          (null == i ? void 0 : i.length) > 1 &&
            n.createElement(Z.b, en({ shapeType: 'curve', option: f }, d, { pathRef: r })),
          n.createElement(ef, { points: i, clipPathId: t, props: l })
        );
      }
      function ed(e) {
        var {
            clipPathId: t,
            props: r,
            pathRef: i,
            previousPointsRef: a,
            longestAnimatedLengthRef: o,
          } = e,
          {
            points: c,
            strokeDasharray: s,
            isAnimationActive: f,
            animationBegin: p,
            animationDuration: v,
            animationEasing: d,
            animateNewValues: y,
            width: m,
            height: h,
            onAnimationEnd: b,
            onAnimationStart: g,
          } = r,
          O = a.current,
          P = (0, _.i)(r, 'recharts-line-'),
          [j, E] = (0, n.useState)(!1),
          w = (0, n.useCallback)(() => {
            ('function' == typeof b && b(), E(!1));
          }, [b]),
          x = (0, n.useCallback)(() => {
            ('function' == typeof g && g(), E(!0));
          }, [g]),
          N = (function (e) {
            try {
              return (e && e.getTotalLength && e.getTotalLength()) || 0;
            } catch (e) {
              return 0;
            }
          })(i.current),
          A = o.current;
        return n.createElement(
          ep,
          { points: c, showLabels: !j },
          r.children,
          n.createElement(
            Q.H,
            {
              animationId: P,
              begin: p,
              duration: v,
              isActive: f,
              easing: d,
              onAnimationEnd: w,
              onAnimationStart: x,
              key: P,
            },
            (e) => {
              var l,
                p = Math.min((0, u.sX)(A, N + A, e), N);
              if (
                ((l = f
                  ? s
                    ? es(
                        p,
                        N,
                        ''
                          .concat(s)
                          .split(/[,\s]+/gim)
                          .map((e) => parseFloat(e))
                      )
                    : eu(N, p)
                  : null == s
                    ? void 0
                    : String(s)),
                O)
              ) {
                var v = O.length / c.length,
                  d =
                    1 === e
                      ? c
                      : c.map((t, r) => {
                          var n = Math.floor(r * v);
                          if (O[n]) {
                            var i = O[n];
                            return ea(
                              ea({}, t),
                              {},
                              { x: (0, u.sX)(i.x, t.x, e), y: (0, u.sX)(i.y, t.y, e) }
                            );
                          }
                          return y
                            ? ea(
                                ea({}, t),
                                {},
                                { x: (0, u.sX)(2 * m, t.x, e), y: (0, u.sX)(h / 2, t.y, e) }
                              )
                            : ea(ea({}, t), {}, { x: t.x, y: t.y });
                        });
                return (
                  (a.current = d),
                  n.createElement(ev, {
                    props: r,
                    points: d,
                    clipPathId: t,
                    pathRef: i,
                    strokeDasharray: l,
                  })
                );
              }
              return (
                e > 0 && N > 0 && ((a.current = c), (o.current = p)),
                n.createElement(ev, {
                  props: r,
                  points: c,
                  clipPathId: t,
                  pathRef: i,
                  strokeDasharray: l,
                })
              );
            }
          ),
          n.createElement(l.Ly, { label: r.label })
        );
      }
      function ey(e) {
        var { clipPathId: t, props: r } = e,
          i = (0, n.useRef)(null),
          a = (0, n.useRef)(0),
          l = (0, n.useRef)(null);
        return n.createElement(ed, {
          props: r,
          clipPathId: t,
          previousPointsRef: i,
          longestAnimatedLengthRef: a,
          pathRef: l,
        });
      }
      var em = (e, t) => {
        var r, n;
        return {
          x: null !== (r = e.x) && void 0 !== r ? r : void 0,
          y: null !== (n = e.y) && void 0 !== n ? n : void 0,
          value: e.value,
          errorVal: (0, E.F$)(e.payload, t),
        };
      };
      class eh extends n.Component {
        render() {
          var {
            hide: e,
            dot: t,
            points: r,
            className: l,
            xAxisId: o,
            yAxisId: u,
            top: s,
            left: f,
            width: v,
            height: y,
            id: m,
            needClip: h,
            zIndex: b,
          } = this.props;
          if (e) return null;
          var g = (0, i.W)('recharts-line', l),
            { r: O, strokeWidth: P } = (function (e) {
              var t = (0, c.qM)(e);
              if (null != t) {
                var { r, strokeWidth: n } = t,
                  i = Number(r),
                  a = Number(n);
                return (
                  (Number.isNaN(i) || i < 0) && (i = 3),
                  (Number.isNaN(a) || a < 0) && (a = 2),
                  { r: i, strokeWidth: a }
                );
              }
              return { r: 3, strokeWidth: 2 };
            })(t),
            j = (0, p.W0)(t),
            E = 2 * O + P;
          return n.createElement(
            d.$,
            { zIndex: b },
            n.createElement(
              a.m,
              { className: g },
              h &&
                n.createElement(
                  'defs',
                  null,
                  n.createElement(T.W, { clipPathId: m, xAxisId: o, yAxisId: u }),
                  !j &&
                    n.createElement(
                      'clipPath',
                      { id: 'clipPath-dots-'.concat(m) },
                      n.createElement('rect', {
                        x: f - E / 2,
                        y: s - E / 2,
                        width: v + E,
                        height: y + E,
                      })
                    )
                ),
              n.createElement(
                z.zU,
                { xAxisId: o, yAxisId: u, data: r, dataPointFormatter: em, errorBarOffset: 0 },
                n.createElement(ey, { props: this.props, clipPathId: m })
              )
            ),
            n.createElement(S, {
              activeDot: this.props.activeDot,
              points: r,
              mainColor: this.props.stroke,
              itemDataKey: this.props.dataKey,
            })
          );
        }
      }
      var eb = {
        activeDot: !0,
        animateNewValues: !0,
        animationBegin: 0,
        animationDuration: 1500,
        animationEasing: 'ease',
        connectNulls: !1,
        dot: !0,
        fill: '#fff',
        hide: !1,
        isAnimationActive: !j.x.isSsr,
        label: !1,
        legendType: 'line',
        stroke: '#3182bd',
        strokeWidth: 1,
        xAxisId: 0,
        yAxisId: 0,
        zIndex: y.N.line,
      };
      function eg(e) {
        var t = (0, U.j)(e, eb),
          {
            activeDot: r,
            animateNewValues: i,
            animationBegin: a,
            animationDuration: l,
            animationEasing: o,
            connectNulls: c,
            dot: u,
            hide: s,
            isAnimationActive: f,
            label: p,
            legendType: v,
            xAxisId: d,
            yAxisId: y,
            id: m,
          } = t,
          h = el(t, er),
          { needClip: b } = (0, T.N)(d, y),
          g = (0, N.$$)(),
          O = (0, C.vn)(),
          P = (0, W.W)(),
          j = (0, w.C)((e) => X(e, d, y, P, m));
        if (('horizontal' !== O && 'vertical' !== O) || null == j || null == g) return null;
        var { height: E, width: x, x: A, y: k } = g;
        return n.createElement(
          eh,
          en({}, h, {
            id: m,
            connectNulls: c,
            dot: u,
            activeDot: r,
            animateNewValues: i,
            animationBegin: a,
            animationDuration: l,
            animationEasing: o,
            isAnimationActive: f,
            hide: s,
            label: p,
            legendType: v,
            xAxisId: d,
            yAxisId: y,
            points: j,
            layout: O,
            height: E,
            width: x,
            left: A,
            top: k,
            needClip: b,
          })
        );
      }
      function eO(e) {
        var {
          layout: t,
          xAxis: r,
          yAxis: n,
          xAxisTicks: i,
          yAxisTicks: a,
          dataKey: l,
          bandSize: o,
          displayedData: c,
        } = e;
        return c
          .map((e, c) => {
            var s = (0, E.F$)(e, l);
            if ('horizontal' === t)
              return {
                x: (0, E.Hv)({ axis: r, ticks: i, bandSize: o, entry: e, index: c }),
                y: (0, u.Rw)(s) ? null : n.scale(s),
                value: s,
                payload: e,
              };
            var f = (0, u.Rw)(s) ? null : r.scale(s),
              p = (0, E.Hv)({ axis: n, ticks: a, bandSize: o, entry: e, index: c });
            return null == f || null == p ? null : { x: f, y: p, value: s, payload: e };
          })
          .filter(Boolean);
      }
      var eP = n.memo(function (e) {
        var t = (0, U.j)(e, eb),
          r = (0, W.W)();
        return n.createElement(G.o, { id: t.id, type: 'line' }, (e) =>
          n.createElement(
            n.Fragment,
            null,
            n.createElement(Y.L, { legendPayload: eo(t) }),
            n.createElement(I.k, { fn: ec, args: t }),
            n.createElement(J.V, {
              type: 'line',
              id: e,
              data: t.data,
              xAxisId: t.xAxisId,
              yAxisId: t.yAxisId,
              zAxisId: 0,
              dataKey: t.dataKey,
              hide: t.hide,
              isPanorama: r,
            }),
            n.createElement(eg, en({}, t, { id: e }))
          )
        );
      });
      eP.displayName = 'Line';
    },
    21156: function (e, t, r) {
      r.d(t, {
        w: function () {
          return o;
        },
      });
      var n = r(2265),
        i = r(31057),
        a = r(43841),
        l = ['axis'],
        o = (0, n.forwardRef)((e, t) =>
          n.createElement(a.R, {
            chartName: 'LineChart',
            defaultTooltipEventType: 'axis',
            validateTooltipEventTypes: l,
            tooltipPayloadSearcher: i.NL,
            categoricalChartProps: e,
            ref: t,
          })
        );
    },
    53250: function (e, t, r) {
      r.d(t, {
        D: function () {
          return T;
        },
      });
      var n = r(2265),
        i = r(54887),
        a = r(19493),
        l = r(61994),
        o = r(48777),
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
      function p(e, t) {
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
      var v = {
        align: 'center',
        iconSize: 14,
        inactiveColor: '#ccc',
        layout: 'horizontal',
        verticalAlign: 'middle',
      };
      function d(e) {
        var t,
          { data: r, iconType: i, inactiveColor: a } = e,
          l = 32 / 6,
          o = 32 / 3,
          u = r.inactive ? a : r.color,
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
                ? p(Object(r), !0).forEach(function (t) {
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
                  : p(Object(r)).forEach(function (t) {
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
      function y(e) {
        var { payload: t, iconSize: r, layout: i, formatter: a, inactiveColor: c, iconType: s } = e,
          p = { x: 0, y: 0, width: 32, height: 32 },
          v = { display: 'horizontal' === i ? 'inline-block' : 'block', marginRight: 10 },
          y = { display: 'inline-block', verticalAlign: 'middle', marginRight: 4 };
        return t.map((t, i) => {
          var m = t.formatter || a,
            h = (0, l.W)({
              'recharts-legend-item': !0,
              ['legend-item-'.concat(i)]: !0,
              inactive: t.inactive,
            });
          if ('none' === t.type) return null;
          var b = t.inactive ? c : t.color,
            g = m ? m(t.value, t, i) : t.value;
          return n.createElement(
            'li',
            f({ className: h, style: v, key: 'legend-item-'.concat(i) }, (0, u.bw)(e, t, i)),
            n.createElement(
              o.T,
              {
                width: r,
                height: r,
                viewBox: p,
                style: y,
                'aria-label': ''.concat(g, ' legend icon'),
              },
              n.createElement(d, { data: t, iconType: s, inactiveColor: c })
            ),
            n.createElement(
              'span',
              { className: 'recharts-legend-item-text', style: { color: b } },
              g
            )
          );
        });
      }
      var m = (e) => {
          var t = (0, s.j)(e, v),
            { payload: r, layout: i, align: a } = t;
          return r && r.length
            ? n.createElement(
                'ul',
                {
                  className: 'recharts-default-legend',
                  style: { padding: 0, margin: 0, textAlign: 'horizontal' === i ? a : 'left' },
                },
                n.createElement(y, f({}, t, { payload: r }))
              )
            : null;
        },
        h = r(16630),
        b = r(93528),
        g = r(39040),
        O = r(85898),
        P = r(70030),
        j = r(35953),
        E = r(32738),
        w = ['contextPayload'];
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
      function N(e, t) {
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
      function A(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? N(Object(r), !0).forEach(function (t) {
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
              : N(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      function k(e) {
        return e.value;
      }
      function D(e) {
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
              var a = Object.getOwnPropertySymbols(e);
              for (n = 0; n < a.length; n++)
                ((r = a[n]),
                  -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]));
            }
            return i;
          })(e, w),
          i = (0, b.z)(t, e.payloadUniqBy, k),
          a = A(A({}, r), {}, { payload: i });
        return n.isValidElement(e.content)
          ? n.cloneElement(e.content, a)
          : 'function' == typeof e.content
            ? n.createElement(e.content, a)
            : n.createElement(m, a);
      }
      function S(e) {
        var t = (0, g.T)();
        return (
          (0, n.useEffect)(() => {
            t((0, E.ci)(e));
          }, [t, e]),
          null
        );
      }
      function I(e) {
        var t = (0, g.T)();
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
      var z = {
        align: 'center',
        iconSize: 14,
        itemSorter: 'value',
        layout: 'horizontal',
        verticalAlign: 'bottom',
      };
      function T(e) {
        var t,
          r = (0, s.j)(e, z),
          l = (0, g.C)(O.E$),
          o = (0, a.l)(),
          c = (0, j.h)(),
          { width: u, height: f, wrapperStyle: p, portal: v } = r,
          [d, y] = (0, P.B)([l]),
          m = (0, j.zn)(),
          b = (0, j.Mw)();
        if (null == m || null == b) return null;
        var E = m - ((null == c ? void 0 : c.left) || 0) - ((null == c ? void 0 : c.right) || 0),
          w =
            'vertical' === (t = r.layout) && (0, h.hj)(f)
              ? { height: f }
              : 'horizontal' === t
                ? { width: u || E }
                : null,
          N = v
            ? p
            : A(
                A(
                  {
                    position: 'absolute',
                    width: (null == w ? void 0 : w.width) || u || 'auto',
                    height: (null == w ? void 0 : w.height) || f || 'auto',
                  },
                  (function (e, t, r, n, i, a) {
                    var l,
                      o,
                      { layout: c, align: u, verticalAlign: s } = t;
                    return (
                      (e &&
                        ((void 0 !== e.left && null !== e.left) ||
                          (void 0 !== e.right && null !== e.right))) ||
                        (l =
                          'center' === u && 'vertical' === c
                            ? { left: ((n || 0) - a.width) / 2 }
                            : 'right' === u
                              ? { right: (r && r.right) || 0 }
                              : { left: (r && r.left) || 0 }),
                      (e &&
                        ((void 0 !== e.top && null !== e.top) ||
                          (void 0 !== e.bottom && null !== e.bottom))) ||
                        (o =
                          'middle' === s
                            ? { top: ((i || 0) - a.height) / 2 }
                            : 'bottom' === s
                              ? { bottom: (r && r.bottom) || 0 }
                              : { top: (r && r.top) || 0 }),
                      A(A({}, l), o)
                    );
                  })(p, r, c, m, b, d)
                ),
                p
              ),
          k = null != v ? v : o;
        if (null == k || null == l) return null;
        var T = n.createElement(
          'div',
          { className: 'recharts-legend-wrapper', style: N, ref: y },
          n.createElement(S, {
            layout: r.layout,
            align: r.align,
            verticalAlign: r.verticalAlign,
            itemSorter: r.itemSorter,
          }),
          n.createElement(I, { width: d.width, height: d.height }),
          n.createElement(
            D,
            x({}, r, w, { margin: c, chartWidth: m, chartHeight: b, contextPayload: l })
          )
        );
        return (0, i.createPortal)(T, k);
      }
      T.displayName = 'Legend';
    },
  },
]);
