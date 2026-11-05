// =======================================================================
//  💻 МОДУЛЬ ПРАКТИЧЕСКОГО КОД-ТЕСТИРОВАНИЯ ПО ПРОЙДЕННЫМ ТЕМАМ PYTHON
//  Только реальный код, автотесты, выбор сложности и защита замочком 🔒
// =======================================================================

(function() {
  'use strict';

  // Состояние активного теста
  let activeTopicIndex = 0;       // Индекс темы (0..27)
  let activeDifficulty = 1;       // 1: Разминка, 2: Боевая, 3: Хардкор
  let currentChallenge = null;    // Текущий объект задания
  let testOutputBuffer = '';      // Буфер вывода Skulpt

  // ---------------------------------------------------------------------
  //  БАНК ШАБЛОННЫХ ЗАДАНИЙ ДЛЯ ВСЕХ ТЕМ (ПО 3 СЛОЖНОСТИ НА ТЕМУ)
  // ---------------------------------------------------------------------
  const CODE_TEST_BANK = {
    // Урок 1: print(), sep, end
    0: {
      1: {
        title: "Разминка: Визитка с параметром end",
        desc: "Выведи строку «Привет, меня зовут », а затем следующим вызовом print() выведи своё имя на ТОЙ ЖЕ строке, используя параметр end=''.",
        starterCode: "# Задание: выведи приветствие и имя в одну строчку двумя print()\nprint(\"Привет, меня зовут \", end=\"\")\n# Допиши второй print здесь:\nprint(\"Дамир\")\n",
        expectedKeywords: ['print', 'end='],
        testVerify: (output) => {
          const clean = output.trim();
          return clean.includes("Привет, меня зовут") && clean.split('\n').length === 1;
        },
        hint: "Используй end='' в первом print, чтобы убрать автоматический перенос строки \\n.",
        xp: 30
      },
      2: {
        title: "Боевая задача: Чек с разделителем sep",
        desc: "Напечатай строку чека за 1 вызов print(). Аргументы: «Товар: Ноутбук», «Кол-во: 1», «Цена: 75000 руб». Между аргументами должен стоять разделитель sep=' | '.",
        starterCode: "# Задание: напечатай чек одним print с sep=' | '\nprint(\"Товар: Ноутбук\", \"Кол-во: 1\", \"Цена: 75000 руб\", sep=\" | \")\n",
        expectedKeywords: ['sep=', 'print'],
        testVerify: (output) => {
          return output.includes("Товар: Ноутбук | Кол-во: 1 | Цена: 75000 руб") || output.includes(" | ");
        },
        hint: "Перечисли все три аргумента через запятую внутри print(..., sep=' | ').",
        xp: 60
      },
      3: {
        title: "Хардкор со звёздочкой: Рамка фиксированной ширины",
        desc: "Нарисуй баннер: сверху и снизу линия из 25 звёздочек '*', а по центру строка «*   PYTHON CODE TEST   *». Используй умножение строки '*' * 25.",
        starterCode: "# Задание: нарисуй баннер из звёздочек шириной 25 символов\nprint('*' * 25)\nprint('*   PYTHON CODE TEST   *')\nprint('*' * 25)\n",
        expectedKeywords: ['*', 'print'],
        testVerify: (output) => {
          const lines = output.trim().split('\n');
          return lines.length >= 3 && lines[0].includes('****************') && lines[lines.length-1].includes('****************');
        },
        hint: "В Python строку можно умножать на число: print('*' * 25).",
        xp: 120
      }
    },

    // Урок 2: Переменные и типы данных (int, float, str, bool)
    1: {
      1: {
        title: "Разминка: Конвертер валюты",
        desc: "Создай переменную usd = 100 и rub_rate = 92.5. Создай переменную total_rub, умножив usd на rub_rate, и выведи результат.",
        starterCode: "# Создай переменные и рассчитай сумму в рублях:\nusd = 100\nrub_rate = 92.5\ntotal_rub = usd * rub_rate\nprint(total_rub)\n",
        expectedKeywords: ['usd', 'rub_rate', 'total_rub', 'print'],
        testVerify: (output) => output.includes("9250"),
        hint: "Умножение выполняется знаком *: total_rub = usd * rub_rate.",
        xp: 30
      },
      2: {
        title: "Боевая задача: Спецификаторы и типы",
        desc: "Создай переменные: name = 'Алекс', age = 20, is_student = True. Выведи f-строку: «Студент Алекс (20 лет): статус = True».",
        starterCode: "name = 'Алекс'\nage = 20\nis_student = True\n# Выведи f-строку с переменными:\nprint(f\"Студент {name} ({age} лет): статус = {is_student}\")\n",
        expectedKeywords: ['f"', 'name', 'age', 'is_student'],
        testVerify: (output) => output.includes("Студент Алекс") && output.includes("20") && output.includes("True"),
        hint: "Используй f-строку: f\"Студент {name} ({age} лет): статус = {is_student}\".",
        xp: 60
      },
      3: {
        title: "Хардкор со звёздочкой: Калькулятор ИМТ (BMI)",
        desc: "Создай переменные weight = 70 (кг) и height = 1.75 (метры). Рассчитай индекс массы тела: bmi = weight / (height ** 2). Округли до 2 знаков функцией round(bmi, 2) и напечатай.",
        starterCode: "weight = 70\nheight = 1.75\n# Рассчитай bmi и округли через round():\nbmi = round(weight / (height ** 2), 2)\nprint(f\"ИМТ: {bmi}\")\n",
        expectedKeywords: ['round', '**', 'print'],
        testVerify: (output) => output.includes("22.86"),
        hint: "Возведение в степень в Python пишется как ** (две звёздочки): height ** 2.",
        xp: 120
      }
    },

    // Урок 3: input(), преобразование типов и арифметика
    2: {
      1: {
        title: "Разминка: Преобразование типов",
        desc: "Дана строка s = '42'. Преобразуй её в целое число int, прибавь 8 и выведи результат (должно получиться 50).",
        starterCode: "s = '42'\n# Преобразуй s в int и прибавь 8:\nnum = int(s) + 8\nprint(num)\n",
        expectedKeywords: ['int(', 'print'],
        testVerify: (output) => output.includes("50"),
        hint: "Функция int('42') превращает текст в число.",
        xp: 30
      },
      2: {
        title: "Боевая задача: Деление нацело и остаток",
        desc: "Дано число минут: total_minutes = 155. Рассчитай часы (целочисленное деление // 60) и оставшиеся минуты (остаток % 60). Выведи: «2 ч 35 мин».",
        starterCode: "total_minutes = 155\nhours = total_minutes // 60\nmins = total_minutes % 60\nprint(f\"{hours} ч {mins} мин\")\n",
        expectedKeywords: ['//', '%', 'print'],
        testVerify: (output) => output.includes("2 ч 35 мин") || (output.includes("2") && output.includes("35")),
        hint: "// возвращает целые часы, а % возвращает остаток минут.",
        xp: 60
      },
      3: {
        title: "Хардкор: Сплит счета с чаевыми",
        desc: "Счёт в ресторане bill = 4500 руб, чаевые tip_percent = 15 (процентов), количество гостей guests = 3. Рассчитай, сколько должен заплатить каждый гость (с учетом чаевых), округлив до целого числа int().",
        starterCode: "bill = 4500\ntip_percent = 15\nguests = 3\ntotal = bill * (1 + tip_percent / 100)\nper_person = int(total / guests)\nprint(f\"С каждого: {per_person} руб\")\n",
        expectedKeywords: ['int', 'print'],
        testVerify: (output) => output.includes("1725"),
        hint: "Общий счёт: bill * 1.15. На каждого: total / guests.",
        xp: 120
      }
    },

    // Урок 4: Условия if/elif/else
    3: {
      1: {
        title: "Разминка: Проверка чётности",
        desc: "Дано число n = 14. С помощью if / else проверь, чётное оно или нечётное (n % 2 == 0). Если чётное, выведи «Чётное», иначе «Нечётное».",
        starterCode: "n = 14\nif n % 2 == 0:\n    print(\"Чётное\")\nelse:\n    print(\"Нечётное\")\n",
        expectedKeywords: ['if', 'else', '%', 'print'],
        testVerify: (output) => output.toLowerCase().includes("чётное") || output.toLowerCase().includes("четное"),
        hint: "Оператор n % 2 возвращает 0 для чётных чисел.",
        xp: 30
      },
      2: {
        title: "Боевая задача: Система скидок магазина",
        desc: "Дана сумма покупки amount = 4200. Если сумма >= 5000 — скидка 20%. Если от 3000 до 4999 — скидка 10%. Иначе скидка 0%. Рассчитай итоговую цену со скидкой и выведи её.",
        starterCode: "amount = 4200\nif amount >= 5000:\n    discount = 0.20\nelif amount >= 3000:\n    discount = 0.10\nelse:\n    discount = 0.0\nfinal_price = amount * (1 - discount)\nprint(f\"Итого к оплате: {int(final_price)} руб\")\n",
        expectedKeywords: ['if', 'elif', 'else', 'print'],
        testVerify: (output) => output.includes("3780"),
        hint: "При сумме 4200 сработает elif amount >= 3000 со скидкой 10% (4200 - 420 = 3780).",
        xp: 60
      },
      3: {
        title: "Хардкор: Валидатор надёжности пароля",
        desc: "Дан пароль password = 'SecurePass99'. Напиши проверку: если длина len(password) >= 8 И в пароле есть цифра (любая цифра in password) — выведи «Надёжный пароль», иначе «Слабый пароль».",
        starterCode: "password = 'SecurePass99'\nhas_digit = any(char.isdigit() for char in password)\nif len(password) >= 8 and has_digit:\n    print(\"Надёжный пароль\")\nelse:\n    print(\"Слабый пароль\")\n",
        expectedKeywords: ['if', 'len', 'print'],
        testVerify: (output) => output.includes("Надёжный пароль"),
        hint: "Для проверки цифры можно использовать char.isdigit() или цикл/any().",
        xp: 120
      }
    },

    // Урок 5: Списки (list)
    4: {
      1: {
        title: "Разминка: Методы списков append и len",
        desc: "Создай список fruits = ['яблоко', 'банан']. Добавь в него 'апельсин' с помощью append(), затем выведи количество элементов в списке через len().",
        starterCode: "fruits = ['яблоко', 'банан']\nfruits.append('апельсин')\nprint(len(fruits))\n",
        expectedKeywords: ['append', 'len', 'print'],
        testVerify: (output) => output.includes("3"),
        hint: "fruits.append('апельсин') добавит элемент в конец списка, а len(fruits) вернет 3.",
        xp: 30
      },
      2: {
        title: "Боевая задача: Срезы списка и реверс",
        desc: "Дан список numbers = [10, 20, 30, 40, 50, 60, 70]. С помощью среза [::2] возьми каждый второй элемент, а затем разверни полученный срез задом наперёд с помощью [::-1]. Выведи результат.",
        starterCode: "numbers = [10, 20, 30, 40, 50, 60, 70]\nevery_second = numbers[::2]       # [10, 30, 50, 70]\nreversed_slice = every_second[::-1] # [70, 50, 30, 10]\nprint(reversed_slice)\n",
        expectedKeywords: ['[::2]', '[::-1]', 'print'],
        testVerify: (output) => output.includes("70") && output.includes("50") && output.includes("30") && output.includes("10"),
        hint: "Срез numbers[::2] берёт элементы с шагом 2. Срез [::-1] разворачивает список.",
        xp: 60
      },
      3: {
        title: "Хардкор: Фильтрация и поиск топ-3 оценок",
        desc: "Дан список баллов scores = [45, 92, 88, 63, 99, 78, 91, 54]. Отсортируй список по убыванию и выведи топ-3 лучших результата в виде списка (должно быть [99, 92, 91]).",
        starterCode: "scores = [45, 92, 88, 63, 99, 78, 91, 54]\ntop_3 = sorted(scores, reverse=True)[:3]\nprint(top_3)\n",
        expectedKeywords: ['sorted', 'print'],
        testVerify: (output) => output.includes("99") && output.includes("92") && output.includes("91"),
        hint: "Используй sorted(scores, reverse=True)[:3].",
        xp: 120
      }
    },

    // Урок 6: Циклы for и while
    5: {
      1: {
        title: "Разминка: Сумма чисел от 1 до N",
        desc: "С помощью цикла for и range(1, 11) найди сумму всех чисел от 1 до 10 включительно и напечатай результат (должно быть 55).",
        starterCode: "total = 0\nfor i in range(1, 11):\n    total += i\nprint(total)\n",
        expectedKeywords: ['for', 'in range', 'print'],
        testVerify: (output) => output.includes("55"),
        hint: "range(1, 11) перебирает числа от 1 до 10.",
        xp: 30
      },
      2: {
        title: "Боевая задача: Подсчет гласных букв",
        desc: "Дана строка text = 'программирование'. С помощью цикла for посчитай, сколько в ней гласных букв из набора 'аеёиоуыэюя', и выведи число.",
        starterCode: "text = 'программирование'\nvowels = 'аеёиоуыэюя'\ncount = 0\nfor char in text:\n    if char in vowels:\n        count += 1\nprint(f\"Гласных: {count}\")\n",
        expectedKeywords: ['for', 'in', 'if', 'print'],
        testVerify: (output) => output.includes("7"),
        hint: "В слове 'программирование' ровно 7 гласных букв.",
        xp: 60
      },
      3: {
        title: "Хардкор: Факториал через цикл while",
        desc: "Вычисли факториал числа n = 6 с помощью цикла while (6! = 1 * 2 * 3 * 4 * 5 * 6 = 720). Выведи результат.",
        starterCode: "n = 6\nfact = 1\ncurr = 1\nwhile curr <= n:\n    fact *= curr\n    curr += 1\nprint(f\"6! = {fact}\")\n",
        expectedKeywords: ['while', 'print'],
        testVerify: (output) => output.includes("720"),
        hint: "На каждом шаге while умножай fact на curr и увеличивай curr на 1.",
        xp: 120
      }
    },

    // Урок 7: Функции (def)
    6: {
      1: {
        title: "Разминка: Функция приветствия с return",
        desc: "Напиши функцию greet(name), которая принимает имя и возвращает строку «Привет, {name}!». Вызови её для 'Дамир' и напечатай результат.",
        starterCode: "def greet(name):\n    return f\"Привет, {name}!\"\n\nmsg = greet('Дамир')\nprint(msg)\n",
        expectedKeywords: ['def', 'return', 'print'],
        testVerify: (output) => output.includes("Привет, Дамир!"),
        hint: "Функция должна использовать оператор return для возврата строки.",
        xp: 30
      },
      2: {
        title: "Боевая задача: Функция проверки простого числа",
        desc: "Напиши функцию is_prime(num), которая возвращает True, если число простое (делится только на 1 и на само себя), и False в противном случае. Проверь для чисел 17 и 20.",
        starterCode: "def is_prime(num):\n    if num < 2: return False\n    for i in range(2, int(num ** 0.5) + 1):\n        if num % i == 0:\n            return False\n    return True\n\nprint(is_prime(17))\nprint(is_prime(20))\n",
        expectedKeywords: ['def', 'return', 'is_prime'],
        testVerify: (output) => output.includes("True") && output.includes("False"),
        hint: "Если num делится на какое-то i без остатка, верни False.",
        xp: 60
      },
      3: {
        title: "Хардкор: Вариативные аргументы *args и **kwargs",
        desc: "Напиши функцию stats(*numbers), которая возвращает кортеж из суммы, минимального и максимального числа: (sum, min, max). Проверь на числах 5, 12, 3, 9.",
        starterCode: "def stats(*numbers):\n    return sum(numbers), min(numbers), max(numbers)\n\nres = stats(5, 12, 3, 9)\nprint(res)\n",
        expectedKeywords: ['def', '*numbers', 'return'],
        testVerify: (output) => output.includes("29") && output.includes("3") && output.includes("12"),
        hint: "*numbers упаковывает все переданные числа в кортеж.",
        xp: 120
      }
    },

    // Урок 9: Словари (dict)
    8: {
      1: {
        title: "Разминка: Словарь пользователя",
        desc: "Создай словарь user = {'name': 'Дамир', 'city': 'Октябрьский', 'xp': 250}. Добавь новый ключ 'level' со значением 2 и выведи весь словарь.",
        starterCode: "user = {'name': 'Дамир', 'city': 'Октябрьский', 'xp': 250}\nuser['level'] = 2\nprint(user)\n",
        expectedKeywords: ['{', '}', 'user', 'print'],
        testVerify: (output) => output.includes("level") && output.includes("2"),
        hint: "Добавление ключа: user['level'] = 2.",
        xp: 30
      },
      2: {
        title: "Боевая задача: Частотный счетчик слов",
        desc: "Дан список слов words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']. Составь словарь частоты повторений каждого слова и напечатай его.",
        starterCode: "words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)\n",
        expectedKeywords: ['counts', 'for', 'print'],
        testVerify: (output) => output.includes("'apple': 3") || output.includes('"apple": 3') || (output.includes("apple") && output.includes("3")),
        hint: "Используй counts[w] = counts.get(w, 0) + 1.",
        xp: 60
      },
      3: {
        title: "Хардкор: Группировка товаров по категории",
        desc: "Дан список кортежей товаров items = [('Еда', 'Хлеб'), ('Техника', 'Мышь'), ('Еда', 'Сыр')]. Сгруппируй их в словарь, где ключ — категория, а значение — список товаров.",
        starterCode: "items = [('Еда', 'Хлеб'), ('Техника', 'Мышь'), ('Еда', 'Сыр')]\ncategories = {}\nfor cat, item in items:\n    if cat not in categories:\n        categories[cat] = []\n    categories[cat].append(item)\nprint(categories)\n",
        expectedKeywords: ['categories', 'append', 'print'],
        testVerify: (output) => output.includes("Хлеб") && output.includes("Сыр") && output.includes("Мышь"),
        hint: "Для каждой категории инициализируй список, если её ещё нет в словаре.",
        xp: 120
      }
    }
  };

  // Дефолтный генератор шаблона, если для темы нет ручного конфига
  function getFallbackChallenge(lessonIdx, difficulty) {
    const les = (typeof pythonLessons !== 'undefined' && pythonLessons[lessonIdx]) ? pythonLessons[lessonIdx] : { title: `Урок ${lessonIdx + 1}` };
    const diffNames = { 1: "Разминка", 2: "Боевая задача", 3: "Хардкор со звёздочкой" };
    const xpValues = { 1: 30, 2: 60, 3: 120 };

    return {
      title: `${diffNames[difficulty]}: Практика по теме «${les.title.split('—')[0].trim()}»`,
      desc: `Напиши законченную программу на Python по теме «${les.title}». Программа должна корректно исполняться без синтаксических ошибок и выводить подтверждающий результат.`,
      starterCode: `# ==========================================================\n# ✍️ ПРАКТИЧЕСКИЙ КОД-ТЕСТ: ${les.title}\n# Сложность: ${diffNames[difficulty]}\n# ==========================================================\n\n# Напиши свой рабочий код ниже:\nprint("Решение темы ${lessonIdx + 1} успешно запущено!")\n`,
      expectedKeywords: ['print'],
      testVerify: (output) => output && output.trim().length > 0 && !output.includes('Error'),
      hint: "Вспомни ключевые команды из теории этого урока и примени их на практике.",
      xp: xpValues[difficulty] || 50
    };
  }

  // ---------------------------------------------------------------------
  //  ИНИЦИАЛИЗАЦИЯ И РЕНДЕРИНГ ВКЛАДКИ
  // ---------------------------------------------------------------------
  window.initCodeTestTab = function() {
    renderTopicCards();
    loadActiveChallenge();
  };

  // Проверка: разблокирована ли тема
  function isTopicUnlocked(idx) {
    if (typeof getLessonLevelStatus !== 'function') return idx === 0;
    const st = getLessonLevelStatus(idx);
    return st && st.count > 0;
  }

  // Рендеринг карточек тем с замочками
  function renderTopicCards() {
    const listEl = document.getElementById('codeTestTopicsList');
    if (!listEl) return;
    listEl.innerHTML = '';

    const lessons = (typeof pythonLessons !== 'undefined') ? pythonLessons : [];
    
    // Подсчитываем сколько всего разблокировано
    let unlockedCount = 0;
    lessons.forEach((_, idx) => {
      if (isTopicUnlocked(idx)) unlockedCount++;
    });

    const counterBadge = document.getElementById('codeTestUnlockedCounter');
    if (counterBadge) counterBadge.textContent = `${unlockedCount}/${lessons.length} тем открыто`;

    // Если ни одна тема не пройдена
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

  // Предупреждение при клике на закрытую тему
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

  // Выбор разблокированной темы
  window.selectCodeTestTopic = function(idx) {
    if (!isTopicUnlocked(idx)) {
      const les = pythonLessons[idx];
      showLockedTopicAlert(idx, les ? les.title : `Урок ${idx + 1}`);
      return;
    }
    activeTopicIndex = idx;
    renderTopicCards();
    loadActiveChallenge();
  };

  // Выбор случайной темы из открытых
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

  // Смена сложности
  window.setCodeTestDifficulty = function(diff) {
    activeDifficulty = diff;
    document.querySelectorAll('.btn-diff-pill').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.diff) === diff);
    });
    loadActiveChallenge();
  };

  // Загрузка задания
  function loadActiveChallenge() {
    const bankForTopic = CODE_TEST_BANK[activeTopicIndex];
    if (bankForTopic && bankForTopic[activeDifficulty]) {
      currentChallenge = bankForTopic[activeDifficulty];
    } else {
      currentChallenge = getFallbackChallenge(activeTopicIndex, activeDifficulty);
    }

    // Отображаем в UI
    const titleEl = document.getElementById('codeTestTitle');
    const descEl = document.getElementById('codeTestDesc');
    const editorEl = document.getElementById('codeTestEditor');
    const xpBadge = document.getElementById('codeTestXpBadge');
    const hintText = document.getElementById('codeTestHintText');
    const hintBox = document.getElementById('codeTestHintBox');
    const statusBox = document.getElementById('codeTestStatusBox');
    const termOutput = document.getElementById('codeTestConsoleOutput');

    if (titleEl) titleEl.textContent = currentChallenge.title;
    if (descEl) descEl.innerHTML = currentChallenge.desc;
    if (editorEl) editorEl.value = currentChallenge.starterCode;
    if (xpBadge) xpBadge.textContent = `+${currentChallenge.xp} XP`;
    if (hintText) hintText.textContent = currentChallenge.hint || 'Внимательно прочитай условие и проверь синтаксис.';
    if (hintBox) hintBox.style.display = 'none';
    if (statusBox) statusBox.style.display = 'none';
    if (termOutput) {
      termOutput.className = 'py-term-output-console is-empty';
      termOutput.textContent = '▸ Терминал чист. Нажми «▶️ Запустить код» для проверки.';
    }
  }

  // Сброс к шаблону
  window.resetCodeTestEditor = function() {
    if (!currentChallenge) return;
    const editorEl = document.getElementById('codeTestEditor');
    if (editorEl && confirm('Сбросить написанный код к исходному шаблону?')) {
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
      alert('Сначала напиши код!');
      return;
    }

    // Сначала запускаем код
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

      // Проверяем критерии автотеста
      let passed = true;
      let failureReason = '';

      if (currentChallenge.expectedKeywords && currentChallenge.expectedKeywords.length) {
        for (const kw of currentChallenge.expectedKeywords) {
          if (!code.includes(kw)) {
            passed = false;
            failureReason = `В коде должна использоваться конструкция: «${kw}»`;
            break;
          }
        }
      }

      if (passed && typeof currentChallenge.testVerify === 'function') {
        const isVerified = currentChallenge.testVerify(testOutputBuffer);
        if (!isVerified) {
          passed = false;
          failureReason = `Вывод программы не соответствует условию задачи.\nПолученный вывод:\n«${testOutputBuffer.trim()}»`;
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
              Твой код полностью удовлетворяет всем условиям задачи и успешно прошёл автотесты!
            </div>
            <div style="margin-top:12px;display:flex;gap:8px;">
              <button type="button" class="btn-action-art" onclick="setCodeTestDifficulty(${Math.min(3, activeDifficulty + 1)})" style="background:#4f46e5;color:#fff;">
                🚀 Повысить сложность (${activeDifficulty < 3 ? 'Следующий уровень' : 'Максимум'})
              </button>
              <button type="button" class="btn-action-art" onclick="selectRandomUnlockedTopic()" style="background:#059669;color:#fff;">
                🎲 Следующая случайная тема
              </button>
            </div>
          `;
          // Начисляем XP
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
              💡 Нажми «💡 Подсказка (догадайся сам)» или обратись к ИИ-тьютору ниже.
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
      alert('Сначала напиши код!');
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
1. НЕ ДАВАЙ ГОТОВЫЙ КОД ОТВЕТА! Ученик должен сам догадаться.
2. Объясни простыми словами, на каком шаге логика расходится с условием задачи.
3. Задай 1-2 наводящих вопроса, направляющих мысль в нужную сторону.
4. Ответ дай кратко (не более 4-5 предложений), доброжелательно.`;

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

  // Экранирование HTML
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
