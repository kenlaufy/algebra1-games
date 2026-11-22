/* Open playthrough.html on the same origin as the games. */
(async function () {
  const games = A1G_CATALOG.domains.flatMap(domain => domain.games).filter(game => game.ready);
  const widths = [320, 390, 1100];
  const balanceMoves = [
    [["-",2,"c"]], [["/",2]], [["-",1,"c"],["/",2]], [["-",1,"x"],["-",2,"c"],["/",2]],
    [["+",3,"c"]], [["-",1,"x"],["+",1,"c"]], [["-",2,"x"],["-",3,"c"],["/",2]], [["-",5,"c"],["/",-1]],
    [["-",2,"x"],["+",4,"c"],["/",3]], [["-",3,"x"],["+",9,"c"],["/",4]],
    [["+",2,"x"],["+",6,"c"],["/",3]], [["-",2,"x"],["+",8,"c"],["/",4]]
  ];
  let passed = 0, failed = 0;
  const status = document.querySelector("#status");
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  function button(d, label) {
    const b = [...d.querySelectorAll("button")].find(el => el.textContent.trim() === label && el.getClientRects().length && !el.disabled);
    if (!b) throw Error("Missing control: " + label);
    b.click();
  }
  function inspect(d) {
    const width = d.documentElement.clientWidth;
    if (d.documentElement.scrollWidth > width + 1) throw Error("Page overflow at " + width + " px");
    const text = d.body.innerText;
    if (/\\(?:frac|sqrt|left|right)\b|\$\$|<\/?(?:sup|span)>|\b(?:NaN|undefined)\b/.test(text)) throw Error("Exposed math markup or invalid value");
    for (const el of d.querySelectorAll(".panel,.choice,.stage-text,.controls,.answer,.msg,.area")) {
      if (el.clientWidth && el.scrollWidth > el.clientWidth + 2) throw Error("Overflow in " + el.className + " · " + el.textContent.slice(0, 60));
    }
  }
  function tryWrong(w, slug) {
    const d = w.document, api = w.GameShell.api;
    if (slug === "a-ced-a-4") {
      api.controls.querySelector('[aria-label="Piece"]').querySelectorAll("button").forEach(b => {
        if (b.textContent === api.level.T) b.click();
      });
      api.controls.querySelector(".primary").click();
    } else if (slug === "a-rei-c-5") {
      button(d, "Resize"); button(d, "Apply");
    } else if (slug === "a-rei-b-3-ineq") {
      api.controls.querySelector("input").value = "0";
      button(d, "Apply to both sides");
    } else {
      const choices = [...api.controls.querySelectorAll(".choice")];
      const wrong = choices.find(b => !b._ok);
      if (wrong) return wrong.click();
      // Some equations allow every method. Use one, then submit incorrect roots.
      if (choices.length) choices[0].click();
      const fields = [...d.querySelectorAll("main input")].filter(el => el.getClientRects().length && !el.readOnly);
      fields.forEach(el => el.value = "97");
      api.controls.querySelector(".primary").click();
    }
  }
  function balance(d, index) {
    function move(op, n, unit) {
      d.querySelector('[data-op="' + op + '"]').click();
      d.querySelector("#amount").value = n;
      if (unit) d.querySelector('[data-unit="' + unit + '"]').click();
    }
    function apply() { d.querySelector(index < 8 ? "#leftPanBtn" : "#applyBoth").click(); }
    move("/", 0); apply();
    if (!d.querySelector("#msg.bad")) throw Error("Missing division hint");
    balanceMoves[index].forEach(([op, n, unit]) => {
      move(op, n, unit); apply();
      if (index < 8) d.querySelector("#rightPanBtn").click();
    });
  }
  async function run(width) {
    const frame = document.createElement("iframe");
    frame.width = width; frame.height = width > 600 ? 800 : 740;
    frame.title = "Playthrough at " + width + " px";
    document.querySelector("#frames").append(frame);
    for (const game of games) {
      const row = document.createElement("li");
      const label = width + " px · " + game.name;
      row.textContent = label + " · running";
      document.querySelector("#results").append(row);
      let level = 0;
      try {
        const loaded = new Promise(resolve => frame.onload = resolve);
        frame.src = "../games/" + game.slug + "/index.html?test=1";
        await loaded;
        const w = frame.contentWindow, d = w.document;
        let problem;
        w.addEventListener("error", event => problem = event.message);
        // Includes intermediate steps rendered and removed synchronously by autoplay.
        d.addEventListener("click", () => {
          try { inspect(d); } catch (error) { problem ||= error.message; }
        }, true);
        const help = d.querySelector(".head-actions button, #helpBtn");
        help.click(); inspect(d);
        d.querySelector('.overlay.show .primary').click();
        for (level = 0; level < 12; level++) {
          if (game.slug === "a-rei-b-3") balance(d, level);
          else {
            tryWrong(w, game.slug);
            if (!d.querySelector(".msg.bad,.msg.warn")?.textContent) throw Error("Missing retry hint");
            inspect(d);
            const api = w.GameShell.api;
            api.autoplay();
            if (!api.solved) throw Error("Answer key did not solve the level");
          }
          const until = Date.now() + 7000;
          while (!d.querySelector('.overlay.show .answer') && Date.now() < until) await pause(50);
          const win = d.querySelector('.overlay.show');
          if (!win?.querySelector(".answer")?.textContent.trim()) throw Error("Missing win answer");
          inspect(d);
          if (problem) throw Error(problem);
          passed++;
          if (level < 11) win.querySelector(".primary").click();
        }
        row.textContent = label + " · 12/12";
      } catch (error) {
        failed++;
        row.textContent = label + " · level " + (level + 1) + " · " + error.message;
      }
    }
    frame.remove();
  }
  await Promise.all(widths.map(run));
  status.textContent = passed + " completed level runs. " + failed + " failed game runs.";
  document.title = (failed ? "FAIL" : "PASS") + " · Layout and retry playthroughs";
})();
