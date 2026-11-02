/* =========================================================
   SharpAcademy — application engine
   Router + progress (localStorage) + C# highlighter + UI
   ========================================================= */

/* ---------- State ---------- */
const STORE_KEY = "sharpacademy_progress_v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { name: "", xp: 0, streakDays: 1, lastActive: null, lessons: {} };
}
function saveProgress() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) {}
  renderNavStats();
}
let progress = loadProgress();

/* Streak handling */
(function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (progress.lastActive === today) { /* same day */ }
  else {
    const prev = progress.lastActive ? new Date(progress.lastActive) : null;
    if (prev) {
      const diff = Math.round((new Date(today) - prev) / 86400000);
      if (diff === 1) progress.streakDays = (progress.streakDays || 0) + 1;
      else if (diff > 1) progress.streakDays = 1;
    } else progress.streakDays = 1;
    progress.lastActive = today;
    saveProgress();
  }
})();

/* ---------- Flatten lessons for ordering / unlocking ---------- */
const FLAT = [];
COURSE.modules.forEach((m) => m.lessons.forEach((l) => FLAT.push({ mod: m, lesson: l })));
const TOTAL_LESSONS = FLAT.length;
const TOTAL_TASKS = FLAT.reduce((s, f) => s + f.lesson.tasks.length, 0);

function lessonDone(id) { return !!(progress.lessons[id] && progress.lessons[id].done); }
function globalIndex(lessonId) { return FLAT.findIndex((f) => f.lesson.id === lessonId); }
function isUnlocked(lessonId) {
  // Все уроки открыты — проходи в любом порядке.
  return true;
}
function doneCount() { return FLAT.filter((f) => lessonDone(f.lesson.id)).length; }
function moduleProgress(mod) {
  const done = mod.lessons.filter((l) => lessonDone(l.id)).length;
  return { done, total: mod.lessons.length, pct: Math.round((done / mod.lessons.length) * 100) };
}

/* ---------- XP / completion ---------- */
function ensureLesson(id) {
  if (!progress.lessons[id]) progress.lessons[id] = { done: false, tasks: {} };
  return progress.lessons[id];
}
function markTask(lessonId, idx, status) {
  const l = ensureLesson(lessonId);
  const prevStatus = l.tasks[idx];
  l.tasks[idx] = status;
  if (status === "solved" && prevStatus !== "solved") {
    progress.xp += 20;
    toast("+20 XP · задача решена 🎉", "success");
  }
  saveProgress();
}
function completeLesson(lessonId) {
  const l = ensureLesson(lessonId);
  if (!l.done) {
    l.done = true;
    progress.xp += 50;
    saveProgress();
    toast("Урок завершён! +50 XP ⭐", "success");
  }
}
function levelFromXp(xp) { return Math.floor(xp / 200) + 1; }

/* =========================================================
   C# Syntax Highlighter (offline, no CDN)
   ========================================================= */
const CS_KEYWORDS = new Set("abstract as async await base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach get goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed set short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile while record init with yield nameof when".split(" "));

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function span(cls, text) { return '<span class="tok-' + cls + '">' + escapeHtml(text) + "</span>"; }

function highlight(code, lang) {
  if (lang && lang !== "csharp") return escapeHtml(code);
  let i = 0, out = "", n = code.length;
  while (i < n) {
    const c = code[i];
    // line comment
    if (c === "/" && code[i + 1] === "/") {
      let j = code.indexOf("\n", i); if (j < 0) j = n;
      out += span("com", code.slice(i, j)); i = j; continue;
    }
    // block comment
    if (c === "/" && code[i + 1] === "*") {
      let j = code.indexOf("*/", i); j = j < 0 ? n : j + 2;
      out += span("com", code.slice(i, j)); i = j; continue;
    }
    // strings (with optional $ and @ prefixes)
    if (c === '"' || ((c === "$" || c === "@") && code[i + 1] === '"') ||
        ((c === "$" && code[i + 1] === "@") && code[i + 2] === '"') ||
        ((c === "@" && code[i + 1] === "$") && code[i + 2] === '"')) {
      let start = i;
      while (i < n && code[i] !== '"') i++; // skip prefix chars to the opening quote
      i++; // opening quote
      while (i < n) {
        if (code[i] === "\\" ) { i += 2; continue; }
        if (code[i] === '"') { i++; break; }
        i++;
      }
      out += span("str", code.slice(start, i)); continue;
    }
    // char literal
    if (c === "'") {
      let start = i; i++;
      while (i < n) { if (code[i] === "\\") { i += 2; continue; } if (code[i] === "'") { i++; break; } i++; }
      out += span("str", code.slice(start, i)); continue;
    }
    // number
    if (/[0-9]/.test(c)) {
      let start = i;
      while (i < n && /[0-9a-fA-FxX._mMdDfFlLuU]/.test(code[i])) i++;
      out += span("num", code.slice(start, i)); continue;
    }
    // identifier / keyword / type
    if (/[A-Za-z_]/.test(c)) {
      let start = i;
      while (i < n && /[A-Za-z0-9_]/.test(code[i])) i++;
      const word = code.slice(start, i);
      if (CS_KEYWORDS.has(word)) out += span("kw", word);
      else {
        // peek next non-space
        let k = i; while (k < n && /\s/.test(code[k])) k++;
        if (code[k] === "(") out += span("fn", word);
        else if (/^[A-Z]/.test(word)) out += span("type", word);
        else out += escapeHtml(word);
      }
      continue;
    }
    // punctuation / other
    out += escapeHtml(c); i++;
  }
  return out;
}

