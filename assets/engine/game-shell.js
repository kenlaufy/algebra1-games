/* Algebra 1 Games: shared game shell.
 *
 * A game page loads catalog.js, cartoon.js, this file, and its own game.js, which calls
 * GameShell.register(config). The shell builds the page (header, level bar, help, levels,
 * win screen, stars, keyboard handling) and calls config.load(level, api, index) for each level.
 *
 * config = {
 *   slug, title, subtitle, help: { intro, steps: [html], note },
 *   stages: { 1: "Stage 1 · ...", ... },
 *   levels: [ { stage, tip, par?, ...game data } ],     // 12 levels
 *   setup?(api), load(level, api, index),
 *   guide: { ... }  and  answerKey(level, index) -> { prompt, solution, answer }   // teacher guide
 * }
 */
(function () {
  "use strict";
  const MINUS = "−";
  const GS = (window.GameShell = {});
  GS.MINUS = MINUS;
  GS.num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  GS.paren = (n) => (n < 0 ? "(" + GS.num(n) + ")" : String(n));

  // ---------- tiny DOM helper ----------
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "on") for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
        else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
    }
    return el;
  }
  GS.h = h;

  GS.findGame = function (slug) {
    const cat = window.A1G_CATALOG;
    if (!cat) return null;
    for (const d of cat.domains) for (const g of d.games) if (g.slug === slug) return Object.assign({ domain: d.name }, g);
    return null;
  };

  GS.register = function (cfg) {
    GS.config = cfg;
    if (window.GAME_GUIDE_MODE) return;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => start(cfg));
    else start(cfg);
  };

  // In test mode (?test=1) animations finish instantly so autoplay is synchronous.
  const reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || /[?&]test=1/.test(location.search);
  GS.reduceMotion = reduceMotion;

  function start(cfg) {
    const info = GS.findGame(cfg.slug) || {};
    const code = info.code || "";
    const title = cfg.title || info.name;
    const root = "../../";
    const STORE = "a1g-stars-" + cfg.slug;

    let stars = {};
    try { stars = JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { stars = {}; }

    document.title = title + " · " + (cfg.subtitle || info.desc || "") + " · Algebra 1 Games";
    if (!document.querySelector('link[rel="icon"]')) {
      document.head.appendChild(h("link", { rel: "icon", href: root + "assets/logo.svg", type: "image/svg+xml" }));
    }
    const metaDesc = h("meta", { name: "description", content: (info.desc || cfg.subtitle || "") + (code ? " Aligned to Massachusetts " + code + "." : "") });
    document.head.appendChild(metaDesc);

    // ---------- page skeleton ----------
    const els = {};
    const body = document.body;
    body.appendChild(h("a", { class: "skip-link", href: "#main" }, "Skip to the game"));
    body.appendChild(h("header", { class: "site-header" },
      h("a", { class: "brand", href: root }, h("img", { src: root + "assets/logo.svg", alt: "" }), "Algebra 1 Games"),
      h("nav", { class: "site-nav", "aria-label": "Main" },
        h("a", { href: root }, "Games"), h("a", { href: root + "teachers/" }, "For teachers"), h("a", { href: root + "privacy/" }, "Privacy"))));
    const LOOK = window.A1G_LOOK, place = LOOK && LOOK.place(cfg.slug), unit = place && LOOK.unit(place.domain.name);
    if (unit) { document.documentElement.style.setProperty("--u", unit.color); document.documentElement.style.setProperty("--t", unit.tint); }
    body.appendChild(h("div", { class: "game-head" },
      h("div", null,
        h("nav", { class: "crumb", "aria-label": "Breadcrumb" }, h("a", { href: root + "#games" }, "All games"), unit ? h("span", null, unit.short) : null),
        h("h1", null, title),
        h("div", { class: "sub" }, code ? h("span", { class: "code" }, code) : null, cfg.subtitle || info.desc || "")),
      h("div", { class: "head-actions" },
        els.helpBtn = h("button", { class: "btn" }, "How to play"),
        els.levelsBtn = h("button", { class: "btn" }, "Levels"))));
    body.appendChild(h("main", { id: "main", class: "game-main" },
      h("div", { class: "levelbar" }, h("div", { class: "lvl" }, els.levelTitle = h("h2"), els.pips = h("div", { class: "pips" })), els.levelMeta = h("div", { class: "meta" })),
      els.firstMove = h("p", { class: "first-move" }, h("strong", null, "Start here"), cfg.firstMove),
      els.tip = h("div", { class: "tip" }),
      els.stage = h("div", { class: "stagecard", id: "diagram" }),
      els.zoom = h("button", { class: "btn diagram-zoom", "aria-controls": "diagram", "aria-pressed": "false" }, "Enlarge diagram"),
      h("div", { class: "controls", role: "group", "aria-label": "Controls" },
        els.controls = h("div", { style: { display: "contents" } }),
        h("div", { class: "spacer" }),
        els.restartBtn = h("button", { class: "btn" }, "Restart")),
      els.msg = h("div", { class: "msg", role: "status", "aria-live": "polite" }),
      els.logBox = h("div", { class: "log hidden" }, els.logTitle = h("h3"), els.log = h("ol"))));
    body.appendChild(h("footer", { class: "site-footer" },
      h("div", null, "Aligned to the 2017 Massachusetts Curriculum Framework for Mathematics, Model Algebra I" + (code ? ", standard " + code : "") + "."),
      h("nav", { "aria-label": "Footer" },
        h("a", { class: "teacher-only", href: root + "teachers/guide.html?g=" + cfg.slug }, "Teacher guide"), h("a", { href: root + "privacy/" }, "Privacy"))));
    if (window.A1G_NAV) window.A1G_NAV.apply();
    if (window.A1G_CALC) window.A1G_CALC.mount(document.querySelector(".head-actions"));

    // overlays
    const help = cfg.help || {};
    els.helpOverlay = overlay("helpTitle",
      h("h2", { id: "helpTitle" }, "How to play"),
      help.intro ? h("p", { style: { fontSize: "18px", margin: "6px 0 4px" }, html: help.intro }) : null,
      h("ol", { class: "help-steps" }, (help.steps || []).map((s) => h("li", { html: s }))),
      help.note ? h("p", { style: { fontSize: "16px", color: "var(--muted)", margin: 0 }, html: help.note }) : null,
      h("div", { class: "row" }, els.closeHelp = h("button", { class: "btn primary" }, "Let's go")));
    els.winOverlay = overlay("winTitle",
      els.winTitle = h("h2", { id: "winTitle" }, "Solved!"),
      els.winAnswer = h("div", { class: "answer" }),
      els.winStars = h("div", { class: "stars" }),
      els.winSteps = h("div", { style: { fontWeight: 600 } }),
      els.winLinesTitle = h("h3"),
      els.winLines = h("ol"),
      els.winCheck = h("div", { class: "check" }),
      h("div", { class: "row" },
        els.nextGame = h("a", { class: "btn next-game", hidden: true }),
        els.replayBtn = h("button", { class: "btn" }, "Play again"),
        els.nextBtn = h("button", { class: "btn primary" }, "Next level")));
    els.levelsOverlay = overlay("levelsTitle",
      h("h2", { id: "levelsTitle" }, "Levels"),
      els.levelsList = h("div"),
      h("div", { class: "row" },
        els.resetStars = h("button", { class: "btn" }, "Reset my stars"),
        els.closeLevels = h("button", { class: "btn primary" }, "Close")));

    function overlay(labelId, ...kids) {
      const o = h("div", { class: "overlay", role: "dialog", "aria-modal": "true", "aria-labelledby": labelId },
        h("div", { class: "panel" }, ...kids));
      body.appendChild(o);
      return o;
    }
    let lastFocus = null;
    function openOverlay(o, focusEl) {
      lastFocus = document.activeElement;
      o.classList.add("show");
      setTimeout(() => focusEl.focus(), 0);
    }
    function closeOverlay(o) {
      o.classList.remove("show");
      if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
    }

    // ---------- state + api ----------
    const levels = cfg.levels;
    let index = 0, solved = false, winTimer;
    const api = {
      h, MINUS, num: GS.num, paren: GS.paren, reduceMotion,
      get feedback() { return els.msg; },
      get stage() { return els.stage; },
      get controls() { return els.controls; },
      get index() { return index; },
      get level() { return levels[index]; },
      get solved() { return solved; },
      msg(text, kind) { els.msg.textContent = text; els.msg.className = "msg" + (kind ? " " + kind : ""); },
      meta(extra) {
        const st = cfg.stages && cfg.stages[levels[index].stage];
        els.levelMeta.textContent = [st, extra].filter(Boolean).join(" · ");
      },
      log(lines, heading) {
        if (!lines) { els.logBox.classList.add("hidden"); return; }
        els.logBox.classList.remove("hidden");
        els.logTitle.textContent = heading || "Your moves, written in math";
        els.log.innerHTML = "";
        lines.forEach((l) => els.log.appendChild(lineItem(l)));
      },
      button(label, onClick, cls, attrs) {
        return h("button", Object.assign({ class: "btn" + (cls ? " " + cls : ""), on: { click: onClick } }, attrs || {}), label);
      },
      seg(options, value, onChange, aria) {
        let cur = value;
        const wrap = h("div", { class: "seg", role: "group", "aria-label": aria || "Options" });
        const btns = options.map((o) => {
          const b = h("button", { class: (o.cls || "") + (o.value === cur ? " on" : ""), "aria-label": o.aria || null,
            "aria-pressed": o.value === cur ? "true" : "false",
            on: { click: () => { if (b.disabled) return; set(o.value); onChange && onChange(o.value); } } }, o.label);
          b._v = o.value;
          wrap.appendChild(b);
          return b;
        });
        function set(v) {
          cur = v;
          btns.forEach((b) => { b.classList.toggle("on", b._v === v); b.setAttribute("aria-pressed", b._v === v ? "true" : "false"); });
        }
        return { el: wrap, get: () => cur, set, disable(on) { btns.forEach((b) => (b.disabled = !!on)); }, buttons: btns };
      },
      number(value, attrs) {
        return h("input", Object.assign({ type: "number", value: value, step: 1, inputmode: "numeric" }, attrs || {}));
      },
      svg(viewBox, label) {
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.setAttribute("viewBox", viewBox);
        s.setAttribute("role", "img");
        s.setAttribute("aria-label", label || "");
        return s;
      },
      tween(from, to, ms, onUpdate, onDone) {
        if (reduceMotion || ms <= 0) { onUpdate(to); onDone && onDone(); return; }
        const t0 = performance.now();
        const step = (t) => {
          const k = Math.min(1, (t - t0) / ms);
          const e = 1 - Math.pow(1 - k, 3);
          onUpdate(from + (to - from) * e);
          if (k < 1) requestAnimationFrame(step); else onDone && onDone();
        };
        requestAnimationFrame(step);
      },
      win(r) { win(r); },
      restart() { load(index); },
      next() { load(index < levels.length - 1 ? index + 1 : 0); },
      goto(i) { load(i); },
      // A game sets api.autoplay inside load(): plays the current level's answer key through the real controls.
      autoplay: null,
    };
    GS.api = api;

    function lineItem(l) {
      if (typeof l === "string") return h("li", { html: l });
      return h("li", null, l.move ? h("span", { class: "move" }, l.move + ": ") : null, h("span", { html: l.text }));
    }

    function load(i) {
      index = i; solved = false;
      const lv = levels[i];
      clearTimeout(winTimer);
      els.winOverlay.classList.remove("show");
      els.firstMove.hidden = i !== 0 || !cfg.firstMove;
      els.stage.innerHTML = "";
      els.controls.innerHTML = "";
      els.levelTitle.textContent = "Level " + (i + 1) + " of " + levels.length;
      renderPips();
      els.tip.innerHTML = lv.tip || "";
      api.log(null);
      api.msg("");
      api.autoplay = null;
      api.meta(lv.par ? "Par: " + lv.par + (lv.par === 1 ? " move" : " moves") : "");
      cfg.load(lv, api, i);
      els.zoom.hidden = !els.stage.querySelector("svg");
      setZoom(false);
    }

    function renderPips() {
      let total = 0;
      els.pips.innerHTML = "";
      levels.forEach((lv, k) => {
        const n = stars[k] || 0; total += n;
        els.pips.appendChild(h("span", { class: "pip s" + n + (k === index ? " cur" : ""), "aria-hidden": "true" }));
      });
      els.pips.appendChild(h("span", { class: "pip-total" }, "★ " + total + "/" + levels.length * 3));
      els.pips.setAttribute("aria-label", total + " of " + levels.length * 3 + " stars earned");
      els.pips.setAttribute("role", "img");
    }

    function setZoom(enlarged) {
      els.stage.classList.toggle("enlarged", enlarged);
      els.zoom.setAttribute("aria-pressed", String(enlarged));
      els.zoom.textContent = enlarged ? "Fit diagram" : "Enlarge diagram";
    }
    els.zoom.addEventListener("click", () => setZoom(!els.stage.classList.contains("enlarged")));

    function starCount(r) {
      if (r.stars) return r.stars;
      if (r.par == null || r.steps == null) return 3;
      if (r.steps <= r.par) return 3;
      if (r.steps <= r.par + 2) return 2;
      return 1;
    }

    function win(r) {
      if (solved) return;
      solved = true;
      const n = starCount(r);
      if (n > (stars[index] || 0)) {
        stars[index] = n;
        try { localStorage.setItem(STORE, JSON.stringify(stars)); } catch (e) {}
      }
      winTimer = setTimeout(() => {
        const last = index === levels.length - 1;
        els.winTitle.textContent = last ? "Final level solved!" : (r.title || "Solved!");
        els.winAnswer.innerHTML = r.answer || "";
        els.winAnswer.classList.toggle("hidden", !r.answer);
        els.winStars.innerHTML = "★".repeat(n) + '<span class="off">' + "★".repeat(3 - n) + "</span>";
        let st = "";
        if (r.steps != null && r.par != null) {
          st = "You used " + r.steps + (r.steps === 1 ? " move" : " moves") + ". Par is " + r.par + "." + (n < 3 ? " Can you do it in fewer?" : "");
        }
        els.winSteps.textContent = r.note || st;
        els.winLinesTitle.textContent = r.linesTitle || "What you did, written in math";
        els.winLinesTitle.classList.toggle("hidden", !(r.lines && r.lines.length));
        els.winLines.innerHTML = "";
        (r.lines || []).forEach((l) => els.winLines.appendChild(lineItem(l)));
        els.winCheck.innerHTML = r.check || "";
        els.nextBtn.textContent = last ? "Back to level 1" : "Next level";
        const nxt = last && place && place.next;
        els.nextGame.hidden = !nxt;
        if (nxt) { els.nextGame.href = root + "games/" + nxt.slug + "/"; els.nextGame.textContent = "Next game: " + nxt.name; }
        els.nextGame.classList.toggle("primary", !!nxt);
        els.nextBtn.classList.toggle("primary", !nxt);
        renderPips();
        openOverlay(els.winOverlay, els.nextBtn);
      }, r.delay == null ? 700 : r.delay);
    }

    function showLevels() {
      els.levelsList.innerHTML = "";
      const stageIds = [...new Set(levels.map((l) => l.stage))];
      stageIds.forEach((st) => {
        els.levelsList.appendChild(h("div", { class: "stage-label" }, (cfg.stages && cfg.stages[st]) || "Levels"));
        const grid = h("div", { class: "levels-grid" });
        levels.forEach((lv, i) => {
          if (lv.stage !== st) return;
          grid.appendChild(h("button", { class: i === index ? "current" : "", on: { click: () => { closeOverlay(els.levelsOverlay); load(i); } } },
            "Level " + (i + 1), h("small", null, "★".repeat(stars[i] || 0))));
        });
        els.levelsList.appendChild(grid);
      });
      openOverlay(els.levelsOverlay, els.closeLevels);
    }

    // ---------- wiring ----------
    els.helpBtn.addEventListener("click", () => openOverlay(els.helpOverlay, els.closeHelp));
    els.closeHelp.addEventListener("click", () => closeOverlay(els.helpOverlay));
    els.levelsBtn.addEventListener("click", showLevels);
    els.closeLevels.addEventListener("click", () => closeOverlay(els.levelsOverlay));
    els.resetStars.addEventListener("click", () => {
      if (!confirm("Clear all your stars for this game on this device?")) return;
      stars = {};
      try { localStorage.removeItem(STORE); } catch (e) {}
      showLevels();
      renderPips();
    });
    els.restartBtn.addEventListener("click", () => load(index));
    els.replayBtn.addEventListener("click", () => { closeOverlay(els.winOverlay); load(index); });
    els.nextBtn.addEventListener("click", () => { closeOverlay(els.winOverlay); api.next(); });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      [els.helpOverlay, els.levelsOverlay, els.winOverlay].forEach((o) => { if (o.classList.contains("show")) closeOverlay(o); });
    });

    if (cfg.setup) cfg.setup(api);
    let startAt = 0;
    const m = /[?&]level=(\d+)/.exec(location.search);
    if (m) startAt = Math.max(0, Math.min(levels.length - 1, Number(m[1]) - 1));
    load(startAt);
    if (!window.GAME_GUIDE_MODE && !/[?&]test=1/.test(location.search)) { try { localStorage.setItem("a1g-last", cfg.slug); } catch (e) {} }

  }
})();
