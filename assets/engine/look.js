/* Algebra 1 Games: shared look for game listings.
   Unit (domain) colors and short names, a small picture for each kind of game,
   and a reader for the stars a student has saved on this device. */
(function () {
  "use strict";
  const UNITS = {
    "Number and Quantity": { short: "Number", color: "#4f6fb0", tint: "#e4ebf7" },
    "Seeing Structure in Expressions": { short: "Expressions", color: "#7d5fb0", tint: "#ece6f6" },
    "Arithmetic with Polynomials": { short: "Polynomials", color: "#b8503a", tint: "#f6e3de" },
    "Creating Equations": { short: "Creating Equations", color: "#b8741f", tint: "#f7ead6" },
    "Reasoning with Equations and Inequalities": { short: "Solving", color: "#346d42", tint: "#e0eee3" },
    "Interpreting Functions": { short: "Functions", color: "#2a7d7d", tint: "#dcefee" },
    "Building Functions": { short: "Building Functions", color: "#a84f78", tint: "#f5e1ea" },
    "Linear, Quadratic and Exponential Models": { short: "Models", color: "#8a6440", tint: "#f0e6da" },
    "Interpreting Categorical and Quantitative Data": { short: "Statistics", color: "#5f7a26", tint: "#e8efd8" },
  };
  const K = 'stroke="#23262d" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const ICONS = {
    balance: '<path d="M32 14v36M18 52h28" ' + K + ' fill="none"/><path d="M12 20h40" ' + K + '/><path d="M12 20l-7 16h14zM52 20l-7 16h14z" ' + K + ' fill="#fff"/><circle cx="32" cy="15" r="4" fill="#e7b84a" ' + K + '/>',
    coord: '<rect x="8" y="8" width="48" height="48" rx="6" fill="#fff" ' + K + '/><path d="M8 32h48M32 8v48" stroke="#23262d" stroke-width="1.5" opacity=".45"/><path d="M14 48L50 16" ' + K + '/><circle cx="38" cy="26.7" r="4.5" fill="#e7b84a" ' + K + '/>',
    function: '<rect x="18" y="16" width="28" height="30" rx="6" fill="#fff" ' + K + '/><path d="M4 31h12M48 31h12" ' + K + '/><path d="M12 26l5 5-5 5M56 26l5 5-5 5" ' + K + ' fill="none"/><text x="32" y="37" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-style="italic" font-size="17" fill="#23262d">f</text><circle cx="32" cy="52" r="3" fill="#e7b84a" ' + K + '/>',
    cards: '<rect x="8" y="14" width="26" height="36" rx="5" fill="#fff" transform="rotate(-10 21 32)" ' + K + '/><rect x="30" y="12" width="26" height="36" rx="5" fill="#fff" transform="rotate(8 43 30)" ' + K + '/><path d="M37 26l5 5 8-9" ' + K + ' fill="none" transform="rotate(8 43 30)"/>',
    time: '<circle cx="24" cy="26" r="15" fill="#fff" ' + K + '/><path d="M24 17v9l6 4" ' + K + ' fill="none"/><path d="M8 56h48" ' + K + '/><path d="M30 54c8 0 14-6 18-20" ' + K + ' fill="none"/><circle cx="48" cy="34" r="4" fill="#e7b84a" ' + K + '/>',
    data: '<path d="M8 56h48" ' + K + '/><rect x="12" y="34" width="9" height="22" fill="#fff" ' + K + '/><rect x="27" y="22" width="9" height="34" fill="#fff" ' + K + '/><rect x="42" y="28" width="9" height="28" fill="#fff" ' + K + '/><circle cx="16" cy="16" r="3.5" fill="#e7b84a" ' + K + '/><circle cx="30" cy="10" r="3.5" fill="#e7b84a" ' + K + '/><circle cx="46" cy="14" r="3.5" fill="#e7b84a" ' + K + '/>',
  };
  const look = (window.A1G_LOOK = {});
  look.unit = (name) => UNITS[name] || { short: name, color: "#48566b", tint: "#ebe3d0" };
  look.icon = (engine) => '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' + (ICONS[engine] || ICONS.cards) + "</svg>";
  // stars saved by the games on this device: { levelIndex: stars }
  look.stars = function (slug) {
    const key = slug === "a-rei-b-3" ? "balance-workshop-stars" : "a1g-stars-" + slug;
    try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch (e) { return {}; }
  };
  look.progress = function (slug, levels) {
    levels = levels || 12;
    const s = look.stars(slug);
    let total = 0, solved = 0;
    for (let i = 0; i < levels; i++) { const n = +s[i] || 0; total += n; if (n) solved++; }
    return { stars: total, max: levels * 3, solved, levels };
  };
  // the domain a game belongs to, and the next game in that unit
  look.place = function (slug) {
    for (const d of (window.A1G_CATALOG || { domains: [] }).domains) {
      const i = d.games.findIndex((g) => g.slug === slug);
      if (i >= 0) return { domain: d, game: d.games[i], next: d.games.slice(i + 1).concat(d.games.slice(0, i)).find((g) => g.ready) };
    }
    return null;
  };
})();