/* Build a code block with copy button */
function codeBlock(code, lang, note) {
  const langLabel = (lang || "csharp").toUpperCase();
  const noteHtml = note ? '<p class="prose" style="margin-bottom:12px;color:var(--text-dim)">' + note + "</p>" : "";
  return (
    noteHtml +
    '<div class="codeblock"><div class="cb-head"><span class="cb-lang">' + langLabel + "</span>" +
    '<button class="copy-btn" data-code="' + encodeURIComponent(code) + '">📋 Копировать</button></div>' +
    "<pre><code>" + highlight(code, lang) + "</code></pre></div>"
  );
}

/* =========================================================
   Toast
   ========================================================= */
function toast(msg, type) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
  const t = document.createElement("div");
  t.className = "toast " + (type || "");
  t.innerHTML = '<span class="t-ic">' + (type === "success" ? "✅" : "ℹ️") + "</span><span>" + msg + "</span>";
  wrap.appendChild(t);
  setTimeout(() => { t.style.transition = "opacity .4s, transform .4s"; t.style.opacity = "0"; t.style.transform = "translateX(60px)"; setTimeout(() => t.remove(), 400); }, 2600);
}

/* =========================================================
   Nav stats
   ========================================================= */
function renderNavStats() {
  const xpEl = document.getElementById("navXp");
  const stEl = document.getElementById("navStreak");
  if (xpEl) xpEl.textContent = progress.xp + " XP";
  if (stEl) stEl.textContent = (progress.streakDays || 1) + "🔥";
}

/* =========================================================
   Router
   ========================================================= */
const app = document.getElementById("app");

function setActiveNav(route) {
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}

