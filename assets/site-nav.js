/* Algebra 1 Games: student and teacher versions of the site.
   The role is remembered on this device only (localStorage "a1g-role"); there are no accounts.
   This script draws the main menu for the role, marks the page with data-role (CSS hides
   .teacher-only things in the student version) and adds a switch to the footer. */
(function () {
  "use strict";
  const me = document.currentScript && document.currentScript.src;
  const root = me ? me.replace(/assets\/site-nav\.js.*$/, "") : "/";
  const NAV = (window.A1G_NAV = {});
  NAV.root = root;
  NAV.role = function () { try { return localStorage.getItem("a1g-role") === "teacher" ? "teacher" : "student"; } catch (e) { return "student"; } };
  NAV.setRole = function (r) { try { localStorage.setItem("a1g-role", r); } catch (e) {} NAV.apply(); };

  NAV.apply = function () {
    const role = NAV.role();
    document.documentElement.dataset.role = role;
    const nav = document.querySelector(".site-header .site-nav");
    if (nav) {
      const links = role === "teacher"
        ? [["Games", root], ["Guides", root + "teachers/"], ["Classes", root + "classes/"]]
        : [["Games", root], ["My class", root + "class/"]];
      const here = location.href.split(/[?#]/)[0].replace(/index\.html$/, "");
      const inGame = /\/games\//.test(here);
      nav.innerHTML = "";
      links.forEach(([label, href]) => {
        const a = document.createElement("a");
        a.href = href; a.textContent = label;
        const current = here === href || (label === "Guides" && here.indexOf(root + "teachers/") === 0) || (label === "Games" && inGame);
        if (current) a.setAttribute("aria-current", "page");
        nav.appendChild(a);
      });
    }
    // brand text can hide on very small screens, keeping the logo
    const brand = document.querySelector(".site-header .brand");
    if (brand && !brand.querySelector(".brand-text")) {
      [...brand.childNodes].forEach((n) => { if (n.nodeType === 3 && n.textContent.trim()) { const s = document.createElement("span"); s.className = "brand-text"; s.textContent = n.textContent; n.replaceWith(s); } });
    }
    // footer switch between the two versions
    const foot = document.querySelector(".site-footer nav");
    if (foot) {
      let sw = foot.querySelector(".role-switch");
      if (!sw) {
        sw = document.createElement("button");
        sw.type = "button"; sw.className = "role-switch";
        sw.addEventListener("click", () => { NAV.setRole(NAV.role() === "teacher" ? "student" : "teacher"); location.reload(); });
        foot.appendChild(sw);
      }
      sw.textContent = role === "teacher" ? "Switch to student version" : "Teacher? Switch to teacher version";
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", NAV.apply);
  else NAV.apply();
})();
