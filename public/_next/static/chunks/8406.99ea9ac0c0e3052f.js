'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [8406],
  {
    90999: function (e, t, r) {
      r.d(t, {
        $: function () {
          return eA;
        },
        u: function () {
          return ej;
        },
      });
      var n = r(2265),
        a = r(61994),
        i = r(9841),
        o = r(20407),
        l = r(58772),
        u = r(16630),
        c = r(82944),
        s = r(34067),
        f = r(49037),
        d = r(41637),
        v = r(11638),
        p = ['x', 'y'];
      function y() {
        return (y = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function b(e, t) {
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
      function m(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? b(Object(r), !0).forEach(function (t) {
                var n, a;
                ((n = t),
                  (a = r[t]),
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
                        value: a,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[n] = a));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : b(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      function h(e, t) {
        var { x: r, y: n } = e,
          a = (function (e, t) {
            if (null == e) return {};
            var r,
              n,
              a = (function (e, t) {
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
              var i = Object.getOwnPropertySymbols(e);
              for (n = 0; n < i.length; n++)
                ((r = i[n]),
                  -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
            }
            return a;
          })(e, p),
          i = parseInt(''.concat(r), 10),
          o = parseInt(''.concat(n), 10),
          l = parseInt(''.concat(t.height || a.height), 10),
          u = parseInt(''.concat(t.width || a.width), 10);
        return m(
          m(m(m(m({}, t), a), i ? { x: i } : {}), o ? { y: o } : {}),
          {},
          { height: l, width: u, name: t.name, radius: t.radius }
        );
      }
      function g(e) {
        return n.createElement(
          v.b,
          y(
            { shapeType: 'rectangle', propTransformer: h, activeClassName: 'recharts-active-bar' },
            e
          )
        );
      }
      var x = function (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
          return (r, n) => {
            if ((0, u.hj)(e)) return e;
            var a = (0, u.hj)(r) || (0, u.Rw)(r);
            return a
              ? e(r, n)
              : (a ||
                  (function (e, t) {
                    if (!e) throw Error('Invariant failed');
                  })(!1),
                t);
          };
        },
        O = r(44296),
        P = r(35623),
        E = r(84815),
        w = r(45702),
        j = r(35953),
        A = r(92713),
        S = r(9666),
        I = r(22932),
        z = r(74653),
        k = r(33968),
        C = r(66395),
        M = r(56125),
        K = r(36691);
      function B(e, t) {
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
      function D(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? B(Object(r), !0).forEach(function (t) {
                var n, a;
                ((n = t),
                  (a = r[t]),
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
                        value: a,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[n] = a));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : B(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      var N = (0, A.P1)([S.bm, (e, t, r, n, a) => a], (e, t) =>
          e.filter((e) => 'bar' === e.type).find((e) => e.id === t)
        ),
        T = (0, A.P1)([N], (e) => (null == e ? void 0 : e.maxBarSize)),
        L = (e, t, r) => {
          var n = null != r ? r : e;
          if (!(0, u.Rw)(n)) return (0, u.h1)(n, t, 0);
        },
        X = (0, A.P1)(
          [j.rE, S.bm, (e, t) => t, (e, t, r) => r, (e, t, r, n) => n],
          (e, t, r, n, a) =>
            t
              .filter((t) => ('horizontal' === e ? t.xAxisId === r : t.yAxisId === n))
              .filter((e) => e.isPanorama === a)
              .filter((e) => !1 === e.hide)
              .filter((e) => 'bar' === e.type)
        ),
        R = (0, A.P1)(
          [
            X,
            k.X8,
            (e, t, r) =>
              'horizontal' === (0, j.rE)(e) ? (0, S.Lu)(e, 'xAxis', t) : (0, S.Lu)(e, 'yAxis', r),
          ],
          (e, t, r) => {
            var n = e.filter(K.b),
              a = e.filter((e) => null == e.stackId);
            return [
              ...Object.entries(
                n.reduce(
                  (e, t) => (e[t.stackId] || (e[t.stackId] = []), e[t.stackId].push(t), e),
                  {}
                )
              ).map((e) => {
                var [n, a] = e;
                return {
                  stackId: n,
                  dataKeys: a.map((e) => e.dataKey),
                  barSize: L(t, r, a[0].barSize),
                };
              }),
              ...a.map((e) => ({
                stackId: void 0,
                dataKeys: [e.dataKey].filter((e) => null != e),
                barSize: L(t, r, e.barSize),
              })),
            ];
          }
        ),
        V = (e, t, r, n) => {
          var a, i;
          return (
            'horizontal' === (0, j.rE)(e)
              ? ((a = (0, S.AS)(e, 'xAxis', t, n)), (i = (0, S.bY)(e, 'xAxis', t, n)))
              : ((a = (0, S.AS)(e, 'yAxis', r, n)), (i = (0, S.bY)(e, 'yAxis', r, n))),
            (0, f.zT)(a, i)
          );
        },
        Y = (0, A.P1)(
          [
            R,
            k.qy,
            k.wK,
            k.sd,
            (e, t, r, n, a) => {
              var i,
                o,
                l,
                c,
                s = N(e, t, r, n, a);
              if (null != s) {
                var d = (0, j.rE)(e),
                  v = (0, k.qy)(e),
                  { maxBarSize: p } = s,
                  y = (0, u.Rw)(p) ? v : p;
                return (
                  'horizontal' === d
                    ? ((l = (0, S.AS)(e, 'xAxis', t, n)), (c = (0, S.bY)(e, 'xAxis', t, n)))
                    : ((l = (0, S.AS)(e, 'yAxis', r, n)), (c = (0, S.bY)(e, 'yAxis', r, n))),
                  null !== (i = null !== (o = (0, f.zT)(l, c, !0)) && void 0 !== o ? o : y) &&
                  void 0 !== i
                    ? i
                    : 0
                );
              }
            },
            V,
            T,
          ],
          (e, t, r, n, a, i, o) => {
            var l = (function (e, t, r, n, a) {
              var i,
                o = n.length;
              if (!(o < 1)) {
                var l = (0, u.h1)(e, r, 0, !0),
                  c = [];
                if ((0, C.n)(n[0].barSize)) {
                  var s = !1,
                    f = r / o,
                    d = n.reduce((e, t) => e + (t.barSize || 0), 0);
                  ((d += (o - 1) * l) >= r && ((d -= (o - 1) * l), (l = 0)),
                    d >= r && f > 0 && ((s = !0), (f *= 0.9), (d = o * f)));
                  var v = { offset: (((r - d) / 2) >> 0) - l, size: 0 };
                  i = n.reduce((e, t) => {
                    var r,
                      n = [
                        ...e,
                        {
                          stackId: t.stackId,
                          dataKeys: t.dataKeys,
                          position: {
                            offset: v.offset + v.size + l,
                            size: s ? f : null !== (r = t.barSize) && void 0 !== r ? r : 0,
                          },
                        },
                      ];
                    return ((v = n[n.length - 1].position), n);
                  }, c);
                } else {
                  var p = (0, u.h1)(t, r, 0, !0);
                  r - 2 * p - (o - 1) * l <= 0 && (l = 0);
                  var y = (r - 2 * p - (o - 1) * l) / o;
                  y > 1 && (y >>= 0);
                  var b = (0, C.n)(a) ? Math.min(y, a) : y;
                  i = n.reduce(
                    (e, t, r) => [
                      ...e,
                      {
                        stackId: t.stackId,
                        dataKeys: t.dataKeys,
                        position: { offset: p + (y + l) * r + (y - b) / 2, size: b },
                      },
                    ],
                    c
                  );
                }
                return i;
              }
            })(r, n, a !== i ? a : i, e, (0, u.Rw)(o) ? t : o);
            return (
              a !== i &&
                null != l &&
                (l = l.map((e) =>
                  D(
                    D({}, e),
                    {},
                    { position: D(D({}, e.position), {}, { offset: e.position.offset - a / 2 }) }
                  )
                )),
              l
            );
          }
        ),
        F = (0, A.P1)([Y, N], (e, t) => {
          if (null != e && null != t) {
            var r = e.find(
              (e) => e.stackId === t.stackId && null != t.dataKey && e.dataKeys.includes(t.dataKey)
            );
            if (null != r) return r.position;
          }
        }),
        W = (0, A.P1)(
          [
            (e, t, r, n) =>
              'horizontal' === (0, j.rE)(e)
                ? (0, S.g6)(e, 'yAxis', r, n)
                : (0, S.g6)(e, 'xAxis', t, n),
            N,
          ],
          (e, t) => {
            var r = (0, M.H)(t);
            if (e && null != r && null != t) {
              var { stackId: n } = t;
              if (null != n) {
                var a = e[n];
                if (a) {
                  var { stackedData: i } = a;
                  if (i) return i.find((e) => e.key === r);
                }
              }
            }
          }
        ),
        $ = (0, A.P1)(
          [
            z.DX,
            z.zM,
            (e, t, r, n) => (0, S.AS)(e, 'xAxis', t, n),
            (e, t, r, n) => (0, S.AS)(e, 'yAxis', r, n),
            (e, t, r, n) => (0, S.bY)(e, 'xAxis', t, n),
            (e, t, r, n) => (0, S.bY)(e, 'yAxis', r, n),
            F,
            j.rE,
            I.hA,
            V,
            W,
            N,
            (e, t, r, n, a, i) => i,
          ],
          (e, t, r, n, a, i, o, l, u, c, s, f, d) => {
            var v,
              { chartData: p, dataStartIndex: y, dataEndIndex: b } = u;
            if (
              null != f &&
              null != o &&
              null != t &&
              ('horizontal' === l || 'vertical' === l) &&
              null != r &&
              null != n &&
              null != a &&
              null != i &&
              null != c
            ) {
              var { data: m } = f;
              if (
                null != (v = null != m && m.length > 0 ? m : null == p ? void 0 : p.slice(y, b + 1))
              )
                return ej({
                  layout: l,
                  barSettings: f,
                  pos: o,
                  parentViewBox: t,
                  bandSize: c,
                  xAxis: r,
                  yAxis: n,
                  xAxisTicks: a,
                  yAxisTicks: i,
                  stackedData: s,
                  displayedData: v,
                  offset: e,
                  cells: d,
                  dataStartIndex: y,
                });
            }
          }
        ),
        q = r(39040),
        _ = r(58735),
        Q = r(31944),
        H = r(62658),
        G = r(59087),
        U = r(40130),
        J = r(24917),
        Z = r(13790),
        ee = r(51221),
        et = r(9775),
        er = r(48002),
        en = r(73928),
        ea = ['onMouseEnter', 'onMouseLeave', 'onClick'],
        ei = ['value', 'background', 'tooltipPosition'],
        eo = ['id'],
        el = ['onMouseEnter', 'onClick', 'onMouseLeave'];
      function eu() {
        return (eu = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function ec(e, t) {
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
      function es(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? ec(Object(r), !0).forEach(function (t) {
                var n, a;
                ((n = t),
                  (a = r[t]),
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
                        value: a,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (e[n] = a));
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
              : ec(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      function ef(e, t) {
        if (null == e) return {};
        var r,
          n,
          a = (function (e, t) {
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
          var i = Object.getOwnPropertySymbols(e);
          for (n = 0; n < i.length; n++)
            ((r = i[n]),
              -1 === t.indexOf(r) && {}.propertyIsEnumerable.call(e, r) && (a[r] = e[r]));
        }
        return a;
      }
      var ed = (e) => {
        var { dataKey: t, name: r, fill: n, legendType: a, hide: i } = e;
        return [{ inactive: i, dataKey: t, type: a, color: n, value: (0, f.hn)(r, t), payload: e }];
      };
      function ev(e) {
        var { dataKey: t, stroke: r, strokeWidth: n, fill: a, name: i, hide: o, unit: l } = e;
        return {
          dataDefinedOnItem: void 0,
          positions: void 0,
          settings: {
            stroke: r,
            strokeWidth: n,
            fill: a,
            dataKey: t,
            nameKey: void 0,
            name: (0, f.hn)(i, t),
            hide: o,
            type: e.tooltipType,
            color: e.fill,
            unit: l,
          },
        };
      }
      function ep(e) {
        var t,
          r = (0, q.C)(Q.Ve),
          { data: a, dataKey: i, background: o, allOtherBarProps: l } = e,
          { onMouseEnter: u, onMouseLeave: c, onClick: s } = l,
          f = ef(l, ea),
          v = (0, O.Df)(u, i),
          p = (0, O.oQ)(c),
          y = (0, O.nC)(s, i);
        if (!o || null == a) return null;
        var b = (0, ee.qM)(o);
        return n.createElement(
          er.$,
          {
            zIndex:
              ((t = en.N.barBackground),
              o &&
              'object' == typeof o &&
              'zIndex' in o &&
              'number' == typeof o.zIndex &&
              (0, C.n)(o.zIndex)
                ? o.zIndex
                : t),
          },
          a.map((e, t) => {
            var { value: a, background: l, tooltipPosition: u } = e,
              c = ef(e, ei);
            if (!l) return null;
            var s = v(e, t),
              m = p(e, t),
              h = y(e, t),
              x = es(
                es(
                  es(
                    es(es({ option: o, isActive: String(t) === r }, c), {}, { fill: '#eee' }, l),
                    b
                  ),
                  (0, d.bw)(f, e, t)
                ),
                {},
                {
                  onMouseEnter: s,
                  onMouseLeave: m,
                  onClick: h,
                  dataKey: i,
                  index: t,
                  className: 'recharts-bar-background-rectangle',
                }
              );
            return n.createElement(g, eu({ key: 'background-bar-'.concat(t) }, x));
          })
        );
      }
      function ey(e) {
        var { showLabels: t, children: r, rects: a } = e,
          i =
            null == a
              ? void 0
              : a.map((e) => {
                  var t = {
                    x: e.x,
                    y: e.y,
                    width: e.width,
                    lowerWidth: e.width,
                    upperWidth: e.width,
                    height: e.height,
                  };
                  return es(
                    es({}, t),
                    {},
                    {
                      value: e.value,
                      payload: e.payload,
                      parentViewBox: e.parentViewBox,
                      viewBox: t,
                      fill: e.fill,
                    }
                  );
                });
        return n.createElement(l.yc, { value: t ? i : void 0 }, r);
      }
      function eb(e) {
        var { shape: t, activeBar: r, baseProps: a, entry: i, index: o, dataKey: l } = e,
          u = (0, q.C)(Q.Ve),
          c = (0, q.C)(Q.du),
          s = r && String(o) === u && (null == c || l === c),
          f = s ? r : t;
        return s
          ? n.createElement(
              er.$,
              { zIndex: en.N.activeBar },
              n.createElement(
                g,
                eu({}, a, { name: String(a.name) }, i, {
                  isActive: s,
                  option: f,
                  index: o,
                  dataKey: l,
                })
              )
            )
          : n.createElement(
              g,
              eu({}, a, { name: String(a.name) }, i, {
                isActive: s,
                option: f,
                index: o,
                dataKey: l,
              })
            );
      }
      function em(e) {
        var { shape: t, baseProps: r, entry: a, index: i, dataKey: o } = e;
        return n.createElement(
          g,
          eu({}, r, { name: String(r.name) }, a, { isActive: !1, option: t, index: i, dataKey: o })
        );
      }
      function eh(e) {
        var t,
          { data: r, props: a } = e,
          o = null !== (t = (0, ee.qq)(a)) && void 0 !== t ? t : {},
          { id: l } = o,
          u = ef(o, eo),
          { shape: c, dataKey: s, activeBar: f } = a,
          { onMouseEnter: v, onClick: p, onMouseLeave: y } = a,
          b = ef(a, el),
          m = (0, O.Df)(v, s),
          h = (0, O.oQ)(y),
          g = (0, O.nC)(p, s);
        return r
          ? n.createElement(
              n.Fragment,
              null,
              r.map((e, t) =>
                n.createElement(
                  i.m,
                  eu(
                    {
                      key: 'rectangle-'
                        .concat(null == e ? void 0 : e.x, '-')
                        .concat(null == e ? void 0 : e.y, '-')
                        .concat(null == e ? void 0 : e.value, '-')
                        .concat(t),
                      className: 'recharts-bar-rectangle',
                    },
                    (0, d.bw)(b, e, t),
                    { onMouseEnter: m(e, t), onMouseLeave: h(e, t), onClick: g(e, t) }
                  ),
                  f
                    ? n.createElement(eb, {
                        shape: c,
                        activeBar: f,
                        baseProps: u,
                        entry: e,
                        index: t,
                        dataKey: s,
                      })
                    : n.createElement(em, {
                        shape: c,
                        baseProps: u,
                        entry: e,
                        index: t,
                        dataKey: s,
                      })
                )
              )
            )
          : null;
      }
      function eg(e) {
        var { props: t, previousRectanglesRef: r } = e,
          {
            data: a,
            layout: o,
            isAnimationActive: c,
            animationBegin: s,
            animationDuration: f,
            animationEasing: d,
            onAnimationEnd: v,
            onAnimationStart: p,
          } = t,
          y = r.current,
          b = (0, G.i)(t, 'recharts-bar-'),
          [m, h] = (0, n.useState)(!1),
          g = (0, n.useCallback)(() => {
            ('function' == typeof v && v(), h(!1));
          }, [v]),
          x = (0, n.useCallback)(() => {
            ('function' == typeof p && p(), h(!0));
          }, [p]);
        return n.createElement(
          ey,
          { showLabels: !m, rects: a },
          n.createElement(
            et.H,
            {
              animationId: b,
              begin: s,
              duration: f,
              isActive: c,
              easing: d,
              onAnimationEnd: g,
              onAnimationStart: x,
              key: b,
            },
            (e) => {
              var l =
                1 === e
                  ? a
                  : null == a
                    ? void 0
                    : a.map((t, r) => {
                        var n = y && y[r];
                        if (n)
                          return es(
                            es({}, t),
                            {},
                            {
                              x: (0, u.sX)(n.x, t.x, e),
                              y: (0, u.sX)(n.y, t.y, e),
                              width: (0, u.sX)(n.width, t.width, e),
                              height: (0, u.sX)(n.height, t.height, e),
                            }
                          );
                        if ('horizontal' === o) {
                          var a = (0, u.sX)(0, t.height, e),
                            i = (0, u.sX)(t.stackedBarStart, t.y, e);
                          return es(es({}, t), {}, { y: i, height: a });
                        }
                        var l = (0, u.sX)(0, t.width, e),
                          c = (0, u.sX)(t.stackedBarStart, t.x, e);
                        return es(es({}, t), {}, { width: l, x: c });
                      });
              return (e > 0 && (r.current = null != l ? l : null), null == l)
                ? null
                : n.createElement(i.m, null, n.createElement(eh, { props: t, data: l }));
            }
          ),
          n.createElement(l.Ly, { label: t.label }),
          t.children
        );
      }
      function ex(e) {
        var t = (0, n.useRef)(null);
        return n.createElement(eg, { previousRectanglesRef: t, props: e });
      }
      var eO = (e, t) => {
        var r = Array.isArray(e.value) ? e.value[1] : e.value;
        return { x: e.x, y: e.y, value: r, errorVal: (0, f.F$)(e, t) };
      };
      class eP extends n.PureComponent {
        render() {
          var {
            hide: e,
            data: t,
            dataKey: r,
            className: o,
            xAxisId: l,
            yAxisId: u,
            needClip: c,
            background: s,
            id: f,
          } = this.props;
          if (e || null == t) return null;
          var d = (0, a.W)('recharts-bar', o);
          return n.createElement(
            i.m,
            { className: d, id: f },
            c &&
              n.createElement(
                'defs',
                null,
                n.createElement(w.W, { clipPathId: f, xAxisId: l, yAxisId: u })
              ),
            n.createElement(
              i.m,
              {
                className: 'recharts-bar-rectangles',
                clipPath: c ? 'url(#clipPath-'.concat(f, ')') : void 0,
              },
              n.createElement(ep, {
                data: t,
                dataKey: r,
                background: s,
                allOtherBarProps: this.props,
              }),
              n.createElement(ex, this.props)
            )
          );
        }
      }
      var eE = {
        activeBar: !1,
        animationBegin: 0,
        animationDuration: 400,
        animationEasing: 'ease',
        hide: !1,
        isAnimationActive: !s.x.isSsr,
        legendType: 'rect',
        minPointSize: 0,
        xAxisId: 0,
        yAxisId: 0,
        zIndex: en.N.bar,
      };
      function ew(e) {
        var t,
          {
            xAxisId: r,
            yAxisId: a,
            hide: i,
            legendType: l,
            minPointSize: u,
            activeBar: s,
            animationBegin: f,
            animationDuration: d,
            animationEasing: v,
            isAnimationActive: p,
          } = e,
          { needClip: y } = (0, w.N)(r, a),
          b = (0, j.vn)(),
          m = (0, _.W)(),
          h = (0, c.NN)(e.children, o.b),
          g = (0, q.C)((t) => $(t, r, a, m, e.id, h));
        if ('vertical' !== b && 'horizontal' !== b) return null;
        var x = null == g ? void 0 : g[0];
        return (
          (t =
            null == x || null == x.height || null == x.width
              ? 0
              : 'vertical' === b
                ? x.height / 2
                : x.width / 2),
          n.createElement(
            E.zU,
            { xAxisId: r, yAxisId: a, data: g, dataPointFormatter: eO, errorBarOffset: t },
            n.createElement(
              eP,
              eu({}, e, {
                layout: b,
                needClip: y,
                data: g,
                xAxisId: r,
                yAxisId: a,
                hide: i,
                legendType: l,
                minPointSize: u,
                activeBar: s,
                animationBegin: f,
                animationDuration: d,
                animationEasing: v,
                isAnimationActive: p,
              })
            )
          )
        );
      }
      function ej(e) {
        var {
            layout: t,
            barSettings: { dataKey: r, minPointSize: n },
            pos: a,
            bandSize: i,
            xAxis: o,
            yAxis: l,
            xAxisTicks: c,
            yAxisTicks: s,
            stackedData: d,
            displayedData: v,
            offset: p,
            cells: y,
            parentViewBox: b,
            dataStartIndex: m,
          } = e,
          h = 'horizontal' === t ? l : o,
          g = d ? h.scale.domain() : null,
          O = (0, f.Yj)({ numericAxis: h }),
          P = h.scale(O);
        return v
          .map((e, v) => {
            d ? (E = (0, f.Vv)(d[v + m], g)) : Array.isArray((E = (0, f.F$)(e, r))) || (E = [O, E]);
            var h = x(n, 0)(E[1], v);
            if ('horizontal' === t) {
              var E,
                w,
                j,
                A,
                S,
                I,
                z,
                [k, C] = [l.scale(E[0]), l.scale(E[1])];
              ((w = (0, f.Fy)({
                axis: o,
                ticks: c,
                bandSize: i,
                offset: a.offset,
                entry: e,
                index: v,
              })),
                (j = null !== (z = null != C ? C : k) && void 0 !== z ? z : void 0),
                (A = a.size));
              var M = k - C;
              if (
                ((S = (0, u.In)(M) ? 0 : M),
                (I = { x: w, y: p.top, width: A, height: p.height }),
                Math.abs(h) > 0 && Math.abs(S) < Math.abs(h))
              ) {
                var K = (0, u.uY)(S || h) * (Math.abs(h) - Math.abs(S));
                ((j -= K), (S += K));
              }
            } else {
              var [B, D] = [o.scale(E[0]), o.scale(E[1])];
              if (
                ((w = B),
                (j = (0, f.Fy)({
                  axis: l,
                  ticks: s,
                  bandSize: i,
                  offset: a.offset,
                  entry: e,
                  index: v,
                })),
                (A = D - B),
                (S = a.size),
                (I = { x: p.left, y: j, width: p.width, height: S }),
                Math.abs(h) > 0 && Math.abs(A) < Math.abs(h))
              ) {
                var N = (0, u.uY)(A || h) * (Math.abs(h) - Math.abs(A));
                A += N;
              }
            }
            return null == w || null == j || null == A || null == S
              ? null
              : es(
                  es({}, e),
                  {},
                  {
                    stackedBarStart: P,
                    x: w,
                    y: j,
                    width: A,
                    height: S,
                    value: d ? E : E[1],
                    payload: e,
                    background: I,
                    tooltipPosition: { x: w + A / 2, y: j + S / 2 },
                    parentViewBox: b,
                  },
                  y && y[v] && y[v].props
                );
          })
          .filter(Boolean);
      }
      var eA = n.memo(function (e) {
        var t = (0, U.j)(e, eE),
          r = (0, _.W)();
        return n.createElement(J.o, { id: t.id, type: 'bar' }, (e) =>
          n.createElement(
            n.Fragment,
            null,
            n.createElement(H.L, { legendPayload: ed(t) }),
            n.createElement(P.k, { fn: ev, args: t }),
            n.createElement(Z.V, {
              type: 'bar',
              id: e,
              data: void 0,
              xAxisId: t.xAxisId,
              yAxisId: t.yAxisId,
              zAxisId: 0,
              dataKey: t.dataKey,
              stackId: (0, f.GA)(t.stackId),
              hide: t.hide,
              barSize: t.barSize,
              minPointSize: t.minPointSize,
              maxBarSize: t.maxBarSize,
              isPanorama: r,
            }),
            n.createElement(er.$, { zIndex: t.zIndex }, n.createElement(ew, eu({}, t, { id: e })))
          )
        );
      });
      eA.displayName = 'Bar';
    },
    77031: function (e, t, r) {
      r.d(t, {
        v: function () {
          return l;
        },
      });
      var n = r(2265),
        a = r(31057),
        i = r(43841),
        o = ['axis', 'item'],
        l = (0, n.forwardRef)((e, t) =>
          n.createElement(i.R, {
            chartName: 'BarChart',
            defaultTooltipEventType: 'axis',
            validateTooltipEventTypes: o,
            tooltipPayloadSearcher: a.NL,
            categoricalChartProps: e,
            ref: t,
          })
        );
    },
    20407: function (e, t, r) {
      r.d(t, {
        b: function () {
          return n;
        },
      });
      var n = (e) => null;
      n.displayName = 'Cell';
    },
    44296: function (e, t, r) {
      r.d(t, {
        Df: function () {
          return i;
        },
        nC: function () {
          return l;
        },
        oQ: function () {
          return o;
        },
      });
      var n = r(39040),
        a = r(64725),
        i = (e, t) => {
          var r = (0, n.T)();
          return (n, i) => (o) => {
            (null == e || e(n, i, o),
              r(
                (0, a.M1)({
                  activeIndex: String(i),
                  activeDataKey: t,
                  activeCoordinate: n.tooltipPosition,
                })
              ));
          };
        },
        o = (e) => {
          var t = (0, n.T)();
          return (r, n) => (i) => {
            (null == e || e(r, n, i), t((0, a.Vg)()));
          };
        },
        l = (e, t) => {
          var r = (0, n.T)();
          return (n, i) => (o) => {
            (null == e || e(n, i, o),
              r(
                (0, a.O_)({
                  activeIndex: String(i),
                  activeDataKey: t,
                  activeCoordinate: n.tooltipPosition,
                })
              ));
          };
        };
    },
  },
]);
