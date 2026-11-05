// =======================================================================
//  💻 МОДУЛЬ ПРАКТИЧЕСКОГО КОД-ТЕСТИРОВАНИЯ ПО ПРОЙДЕННЫМ ТЕМАМ PYTHON
//  Чистые шаблоны (без спойлеров!), генератор разных заданий и ИИ-генератор
// =======================================================================

(function() {
  'use strict';

  // Состояние активного теста
  let activeTopicIndex = 0;       // Индекс темы (0..27)
  let activeDifficulty = 1;       // 1: Разминка, 2: Боевая, 3: Хардкор
  let currentVariantIndex = 0;    // Номер вариации внутри темы
  let currentChallenge = null;    // Текущий объект задания
  let testOutputBuffer = '';      // Буфер вывода Skulpt

  // ---------------------------------------------------------------------
  //  БАНК ШАБЛОННЫХ ЗАДАНИЙ: МУЛЬТИ-ВАРИАНТЫ (БЕЗ СПОЙЛЕРОВ В РЕДАКТОРЕ!)
  // ---------------------------------------------------------------------
  const CODE_TEST_VARIANTS = {
    // Урок 1: print(), sep, end
    0: {
      1: [
        {
          title: "Разминка (Вариант А): Визитка с параметром end",
          desc: "Выведи строку «Привет, меня зовут » первым вызовом print(), а вторым print() выведи своё имя на ТОЙ ЖЕ строке, используя параметр end=''.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 1 · Разминка)\n# ==========================================================\n\n# TODO: Напиши первую команду print() с текстом \"Привет, меня зовут \" и параметром end=\"\"\n# TODO: Напиши вторую команду print() со своим именем\n\n",
          expectedKeywords: ['print', 'end='],
          testVerify: (output) => {
            const clean = output.trim();
            return clean.includes("Привет, меня зовут") && clean.split('\n').length === 1;
          },
          hint: "В первом вызове укажи print(\"Привет, меня зовут \", end=\"\").",
          xp: 30
        },
        {
          title: "Разминка (Вариант B): Обратный отсчёт запуска",
          desc: "Напиши три отдельные команды print(): первая печатает '3...', вторая '2...', третья '1... Пуск!'. Все фразы должны выводиться на ОДНОЙ строке через пробел с помощью end=' '.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 1 · Разминка B)\n# ==========================================================\n\n# TODO: Выведи три числа в одну строку через пробел, используя end=\" \"\n\n",
          expectedKeywords: ['print', 'end='],
          testVerify: (output) => output.includes("3") && output.includes("2") && output.includes("1") && output.trim().split('\n').length === 1,
          hint: "Каждому print() передай end=' ', кроме последнего (или всем трем).",
          xp: 30
        },
        {
          title: "Разминка (Вариант C): Системный статус",
          desc: "Выведи статус системы двумя командами print(): сначала «Сервер: », затем «ОНЛАЙН» на той же строке с помощью end=''.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 1 · Разминка C)\n# ==========================================================\n\n# TODO: Напечатай 'Сервер: ' с end='' и вторым print() слово 'ОНЛАЙН'\n\n",
          expectedKeywords: ['print', 'end='],
          testVerify: (output) => output.includes("Сервер:") && output.includes("ОНЛАЙН") && output.trim().split('\n').length === 1,
          hint: "print(\"Сервер: \", end=\"\") объединит строчки.",
          xp: 30
        }
      ],
      2: [
        {
          title: "Боевая задача (Вариант А): Чек с разделителем sep",
          desc: "Напечатай строку чека за 1 вызов print(). Аргументы: «Товар: Ноутбук», «Кол-во: 1», «Цена: 75000 руб». Между аргументами должен стоять разделитель sep=' | '.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 1 · Боевая задача А)\n# ==========================================================\n\n# TODO: Напиши одну команду print() с тремя аргументами и sep=\" | \"\n\n",
          expectedKeywords: ['sep=', 'print'],
          testVerify: (output) => output.includes("Товар: Ноутбук | Кол-во: 1 | Цена: 75000 руб") || output.includes(" | "),
          hint: "print(\"Товар: Ноутбук\", \"Кол-во: 1\", \"Цена: 75000 руб\", sep=\" | \")",
          xp: 60
        },
        {
          title: "Боевая задача (Вариант B): Путь к файлу через sep",
          desc: "Выведи путь к файлу одной командой print(). Передай компоненты пути: 'C:', 'Users', 'Damir', 'Python', 'app.py' с разделителем sep='/'.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 1 · Боевая задача B)\n# ==========================================================\n\n# TODO: Выведи компоненты пути через sep=\"/\"\n\n",
          expectedKeywords: ['sep=', 'print'],
          testVerify: (output) => output.includes("C:/Users/Damir/Python/app.py") || (output.includes("C:") && output.includes("/")),
          hint: "Укажи аргументы через запятую и в конце sep='/'.",
          xp: 60
        },
        {
          title: "Боевая задача (Вариант C): Табло футбольного матча",
          desc: "Напечатай счет матча одной командой print(): «Реал Мадрид», 3, 1, «Барселона». Разделитель между всеми элементами должен быть sep=' : '.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 1 · Боевая задача C)\n# ==========================================================\n\n# TODO: Выведи счет одной командой print с sep=\" : \"\n\n",
          expectedKeywords: ['sep=', 'print'],
          testVerify: (output) => output.includes("Реал Мадрид : 3 : 1 : Барселона") || output.includes(" : "),
          hint: "print(\"Реал Мадрид\", 3, 1, \"Барселона\", sep=\" : \")",
          xp: 60
        }
      ],
      3: [
        {
          title: "Хардкор со звёздочкой (Вариант А): Рамка баннера",
          desc: "Нарисуй баннер: сверху и снизу линия из 25 звёздочек '*', а по центру строка «*   PYTHON CODE TEST   *». Используй умножение строки '*' * 25.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 1 · Хардкор А)\n# ==========================================================\n\n# TODO: Нарисуй верхнюю границу из '*' * 25\n# TODO: Напечатай строку по центру: '*   PYTHON CODE TEST   *'\n# TODO: Нарисуй нижнюю границу из '*' * 25\n\n",
          expectedKeywords: ['*', 'print'],
          testVerify: (output) => {
            const lines = output.trim().split('\n');
            return lines.length >= 3 && lines[0].includes('****************') && lines[lines.length-1].includes('****************');
          },
          hint: "print('*' * 25) напечатает 25 звездочек подряд.",
          xp: 120
        },
        {
          title: "Хардкор со звёздочкой (Вариант B): Лесенка из символов",
          desc: "Выведи лесенку из 4 строк символом '#': на первой строке 1 символ, на второй 2, на третьей 3, на четвертой 4 символа. Используй умножение строки '#' * n.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 1 · Хардкор B)\n# ==========================================================\n\n# TODO: Напечатай 4 строки лесенки, умножая '#' на 1, 2, 3 и 4:\n\n",
          expectedKeywords: ['#', 'print'],
          testVerify: (output) => {
            const lines = output.trim().split('\n');
            return lines.length >= 4 && lines[0].trim() === '#' && lines[3].trim() === '####';
          },
          hint: "print('#' * 1), затем print('#' * 2) и так далее.",
          xp: 120
        }
      ]
    },

    // Урок 2: Переменные и типы данных
    1: {
      1: [
        {
          title: "Разминка (Вариант А): Конвертер валюты",
          desc: "Создай переменную usd = 100 и курс rub_rate = 92.5. Вычисли общую сумму total_rub (произведение usd и rub_rate) и напечатай её.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 2 · Разминка А)\n# ==========================================================\n\n# TODO: Создай usd и rub_rate, перемножь их и выведи результат:\n\n",
          expectedKeywords: ['usd', 'rub_rate', 'print'],
          testVerify: (output) => output.includes("9250"),
          hint: "usd = 100\nrub_rate = 92.5\ntotal_rub = usd * rub_rate\nprint(total_rub)",
          xp: 30
        },
        {
          title: "Разминка (Вариант B): Расчет площади прямоугольника",
          desc: "Создай переменные a = 15 (ширина) и b = 8 (длина). Вычисли площадь area = a * b и периметр perimeter = 2 * (a + b). Напечатай оба значения через пробел.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 2 · Разминка B)\n# ==========================================================\n\n# TODO: Объяви a и b, рассчитай площадь и периметр, напечатай их:\n\n",
          expectedKeywords: ['a', 'b', 'print'],
          testVerify: (output) => output.includes("120") && output.includes("46"),
          hint: "area = a * b, perimeter = 2 * (a + b).",
          xp: 30
        }
      ],
      2: [
        {
          title: "Боевая задача: Форматированная f-строка профиля",
          desc: "Создай переменные name = 'Дамир', age = 22, score = 98.5. Выведи f-строку строго в формате: «Студент: Дамир | Возраст: 22 | Балл: 98.5».",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 2 · Боевая задача)\n# ==========================================================\n\n# TODO: Создай переменные name, age, score и напечатай f-строку:\n\n",
          expectedKeywords: ['f"', 'print', 'name', 'age'],
          testVerify: (output) => output.includes("Студент: Дамир") && output.includes("Возраст: 22") && output.includes("98.5"),
          hint: "print(f\"Студент: {name} | Возраст: {age} | Балл: {score}\")",
          xp: 60
        }
      ],
      3: [
        {
          title: "Хардкор: Калькулятор ИМТ (BMI)",
          desc: "Создай переменные weight = 70 (кг) и height = 1.75 (м). Рассчитай индекс массы тела: bmi = weight / (height ** 2). Округли до двух знаков через round(bmi, 2) и напечатай.",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 2 · Хардкор)\n# ==========================================================\n\n# TODO: Рассчитай ИМТ и выведи округлённое значение:\n\n",
          expectedKeywords: ['**', 'round', 'print'],
          testVerify: (output) => output.includes("22.86"),
          hint: "bmi = round(weight / (height ** 2), 2)",
          xp: 120
        }
      ]
    },

    // Урок 3: Преобразование типов и арифметика
    2: {
      1: [
        {
          title: "Разминка: Сложение строк как чисел",
          desc: "Даны две строки num1 = '25' и num2 = '17'. Преобразуй обе строки в int(), сложи их и выведи сумму (должно получиться 42).",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 3 · Разминка)\n# ==========================================================\nnum1 = '25'\nnum2 = '17'\n\n# TODO: Преобразуй строки в int(), сложи и напечатай результат:\n\n",
          expectedKeywords: ['int(', 'print'],
          testVerify: (output) => output.includes("42"),
          hint: "total = int(num1) + int(num2)",
          xp: 30
        }
      ],
      2: [
        {
          title: "Боевая задача: Часы и минуты",
          desc: "Дано общее число минут: total_minutes = 185. Найди целые часы (через // 60) и оставшиеся минуты (через % 60). Выведи: «3 ч 5 мин».",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 3 · Боевая задача)\n# ==========================================================\ntotal_minutes = 185\n\n# TODO: Найди целые часы // и остаток минут %\n\n",
          expectedKeywords: ['//', '%', 'print'],
          testVerify: (output) => output.includes("3 ч 5 мин") || (output.includes("3") && output.includes("5")),
          hint: "hours = total_minutes // 60\nmins = total_minutes % 60",
          xp: 60
        }
      ],
      3: [
        {
          title: "Хардкор: Сплит счета с чаевыми",
          desc: "Счёт в ресторане bill = 5000 руб, чаевые tip_percent = 10, количество гостей guests = 4. Рассчитай и выведи сумму на одного гостя, округлив до целого числа int().",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 3 · Хардкор)\n# ==========================================================\nbill = 5000\ntip_percent = 10\nguests = 4\n\n# TODO: Рассчитай общий счет с чаевыми и долю каждого гостя:\n\n",
          expectedKeywords: ['int', 'print'],
          testVerify: (output) => output.includes("1375"),
          hint: "total = bill * 1.1\nper_person = int(total / guests)",
          xp: 120
        }
      ]
    },

    // Урок 4: Условия if/elif/else
    3: {
      1: [
        {
          title: "Разминка: Проверка чётности",
          desc: "Дано число n = 18. Напиши проверку if/else: если число чётное (n % 2 == 0), напечатай «Чётное», иначе «Нечётное».",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 4 · Разминка)\n# ==========================================================\nn = 18\n\n# TODO: Напиши конструкцию if / else:\n\n",
          expectedKeywords: ['if', 'else', '%', 'print'],
          testVerify: (output) => output.toLowerCase().includes("чётное") || output.toLowerCase().includes("четное"),
          hint: "if n % 2 == 0:\n    print('Чётное')",
          xp: 30
        }
      ],
      2: [
        {
          title: "Боевая задача: Категории возраста",
          desc: "Дана переменная age = 16. Если age < 14 — напечатай «Ребёнок», если age от 14 до 17 — напечатай «Подросток», иначе «Взрослый».",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 4 · Боевая задача)\n# ==========================================================\nage = 16\n\n# TODO: Напиши цепочку if / elif / else:\n\n",
          expectedKeywords: ['if', 'elif', 'else', 'print'],
          testVerify: (output) => output.includes("Подросток"),
          hint: "if age < 14:\n    print('Ребёнок')\nelif age <= 17:\n    print('Подросток')",
          xp: 60
        }
      ],
      3: [
        {
          title: "Хардкор: Проверка логина и пароля",
          desc: "Даны login = 'admin' и password = '777'. Напиши проверку: если оба верны — напечатай «Доступ разрешён», иначе если только логин верен — «Неверный пароль», иначе «Пользователь не найден».",
          starterCode: "# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Тема 4 · Хардкор)\n# ==========================================================\nlogin = 'admin'\npassword = '777'\n\n# TODO: Напиши условия с and / elif / else:\n\n",
          expectedKeywords: ['if', 'elif', 'else', 'print'],
          testVerify: (output) => output.includes("Доступ разрешён"),
          hint: "if login == 'admin' and password == '777': ...",
          xp: 120
        }
      ]
    }
  };

  // ---------------------------------------------------------------------
  //  ИНИЦИАЛИЗАЦИЯ ВКЛАДКИ
  // ---------------------------------------------------------------------
  window.initCodeTestTab = function() {
    renderTopicCards();
    loadActiveChallenge();
  };

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

    const randomIdx = unlockedIndices[Math.floor(Math.random() * unlockedIndices.length)];
    selectCodeTestTopic(randomIdx);
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
  //  ЗАГРУЗКА И ПЕРЕКЛЮЧЕНИЕ ЗАДАНИЙ (ВСЕГДА РАЗНЫЕ ЗАДАНИЯ!)
  // ---------------------------------------------------------------------
  window.generateNextChallengeForCurrentTopic = function() {
    // 1. Проверяем, есть ли готовые вариации в банке
    const variantsForTopic = CODE_TEST_VARIANTS[activeTopicIndex];
    if (variantsForTopic && variantsForTopic[activeDifficulty] && variantsForTopic[activeDifficulty].length > 1) {
      const arr = variantsForTopic[activeDifficulty];
      currentVariantIndex = (currentVariantIndex + 1) % arr.length;
      loadActiveChallenge();
      if (typeof showNotificationToast === 'function') {
        showNotificationToast('✨ Загружена новая вариация задачи!');
      }
      return;
    }

    // 2. Если вариантов мало или пользователь хочет ещё — генерируем через ИИ!
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
    if (hintText) hintText.textContent = ch.hint || 'Внимательно прочитай условие и напиши код.';
    if (hintBox) hintBox.style.display = 'none';
    if (statusBox) statusBox.style.display = 'none';
    if (termOutput) {
      termOutput.className = 'py-term-output-console is-empty';
      termOutput.textContent = '▸ Терминал чист. Напиши свой код выше и нажми «▶️ Запустить код».';
    }
  }

  function getFallbackChallenge(lessonIdx, difficulty, vIdx) {
    const les = (typeof pythonLessons !== 'undefined' && pythonLessons[lessonIdx]) ? pythonLessons[lessonIdx] : { title: `Урок ${lessonIdx + 1}` };
    const diffNames = { 1: "Разминка", 2: "Боевая задача", 3: "Хардкор со звёздочкой ⭐" };
    const xpValues = { 1: 30, 2: 60, 3: 120 };

    return {
      title: `${diffNames[difficulty]}: Практика по теме «${les.title.split('—')[0].trim()}» (Вариант ${vIdx + 1})`,
      desc: `Напиши законченную программу на Python по теме «${les.title}». Напиши рабочий код с нуля, реализуя логику урока. Вывод программы должен содержать подтверждение решения.`,
      starterCode: `# ==========================================================\n# ✍️ ТВОЙ КОД ЗДЕСЬ (Урок ${lessonIdx + 1}: ${les.title.split('—')[0].trim()})\n# Сложность: ${diffNames[difficulty]}\n# ==========================================================\n\n# TODO: Напиши своё решение задачи по теме ниже:\n\n`,
      expectedKeywords: ['print'],
      testVerify: (output) => output && output.trim().length > 0 && !output.includes('Error'),
      hint: "Вспомни пройденную теорию и напиши вызовы функций своими руками.",
      xp: xpValues[difficulty] || 50
    };
  }

  // ---------------------------------------------------------------------
  //  ИИ-ГЕНЕРАТОР НОВЫХ ЗАДАНИЙ НА ТУ ЖЕ ТЕМУ (ЧЕРЕЗ QWEN 3.5 БЕЗ СПОЙЛЕРОВ!)
  // ---------------------------------------------------------------------
  window.generateAiChallengeForTopic = async function() {
    const les = (typeof pythonLessons !== 'undefined' && pythonLessons[activeTopicIndex]) ? pythonLessons[activeTopicIndex] : { title: `Тема ${activeTopicIndex + 1}` };
    const diffNames = { 1: "Разминка (Junior - базовый синтаксис)", 2: "Боевая задача (Middle - прикладная логика)", 3: "Хардкор со звёздочкой (Senior - сложный алгоритм)" };

    const statusBox = document.getElementById('codeTestStatusBox');
    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.className = 'code-test-status-card advice';
      statusBox.innerHTML = `🤖 ИИ Qwen 3.5 генерирует совершенно новую практическую задачу по теме «${les.title.split('—')[0].trim()}»...`;
    }

    const host = (document.getElementById('ollamaHost') && document.getElementById('ollamaHost').value) || 'http://127.0.0.1:11434';
    const model = (document.getElementById('modelSelect') && document.getElementById('modelSelect').value) || 'qwen3.5:9b';

    const prompt = `Ты — опытный методист по Python. Придумай ОДНУ совершенно НОВУЮ, оригинальную практическую задачу для ученика.
ТЕМА: "${les.title}"
УРОВЕНЬ СЛОЖНОСТИ: ${diffNames[activeDifficulty]}

СТРОГИЕ ПРАВИЛА:
1. В поле "starterCode" КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО давать готовое решение! Только шаблон с комментариями "# TODO: напиши свой код здесь".
2. Задача должна быть понятной, жизненной и интересной.
3. Ответь СТРОГО в формате валидного JSON (без markdown-обёртки и лишних слов):
{
  "title": "Краткое название задачи",
  "desc": "Чёткое понятное условие: что дано, что должна напечатать программа.",
  "starterCode": "# ==========================================\\n# ✍️ ТВОЙ КОД ЗДЕСЬ\\n# ==========================================\\n\\n# TODO: Напиши решение по условию выше:\\n\\n",
  "expectedKeywords": ["print"],
  "expectedText": "слово или фраза, которая обязана быть в выводе",
  "hint": "наводящая подсказка без готового кода"
}`;

    try {
      const resp = await fetch(`${host}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          format: 'json',
          think: false, // Отключаем deep thinking для моментального ответа!
          stream: false,
          options: { temperature: 0.7, num_predict: 450 }
        })
      });

      if (!resp.ok) throw new Error(`Ollama статус: ${resp.status}`);
      const data = await resp.json();
      let raw = (data.response || '').trim();

      // Очищаем от возможных markdown-тегов
      raw = raw.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      const generated = JSON.parse(raw);

      currentChallenge = {
        title: `✨ ИИ: ${generated.title || 'Новая задача'}`,
        desc: generated.desc || 'Выполни задание по теме.',
        starterCode: generated.starterCode || '# TODO: Напиши своё решение здесь:\n\n',
        expectedKeywords: Array.isArray(generated.expectedKeywords) ? generated.expectedKeywords : ['print'],
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
      console.warn("AI generation fallback to procedural generator:", err);
      // Fallback на следующую процедурную вариацию
      currentVariantIndex++;
      loadActiveChallenge();
      if (statusBox) statusBox.style.display = 'none';
    }
  };

  // Сброс к шаблону
  window.resetCodeTestEditor = function() {
    if (!currentChallenge) return;
    const editorEl = document.getElementById('codeTestEditor');
    if (editorEl && confirm('Сбросить написанный код к чистому шаблону?')) {
      editorEl.value = currentChallenge.starterCode;
    }
  };

  // Спойлер подсказки
  window.toggleCodeTestHint = function() {
    const hintBox = document.getElementById('codeTestHintBox');
    const btn = document.getElementById('btnToggleCodeTestHint');
    if (!hintBox) return;
    if (hintBox.style.display === 'none' || !hintBox.style.display) {
      hintBox.style.display = 'block';
      if (btn) btn.textContent = '🙈 Скрыть подсказку';
    } else {
      hintBox.style.display = 'none';
      if (btn) btn.textContent = '💡 Подсказка (догадайся сам)';
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
      if (termOutput) {
        if (!testOutputBuffer.trim()) {
          termOutput.textContent = '✓ Код выполнен без ошибок (вывод пуст).';
        }
      }
    }).catch((err) => {
      if (termOutput) {
        termOutput.className = 'py-term-output-console has-error';
        termOutput.textContent = `❌ Ошибка выполнения:\n${err.toString()}`;
      }
    });
  };

  // Проверка решения автотестами
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
          <div style="font-size:12.5px;color:#fca5a5;">Напиши команды Python, чтобы программа что-то вывела.</div>
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

      if (currentChallenge.expectedKeywords && currentChallenge.expectedKeywords.length) {
        for (const kw of currentChallenge.expectedKeywords) {
          if (!code.includes(kw)) {
            passed = false;
            failureReason = `В твоём коде должна использоваться конструкция или параметр: «${kw}»`;
            break;
          }
        }
      }

      if (passed && typeof currentChallenge.testVerify === 'function') {
        const isVerified = currentChallenge.testVerify(testOutputBuffer);
        if (!isVerified) {
          passed = false;
          failureReason = `Вывод программы не совпадает с условием задачи.\nТвой вывод:\n«${testOutputBuffer.trim()}»`;
        }
      }

      if (statusBox) {
        statusBox.style.display = 'block';
        if (passed) {
          statusBox.className = 'code-test-status-card success';
          statusBox.innerHTML = `
            <div style="font-size:18px;font-weight:800;color:#10b981;margin-bottom:6px;">
              🎉 ТЕСТ СДАН НА ОТЛИЧНО! (+${currentChallenge.xp} XP)
            </div>
            <div style="font-size:13px;line-height:1.6;color:#e2e8f0;">
              Ты сам написал правильный рабочий код и успешно прошёл все автотесты!
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
          if (typeof addXp === 'function') addXp(currentChallenge.xp);
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
              💡 Нажми «💡 Подсказка (догадайся сам)» или обратись к ИИ-наставнику ниже.
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