function router() {
  const hash = location.hash || "#/";
  const parts = hash.replace(/^#\//, "").split("/").filter(Boolean);
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  if (parts.length === 0) { renderHome(); setActiveNav("home"); }
  else if (parts[0] === "course") { renderCourse(); setActiveNav("course"); }
  else if (parts[0] === "lesson") { renderLesson(parts[1], parts[2]); setActiveNav("course"); }
  else if (parts[0] === "interview") { renderInterview(); setActiveNav("interview"); }
  else if (parts[0] === "certificate") { renderCertificate(); setActiveNav("certificate"); }
  else if (parts[0] === "login") { renderLogin(); setActiveNav(""); }
  else if (parts[0] === "tests") { renderTests(); setActiveNav("tests"); }
  else if (parts[0] === "test") { renderTest(parts[1]); setActiveNav("tests"); }
  else { renderHome(); setActiveNav("home"); }

  bindCommon();
  observeReveal();
  closeMobileNav();
}

/* =========================================================
   VIEW: Home
   ========================================================= */
function renderHome() {
  const heroCode = `public class Developer
{
    public string Name { get; set; } = "Ты";
    public List<string> Skills { get; } = new();

    public async Task LearnAsync()
    {
        await Study("ADO.NET, EF Core, Web API");
        Skills.Add("Backend .NET Developer");
        Console.WriteLine("Готов к работе! 🚀");
    }
}`;

  app.innerHTML = `
  <div class="view">
    <section class="hero container">
      <div class="hero-badge reveal"><span class="pulse-dot"></span> Платформа для изучения C# и .NET</div>
      <h1 class="reveal">Стань <span class="grad">Backend .NET</span><br>разработчиком</h1>
      <p class="sub reveal">Теория, живые примеры и десятки практических задач. От работы с базой данных до JWT и кеширования — всё, что спрашивают на собеседовании.</p>
      <div class="hero-cta reveal">
        <a href="${currentUser() ? "#/course" : "#/login"}" class="btn btn-primary btn-lg">Начать обучение →</a>
        <a href="#/interview" class="btn btn-ghost btn-lg">🎯 Подготовка к интервью</a>
      </div>
      <div class="hero-stats reveal">
        <div class="hstat"><div class="hstat-num">${COURSE.modules.length}</div><div class="hstat-label">модулей</div></div>
        <div class="hstat"><div class="hstat-num">${TOTAL_LESSONS}</div><div class="hstat-label">уроков</div></div>
        <div class="hstat"><div class="hstat-num">${TOTAL_TASKS}+</div><div class="hstat-label">задач</div></div>
        <div class="hstat"><div class="hstat-num">∞</div><div class="hstat-label">практики</div></div>
      </div>
      <div class="hero-code reveal">
        <div class="code-head"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="fname">Developer.cs</span></div>
        <pre><code>${highlight(heroCode, "csharp")}</code></pre>
      </div>
    </section>

    <section class="section container">
      <div class="section-head reveal">
        <div class="eyebrow">Как это работает</div>
        <h2>Учись так, как учатся лучшие</h2>
        <p>Каждый урок построен по проверенной схеме: сначала понимание, потом пример, затем много практики.</p>
      </div>
      <div class="feat-grid">
        ${[
          ["📖", "Теория", "Понятные объяснения на русском, без воды. Только то, что реально используется в работе."],
          ["💻", "Живой пример", "Разбор кода с подсветкой синтаксиса. Видишь, как приём работает на практике."],
          ["🎯", "Задачи 5–10", "Решаешь по одной. Не получилось — подсмотри решение или пропусти и иди дальше."],
          ["🏆", "XP и прогресс", "Опыт за каждую задачу, стрик по дням и сертификат в конце курса."],
          ["🔐", "Реальные темы", "ADO.NET, Dapper, EF Core, Web API, JWT, Identity, кеширование — полный стек бэкенда."],
          ["🧠", "Интервью", "Отдельный раздел с вопросами и флеш-картами для подготовки к собеседованию."],
        ].map((f) => `
          <div class="feat-card reveal">
            <div class="feat-ic">${f[0]}</div>
            <h3>${f[1]}</h3>
            <p>${f[2]}</p>
          </div>`).join("")}
      </div>
    </section>

    <section class="section container">
      <div class="section-head reveal">
        <div class="eyebrow">Программа</div>
        <h2>${COURSE.modules.length} модулей — весь путь бэкендера</h2>
      </div>
      <div class="feat-grid">
        ${COURSE.modules.map((m) => `
          <a href="#/course" class="feat-card reveal">
            <div class="feat-ic">${m.icon}</div>
            <h3>${m.title}</h3>
            <p>${m.desc}</p>
          </a>`).join("")}
      </div>
      <div style="text-align:center;margin-top:40px" class="reveal">
        <a href="#/course" class="btn btn-primary btn-lg">Открыть курс →</a>
      </div>
    </section>
  </div>`;
}

/* =========================================================
   VIEW: Course (modules + lessons)
   ========================================================= */
function renderCourse() {
  const done = doneCount();
  const pct = Math.round((done / TOTAL_LESSONS) * 100);
  const circ = 2 * Math.PI * 30;

  app.innerHTML = `
  <div class="view container">
    <div class="page-head">
      <div class="crumb"><a href="#/">Главная</a> <span>›</span> <span>Курс</span></div>
      <h1>${COURSE.title}</h1>
      <p class="lead">Все уроки открыты — проходи в своём темпе и в любом порядке. Прогресс и XP сохраняются.</p>

      <div class="progress-overview reveal">
        <div class="progress-ring">
          <svg width="72" height="72">
            <circle cx="36" cy="36" r="30" stroke="var(--surface-3)" stroke-width="7" fill="none"></circle>
            <circle cx="36" cy="36" r="30" stroke="url(#grad)" stroke-width="7" fill="none"
              stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ - (circ * pct) / 100}"></circle>
            <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#6366f1"/>
            </linearGradient></defs>
          </svg>
          <div class="pct">${pct}%</div>
        </div>
        <div class="progress-meta">
          <h4>Твой прогресс</h4>
          <p>${done} из ${TOTAL_LESSONS} уроков пройдено · ${progress.xp} XP · уровень ${levelFromXp(progress.xp)}</p>
        </div>
        <a href="#/certificate" class="btn ${done === TOTAL_LESSONS ? "btn-success" : "btn-soft"}">
          ${done === TOTAL_LESSONS ? "🏆 Получить сертификат" : "🔒 Сертификат"}
        </a>
      </div>
    </div>

    <div class="modules">
      ${COURSE.modules.map((m, mi) => {
        const mp = moduleProgress(m);
        return `
        <div class="module reveal ${mi === 0 ? "open" : ""}" data-module="${m.id}">
          <div class="module-head" data-toggle>
            <div class="module-ic">${m.icon}</div>
            <div class="module-info">
              <h3>${m.title}</h3>
              <div class="mbar">
                <div class="bar"><span style="width:${mp.pct}%"></span></div>
                <small>${mp.done}/${mp.total}</small>
              </div>
            </div>
            <span class="module-badge ${mp.done === mp.total ? "done" : ""}">${mp.done === mp.total ? "Готово ✓" : mp.pct + "%"}</span>
            <span class="module-chev">⌄</span>
          </div>
          <div class="lessons">
            ${m.lessons.map((l) => {
              const unlocked = isUnlocked(l.id);
              const isDone = lessonDone(l.id);
              const state = isDone ? "done" : (unlocked && globalIndex(l.id) === done ? "current" : "");
              const num = globalIndex(l.id) + 1;
              return `
              <div class="lesson-row ${unlocked ? "" : "locked"}" ${unlocked ? `data-go="#/lesson/${m.id}/${l.id}"` : ""}>
                <div class="lesson-state ${state}">${isDone ? "✓" : unlocked ? num : "🔒"}</div>
                <div class="l-title">${l.title}</div>
                <div class="l-meta">⏱ ${l.duration} · ${l.tasks.length} задач</div>
              </div>`;
            }).join("")}
            ${(() => {
              const tq = (typeof TESTS !== "undefined" && TESTS[m.id]) ? TESTS[m.id] : null;
              if (!tq) return "";
              const rec = (progress.tests && progress.tests[m.id]) || {};
              return `
              <div class="lesson-row" data-go="#/test/${m.id}">
                <div class="lesson-state ${rec.passed ? "done" : ""}">${rec.passed ? "✓" : "📝"}</div>
                <div class="l-title">Тест модуля</div>
                <div class="l-meta">📝 ${tq.length} вопросов${rec.best ? " · лучший " + rec.best + "%" : ""}</div>
              </div>`;
            })()}
          </div>
        </div>`;
      }).join("")}
    </div>
  </div>`;

  // animate bars
  setTimeout(() => document.querySelectorAll(".bar > span").forEach((s) => { const w = s.style.width; s.style.width = "0"; requestAnimationFrame(() => (s.style.width = w)); }), 50);
}

/* =========================================================
   VIEW: Lesson (theory -> example -> tasks)
   ========================================================= */
let runtime = { lessonId: null, taskIndex: 0 };

function renderLesson(moduleId, lessonId) {
  const f = FLAT.find((x) => x.lesson.id === lessonId);
  if (!f) { location.hash = "#/course"; return; }
  if (!isUnlocked(lessonId)) { toast("Этот урок ещё закрыт 🔒", ""); location.hash = "#/course"; return; }

  const { mod, lesson } = f;
  ensureLesson(lessonId);
  runtime = { lessonId, taskIndex: findFirstUnfinishedTask(lessonId) };

  app.innerHTML = `
  <div class="view container">
    <div class="lesson-layout">
      <aside class="lesson-side">
        <h4>${mod.icon} ${mod.title}</h4>
        <div class="side-step active" data-scroll="blockTheory"><span class="num">1</span> Теория</div>
        <div class="side-step" data-scroll="blockExample"><span class="num">2</span> Пример</div>
        <div class="side-step" data-scroll="blockTasks"><span class="num">3</span> Задачи</div>
        <div style="margin-top:20px"><a href="#/course" class="btn btn-ghost btn-sm" style="width:100%">← К списку уроков</a></div>
      </aside>

      <div class="lesson-main">
        <div class="crumb" style="color:var(--text-faint);font-size:.9rem;margin-bottom:10px"><a href="#/course">Курс</a> › ${mod.title}</div>
        <h1 class="lesson-title">${lesson.title}</h1>
        <div class="lesson-sub">
          <span>⏱ ${lesson.duration}</span>
          <span>🎯 ${lesson.tasks.length} задач</span>
          <span>⭐ до ${lesson.tasks.length * 20 + 50} XP</span>
        </div>

        <div class="lesson-block" id="blockTheory">
          <span class="block-tag theory">📖 Теория</span>
          <div class="prose">${lesson.theory}</div>
        </div>

        <div class="lesson-block" id="blockExample">
          <span class="block-tag example">💻 Пример</span>
          ${codeBlock(lesson.example.code, lesson.example.lang, lesson.example.note)}
        </div>

        <div class="lesson-block" id="blockTasks">
          <span class="block-tag task">🎯 Задачи</span>
          <div id="taskRunner"></div>
        </div>
      </div>
    </div>
  </div>`;

  renderTask();
}

function findFirstUnfinishedTask(lessonId) {
  const l = ensureLesson(lessonId);
  const tasks = FLAT.find((x) => x.lesson.id === lessonId).lesson.tasks;
  for (let i = 0; i < tasks.length; i++) if (!l.tasks[i]) return i;
  return tasks.length; // all handled
}

function renderTask() {
  const f = FLAT.find((x) => x.lesson.id === runtime.lessonId);
  const lesson = f.lesson;
  const tasks = lesson.tasks;
  const l = ensureLesson(runtime.lessonId);
  const cont = document.getElementById("taskRunner");
  if (!cont) return;

  // progress pips
  const pips = tasks.map((t, i) => {
    let cls = "";
    if (i === runtime.taskIndex) cls = "current";
    else if (l.tasks[i] === "solved") cls = "done";
    else if (l.tasks[i] === "skip") cls = "skip";
    return `<div class="task-pip ${cls}"></div>`;
  }).join("");

  // lesson complete?
  if (runtime.taskIndex >= tasks.length) {
    completeLesson(runtime.lessonId);
    const idx = globalIndex(runtime.lessonId);
    const next = FLAT[idx + 1];
    const solved = Object.values(l.tasks).filter((s) => s === "solved").length;
    cont.innerHTML = `
      <div class="lesson-complete">
        <div class="trophy">🎉</div>
        <h2>Урок завершён!</h2>
        <div class="xp-earned">Решено задач: ${solved}/${tasks.length} · +${solved * 20 + 50} XP</div>
        <div class="lesson-footer-nav" style="justify-content:center">
          ${next
            ? `<a href="#/lesson/${next.mod.id}/${next.lesson.id}" class="btn btn-primary btn-lg">Следующий урок: ${next.lesson.title} →</a>`
            : `<a href="#/certificate" class="btn btn-success btn-lg">🏆 Пройти к сертификату</a>`}
          <a href="#/course" class="btn btn-ghost btn-lg">К списку уроков</a>
        </div>
      </div>`;
    return;
  }

  const i = runtime.taskIndex;
  const task = tasks[i];
  const diffLabel = { easy: "Легко", medium: "Средне", hard: "Сложно" }[task.d] || "Задача";

  cont.innerHTML = `
    <div class="task-progress">
      ${pips}
      <span class="task-counter">Задача ${i + 1} / ${tasks.length}</span>
    </div>
    <div class="task-card">
      <span class="task-diff ${task.d}">${diffLabel}</span>
      <h3>${task.t}</h3>
      <p class="task-desc">${task.desc}</p>
      <div class="task-io">
        <div class="io-box"><div class="io-label">Вход</div><pre>${escapeHtml(task.input || "—")}</pre></div>
        <div class="io-box"><div class="io-label">Ожидается</div><pre>${escapeHtml(task.output || "—")}</pre></div>
      </div>

      <div class="code-editor-wrap">
        <div class="code-editor-head"><span>Твоё решение · solution.cs</span><span>C#</span></div>
        <textarea class="code-editor" id="editor" spellcheck="false" placeholder="// Пиши свой код здесь...">${escapeHtml(savedEditor(i) || "")}</textarea>
      </div>

      <div class="task-actions">
        <button class="btn btn-soft btn-sm" id="btnHint">💡 Подсказка</button>
        <button class="btn btn-ghost btn-sm" id="btnSolution">👁 Показать решение</button>
        <span class="spacer"></span>
        <button class="btn btn-ghost btn-sm" id="btnSkip">Пропустить →</button>
      </div>

      <div id="hintHolder"></div>
      <div id="solutionHolder"></div>
    </div>`;

  // bind task buttons
  const editor = document.getElementById("editor");
  editor.addEventListener("input", () => saveEditor(i, editor.value));
  // tab support in editor
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.slice(0, s) + "    " + editor.value.slice(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; }
  });

  document.getElementById("btnHint").onclick = () => {
    document.getElementById("hintHolder").innerHTML =
      '<div class="hint-box"><strong>Подсказка:</strong> ' + task.hint + "</div>";
  };
  document.getElementById("btnSkip").onclick = () => {
    markTask(runtime.lessonId, i, l.tasks[i] === "solved" ? "solved" : "skip");
    runtime.taskIndex++; renderTask(); scrollToTasks();
  };
  document.getElementById("btnSolution").onclick = () => {
    document.getElementById("solutionHolder").innerHTML = `
      <div class="solution-box">
        ${codeBlock(task.solution, "csharp", null)}
        <div class="self-check">
          <span>Отметь честно:</span>
          <button class="btn btn-success btn-sm" id="btnSolved">✅ Решил сам</button>
          <button class="btn btn-ghost btn-sm" id="btnFailed">Не смог, дальше →</button>
        </div>
      </div>`;
    bindCopy();
    document.getElementById("btnSolved").onclick = () => { markTask(runtime.lessonId, i, "solved"); runtime.taskIndex++; renderTask(); scrollToTasks(); };
    document.getElementById("btnFailed").onclick = () => { markTask(runtime.lessonId, i, "skip"); runtime.taskIndex++; renderTask(); scrollToTasks(); };
  };

  bindCopy();
}

