'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [9750],
  {
    27648: function (e, t, n) {
      n.d(t, {
        default: function () {
          return a.a;
        },
      });
      var r = n(72972),
        a = n.n(r);
    },
    55449: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'addLocale', {
          enumerable: !0,
          get: function () {
            return r;
          },
        }),
        n(33068));
      let r = function (e) {
        for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
          n[r - 1] = arguments[r];
        return e;
      };
      ('function' == typeof t.default || ('object' == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, '__esModule', { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    56958: function (e, t, n) {
      function r(e, t, n, r) {
        return !1;
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'getDomainLocale', {
          enumerable: !0,
          get: function () {
            return r;
          },
        }),
        n(33068),
        ('function' == typeof t.default || ('object' == typeof t.default && null !== t.default)) &&
          void 0 === t.default.__esModule &&
          (Object.defineProperty(t.default, '__esModule', { value: !0 }),
          Object.assign(t.default, t),
          (e.exports = t.default)));
    },
    72972: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'default', {
          enumerable: !0,
          get: function () {
            return b;
          },
        }));
      let r = n(47043),
        a = n(57437),
        o = r._(n(2265)),
        i = n(25246),
        u = n(53552),
        s = n(57497),
        l = n(3987),
        c = n(55449),
        f = n(25523),
        d = n(61956),
        p = n(16081),
        h = n(56958),
        m = n(1634),
        g = n(24673),
        _ = new Set();
      function y(e, t, n, r, a, o) {
        if ('undefined' != typeof window && (o || (0, u.isLocalURL)(t))) {
          if (!r.bypassPrefetchedCheck) {
            let a =
              t +
              '%' +
              n +
              '%' +
              (void 0 !== r.locale ? r.locale : 'locale' in e ? e.locale : void 0);
            if (_.has(a)) return;
            _.add(a);
          }
          (async () => (o ? e.prefetch(t, a) : e.prefetch(t, n, r)))().catch((e) => {});
        }
      }
      function E(e) {
        return 'string' == typeof e ? e : (0, s.formatUrl)(e);
      }
      let b = o.default.forwardRef(function (e, t) {
        let n, r;
        let {
          href: s,
          as: _,
          children: b,
          prefetch: R = null,
          passHref: P,
          replace: S,
          shallow: v,
          scroll: A,
          locale: O,
          onClick: T,
          onMouseEnter: N,
          onTouchStart: k,
          legacyBehavior: I = !1,
          ...M
        } = e;
        ((n = b),
          I &&
            ('string' == typeof n || 'number' == typeof n) &&
            (n = (0, a.jsx)('a', { children: n })));
        let C = o.default.useContext(f.RouterContext),
          w = o.default.useContext(d.AppRouterContext),
          x = null != C ? C : w,
          j = !C,
          L = !1 !== R,
          D = null === R ? g.PrefetchKind.AUTO : g.PrefetchKind.FULL,
          { href: W, as: U } = o.default.useMemo(() => {
            if (!C) {
              let e = E(s);
              return { href: e, as: _ ? E(_) : e };
            }
            let [e, t] = (0, i.resolveHref)(C, s, !0);
            return { href: e, as: _ ? (0, i.resolveHref)(C, _) : t || e };
          }, [C, s, _]),
          z = o.default.useRef(W),
          X = o.default.useRef(U);
        I && (r = o.default.Children.only(n));
        let H = I ? r && 'object' == typeof r && r.ref : t,
          [F, Y, G] = (0, p.useIntersection)({ rootMargin: '200px' }),
          K = o.default.useCallback(
            (e) => {
              ((X.current !== U || z.current !== W) && (G(), (X.current = U), (z.current = W)),
                F(e),
                H && ('function' == typeof H ? H(e) : 'object' == typeof H && (H.current = e)));
            },
            [U, H, W, G, F]
          );
        o.default.useEffect(() => {
          x && Y && L && y(x, W, U, { locale: O }, { kind: D }, j);
        }, [U, W, Y, O, L, null == C ? void 0 : C.locale, x, j, D]);
        let B = {
          ref: K,
          onClick(e) {
            (I || 'function' != typeof T || T(e),
              I && r.props && 'function' == typeof r.props.onClick && r.props.onClick(e),
              x &&
                !e.defaultPrevented &&
                (function (e, t, n, r, a, i, s, l, c) {
                  let { nodeName: f } = e.currentTarget;
                  if (
                    'A' === f.toUpperCase() &&
                    ((function (e) {
                      let t = e.currentTarget.getAttribute('target');
                      return (
                        (t && '_self' !== t) ||
                        e.metaKey ||
                        e.ctrlKey ||
                        e.shiftKey ||
                        e.altKey ||
                        (e.nativeEvent && 2 === e.nativeEvent.which)
                      );
                    })(e) ||
                      (!c && !(0, u.isLocalURL)(n)))
                  )
                    return;
                  e.preventDefault();
                  let d = () => {
                    let e = null == s || s;
                    'beforePopState' in t
                      ? t[a ? 'replace' : 'push'](n, r, { shallow: i, locale: l, scroll: e })
                      : t[a ? 'replace' : 'push'](r || n, { scroll: e });
                  };
                  c ? o.default.startTransition(d) : d();
                })(e, x, W, U, S, v, A, O, j));
          },
          onMouseEnter(e) {
            (I || 'function' != typeof N || N(e),
              I && r.props && 'function' == typeof r.props.onMouseEnter && r.props.onMouseEnter(e),
              x &&
                (L || !j) &&
                y(x, W, U, { locale: O, priority: !0, bypassPrefetchedCheck: !0 }, { kind: D }, j));
          },
          onTouchStart: function (e) {
            (I || 'function' != typeof k || k(e),
              I && r.props && 'function' == typeof r.props.onTouchStart && r.props.onTouchStart(e),
              x &&
                (L || !j) &&
                y(x, W, U, { locale: O, priority: !0, bypassPrefetchedCheck: !0 }, { kind: D }, j));
          },
        };
        if ((0, l.isAbsoluteUrl)(U)) B.href = U;
        else if (!I || P || ('a' === r.type && !('href' in r.props))) {
          let e = void 0 !== O ? O : null == C ? void 0 : C.locale,
            t =
              (null == C ? void 0 : C.isLocaleDomain) &&
              (0, h.getDomainLocale)(
                U,
                e,
                null == C ? void 0 : C.locales,
                null == C ? void 0 : C.domainLocales
              );
          B.href =
            t || (0, m.addBasePath)((0, c.addLocale)(U, e, null == C ? void 0 : C.defaultLocale));
        }
        return I ? o.default.cloneElement(r, B) : (0, a.jsx)('a', { ...M, ...B, children: n });
      });
      ('function' == typeof t.default || ('object' == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, '__esModule', { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    63515: function (e, t) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var n in t) Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
        })(t, {
          cancelIdleCallback: function () {
            return r;
          },
          requestIdleCallback: function () {
            return n;
          },
        }));
      let n =
          ('undefined' != typeof self &&
            self.requestIdleCallback &&
            self.requestIdleCallback.bind(window)) ||
          function (e) {
            let t = Date.now();
            return self.setTimeout(function () {
              e({
                didTimeout: !1,
                timeRemaining: function () {
                  return Math.max(0, 50 - (Date.now() - t));
                },
              });
            }, 1);
          },
        r =
          ('undefined' != typeof self &&
            self.cancelIdleCallback &&
            self.cancelIdleCallback.bind(window)) ||
          function (e) {
            return clearTimeout(e);
          };
      ('function' == typeof t.default || ('object' == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, '__esModule', { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    25246: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'resolveHref', {
          enumerable: !0,
          get: function () {
            return f;
          },
        }));
      let r = n(48637),
        a = n(57497),
        o = n(17053),
        i = n(3987),
        u = n(33068),
        s = n(53552),
        l = n(86279),
        c = n(37205);
      function f(e, t, n) {
        let f;
        let d = 'string' == typeof t ? t : (0, a.formatWithValidation)(t),
          p = d.match(/^[a-zA-Z]{1,}:\/\//),
          h = p ? d.slice(p[0].length) : d;
        if ((h.split('?', 1)[0] || '').match(/(\/\/|\\)/)) {
          console.error(
            "Invalid href '" +
              d +
              "' passed to next/router in page: '" +
              e.pathname +
              "'. Repeated forward-slashes (//) or backslashes \\ are not valid in the href."
          );
          let t = (0, i.normalizeRepeatedSlashes)(h);
          d = (p ? p[0] : '') + t;
        }
        if (!(0, s.isLocalURL)(d)) return n ? [d] : d;
        try {
          f = new URL(d.startsWith('#') ? e.asPath : e.pathname, 'http://n');
        } catch (e) {
          f = new URL('/', 'http://n');
        }
        try {
          let e = new URL(d, f);
          e.pathname = (0, u.normalizePathTrailingSlash)(e.pathname);
          let t = '';
          if ((0, l.isDynamicRoute)(e.pathname) && e.searchParams && n) {
            let n = (0, r.searchParamsToUrlQuery)(e.searchParams),
              { result: i, params: u } = (0, c.interpolateAs)(e.pathname, e.pathname, n);
            i &&
              (t = (0, a.formatWithValidation)({
                pathname: i,
                hash: e.hash,
                query: (0, o.omit)(n, u),
              }));
          }
          let i = e.origin === f.origin ? e.href.slice(e.origin.length) : e.href;
          return n ? [i, t || i] : i;
        } catch (e) {
          return n ? [d] : d;
        }
      }
      ('function' == typeof t.default || ('object' == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, '__esModule', { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    16081: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'useIntersection', {
          enumerable: !0,
          get: function () {
            return s;
          },
        }));
      let r = n(2265),
        a = n(63515),
        o = 'function' == typeof IntersectionObserver,
        i = new Map(),
        u = [];
      function s(e) {
        let { rootRef: t, rootMargin: n, disabled: s } = e,
          l = s || !o,
          [c, f] = (0, r.useState)(!1),
          d = (0, r.useRef)(null),
          p = (0, r.useCallback)((e) => {
            d.current = e;
          }, []);
        return (
          (0, r.useEffect)(() => {
            if (o) {
              if (l || c) return;
              let e = d.current;
              if (e && e.tagName)
                return (function (e, t, n) {
                  let {
                    id: r,
                    observer: a,
                    elements: o,
                  } = (function (e) {
                    let t;
                    let n = { root: e.root || null, margin: e.rootMargin || '' },
                      r = u.find((e) => e.root === n.root && e.margin === n.margin);
                    if (r && (t = i.get(r))) return t;
                    let a = new Map();
                    return (
                      (t = {
                        id: n,
                        observer: new IntersectionObserver((e) => {
                          e.forEach((e) => {
                            let t = a.get(e.target),
                              n = e.isIntersecting || e.intersectionRatio > 0;
                            t && n && t(n);
                          });
                        }, e),
                        elements: a,
                      }),
                      u.push(n),
                      i.set(n, t),
                      t
                    );
                  })(n);
                  return (
                    o.set(e, t),
                    a.observe(e),
                    function () {
                      if ((o.delete(e), a.unobserve(e), 0 === o.size)) {
                        (a.disconnect(), i.delete(r));
                        let e = u.findIndex((e) => e.root === r.root && e.margin === r.margin);
                        e > -1 && u.splice(e, 1);
                      }
                    }
                  );
                })(e, (e) => e && f(e), { root: null == t ? void 0 : t.current, rootMargin: n });
            } else if (!c) {
              let e = (0, a.requestIdleCallback)(() => f(!0));
              return () => (0, a.cancelIdleCallback)(e);
            }
          }, [l, n, t, c, d.current]),
          [
            p,
            c,
            (0, r.useCallback)(() => {
              f(!1);
            }, []),
          ]
        );
      }
      ('function' == typeof t.default || ('object' == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, '__esModule', { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    19259: function (e, t) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var n in t) Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
        })(t, {
          ACTION_SUFFIX: function () {
            return s;
          },
          APP_DIR_ALIAS: function () {
            return T;
          },
          CACHE_ONE_YEAR: function () {
            return b;
          },
          DOT_NEXT_ALIAS: function () {
            return A;
          },
          ESLINT_DEFAULT_DIRS: function () {
            return G;
          },
          GSP_NO_RETURNED_VALUE: function () {
            return U;
          },
          GSSP_COMPONENT_MEMBER_ERROR: function () {
            return H;
          },
          GSSP_NO_RETURNED_VALUE: function () {
            return z;
          },
          INSTRUMENTATION_HOOK_FILENAME: function () {
            return S;
          },
          MIDDLEWARE_FILENAME: function () {
            return R;
          },
          MIDDLEWARE_LOCATION_REGEXP: function () {
            return P;
          },
          NEXT_BODY_SUFFIX: function () {
            return f;
          },
          NEXT_CACHE_IMPLICIT_TAG_ID: function () {
            return E;
          },
          NEXT_CACHE_REVALIDATED_TAGS_HEADER: function () {
            return h;
          },
          NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: function () {
            return m;
          },
          NEXT_CACHE_SOFT_TAGS_HEADER: function () {
            return p;
          },
          NEXT_CACHE_SOFT_TAG_MAX_LENGTH: function () {
            return y;
          },
          NEXT_CACHE_TAGS_HEADER: function () {
            return d;
          },
          NEXT_CACHE_TAG_MAX_ITEMS: function () {
            return g;
          },
          NEXT_CACHE_TAG_MAX_LENGTH: function () {
            return _;
          },
          NEXT_DATA_SUFFIX: function () {
            return l;
          },
          NEXT_INTERCEPTION_MARKER_PREFIX: function () {
            return r;
          },
          NEXT_META_SUFFIX: function () {
            return c;
          },
          NEXT_QUERY_PARAM_PREFIX: function () {
            return n;
          },
          NON_STANDARD_NODE_ENV: function () {
            return F;
          },
          PAGES_DIR_ALIAS: function () {
            return v;
          },
          PRERENDER_REVALIDATE_HEADER: function () {
            return a;
          },
          PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: function () {
            return o;
          },
          PUBLIC_DIR_MIDDLEWARE_CONFLICT: function () {
            return w;
          },
          ROOT_DIR_ALIAS: function () {
            return O;
          },
          RSC_ACTION_CLIENT_WRAPPER_ALIAS: function () {
            return C;
          },
          RSC_ACTION_ENCRYPTION_ALIAS: function () {
            return M;
          },
          RSC_ACTION_PROXY_ALIAS: function () {
            return I;
          },
          RSC_ACTION_VALIDATE_ALIAS: function () {
            return k;
          },
          RSC_MOD_REF_PROXY_ALIAS: function () {
            return N;
          },
          RSC_PREFETCH_SUFFIX: function () {
            return i;
          },
          RSC_SUFFIX: function () {
            return u;
          },
          SERVER_PROPS_EXPORT_ERROR: function () {
            return W;
          },
          SERVER_PROPS_GET_INIT_PROPS_CONFLICT: function () {
            return j;
          },
          SERVER_PROPS_SSG_CONFLICT: function () {
            return L;
          },
          SERVER_RUNTIME: function () {
            return K;
          },
          SSG_FALLBACK_EXPORT_ERROR: function () {
            return Y;
          },
          SSG_GET_INITIAL_PROPS_CONFLICT: function () {
            return x;
          },
          STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: function () {
            return D;
          },
          UNSTABLE_REVALIDATE_RENAME_ERROR: function () {
            return X;
          },
          WEBPACK_LAYERS: function () {
            return V;
          },
          WEBPACK_RESOURCE_QUERIES: function () {
            return q;
          },
        }));
      let n = 'nxtP',
        r = 'nxtI',
        a = 'x-prerender-revalidate',
        o = 'x-prerender-revalidate-if-generated',
        i = '.prefetch.rsc',
        u = '.rsc',
        s = '.action',
        l = '.json',
        c = '.meta',
        f = '.body',
        d = 'x-next-cache-tags',
        p = 'x-next-cache-soft-tags',
        h = 'x-next-revalidated-tags',
        m = 'x-next-revalidate-tag-token',
        g = 128,
        _ = 256,
        y = 1024,
        E = '_N_T_',
        b = 31536e3,
        R = 'middleware',
        P = `(?:src/)?${R}`,
        S = 'instrumentation',
        v = 'private-next-pages',
        A = 'private-dot-next',
        O = 'private-next-root-dir',
        T = 'private-next-app-dir',
        N = 'private-next-rsc-mod-ref-proxy',
        k = 'private-next-rsc-action-validate',
        I = 'private-next-rsc-server-reference',
        M = 'private-next-rsc-action-encryption',
        C = 'private-next-rsc-action-client-wrapper',
        w =
          "You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict",
        x =
          'You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps',
        j =
          'You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.',
        L =
          'You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps',
        D =
          'can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props',
        W =
          'pages with `getServerSideProps` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export',
        U =
          'Your `getStaticProps` function did not return an object. Did you forget to add a `return`?',
        z =
          'Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?',
        X =
          'The `unstable_revalidate` property is available for general use.\nPlease use `revalidate` instead.',
        H =
          "can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member",
        F =
          'You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env',
        Y =
          'Pages with `fallback` enabled in `getStaticPaths` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export',
        G = ['app', 'pages', 'components', 'lib', 'src'],
        K = { edge: 'edge', experimentalEdge: 'experimental-edge', nodejs: 'nodejs' },
        B = {
          shared: 'shared',
          reactServerComponents: 'rsc',
          serverSideRendering: 'ssr',
          actionBrowser: 'action-browser',
          api: 'api',
          middleware: 'middleware',
          instrument: 'instrument',
          edgeAsset: 'edge-asset',
          appPagesBrowser: 'app-pages-browser',
          appMetadataRoute: 'app-metadata-route',
          appRouteHandler: 'app-route-handler',
        },
        V = {
          ...B,
          GROUP: {
            serverOnly: [
              B.reactServerComponents,
              B.actionBrowser,
              B.appMetadataRoute,
              B.appRouteHandler,
              B.instrument,
            ],
            clientOnly: [B.serverSideRendering, B.appPagesBrowser],
            nonClientServerTarget: [B.middleware, B.api],
            app: [
              B.reactServerComponents,
              B.actionBrowser,
              B.appMetadataRoute,
              B.appRouteHandler,
              B.serverSideRendering,
              B.appPagesBrowser,
              B.shared,
              B.instrument,
            ],
          },
        },
        q = {
          edgeSSREntry: '__next_edge_ssr_entry__',
          metadata: '__next_metadata__',
          metadataRoute: '__next_metadata_route__',
          metadataImageMeta: '__next_metadata_image_meta__',
        };
    },
    90042: function (e, t) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'escapeStringRegexp', {
          enumerable: !0,
          get: function () {
            return a;
          },
        }));
      let n = /[|\\{}()[\]^$+*?.-]/,
        r = /[|\\{}()[\]^$+*?.-]/g;
      function a(e) {
        return n.test(e) ? e.replace(r, '\\$&') : e;
      }
    },
    25523: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'RouterContext', {
          enumerable: !0,
          get: function () {
            return r;
          },
        }));
      let r = n(47043)._(n(2265)).default.createContext(null);
    },
    57497: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var n in t) Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
        })(t, {
          formatUrl: function () {
            return o;
          },
          formatWithValidation: function () {
            return u;
          },
          urlObjectKeys: function () {
            return i;
          },
        }));
      let r = n(53099)._(n(48637)),
        a = /https?|ftp|gopher|file/;
      function o(e) {
        let { auth: t, hostname: n } = e,
          o = e.protocol || '',
          i = e.pathname || '',
          u = e.hash || '',
          s = e.query || '',
          l = !1;
        ((t = t ? encodeURIComponent(t).replace(/%3A/i, ':') + '@' : ''),
          e.host
            ? (l = t + e.host)
            : n && ((l = t + (~n.indexOf(':') ? '[' + n + ']' : n)), e.port && (l += ':' + e.port)),
          s && 'object' == typeof s && (s = String(r.urlQueryToSearchParams(s))));
        let c = e.search || (s && '?' + s) || '';
        return (
          o && !o.endsWith(':') && (o += ':'),
          e.slashes || ((!o || a.test(o)) && !1 !== l)
            ? ((l = '//' + (l || '')), i && '/' !== i[0] && (i = '/' + i))
            : l || (l = ''),
          u && '#' !== u[0] && (u = '#' + u),
          c && '?' !== c[0] && (c = '?' + c),
          '' +
            o +
            l +
            (i = i.replace(/[?#]/g, encodeURIComponent)) +
            (c = c.replace('#', '%23')) +
            u
        );
      }
      let i = [
        'auth',
        'hash',
        'host',
        'hostname',
        'href',
        'path',
        'pathname',
        'port',
        'protocol',
        'query',
        'search',
        'slashes',
      ];
      function u(e) {
        return o(e);
      }
    },
    86279: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var n in t) Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
        })(t, {
          getSortedRoutes: function () {
            return r.getSortedRoutes;
          },
          isDynamicRoute: function () {
            return a.isDynamicRoute;
          },
        }));
      let r = n(14777),
        a = n(38104);
    },
    37205: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'interpolateAs', {
          enumerable: !0,
          get: function () {
            return o;
          },
        }));
      let r = n(4199),
        a = n(9964);
      function o(e, t, n) {
        let o = '',
          i = (0, a.getRouteRegex)(e),
          u = i.groups,
          s = (t !== e ? (0, r.getRouteMatcher)(i)(t) : '') || n;
        o = e;
        let l = Object.keys(u);
        return (
          l.every((e) => {
            let t = s[e] || '',
              { repeat: n, optional: r } = u[e],
              a = '[' + (n ? '...' : '') + e + ']';
            return (
              r && (a = (t ? '' : '/') + '[' + a + ']'),
              n && !Array.isArray(t) && (t = [t]),
              (r || e in s) &&
                (o =
                  o.replace(
                    a,
                    n ? t.map((e) => encodeURIComponent(e)).join('/') : encodeURIComponent(t)
                  ) || '/')
            );
          }) || (o = ''),
          { params: l, result: o }
        );
      }
    },
    38104: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'isDynamicRoute', {
          enumerable: !0,
          get: function () {
            return o;
          },
        }));
      let r = n(91182),
        a = /\/\[[^/]+?\](?=\/|$)/;
      function o(e) {
        return (
          (0, r.isInterceptionRouteAppPath)(e) &&
            (e = (0, r.extractInterceptionRouteInformation)(e).interceptedRoute),
          a.test(e)
        );
      }
    },
    53552: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'isLocalURL', {
          enumerable: !0,
          get: function () {
            return o;
          },
        }));
      let r = n(3987),
        a = n(11283);
      function o(e) {
        if (!(0, r.isAbsoluteUrl)(e)) return !0;
        try {
          let t = (0, r.getLocationOrigin)(),
            n = new URL(e, t);
          return n.origin === t && (0, a.hasBasePath)(n.pathname);
        } catch (e) {
          return !1;
        }
      }
    },
    17053: function (e, t) {
      function n(e, t) {
        let n = {};
        return (
          Object.keys(e).forEach((r) => {
            t.includes(r) || (n[r] = e[r]);
          }),
          n
        );
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'omit', {
          enumerable: !0,
          get: function () {
            return n;
          },
        }));
    },
    48637: function (e, t) {
      function n(e) {
        let t = {};
        return (
          e.forEach((e, n) => {
            void 0 === t[n] ? (t[n] = e) : Array.isArray(t[n]) ? t[n].push(e) : (t[n] = [t[n], e]);
          }),
          t
        );
      }
      function r(e) {
        return 'string' != typeof e && ('number' != typeof e || isNaN(e)) && 'boolean' != typeof e
          ? ''
          : String(e);
      }
      function a(e) {
        let t = new URLSearchParams();
        return (
          Object.entries(e).forEach((e) => {
            let [n, a] = e;
            Array.isArray(a) ? a.forEach((e) => t.append(n, r(e))) : t.set(n, r(a));
          }),
          t
        );
      }
      function o(e) {
        for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
          n[r - 1] = arguments[r];
        return (
          n.forEach((t) => {
            (Array.from(t.keys()).forEach((t) => e.delete(t)), t.forEach((t, n) => e.append(n, t)));
          }),
          e
        );
      }
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var n in t) Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
        })(t, {
          assign: function () {
            return o;
          },
          searchParamsToUrlQuery: function () {
            return n;
          },
          urlQueryToSearchParams: function () {
            return a;
          },
        }));
    },
    4199: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'getRouteMatcher', {
          enumerable: !0,
          get: function () {
            return a;
          },
        }));
      let r = n(3987);
      function a(e) {
        let { re: t, groups: n } = e;
        return (e) => {
          let a = t.exec(e);
          if (!a) return !1;
          let o = (e) => {
              try {
                return decodeURIComponent(e);
              } catch (e) {
                throw new r.DecodeError('failed to decode param');
              }
            },
            i = {};
          return (
            Object.keys(n).forEach((e) => {
              let t = n[e],
                r = a[t.pos];
              void 0 !== r &&
                (i[e] = ~r.indexOf('/') ? r.split('/').map((e) => o(e)) : t.repeat ? [o(r)] : o(r));
            }),
            i
          );
        };
      }
    },
    9964: function (e, t, n) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var n in t) Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
        })(t, {
          getNamedMiddlewareRegex: function () {
            return p;
          },
          getNamedRouteRegex: function () {
            return d;
          },
          getRouteRegex: function () {
            return l;
          },
          parseParameter: function () {
            return u;
          },
        }));
      let r = n(19259),
        a = n(91182),
        o = n(90042),
        i = n(26674);
      function u(e) {
        let t = e.startsWith('[') && e.endsWith(']');
        t && (e = e.slice(1, -1));
        let n = e.startsWith('...');
        return (n && (e = e.slice(3)), { key: e, repeat: n, optional: t });
      }
      function s(e) {
        let t = (0, i.removeTrailingSlash)(e).slice(1).split('/'),
          n = {},
          r = 1;
        return {
          parameterizedRoute: t
            .map((e) => {
              let t = a.INTERCEPTION_ROUTE_MARKERS.find((t) => e.startsWith(t)),
                i = e.match(/\[((?:\[.*\])|.+)\]/);
              if (t && i) {
                let { key: e, optional: a, repeat: s } = u(i[1]);
                return (
                  (n[e] = { pos: r++, repeat: s, optional: a }),
                  '/' + (0, o.escapeStringRegexp)(t) + '([^/]+?)'
                );
              }
              if (!i) return '/' + (0, o.escapeStringRegexp)(e);
              {
                let { key: e, repeat: t, optional: a } = u(i[1]);
                return (
                  (n[e] = { pos: r++, repeat: t, optional: a }),
                  t ? (a ? '(?:/(.+?))?' : '/(.+?)') : '/([^/]+?)'
                );
              }
            })
            .join(''),
          groups: n,
        };
      }
      function l(e) {
        let { parameterizedRoute: t, groups: n } = s(e);
        return { re: RegExp('^' + t + '(?:/)?$'), groups: n };
      }
      function c(e) {
        let {
            interceptionMarker: t,
            getSafeRouteKey: n,
            segment: r,
            routeKeys: a,
            keyPrefix: i,
          } = e,
          { key: s, optional: l, repeat: c } = u(r),
          f = s.replace(/\W/g, '');
        i && (f = '' + i + f);
        let d = !1;
        ((0 === f.length || f.length > 30) && (d = !0),
          isNaN(parseInt(f.slice(0, 1))) || (d = !0),
          d && (f = n()),
          i ? (a[f] = '' + i + s) : (a[f] = s));
        let p = t ? (0, o.escapeStringRegexp)(t) : '';
        return c
          ? l
            ? '(?:/' + p + '(?<' + f + '>.+?))?'
            : '/' + p + '(?<' + f + '>.+?)'
          : '/' + p + '(?<' + f + '>[^/]+?)';
      }
      function f(e, t) {
        let n;
        let u = (0, i.removeTrailingSlash)(e).slice(1).split('/'),
          s =
            ((n = 0),
            () => {
              let e = '',
                t = ++n;
              for (; t > 0; )
                ((e += String.fromCharCode(97 + ((t - 1) % 26))), (t = Math.floor((t - 1) / 26)));
              return e;
            }),
          l = {};
        return {
          namedParameterizedRoute: u
            .map((e) => {
              let n = a.INTERCEPTION_ROUTE_MARKERS.some((t) => e.startsWith(t)),
                i = e.match(/\[((?:\[.*\])|.+)\]/);
              if (n && i) {
                let [n] = e.split(i[0]);
                return c({
                  getSafeRouteKey: s,
                  interceptionMarker: n,
                  segment: i[1],
                  routeKeys: l,
                  keyPrefix: t ? r.NEXT_INTERCEPTION_MARKER_PREFIX : void 0,
                });
              }
              return i
                ? c({
                    getSafeRouteKey: s,
                    segment: i[1],
                    routeKeys: l,
                    keyPrefix: t ? r.NEXT_QUERY_PARAM_PREFIX : void 0,
                  })
                : '/' + (0, o.escapeStringRegexp)(e);
            })
            .join(''),
          routeKeys: l,
        };
      }
      function d(e, t) {
        let n = f(e, t);
        return {
          ...l(e),
          namedRegex: '^' + n.namedParameterizedRoute + '(?:/)?$',
          routeKeys: n.routeKeys,
        };
      }
      function p(e, t) {
        let { parameterizedRoute: n } = s(e),
          { catchAll: r = !0 } = t;
        if ('/' === n) return { namedRegex: '^/' + (r ? '.*' : '') + '$' };
        let { namedParameterizedRoute: a } = f(e, !1);
        return { namedRegex: '^' + a + (r ? '(?:(/.*)?)' : '') + '$' };
      }
    },
    14777: function (e, t) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        Object.defineProperty(t, 'getSortedRoutes', {
          enumerable: !0,
          get: function () {
            return r;
          },
        }));
      class n {
        insert(e) {
          this._insert(e.split('/').filter(Boolean), [], !1);
        }
        smoosh() {
          return this._smoosh();
        }
        _smoosh(e) {
          void 0 === e && (e = '/');
          let t = [...this.children.keys()].sort();
          (null !== this.slugName && t.splice(t.indexOf('[]'), 1),
            null !== this.restSlugName && t.splice(t.indexOf('[...]'), 1),
            null !== this.optionalRestSlugName && t.splice(t.indexOf('[[...]]'), 1));
          let n = t
            .map((t) => this.children.get(t)._smoosh('' + e + t + '/'))
            .reduce((e, t) => [...e, ...t], []);
          if (
            (null !== this.slugName &&
              n.push(...this.children.get('[]')._smoosh(e + '[' + this.slugName + ']/')),
            !this.placeholder)
          ) {
            let t = '/' === e ? '/' : e.slice(0, -1);
            if (null != this.optionalRestSlugName)
              throw Error(
                'You cannot define a route with the same specificity as a optional catch-all route ("' +
                  t +
                  '" and "' +
                  t +
                  '[[...' +
                  this.optionalRestSlugName +
                  ']]").'
              );
            n.unshift(t);
          }
          return (
            null !== this.restSlugName &&
              n.push(...this.children.get('[...]')._smoosh(e + '[...' + this.restSlugName + ']/')),
            null !== this.optionalRestSlugName &&
              n.push(
                ...this.children
                  .get('[[...]]')
                  ._smoosh(e + '[[...' + this.optionalRestSlugName + ']]/')
              ),
            n
          );
        }
        _insert(e, t, r) {
          if (0 === e.length) {
            this.placeholder = !1;
            return;
          }
          if (r) throw Error('Catch-all must be the last part of the URL.');
          let a = e[0];
          if (a.startsWith('[') && a.endsWith(']')) {
            let n = a.slice(1, -1),
              i = !1;
            if (
              (n.startsWith('[') && n.endsWith(']') && ((n = n.slice(1, -1)), (i = !0)),
              n.startsWith('...') && ((n = n.substring(3)), (r = !0)),
              n.startsWith('[') || n.endsWith(']'))
            )
              throw Error("Segment names may not start or end with extra brackets ('" + n + "').");
            if (n.startsWith('.'))
              throw Error("Segment names may not start with erroneous periods ('" + n + "').");
            function o(e, n) {
              if (null !== e && e !== n)
                throw Error(
                  "You cannot use different slug names for the same dynamic path ('" +
                    e +
                    "' !== '" +
                    n +
                    "')."
                );
              (t.forEach((e) => {
                if (e === n)
                  throw Error(
                    'You cannot have the same slug name "' +
                      n +
                      '" repeat within a single dynamic path'
                  );
                if (e.replace(/\W/g, '') === a.replace(/\W/g, ''))
                  throw Error(
                    'You cannot have the slug names "' +
                      e +
                      '" and "' +
                      n +
                      '" differ only by non-word symbols within a single dynamic path'
                  );
              }),
                t.push(n));
            }
            if (r) {
              if (i) {
                if (null != this.restSlugName)
                  throw Error(
                    'You cannot use both an required and optional catch-all route at the same level ("[...' +
                      this.restSlugName +
                      ']" and "' +
                      e[0] +
                      '" ).'
                  );
                (o(this.optionalRestSlugName, n), (this.optionalRestSlugName = n), (a = '[[...]]'));
              } else {
                if (null != this.optionalRestSlugName)
                  throw Error(
                    'You cannot use both an optional and required catch-all route at the same level ("[[...' +
                      this.optionalRestSlugName +
                      ']]" and "' +
                      e[0] +
                      '").'
                  );
                (o(this.restSlugName, n), (this.restSlugName = n), (a = '[...]'));
              }
            } else {
              if (i)
                throw Error('Optional route parameters are not yet supported ("' + e[0] + '").');
              (o(this.slugName, n), (this.slugName = n), (a = '[]'));
            }
          }
          (this.children.has(a) || this.children.set(a, new n()),
            this.children.get(a)._insert(e.slice(1), t, r));
        }
        constructor() {
          ((this.placeholder = !0),
            (this.children = new Map()),
            (this.slugName = null),
            (this.restSlugName = null),
            (this.optionalRestSlugName = null));
        }
      }
      function r(e) {
        let t = new n();
        return (e.forEach((e) => t.insert(e)), t.smoosh());
      }
    },
    3987: function (e, t) {
      (Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e, t) {
          for (var n in t) Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
        })(t, {
          DecodeError: function () {
            return h;
          },
          MiddlewareNotFoundError: function () {
            return y;
          },
          MissingStaticPage: function () {
            return _;
          },
          NormalizeError: function () {
            return m;
          },
          PageNotFoundError: function () {
            return g;
          },
          SP: function () {
            return d;
          },
          ST: function () {
            return p;
          },
          WEB_VITALS: function () {
            return n;
          },
          execOnce: function () {
            return r;
          },
          getDisplayName: function () {
            return s;
          },
          getLocationOrigin: function () {
            return i;
          },
          getURL: function () {
            return u;
          },
          isAbsoluteUrl: function () {
            return o;
          },
          isResSent: function () {
            return l;
          },
          loadGetInitialProps: function () {
            return f;
          },
          normalizeRepeatedSlashes: function () {
            return c;
          },
          stringifyError: function () {
            return E;
          },
        }));
      let n = ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'];
      function r(e) {
        let t,
          n = !1;
        return function () {
          for (var r = arguments.length, a = Array(r), o = 0; o < r; o++) a[o] = arguments[o];
          return (n || ((n = !0), (t = e(...a))), t);
        };
      }
      let a = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/,
        o = (e) => a.test(e);
      function i() {
        let { protocol: e, hostname: t, port: n } = window.location;
        return e + '//' + t + (n ? ':' + n : '');
      }
      function u() {
        let { href: e } = window.location,
          t = i();
        return e.substring(t.length);
      }
      function s(e) {
        return 'string' == typeof e ? e : e.displayName || e.name || 'Unknown';
      }
      function l(e) {
        return e.finished || e.headersSent;
      }
      function c(e) {
        let t = e.split('?');
        return (
          t[0].replace(/\\/g, '/').replace(/\/\/+/g, '/') + (t[1] ? '?' + t.slice(1).join('?') : '')
        );
      }
      async function f(e, t) {
        let n = t.res || (t.ctx && t.ctx.res);
        if (!e.getInitialProps)
          return t.ctx && t.Component ? { pageProps: await f(t.Component, t.ctx) } : {};
        let r = await e.getInitialProps(t);
        if (n && l(n)) return r;
        if (!r)
          throw Error(
            '"' +
              s(e) +
              '.getInitialProps()" should resolve to an object. But found "' +
              r +
              '" instead.'
          );
        return r;
      }
      let d = 'undefined' != typeof performance,
        p =
          d &&
          ['mark', 'measure', 'getEntriesByName'].every((e) => 'function' == typeof performance[e]);
      class h extends Error {}
      class m extends Error {}
      class g extends Error {
        constructor(e) {
          (super(),
            (this.code = 'ENOENT'),
            (this.name = 'PageNotFoundError'),
            (this.message = 'Cannot find module for page: ' + e));
        }
      }
      class _ extends Error {
        constructor(e, t) {
          (super(), (this.message = 'Failed to load static file for page: ' + e + ' ' + t));
        }
      }
      class y extends Error {
        constructor() {
          (super(), (this.code = 'ENOENT'), (this.message = 'Cannot find the middleware module'));
        }
      }
      function E(e) {
        return JSON.stringify({ message: e.message, stack: e.stack });
      }
    },
    16357: function (e, t, n) {
      n.d(t, {
        K: function () {
          return a;
        },
      });
      var r = n(56942);
      function a(e, t) {
        return +(0, r.b)(e) == +(0, r.b)(t);
      }
    },
    8608: function (e, t, n) {
      n.d(t, {
        tr: function () {
          return c;
        },
      });
      let r = {
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
      var a = n(12694);
      let o = {
          date: (0, a.l)({
            formats: {
              full: 'd MMMM y EEEE',
              long: 'd MMMM y',
              medium: 'd MMM y',
              short: 'dd.MM.yyyy',
            },
            defaultWidth: 'full',
          }),
          time: (0, a.l)({
            formats: {
              full: 'HH:mm:ss zzzz',
              long: 'HH:mm:ss z',
              medium: 'HH:mm:ss',
              short: 'HH:mm',
            },
            defaultWidth: 'full',
          }),
          dateTime: (0, a.l)({
            formats: {
              full: "{{date}} 'saat' {{time}}",
              long: "{{date}} 'saat' {{time}}",
              medium: '{{date}}, {{time}}',
              short: '{{date}}, {{time}}',
            },
            defaultWidth: 'full',
          }),
        },
        i = {
          lastWeek: "'ge\xe7en hafta' eeee 'saat' p",
          yesterday: "'d\xfcn saat' p",
          today: "'bug\xfcn saat' p",
          tomorrow: "'yarın saat' p",
          nextWeek: "eeee 'saat' p",
          other: 'P',
        };
      var u = n(55195);
      let s = {
        ordinalNumber: (e, t) => Number(e) + '.',
        era: (0, u.Y)({
          values: {
            narrow: ['M\xd6', 'MS'],
            abbreviated: ['M\xd6', 'MS'],
            wide: ['Milattan \xd6nce', 'Milattan Sonra'],
          },
          defaultWidth: 'wide',
        }),
        quarter: (0, u.Y)({
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
        month: (0, u.Y)({
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
        day: (0, u.Y)({
          values: {
            narrow: ['P', 'P', 'S', '\xc7', 'P', 'C', 'C'],
            short: ['Pz', 'Pt', 'Sa', '\xc7a', 'Pe', 'Cu', 'Ct'],
            abbreviated: ['Paz', 'Pzt', 'Sal', '\xc7ar', 'Per', 'Cum', 'Cts'],
            wide: ['Pazar', 'Pazartesi', 'Salı', '\xc7arşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
          },
          defaultWidth: 'wide',
        }),
        dayPeriod: (0, u.Y)({
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
      var l = n(83922);
      let c = {
        code: 'tr',
        formatDistance: (e, t, n) => {
          let a;
          let o = r[e];
          return ((a =
            'string' == typeof o
              ? o
              : 1 === t
                ? o.one
                : o.other.replace('{{count}}', t.toString())),
          null == n ? void 0 : n.addSuffix)
            ? n.comparison && n.comparison > 0
              ? a + ' sonra'
              : a + ' \xf6nce'
            : a;
        },
        formatLong: o,
        formatRelative: (e, t, n, r) => i[e],
        localize: s,
        match: {
          ordinalNumber: (0, n(75381).y)({
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
