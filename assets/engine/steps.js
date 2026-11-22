/* Algebra 1 Games: step-sequence runner.
 * Many games walk students through a short chain of reasoning steps (choose a rewrite, fill a template,
 * answer a question). Steps.run renders each step into the controls area, gives targeted feedback for
 * wrong answers, counts mistakes for stars, and wires api.autoplay so tests can play the answer key.
 *
 * step types:
 *   { type: "choice", prompt, options: [{ label, ok, why }], done?: html }   // why = feedback if picked wrongly
 *   { type: "input", prompt: "x = [] or x = []", answers: [n, n], unordered?: true, hint?, done?: html,
 *     accept?: (values) => true | "feedback" }    // [] placeholders become inputs; answers numeric
 *   { type: "click", prompt, check: () => true | "feedback", autoplay: () => void, button? } // game-owned interaction
 * Each step may have onEnter(stepIndex) and onDone() hooks to update the game's picture.
 */
(function () {
  "use strict";
  const Steps = (window.Steps = {});

  Steps.run = function (api, o) {
    const h = api.h;
    const steps = o.steps;
    let i = 0, mistakes = 0, finished = false;
    const work = [];
    const box = h("div", { style: { display: "flex", flexDirection: "column", gap: "10px", width: "100%" } });
    api.controls.appendChild(box);
    const done = () => api.log(work.length ? work : null, o.logTitle || "Your work");

    function show() {
      box.innerHTML = "";
      const st = steps[i];
      if (st.onEnter) st.onEnter(i);
      const prompt = h("div", { style: { fontSize: "19px", fontWeight: 700 } });
      if (st.type === "input") {
        // render prompt with inline inputs
        prompt.innerHTML = st.prompt.replace(/\[\]/g, '<span data-answer-slot></span>');
        const slots = [...prompt.querySelectorAll("[data-answer-slot]")];
        const fields = [];
        slots.forEach((slot, k) => {
          const f = h("input", { type: "text", "aria-label": (st.fieldLabels && st.fieldLabels[k]) || "Answer " + (k + 1), autocomplete: "off",
            style: { width: (st.width || 74) + "px", margin: "0 4px", minHeight: "44px", fontFamily: "var(--body)", fontWeight: 800,
              fontSize: "20px", padding: "4px 8px", border: "2px solid var(--line)", borderRadius: "10px", textAlign: "center" } });
          f.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
          fields.push(f);
          slot.replaceWith(f);
        });
        const btn = api.button(st.button || "Check", check, "primary");
        box.append(prompt, h("div", null, btn));
        if (st.note) box.appendChild(h("div", { class: "preview", html: st.note }));
        if (i > 0 && !matchMedia("(pointer: coarse)").matches) fields[0]?.focus({ preventScroll: true });

        function check() {
          const vals = fields.map((f) => Alg.parseNum(f.value));
          if (vals.some((v) => Number.isNaN(v))) return api.msg("Fill in every box with a number (fractions like 3/4 are fine).", "warn");
          let res;
          if (st.accept) res = st.accept(vals);
          else res = matches(vals, st.answers, st.unordered) ? true : (st.hint || "Not quite. Check your work and try again.");
          if (res === true) advance(st.done || st.prompt.replace(/\[\]/g, () => fmtVal(vals.shift())));
          else { mistakes++; api.msg(res, "bad"); }
        }
        st._auto = () => { fields.forEach((f, k) => (f.value = st.autoAnswers ? st.autoAnswers[k] : st.answers[k])); btn.click(); };
      } else if (st.type === "choice") {
        prompt.innerHTML = st.prompt;
        const grid = h("div", { class: "choices" });
        const options = st.options.slice();
        if (!st.ordered) {
          for (let end = options.length - 1; end > 0; end--) {
            const pick = Math.floor(Math.random() * (end + 1));
            [options[pick], options[end]] = [options[end], options[pick]];
          }
        }
        options.forEach((op) => {
          const b = h("button", { class: "choice", html: op.label, on: { click: () => {
            if (b.disabled) return;
            if (op.ok) { b.classList.add("right"); advance(st.done || op.label); }
            else { mistakes++; b.classList.add("wrong"); b.disabled = true; api.msg(op.why || "Not that one. Try again.", "bad"); }
          } } });
          b._ok = !!op.ok;
          grid.appendChild(b);
        });
        box.append(prompt, grid);
        st._auto = () => [...grid.children].find((b) => b._ok).click();
      } else if (st.type === "click") {
        prompt.innerHTML = st.prompt;
        box.appendChild(prompt);
        if (st.controls) box.appendChild(st.controls());
        const btn = api.button(st.button || "Check", () => {
          const r = st.check();
          if (r === true) advance(st.done || "");
          else { mistakes++; api.msg(r, "bad"); }
        }, "primary");
        box.appendChild(h("div", null, btn));
        st._auto = () => { st.autoplay(); btn.click(); };
      }
      api.meta((o.meta ? o.meta + " · " : "") + "Step " + (i + 1) + " of " + steps.length);
    }

    function fmtVal(v) { return Alg.num(Alg.round(v, 4)); }

    function matches(vals, answers, unordered) {
      if (vals.length !== answers.length) return false;
      if (!unordered) return vals.every((v, k) => Alg.close(v, answers[k], 1e-6));
      const left = answers.slice();
      return vals.every((v) => { const k = left.findIndex((a) => Alg.close(v, a, 1e-6)); if (k < 0) return false; left.splice(k, 1); return true; });
    }

    function advance(doneHtml) {
      const st = steps[i];
      if (doneHtml) work.push(doneHtml);
      done();
      if (st.onDone) st.onDone(i);
      api.msg(st.praise || "Correct.", "good");
      if (doneHtml && !st.praise) api.feedback.append(" ", h("span", { html: doneHtml }));
      i++;
      if (i < steps.length) show();
      else finish();
    }

    function finish() {
      finished = true;
      box.innerHTML = "";
      const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
      const r = o.result ? o.result() : {};
      api.win(Object.assign({ stars, lines: work, note: mistakes === 0 ? "No mistakes. Perfect!" : mistakes + (mistakes === 1 ? " mistake" : " mistakes") + " along the way." }, r));
    }

    api.autoplay = () => {
      let guard = 0;
      while (!finished && guard++ < 50) steps[i]._auto();
      return {};
    };
    show();
    return { get mistakes() { return mistakes; }, get index() { return i; } };
  };
})();