function scrollToTasks() {
  const el = document.getElementById("blockTasks");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* transient editor memory (session only) */
const editorMem = {};
function saveEditor(i, v) { editorMem[runtime.lessonId + "_" + i] = v; }
function savedEditor(i) { return editorMem[runtime.lessonId + "_" + i]; }

/* =========================================================
   VIEW: Interview
   ========================================================= */
let ivTab = INTERVIEW.categories[0].id;
function renderInterview() {
  const cat = INTERVIEW.categories.find((c) => c.id === ivTab) || INTERVIEW.categories[0];
  app.innerHTML = `
  <div class="view container">
    <div class="page-head">
      <div class="crumb"><a href="#/">Главная</a> <span>›</span> <span>Подготовка к интервью</span></div>
      <h1>🎯 Подготовка к интервью</h1>
      <p class="lead">Самые частые вопросы на собеседовании .NET-разработчика. Нажми на карточку, чтобы увидеть ответ.</p>
    </div>

    <div class="iv-tabs">
      ${INTERVIEW.categories.map((c) => `<button class="iv-tab ${c.id === ivTab ? "active" : ""}" data-iv="${c.id}">${c.title} <span style="opacity:.6">${c.questions.length}</span></button>`).join("")}
    </div>

    <div class="flashcards">
      ${cat.questions.map((q, i) => `
        <div class="flashcard reveal" data-flip style="animation-delay:${i * 40}ms">
          <div class="flashcard-inner">
            <div class="fc-face fc-front">
              <div class="fc-q-label">Вопрос</div>
              <div class="fc-q">${q.q}</div>
              <div class="fc-hint">👆 нажми, чтобы увидеть ответ${q.hint ? " · " + q.hint : ""}</div>
            </div>
            <div class="fc-face fc-back">
              <div class="fc-a-label">Ответ</div>
              <div class="fc-a">${q.a}</div>
            </div>
          </div>
        </div>`).join("")}
    </div>

    <div class="section-head reveal" style="margin-top:56px;margin-bottom:24px">
      <div class="eyebrow">Советы</div>
      <h2 style="font-size:1.8rem">Как вести себя на собеседовании</h2>
    </div>
    <div class="feat-grid">
      ${INTERVIEW.tips.map((t) => `<div class="feat-card reveal"><div class="feat-ic">💬</div><p style="color:var(--text)">${t}</p></div>`).join("")}
    </div>
  </div>`;

  document.querySelectorAll("[data-iv]").forEach((b) => b.onclick = () => { ivTab = b.dataset.iv; renderInterview(); observeReveal(); });
  document.querySelectorAll("[data-flip]").forEach((c) => c.onclick = () => c.classList.toggle("flipped"));
}

/* =========================================================
   VIEW: Certificate
   ========================================================= */
function renderCertificate() {
  const user = currentUser();
  if (!user) {
    app.innerHTML = `
    <div class="view container">
      <div class="page-head"><h1>🏆 Сертификат</h1></div>
      <div class="lesson-block reveal" style="text-align:center;padding:50px">
        <div style="font-size:3.5rem;margin-bottom:16px">🔐</div>
        <h2 style="margin-bottom:10px">Войди, чтобы получить именной сертификат</h2>
        <p class="prose" style="color:var(--text-dim);max-width:440px;margin:0 auto 22px">Сертификат оформляется на твоё имя — для этого нужен аккаунт.</p>
        <a href="#/login" class="btn btn-primary btn-lg">Войти / Зарегистрироваться</a>
      </div>
    </div>`;
    return;
  }
  if (!progress.name) { progress.name = user.name; saveProgress(); }
  const done = doneCount();
  const complete = done === TOTAL_LESSONS;
  const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  if (!complete) {
    app.innerHTML = `
    <div class="view container">
      <div class="page-head"><h1>🏆 Сертификат</h1></div>
      <div class="lesson-block reveal" style="text-align:center;padding:50px">
        <div style="font-size:3.5rem;margin-bottom:16px">🔒</div>
        <h2 style="margin-bottom:10px">Ещё немного!</h2>
        <p class="prose" style="color:var(--text-dim);max-width:460px;margin:0 auto 22px">Сертификат откроется, когда пройдёшь все уроки. Сейчас пройдено <strong style="color:var(--accent-2)">${done} из ${TOTAL_LESSONS}</strong>.</p>
        <div class="bar" style="max-width:380px;margin:0 auto 26px"><span style="width:${Math.round((done/TOTAL_LESSONS)*100)}%"></span></div>
        <a href="#/course" class="btn btn-primary">Продолжить обучение →</a>
      </div>
    </div>`;
    setTimeout(() => document.querySelectorAll(".bar > span").forEach((s) => { const w = s.style.width; s.style.width = "0"; requestAnimationFrame(() => (s.style.width = w)); }), 50);
    return;
  }

  app.innerHTML = `
  <div class="view container">
    <div class="page-head" style="text-align:center"><h1>🏆 Поздравляем!</h1><p class="lead" style="margin:10px auto 0">Ты прошёл весь курс. Впиши имя и сохрани свой сертификат.</p></div>
    <div class="cert-wrap">
      <div style="display:flex;gap:12px;justify-content:center;margin-bottom:24px;flex-wrap:wrap">
        <input id="certName" placeholder="Твоё имя и фамилия" value="${progress.name || ""}"
          style="padding:13px 18px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border-strong);color:var(--text);font-size:1rem;font-family:var(--sans);min-width:260px;outline:none">
        <button class="btn btn-primary" id="applyName">Применить</button>
        <button class="btn btn-ghost" id="printCert">🖨 Печать / PDF</button>
      </div>

      <div class="certificate" id="cert">
        <div class="cert-seal">♯</div>
        <div class="cert-eyebrow">SharpAcademy · Сертификат</div>
        <div class="cert-title">Backend .NET Developer</div>
        <p style="color:var(--text-dim)">настоящим подтверждается, что</p>
        <div class="cert-name" id="certNameOut">${progress.name || "Твоё имя"}</div>
        <p style="color:var(--text-dim);max-width:440px;margin:0 auto">успешно прошёл(ла) курс по разработке на C# и ASP.NET Core: ADO.NET, Dapper, EF Core, Web API, безопасность и производительность.</p>
        <div class="cert-meta">
          <div>📅 ${today}</div>
          <div>⭐ ${progress.xp} XP · уровень ${levelFromXp(progress.xp)}</div>
          <div>📚 ${TOTAL_LESSONS} уроков</div>
        </div>
      </div>
    </div>
  </div>`;

  document.getElementById("applyName").onclick = () => {
    const v = document.getElementById("certName").value.trim();
    progress.name = v; saveProgress();
    document.getElementById("certNameOut").textContent = v || "Твоё имя";
    toast("Имя сохранено ✅", "success");
  };
  document.getElementById("printCert").onclick = () => window.print();
}

/* =========================================================
   Common bindings
   ========================================================= */
function bindCommon() {
  // module accordion
  document.querySelectorAll("[data-toggle]").forEach((h) => {
    h.onclick = () => h.closest(".module").classList.toggle("open");
  });
  // lesson row navigation
  document.querySelectorAll("[data-go]").forEach((r) => {
    r.onclick = () => (location.hash = r.dataset.go);
  });
  // side-step scroll
  document.querySelectorAll("[data-scroll]").forEach((s) => {
    s.onclick = () => {
      const el = document.getElementById(s.dataset.scroll);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelectorAll(".side-step").forEach((x) => x.classList.remove("active"));
      s.classList.add("active");
    };
  });
  bindCopy();
}

function bindCopy() {
  document.querySelectorAll(".copy-btn").forEach((b) => {
    if (b.dataset.bound) return; b.dataset.bound = "1";
    b.onclick = () => {
      const code = decodeURIComponent(b.dataset.code);
      navigator.clipboard && navigator.clipboard.writeText(code).then(() => {
        b.classList.add("copied"); b.textContent = "✓ Скопировано";
        setTimeout(() => { b.classList.remove("copied"); b.textContent = "📋 Копировать"; }, 1600);
      });
    };
  });
}

/* Reveal on scroll */
let io;
function observeReveal() {
  if (io) io.disconnect();
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

/* Mobile nav */
function toggleMobileNav() { document.querySelector(".nav-links").classList.toggle("open"); }
function closeMobileNav() { const n = document.querySelector(".nav-links"); if (n) n.classList.remove("open"); }

/* =========================================================
   Init
   ========================================================= */
window.addEventListener("hashchange", router);
document.addEventListener("DOMContentLoaded", () => {
  renderNavStats();
  renderNavUser();
  updateThemeBtn();
  const burger = document.getElementById("burger");
  if (burger) burger.onclick = toggleMobileNav;
  const tt = document.getElementById("themeToggle");
  if (tt) tt.onclick = toggleTheme;
  router();
});

/* =========================================================
   v2 — Theme, Auth, Tests
   ========================================================= */

/* ---------- Theme ---------- */
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", cur);
  try { localStorage.setItem("sharpacademy_theme", cur); } catch (e) {}
  updateThemeBtn();
}
function updateThemeBtn() {
  const b = document.getElementById("themeToggle");
  if (b) b.textContent = document.documentElement.getAttribute("data-theme") === "light" ? "🌙" : "☀️";
}

/* ---------- Auth (локально, демо-режим) ---------- */
const USERS_KEY = "sharpacademy_users";
const AUTH_KEY = "sharpacademy_auth";
function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch (e) { return {}; } }
function saveUsers(u) { try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch (e) {} }
function currentUser() { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch (e) { return null; } }
function setAuth(u) { try { if (u) localStorage.setItem(AUTH_KEY, JSON.stringify(u)); else localStorage.removeItem(AUTH_KEY); } catch (e) {} }
function hashPass(p) { let h = 0; for (let i = 0; i < p.length; i++) { h = (h * 31 + p.charCodeAt(i)) | 0; } return "h" + (h >>> 0).toString(16); }
function register(name, email, pass) {
  const users = getUsers(); email = (email || "").toLowerCase().trim();
  if (!email) return { ok: false, msg: "Введи email" };
  if (users[email]) return { ok: false, msg: "Пользователь с таким email уже существует" };
  users[email] = { name: name.trim(), pass: hashPass(pass) }; saveUsers(users);
  setAuth({ name: name.trim(), email }); return { ok: true };
}
function login(email, pass) {
  const users = getUsers(); email = (email || "").toLowerCase().trim();
  const u = users[email];
  if (!u || u.pass !== hashPass(pass)) return { ok: false, msg: "Неверный email или пароль" };
  setAuth({ name: u.name, email }); return { ok: true };
}
function logout() { setAuth(null); renderNavUser(); toast("Ты вышел из аккаунта", ""); location.hash = "#/"; }

