/* Algebra 1 Games: classes without logins or a server.

   Teacher: makes a class on their own device and gets a join code (like K7M-Q4P) and a join link.
   Student: joins with the code and a nickname or roster number; that is saved only on the student's device.
   When the teacher asks, the student makes a "progress code": plain text that lists their stars, which they
   hand in through whatever the class already uses (Google Classroom, a form, email). The teacher pastes the
   codes into the class dashboard. Nothing is sent anywhere by this site.

   Progress code format (version 1), all URL-safe:
     A1G1~<class code>~<nickname, URI-encoded>~<minutes since 2026-01-01, base 36>~<slug>.<stars>~...~<check>
   <stars> is 4 characters: 12 levels × 2 bits (0–3 stars), in base64url. <check> is a short checksum that
   catches typos and cut-off pastes (it is not a security feature). */
(function () {
  "use strict";
  const CL = (window.A1G_CLASS = {});
  const ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";     // no 0/O, 1/I/L
  const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const EPOCH = Date.UTC(2026, 0, 1);
  const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? d : v; } catch (e) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const games = () => (window.A1G_CATALOG ? A1G_CATALOG.domains.flatMap((d) => d.games).filter((g) => g.ready) : []);

  CL.normCode = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  CL.prettyCode = (s) => { const c = CL.normCode(s); return c.length === 6 ? c.slice(0, 3) + "-" + c.slice(3) : c; };
  CL.validCode = (s) => { const c = CL.normCode(s); return c.length === 6 && [...c].every((ch) => ALPHA.includes(ch)); };
  CL.newCode = function () {
    const r = new Uint32Array(6); (window.crypto || window.msCrypto).getRandomValues(r);
    return CL.prettyCode([...r].map((n) => ALPHA[n % ALPHA.length]).join(""));
  };
  CL.cleanNick = (s) => String(s || "").replace(/\s+/g, " ").trim().slice(0, 24);

  function check(s) {                    // FNV-1a, 4 base-36 characters
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return (h % 1679616).toString(36).padStart(4, "0");
  }
  const packStars = (arr) => { let n = 0; for (let i = 0; i < 12; i++) n = n * 4 + Math.max(0, Math.min(3, +arr[i] || 0)); return [18, 12, 6, 0].map((s) => B64[(n >> s) & 63]).join(""); };
  const unpackStars = (s) => { let n = 0; for (const ch of s) { const v = B64.indexOf(ch); if (v < 0) return null; n = n * 64 + v; } const out = []; for (let i = 11; i >= 0; i--) { out[i] = n & 3; n >>= 2; } return out; };

  // ---------- student side ----------
  CL.mine = () => read("a1g-class", null);
  CL.join = function (info) {
    const c = { code: CL.prettyCode(info.code), nick: CL.cleanNick(info.nick), name: String(info.name || "").slice(0, 60), games: (info.games || []).filter((s) => games().some((g) => g.slug === s)), joined: Date.now() };
    if (info.calc === false) c.calc = false;
    write("a1g-class", c);
    return c;
  };
  CL.leave = () => { try { localStorage.removeItem("a1g-class"); } catch (e) {} };
  CL.starsFor = (slug) => (window.A1G_LOOK ? A1G_LOOK.stars(slug) : {});
  CL.progressCode = function () {
    const me = CL.mine(); if (!me) return null;
    const t = Math.max(0, Math.round((Date.now() - EPOCH) / 60000)).toString(36);
    const parts = ["A1G1", CL.normCode(me.code), encodeURIComponent(me.nick).replace(/~/g, "%7E"), t];
    games().forEach((g) => { const s = CL.starsFor(g.slug); const arr = Array.from({ length: 12 }, (_, i) => +s[i] || 0); if (arr.some(Boolean)) parts.push(g.slug + "." + packStars(arr)); });
    const body = parts.join("~");
    return body + "~" + check(body);
  };

  // ---------- reading progress codes ----------
  CL.parse = function (code) {
    const p = String(code).trim().split("~");
    if (p[0] !== "A1G1" || p.length < 5) return { error: "Not a progress code" };
    const chk = p.pop(), body = p.join("~");
    if (check(body) !== chk) return { error: "Damaged or incomplete code (check it was copied in full)" };
    let nick; try { nick = CL.cleanNick(decodeURIComponent(p[2])); } catch (e) { return { error: "Damaged code" }; }
    const out = { classCode: CL.prettyCode(p[1]), nick, time: EPOCH + parseInt(p[3], 36) * 60000, stars: {} };
    for (const e of p.slice(4)) {
      const m = /^([a-z0-9-]+)\.([A-Za-z0-9_-]{4})$/.exec(e); if (!m) return { error: "Damaged code" };
      const s = unpackStars(m[2]); if (s) out.stars[m[1]] = s;
    }
    return out;
  };
  CL.findCodes = (text) => String(text || "").match(/A1G1~[A-Za-z0-9~%._-]+/g) || [];

  // ---------- teacher side ----------
  CL.all = () => read("a1g-classes", {});
  CL.saveAll = (all) => write("a1g-classes", all);
  CL.get = (code) => CL.all()[CL.prettyCode(code)] || null;
  CL.create = function (name, gameSlugs, calc) {
    const all = CL.all(); let code; do { code = CL.newCode(); } while (all[code]);
    all[code] = { code, name: String(name || "My class").trim().slice(0, 60) || "My class", games: gameSlugs || [], calc: calc !== false, created: Date.now(), students: {} };
    CL.saveAll(all); return all[code];
  };
  CL.update = function (code, fields) { const all = CL.all(), c = all[CL.prettyCode(code)]; if (!c) return null; Object.assign(c, fields); CL.saveAll(all); return c; };
  CL.remove = function (code) { const all = CL.all(); delete all[CL.prettyCode(code)]; CL.saveAll(all); };
  CL.removeStudent = function (code, key) { const all = CL.all(), c = all[CL.prettyCode(code)]; if (c) { delete c.students[key]; CL.saveAll(all); } };
  CL.joinLink = function (c, root) {
    const q = new URLSearchParams({ join: c.code, name: c.name });
    if (c.games && c.games.length) q.set("games", c.games.join(","));
    if (c.calc === false) q.set("calc", "0");
    return new URL("class/?" + q.toString(), root || location.href).href;
  };
  // Add every progress code found in some pasted text. Newer hand-ins replace older ones.
  CL.importText = function (text, onlyClass) {
    const all = CL.all(), res = { added: 0, updated: 0, same: 0, otherClass: [], bad: 0, names: [] };
    CL.findCodes(text).forEach((code) => {
      const p = CL.parse(code);
      if (p.error) { res.bad++; return; }
      const c = all[p.classCode];
      if (!c || (onlyClass && p.classCode !== CL.prettyCode(onlyClass))) { res.otherClass.push(p.classCode); return; }
      const key = p.nick.toLowerCase(), old = c.students[key];
      if (old && old.time >= p.time) { res.same++; return; }
      c.students[key] = { nick: p.nick, time: p.time, stars: p.stars };
      old ? res.updated++ : res.added++;
      res.names.push(p.nick);
    });
    CL.saveAll(all);
    return res;
  };
  CL.summary = function (stars) { const s = stars || []; let total = 0, solved = 0; for (let i = 0; i < 12; i++) { total += +s[i] || 0; if (s[i]) solved++; } return { stars: total, solved }; };
  CL.backup = () => JSON.stringify({ app: "algebra1-games", kind: "classes", version: 1, saved: new Date().toISOString(), classes: CL.all() }, null, 1);
  CL.restore = function (json) {
    const data = JSON.parse(json);
    if (!data || data.kind !== "classes" || typeof data.classes !== "object") throw new Error("This isn't an Algebra 1 Games class file.");
    const all = CL.all(); let n = 0;
    Object.values(data.classes).forEach((c) => {
      if (!c || !CL.validCode(c.code)) return;
      const mine = all[c.code];
      if (!mine) { all[c.code] = c; n++; return; }
      Object.entries(c.students || {}).forEach(([k, s]) => { if (!mine.students[k] || mine.students[k].time < s.time) mine.students[k] = s; });
      n++;
    });
    CL.saveAll(all); return n;
  };
})();
