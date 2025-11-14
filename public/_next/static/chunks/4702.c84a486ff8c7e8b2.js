'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [4702],
  {
    87788: function (e, t, r) {
      r.d(t, {
        O: function () {
          return I;
        },
        m: function () {
          return j;
        },
      });
      var n = r(2265),
        i = r(15870),
        a = r.n(i),
        o = r(61994),
        l = r(46485),
        c = r(9841),
        s = r(58811),
        u = r(26680),
        d = r(16630),
        f = r(41637),
        h = r(12983),
        v = r(51221),
        y = (e) => {
          var {
              ticks: t,
              label: r,
              labelGapWithTick: n = 5,
              tickSize: i = 0,
              tickMargin: a = 0,
            } = e,
            o = 0;
          if (t) {
            Array.from(t).forEach((e) => {
              if (e) {
                var t = e.getBoundingClientRect();
                t.width > o && (o = t.width);
              }
            });
            var l = r ? r.getBoundingClientRect().width : 0;
            return Math.round(o + (i + a) + l + (r ? n : 0));
          }
          return 0;
        },
        m = r(40130),
        p = r(48002),
        g = r(73928),
        w = ['axisLine', 'width', 'height', 'className', 'hide', 'ticks', 'axisType'],
        b = ['viewBox'],
        x = ['viewBox'];
      function O(e, t) {
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
      function k() {
        return (k = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function E(e, t) {
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
      function P(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? E(Object(r), !0).forEach(function (t) {
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
              : E(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      var j = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        viewBox: { x: 0, y: 0, width: 0, height: 0 },
        orientation: 'bottom',
        ticks: [],
        stroke: '#666',
        tickLine: !0,
        axisLine: !0,
        tick: !0,
        mirror: !1,
        minTickGap: 5,
        tickSize: 6,
        tickMargin: 2,
        interval: 'preserveEnd',
        zIndex: g.N.axis,
      };
      function C(e) {
        var {
          x: t,
          y: r,
          width: i,
          height: l,
          orientation: c,
          mirror: s,
          axisLine: u,
          otherSvgProps: d,
        } = e;
        if (!u) return null;
        var f = P(P(P({}, d), (0, v.qq)(u)), {}, { fill: 'none' });
        if ('top' === c || 'bottom' === c) {
          var h = +(('top' === c && !s) || ('bottom' === c && s));
          f = P(P({}, f), {}, { x1: t, y1: r + h * l, x2: t + i, y2: r + h * l });
        } else {
          var y = +(('left' === c && !s) || ('right' === c && s));
          f = P(P({}, f), {}, { x1: t + y * i, y1: r, x2: t + y * i, y2: r + l });
        }
        return n.createElement(
          'line',
          k({}, f, { className: (0, o.W)('recharts-cartesian-axis-line', a()(u, 'className')) })
        );
      }
      function N(e) {
        var t,
          { option: r, tickProps: i, value: a } = e,
          l = (0, o.W)(i.className, 'recharts-cartesian-axis-tick-value');
        if (n.isValidElement(r)) t = n.cloneElement(r, P(P({}, i), {}, { className: l }));
        else if ('function' == typeof r) t = r(P(P({}, i), {}, { className: l }));
        else {
          var c = 'recharts-cartesian-axis-tick-value';
          ('boolean' != typeof r && (c = (0, o.W)(c, null == r ? void 0 : r.className)),
            (t = n.createElement(s.xv, k({}, i, { className: c }), a)));
        }
        return t;
      }
      var S = (0, n.forwardRef)((e, t) => {
          var {
              ticks: r = [],
              tick: i,
              tickLine: l,
              stroke: s,
              tickFormatter: u,
              unit: y,
              padding: m,
              tickTextProps: w,
              orientation: b,
              mirror: x,
              x: O,
              y: E,
              width: j,
              height: C,
              tickSize: S,
              tickMargin: A,
              fontSize: D,
              letterSpacing: I,
              getTicksConfig: z,
              events: W,
              axisType: M,
            } = e,
            R = (0, h.f)(P(P({}, z), {}, { ticks: r }), D, I),
            T = (function (e, t) {
              switch (e) {
                case 'left':
                  return t ? 'start' : 'end';
                case 'right':
                  return t ? 'end' : 'start';
                default:
                  return 'middle';
              }
            })(b, x),
            B = (function (e, t) {
              switch (e) {
                case 'left':
                case 'right':
                  return 'middle';
                case 'top':
                  return t ? 'start' : 'end';
                default:
                  return t ? 'end' : 'start';
              }
            })(b, x),
            G = (0, v.qq)(z),
            L = (0, v.qM)(i),
            q = {};
          'object' == typeof l && (q = l);
          var F = P(P({}, G), {}, { fill: 'none' }, q),
            H = R.map((e) =>
              P(
                { entry: e },
                (function (e, t, r, n, i, a, o, l, c) {
                  var s,
                    u,
                    f,
                    h,
                    v,
                    y,
                    m = l ? -1 : 1,
                    p = e.tickSize || o,
                    g = (0, d.hj)(e.tickCoord) ? e.tickCoord : e.coordinate;
                  switch (a) {
                    case 'top':
                      ((s = u = e.coordinate),
                        (y = (f = (h = r + +!l * i) - m * p) - m * c),
                        (v = g));
                      break;
                    case 'left':
                      ((f = h = e.coordinate),
                        (v = (s = (u = t + +!l * n) - m * p) - m * c),
                        (y = g));
                      break;
                    case 'right':
                      ((f = h = e.coordinate),
                        (v = (s = (u = t + +l * n) + m * p) + m * c),
                        (y = g));
                      break;
                    default:
                      ((s = u = e.coordinate),
                        (y = (f = (h = r + +l * i) + m * p) + m * c),
                        (v = g));
                  }
                  return { line: { x1: s, y1: f, x2: u, y2: h }, tick: { x: v, y: y } };
                })(e, O, E, j, C, b, S, x, A)
              )
            ),
            V = H.map((e) => {
              var { entry: t, line: r } = e;
              return n.createElement(
                c.m,
                {
                  className: 'recharts-cartesian-axis-tick',
                  key: 'tick-'.concat(t.value, '-').concat(t.coordinate, '-').concat(t.tickCoord),
                },
                l &&
                  n.createElement(
                    'line',
                    k({}, F, r, {
                      className: (0, o.W)('recharts-cartesian-axis-tick-line', a()(l, 'className')),
                    })
                  )
              );
            }),
            K = H.map((e, t) => {
              var { entry: r, tick: a } = e,
                o = P(
                  P(
                    P(
                      P({ textAnchor: T, verticalAnchor: B }, G),
                      {},
                      { stroke: 'none', fill: s },
                      L
                    ),
                    a
                  ),
                  {},
                  {
                    index: t,
                    payload: r,
                    visibleTicksCount: R.length,
                    tickFormatter: u,
                    padding: m,
                  },
                  w
                );
              return n.createElement(
                c.m,
                k(
                  {
                    className: 'recharts-cartesian-axis-tick-label',
                    key: 'tick-label-'
                      .concat(r.value, '-')
                      .concat(r.coordinate, '-')
                      .concat(r.tickCoord),
                  },
                  (0, f.bw)(W, r, t)
                ),
                i &&
                  n.createElement(N, {
                    option: i,
                    tickProps: o,
                    value: ''
                      .concat('function' == typeof u ? u(r.value, t) : r.value)
                      .concat(y || ''),
                  })
              );
            });
          return n.createElement(
            'g',
            { className: 'recharts-cartesian-axis-ticks recharts-'.concat(M, '-ticks') },
            K.length > 0 &&
              n.createElement(
                p.$,
                { zIndex: g.N.label },
                n.createElement(
                  'g',
                  {
                    className: 'recharts-cartesian-axis-tick-labels recharts-'.concat(
                      M,
                      '-tick-labels'
                    ),
                    ref: t,
                  },
                  K
                )
              ),
            V.length > 0 &&
              n.createElement(
                'g',
                {
                  className: 'recharts-cartesian-axis-tick-lines recharts-'.concat(
                    M,
                    '-tick-lines'
                  ),
                },
                V
              )
          );
        }),
        A = (0, n.forwardRef)((e, t) => {
          var {
              axisLine: r,
              width: i,
              height: a,
              className: l,
              hide: s,
              ticks: d,
              axisType: f,
            } = e,
            h = O(e, w),
            [m, g] = (0, n.useState)(''),
            [b, x] = (0, n.useState)(''),
            k = (0, n.useRef)(null);
          (0, n.useImperativeHandle)(t, () => ({
            getCalculatedWidth: () => {
              var t;
              return y({
                ticks: k.current,
                label: null === (t = e.labelRef) || void 0 === t ? void 0 : t.current,
                labelGapWithTick: 5,
                tickSize: e.tickSize,
                tickMargin: e.tickMargin,
              });
            },
          }));
          var E = (0, n.useCallback)(
            (e) => {
              if (e) {
                var t = e.getElementsByClassName('recharts-cartesian-axis-tick-value');
                k.current = t;
                var r = t[0];
                if (r) {
                  var n = window.getComputedStyle(r),
                    i = n.fontSize,
                    a = n.letterSpacing;
                  (i !== m || a !== b) && (g(i), x(a));
                }
              }
            },
            [m, b]
          );
          return s || (null != i && i <= 0) || (null != a && a <= 0)
            ? null
            : n.createElement(
                p.$,
                { zIndex: e.zIndex },
                n.createElement(
                  c.m,
                  { className: (0, o.W)('recharts-cartesian-axis', l) },
                  n.createElement(C, {
                    x: e.x,
                    y: e.y,
                    width: i,
                    height: a,
                    orientation: e.orientation,
                    mirror: e.mirror,
                    axisLine: r,
                    otherSvgProps: (0, v.qq)(e),
                  }),
                  n.createElement(S, {
                    ref: E,
                    axisType: f,
                    events: h,
                    fontSize: m,
                    getTicksConfig: e,
                    height: e.height,
                    letterSpacing: b,
                    mirror: e.mirror,
                    orientation: e.orientation,
                    padding: e.padding,
                    stroke: e.stroke,
                    tick: e.tick,
                    tickFormatter: e.tickFormatter,
                    tickLine: e.tickLine,
                    tickMargin: e.tickMargin,
                    tickSize: e.tickSize,
                    tickTextProps: e.tickTextProps,
                    ticks: d,
                    unit: e.unit,
                    width: e.width,
                    x: e.x,
                    y: e.y,
                  }),
                  n.createElement(
                    u.Wp,
                    {
                      x: e.x,
                      y: e.y,
                      width: e.width,
                      height: e.height,
                      lowerWidth: e.width,
                      upperWidth: e.width,
                    },
                    n.createElement(u.tD, { label: e.label, labelRef: e.labelRef }),
                    e.children
                  )
                )
              );
        }),
        D = n.memo(A, (e, t) => {
          var { viewBox: r } = e,
            n = O(e, b),
            { viewBox: i } = t,
            a = O(t, x);
          return (0, l.w)(r, i) && (0, l.w)(n, a);
        }),
        I = n.forwardRef((e, t) => {
          var r = (0, m.j)(e, j);
          return n.createElement(D, k({}, r, { ref: t }));
        });
      I.displayName = 'CartesianAxis';
    },
    56940: function (e, t, r) {
      r.d(t, {
        q: function () {
          return M;
        },
      });
      var n = r(2265),
        i = r(1175),
        a = r(16630),
        o = r(49037),
        l = r(12983),
        c = r(87788),
        s = r(35953),
        u = r(9666),
        d = r(39040),
        f = r(58735),
        h = r(40130),
        v = r(51221),
        y = r(66395),
        m = r(48002),
        p = r(73928),
        g = ['x1', 'y1', 'x2', 'y2', 'key'],
        w = ['offset'],
        b = ['xAxisId', 'yAxisId'],
        x = ['xAxisId', 'yAxisId'];
      function O(e, t) {
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
            ? O(Object(r), !0).forEach(function (t) {
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
              : O(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      function E() {
        return (E = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function P(e, t) {
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
      var j = (e) => {
        var { fill: t } = e;
        if (!t || 'none' === t) return null;
        var { fillOpacity: r, x: i, y: a, width: o, height: l, ry: c } = e;
        return n.createElement('rect', {
          x: i,
          y: a,
          ry: c,
          width: o,
          height: l,
          stroke: 'none',
          fill: t,
          fillOpacity: r,
          className: 'recharts-cartesian-grid-bg',
        });
      };
      function C(e) {
        var { option: t, lineItemProps: r } = e;
        if (n.isValidElement(t)) i = n.cloneElement(t, r);
        else if ('function' == typeof t) i = t(r);
        else {
          var i,
            a,
            { x1: o, y1: l, x2: c, y2: s, key: u } = r,
            d = P(r, g),
            f = null !== (a = (0, v.qq)(d)) && void 0 !== a ? a : {},
            { offset: h } = f,
            y = P(f, w);
          i = n.createElement(
            'line',
            E({}, y, { x1: o, y1: l, x2: c, y2: s, fill: 'none', key: u })
          );
        }
        return i;
      }
      function N(e) {
        var { x: t, width: r, horizontal: i = !0, horizontalPoints: a } = e;
        if (!i || !a || !a.length) return null;
        var { xAxisId: o, yAxisId: l } = e,
          c = P(e, b),
          s = a.map((e, a) => {
            var o = k(
              k({}, c),
              {},
              { x1: t, y1: e, x2: t + r, y2: e, key: 'line-'.concat(a), index: a }
            );
            return n.createElement(C, { key: 'line-'.concat(a), option: i, lineItemProps: o });
          });
        return n.createElement('g', { className: 'recharts-cartesian-grid-horizontal' }, s);
      }
      function S(e) {
        var { y: t, height: r, vertical: i = !0, verticalPoints: a } = e;
        if (!i || !a || !a.length) return null;
        var { xAxisId: o, yAxisId: l } = e,
          c = P(e, x),
          s = a.map((e, a) => {
            var o = k(
              k({}, c),
              {},
              { x1: e, y1: t, x2: e, y2: t + r, key: 'line-'.concat(a), index: a }
            );
            return n.createElement(C, { option: i, lineItemProps: o, key: 'line-'.concat(a) });
          });
        return n.createElement('g', { className: 'recharts-cartesian-grid-vertical' }, s);
      }
      function A(e) {
        var {
          horizontalFill: t,
          fillOpacity: r,
          x: i,
          y: a,
          width: o,
          height: l,
          horizontalPoints: c,
          horizontal: s = !0,
        } = e;
        if (!s || !t || !t.length || null == c) return null;
        var u = c.map((e) => Math.round(e + a - a)).sort((e, t) => e - t);
        a !== u[0] && u.unshift(0);
        var d = u.map((e, c) => {
          var s = u[c + 1] ? u[c + 1] - e : a + l - e;
          if (s <= 0) return null;
          var d = c % t.length;
          return n.createElement('rect', {
            key: 'react-'.concat(c),
            y: e,
            x: i,
            height: s,
            width: o,
            stroke: 'none',
            fill: t[d],
            fillOpacity: r,
            className: 'recharts-cartesian-grid-bg',
          });
        });
        return n.createElement('g', { className: 'recharts-cartesian-gridstripes-horizontal' }, d);
      }
      function D(e) {
        var {
          vertical: t = !0,
          verticalFill: r,
          fillOpacity: i,
          x: a,
          y: o,
          width: l,
          height: c,
          verticalPoints: s,
        } = e;
        if (!t || !r || !r.length) return null;
        var u = s.map((e) => Math.round(e + a - a)).sort((e, t) => e - t);
        a !== u[0] && u.unshift(0);
        var d = u.map((e, t) => {
          var s = u[t + 1] ? u[t + 1] - e : a + l - e;
          if (s <= 0) return null;
          var d = t % r.length;
          return n.createElement('rect', {
            key: 'react-'.concat(t),
            x: e,
            y: o,
            width: s,
            height: c,
            stroke: 'none',
            fill: r[d],
            fillOpacity: i,
            className: 'recharts-cartesian-grid-bg',
          });
        });
        return n.createElement('g', { className: 'recharts-cartesian-gridstripes-vertical' }, d);
      }
      var I = (e, t) => {
          var { xAxis: r, width: n, height: i, offset: a } = e;
          return (0, o.Rf)(
            (0, l.f)(
              k(
                k(k({}, c.m), r),
                {},
                { ticks: (0, o.uY)(r, !0), viewBox: { x: 0, y: 0, width: n, height: i } }
              )
            ),
            a.left,
            a.left + a.width,
            t
          );
        },
        z = (e, t) => {
          var { yAxis: r, width: n, height: i, offset: a } = e;
          return (0, o.Rf)(
            (0, l.f)(
              k(
                k(k({}, c.m), r),
                {},
                { ticks: (0, o.uY)(r, !0), viewBox: { x: 0, y: 0, width: n, height: i } }
              )
            ),
            a.top,
            a.top + a.height,
            t
          );
        },
        W = {
          horizontal: !0,
          vertical: !0,
          horizontalPoints: [],
          verticalPoints: [],
          stroke: '#ccc',
          fill: 'none',
          verticalFill: [],
          horizontalFill: [],
          xAxisId: 0,
          yAxisId: 0,
          syncWithTicks: !1,
          zIndex: p.N.grid,
        };
      function M(e) {
        var t = (0, s.zn)(),
          r = (0, s.Mw)(),
          o = (0, s.rh)(),
          l = k(
            k({}, (0, h.j)(e, W)),
            {},
            {
              x: (0, a.hj)(e.x) ? e.x : o.left,
              y: (0, a.hj)(e.y) ? e.y : o.top,
              width: (0, a.hj)(e.width) ? e.width : o.width,
              height: (0, a.hj)(e.height) ? e.height : o.height,
            }
          ),
          {
            xAxisId: c,
            yAxisId: v,
            x: p,
            y: g,
            width: w,
            height: b,
            syncWithTicks: x,
            horizontalValues: O,
            verticalValues: P,
          } = l,
          C = (0, f.W)(),
          M = (0, d.C)((e) => (0, u.Lg)(e, 'xAxis', c, C)),
          R = (0, d.C)((e) => (0, u.Lg)(e, 'yAxis', v, C));
        if (!(0, y.r)(w) || !(0, y.r)(b) || !(0, a.hj)(p) || !(0, a.hj)(g)) return null;
        var T = l.verticalCoordinatesGenerator || I,
          B = l.horizontalCoordinatesGenerator || z,
          { horizontalPoints: G, verticalPoints: L } = l;
        if ((!G || !G.length) && 'function' == typeof B) {
          var q = O && O.length,
            F = B(
              {
                yAxis: R ? k(k({}, R), {}, { ticks: q ? O : R.ticks }) : void 0,
                width: null != t ? t : w,
                height: null != r ? r : b,
                offset: o,
              },
              !!q || x
            );
          ((0, i.Z)(
            Array.isArray(F),
            'horizontalCoordinatesGenerator should return Array but instead it returned ['.concat(
              typeof F,
              ']'
            )
          ),
            Array.isArray(F) && (G = F));
        }
        if ((!L || !L.length) && 'function' == typeof T) {
          var H = P && P.length,
            V = T(
              {
                xAxis: M ? k(k({}, M), {}, { ticks: H ? P : M.ticks }) : void 0,
                width: null != t ? t : w,
                height: null != r ? r : b,
                offset: o,
              },
              !!H || x
            );
          ((0, i.Z)(
            Array.isArray(V),
            'verticalCoordinatesGenerator should return Array but instead it returned ['.concat(
              typeof V,
              ']'
            )
          ),
            Array.isArray(V) && (L = V));
        }
        return n.createElement(
          m.$,
          { zIndex: l.zIndex },
          n.createElement(
            'g',
            { className: 'recharts-cartesian-grid' },
            n.createElement(j, {
              fill: l.fill,
              fillOpacity: l.fillOpacity,
              x: l.x,
              y: l.y,
              width: l.width,
              height: l.height,
              ry: l.ry,
            }),
            n.createElement(A, E({}, l, { horizontalPoints: G })),
            n.createElement(D, E({}, l, { verticalPoints: L })),
            n.createElement(N, E({}, l, { offset: o, horizontalPoints: G, xAxis: M, yAxis: R })),
            n.createElement(S, E({}, l, { offset: o, verticalPoints: L, xAxis: M, yAxis: R }))
          )
        );
      }
      M.displayName = 'CartesianGrid';
    },
    45702: function (e, t, r) {
      r.d(t, {
        N: function () {
          return l;
        },
        W: function () {
          return c;
        },
      });
      var n = r(2265),
        i = r(39040),
        a = r(9666),
        o = r(7986);
      function l(e, t) {
        var r,
          n,
          o = (0, i.C)((t) => (0, a.i9)(t, e)),
          l = (0, i.C)((e) => (0, a.t)(e, t)),
          c =
            null !== (r = null == o ? void 0 : o.allowDataOverflow) && void 0 !== r
              ? r
              : a.dW.allowDataOverflow,
          s =
            null !== (n = null == l ? void 0 : l.allowDataOverflow) && void 0 !== n
              ? n
              : a.RN.allowDataOverflow;
        return { needClip: c || s, needClipX: c, needClipY: s };
      }
      function c(e) {
        var { xAxisId: t, yAxisId: r, clipPathId: i } = e,
          a = (0, o.$$)(),
          { needClipX: c, needClipY: s, needClip: u } = l(t, r);
        if (!u || !a) return null;
        var { x: d, y: f, width: h, height: v } = a;
        return n.createElement(
          'clipPath',
          { id: 'clipPath-'.concat(i) },
          n.createElement('rect', {
            x: c ? d : d - h / 2,
            y: s ? f : f - v / 2,
            width: c ? h : 2 * h,
            height: s ? v : 2 * v,
          })
        );
      }
    },
    97059: function (e, t, r) {
      r.d(t, {
        K: function () {
          return O;
        },
      });
      var n = r(2265),
        i = r(61994),
        a = r(87788),
        o = r(39040),
        l = r(17644),
        c = r(9666),
        s = r(74653),
        u = r(58735),
        d = r(46485),
        f = r(40130),
        h = ['dangerouslySetInnerHTML', 'ticks'],
        v = ['id'],
        y = ['domain'],
        m = ['domain'];
      function p() {
        return (p = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      function g(e, t) {
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
      function w(e) {
        var t = (0, o.T)();
        return (
          (0, n.useLayoutEffect)(
            () => (
              t((0, l.m2)(e)),
              () => {
                t((0, l.Jj)(e));
              }
            ),
            [e, t]
          ),
          null
        );
      }
      var b = (e) => {
          var { xAxisId: t, className: r } = e,
            l = (0, o.C)(s.zM),
            d = (0, u.W)(),
            f = 'xAxis',
            y = (0, o.C)((e) => (0, c.Vm)(e, f, t, d)),
            m = (0, o.C)((e) => (0, c.ox)(e, f, t, d)),
            w = (0, o.C)((e) => (0, c.Oy)(e, t)),
            b = (0, o.C)((e) => (0, c.rs)(e, t)),
            x = (0, o.C)((e) => (0, c.Dy)(e, t));
          if (null == w || null == b || null == x) return null;
          var { dangerouslySetInnerHTML: O, ticks: k } = e,
            E = g(e, h),
            { id: P } = x,
            j = g(x, v);
          return n.createElement(
            a.O,
            p({}, E, j, {
              scale: y,
              x: b.x,
              y: b.y,
              width: w.width,
              height: w.height,
              className: (0, i.W)('recharts-'.concat(f, ' ').concat(f), r),
              viewBox: l,
              ticks: m,
              axisType: f,
            })
          );
        },
        x = {
          allowDataOverflow: c.dW.allowDataOverflow,
          allowDecimals: c.dW.allowDecimals,
          allowDuplicatedCategory: c.dW.allowDuplicatedCategory,
          height: c.dW.height,
          hide: !1,
          mirror: c.dW.mirror,
          orientation: c.dW.orientation,
          padding: c.dW.padding,
          reversed: c.dW.reversed,
          scale: c.dW.scale,
          tickCount: c.dW.tickCount,
          type: c.dW.type,
          xAxisId: 0,
        },
        O = n.memo(
          (e) => {
            var t,
              r,
              i,
              a,
              o,
              l = (0, f.j)(e, x);
            return n.createElement(
              n.Fragment,
              null,
              n.createElement(w, {
                interval: null !== (t = l.interval) && void 0 !== t ? t : 'preserveEnd',
                id: l.xAxisId,
                scale: l.scale,
                type: l.type,
                padding: l.padding,
                allowDataOverflow: l.allowDataOverflow,
                domain: l.domain,
                dataKey: l.dataKey,
                allowDuplicatedCategory: l.allowDuplicatedCategory,
                allowDecimals: l.allowDecimals,
                tickCount: l.tickCount,
                includeHidden: null !== (r = l.includeHidden) && void 0 !== r && r,
                reversed: l.reversed,
                ticks: l.ticks,
                height: l.height,
                orientation: l.orientation,
                mirror: l.mirror,
                hide: l.hide,
                unit: l.unit,
                name: l.name,
                angle: null !== (i = l.angle) && void 0 !== i ? i : 0,
                minTickGap: null !== (a = l.minTickGap) && void 0 !== a ? a : 5,
                tick: null === (o = l.tick) || void 0 === o || o,
                tickFormatter: l.tickFormatter,
              }),
              n.createElement(b, l)
            );
          },
          (e, t) => {
            var { domain: r } = e,
              n = g(e, y),
              { domain: i } = t,
              a = g(t, m);
            return (
              !!(0, d.w)(n, a) &&
              (Array.isArray(r) && 2 === r.length && Array.isArray(i) && 2 === i.length
                ? r[0] === i[0] && r[1] === i[1]
                : (0, d.w)({ domain: r }, { domain: i }))
            );
          }
        );
      O.displayName = 'XAxis';
    },
    62994: function (e, t, r) {
      r.d(t, {
        B: function () {
          return k;
        },
      });
      var n = r(2265),
        i = r(61994),
        a = r(87788),
        o = r(17644),
        l = r(39040),
        c = r(9666),
        s = r(74653),
        u = r(58735),
        d = r(26680),
        f = r(46485),
        h = r(40130),
        v = ['dangerouslySetInnerHTML', 'ticks'],
        y = ['id'],
        m = ['domain'],
        p = ['domain'];
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
      function w(e, t) {
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
      function b(e) {
        var t = (0, l.T)();
        return (
          (0, n.useLayoutEffect)(
            () => (
              t((0, o.TC)(e)),
              () => {
                t((0, o.cB)(e));
              }
            ),
            [e, t]
          ),
          null
        );
      }
      var x = (e) => {
          var { yAxisId: t, className: r, width: f, label: h } = e,
            m = (0, n.useRef)(null),
            p = (0, n.useRef)(null),
            b = (0, l.C)(s.zM),
            x = (0, u.W)(),
            O = (0, l.T)(),
            k = 'yAxis',
            E = (0, l.C)((e) => (0, c.Vm)(e, k, t, x)),
            P = (0, l.C)((e) => (0, c.ON)(e, t)),
            j = (0, l.C)((e) => (0, c.lU)(e, t)),
            C = (0, l.C)((e) => (0, c.ox)(e, k, t, x)),
            N = (0, l.C)((e) => (0, c.Td)(e, t));
          if (
            ((0, n.useLayoutEffect)(() => {
              if (!('auto' !== f || !P || (0, d.dM)(h) || (0, n.isValidElement)(h)) && null != N) {
                var e = m.current;
                if (e) {
                  var r = e.getCalculatedWidth();
                  Math.round(P.width) !== Math.round(r) && O((0, o.kB)({ id: t, width: r }));
                }
              }
            }, [C, P, O, h, t, f, N]),
            null == P || null == j || null == N)
          )
            return null;
          var { dangerouslySetInnerHTML: S, ticks: A } = e,
            D = w(e, v),
            { id: I } = N,
            z = w(N, y);
          return n.createElement(
            a.O,
            g({}, D, z, {
              ref: m,
              labelRef: p,
              scale: E,
              x: j.x,
              y: j.y,
              tickTextProps: 'auto' === f ? { width: void 0 } : { width: f },
              width: P.width,
              height: P.height,
              className: (0, i.W)('recharts-'.concat(k, ' ').concat(k), r),
              viewBox: b,
              ticks: C,
              axisType: k,
            })
          );
        },
        O = {
          allowDataOverflow: c.RN.allowDataOverflow,
          allowDecimals: c.RN.allowDecimals,
          allowDuplicatedCategory: c.RN.allowDuplicatedCategory,
          hide: !1,
          mirror: c.RN.mirror,
          orientation: c.RN.orientation,
          padding: c.RN.padding,
          reversed: c.RN.reversed,
          scale: c.RN.scale,
          tickCount: c.RN.tickCount,
          type: c.RN.type,
          width: c.RN.width,
          yAxisId: 0,
        },
        k = n.memo(
          (e) => {
            var t,
              r,
              i,
              a,
              o,
              l = (0, h.j)(e, O);
            return n.createElement(
              n.Fragment,
              null,
              n.createElement(b, {
                interval: null !== (t = l.interval) && void 0 !== t ? t : 'preserveEnd',
                id: l.yAxisId,
                scale: l.scale,
                type: l.type,
                domain: l.domain,
                allowDataOverflow: l.allowDataOverflow,
                dataKey: l.dataKey,
                allowDuplicatedCategory: l.allowDuplicatedCategory,
                allowDecimals: l.allowDecimals,
                tickCount: l.tickCount,
                padding: l.padding,
                includeHidden: null !== (r = l.includeHidden) && void 0 !== r && r,
                reversed: l.reversed,
                ticks: l.ticks,
                width: l.width,
                orientation: l.orientation,
                mirror: l.mirror,
                hide: l.hide,
                unit: l.unit,
                name: l.name,
                angle: null !== (i = l.angle) && void 0 !== i ? i : 0,
                minTickGap: null !== (a = l.minTickGap) && void 0 !== a ? a : 5,
                tick: null === (o = l.tick) || void 0 === o || o,
                tickFormatter: l.tickFormatter,
              }),
              n.createElement(x, l)
            );
          },
          (e, t) => {
            var { domain: r } = e,
              n = w(e, m),
              { domain: i } = t,
              a = w(t, p);
            return (
              !!(0, f.w)(n, a) &&
              (Array.isArray(r) && 2 === r.length && Array.isArray(i) && 2 === i.length
                ? r[0] === i[0] && r[1] === i[1]
                : (0, f.w)({ domain: r }, { domain: i }))
            );
          }
        );
      k.displayName = 'YAxis';
    },
    12983: function (e, t, r) {
      r.d(t, {
        f: function () {
          return v;
        },
      });
      var n,
        i,
        a = r(16630),
        o = r(96908),
        l = r(34067);
      class c {
        static create(e) {
          return new c(e);
        }
        get domain() {
          return this.scale.domain;
        }
        get range() {
          return this.scale.range;
        }
        get rangeMin() {
          return this.range()[0];
        }
        get rangeMax() {
          return this.range()[1];
        }
        get bandwidth() {
          return this.scale.bandwidth;
        }
        apply(e) {
          var { bandAware: t, position: r } =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          if (void 0 !== e) {
            if (r)
              switch (r) {
                case 'start':
                default:
                  return this.scale(e);
                case 'middle':
                  var n = this.bandwidth ? this.bandwidth() / 2 : 0;
                  return this.scale(e) + n;
                case 'end':
                  var i = this.bandwidth ? this.bandwidth() : 0;
                  return this.scale(e) + i;
              }
            if (t) {
              var a = this.bandwidth ? this.bandwidth() / 2 : 0;
              return this.scale(e) + a;
            }
            return this.scale(e);
          }
        }
        isInRange(e) {
          var t = this.range(),
            r = t[0],
            n = t[t.length - 1];
          return r <= n ? e >= r && e <= n : e >= n && e <= r;
        }
        constructor(e) {
          this.scale = e;
        }
      }
      (i =
        'symbol' ==
        typeof (n = (function (e, t) {
          if ('object' != typeof e || !e) return e;
          var r = e[Symbol.toPrimitive];
          if (void 0 !== r) {
            var n = r.call(e, t || 'default');
            if ('object' != typeof n) return n;
            throw TypeError('@@toPrimitive must return a primitive value.');
          }
          return ('string' === t ? String : Number)(e);
        })((i = 'EPS'), 'string'))
          ? n
          : n + '') in c
        ? Object.defineProperty(c, i, {
            value: 1e-4,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (c[i] = 1e-4);
      var s = function (e) {
        var { width: t, height: r } = e,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
          i = ((((n % 180) + 180) % 180) * Math.PI) / 180,
          a = Math.atan(r / t);
        return Math.abs(i > a && i < Math.PI - a ? r / Math.sin(i) : t / Math.cos(i));
      };
      function u(e, t) {
        if (t < 1) return [];
        if (1 === t) return e;
        for (var r = [], n = 0; n < e.length; n += t) r.push(e[n]);
        return r;
      }
      function d(e, t, r, n, i) {
        if (e * t < e * n || e * t > e * i) return !1;
        var a = r();
        return e * (t - (e * a) / 2 - n) >= 0 && e * (t + (e * a) / 2 - i) <= 0;
      }
      function f(e, t) {
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
      function h(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? f(Object(r), !0).forEach(function (t) {
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
              : f(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
        }
        return e;
      }
      function v(e, t, r) {
        var n,
          {
            tick: i,
            ticks: c,
            viewBox: f,
            minTickGap: v,
            orientation: y,
            interval: m,
            tickFormatter: p,
            unit: g,
            angle: w,
          } = e;
        if (!c || !c.length || !i) return [];
        if ((0, a.hj)(m) || l.x.isSsr)
          return null !== (n = u(c, ((0, a.hj)(m) ? m : 0) + 1)) && void 0 !== n ? n : [];
        var b = 'top' === y || 'bottom' === y ? 'width' : 'height',
          x =
            g && 'width' === b
              ? (0, o.xE)(g, { fontSize: t, letterSpacing: r })
              : { width: 0, height: 0 },
          O = (e, n) => {
            var i,
              a = 'function' == typeof p ? p(e.value, n) : e.value;
            return 'width' === b
              ? s(
                  {
                    width: (i = (0, o.xE)(a, { fontSize: t, letterSpacing: r })).width + x.width,
                    height: i.height + x.height,
                  },
                  w
                )
              : (0, o.xE)(a, { fontSize: t, letterSpacing: r })[b];
          },
          k = c.length >= 2 ? (0, a.uY)(c[1].coordinate - c[0].coordinate) : 1,
          E = (function (e, t, r) {
            var n = 'width' === r,
              { x: i, y: a, width: o, height: l } = e;
            return 1 === t
              ? { start: n ? i : a, end: n ? i + o : a + l }
              : { start: n ? i + o : a + l, end: n ? i : a };
          })(f, k, b);
        return 'equidistantPreserveStart' === m
          ? (function (e, t, r, n, i) {
              for (
                var a, o = (n || []).slice(), { start: l, end: c } = t, s = 0, f = 1, h = l;
                f <= o.length;

              )
                if (
                  (a = (function () {
                    var t,
                      a = null == n ? void 0 : n[s];
                    if (void 0 === a) return { v: u(n, f) };
                    var o = s,
                      v = () => (void 0 === t && (t = r(a, o)), t),
                      y = a.coordinate,
                      m = 0 === s || d(e, y, v, h, c);
                    (m || ((s = 0), (h = l), (f += 1)),
                      m && ((h = y + e * (v() / 2 + i)), (s += f)));
                  })())
                )
                  return a.v;
              return [];
            })(k, E, O, c, v)
          : ('preserveStart' === m || 'preserveStartEnd' === m
              ? (function (e, t, r, n, i, a) {
                  var o = (n || []).slice(),
                    l = o.length,
                    { start: c, end: s } = t;
                  if (a) {
                    var u = n[l - 1],
                      f = r(u, l - 1),
                      v = e * (u.coordinate + (e * f) / 2 - s);
                    ((o[l - 1] = u =
                      h(h({}, u), {}, { tickCoord: v > 0 ? u.coordinate - v * e : u.coordinate })),
                      null != u.tickCoord &&
                        d(e, u.tickCoord, () => f, c, s) &&
                        ((s = u.tickCoord - e * (f / 2 + i)),
                        (o[l - 1] = h(h({}, u), {}, { isShow: !0 }))));
                  }
                  for (
                    var y = a ? l - 1 : l,
                      m = function (t) {
                        var n,
                          a = o[t],
                          l = () => (void 0 === n && (n = r(a, t)), n);
                        if (0 === t) {
                          var u = e * (a.coordinate - (e * l()) / 2 - c);
                          o[t] = a = h(
                            h({}, a),
                            {},
                            { tickCoord: u < 0 ? a.coordinate - u * e : a.coordinate }
                          );
                        } else o[t] = a = h(h({}, a), {}, { tickCoord: a.coordinate });
                        null != a.tickCoord &&
                          d(e, a.tickCoord, l, c, s) &&
                          ((c = a.tickCoord + e * (l() / 2 + i)),
                          (o[t] = h(h({}, a), {}, { isShow: !0 })));
                      },
                      p = 0;
                    p < y;
                    p++
                  )
                    m(p);
                  return o;
                })(k, E, O, c, v, 'preserveStartEnd' === m)
              : (function (e, t, r, n, i) {
                  for (
                    var a = (n || []).slice(),
                      o = a.length,
                      { start: l } = t,
                      { end: c } = t,
                      s = function (t) {
                        var n,
                          s = a[t],
                          u = () => (void 0 === n && (n = r(s, t)), n);
                        if (t === o - 1) {
                          var f = e * (s.coordinate + (e * u()) / 2 - c);
                          a[t] = s = h(
                            h({}, s),
                            {},
                            { tickCoord: f > 0 ? s.coordinate - f * e : s.coordinate }
                          );
                        } else a[t] = s = h(h({}, s), {}, { tickCoord: s.coordinate });
                        null != s.tickCoord &&
                          d(e, s.tickCoord, u, l, c) &&
                          ((c = s.tickCoord - e * (u() / 2 + i)),
                          (a[t] = h(h({}, s), {}, { isShow: !0 })));
                      },
                      u = o - 1;
                    u >= 0;
                    u--
                  )
                    s(u);
                  return a;
                })(k, E, O, c, v)
            ).filter((e) => e.isShow);
      }
    },
    43841: function (e, t, r) {
      r.d(t, {
        R: function () {
          return f;
        },
      });
      var n = r(2265),
        i = r(1769),
        a = r(1196),
        o = r(87235),
        l = r(15317),
        c = r(37274),
        s = r(40130);
      function u() {
        return (u = Object.assign
          ? Object.assign.bind()
          : function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
              }
              return e;
            }).apply(null, arguments);
      }
      var d = {
          accessibilityLayer: !0,
          layout: 'horizontal',
          stackOffset: 'none',
          barCategoryGap: '10%',
          barGap: 4,
          margin: { top: 5, right: 5, bottom: 5, left: 5 },
          reverseStackOrder: !1,
          syncMethod: 'index',
          responsive: !1,
        },
        f = (0, n.forwardRef)(function (e, t) {
          var r,
            f = (0, s.j)(e.categoricalChartProps, d),
            {
              chartName: h,
              defaultTooltipEventType: v,
              validateTooltipEventTypes: y,
              tooltipPayloadSearcher: m,
              categoricalChartProps: p,
            } = e;
          return n.createElement(
            i.M,
            {
              preloadedState: {
                options: {
                  chartName: h,
                  defaultTooltipEventType: v,
                  validateTooltipEventTypes: y,
                  tooltipPayloadSearcher: m,
                  eventEmitter: void 0,
                },
              },
              reduxStoreName: null !== (r = p.id) && void 0 !== r ? r : h,
            },
            n.createElement(a.gt, { chartData: p.data }),
            n.createElement(o.v, { layout: f.layout, margin: f.margin }),
            n.createElement(l.b, {
              baseValue: f.baseValue,
              accessibilityLayer: f.accessibilityLayer,
              barCategoryGap: f.barCategoryGap,
              maxBarSize: f.maxBarSize,
              stackOffset: f.stackOffset,
              barGap: f.barGap,
              barSize: f.barSize,
              syncId: f.syncId,
              syncMethod: f.syncMethod,
              className: f.className,
            }),
            n.createElement(c.r, u({}, f, { ref: t }))
          );
        });
    },
    84815: function (e, t, r) {
      r.d(t, {
        zU: function () {
          return o;
        },
      });
      var n = r(2265),
        i = ['children'],
        a = (0, n.createContext)({
          data: [],
          xAxisId: 'xAxis-0',
          yAxisId: 'yAxis-0',
          dataPointFormatter: () => ({ x: 0, y: 0, value: 0 }),
          errorBarOffset: 0,
        });
      function o(e) {
        var { children: t } = e,
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
          })(e, i);
        return n.createElement(a.Provider, { value: r }, t);
      }
    },
    46485: function (e, t, r) {
      r.d(t, {
        w: function () {
          return n;
        },
      });
      function n(e, t) {
        for (var r in e)
          if ({}.hasOwnProperty.call(e, r) && (!{}.hasOwnProperty.call(t, r) || e[r] !== t[r]))
            return !1;
        for (var n in t)
          if ({}.hasOwnProperty.call(t, n) && !{}.hasOwnProperty.call(e, n)) return !1;
        return !0;
      }
    },
  },
]);