function renderNavUser() {
  const slot = document.getElementById("authSlot");
  if (!slot) return;
  const u = currentUser();
  if (u) {
    const initial = (u.name || u.email || "U").trim().charAt(0).toUpperCase();
    slot.innerHTML = `
      <div class="user-menu" id="userMenu">
        <button class="user-btn" id="userBtn"><span class="avatar">${initial}</span><span class="uname">${u.name || u.email}</span><span style="opacity:.55">⌄</span></button>
        <div class="user-drop">
          <a href="#/course" class="user-drop-item">📚 Мой прогресс</a>
          <a href="#/certificate" class="user-drop-item">🏆 Мой сертификат</a>
          <button class="user-drop-item" id="logoutBtn">🚪 Выйти</button>
        </div>
      </div>`;
    document.getElementById("userBtn").onclick = (e) => { e.stopPropagation(); document.getElementById("userMenu").classList.toggle("open"); };
    document.getElementById("logoutBtn").onclick = logout;
  } else {
    slot.innerHTML = `<a href="#/login" class="btn btn-primary btn-sm">Войти</a>`;
  }
}
document.addEventListener("click", () => { const m = document.getElementById("userMenu"); if (m) m.classList.remove("open"); });

/* ---------- Login / Register view ---------- */
let authTab = "login";
function renderLogin() {
  if (currentUser()) { location.hash = "#/course"; return; }
  const isLogin = authTab === "login";
  app.innerHTML = `
  <div class="view">
    <div class="auth-wrap">
      <div class="auth-side">
        <div class="brand"><span class="brand-logo">♯</span><span>Sharp<span class="hl" style="color:#bfdbfe">Academy</span></span></div>
        <h2>Твой путь в<br>Backend .NET разработку</h2>
        <p>Войди, чтобы сохранять прогресс, зарабатывать XP и получить именной сертификат.</p>
        <ul class="auth-benefits">
          <li><span class="ab-ic">📚</span> ${TOTAL_LESSONS} уроков и ${COURSE.modules.length} тестов</li>
          <li><span class="ab-ic">🎯</span> Подготовка к интервью</li>
          <li><span class="ab-ic">🏆</span> Сертификат по завершении</li>
        </ul>
      </div>
      <div class="auth-panel">
        <div class="auth-card">
          <h1>${isLogin ? "С возвращением! 👋" : "Создать аккаунт 🚀"}</h1>
          <p class="sub">${isLogin ? "Войди в свой аккаунт, чтобы продолжить" : "Это займёт меньше минуты"}</p>
          <div class="auth-tabs">
            <button class="auth-tab ${isLogin ? "active" : ""}" data-authtab="login">Вход</button>
            <button class="auth-tab ${!isLogin ? "active" : ""}" data-authtab="register">Регистрация</button>
          </div>
          <div id="authErr"></div>
          <form id="authForm">
            ${isLogin ? "" : `<div class="field"><label>Имя и фамилия</label><input id="fName" placeholder="Напиши своё имя" autocomplete="name"></div>`}
            <div class="field"><label>Email</label><input id="fEmail" type="email" placeholder="you@mail.com" autocomplete="email"></div>
            <div class="field"><label>Пароль</label><input id="fPass" type="password" placeholder="Минимум 4 символа" autocomplete="${isLogin ? "current-password" : "new-password"}"></div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%">${isLogin ? "Войти" : "Зарегистрироваться"}</button>
          </form>
          <p class="auth-note">${isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"} <a href="#" data-authtab="${isLogin ? "register" : "login"}">${isLogin ? "Зарегистрируйся" : "Войди"}</a></p>
          <p class="auth-note" style="opacity:.7">🔒 Данные хранятся только в твоём браузере (демо-режим).</p>
        </div>
      </div>
    </div>
  </div>`;

  document.querySelectorAll("[data-authtab]").forEach((b) =>
    b.addEventListener("click", (e) => { e.preventDefault(); authTab = b.dataset.authtab; renderLogin(); })
  );
  const form = document.getElementById("authForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("fEmail").value;
    const pass = document.getElementById("fPass").value;
    let res;
    if (isLogin) res = login(email, pass);
    else {
      const name = document.getElementById("fName").value;
      if (!name.trim()) return showAuthErr("Введи имя");
      if (!email.trim()) return showAuthErr("Введи email");
      if ((pass || "").length < 4) return showAuthErr("Пароль минимум 4 символа");
      res = register(name, email, pass);
    }
    if (!res.ok) return showAuthErr(res.msg);
    progress.name = currentUser().name; saveProgress();
    renderNavUser();
    toast(isLogin ? "С возвращением! 👋" : "Аккаунт создан! 🎉", "success");
    location.hash = "#/course";
  });
}
function showAuthErr(msg) { const e = document.getElementById("authErr"); if (e) e.innerHTML = '<div class="auth-err">⚠️ ' + msg + "</div>"; }

