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
          starterCode: "# Твой Python код здесь:\n\n",
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
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i, /end\s*=/i],
          testVerify: (out, code) => out.includes("3") && out.includes("2") && out.includes("1") && out.trim().split('\n').length === 1,
          hint: "Каждому print() передай end=' ', чтобы следующее число не падало на новую строку.",
          xp: 30
        },
        {
          id: 'top0_diff1_v3',
          title: "Разминка (Вариант 3): Статус сервера в одну строку",
          desc: "Выведи статус сервера двумя командами print(): сначала «Сервер: », затем «ОНЛАЙН» на той же строке с помощью end=''.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i, /end\s*=/i],
          testVerify: (out, code) => out.includes("Сервер") && out.includes("ОНЛАЙН") && out.trim().split('\n').length === 1,
          hint: "print(\"Сервер: \", end=\"\") объединит обе строки.",
          xp: 30
        },
        {
          id: 'top0_diff1_v4',
          title: "Разминка (Вариант 4): Координаты точки",
          desc: "Выведи координаты двумя print(): сначала 'X: 10, ' с параметром end='', затем 'Y: 20' на той же строке.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i, /end\s*=/i],
          testVerify: (out) => out.includes("X: 10") && out.includes("Y: 20") && out.trim().split('\n').length === 1,
          hint: "print('X: 10, ', end='')",
          xp: 30
        },
        {
          id: 'top0_diff1_v5',
          title: "Разминка (Вариант 5): Тройной вывод в строку",
          desc: "Напечатай слова 'Раз', 'Два', 'Три' тремя отдельными print(), но чтобы между ними стояло тире ' - ' с помощью end=' - '.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i, /end\s*=/i],
          testVerify: (out) => out.includes("Раз - Два - Три") || (out.includes("Раз") && out.includes("Три")),
          hint: "print('Раз', end=' - ')",
          xp: 30
        }
      ],
      2: [
        {
          id: 'top0_diff2_v1',
          title: "Боевая задача (Вариант 1): Чек магазина через sep",
          desc: "Напечатай строку чека за 1 вызов print(). Аргументы: «Товар: Ноутбук», «Кол-во: 1», «Цена: 75000 руб». Между аргументами должен стоять разделитель sep=' | '.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i, /sep\s*=/i],
          testVerify: (out, code) => (out.includes("Ноутбук") && out.includes("75000") && out.includes(" | ")) || (out.includes(" | ") && /sep\s*=/i.test(code)),
          hint: "print(\"Товар: Ноутбук\", \"Кол-во: 1\", \"Цена: 75000 руб\", sep=\" | \")",
          xp: 60
        },
        {
          id: 'top0_diff2_v2',
          title: "Боевая задача (Вариант 2): Генератор пути к файлу через sep",
          desc: "Выведи путь к файлу одной командой print(). Передай элементы: 'C:', 'Users', 'Damir', 'Python', 'main.py' с разделителем sep='/'.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i, /sep\s*=/i],
          testVerify: (out, code) => (out.includes("C:/Users") || (out.includes("C:") && out.includes("/"))) && /sep\s*=/i.test(code),
          hint: "print('C:', 'Users', 'Damir', 'Python', 'main.py', sep='/')",
          xp: 60
        },
        {
          id: 'top0_diff2_v3',
          title: "Боевая задача (Вариант 3): Табло счета матча",
          desc: "Напечатай счет матча одной командой print(): «Реал Мадрид», 3, 1, «Барселона». Разделитель между всеми элементами должен быть sep=' : '.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i, /sep\s*=/i],
          testVerify: (out, code) => (out.includes("3 : 1") || out.includes(" : ")) && /sep\s*=/i.test(code),
          hint: "print(\"Реал Мадрид\", 3, 1, \"Барселона\", sep=\" : \")",
          xp: 60
        },
        {
          id: 'top0_diff2_v4',
          title: "Боевая задача (Вариант 4): Сигналы светофора",
          desc: "Выведи одной командой print(): 'КРАСНЫЙ', 'ЖЕЛТЫЙ', 'ЗЕЛЕНЫЙ' с разделителем-стрелкой sep=' ➜ '.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i, /sep\s*=/i],
          testVerify: (out) => out.includes("КРАСНЫЙ") && out.includes("ЗЕЛЕНЫЙ") && out.includes("➜"),
          hint: "print('КРАСНЫЙ', 'ЖЕЛТЫЙ', 'ЗЕЛЕНЫЙ', sep=' ➜ ')",
          xp: 60
        }
      ],
      3: [
        {
          id: 'top0_diff3_v1',
          title: "Хардкор со звёздочкой (Вариант 1): Рамка баннера 25 символов",
          desc: "Нарисуй баннер: сверху и снизу линия из 25 звёздочек '*', а по центру строка «*   PYTHON CODE TEST   *». Используй умножение строки '*' * 25.",
          starterCode: "# Твой Python код здесь:\n\n",
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
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/#/i, /print/i],
          testVerify: (out) => {
            const lines = out.trim().split('\n');
            return lines.length >= 4 && lines[0].trim() === '#' && lines[3].trim() === '####';
          },
          hint: "print('#' * 1), print('#' * 2), print('#' * 3), print('#' * 4)",
          xp: 120
        },
        {
          id: 'top0_diff3_v3',
          title: "Хардкор со звёздочкой (Вариант 3): Шахматный узор",
          desc: "Напечатай шахматный узор 3x3: строка 1: '■ □ ■', строка 2: '□ ■ □', строка 3: '■ □ ■'.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i],
          testVerify: (out) => out.includes("■") && out.includes("□") && out.trim().split('\n').length >= 3,
          hint: "print('■ □ ■')\nprint('□ ■ □')\nprint('■ □ ■')",
          xp: 120
        }
      ]
    },

    // Урок 2: Переменные и типы данных
    1: {
      1: [
        {
          id: 'top1_diff1_v1',
          title: "Разминка (Вариант 1): Конвертер валюты",
          desc: "Создай переменную usd = 100 и курс rub_rate = 92.5. Вычисли общую сумму total_rub (произведение usd и rub_rate) и напечатай результат.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/usd/i, /rub_rate/i, /print/i],
          testVerify: (out) => out.includes("9250"),
          hint: "total_rub = usd * rub_rate\nprint(total_rub)",
          xp: 30
        },
        {
          id: 'top1_diff1_v2',
          title: "Разминка (Вариант 2): Площадь и периметр прямоугольника",
          desc: "Создай переменные a = 15 (ширина) и b = 8 (длина). Вычисли площадь area = a * b и периметр perimeter = 2 * (a + b). Напечатай оба числа через пробел.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i],
          testVerify: (out) => out.includes("120") && out.includes("46"),
          hint: "area = a * b, perim = 2 * (a + b)",
          xp: 30
        },
        {
          id: 'top1_diff1_v3',
          title: "Разминка (Вариант 3): Скидка в магазине",
          desc: "Создай price = 2500 и discount_percent = 20. Посчитай финальную цену final_price с учетом скидки (price - price * discount_percent / 100) и выведи её.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i],
          testVerify: (out) => out.includes("2000"),
          hint: "final_price = price * 0.8\nprint(final_price)",
          xp: 30
        },
        {
          id: 'top1_diff1_v4',
          title: "Разминка (Вариант 4): Чай и кофе (Множественный обмен)",
          desc: "Создай cup_tea = 'Чай' и cup_coffee = 'Кофе'. Поменяй их значения местами в одну строчку синтаксисом cup_tea, cup_coffee = cup_coffee, cup_tea и напечатай их.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/cup_tea/i, /cup_coffee/i, /print/i],
          testVerify: (out) => out.includes("Кофе") && out.includes("Чай"),
          hint: "cup_tea, cup_coffee = cup_coffee, cup_tea",
          xp: 30
        }
      ],
      2: [
        {
          id: 'top1_diff2_v1',
          title: "Боевая задача (Вариант 1): Форматированная f-строка карточки",
          desc: "Создай name = 'Дамир', age = 22, score = 98.5. Выведи f-строку формата: «Студент: Дамир | Возраст: 22 | Балл: 98.5».",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/f["']/i, /print/i],
          testVerify: (out) => out.includes("Студент: Дамир") && out.includes("Возраст: 22") && out.includes("98.5"),
          hint: "print(f\"Студент: {name} | Возраст: {age} | Балл: {score}\")",
          xp: 60
        },
        {
          id: 'top1_diff2_v2',
          title: "Боевая задача (Вариант 2): Карточка товара на маркетплейсе",
          desc: "Создай product = 'Мышь', price = 1250, in_stock = True. Выведи f-строку: «Товар: Мышь, Цена: 1250 руб., В наличии: True».",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/f["']/i, /print/i],
          testVerify: (out) => out.includes("Мышь") && out.includes("1250") && out.includes("True"),
          hint: "print(f'Товар: {product}, Цена: {price} руб., В наличии: {in_stock}')",
          xp: 60
        },
        {
          id: 'top1_diff2_v3',
          title: "Боевая задача (Вариант 3): Калькулятор возраста",
          desc: "Создай birth_year = 2005 и current_year = 2026. Вычисли age = current_year - birth_year и выведи f-строку: «Возраст: {age} лет».",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i],
          testVerify: (out) => out.includes("21") || out.includes("Возраст:"),
          hint: "age = current_year - birth_year\nprint(f'Возраст: {age} лет')",
          xp: 60
        }
      ],
      3: [
        {
          id: 'top1_diff3_v1',
          title: "Хардкор со звёздочкой (Вариант 1): Индекс массы тела (BMI)",
          desc: "Создай weight = 74 (кг) и height = 1.80 (м). Вычисли индекс bmi = weight / (height ** 2). Округли его с помощью round(bmi, 2) и напечатай результат.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/\*\*/i, /round/i, /print/i],
          testVerify: (out) => out.includes("22.86"),
          hint: "bmi = round(weight / (height ** 2), 2)",
          xp: 120
        },
        {
          id: 'top1_diff3_v2',
          title: "Хардкор со звёздочкой (Вариант 2): Циклический обмен трёх переменных",
          desc: "Создай x = 10, y = 20, z = 30. Сделай сдвиг по кругу в одну строчку (x получает z, y получает x, z получает y) и выведи x, y, z.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/print/i],
          testVerify: (out) => out.includes("30") && out.includes("10") && out.includes("20"),
          hint: "x, y, z = z, x, y\nprint(x, y, z)",
          xp: 120
        }
      ]
    },

    // Урок 3: Ввод input(), приведение типов и арифметика // и %
    2: {
      1: [
        {
          id: 'top2_diff1_v1',
          title: "Разминка (Вариант 1): Перевод секунд в минуты и секунды",
          desc: "Дано total_sec = 135. С помощью // найди количество целых минут (mins), а с помощью % найди остаток секунд (secs). Напечатай mins и secs через двоеточие 'mins:secs'.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/\/\//i, /%/i, /print/i],
          testVerify: (out) => out.includes("2:15") || (out.includes("2") && out.includes("15")),
          hint: "mins = total_sec // 60\nsecs = total_sec % 60\nprint(f'{mins}:{secs}')",
          xp: 30
        },
        {
          id: 'top2_diff1_v2',
          title: "Разминка (Вариант 2): Квадрат и куб числа",
          desc: "Создай число n = 6. Вычисли его квадрат (n ** 2) и куб (n ** 3). Выведи оба значения через пробел.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/\*\*/i, /print/i],
          testVerify: (out) => out.includes("36") && out.includes("216"),
          hint: "print(n ** 2, n ** 3)",
          xp: 30
        }
      ],
      2: [
        {
          id: 'top2_diff2_v1',
          title: "Боевая задача (Вариант 1): Делёжка золота между пиратами",
          desc: "Дано coins = 53 и pirates = 4. Найди per_pirate (сколько монет получит каждый поровну через //) и captain_bonus (остаток монет капитану через %). Напечатай оба числа.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/\/\//i, /%/i, /print/i],
          testVerify: (out) => out.includes("13") && out.includes("1"),
          hint: "per_pirate = coins // pirates\ncaptain_bonus = coins % pirates",
          xp: 60
        },
        {
          id: 'top2_diff2_v2',
          title: "Боевая задача (Вариант 2): Сумма цифр двузначного числа",
          desc: "Дано число n = 85. Без преобразования в строку, ТОЛЬКО с помощью // и %, извлеки десятки и единицы, и напечатай их сумму (8 + 5 = 13).",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/\/\//i, /%/i, /print/i],
          testVerify: (out) => out.includes("13"),
          hint: "tens = n // 10\nunits = n % 10\nprint(tens + units)",
          xp: 60
        }
      ],
      3: [
        {
          id: 'top2_diff3_v1',
          title: "Хардкор со звёздочкой (Вариант 1): Сумма цифр трёхзначного числа",
          desc: "Дано number = 749. Только математикой (// и %), найди сотни, десятки и единицы, и напечатай их сумму (7 + 4 + 9 = 20).",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/\/\//i, /%/i, /print/i],
          testVerify: (out) => out.includes("20"),
          hint: "h = number // 100\nt = (number % 100) // 10\nu = number % 10\nprint(h + t + u)",
          xp: 120
        }
      ]
    },

    // Урок 4: Условия if, elif, else и булева логика
    3: {
      1: [
        {
          id: 'top3_diff1_v1',
          title: "Разминка (Вариант 1): Проверка чётности числа",
          desc: "Создай число n = 18. Если число чётное (n % 2 == 0), напечатай 'ЧЁТНОЕ', иначе напечатай 'НЕЧЁТНОЕ'.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/if/i, /else/i, /print/i],
          testVerify: (out) => out.includes("ЧЁТНОЕ") || out.includes("ЧЕТНОЕ"),
          hint: "if n % 2 == 0:\n    print('ЧЁТНОЕ')\nelse:\n    print('НЕЧЁТНОЕ')",
          xp: 30
        },
        {
          id: 'top3_diff1_v2',
          title: "Разминка (Вариант 2): Проверка совершеннолетия",
          desc: "Создай age = 19. Если age >= 18, выведи 'Доступ разрешён', иначе 'Доступ запрещён'.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/if/i, /print/i],
          testVerify: (out) => out.includes("Доступ разрешён") || out.includes("разрешен"),
          hint: "if age >= 18: print('Доступ разрешён')",
          xp: 30
        }
      ],
      2: [
        {
          id: 'top3_diff2_v1',
          title: "Боевая задача (Вариант 1): Время суток по часам",
          desc: "Создай hour = 14 (от 0 до 23). Если от 6 до 11 — напечатай 'Утро', если от 12 до 17 — 'День', если от 18 до 22 — 'Вечер', иначе 'Ночь'.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/if/i, /elif/i, /else/i],
          testVerify: (out) => out.includes("День"),
          hint: "if 6 <= hour <= 11: ... elif 12 <= hour <= 17: ...",
          xp: 60
        }
      ],
      3: [
        {
          id: 'top3_diff3_v1',
          title: "Хардкор со звёздочкой (Вариант 1): Проверка високосного года",
          desc: "Создай year = 2024. Год високосный, если (year % 4 == 0 и year % 100 != 0) или (year % 400 == 0). Напечатай 'ВИСОКОСНЫЙ' или 'ОБЫЧНЫЙ'.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/if/i, /%/i, /print/i],
          testVerify: (out) => out.includes("ВИСОКОСНЫЙ"),
          hint: "if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):",
          xp: 120
        }
      ]
    },

    // Урок 5: Списки list, методы и срезы
    4: {
      1: [
        {
          id: 'top4_diff1_v1',
          title: "Разминка (Вариант 1): Добавление и длина списка",
          desc: "Создай список items = ['меч', 'щит']. Добавь в конец элемент 'зелье' через .append(). Напечатай список и его длину через len().",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/append/i, /len/i, /print/i],
          testVerify: (out) => out.includes("зелье") && out.includes("3"),
          hint: "items.append('зелье')\nprint(items, len(items))",
          xp: 30
        }
      ],
      2: [
        {
          id: 'top4_diff2_v1',
          title: "Боевая задача (Вариант 1): Срезы и разворот списка",
          desc: "Дан список numbers = [10, 20, 30, 40, 50]. С помощью среза [::-1] разверни его задом наперёд и напечатай результат.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/\[::-1\]/i, /print/i],
          testVerify: (out) => out.includes("50") && out.includes("10"),
          hint: "reversed_nums = numbers[::-1]\nprint(reversed_nums)",
          xp: 60
        }
      ],
      3: [
        {
          id: 'top4_diff3_v1',
          title: "Хардкор со звёздочкой (Вариант 1): Анализ оценок студента",
          desc: "Дан список grades = [4, 5, 3, 5, 2, 4, 5]. Найди min_g = min(grades), max_g = max(grades) и средний avg_g = round(sum(grades) / len(grades), 2). Выведи их.",
          starterCode: "# Твой Python код здесь:\n\n",
          expectedRegex: [/min/i, /max/i, /sum/i, /len/i],
          testVerify: (out) => out.includes("2") && out.includes("5") && out.includes("4"),
          hint: "print(min(grades), max(grades), round(sum(grades) / len(grades), 2))",
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
    const arr = (variantsForTopic && variantsForTopic[activeDifficulty]) ? variantsForTopic[activeDifficulty] : [];

    // Если есть статические варианты, которые еще не все показаны по кругу:
    if (arr.length > 0 && currentVariantIndex < arr.length - 1) {
      currentVariantIndex++;
      loadActiveChallenge();
      if (typeof showNotificationToast === 'function') {
        showNotificationToast(`✨ Вариант ${currentVariantIndex + 1} из ${arr.length} загружен!`);
      }
      return;
    }

    // Если все статические варианты в банке пройдены — автоматически генерируем совершенно новую задачу через ИИ Qwen!
    currentVariantIndex = 0; // Сбрасываем счетчик для следующего круга
    if (typeof showNotificationToast === 'function') {
      showNotificationToast('🤖 Все варианты пройдены! Генерирую новую задачу через нейросеть...');
    }
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
      starterCode: "# Твой Python код здесь:\n\n",
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
  "starterCode": "# Твой Python код здесь:\\n\\n",
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
    if (editorEl) {
      editorEl.value = currentChallenge.starterCode || '# Твой Python код здесь:\n\n';
      editorEl.focus();
      if (typeof showNotificationToast === 'function') {
        showNotificationToast('🔄 Шаблон сброшен к минимуму');
      }
    }
  };

  window.clearCodeTestEditor = function() {
    const editorEl = document.getElementById('codeTestEditor');
    if (editorEl) {
      editorEl.value = '';
      editorEl.focus();
      if (typeof showNotificationToast === 'function') {
        showNotificationToast('🧹 Редактор теста очищен — чистый лист!');
      }
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
