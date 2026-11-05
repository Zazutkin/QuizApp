// =======================================================================
//  💻 МОДУЛЬ ПРАКТИЧЕСКОГО КОД-ТЕСТИРОВАНИЯ ПО ПРОЙДЕННЫМ ТЕМАМ PYTHON
//  - Чистые шаблоны (строго без готовых решений в редакторе!)
//  - Генератор всегда разных заданий на одну и ту же тему (пул + Qwen 3.5)
//  - Честная защита от накрутки XP (опыт дается только 1 раз за задачу)
//  - Поддержка Tab (4 пробела) и Ctrl+Enter в редакторе
// =======================================================================

(function() {
  'use strict';

  // Состояние активного теста
  let activeTopicIndex = 0;       // Индекс темы (0..27)
  let activeDifficulty = 1;       // 1: Разминка, 2: Боевая, 3: Хардкор
  let currentVariantIndex = 0;    // Номер вариации внутри темы
  let currentChallenge = null;    // Текущий объект задания
  let testOutputBuffer = '';      // Буфер вывода Skulpt
  let solvedChallengesRegistry = {}; // Реестр уже решенных задач (чтобы не спамить XP)

  // ---------------------------------------------------------------------
  //  БАНК МУЛЬТИ-ВАРИАТИВНЫХ ЗАДАНИЙ (ЧИСТЫЕ ШАБЛОНЫ, БЕЗ СПОЙЛЕРОВ!)
  // ---------------------------------------------------------------------
  const CODE_TEST_VARIANTS = {
    // Урок 1: print(), sep, end
    0: {
      1: [
        {
          id: 'top0_diff1_v1',
          title: "Разминка (Вариант 1): Визитка с параметром end",
          desc: "Выведи фразу «Привет, меня зовут » первой командой print(), а второй командой print() напечатай своё имя на ТОЙ ЖЕ строке, используя параметр end=''.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок 1 · Разминка 1)\n# ==========================================================\n\n# TODO: Напиши первую команду print() с текстом \"Привет, меня зовут \" и параметром end=\"\"\n# TODO: Напиши вторую команду print() со своим именем\n\n",
          expectedRegex: [/print/i, /end\s*=/i],
          testVerify: (out, code) => {
            const clean = out.trim();
            return clean.includes("Привет, меня зовут") && clean.split('\n').length === 1 && /end\s*=/i.test(code);
          },
          hint: "В первом вызове добавь параметр end=\"\", чтобы убрать перевод строки.",
          xp: 30
        },
        {
          id: 'top0_diff1_v2',
          title: "Разминка (Вариант 2): Обратный отсчёт запуска",
          desc: "Напиши три отдельные команды print(): первая печатает '3...', вторая '2...', третья '1... Пуск!'. Все фразы должны напечататься на ОДНОЙ строке через пробел с помощью end=' '.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок 1 · Разминка 2)\n# ==========================================================\n\n# TODO: Напиши 3 команды print() для обратного отсчета на одной строке:\n\n",
          expectedRegex: [/print/i, /end\s*=/i],
          testVerify: (out, code) => out.includes("3") && out.includes("2") && out.includes("1") && out.trim().split('\n').length === 1,
          hint: "Каждому print() передай end=' ', чтобы следующее число не падало на новую строку.",
          xp: 30
        },
        {
          id: 'top0_diff1_v3',
          title: "Разминка (Вариант 3): Статус сервера в одну строку",
          desc: "Выведи статус сервера двумя командами print(): сначала «Сервер Базы Данных: », затем «ОНЛАЙН» на той же строке с помощью end=''.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок 1 · Разминка 3)\n# ==========================================================\n\n# TODO: Напечатай 'Сервер Базы Данных: ' с end=\"\" и вторым print() напечатай 'ОНЛАЙН'\n\n",
          expectedRegex: [/print/i, /end\s*=/i],
          testVerify: (out, code) => out.includes("Сервер") && out.includes("ОНЛАЙН") && out.trim().split('\n').length === 1,
          hint: "print(\"Сервер Базы Данных: \", end=\"\") объединит обе строки.",
          xp: 30
        }
      ],
      2: [
        {
          id: 'top0_diff2_v1',
          title: "Боевая задача (Вариант 1): Чек магазина через sep",
          desc: "Напечатай строку чека за 1 вызов print(). Аргументы: «Товар: Ноутбук», «Кол-во: 1», «Цена: 75000 руб». Между аргументами должен стоять разделитель sep=' | '.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок 1 · Боевая задача 1)\n# ==========================================================\n\n# TODO: Напиши одну команду print() с 3 аргументами и разделителем sep=\" | \"\n\n",
          expectedRegex: [/print/i, /sep\s*=/i],
          testVerify: (out, code) => (out.includes("Ноутбук") && out.includes("75000") && out.includes(" | ")) || (out.includes(" | ") && /sep\s*=/i.test(code)),
          hint: "print(\"Товар: Ноутбук\", \"Кол-во: 1\", \"Цена: 75000 руб\", sep=\" | \")",
          xp: 60
        },
        {
          id: 'top0_diff2_v2',
          title: "Боевая задача (Вариант 2): Генератор пути к файлу через sep",
          desc: "Выведи путь к файлу одной командой print(). Передай элементы пути: 'C:', 'Users', 'Damir', 'Python', 'main.py' с разделителем sep='/'.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок 1 · Боевая задача 2)\n# ==========================================================\n\n# TODO: Напиши команду print с частями пути и разделителем sep=\"/\"\n\n",
          expectedRegex: [/print/i, /sep\s*=/i],
          testVerify: (out, code) => (out.includes("C:/Users") || (out.includes("C:") && out.includes("/"))) && /sep\s*=/i.test(code),
          hint: "print('C:', 'Users', 'Damir', 'Python', 'main.py', sep='/')",
          xp: 60
        },
        {
          id: 'top0_diff2_v3',
          title: "Боевая задача (Вариант 3): Табло счета матча",
          desc: "Напечатай счет матча одной командой print(): «Реал Мадрид», 3, 1, «Барселона». Разделитель между всеми элементами должен быть sep=' : '.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок 1 · Боевая задача 3)\n# ==========================================================\n\n# TODO: Выведи счет матча одной командой print(..., sep=\" : \")\n\n",
          expectedRegex: [/print/i, /sep\s*=/i],
          testVerify: (out, code) => (out.includes("3 : 1") || out.includes(" : ")) && /sep\s*=/i.test(code),
          hint: "print(\"Реал Мадрид\", 3, 1, \"Барселона\", sep=\" : \")",
          xp: 60
        }
      ],
      3: [
        {
          id: 'top0_diff3_v1',
          title: "Хардкор со звёздочкой (Вариант 1): Рамка баннера 25 символов",
          desc: "Нарисуй баннер: сверху и снизу линия из 25 звёздочек '*', а по центру строка «*   PYTHON CODE TEST   *». Используй умножение строки '*' * 25.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок 1 · Хардкор 1)\n# ==========================================================\n\n# TODO: Нарисуй верхнюю границу из '*' * 25\n# TODO: Напечатай строку по центру: '*   PYTHON CODE TEST   *'\n# TODO: Нарисуй нижнюю границу из '*' * 25\n\n",
          expectedRegex: [/\*/i, /print/i],
          testVerify: (out) => {
            const lines = out.trim().split('\n');
            return lines.length >= 3 && lines[0].includes('****************') && lines[lines.length-1].includes('****************');
          },
          hint: "print('*' * 25) напечатает линию ровно из 25 звездочек.",
          xp: 120
        },
        {
          id: 'top0_diff3_v2',
          title: "Хардкор со звёздочкой (Вариант 2): Ступени пирамиды",
          desc: "Выведи пирамиду из 4 строк символом '#': на первой строке 1 символ, на второй 2, на третьей 3, на четвертой 4 символа. Используй умножение строки '#' * n.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок 1 · Хардкор 2)\n# ==========================================================\n\n# TODO: Напечатай 4 строки пирамиды, умножая '#' на 1, 2, 3 и 4:\n\n",
          expectedRegex: [/#/i, /print/i],
          testVerify: (out) => {
            const lines = out.trim().split('\n');
            return lines.length >= 4 && lines[0].trim() === '#' && lines[3].trim() === '####';
          },
          hint: "print('#' * 1), print('#' * 2), print('#' * 3), print('#' * 4)",
          xp: 120
        }
      ]
    },

    // Урок 2: Переменные и типы данных
    1: {
      1: [
        {
          id: 'top1_diff1_v1',
          title: "Разминка: Конвертер валюты",
          desc: "Создай переменную usd = 100 и курс rub_rate = 92.5. Вычисли общую сумму total_rub (произведение usd и rub_rate) и напечатай результат.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 2 · Разминка 1)\n# ==========================================================\n\n# TODO: Создай usd и rub_rate, перемножь их и выведи результат:\n\n",
          expectedRegex: [/usd/i, /rub_rate/i, /print/i],
          testVerify: (out) => out.includes("9250"),
          hint: "total_rub = usd * rub_rate\nprint(total_rub)",
          xp: 30
        },
        {
          id: 'top1_diff1_v2',
          title: "Разминка: Площадь и периметр прямоугольника",
          desc: "Создай переменные a = 15 (ширина) и b = 8 (длина). Вычисли площадь area = a * b и периметр perimeter = 2 * (a + b). Напечатай оба числа через пробел.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 2 · Разминка 2)\n# ==========================================================\n\n# TODO: Объяви a и b, рассчитай площадь и периметр, напечатай их:\n\n",
          expectedRegex: [/print/i],
          testVerify: (out) => out.includes("120") && out.includes("46"),
          hint: "area = a * b, perim = 2 * (a + b)",
          xp: 30
        }
      ],
      2: [
        {
          id: 'top1_diff2_v1',
          title: "Боевая задача: Форматированная f-строка карточки",
          desc: "Создай переменные name = 'Дамир', age = 22, score = 98.5. Выведи f-строку строго в формате: «Студент: Дамир | Возраст: 22 | Балл: 98.5».",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 2 · Боевая задача)\n# ==========================================================\n\n# TODO: Создай переменные name, age, score и напечатай f-строку:\n\n",
          expectedRegex: [/f["']/i, /print/i],
          testVerify: (out) => out.includes("Студент: Дамир") && out.includes("Возраст: 22") && out.includes("98.5"),
          hint: "print(f\"Студент: {name} | Возраст: {age} | Балл: {score}\")",
          xp: 60
        }
      ],
      3: [
        {
          id: 'top1_diff3_v1',
          title: "Хардкор: Калькулятор ИМТ (BMI) с округлением",
          desc: "Создай переменные weight = 70 (кг) и height = 1.75 (м). Рассчитай индекс массы тела: bmi = weight / (height ** 2). Округли до двух знаков через round(bmi, 2) и напечатай.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 2 · Хардкор)\n# ==========================================================\n\n# TODO: Рассчитай ИМТ и выведи округлённое значение:\n\n",
          expectedRegex: [/\*\*/i, /round/i, /print/i],
          testVerify: (out) => out.includes("22.86"),
          hint: "bmi = round(weight / (height ** 2), 2)",
          xp: 120
        }
      ]
    }
  };

  // ---------------------------------------------------------------------
  //  ИНИЦИАЛИЗАЦИЯ И РЕНДЕРИНГ ВКЛАДКИ
  // ---------------------------------------------------------------------
  window.initCodeTestTab = function() {
    renderTopicCards();
    loadActiveChallenge();
    setupCodeEditorKeyboard();
    sanitizeHonestXpOnce();
  };

  // Поддержка Tab (4 пробела) и Ctrl+Enter в редакторе
  function setupCodeEditorKeyboard() {
    const ed = document.getElementById('codeTestEditor');
    if (!ed || ed.__hasKeyBound) return;
    ed.__hasKeyBound = true;

    ed.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        runCodeTestCode();
      }
    });
  }

  // ---------------------------------------------------------------------
  //  ЧЕСТНЫЙ СБРОС СТАТИСТИКИ (ТОЛЬКО ЗАРАБОТАННОЕ ДАМИРОМ)
  // ---------------------------------------------------------------------
  window.sanitizeHonestXpOnce = function(force = false) {
    const key = 'quizgen_damir_honest_v2';
    if (!force && localStorage.getItem(key)) return;

    try {
      // Честный прогресс Дамира:
      // Базовые очки: 150 XP (LVL 1)
      // Урок 1 (print): Разминка (40 XP) + Боевая задача (40 XP) = 80 XP
      // Итого честный XP: 230 XP (LVL 2)
      const honestXp = 230;
      const honestLvl = 2;

      // Обновляем userProfile
      if (typeof userProfile !== 'undefined') {
        userProfile.xp = honestXp;
        userProfile.level = honestLvl;
        if (typeof saveProfile === 'function') saveProfile();
      }

      // Обновляем prof_damir в quizgen_all_profiles_v1
      const raw = localStorage.getItem('quizgen_all_profiles_v1');
      if (raw) {
        const list = JSON.parse(raw);
        const damir = list.find(p => p.id === 'prof_damir' || p.name === 'Дамир');
        if (damir) {
          damir.xp = honestXp;
          damir.level = honestLvl;
          damir.pythonProgress = {
            "0": { l1: true, l2: true, l3: false, completedAt: Date.now() }
          };
          localStorage.setItem('quizgen_all_profiles_v1', JSON.stringify(list));
        }
      }

      localStorage.setItem('quizgen_user_profile_v2', JSON.stringify({
        name: 'Дамир',
        avatar: '👑',
        level: honestLvl,
        xp: honestXp,
        streak: 1,
        badges: []
      }));

      localStorage.setItem(key, 'sanitized');
      console.log("[Stats] Честная статистика Дамира откалибрована: 230 XP, LVL 2.");

      if (typeof updateCourseProgressUI === 'function') updateCourseProgressUI();
      if (typeof renderPythonSidebar === 'function') renderPythonSidebar();
    } catch(e) {
      console.warn("sanitizeHonestXp error:", e);
    }
  };

  // ---------------------------------------------------------------------
  //  УПРАВЛЕНИЕ ТЕМАМИ И БЛОКИРОВКАМИ
  // ---------------------------------------------------------------------
  function isTopicUnlocked(idx) {
    if (typeof getLessonLevelStatus !== 'function') return idx === 0;
    const st = getLessonLevelStatus(idx);
    return st && st.count > 0;
  }

  function renderTopicCards() {
    const listEl = document.getElementById('codeTestTopicsList');
    if (!listEl) return;
    listEl.innerHTML = '';

    const lessons = (typeof pythonLessons !== 'undefined') ? pythonLessons : [];
    let unlockedCount = 0;
    lessons.forEach((_, idx) => {
      if (isTopicUnlocked(idx)) unlockedCount++;
    });

    const counterBadge = document.getElementById('codeTestUnlockedCounter');
    if (counterBadge) counterBadge.textContent = `${unlockedCount}/${lessons.length} тем открыто`;

    const lockBanner = document.getElementById('codeTestZeroUnlockedBanner');
    if (lockBanner) {
      lockBanner.style.display = (unlockedCount === 0) ? 'block' : 'none';
    }

    lessons.forEach((les, idx) => {
      const unlocked = isTopicUnlocked(idx);
      const isSelected = (idx === activeTopicIndex);
      const st = (typeof getLessonLevelStatus === 'function') ? getLessonLevelStatus(idx) : { count: 0 };

      const card = document.createElement('div');
      card.className = `code-test-topic-card ${unlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`;
      
      if (unlocked) {
        card.onclick = () => selectCodeTestTopic(idx);
        card.innerHTML = `
          <div class="topic-card-header">
            <span class="topic-badge-status green">🟢 Открыто · ${st.count}/3</span>
            <span class="topic-num">#${idx + 1}</span>
          </div>
          <div class="topic-card-title">${escapeHtml(les.title)}</div>
          <div class="topic-card-desc">Практический код-тест доступен</div>
        `;
      } else {
        card.onclick = () => showLockedTopicAlert(idx, les.title);
        card.innerHTML = `
          <div class="topic-card-header">
            <span class="topic-badge-status locked">🔒 Сначала пройди эту тему!</span>
            <span class="topic-num">#${idx + 1}</span>
          </div>
          <div class="topic-card-title">${escapeHtml(les.title)}</div>
          <div class="topic-card-desc" style="color:#ef4444;">🔒 Заблокировано. Реши Урок ${idx + 1} в курсе.</div>
        `;
      }
      listEl.appendChild(card);
    });
  }

  function showLockedTopicAlert(idx, title) {
    const modal = document.getElementById('codeTestLockModal');
    const msg = document.getElementById('codeTestLockModalMsg');
    const btnGo = document.getElementById('btnGoToLockedLesson');

    if (msg) {
      msg.innerHTML = `
        <div style="font-size:32px;margin-bottom:8px;">🔒</div>
        <b style="color:#f87171;font-size:16px;">Тема «Урок ${idx + 1}: ${escapeHtml(title)}» заблокирована!</b><br><br>
        Чтобы составить практический код-тест по этой теме, сначала пройди этот урок в курсе (реши хотя бы задание Разминки).
      `;
    }

    if (btnGo) {
      btnGo.onclick = () => {
        closeCodeTestLockModal();
        if (typeof switchTab === 'function') switchTab('python');
        if (typeof loadPythonLesson === 'function') loadPythonLesson(idx);
      };
    }

    if (modal) modal.style.display = 'flex';
  }

  window.closeCodeTestLockModal = function() {
    const modal = document.getElementById('codeTestLockModal');
    if (modal) modal.style.display = 'none';
  };

  window.selectCodeTestTopic = function(idx) {
    if (!isTopicUnlocked(idx)) {
      const les = pythonLessons[idx];
      showLockedTopicAlert(idx, les ? les.title : `Урок ${idx + 1}`);
      return;
    }
    activeTopicIndex = idx;
    currentVariantIndex = 0;
    renderTopicCards();
    loadActiveChallenge();
  };

  window.selectRandomUnlockedTopic = function() {
    const lessons = (typeof pythonLessons !== 'undefined') ? pythonLessons : [];
    const unlockedIndices = [];
    lessons.forEach((_, idx) => {
      if (isTopicUnlocked(idx)) unlockedIndices.push(idx);
    });

    if (unlockedIndices.length === 0) {
      alert('У тебя пока нет пройденных тем! Начни с Урока 1, реши разминку, и темы появятся здесь.');
      return;
    }

    // Если открыта только 1 тема, циклически меняем вариацию задачи на ней!
    if (unlockedIndices.length === 1) {
      activeTopicIndex = unlockedIndices[0];
      generateNextChallengeForCurrentTopic();
      renderTopicCards();
      return;
    }

    // Иначе выбираем другую случайную тему
    const otherTopics = unlockedIndices.filter(i => i !== activeTopicIndex);
    const chosen = (otherTopics.length > 0) ? otherTopics[Math.floor(Math.random() * otherTopics.length)] : unlockedIndices[0];
    activeTopicIndex = chosen;
    currentVariantIndex = 0;
    renderTopicCards();
    loadActiveChallenge();
  };

  window.setCodeTestDifficulty = function(diff) {
    activeDifficulty = diff;
    currentVariantIndex = 0;
    document.querySelectorAll('.btn-diff-pill').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.diff) === diff);
    });
    loadActiveChallenge();
  };

  // ---------------------------------------------------------------------
  //  ПЕРЕКЛЮЧЕНИЕ НА СЛЕДУЮЩЕЕ ЗАДАНИЕ ПО ЭТОЙ ЖЕ ТЕМЕ
  // ---------------------------------------------------------------------
  window.generateNextChallengeForCurrentTopic = function() {
    const variantsForTopic = CODE_TEST_VARIANTS[activeTopicIndex];
    if (variantsForTopic && variantsForTopic[activeDifficulty] && variantsForTopic[activeDifficulty].length > 1) {
      const arr = variantsForTopic[activeDifficulty];
      currentVariantIndex = (currentVariantIndex + 1) % arr.length;
      loadActiveChallenge();
      if (typeof showNotificationToast === 'function') {
        showNotificationToast('✨ Загружена новая задача по этой теме!');
      }
      return;
    }

    // Если статических вариаций в банке больше нет — генерируем через нейросеть Qwen!
    generateAiChallengeForTopic();
  };

  function loadActiveChallenge() {
    const variantsForTopic = CODE_TEST_VARIANTS[activeTopicIndex];
    if (variantsForTopic && variantsForTopic[activeDifficulty]) {
      const arr = variantsForTopic[activeDifficulty];
      currentChallenge = arr[currentVariantIndex % arr.length];
    } else {
      currentChallenge = getFallbackChallenge(activeTopicIndex, activeDifficulty, currentVariantIndex);
    }

    displayChallengeInUI(currentChallenge);
  }

  function displayChallengeInUI(ch) {
    const titleEl = document.getElementById('codeTestTitle');
    const descEl = document.getElementById('codeTestDesc');
    const editorEl = document.getElementById('codeTestEditor');
    const xpBadge = document.getElementById('codeTestXpBadge');
    const hintText = document.getElementById('codeTestHintText');
    const hintBox = document.getElementById('codeTestHintBox');
    const statusBox = document.getElementById('codeTestStatusBox');
    const termOutput = document.getElementById('codeTestConsoleOutput');

    if (titleEl) titleEl.textContent = ch.title;
    if (descEl) descEl.innerHTML = ch.desc;
    if (editorEl) editorEl.value = ch.starterCode; // ЧИСТЫЙ ШАБЛОН БЕЗ СПОЙЛЕРОВ!
    if (xpBadge) xpBadge.textContent = `+${ch.xp || 30} XP`;
    if (hintText) hintText.textContent = ch.hint || 'Внимательно прочитай условие и напиши код своими руками.';
    if (hintBox) hintBox.style.display = 'none';
    if (statusBox) statusBox.style.display = 'none';
    if (termOutput) {
      termOutput.className = 'py-term-output-console is-empty';
      termOutput.textContent = '▸ Терминал чист. Напиши свой код выше и нажми «▶️ Запустить код».';
    }
    setupCodeEditorKeyboard();
  }

  function getFallbackChallenge(lessonIdx, difficulty, vIdx) {
    const les = (typeof pythonLessons !== 'undefined' && pythonLessons[lessonIdx]) ? pythonLessons[lessonIdx] : { title: `Урок ${lessonIdx + 1}` };
    const diffNames = { 1: "Разминка", 2: "Боевая задача", 3: "Хардкор ⭐" };
    const xpValues = { 1: 30, 2: 60, 3: 120 };

    return {
      id: `top${lessonIdx}_d${difficulty}_v${vIdx}`,
      title: `${diffNames[difficulty]}: Практика по теме «${les.title.split('—')[0].trim()}» (Вариант ${vIdx + 1})`,
      desc: `Напиши законченную программу на Python по теме «${les.title}». Напиши рабочий код с нуля, реализуя логику урока. Вывод программы должен содержать подтверждение решения.`,
      starterCode: `# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок ${lessonIdx + 1}: ${les.title.split('—')[0].trim()})\n# Сложность: ${diffNames[difficulty]}\n# ==========================================================\n\n# TODO: Напиши решение задачи по теме «${les.title.split('—')[0].trim()}» своими руками:\n\n`,
      expectedRegex: [],
      testVerify: (out) => out && out.trim().length > 0 && !out.includes('Error'),
      hint: "Вспомни пройденную теорию урока и напиши нужные команды Python.",
      xp: xpValues[difficulty] || 50
    };
  }

  // ---------------------------------------------------------------------
  //  ГЕНЕРАТОР НОВЫХ ЗАДАНИЙ ЧЕРЕЗ QWEN 3.5 (БЕЗ СПОЙЛЕРОВ В РЕДАКТОРЕ!)
  // ---------------------------------------------------------------------
  window.generateAiChallengeForTopic = async function() {
    const les = (typeof pythonLessons !== 'undefined' && pythonLessons[activeTopicIndex]) ? pythonLessons[activeTopicIndex] : { title: `Тема ${activeTopicIndex + 1}` };
    const diffNames = { 1: "Разминка (Junior - базовый синтаксис)", 2: "Боевая задача (Middle - прикладная логика)", 3: "Хардкор со звёздочкой (Senior - сложный алгоритм)" };

    const statusBox = document.getElementById('codeTestStatusBox');
    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.className = 'code-test-status-card advice';
      statusBox.innerHTML = `🤖 ИИ Qwen 3.5 придумывает новую практическую задачу по теме «${les.title.split('—')[0].trim()}»...`;
    }

    const host = (document.getElementById('ollamaHost') && document.getElementById('ollamaHost').value) || 'http://127.0.0.1:11434';
    const model = (document.getElementById('modelSelect') && document.getElementById('modelSelect').value) || 'qwen3.5:9b';

    const prompt = `Ты — преподаватель Python. Придумай ОДНУ совершенно НОВУЮ, оригинальную практическую задачу для новичка.
ТЕМА: "${les.title}"
УРОВЕНЬ СЛОЖНОСТИ: ${diffNames[activeDifficulty]}

СТРОГИЕ ПРАВИЛА:
1. В поле "starterCode" КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО писать готовый ответ! Только скелет с "# TODO: напиши свой код здесь".
2. Ответь СТРОГО в формате валидного JSON (без markdown и тегов):
{
  "title": "Краткое название задачи",
  "desc": "Чёткое понятное условие: что дано, что должна напечатать программа.",
  "starterCode": "# ==========================================\\n# ✍️ ТВОЙ КОД ЗДЕСЬ\\n# ==========================================\\n\\n# TODO: Напиши решение по условию задачи:\\n\\n",
  "expectedText": "слово или фраза, которая должна появиться на выводе",
  "hint": "наводящая подсказка без готового решения"
}`;

    try {
      const resp = await fetch(`${host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          format: 'json',
          think: false, // Отключаем thinking для моментального ответа!
          stream: false,
          options: { temperature: 0.7, num_predict: 450 }
        })
      });

      if (!resp.ok) throw new Error(`Ollama статус: ${resp.status}`);
      const data = await resp.json();
      let raw = (data.response || '').trim();
      raw = raw.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      const generated = JSON.parse(raw);

      currentChallenge = {
        id: `ai_gen_${Date.now()}`,
        title: `✨ ИИ: ${generated.title || 'Новая задача'}`,
        desc: generated.desc || 'Выполни задание по теме.',
        starterCode: generated.starterCode || '# TODO: Напиши своё решение здесь:\n\n',
        expectedRegex: [],
        testVerify: (output) => {
          if (!output || output.includes('Error')) return false;
          if (generated.expectedText) {
            return output.toLowerCase().includes(generated.expectedText.toLowerCase());
          }
          return output.trim().length > 0;
        },
        hint: generated.hint || 'Внимательно прочитай условие задачи.',
        xp: activeDifficulty === 1 ? 35 : (activeDifficulty === 2 ? 70 : 140)
      };

      displayChallengeInUI(currentChallenge);
      if (statusBox) statusBox.style.display = 'none';

      if (typeof showNotificationToast === 'function') {
        showNotificationToast('✨ Новая задача от ИИ сгенерирована!');
      }
    } catch(err) {
      console.warn("AI generation fallback to procedural:", err);
      currentVariantIndex++;
      loadActiveChallenge();
      if (statusBox) statusBox.style.display = 'none';
    }
  };

  window.resetCodeTestEditor = function() {
    if (!currentChallenge) return;
    const editorEl = document.getElementById('codeTestEditor');
    if (editorEl && confirm('Сбросить написанный код к чистому шаблону?')) {
      editorEl.value = currentChallenge.starterCode;
    }
  };

  window.toggleCodeTestHint = function() {
    const hintBox = document.getElementById('codeTestHintBox');
    const btn = document.getElementById('btnToggleCodeTestHint');
    if (!hintBox) return;
    if (hintBox.style.display === 'none' || !hintBox.style.display) {
      hintBox.style.display = 'block';
      if (btn) btn.textContent = '🙈 Скрыть подсказку';
    } else {
      hintBox.style.display = 'none';
      if (btn) btn.textContent = '💡 Подсказка';
    }
  };

  // ---------------------------------------------------------------------
  //  ИСПОЛНЕНИЕ КОДА И АВТОТЕСТЫ
  // ---------------------------------------------------------------------
  window.runCodeTestCode = function() {
    const editorEl = document.getElementById('codeTestEditor');
    const termOutput = document.getElementById('codeTestConsoleOutput');
    const code = editorEl ? editorEl.value.trim() : '';

    if (!code) {
      alert('Сначала напиши код в поле редактора!');
      return;
    }

    testOutputBuffer = '';
    if (termOutput) {
      termOutput.className = 'py-term-output-console';
      termOutput.textContent = '⏳ Выполняется...';
    }

    if (typeof window.Sk === 'undefined') {
      if (termOutput) termOutput.textContent = '⚠️ Skulpt движок не загружен.';
      return;
    }

    window.Sk.configure({
      output: (text) => {
        testOutputBuffer += text;
        if (termOutput) termOutput.textContent = testOutputBuffer;
      },
      read: (x) => {
        if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][x] === undefined) {
          throw 'Файл не найден: ' + x;
        }
        return window.Sk.builtinFiles['files'][x];
      },
      inputfun: (promptText) => window.prompt(promptText || 'Ввод:'),
      inputfunTakesPrompt: true,
      execLimit: 3000,
      __future__: window.Sk.python3
    });

    const promise = window.Sk.misceval.asyncToPromise(() =>
      window.Sk.importMainWithBody('<stdin>', false, code, true)
    );

    promise.then(() => {
      if (termOutput && !testOutputBuffer.trim()) {
        termOutput.textContent = '✓ Код выполнен без ошибок (вывод пуст).';
      }
    }).catch((err) => {
      if (termOutput) {
        termOutput.className = 'py-term-output-console has-error';
        termOutput.textContent = `❌ Ошибка выполнения:\n${err.toString()}`;
      }
    });
  };

  // Проверка решения автотестами с защитой от накрутки
  window.verifyCodeTestSolution = function() {
    const editorEl = document.getElementById('codeTestEditor');
    const statusBox = document.getElementById('codeTestStatusBox');
    const code = editorEl ? editorEl.value.trim() : '';

    if (!code) {
      alert('Сначала напиши своё решение в редакторе!');
      return;
    }

    // Проверяем: написал ли пользователь код или оставил только шаблонные комментарии
    const codeWithoutComments = code.replace(/#.*$/gm, '').trim();
    if (!codeWithoutComments) {
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.className = 'code-test-status-card error';
        statusBox.innerHTML = `
          <div style="font-weight:700;color:#ef4444;margin-bottom:4px;">⚠️ В поле редактора только комментарии!</div>
          <div style="font-size:12.5px;color:#fca5a5;">Напиши команды Python своими руками, чтобы решить задачу.</div>
        `;
      }
      return;
    }

    testOutputBuffer = '';
    const termOutput = document.getElementById('codeTestConsoleOutput');

    window.Sk.configure({
      output: (text) => { testOutputBuffer += text; },
      read: (x) => window.Sk.builtinFiles['files'][x],
      execLimit: 3000,
      __future__: window.Sk.python3
    });

    const promise = window.Sk.misceval.asyncToPromise(() =>
      window.Sk.importMainWithBody('<stdin>', false, code, true)
    );

    promise.then(() => {
      if (termOutput) {
        termOutput.className = 'py-term-output-console';
        termOutput.textContent = testOutputBuffer || '✓ Программа завершилась успешно';
      }

      let passed = true;
      let failureReason = '';

      // Проверка регулярных выражений синтаксиса
      if (currentChallenge.expectedRegex && currentChallenge.expectedRegex.length) {
        for (const rgx of currentChallenge.expectedRegex) {
          if (!rgx.test(code)) {
            passed = false;
            failureReason = `В твоём коде должна использоваться правильная конструкция темы.`;
            break;
          }
        }
      }

      if (passed && typeof currentChallenge.testVerify === 'function') {
        const isVerified = currentChallenge.testVerify(testOutputBuffer, code);
        if (!isVerified) {
          passed = false;
          failureReason = `Вывод программы не совпадает с условием задачи.\nТвой вывод:\n«${testOutputBuffer.trim()}»`;
        }
      }

      if (statusBox) {
        statusBox.style.display = 'block';
        if (passed) {
          const chId = currentChallenge.id || `ch_${activeTopicIndex}_${activeDifficulty}`;
          const isFirstTime = !solvedChallengesRegistry[chId];
          solvedChallengesRegistry[chId] = true;

          statusBox.className = 'code-test-status-card success';
          statusBox.innerHTML = `
            <div style="font-size:18px;font-weight:800;color:#10b981;margin-bottom:6px;">
              🎉 ТЕСТ СДАН НА ОТЛИЧНО! ${isFirstTime ? `(+${currentChallenge.xp} XP)` : '(Зачтено ранее)'}
            </div>
            <div style="font-size:13px;line-height:1.6;color:#e2e8f0;">
              Ты сам написал правильный рабочий код и успешно прошёл автотесты!
            </div>
            <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn-action-art" onclick="generateNextChallengeForCurrentTopic()" style="background:#059669;color:#fff;font-weight:700;">
                ✨ Следующее задание по этой теме (+XP)
              </button>
              <button type="button" class="btn-action-art" onclick="setCodeTestDifficulty(${Math.min(3, activeDifficulty + 1)})" style="background:#4f46e5;color:#fff;">
                🚀 Повысить сложность (${activeDifficulty < 3 ? 'Уровень ' + (activeDifficulty + 1) : 'Максимум'})
              </button>
              <button type="button" class="btn-action-art" onclick="selectRandomUnlockedTopic()" style="background:#3b82f6;color:#fff;">
                🎲 Другая открытая тема
              </button>
            </div>
          `;

          // XP начисляется ТОЛЬКО ОДИН РАЗ за уникальное задание!
          if (isFirstTime && typeof addXp === 'function') {
            addXp(currentChallenge.xp);
          }
        } else {
          statusBox.className = 'code-test-status-card error';
          statusBox.innerHTML = `
            <div style="font-size:16px;font-weight:800;color:#ef4444;margin-bottom:6px;">
              ⚠️ ТЕСТ НЕ ПРОЙДЕН
            </div>
            <div style="font-size:13px;line-height:1.6;color:#e2e8f0;">
              ${escapeHtml(failureReason)}
            </div>
            <div style="margin-top:10px;font-size:12px;color:#94a3b8;">
              💡 Нажми «💡 Подсказка» или обратись к ИИ-тьютору ниже.
            </div>
          `;
        }
      }
    }).catch((err) => {
      if (termOutput) {
        termOutput.className = 'py-term-output-console has-error';
        termOutput.textContent = `❌ Ошибка исполнения Python:\n${err.toString()}`;
      }
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.className = 'code-test-status-card error';
        statusBox.innerHTML = `
          <div style="font-size:16px;font-weight:800;color:#ef4444;margin-bottom:4px;">
            🚨 СИНТАКСИЧЕСКАЯ ИЛИ РАНТАЙМ ОШИБКА
          </div>
          <div style="font-size:12.5px;color:#fca5a5;">
            ${escapeHtml(err.toString())}
          </div>
        `;
      }
    });
  };

  // Сократовская консультация ИИ без спойлеров
  window.askCodeTestAiMentor = async function() {
    const editorEl = document.getElementById('codeTestEditor');
    const statusBox = document.getElementById('codeTestStatusBox');
    const userCode = editorEl ? editorEl.value.trim() : '';

    if (!userCode) {
      alert('Сначала напиши хоть пару строк кода!');
      return;
    }

    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.className = 'code-test-status-card advice';
      statusBox.innerHTML = '🤖 ИИ-наставник изучает твой код и готовит подсказку без прямого спойлера...';
    }

    const host = (document.getElementById('ollamaHost') && document.getElementById('ollamaHost').value) || 'http://127.0.0.1:11434';
    const model = (document.getElementById('modelSelect') && document.getElementById('modelSelect').value) || 'qwen3.5:9b';

    const prompt = `Ты — добрый и чуткий ментор по Python.
Ученик решает практический код-тест:
ТЕМА: "${currentChallenge.title}"
УСЛОВИЕ ЗАДАЧИ: "${currentChallenge.desc}"
КОД УЧЕНИКА:
\`\`\`python
${userCode}
\`\`\`

СТРОГИЕ ПРАВИЛА:
1. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО ДАВАТЬ ГОТОВЫЙ КОД РЕШЕНИЯ! Ученик обязан догадаться сам.
2. Объясни простыми словами, на каком шаге логика расходится с условием задачи.
3. Задай 1-2 наводящих вопроса, направляющих мысль в нужную сторону.
4. Ответ дай кратко (3-4 предложения), доброжелательно.`;

    try {
      const resp = await fetch(`${host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          think: false,
          stream: false,
          options: { temperature: 0.3, num_predict: 350 }
        })
      });

      if (!resp.ok) throw new Error(`Ollama статус: ${resp.status}`);
      const data = await resp.json();
      const reply = data.response || 'Совет не получен.';

      if (statusBox) {
        statusBox.className = 'code-test-status-card advice';
        statusBox.innerHTML = `
          <div style="font-weight:700;color:#a5b4fc;margin-bottom:6px;">
            🤖 Совет ИИ-тьютора (без спойлеров):
          </div>
          <div style="font-size:13px;line-height:1.6;color:#e0e7ff;">
            ${escapeHtml(reply).replace(/\\n/g, '<br>')}
          </div>
        `;
      }
    } catch(err) {
      if (statusBox) {
        statusBox.innerHTML = `⚠️ Ошибка связи с локальной нейросетью: ${err.message}. Проверь работу Ollama (порт 11434).`;
      }
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