/* ---------- Tests list ---------- */
function renderTests() {
  app.innerHTML = `
  <div class="view container">
    <div class="page-head">
      <div class="crumb"><a href="#/">Главная</a> <span>›</span> <span>Тесты</span></div>
      <h1>📝 Тесты по модулям</h1>
      <p class="lead">Проверь знания после каждого модуля. Порог сдачи — 70%. За сданный тест +60 XP.</p>
    </div>
    <div class="test-grid">
      ${COURSE.modules.map((m) => {
        const tq = TESTS[m.id] || [];
        const rec = (progress.tests && progress.tests[m.id]) || {};
        return `
        <div class="test-card reveal" data-go="#/test/${m.id}">
          <div class="tc-top">
            <div class="tc-ic">${m.icon}</div>
            <span class="test-badge ${rec.passed ? "passed" : ""}">${rec.passed ? "Сдан ✓" : (rec.best ? rec.best + "%" : "Новый")}</span>
          </div>
          <h3>${m.title}</h3>
          <p>${tq.length} вопросов${rec.best ? " · лучший результат " + rec.best + "%" : ""}</p>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

/* ---------- Test runner ---------- */
let quizAnswers = {};
function renderTest(moduleId) {
  const mod = COURSE.modules.find((m) => m.id === moduleId);
  const qs = TESTS[moduleId];
  if (!mod || !qs) { location.hash = "#/tests"; return; }
  quizAnswers = {};
  const letters = ["А", "Б", "В", "Г", "Д"];
  app.innerHTML = `
  <div class="view container">
    <div class="page-head">
      <div class="crumb"><a href="#/tests">Тесты</a> <span>›</span> <span>${mod.title}</span></div>
      <h1>${mod.icon} Тест: ${mod.title}</h1>
      <p class="lead">${qs.length} вопросов · порог 70%. Выбери ответ и нажми «Проверить».</p>
    </div>
    <div id="quizResult"></div>
    <div id="quizBody">
      ${qs.map((q, qi) => `
        <div class="quiz-q reveal">
          <div class="qnum">Вопрос ${qi + 1} из ${qs.length}</div>
          <h3>${q.q}</h3>
          <div data-qi="${qi}">
            ${q.options.map((o, oi) => `
              <div class="q-option" data-q="${qi}" data-opt="${oi}">
                <span class="q-letter">${letters[oi]}</span><span>${o}</span>
              </div>`).join("")}
          </div>
          <div id="exp-${qi}"></div>
        </div>`).join("")}
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
      <button class="btn btn-primary btn-lg" id="submitQuiz">Проверить ответы</button>
      <a href="#/tests" class="btn btn-ghost btn-lg">← Ко всем тестам</a>
    </div>
  </div>`;

  document.querySelectorAll(".q-option").forEach((el) => {
    el.addEventListener("click", () => {
      const qi = el.dataset.q;
      document.querySelectorAll('.q-option[data-q="' + qi + '"]').forEach((x) => x.classList.remove("selected"));
      el.classList.add("selected");
      quizAnswers[qi] = +el.dataset.opt;
    });
  });
  document.getElementById("submitQuiz").onclick = () => gradeQuiz(moduleId, qs);
}

function gradeQuiz(moduleId, qs) {
  let correct = 0;
  qs.forEach((q, qi) => {
    const sel = quizAnswers[qi];
    document.querySelectorAll('.q-option[data-q="' + qi + '"]').forEach((el) => {
      const oi = +el.dataset.opt;
      el.classList.remove("selected");
      el.style.pointerEvents = "none";
      if (oi === q.correct) el.classList.add("correct");
      else if (oi === sel) el.classList.add("incorrect");
    });
    if (q.explain) {
      const h = document.getElementById("exp-" + qi);
      if (h) h.innerHTML = '<div class="q-explain"><strong>Пояснение:</strong> ' + q.explain + "</div>";
    }
    if (sel === q.correct) correct++;
  });
  const score = Math.round((correct / qs.length) * 100);
  const passed = score >= 70;

  progress.tests = progress.tests || {};
  const rec = progress.tests[moduleId] || { passed: false, best: 0 };
  if (passed && !rec.passed) { progress.xp += 60; toast("Тест сдан! +60 XP ⭐", "success"); }
  rec.passed = rec.passed || passed;
  rec.best = Math.max(rec.best, score);
  progress.tests[moduleId] = rec;
  saveProgress();

  const res = document.getElementById("quizResult");
  res.innerHTML = `
    <div class="quiz-result">
      <div class="qr-emoji">${passed ? "🎉" : "💪"}</div>
      <div class="quiz-score">${score}%</div>
      <h2 style="margin:8px 0">${passed ? "Тест сдан!" : "Почти получилось!"}</h2>
      <p class="prose" style="color:var(--text-dim)">Правильных ответов: ${correct} из ${qs.length}${passed ? " · +60 XP" : " · нужно 70% для сдачи"}</p>
      <div style="margin-top:18px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        ${!passed ? `<button class="btn btn-primary" onclick="renderTest('${moduleId}')">Попробовать снова</button>` : ""}
        <a href="#/tests" class="btn btn-ghost">Ко всем тестам</a>
        <a href="#/course" class="btn btn-soft">К урокам</a>
      </div>
    </div>`;
  res.scrollIntoView({ behavior: "smooth", block: "start" });
}
