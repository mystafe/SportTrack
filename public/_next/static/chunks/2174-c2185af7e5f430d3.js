'use strict';
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [2174],
  {
    60186: function (e, t, i) {
      i.d(t, {
        Dy: function () {
          return l;
        },
        V$: function () {
          return n;
        },
        u6: function () {
          return r;
        },
      });
      var a = i(78705);
      let n = [
          {
            key: 'WALKING',
            label: 'Y\xfcr\xfcme',
            labelEn: 'Walking',
            icon: '\uD83D\uDEB6‍♂️',
            multiplier: 1,
            unit: 'adım',
            unitEn: 'steps',
            defaultAmount: 1e3,
            description: 'Adım sayınızı girin',
            descriptionEn: 'Enter your step count',
            category: 'cardio',
          },
          {
            key: 'RUNNING',
            label: 'Koşma',
            labelEn: 'Running',
            icon: '\uD83C\uDFC3',
            multiplier: 2,
            unit: 'adım',
            unitEn: 'steps',
            defaultAmount: 500,
            description: 'Koşu adım sayınızı girin',
            descriptionEn: 'Enter your running step count',
            category: 'cardio',
          },
          {
            key: 'SWIMMING',
            label: 'Y\xfczme',
            labelEn: 'Swimming',
            icon: '\uD83C\uDFCA',
            multiplier: 5,
            unit: 'dakika',
            unitEn: 'minutes',
            defaultAmount: 20,
            description: 'Y\xfczme s\xfcresini dakika olarak girin',
            descriptionEn: 'Enter swimming duration in minutes',
            category: 'cardio',
          },
          {
            key: 'PUSH_UP',
            label: 'Şınav',
            labelEn: 'Push-up',
            icon: '\uD83D\uDCAA',
            multiplier: 20,
            unit: 'tekrar',
            unitEn: 'reps',
            defaultAmount: 20,
            description: 'Tamamlanan şınav tekrar sayısı',
            descriptionEn: 'Number of push-up repetitions completed',
            category: 'strength',
          },
          {
            key: 'SIT_UP',
            label: 'Mekik',
            labelEn: 'Sit-up',
            icon: '\uD83C\uDD8E',
            multiplier: 10,
            unit: 'tekrar',
            unitEn: 'reps',
            defaultAmount: 20,
            description: 'Tamamlanan mekik tekrar sayısı',
            descriptionEn: 'Number of sit-up repetitions completed',
            category: 'strength',
          },
          {
            key: 'WEIGHT_LIFTING',
            label: 'Ağırlık \xc7alışması',
            labelEn: 'Weight Lifting',
            icon: '\uD83C\uDFCB️',
            multiplier: 15,
            unit: 'dakika',
            unitEn: 'minutes',
            defaultAmount: 30,
            description: 'Toplam s\xfcreyi dakika olarak girin',
            descriptionEn: 'Enter total duration in minutes',
            category: 'strength',
          },
          {
            key: 'STAIRS',
            label: 'Merdiven \xc7ıkma',
            labelEn: 'Stairs',
            icon: '\uD83E\uDE9C',
            multiplier: 20,
            unit: 'basamak',
            unitEn: 'steps',
            defaultAmount: 50,
            description: '\xc7ıktığınız toplam basamak sayısı',
            descriptionEn: 'Total number of steps climbed',
            category: 'cardio',
          },
        ],
        r = Object.fromEntries(n.map((e) => [e.key, e])),
        l = a.bB.DEFAULT_DAILY_TARGET;
    },
    24979: function (e, t, i) {
      i.d(t, {
        QO: function () {
          return y;
        },
        G$: function () {
          return v;
        },
        bA: function () {
          return k;
        },
      });
      var a = i(57437),
        n = i(2265),
        r = i(60186),
        l = i(56942),
        s = i(5341),
        o = i(78705);
      let d = o.I.ACTIVITIES,
        u = (0, n.createContext)(null),
        c = r.u6;
      function m() {
        return 'undefined' != typeof crypto && 'function' == typeof crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      }
      function p(e, t) {
        return Math.max(0, Math.round(t * e));
      }
      function y(e) {
        let { children: t } = e,
          [i, r] = (0, n.useState)([]),
          [l, s] = (0, n.useState)(!1),
          [y, v] = (0, n.useState)(null),
          k = (function (e, t) {
            let [i, a] = (0, n.useState)(e);
            return (
              (0, n.useEffect)(() => {
                let i = setTimeout(() => {
                  a(e);
                }, t);
                return () => {
                  clearTimeout(i);
                };
              }, [e, t]),
              i
            );
          })(i, o.LS.DEBOUNCE_DELAY);
        ((0, n.useEffect)(() => {
          let e = window.localStorage.getItem(d);
          if (e)
            try {
              let t = JSON.parse(e).map((e) =>
                (function (e) {
                  var t, i, a, n, r, l, s, o, d, u, y, v, k, g, f, A, h, b, D, S;
                  let E = c[null !== (t = e.activityKey) && void 0 !== t ? t : ''],
                    T =
                      'number' == typeof e.multiplier
                        ? e.multiplier
                        : null !== (i = null == E ? void 0 : E.multiplier) && void 0 !== i
                          ? i
                          : 1,
                    C = null !== (a = e.amount) && void 0 !== a ? a : 0;
                  return {
                    id: null !== (n = e.id) && void 0 !== n ? n : m(),
                    activityKey:
                      null !==
                        (l =
                          null !== (r = e.activityKey) && void 0 !== r
                            ? r
                            : null == E
                              ? void 0
                              : E.key) && void 0 !== l
                        ? l
                        : 'CUSTOM',
                    label:
                      null !==
                        (d =
                          null !==
                            (o =
                              null !== (s = e.label) && void 0 !== s
                                ? s
                                : null == E
                                  ? void 0
                                  : E.label) && void 0 !== o
                            ? o
                            : e.activityKey) && void 0 !== d
                        ? d
                        : 'Bilinmeyen Aktivite',
                    labelEn:
                      null !== (u = e.labelEn) && void 0 !== u ? u : null == E ? void 0 : E.labelEn,
                    icon:
                      null !==
                        (v =
                          null !== (y = e.icon) && void 0 !== y
                            ? y
                            : null == E
                              ? void 0
                              : E.icon) && void 0 !== v
                        ? v
                        : '\uD83C\uDFC3',
                    unit:
                      null !==
                        (g =
                          null !== (k = e.unit) && void 0 !== k
                            ? k
                            : null == E
                              ? void 0
                              : E.unit) && void 0 !== g
                        ? g
                        : '',
                    unitEn:
                      null !== (f = e.unitEn) && void 0 !== f ? f : null == E ? void 0 : E.unitEn,
                    multiplier: T,
                    amount: C,
                    points: 'number' == typeof e.points ? e.points : p(T, C),
                    performedAt:
                      null !== (A = e.performedAt) && void 0 !== A ? A : new Date().toISOString(),
                    note: null !== (h = e.note) && void 0 !== h ? h : null,
                    description:
                      null !== (b = e.description) && void 0 !== b
                        ? b
                        : null == E
                          ? void 0
                          : E.description,
                    descriptionEn:
                      null !== (D = e.descriptionEn) && void 0 !== D
                        ? D
                        : null == E
                          ? void 0
                          : E.descriptionEn,
                    isCustom: null !== (S = e.isCustom) && void 0 !== S ? S : !E,
                  };
                })(e)
              );
              (r(t), v(null));
            } catch (e) {
              (console.error('Failed to parse activities from storage', e), v('parse'));
            }
          s(!0);
        }, []),
          (0, n.useEffect)(() => {
            if (l)
              try {
                (window.localStorage.setItem(d, JSON.stringify(k)), v(null));
              } catch (e) {
                e instanceof DOMException && 'QuotaExceededError' === e.name
                  ? v('quota')
                  : (console.error('Failed to save activities to storage', e), v('save'));
              }
          }, [k, l]));
        let g = (0, n.useCallback)((e) => {
            let t = (function (e, t, i, a, n) {
              var r;
              let l = i ? new Date(i).toISOString() : new Date().toISOString(),
                s = e.multiplier;
              return {
                id: m(),
                activityKey: e.key,
                label: e.label,
                labelEn: e.labelEn,
                icon: e.icon,
                unit: e.unit,
                unitEn: e.unitEn,
                multiplier: s,
                amount: t,
                points: p(s, t),
                performedAt: l,
                note: null != a ? a : null,
                description: e.description,
                descriptionEn: e.descriptionEn,
                isCustom: null !== (r = e.isCustom) && void 0 !== r && r,
                duration: n && n > 0 ? n : void 0,
              };
            })(e.definition, e.amount, e.performedAt, e.note, e.duration);
            return (r((e) => [t, ...e]), t);
          }, []),
          f = (0, n.useCallback)((e, t) => {
            let i = null;
            return (
              r((a) =>
                a.map((a) => {
                  var n, r;
                  if (a.id !== e) return a;
                  let l = t.performedAt ? new Date(t.performedAt).toISOString() : a.performedAt,
                    s = t.definition.multiplier;
                  return (i = {
                    ...a,
                    activityKey: t.definition.key,
                    label: t.definition.label,
                    labelEn: t.definition.labelEn,
                    icon: t.definition.icon,
                    unit: t.definition.unit,
                    unitEn: t.definition.unitEn,
                    multiplier: s,
                    amount: t.amount,
                    performedAt: l,
                    note: null !== (n = t.note) && void 0 !== n ? n : null,
                    points: p(s, t.amount),
                    isCustom: null !== (r = t.definition.isCustom) && void 0 !== r && r,
                    duration: t.duration && t.duration > 0 ? t.duration : void 0,
                  });
                })
              ),
              i
            );
          }, []),
          A = (0, n.useCallback)((e) => {
            r((t) => t.filter((t) => t.id !== e));
          }, []),
          h = (0, n.useCallback)(() => {
            v(null);
          }, []),
          b = (0, n.useMemo)(
            () => ({
              activities: i,
              hydrated: l,
              storageError: y,
              clearStorageError: h,
              addActivity: g,
              updateActivity: f,
              deleteActivity: A,
            }),
            [i, l, y, h, g, f, A]
          );
        return (0, a.jsx)(u.Provider, { value: b, children: t });
      }
      function v() {
        let e = (0, n.useContext)(u);
        if (!e) throw Error('useActivities must be used within ActivitiesProvider');
        return e;
      }
      function k(e) {
        let { activities: t } = v();
        return (0, n.useMemo)(
          () =>
            (function (e, t) {
              var i, a, n, r;
              let o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date(),
                d = (0, l.b)(o),
                u = (0, s.k)(d, 30),
                c = new Map(),
                m = new Map();
              for (let t of e) {
                let e = new Date(t.performedAt);
                if (Number.isNaN(e.valueOf())) continue;
                let n = (0, l.b)(e).toISOString();
                if (
                  (c.set(n, (null !== (i = c.get(n)) && void 0 !== i ? i : 0) + t.points), e >= d)
                ) {
                  let e =
                    null !== (a = m.get(t.activityKey)) && void 0 !== a
                      ? a
                      : {
                          label: t.label,
                          labelEn: t.labelEn,
                          icon: t.icon,
                          unit: t.unit,
                          unitEn: t.unitEn,
                          amount: 0,
                          points: 0,
                        };
                  ((e.amount += t.amount), (e.points += t.points), m.set(t.activityKey, e));
                }
              }
              let p = null !== (n = c.get(d.toISOString())) && void 0 !== n ? n : 0,
                y = Array.from({ length: 7 }, (e, t) => {
                  var i;
                  let a = (0, s.k)(d, 6 - t).toISOString();
                  return { date: a, points: null !== (i = c.get(a)) && void 0 !== i ? i : 0 };
                }).reverse(),
                v = 0;
              for (let e = 0; e < 30; e += 1) {
                let i = (0, s.k)(d, e);
                if (i < u) break;
                let a = i.toISOString();
                if ((null !== (r = c.get(a)) && void 0 !== r ? r : 0) >= t) v += 1;
                else if (0 === e) continue;
                else break;
              }
              let k = Array.from(m.entries())
                .map((e) => {
                  let [t, i] = e;
                  return {
                    key: t,
                    label: i.label,
                    labelEn: i.labelEn,
                    icon: i.icon,
                    amount: i.amount,
                    unit: i.unit,
                    unitEn: i.unitEn,
                    points: i.points,
                  };
                })
                .sort((e, t) => t.points - e.points);
              return {
                todayPoints: p,
                targetPoints: t,
                totalPoints: e.reduce((e, t) => e + t.points, 0),
                totalActivities: e.length,
                streakDays: v,
                lastSevenDays: y,
                breakdownToday: k,
              };
            })(t, e),
          [t, e]
        );
      }
    },
    78705: function (e, t, i) {
      i.d(t, {
        I: function () {
          return a;
        },
        LS: function () {
          return n;
        },
        bB: function () {
          return r;
        },
        j$: function () {
          return l;
        },
      });
      let a = {
          ACTIVITIES: 'sporttrack.activities.v1',
          SETTINGS: 'sporttrack.settings.v1',
          THEME: 'theme',
          LANGUAGE: 'lang',
          BADGES: 'sporttrack.badges.v1',
          NOTIFICATIONS: 'sporttrack.notifications.v1',
          LEVELS: 'sporttrack.levels.v1',
          CHALLENGES: 'sporttrack.challenges.v1',
          ONBOARDING_COMPLETED: 'sporttrack.onboarding.completed',
        },
        n = { TOAST_DURATION: 3e3, DEBOUNCE_DELAY: 500 },
        r = { DAILY_TARGET_MIN: 1e3, DAILY_TARGET_MAX: 1e5, DEFAULT_DAILY_TARGET: 1e4 },
        l = { MOBILE: 767 };
    },
    78466: function (e, t, i) {
      i.d(t, {
        d: function () {
          return r;
        },
      });
      var a = i(2265),
        n = i(78705);
      function r() {
        let [e, t] = (0, a.useState)(!1);
        return (
          (0, a.useEffect)(() => {
            let e = window.matchMedia('(max-width: '.concat(n.j$.MOBILE, 'px)'));
            t(e.matches);
            let i = (e) => {
              t(e.matches);
            };
            return 'function' == typeof e.addEventListener
              ? (e.addEventListener('change', i), () => e.removeEventListener('change', i))
              : (e.addListener(i), () => e.removeListener(i));
          }, []),
          e
        );
      }
    },
    98661: function (e, t, i) {
      i.d(t, {
        Q: function () {
          return d;
        },
        b: function () {
          return o;
        },
      });
      var a = i(57437),
        n = i(2265),
        r = i(78705);
      let l = {
          'nav.activities': { tr: 'Aktiviteler', en: 'Activities' },
          'nav.stats': { tr: 'İstatistikler', en: 'Statistics' },
          'nav.addActivity': { tr: 'Aktivite Ekle', en: 'Add Activity' },
          'nav.achievements': { tr: 'Başarımlar', en: 'Achievements' },
          'nav.challenges': { tr: 'Hedefler', en: 'Goals' },
          'nav.main': { tr: 'Ana navigasyon', en: 'Main navigation' },
          'nav.home': { tr: 'Ana sayfa', en: 'Home page' },
          'nav.login': { tr: 'Giriş Yap', en: 'Login' },
          'nav.logout': { tr: '\xc7ıkış Yap', en: 'Logout' },
          scrollToTop: { tr: 'Yukarı \xe7ık', en: 'Scroll to top' },
          'header.overviewTitle': { tr: 'Genel Bakış', en: 'Overview' },
          'header.overviewSubtitle': {
            tr: 'G\xfcnl\xfck puan hedefin doğrultusunda ilerlemeni takip et.',
            en: 'Keep track of your progress toward your daily points goal.',
          },
          'header.greeting': { tr: 'Merhaba, {name}!', en: 'Hello, {name}!' },
          'actions.addActivity': { tr: 'Aktivite Ekle', en: 'Add Activity' },
          'form.selectActivity': { tr: 'Aktivite Se\xe7', en: 'Select Activity' },
          'form.datetime': { tr: 'Tarih & Saat', en: 'Date & Time' },
          'form.amount': { tr: 'Miktar', en: 'Amount' },
          'form.multiplier': { tr: '\xc7arpan', en: 'Multiplier' },
          'form.points': { tr: 'Kazandırdığı Puan', en: 'Points Earned' },
          'form.noteOptional': { tr: 'Not (opsiyonel)', en: 'Note (optional)' },
          'form.notePlaceholder': { tr: 'Nasıl hissettirdi?', en: 'How did it feel?' },
          'form.add': { tr: 'Aktiviteyi Ekle', en: 'Add Activity' },
          'form.save': { tr: 'Değişiklikleri Kaydet', en: 'Save Changes' },
          'form.cancel': { tr: 'Vazge\xe7', en: 'Cancel' },
          'form.confirm': { tr: 'Onayla', en: 'Confirm' },
          'form.loading': { tr: 'Y\xfckleniyor...', en: 'Loading...' },
          'form.selectActivityLabel': {
            tr: '{activity} aktivitesini se\xe7',
            en: 'Select {activity} activity',
          },
          'list.newActivity': { tr: 'Yeni Aktivite', en: 'New Activity' },
          'list.records': { tr: 'Kayıtlar', en: 'Records' },
          'list.loading': { tr: 'Y\xfckleniyor...', en: 'Loading...' },
          'list.empty': { tr: 'Hen\xfcz aktivite yok.', en: 'No activities yet.' },
          'list.delete': { tr: 'Sil', en: 'Delete' },
          'list.deleteConfirm': {
            tr: 'Silmek istediğine emin misin?',
            en: 'Are you sure you want to delete?',
          },
          'list.deleteConfirmTitle': { tr: 'Aktiviteyi Sil', en: 'Delete Activity' },
          'list.deleteConfirmMessage': {
            tr: '"{activity}" aktivitesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
            en: 'Are you sure you want to delete the activity "{activity}"? This action cannot be undone.',
          },
          'list.deleteDisabled': {
            tr: 'Ge\xe7miş tarihli aktiviteleri silemezsin.',
            en: 'You cannot delete activities logged on previous days.',
          },
          'list.edit': { tr: 'D\xfczenle', en: 'Edit' },
          'list.editingTitle': { tr: 'Aktiviteyi D\xfczenle', en: 'Edit Activity' },
          'list.pointsUnit': { tr: 'puan', en: 'pts' },
          'activities.custom.manageButton': {
            tr: 'Aktiviteleri \xd6zelleştir',
            en: 'Manage Activities',
          },
          'activities.custom.title': {
            tr: 'Aktivite Listesini \xd6zelleştir',
            en: 'Customize Activities',
          },
          'activities.custom.subtitle': {
            tr: 'Standart aktivitelerin yanı sıra kendine \xf6zel aktiviteler ekleyebilir, d\xfczenleyebilir veya kaldırabilirsin.',
            en: 'Add, edit or remove personalised activities alongside the defaults.',
          },
          'activities.custom.fields.label': { tr: 'Aktivite Adı', en: 'Activity Name' },
          'activities.custom.fields.labelEn': {
            tr: 'Aktivite Adı (EN - opsiyonel)',
            en: 'Activity Name (TR - optional)',
          },
          'activities.custom.fields.optional': { tr: 'opsiyonel', en: 'optional' },
          'activities.custom.fields.labelEnHint': {
            tr: 'Boş bırakılırsa T\xfcrk\xe7e adı kullanılacak.',
            en: 'If left empty, the Turkish name will be used.',
          },
          'activities.custom.fields.icon': { tr: 'Emoji/Sembol', en: 'Emoji/Icon' },
          'activities.custom.fields.unit': { tr: 'Birim', en: 'Unit' },
          'activities.custom.fields.unitEn': {
            tr: 'Birim (EN - opsiyonel)',
            en: 'Unit (TR - optional)',
          },
          'activities.custom.fields.unitEnHint': {
            tr: 'Boş bırakılırsa T\xfcrk\xe7e birimi kullanılacak.',
            en: 'If left empty, the Turkish unit will be used.',
          },
          'activities.custom.fields.multiplier': { tr: '\xc7arpan', en: 'Multiplier' },
          'activities.custom.fields.defaultAmount': { tr: 'Varsayılan', en: 'Default' },
          'activities.custom.fields.description': { tr: 'A\xe7ıklama', en: 'Description' },
          'activities.custom.fields.descriptionEn': {
            tr: 'A\xe7ıklama (EN - opsiyonel)',
            en: 'Description (TR - optional)',
          },
          'activities.custom.fields.descriptionHint': {
            tr: 'Boş bırakılırsa T\xfcrk\xe7e a\xe7ıklama kullanılacak.',
            en: 'If left empty, the English description will be used.',
          },
          'activities.custom.placeholders.description': {
            tr: 'A\xe7ıklama girin',
            en: 'A\xe7ıklama girin',
          },
          'activities.custom.placeholders.descriptionEn': {
            tr: 'Enter description',
            en: 'Enter description',
          },
          'activities.custom.placeholders.label': { tr: '\xd6rn. Y\xfczme', en: 'e.g. Swimming' },
          'activities.custom.placeholders.labelEn': { tr: '\xd6rn. Y\xfczme', en: 'e.g. Swimming' },
          'activities.custom.placeholders.unit': { tr: '\xd6rn. dakika', en: 'e.g. minutes' },
          'activities.custom.placeholders.unitEn': { tr: '\xd6rn. dakika', en: 'e.g. minutes' },
          'activities.custom.errors.label': {
            tr: 'Aktivite adı gerekli.',
            en: 'Activity name is required.',
          },
          'activities.custom.errors.icon': {
            tr: 'Emoji alanı boş olamaz.',
            en: 'Emoji cannot be empty.',
          },
          'activities.custom.errors.unit': {
            tr: 'Birim alanı boş olamaz.',
            en: 'Unit cannot be empty.',
          },
          'activities.custom.errors.multiplier': {
            tr: '\xc7arpan pozitif bir sayı olmalı.',
            en: 'Multiplier must be a positive number.',
          },
          'activities.custom.errors.defaultAmount': {
            tr: 'Varsayılan miktar pozitif bir tam sayı olmalı.',
            en: 'Default amount must be a positive integer.',
          },
          'activities.custom.errors.cannotDeleteBase': {
            tr: 'Varsayılan aktiviteler silinemez, ancak d\xfczenlenebilir.',
            en: 'Default activities cannot be deleted, but can be edited.',
          },
          'activities.custom.errors.duplicate': {
            tr: 'Bu isimle başka bir aktivite zaten var.',
            en: 'Another activity already uses this identifier.',
          },
          'activities.custom.errors.inUse': {
            tr: 'Bu aktivite ge\xe7miş kayıtlarda kullanıldığı i\xe7in silinemez.',
            en: 'This activity already has records and cannot be removed.',
          },
          'activities.custom.add': { tr: 'Aktiviteyi Ekle', en: 'Add Activity' },
          'activities.custom.save': { tr: 'Aktiviteyi Kaydet', en: 'Save Activity' },
          'activities.custom.customList': { tr: 'Senin Aktivitelerin', en: 'Your Activities' },
          'activities.custom.baseList': { tr: 'Hazır Aktiviteler', en: 'Default Activities' },
          'activities.custom.empty': {
            tr: 'Hen\xfcz \xf6zel aktivite eklemedin.',
            en: 'You have not added any custom activities yet.',
          },
          'activities.custom.edit': { tr: 'D\xfczenle', en: 'Edit' },
          'activities.custom.remove': { tr: 'Sil', en: 'Remove' },
          'activities.custom.confirmDelete': {
            tr: 'Bu aktiviteyi silmek istediğine emin misin?',
            en: 'Are you sure you want to remove this activity?',
          },
          'stats.todayPoints': { tr: 'Bug\xfcnk\xfc Puan', en: 'Today’s Points' },
          'stats.totalPoints': { tr: 'Toplam Kazanılan Puan', en: 'Total Points Earned' },
          'stats.totalActivities': {
            tr: 'Toplam {count} aktivite kaydı',
            en: '{count} total activities',
          },
          'stats.streak': { tr: 'Hedef Tutma Serisi', en: 'Goal Streak' },
          'stats.streakDesc': {
            tr: 'G\xfcnl\xfck 10.000 puan serisi',
            en: 'Daily 10,000 points streak',
          },
          'stats.overview': { tr: 'Genel Bakış', en: 'Overview' },
          'stats.breakdownToday': { tr: 'Bug\xfcnk\xfc Dağılım', en: "Today's Breakdown" },
          'stats.noActivityToday': {
            tr: 'Bug\xfcn hen\xfcz aktivite eklenmedi.',
            en: 'No activity added today.',
          },
          'stats.lastSeven': { tr: 'Son 7 G\xfcn', en: 'Last 7 Days' },
          'stats.sectionToggle': {
            tr: '{section} b\xf6l\xfcm\xfcn\xfcn g\xf6r\xfcn\xfcrl\xfcğ\xfcn\xfc değiştir',
            en: 'Toggle {section} section visibility',
          },
          'stats.noData': { tr: 'Hen\xfcz veri yok.', en: 'No data yet.' },
          'stats.target': { tr: 'Hedef', en: 'Target' },
          'stats.highlightsTitle': { tr: 'İstatistikler', en: 'Highlights' },
          'stats.highlight.bestDay': { tr: 'En y\xfcksek puanlı g\xfcn', en: 'Best scoring day' },
          'stats.highlight.bestDayFallback': {
            tr: 'Hen\xfcz bir g\xfcn kaydı yok.',
            en: 'No day recorded yet.',
          },
          'stats.highlight.bestActivity': {
            tr: 'En \xe7ok puan getiren aktivite',
            en: 'Top scoring activity',
          },
          'stats.highlight.bestActivityFallback': {
            tr: 'Hen\xfcz aktivite yok.',
            en: 'No activities yet.',
          },
          'stats.highlight.sessions': { tr: 'seans', en: 'sessions' },
          'stats.highlight.currentStreak': { tr: 'Aktif seri', en: 'Current streak' },
          'stats.highlight.totalActivities': {
            tr: '{count} toplam aktivite',
            en: '{count} total activities',
          },
          'stats.highlight.averageDaily': {
            tr: 'Ortalama g\xfcnl\xfck puan',
            en: 'Average daily points',
          },
          'stats.averageDaily': { tr: 'Ortalama G\xfcnl\xfck', en: 'Average Daily' },
          'stats.perActivity': { tr: 'Aktivite Başına', en: 'Per Activity' },
          'stats.highlight.totalDays': { tr: '{count} g\xfcn kayıt', en: '{count} days recorded' },
          'stats.highlight.totalPoints': { tr: 'Toplam puan', en: 'Total points' },
          'stats.highlight.todayProgress': { tr: 'Bug\xfcnk\xfc ilerleme', en: "Today's progress" },
          'stats.highlight.complete': { tr: 'tamamlandı', en: 'complete' },
          'stats.progressLabel': {
            tr: 'İlerleme: {current} / {target} puan',
            en: 'Progress: {current} / {target} points',
          },
          'stats.goalCompleted': { tr: 'Hedef Tamamlandı!', en: 'Goal Completed!' },
          'stats.detailed.title': { tr: 'Detaylı İstatistikler', en: 'Detailed Statistics' },
          'stats.detailed.subtitle': {
            tr: 'G\xfcnl\xfck performansınızı ve aktivite ge\xe7mişinizi detaylı olarak g\xf6r\xfcnt\xfcleyin.',
            en: 'View your daily performance and activity history in detail.',
          },
          'stats.detailed.dailyStats': { tr: 'G\xfcnl\xfck İstatistikler', en: 'Daily Statistics' },
          'stats.detailed.activityBreakdown': { tr: 'Aktivite Dağılımı', en: 'Activity Breakdown' },
          'stats.detailed.totalActivities': { tr: 'Toplam Aktivite', en: 'Total Activities' },
          'stats.detailed.totalSessions': { tr: 'Toplam Seans', en: 'Total Sessions' },
          'stats.detailed.averagePerDay': { tr: 'G\xfcnl\xfck Ortalama', en: 'Daily Average' },
          'stats.detailed.bestStreak': { tr: 'En Uzun Seri', en: 'Best Streak' },
          'stats.detailed.completionRate': { tr: 'Tamamlama Oranı', en: 'Completion Rate' },
          'stats.detailed.noActivities': { tr: 'Hen\xfcz aktivite yok', en: 'No activities yet' },
          'stats.detailed.selectDate': { tr: 'Tarih se\xe7in', en: 'Select date' },
          'stats.detailed.dayDetails': { tr: 'G\xfcn Detayları', en: 'Day Details' },
          'stats.detailed.activitiesOnDay': {
            tr: 'Bu g\xfcnk\xfc aktiviteler',
            en: 'Activities on this day',
          },
          'stats.detailed.trendChart': { tr: 'Trend Grafiği', en: 'Trend Chart' },
          'stats.detailed.activityComparison': {
            tr: 'Aktivite Karşılaştırması',
            en: 'Activity Comparison',
          },
          'stats.detailed.activityDistribution': {
            tr: 'Aktivite Dağılımı',
            en: 'Activity Distribution',
          },
          'stats.detailed.activityHeatmap': {
            tr: 'Yıllık Aktivite Haritası',
            en: 'Yearly Activity Heatmap',
          },
          'stats.duration.title': {
            tr: 'Aktivite S\xfcresi Analizi',
            en: 'Activity Duration Analysis',
          },
          'stats.duration.subtitle': {
            tr: 'G\xfcnl\xfck aktivite s\xfcrelerinizi ve ortalamalarınızı g\xf6r\xfcnt\xfcleyin.',
            en: 'View your daily activity durations and averages.',
          },
          'stats.duration.averageDaily': {
            tr: 'Ortalama G\xfcnl\xfck S\xfcre',
            en: 'Average Daily Duration',
          },
          'stats.duration.totalDuration': { tr: 'Toplam S\xfcre', en: 'Total Duration' },
          'stats.duration.daysWithDuration': {
            tr: 'S\xfcre Kayıtlı G\xfcnler',
            en: 'Days with Duration',
          },
          'stats.duration.longestDay': { tr: 'En Uzun G\xfcn', en: 'Longest Day' },
          'stats.duration.noDurationData': {
            tr: 'Hen\xfcz s\xfcre kaydı yok. Aktivite eklerken s\xfcre takibi yapabilirsiniz.',
            en: 'No duration data yet. You can track duration when adding activities.',
          },
          'toast.activityAdded': {
            tr: 'Aktivite başarıyla eklendi',
            en: 'Activity added successfully',
          },
          'toast.activityUpdated': {
            tr: 'Aktivite başarıyla g\xfcncellendi',
            en: 'Activity updated successfully',
          },
          'toast.activityDeleted': {
            tr: 'Aktivite başarıyla silindi',
            en: 'Activity deleted successfully',
          },
          'errors.storageParseFailed': {
            tr: 'Veri okunamadı. L\xfctfen sayfayı yenileyin.',
            en: 'Failed to read data. Please refresh the page.',
          },
          'errors.storageQuotaExceeded': {
            tr: 'Depolama alanı dolu. Eski kayıtları silin.',
            en: 'Storage quota exceeded. Please delete old records.',
          },
          'errors.storageSaveFailed': {
            tr: 'Veri kaydedilemedi. L\xfctfen tekrar deneyin.',
            en: 'Failed to save data. Please try again.',
          },
          'data.export': { tr: 'Dışa Aktar', en: 'Export' },
          'data.exportTooltip': {
            tr: 'T\xfcm verileri JSON dosyası olarak indir',
            en: 'Download all data as JSON file',
          },
          'data.exportSuccess': {
            tr: 'Veriler başarıyla dışa aktarıldı',
            en: 'Data exported successfully',
          },
          'data.exportFailed': { tr: 'Veri dışa aktarma başarısız', en: 'Data export failed' },
          'data.import': { tr: 'İ\xe7e Aktar', en: 'Import' },
          'data.importTooltip': {
            tr: 'JSON dosyasından veri y\xfckle',
            en: 'Load data from JSON file',
          },
          'data.importConfirm': {
            tr: '{activities} aktivite ve "{settings}" kullanıcı ayarlarını i\xe7e aktarmak istediğinize emin misiniz? Mevcut veriler \xfczerine yazılacaktır.',
            en: 'Are you sure you want to import {activities} activities and settings for "{settings}"? This will overwrite your current data.',
          },
          'data.importFailed': {
            tr: 'Veri i\xe7e aktarma başarısız. Dosya formatını kontrol edin.',
            en: 'Data import failed. Please check the file format.',
          },
          'export.title': { tr: 'Veri Dışa Aktar', en: 'Export Data' },
          'export.format': { tr: 'Format', en: 'Format' },
          'export.dateRange': { tr: 'Tarih Aralığı', en: 'Date Range' },
          'export.allTime': { tr: 'T\xfcm Zamanlar', en: 'All Time' },
          'export.last7Days': { tr: 'Son 7 G\xfcn', en: 'Last 7 Days' },
          'export.last30Days': { tr: 'Son 30 G\xfcn', en: 'Last 30 Days' },
          'export.customRange': { tr: '\xd6zel Aralık', en: 'Custom Range' },
          'export.startDate': { tr: 'Başlangı\xe7', en: 'Start Date' },
          'export.endDate': { tr: 'Bitiş', en: 'End Date' },
          'export.export': { tr: 'Dışa Aktar', en: 'Export' },
          'export.csvSuccess': {
            tr: 'CSV dosyası başarıyla dışa aktarıldı',
            en: 'CSV file exported successfully',
          },
          'export.pdfSuccess': {
            tr: 'PDF raporu başarıyla oluşturuldu',
            en: 'PDF report created successfully',
          },
          'export.jsonSuccess': {
            tr: 'JSON yedek dosyası başarıyla dışa aktarıldı',
            en: 'JSON backup file exported successfully',
          },
          'export.failed': { tr: 'Dışa aktarma başarısız', en: 'Export failed' },
          'export.dateRangeRequired': {
            tr: 'L\xfctfen tarih aralığı se\xe7in',
            en: 'Please select a date range',
          },
          'settings.setProfile': { tr: 'Profil Ayarla', en: 'Set Profile' },
          'settings.title': { tr: 'Seni Tanıyalım', en: 'Tell Us About You' },
          'settings.subtitle': {
            tr: 'İsmini ve g\xfcnl\xfck puan hedefini belirle, motivasyonun artsın.',
            en: 'Set your name and daily points goal to stay motivated.',
          },
          'settings.appSettings': { tr: 'Uygulama Ayarları', en: 'App Settings' },
          'settings.appSettingsSubtitle': {
            tr: 'Dil, tema ve veri y\xf6netimi ayarları',
            en: 'Language, theme and data management settings',
          },
          'settings.nameLabel': { tr: 'İsmin', en: 'Your name' },
          'settings.namePlaceholder': { tr: '\xd6rn. Mustafa', en: 'e.g. Alex' },
          'settings.goalLabel': { tr: 'G\xfcnl\xfck hedef (puan)', en: 'Daily goal (points)' },
          'settings.moodLabel': {
            tr: 'Bug\xfcn nasıl hissediyorsun?',
            en: 'How are you feeling today?',
          },
          'settings.moodNone': { tr: 'Belirtmek istemiyorum', en: 'Prefer not to say' },
          'settings.moodHappy': { tr: '\uD83D\uDE0A Mutlu', en: '\uD83D\uDE0A Happy' },
          'settings.moodCheerful': { tr: '\uD83D\uDE04 Neşeli', en: '\uD83D\uDE04 Cheerful' },
          'settings.moodSad': { tr: '\uD83D\uDE22 \xdczg\xfcn', en: '\uD83D\uDE22 Sad' },
          'settings.moodUnhappy': { tr: '\uD83D\uDE14 Mutsuz', en: '\uD83D\uDE14 Unhappy' },
          'settings.moodTired': {
            tr: '\uD83D\uDE34 Yorgun / Hasta',
            en: '\uD83D\uDE34 Tired / Sick',
          },
          'settings.save': { tr: 'Kaydet', en: 'Save' },
          'settings.errors.nameRequired': { tr: 'İsim boş olamaz.', en: 'Name cannot be empty.' },
          'settings.errors.targetPositive': {
            tr: "0'dan b\xfcy\xfck bir sayı girmelisiniz.",
            en: 'You must enter a number greater than 0.',
          },
          'settings.errors.targetRange': {
            tr: 'Hedef 1.000 ile 100.000 arasında olmalıdır.',
            en: 'Goal must be between 1,000 and 100,000.',
          },
          'settings.showOnboarding': {
            tr: 'Tanıtım Turunu Tekrar G\xf6ster',
            en: 'Show Onboarding Tour Again',
          },
          'footer.byName': { tr: 'Mustafa Evleksiz', en: 'Mustafa Evleksiz' },
          'achievements.title': { tr: 'Başarımlar', en: 'Achievements' },
          'achievements.subtitle': {
            tr: 'Kazandığın rozetleri g\xf6r\xfcnt\xfcle ve yeni hedefler belirle',
            en: 'View your earned badges and set new goals',
          },
          'achievements.progress': { tr: 'İlerleme', en: 'Progress' },
          'pwa.installTitle': { tr: "SportTrack'i Y\xfckle", en: 'Install SportTrack' },
          'pwa.installDescription': {
            tr: 'Daha hızlı erişim ve offline \xe7alışma i\xe7in uygulamayı y\xfckle',
            en: 'Install the app for faster access and offline functionality',
          },
          'pwa.install': { tr: 'Y\xfckle', en: 'Install' },
          'pwa.dismiss': { tr: 'Daha Sonra', en: 'Later' },
          'notifications.title': { tr: 'Bildirimler', en: 'Notifications' },
          'notifications.subtitle': {
            tr: 'Aktivite hatırlatıcıları ve başarı bildirimleri',
            en: 'Activity reminders and achievement notifications',
          },
          'notifications.requestPermission': {
            tr: 'Bildirim İzni İste',
            en: 'Request Notification Permission',
          },
          'notifications.permissionGranted': {
            tr: 'Bildirim izni verildi',
            en: 'Notification permission granted',
          },
          'notifications.permissionDenied': {
            tr: 'Bildirim izni reddedildi',
            en: 'Notification permission denied',
          },
          'notifications.notSupported': {
            tr: 'Tarayıcınız bildirimleri desteklemiyor',
            en: 'Your browser does not support notifications',
          },
          'notifications.dailyReminder': { tr: 'G\xfcnl\xfck Hatırlatıcı', en: 'Daily Reminder' },
          'notifications.goalCompletion': {
            tr: 'Hedef Tamamlama Bildirimi',
            en: 'Goal Completion Notification',
          },
          'notifications.streakReminder': { tr: 'Seri Hatırlatıcısı', en: 'Streak Reminder' },
          'notifications.saveFailed': {
            tr: 'Bildirim ayarları kaydedilemedi',
            en: 'Failed to save notification settings',
          },
          'quickAdd.title': { tr: 'Hızlı Ekle', en: 'Quick Add' },
          'quickAdd.subtitle': { tr: 'En \xe7ok kullandıkların', en: 'Most used' },
          'quickAdd.added': { tr: 'eklendi', en: 'added' },
          'quickAdd.failed': { tr: 'Aktivite eklenemedi', en: 'Failed to add activity' },
          'quickAdd.addActivity': {
            tr: '{activity} aktivitesini ekle',
            en: 'Add {activity} activity',
          },
          'quickAdd.addActivityLabel': {
            tr: '{activity} aktivitesini ekle',
            en: 'Add {activity} activity',
          },
          'quickAdd.confirmTitle': { tr: 'Aktivite Ekle', en: 'Add Activity' },
          'quickAdd.confirmMessage': {
            tr: '{activity} aktivitesini {amount} {unit} olarak eklemek istiyor musunuz? ({points} puan)',
            en: 'Do you want to add {activity} activity with {amount} {unit}? ({points} points)',
          },
          'quickAdd.confirmAdd': { tr: 'Ekle', en: 'Add' },
          'filters.title': { tr: 'Filtreler', en: 'Filters' },
          'filters.dateRange': { tr: 'Tarih Aralığı', en: 'Date Range' },
          'filters.dateRange.all': { tr: 'T\xfcm\xfc', en: 'All' },
          'filters.dateRange.today': { tr: 'Bug\xfcn', en: 'Today' },
          'filters.dateRange.week': { tr: 'Son 7 G\xfcn', en: 'Last 7 Days' },
          'filters.dateRange.month': { tr: 'Son 30 G\xfcn', en: 'Last 30 Days' },
          'filters.dateRange.custom': { tr: '\xd6zel', en: 'Custom' },
          'filters.category': { tr: 'Kategori', en: 'Category' },
          'filters.allCategories': { tr: 'T\xfcm Kategoriler', en: 'All Categories' },
          'filters.category.cardio': { tr: 'Kardiyo', en: 'Cardio' },
          'filters.category.strength': { tr: 'G\xfc\xe7', en: 'Strength' },
          'filters.category.flexibility': { tr: 'Esneklik', en: 'Flexibility' },
          'filters.category.sports': { tr: 'Spor', en: 'Sports' },
          'filters.category.other': { tr: 'Diğer', en: 'Other' },
          'filters.activityType': { tr: 'Aktivite T\xfcr\xfc', en: 'Activity Type' },
          'filters.allActivities': { tr: 'T\xfcm Aktiviteler', en: 'All Activities' },
          'filters.search': { tr: 'Ara', en: 'Search' },
          'filters.searchPlaceholder': {
            tr: 'Aktivite adı veya not ara...',
            en: 'Search activity name or note...',
          },
          'filters.sortBy': { tr: 'Sırala', en: 'Sort By' },
          'filters.sort.dateDesc': { tr: 'Tarih (Yeni → Eski)', en: 'Date (Newest → Oldest)' },
          'filters.sort.dateAsc': { tr: 'Tarih (Eski → Yeni)', en: 'Date (Oldest → Newest)' },
          'filters.sort.pointsDesc': {
            tr: 'Puan (Y\xfcksek → D\xfcş\xfck)',
            en: 'Points (High → Low)',
          },
          'filters.sort.pointsAsc': {
            tr: 'Puan (D\xfcş\xfck → Y\xfcksek)',
            en: 'Points (Low → High)',
          },
          'filters.clear': { tr: 'Filtreleri Temizle', en: 'Clear Filters' },
          'filters.results': { tr: 'Filtrelenmiş Sonu\xe7lar', en: 'Filtered Results' },
          'filters.activities': { tr: 'aktivite', en: 'activities' },
          'filters.noResults': {
            tr: 'Filtrelere uygun aktivite bulunamadı',
            en: 'No activities match the filters',
          },
          'appleHealth.import': { tr: 'Apple Sağlık Verisi', en: 'Apple Health Data' },
          'appleHealth.importLabel': {
            tr: 'Apple Health CSV dosyasını i\xe7e aktar',
            en: 'Import Apple Health CSV file',
          },
          'appleHealth.parseFailed': {
            tr: 'CSV dosyası parse edilemedi: {errors}',
            en: 'Failed to parse CSV file: {errors}',
          },
          'appleHealth.confirmTitle': {
            tr: 'Apple Health Verilerini İ\xe7e Aktar',
            en: 'Import Apple Health Data',
          },
          'appleHealth.confirmMessage': {
            tr: '{count} g\xfcnl\xfck adım verisi bulundu ({start} - {end}). Mevcut {existing} adım kaydı silinecek ve yenileriyle değiştirilecek. Devam etmek istiyor musunuz?',
            en: 'Found {count} days of step data ({start} - {end}). Existing {existing} step records will be deleted and replaced. Do you want to continue?',
          },
          'appleHealth.confirmImport': { tr: 'İ\xe7e Aktar', en: 'Import' },
          'appleHealth.importSuccess': {
            tr: '{count} g\xfcnl\xfck adım verisi i\xe7e aktarıldı ({replaced} kayıt değiştirildi)',
            en: 'Imported {count} days of step data ({replaced} records replaced)',
          },
          'appleHealth.importFailed': {
            tr: 'Apple Health verileri i\xe7e aktarılamadı',
            en: 'Failed to import Apple Health data',
          },
          'appleHealth.guideTitle': {
            tr: 'Apple Health İ\xe7e Aktarma Rehberi',
            en: 'Apple Health Import Guide',
          },
          'appleHealth.step1': {
            tr: "1. Apple Health'tan Veri Dışa Aktarma",
            en: '1. Export Data from Apple Health',
          },
          'appleHealth.step1a': {
            tr: "iPhone'unuzda Apple Health uygulamasını a\xe7ın",
            en: 'Open the Apple Health app on your iPhone',
          },
          'appleHealth.step1b': {
            tr: 'Sağ alt k\xf6şedeki "Profil" sekmesine gidin',
            en: 'Go to the "Profile" tab in the bottom right corner',
          },
          'appleHealth.step1c': {
            tr: '"Verileri Dışa Aktar" se\xe7eneğini bulun ve XML veya CSV formatını se\xe7in',
            en: 'Find "Export Data" option and select XML or CSV format',
          },
          'appleHealth.step2': { tr: '2. Dosya Hazırlama', en: '2. Prepare File' },
          'appleHealth.step2a': {
            tr: 'Dışa aktarılan dosyada "Step Count" (Adım Sayısı) verilerini bulun. CSV veya XML formatında olabilir. B\xfcy\xfck dosyalar (1GB+) i\xe7in işlem biraz zaman alabilir.',
            en: 'In the exported file, find "Step Count" data. It can be in CSV or XML format. Large files (1GB+) may take some time to process.',
          },
          'appleHealth.step2b': {
            tr: 'type,sourceName,unit,value,startDate,endDate\nHKQuantityTypeIdentifierStepCount,Health,count,8500,2024-01-01 00:00:00 +0000,2024-01-01 23:59:59 +0000',
            en: 'type,sourceName,unit,value,startDate,endDate\nHKQuantityTypeIdentifierStepCount,Health,count,8500,2024-01-01 00:00:00 +0000,2024-01-01 23:59:59 +0000',
          },
          'appleHealth.step3': {
            tr: "3. SportTrack'e İ\xe7e Aktarma",
            en: '3. Import to SportTrack',
          },
          'appleHealth.step3a': {
            tr: 'Ayarlar men\xfcs\xfcnden "Apple Health" butonuna tıklayın ve XML veya CSV dosyanızı se\xe7in. Sistem otomatik olarak adım verilerini "Y\xfcr\xfcme" aktivitesi olarak i\xe7e aktaracaktır. B\xfcy\xfck dosyalar i\xe7in işlem sırasında ilerleme \xe7ubuğu g\xf6sterilecektir.',
            en: 'Click the "Apple Health" button in the settings menu and select your XML or CSV file. The system will automatically import step data as "Walking" activities. A progress bar will be shown for large files.',
          },
          'appleHealth.note': {
            tr: 'Not: Mevcut y\xfcr\xfcme aktiviteleri silinip yenileriyle değiştirilecektir. Bu işlem geri alınamaz.',
            en: 'Note: Existing walking activities will be deleted and replaced. This action cannot be undone.',
          },
          'appleHealth.largeFileWarning': {
            tr: 'B\xfcy\xfck dosya tespit edildi ({size}MB). İşlem biraz zaman alabilir. Devam etmek istiyor musunuz?',
            en: 'Large file detected ({size}MB). Processing may take some time. Do you want to continue?',
          },
          'appleHealth.processing': {
            tr: 'İşleniyor: {processed} / {total} kayıt ({percentage}%)',
            en: 'Processing: {processed} / {total} records ({percentage}%)',
          },
          'templates.title': { tr: 'Aktivite Şablonları', en: 'Activity Templates' },
          'templates.subtitle': {
            tr: 'Hızlı başlangı\xe7 i\xe7in hazır kombinasyonlar',
            en: 'Ready combinations for quick start',
          },
          'templates.category.quick': { tr: 'Hızlı', en: 'Quick' },
          'templates.category.cardio': { tr: 'Kardiyo', en: 'Cardio' },
          'templates.category.strength': { tr: 'G\xfc\xe7', en: 'Strength' },
          'templates.category.flexibility': { tr: 'Esneklik', en: 'Flexibility' },
          'templates.category.mixed': { tr: 'Karışık', en: 'Mixed' },
          'templates.activities': { tr: 'aktivite', en: 'activities' },
          'templates.points': { tr: 'puan', en: 'points' },
          'templates.confirmTitle': { tr: 'Şablonu Ekle', en: 'Add Template' },
          'templates.confirmMessage': {
            tr: '{template} şablonunu ({count} aktivite: {activities}) eklemek istediğinize emin misiniz?',
            en: 'Are you sure you want to add the {template} template ({count} activities: {activities})?',
          },
          'templates.confirmAdd': { tr: 'Ekle', en: 'Add' },
          'templates.added': { tr: 'şablonu eklendi', en: 'template added' },
          'templates.failed': {
            tr: 'Şablon aktiviteleri eklenemedi',
            en: 'Failed to add template activities',
          },
          'templates.template': { tr: 'şablon', en: 'template' },
          'templates.selectTemplate': {
            tr: '{template} şablonunu se\xe7',
            en: 'Select {template} template',
          },
          'export.mood': { tr: 'Ruh Hali', en: 'Mood' },
          'level.level': { tr: 'Seviye', en: 'Level' },
          'level.xp': { tr: 'XP', en: 'XP' },
          'level.totalXP': { tr: 'Toplam XP', en: 'Total XP' },
          'level.progress': { tr: 'İlerleme', en: 'Progress' },
          'level.levelUp': { tr: 'Seviye Atladın!', en: 'Level Up!' },
          'level.nextLevel': { tr: 'Sonraki Seviye', en: 'Next Level' },
          'level.xpNeeded': { tr: 'Gerekli XP', en: 'XP Needed' },
          'level.title': { tr: 'Başlık', en: 'Title' },
          'challenges.title': { tr: 'Hedefler', en: 'Goals' },
          'challenges.subtitle': {
            tr: 'Hedeflerini belirle ve takip et',
            en: 'Set and track your goals',
          },
          'challenges.daily': { tr: 'G\xfcnl\xfck', en: 'Daily' },
          'challenges.weekly': { tr: 'Haftalık', en: 'Weekly' },
          'challenges.monthly': { tr: 'Aylık', en: 'Monthly' },
          'challenges.custom': { tr: '\xd6zel', en: 'Custom' },
          'challenges.active': { tr: 'Aktif', en: 'Active' },
          'challenges.completed': { tr: 'Tamamlandı', en: 'Completed' },
          'challenges.failed': { tr: 'Başarısız', en: 'Failed' },
          'challenges.expired': { tr: 'S\xfcresi Doldu', en: 'Expired' },
          'challenges.progress': { tr: 'İlerleme', en: 'Progress' },
          'challenges.target': { tr: 'Hedef', en: 'Target' },
          'challenges.current': { tr: 'Mevcut', en: 'Current' },
          'challenges.daysRemaining': { tr: 'Kalan G\xfcn', en: 'Days Remaining' },
          'challenges.addChallenge': { tr: 'Yeni Hedef Ekle', en: 'Add New Goal' },
          'challenges.editChallenge': { tr: 'Hedefi D\xfczenle', en: 'Edit Goal' },
          'challenges.deleteChallenge': { tr: 'Hedefi Sil', en: 'Delete Goal' },
          'challenges.deleteConfirm': {
            tr: 'Bu hedefi silmek istediğinize emin misiniz?',
            en: 'Are you sure you want to delete this goal?',
          },
          'challenges.completedMessage': {
            tr: 'Tebrikler! "{name}" hedefini tamamladın!',
            en: 'Congratulations! You completed the "{name}" goal!',
          },
          'challenges.name': { tr: 'İsim', en: 'Name' },
          'challenges.description': { tr: 'A\xe7ıklama', en: 'Description' },
          'challenges.targetPoints': { tr: 'Hedef Puan', en: 'Target Points' },
          'challenges.startDate': { tr: 'Başlangı\xe7 Tarihi', en: 'Start Date' },
          'challenges.endDate': { tr: 'Bitiş Tarihi', en: 'End Date' },
          'challenges.save': { tr: 'Kaydet', en: 'Save' },
          'challenges.cancel': { tr: 'İptal', en: 'Cancel' },
          'challenges.noChallenges': { tr: 'Hen\xfcz hedef yok', en: 'No goals yet' },
          'challenges.createFirst': { tr: 'İlk hedefini oluştur', en: 'Create your first goal' },
          'records.title': { tr: 'Kişisel Rekorlar', en: 'Personal Records' },
          'records.subtitle': { tr: 'En iyi performansların', en: 'Your best performances' },
          'records.overall': { tr: 'Genel', en: 'Overall' },
          'records.byActivity': { tr: 'Aktivite Bazında', en: 'By Activity' },
          'records.bestDay': { tr: 'En İyi G\xfcn', en: 'Best Day' },
          'records.longestStreak': { tr: 'En Uzun Seri', en: 'Longest Streak' },
          'records.fastestGoal': { tr: 'En Hızlı Hedef Tamamlama', en: 'Fastest Goal Completion' },
          'timer.title': { tr: 'Aktivite S\xfcresi', en: 'Activity Duration' },
          'timer.start': { tr: 'Başlat', en: 'Start' },
          'timer.stop': { tr: 'Durdur', en: 'Stop' },
          'timer.reset': { tr: 'Sıfırla', en: 'Reset' },
          'timer.running': { tr: '\xc7alışıyor...', en: 'Running...' },
          'timer.paused': { tr: 'Duraklatıldı', en: 'Paused' },
          'activityTrend.title': {
            tr: 'Aktivite T\xfcrleri Trend Analizi',
            en: 'Activity Type Trend Analysis',
          },
          'activityTrend.subtitle': {
            tr: 'Zaman i\xe7inde aktivite t\xfcrlerinizin performansını g\xf6r\xfcnt\xfcleyin.',
            en: 'View your activity types performance over time.',
          },
          'activityTrend.noData': { tr: 'Hen\xfcz trend verisi yok.', en: 'No trend data yet.' },
          'activityTrend.totalCount': { tr: 'Toplam', en: 'Total' },
          'activityTrend.totalPoints': { tr: 'Toplam Puan', en: 'Total Points' },
          'activityTrend.avgPerDay': { tr: 'G\xfcnl\xfck Ortalama', en: 'Daily Avg' },
          'timeAnalysis.title': { tr: 'Zaman Analizi', en: 'Time Analysis' },
          'timeAnalysis.subtitle': {
            tr: 'En aktif olduğun saatler ve g\xfcnler',
            en: 'Your most active hours and days',
          },
          'timeAnalysis.mostActiveHour': { tr: 'En Aktif Saat', en: 'Most Active Hour' },
          'timeAnalysis.mostActiveDay': { tr: 'En Aktif G\xfcn', en: 'Most Active Day' },
          'timeAnalysis.hourDistribution': {
            tr: 'Saatlere G\xf6re Dağılım',
            en: 'Distribution by Hour',
          },
          'timeAnalysis.dayDistribution': {
            tr: 'G\xfcnlere G\xf6re Dağılım',
            en: 'Distribution by Day',
          },
          'timeAnalysis.activities': { tr: 'aktivite', en: 'activities' },
          'timeAnalysis.points': { tr: 'Puan', en: 'Points' },
          'comparison.title': {
            tr: 'Haftalık ve Aylık Karşılaştırma',
            en: 'Weekly & Monthly Comparison',
          },
          'comparison.subtitle': {
            tr: 'Bu hafta/ay ile ge\xe7en hafta/ay karşılaştırması',
            en: 'Compare this week/month with previous week/month',
          },
          'comparison.weekly': { tr: 'Haftalık Karşılaştırma', en: 'Weekly Comparison' },
          'comparison.monthly': { tr: 'Aylık Karşılaştırma', en: 'Monthly Comparison' },
          'comparison.totalPoints': { tr: 'Toplam Puan', en: 'Total Points' },
          'comparison.totalActivities': { tr: 'Toplam Aktivite', en: 'Total Activities' },
          'comparison.avgDaily': { tr: 'Ortalama G\xfcnl\xfck', en: 'Avg Daily' },
          'comparison.completionRate': { tr: 'Tamamlama Oranı', en: 'Completion Rate' },
          'comparison.points': { tr: 'Puan', en: 'Points' },
          'comparison.activities': { tr: 'Aktiviteler', en: 'Activities' },
          'onboarding.skip': { tr: 'Turu Atla', en: 'Skip Tour' },
          'onboarding.previous': { tr: '\xd6nceki', en: 'Previous' },
          'onboarding.next': { tr: 'Sonraki', en: 'Next' },
          'onboarding.finish': { tr: 'Bitir', en: 'Finish' },
          'settings.keyboardShortcuts': {
            tr: '⌨️ Klavye Kısayolları',
            en: '⌨️ Keyboard Shortcuts',
          },
          'settings.keyboardShortcutsHint': {
            tr: '? tuşuna basarak kısayolları g\xf6rebilirsiniz',
            en: 'Press ? to view keyboard shortcuts',
          },
          'auth.signUp': { tr: 'Kayıt Ol', en: 'Sign Up' },
          'auth.signIn': { tr: 'Giriş Yap', en: 'Sign In' },
        },
        s = (0, n.createContext)(null);
      function o(e) {
        let { children: t } = e,
          [i, o] = (0, n.useState)('tr');
        (0, n.useEffect)(() => {
          let e = localStorage.getItem(r.I.LANGUAGE);
          if ('tr' === e || 'en' === e) {
            o(e);
            return;
          }
          o(navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en');
        }, []);
        let d = (0, n.useMemo)(
          () => ({
            lang: i,
            setLang: (e) => {
              (o(e), localStorage.setItem(r.I.LANGUAGE, e));
            },
            t: (e, t) => {
              let a = l[e],
                n = a ? a[i] : e;
              return t
                ? Object.keys(t).reduce((e, i) => e.replace('{'.concat(i, '}'), String(t[i])), n)
                : n;
            },
          }),
          [i]
        );
        return (0, a.jsx)(s.Provider, { value: d, children: t });
      }
      function d() {
        let e = (0, n.useContext)(s);
        if (!e) throw Error('useI18n must be used within I18nProvider');
        return e;
      }
    },
    58151: function (e, t, i) {
      i.d(t, {
        YG: function () {
          return c;
        },
        mu: function () {
          return d;
        },
        rV: function () {
          return u;
        },
      });
      var a = i(57437),
        n = i(2265),
        r = i(60186);
      let l = i(78705).I.SETTINGS;
      function s(e) {
        if (!Array.isArray(e)) return [];
        let t = new Set(),
          i = [];
        for (let a of e) a && 'string' == typeof a.id && (t.has(a.id) || (t.add(a.id), i.push(a)));
        return i;
      }
      let o = (0, n.createContext)(null);
      function d(e) {
        let { children: t } = e,
          [i, d] = (0, n.useState)(null),
          [u, c] = (0, n.useState)(!1);
        (0, n.useEffect)(() => {
          try {
            let t = window.localStorage.getItem(l);
            if (t) {
              let i = JSON.parse(t);
              if (
                i &&
                'string' == typeof i.name &&
                i.name.trim() &&
                'number' == typeof i.dailyTarget &&
                Number.isFinite(i.dailyTarget) &&
                i.dailyTarget > 0
              ) {
                var e;
                d({
                  name: i.name,
                  dailyTarget: i.dailyTarget,
                  customActivities: s(i.customActivities),
                  mood: null !== (e = i.mood) && void 0 !== e ? e : void 0,
                });
              }
            }
          } catch (e) {
            console.error('Failed to read settings', e);
          } finally {
            c(!0);
          }
        }, []);
        let m = (0, n.useCallback)((e) => {
            let t = { ...e, customActivities: s(e.customActivities) };
            (d(t), window.localStorage.setItem(l, JSON.stringify(t)));
          }, []),
          p = (0, n.useCallback)(
            (e) => {
              var t;
              return m({
                ...e,
                customActivities:
                  null !== (t = e.customActivities) && void 0 !== t
                    ? t
                    : s(null == i ? void 0 : i.customActivities),
              });
            },
            [m, i]
          ),
          y = (0, n.useCallback)(
            (e) => {
              d((t) => {
                let i = null != t ? t : { name: '', dailyTarget: r.Dy, customActivities: [] },
                  a = {
                    ...i,
                    customActivities: [e, ...i.customActivities.filter((t) => t.id !== e.id)],
                  };
                return (m(a), a);
              });
            },
            [m]
          ),
          v = (0, n.useCallback)(
            (e, t) => {
              d((i) => {
                if (!i) return i;
                let a = {
                  ...i,
                  customActivities: i.customActivities.map((i) =>
                    i.id === e ? { ...i, ...t } : i
                  ),
                };
                return (m(a), a);
              });
            },
            [m]
          ),
          k = (0, n.useCallback)(
            (e) => {
              d((t) => {
                if (!t) return t;
                let i = { ...t, customActivities: t.customActivities.filter((t) => t.id !== e) };
                return (m(i), i);
              });
            },
            [m]
          ),
          g = (0, n.useMemo)(
            () => ({
              settings: i,
              hydrated: u,
              saveSettings: p,
              addCustomActivity: y,
              updateCustomActivity: v,
              removeCustomActivity: k,
            }),
            [i, u, p, y, v, k]
          );
        return (0, a.jsx)(o.Provider, { value: g, children: t });
      }
      function u() {
        let e = (0, n.useContext)(o);
        if (!e) throw Error('useSettings must be used within SettingsProvider');
        return e;
      }
      function c() {
        let { settings: e } = u();
        return (0, n.useMemo)(() => {
          let t = s(null == e ? void 0 : e.customActivities),
            i = new Map();
          for (let e of r.V$) i.set(e.key, e);
          for (let e of t) i.set(e.id, { ...e, key: e.id, isCustom: !0 });
          return Array.from(i.values());
        }, [e]);
      }
    },
  },
]);
