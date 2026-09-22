# FEELINGS_APP_CODEX_INSTRUCTION.md

## PROJECT GOAL

Create a small, polished web application for tracking emotions, feelings, internal states, and the subjective color of each day.

The application should be based on a structured psychological feelings/emotions system rather than a random flat list.

The user must be able to:

- record emotions several times during the same day;
- choose multiple emotions in one record;
- specify emotional intensity;
- separately record physical/mental states;
- add an optional note;
- choose a subjective color for the entire day;
- select not only a basic color but an exact shade;
- browse previous days in a calendar;
- see simple statistics;
- store all data locally;
- export all data into a portable file;
- transfer that file by any method;
- import the file on another device;
- merge imported data with existing local data;
- use the app comfortably on mobile;
- use the app offline as a PWA.

The application must not behave like a clinical diagnostic tool.

It is a personal observation journal.

Do not generate psychological diagnoses, interpretations, medical conclusions, or statements such as:

> You are anxious because...

The app should show patterns in the user's own records only.

---

# 1. TECHNOLOGY

Build the application using:

- Vite
- React
- TypeScript
- CSS
- PWA support

Preferred storage:

- IndexedDB

Use a clean storage abstraction so that the rest of the application is not directly dependent on IndexedDB implementation details.

If IndexedDB significantly complicates the initial implementation, a storage adapter may temporarily use localStorage, but architecture must make migration to IndexedDB straightforward.

The app must work entirely without a backend.

No authentication.

No server.

No cloud synchronization in this version.

---

# 2. APPLICATION LANGUAGE

The UI must currently be in Russian.

All emotion names, states, hints, buttons, empty states, calendar labels, statistics, and settings should be written naturally in Russian.

Avoid stiff medical terminology where a natural everyday Russian word is available.

Keep internal IDs in English and stable.

Example:

```ts
{
  id: "irritation",
  label: "Раздражение"
}
```

This allows localization later.

---

# 3. CORE CONCEPT

There are three separate concepts:

1. emotions / feelings;
2. states;
3. color of the day.

Never merge them into one system.

For example:

- раздражение = emotion;
- тревога = emotion/feeling;
- усталость = state;
- сонливость = state;
- цвет дня = subjective visual summary chosen by the user.

The application must never automatically decide the color of the day based on emotions.

The user chooses it manually.

---

# 4. MULTIPLE RECORDS DURING THE DAY

A single day can contain unlimited emotional records.

Example:

```text
08:20
Спокойствие
Интерес
Лёгкая усталость

14:45
Раздражение
Напряжение

18:30
Радость
Облегчение
Энергия

22:50
Усталость
Спокойствие
```

Each record has its own timestamp.

The user may edit the timestamp manually.

The app must not reduce an entire day to one emotion.

---

# 5. EMOTIONS SYSTEM

The central foundation of the application is a hierarchical psychological feelings/emotions structure inspired by common feelings-wheel approaches and basic-emotion models.

Do not use a flat list as the primary interaction.

The user should move from a broad emotional family to a more precise feeling.

The user may stop at any level.

Do not force them to choose the deepest available word.

---

# 6. TOP-LEVEL EMOTIONAL FAMILIES

Use these main families:

- Радость
- Грусть
- Страх
- Злость
- Отвращение
- Удивление
- Спокойствие

These are practical UI families.

The app is not claiming that this exact seven-category set is the only scientifically valid model.

This structure is used for navigation and everyday emotional awareness.

---

# 7. DEFAULT EMOTION DATASET

Create the emotion dataset in a separate file.

Suggested structure:

```ts
type EmotionNode = {
  id: string;
  label: string;
  description?: string;
  children?: EmotionNode[];
};
```

Use stable unique IDs.

Initial dataset should include at least the following.

---

## РАДОСТЬ

Children:

- интерес
- удовольствие
- благодарность
- нежность
- вдохновение
- удовлетворение
- надежда
- любовь
- облегчение
- гордость
- воодушевление
- веселье
- восторг
- уверенность
- любопытство
- привязанность

Possible deeper refinements:

### Интерес

- любопытство
- увлечённость
- вовлечённость
- предвкушение

### Удовлетворение

- довольство
- чувство завершённости
- комфорт
- принятие результата

### Любовь

- нежность
- привязанность
- забота
- близость

### Облегчение

- отпускание напряжения
- чувство безопасности
- успокоение

### Воодушевление

- энтузиазм
- мотивация
- подъём
- вдохновение

---

## ГРУСТЬ

Children:

- печаль
- одиночество
- тоска
- разочарование
- боль
- беспомощность
- отчаяние
- вина
- стыд
- уязвимость
- потеря
- уныние
- сожаление
- подавленность

Possible refinements:

### Одиночество

- изоляция
- ощущение ненужности
- нехватка близости
- отдалённость

### Разочарование

- несбывшееся ожидание
- сожаление
- огорчение

### Уязвимость

- ранимость
- незащищённость
- чувствительность

### Вина

- сожаление о поступке
- чувство ответственности

### Стыд

- неловкость
- унижение
- ощущение несоответствия

Do not imply that guilt and shame are always sadness clinically.

They are placed here for practical navigation only.

---

## СТРАХ

Children:

- тревога
- беспокойство
- нервозность
- испуг
- неуверенность
- настороженность
- беспомощность
- паника
- опасение
- напряжённое ожидание
- растерянность
- ощущение угрозы

Possible refinements:

### Тревога

- беспокойство
- ожидание плохого
- внутреннее напряжение
- неясный страх

### Неуверенность

- сомнение
- страх ошибки
- страх оценки
- нерешительность

### Паника

- сильный испуг
- потеря ощущения контроля

### Настороженность

- осторожность
- ожидание опасности
- недоверие к ситуации

---

## ЗЛОСТЬ

Children:

- раздражение
- досада
- недовольство
- фрустрация
- обида
- возмущение
- злость
- ярость
- ревность
- зависть
- нетерпение
- враждебность

Possible refinements:

### Раздражение

- недовольство
- досада
- нервозность
- нетерпение

### Обида

- чувство несправедливости
- задетость
- эмоциональная боль

### Фрустрация

- бессилие
- помеха
- невозможность получить желаемое

### Возмущение

- ощущение несправедливости
- протест
- негодование

### Ярость

- сильная злость
- желание резко отреагировать

No aggressive suggestions should be generated.

---

## ОТВРАЩЕНИЕ

Children:

- неприязнь
- брезгливость
- отторжение
- отвращение
- неприятие
- отвращение к ситуации
- моральное отторжение

Possible refinements:

### Неприязнь

- антипатия
- внутреннее сопротивление
- нежелание контакта

### Брезгливость

- физическое отвращение
- сенсорное отторжение

### Отторжение

- желание дистанцироваться
- неприятие

---

## УДИВЛЕНИЕ

Children:

- удивление
- изумление
- восхищение
- шок
- растерянность
- неожиданность
- озадаченность
- потрясение

Possible refinements:

### Удивление

- приятное удивление
- нейтральное удивление
- неприятное удивление

### Шок

- ошеломление
- трудность сразу осмыслить происходящее

### Растерянность

- непонимание
- потеря ориентиров
- неопределённость

---

## СПОКОЙСТВИЕ

Children:

- умиротворение
- расслабленность
- устойчивость
- принятие
- внутренняя тишина
- нейтральность
- безопасность
- удовлетворённое спокойствие
- ясность
- равновесие

Possible refinements:

### Умиротворение

- тихая радость
- отсутствие внутренней спешки
- мягкое спокойствие

### Расслабленность

- отсутствие напряжения
- отдых
- телесный комфорт

### Ясность

- собранность
- понимание
- внутренний порядок

---

# 8. IMPORTANT DATASET PRINCIPLE

Some words can logically belong to more than one emotional family.

Examples:

- растерянность;
- беспомощность;
- нервозность;
- интерес.

Do not treat the hierarchy as a rigid scientific taxonomy.

Allow related words to be referenced from more than one branch if UX benefits from it.

Internally avoid duplicating canonical emotions.

Instead, create aliases or references where appropriate.

Example:

```ts
type EmotionReference = {
  emotionId: string;
  familyId: string;
};
```

---

# 9. "I DON'T KNOW WHAT I FEEL"

Add an option:

**«Не могу понять, что я чувствую»**

This should not be treated as an error.

It opens a simplified helper.

First question:

**Скорее приятно, неприятно или смешанно?**

Options:

- приятно;
- неприятно;
- смешанно;
- не понимаю.

Then:

**Сколько сейчас энергии?**

Options:

- мало;
- средне;
- много.

Then show a small group of possible emotional families or feelings.

Do not claim that these suggestions are psychologically definitive.

Use wording such as:

**«Возможно, тебе близко что-то из этого»**

The user can still select something else.

---

# 10. MULTISELECT EMOTIONS

A single emotional record can contain multiple emotions.

Example:

```text
Тревога — 3/5
Раздражение — 2/5
Интерес — 4/5
```

Do not restrict the user to a single emotional family.

---

# 11. INTENSITY

Each selected emotion may optionally have intensity.

Use a 5-point scale.

Display it visually as:

- dots;
- petals;
- small circles;
- soft segments.

Avoid a clinical numeric slider as the only UI.

Numbers may appear secondarily.

Levels:

1. едва заметно
2. слабое
3. заметное
4. сильное
5. очень сильное

The user may leave intensity unspecified.

---

# 12. STATES

States must be a separate data category.

Create a default list including:

- бодрость
- усталость
- сонливость
- напряжение
- расслабленность
- истощение
- сосредоточенность
- рассеянность
- перегруженность
- апатия
- спокойная энергия
- возбуждение
- физический дискомфорт
- голод
- сытость
- нехватка энергии
- ощущение отдыха
- внутреннее напряжение
- ментальная усталость

Allow multiselect.

Each state may optionally have intensity 1–5.

Users should be able to add custom states later.

---

# 13. ENTRY STRUCTURE

Each emotional record should contain:

```ts
type JournalEntry = {
  id: string;
  timestamp: string;

  emotions: {
    emotionId: string;
    familyId: string;
    intensity?: 1 | 2 | 3 | 4 | 5;
  }[];

  states: {
    stateId: string;
    intensity?: 1 | 2 | 3 | 4 | 5;
  }[];

  note?: string;

  createdAt: string;
  updatedAt: string;
};
```

---

# 14. COLOR OF THE DAY

The color of the day is one of the main visual features.

Each day may have exactly one selected day color.

It must not be limited to a small predefined palette.

The user must be able to select an exact shade.

Use an HSL-style picker or equivalent visual color selector.

User controls:

- hue;
- saturation;
- lightness.

The UX should not require understanding technical color terminology.

Prefer a visual color field + intuitive sliders.

The technical values can remain hidden or shown subtly.

---

# 15. COLOR PICKER

Create a pleasant dedicated color picker.

UI concept:

```text
Какого цвета сегодня твой день?

[ large color selection area ]

Оттенок
────────●────────

Насыщенность
─────●───────────

Светлота
──────────●──────

Сегодня:
[ large soft preview card ]

#748CA1
```

HEX may be shown in small secondary text.

No need to make the user type values manually.

---

# 16. COLOR NAME

Allow an optional personal name for the color.

Examples:

- тихий серо-синий
- тяжёлый бордовый
- тёплый солнечный
- холодный зелёный
- пыльная лаванда
- молочный день

This field is optional.

Do not automatically assign emotional meaning to colors.

The label belongs to the user.

---

# 17. DAY DATA STRUCTURE

Suggested:

```ts
type DayData = {
  date: string;

  color?: {
    hex: string;
    hsl: {
      h: number;
      s: number;
      l: number;
    };
    label?: string;
  };

  entries: JournalEntry[];

  createdAt: string;
  updatedAt: string;
};
```

---

# 18. MAIN NAVIGATION

Use five primary sections:

1. Сегодня
2. Календарь
3. Эмоции
4. Статистика
5. Настройки

On mobile use bottom navigation.

Keep navigation visually light.

Icons may be simple line icons.

Do not use emoji as the main icon system.

---

# 19. SCREEN: TODAY

This is the main screen.

Header:

- current date;
- day of week;
- optional short calm decorative illustration.

Main blocks:

### A. Current day color

Show a soft card:

**Цвет моего дня**

If selected, display a large area filled with the selected shade.

If not selected:

**Выбрать цвет дня**

Tap opens the color picker.

---

### B. Current emotional check-in

Large button:

**+ Отметить, что я чувствую**

This is the primary CTA.

---

### C. Today timeline

Display records chronologically.

Example:

```text
08:20

Спокойствие
Интерес
Усталость

Небольшая заметка...
```

Then next entry.

Timeline should visually suggest time flowing through the day.

Do not make it look like a medical chart.

---

### D. Daily summary

At the bottom:

- number of records;
- most frequently selected emotions;
- optional short descriptive statistics.

Example:

```text
Сегодня ты сделала 4 отметки.

Чаще всего:
Спокойствие
Интерес
Усталость
```

Do not say:

**«Сегодня у тебя был тревожный день»**

unless the user explicitly labeled it that way.

---

# 20. ADD ENTRY FLOW

Clicking:

**+ Отметить, что я чувствую**

opens a bottom sheet or full-screen modal on mobile.

Step 1:

**Что сейчас ближе всего?**

Show emotional families as large soft cards.

The user can select more than one family.

Step 2:

Show emotions inside selected families.

Allow search.

Allow multiselect.

Selected emotions appear as chips.

Step 3:

Optional intensity selection.

Step 4:

States.

Question:

**А как ты себя чувствуешь в целом?**

This wording helps distinguish states from emotions.

Step 5:

Optional note.

Placeholder:

**Хочешь что-то добавить?**

Do not force journaling.

Step 6:

Time.

Default = current time.

Allow edit.

Save.

The full flow should be completable very quickly.

---

# 21. SCREEN: CALENDAR

Display a standard monthly calendar.

Each day cell should visually use its saved day color.

Preferred style:

- slightly rounded day tile;
- color displayed as a soft filled circle, brush-like spot, watercolor blob, or background accent;
- date number remains readable.

Do not lower contrast so much that dates become illegible.

If no color exists, use a warm neutral background.

If entries exist but no color was selected, display a small dot indicator.

---

# 22. CALENDAR COLOR EFFECT

The month view should feel like a palette of the user's days.

Exact stored shades must be used.

Do not simplify them back to generic color categories.

The calendar is one of the central visual features.

---

# 23. DAY DETAILS

Tapping a calendar day opens the day's detail screen.

Show:

- full date;
- selected color;
- optional color label;
- emotional timeline;
- notes;
- edit actions;
- delete actions;
- add another record;
- change color.

---

# 24. SCREEN: EMOTIONS

This screen is both:

- a reference;
- a search tool;
- an exploration tool.

Sections:

### Emotion families

Show the seven top-level families.

Tapping one opens its tree.

### Search

Search by emotion label.

Search should be tolerant of partial words.

Example:

User enters:

`обид`

Result:

**Обида**

Family:

**Злость**

Related:

- разочарование
- возмущение
- боль

Related words should come from an explicit mapping, not AI inference.

### Emotion details

Optional simple explanation.

Example:

**Раздражение**

> Состояние недовольства или внутреннего напряжения, которое может возникать, когда что-то мешает, утомляет или повторяется.

Keep explanations descriptive and neutral.

Avoid diagnosis.

---

# 25. SCREEN: STATISTICS

Statistics should feel lightweight and supportive.

Time periods:

- 7 дней;
- 30 дней;
- месяц;
- custom period later.

Initial statistics:

### Most frequent emotions

Example:

```text
Спокойствие 18
Усталость 14
Интерес 11
Раздражение 7
```

### Most frequent states

Separate list.

### Time-of-day patterns

Use basic periods:

- утро;
- день;
- вечер;
- ночь.

Example:

**Вечером чаще отмечались:**

- усталость;
- спокойствие.

This is allowed because it is directly derived from data.

### Intensity

Show:

- average selected intensity;
- most intense emotions;
- change over time if data is sufficient.

Do not overinterpret.

### Colors

Show a visual strip or mosaic of day colors.

Possible stats:

- colors used most often;
- average hue only if meaningful;
- day-color history.

Avoid saying:

> Blue means you were sad.

Never assign universal psychological meanings to user-selected colors.

---

# 26. OPTIONAL WEEK / MONTH COLOR MOSAIC

Create a beautiful visual component:

**Палитра месяца**

Show all selected day shades as small organic watercolor-like tiles.

This should be visually appealing and suitable for saving as a screenshot.

---

# 27. SCREEN: SETTINGS

Sections:

## Данные

Buttons:

- Экспортировать данные
- Импортировать данные
- Создать резервную копию
- Очистить все данные

## Эмоции и состояния

- custom emotions;
- custom states;
- hide default items;
- restore defaults.

## Интерфейс

- light theme;
- dark theme;
- system theme;
- reduce animations.

---

# 28. EXPORT

Export all user data as JSON.

Filename:

```text
feelings-journal-backup-YYYY-MM-DD.json
```

Include:

- schema version;
- days;
- entries;
- colors;
- settings;
- custom emotions;
- custom states.

Example root:

```ts
type BackupFile = {
  schemaVersion: number;
  exportedAt: string;
  appVersion: string;

  days: DayData[];

  settings: AppSettings;

  customEmotions: CustomEmotion[];

  customStates: CustomState[];
};
```

---

# 29. SHARE OPTION

If the browser supports the Web Share API, after creating the backup show:

- Сохранить файл
- Поделиться

`Поделиться` should invoke the native system share sheet when possible.

This allows sending the backup via:

- AirDrop;
- Telegram;
- WhatsApp;
- email;
- Files;
- other installed apps.

Fallback:

download the JSON file.

---

# 30. IMPORT

Import JSON backup.

Before applying data:

1. validate file;
2. validate schema version;
3. check records;
4. reject invalid structure safely.

Show preview:

```text
Найдено:

42 дня
126 записей
28 цветов дня
```

Then options:

- Объединить с текущими данными
- Заменить текущие данные

Default should be:

**Объединить**

---

# 31. MERGE LOGIC

Use stable UUID-like IDs for entries.

When merging:

- same entry ID = same record;
- use `updatedAt` to choose latest version;
- do not duplicate identical records;
- preserve days existing only locally;
- preserve days existing only in backup.

For custom emotions and states, merge by stable ID.

Color of the day conflict:

if both versions contain different colors for the same day, use the value with the latest `updatedAt`.

---

# 32. DATA SAFETY

Before destructive operations such as:

- replacing data;
- clearing all data;

show confirmation.

For replacing data, automatically offer to create a backup first.

Do not silently erase anything.

---

# 33. PWA

Implement PWA support.

Must include:

- manifest;
- icons;
- service worker;
- offline app shell;
- installability.

After first load, basic use should work without internet.

---

# 34. GHIBLI-INSPIRED VISUAL DIRECTION

The entire UI should have a pleasant, warm, calm, Ghibli-inspired atmosphere.

Important:

Do not copy any specific Studio Ghibli character, film, logo, frame, location, or copyrighted design.

The goal is the emotional quality:

- warm;
- handmade;
- gentle;
- natural;
- peaceful;
- slightly whimsical;
- atmospheric.

---

# 35. VISUAL STYLE

Use:

- softly painted backgrounds;
- warm paper-like surfaces;
- watercolor feeling;
- subtle natural textures;
- rounded cards;
- quiet atmospheric gradients;
- hand-drawn decorative details;
- plants;
- leaves;
- clouds;
- small stars;
- wind motifs;
- tiny flowers;
- gentle sky elements.

Do not overdecorate.

The app must still feel like a modern usable interface.

---

# 36. UI COLOR PALETTE

Base interface palette should use calm colors such as:

- warm ivory;
- cream;
- oat beige;
- soft sage;
- dusty blue;
- pale lavender;
- warm peach;
- muted moss green;
- soft clay;
- warm grey.

Do not use highly saturated UI colors except inside the user's day-color picker.

---

# 37. BACKGROUND

Create a subtle atmospheric background.

Example visual idea:

A softly painted morning sky fading into a warm cream surface, with very subtle distant leaves or grass shapes near corners.

Keep the content area readable.

Do not use a busy full-screen illustration behind forms.

---

# 38. CARDS

Cards should feel slightly tactile.

Use:

- 16–24 px border radius;
- low-opacity soft shadow;
- subtle border;
- warm surfaces;
- gentle elevation.

Avoid glassmorphism-heavy design.

Avoid neon.

Avoid hard black.

---

# 39. TYPOGRAPHY

Use a highly readable font.

Main UI:

a clean rounded sans-serif.

Optional headings:

a slightly softer or handwritten-feeling font only if it remains highly readable.

Do not use decorative fonts for body text.

Russian Cyrillic must render correctly.

---

# 40. DECORATIVE ASSETS

Prefer CSS and simple SVG wherever possible.

Do not create heavy bitmap assets unless required.

Possible reusable SVG decorations:

- leaf branch;
- small flower;
- cloud;
- star sparkle;
- wind swirl;
- tiny hill silhouette;
- small sprout;
- moon;
- sun.

Keep them subtle.

---

# 41. EMOTION FAMILY VISUALS

Each emotional family can have its own gentle UI accent color.

These colors are only navigation aids.

They must not imply universal emotional color meanings.

Suggested starting palette:

- Радость — soft golden
- Грусть — muted blue
- Страх — lavender-grey
- Злость — muted terracotta
- Отвращение — muted olive
- Удивление — soft lilac
- Спокойствие — sage

Use accessible contrast.

---

# 42. MICRO-ANIMATIONS

Animations should be slow and subtle.

Examples:

- card fade-up;
- emotion group unfolding;
- color preview easing;
- leaf gently moving;
- soft button press;
- calendar transition.

No bouncing UI.

No constant movement everywhere.

Respect `prefers-reduced-motion`.

---

# 43. MOBILE-FIRST

Design primarily for phone use.

Target widths from approximately 360 px upward.

Important controls should be thumb-friendly.

Use bottom navigation on mobile.

Modals should become bottom sheets or full-screen dialogs.

Do not create desktop-first layouts squeezed onto mobile.

---

# 44. DESKTOP

On desktop:

- center app inside a comfortable max-width container;
- allow side navigation or retain bottom navigation if visually better;
- calendar may expand;
- statistics may use a two-column layout.

Do not stretch content edge-to-edge on large screens.

---

# 45. ACCESSIBILITY

Implement:

- semantic HTML;
- keyboard support;
- visible focus states;
- sufficient contrast;
- ARIA labels where necessary;
- text alternatives for icon-only buttons;
- reduced motion support.

Color must never be the only method for conveying required information.

For example, calendar dates must still be readable independent of shade.

---

# 46. EMPTY STATES

Create pleasant empty states.

Examples:

Today:

**Здесь появятся твои отметки за день.**

Button:

**Отметить первое чувство**

Calendar:

**Пока здесь тихо. Со временем календарь наполнится твоими оттенками.**

Statistics:

**Нужно немного больше записей, чтобы появились закономерности.**

Do not pressure the user into daily tracking.

Avoid streak language such as:

- Ты потеряла серию!
- Не забудь заполнить!
- Уже 3 дня без записей!

This application should not punish gaps.

---

# 47. NO GAMIFICATION PRESSURE

Do not add:

- streaks;
- penalties;
- daily score;
- emotional score;
- "good day / bad day" classification;
- achievements for frequent tracking.

Tracking should remain neutral.

---

# 48. SEARCH AND RECENT ITEMS

The emotion picker should support:

- search;
- recent selections;
- pinned/favorite emotions.

Recent emotions may appear in a small section:

**Недавно**

This speeds up daily use.

Do not let recents replace access to the full emotion tree.

---

# 49. FAVORITES

Allow user to pin frequently used emotions and states.

Example:

**Избранное**

- спокойствие
- интерес
- раздражение
- усталость

Store favorites in settings.

---

# 50. EDITING

Users must be able to edit:

- emotions;
- intensities;
- states;
- note;
- timestamp;
- day color;
- day color label.

Users must also be able to delete an individual record.

Use confirmation only where deletion could be accidental.

---

# 51. DATE HANDLING

Store dates consistently.

Use local calendar date:

```text
YYYY-MM-DD
```

Store timestamps as ISO strings.

Render all time according to the user's local timezone.

Avoid timezone bugs where records move to another date.

The local day is authoritative for journal grouping.

---

# 52. STORAGE ARCHITECTURE

Create an abstraction similar to:

```ts
interface JournalStorage {
  getDay(date: string): Promise<DayData | null>;
  saveDay(day: DayData): Promise<void>;

  getDaysInRange(start: string, end: string): Promise<DayData[]>;

  exportAll(): Promise<BackupFile>;

  importAll(
    backup: BackupFile,
    strategy: "merge" | "replace"
  ): Promise<void>;

  clearAll(): Promise<void>;
}
```

Do not scatter browser-storage calls across React components.

---

# 53. STATE MANAGEMENT

Keep state management lightweight.

React context + hooks is acceptable.

Avoid adding Redux unless actually needed.

Suggested contexts:

- JournalProvider
- SettingsProvider

---

# 54. COMPONENT STRUCTURE

Suggested components:

```text
AppShell
BottomNavigation
PageHeader

TodayPage
DayColorCard
DayColorPicker
AddEntryButton
DayTimeline
JournalEntryCard

EmotionPicker
EmotionFamilyGrid
EmotionFamilyCard
EmotionTree
EmotionSearch
EmotionChip
IntensityPicker
RecentEmotions
FavoriteEmotions

StatePicker
StateChip

CalendarPage
MonthCalendar
CalendarDayCell
DayDetailsSheet

EmotionsPage
EmotionReferenceTree
EmotionDetails

StatsPage
StatsPeriodSelector
TopEmotionCard
TopStateCard
TimeOfDayStats
ColorPaletteHistory
MonthColorMosaic

SettingsPage
DataSettings
ExportPanel
ImportPanel
CustomEmotionSettings
AppearanceSettings

ConfirmDialog
BottomSheet
EmptyState
```

---

# 55. FOLDER STRUCTURE

Use approximately:

```text
src/
  app/
    App.tsx
    routes.tsx

  components/
    common/
    emotions/
    journal/
    calendar/
    stats/
    settings/
    color/

  pages/
    TodayPage.tsx
    CalendarPage.tsx
    EmotionsPage.tsx
    StatsPage.tsx
    SettingsPage.tsx

  data/
    emotions.ts
    states.ts
    emotionRelations.ts

  storage/
    journalStorage.ts
    indexedDbStorage.ts
    backup.ts
    validation.ts

  hooks/
    useJournal.ts
    useDay.ts
    useSettings.ts

  context/
    JournalContext.tsx
    SettingsContext.tsx

  types/
    emotions.ts
    journal.ts
    settings.ts
    backup.ts

  utils/
    dates.ts
    colors.ts
    statistics.ts
    ids.ts

  styles/
    tokens.css
    global.css
    animations.css

  assets/
    decorative/
```

---

# 56. DESIGN TOKENS

Create CSS variables.

Example categories:

```css
--bg-main
--bg-soft
--surface
--surface-elevated
--text-primary
--text-secondary
--border-soft

--accent-sage
--accent-blue
--accent-peach
--accent-lavender
--accent-gold

--radius-sm
--radius-md
--radius-lg
--radius-xl

--shadow-soft
--shadow-card
```

Use tokens instead of random values throughout components.

---

# 57. DARK THEME

Dark mode should feel like a calm evening rather than pure black.

Use:

- charcoal blue-grey;
- deep forest;
- muted navy;
- warm grey text;
- low-saturation accent colors.

Do not use pure `#000000` backgrounds.

Maintain selected day colors as faithfully as possible.

---

# 58. STATISTICS IMPLEMENTATION

Statistics must be computed locally.

Functions should include:

```ts
getEmotionFrequency(days)
getStateFrequency(days)
getAverageIntensity(days)
getEmotionFrequencyByTimeOfDay(days)
getEntriesCount(days)
getDayColorHistory(days)
```

All statistics should be deterministic from recorded data.

No AI service.

No backend.

---

# 59. TIME-OF-DAY GROUPS

Use configurable internal ranges:

```text
Morning: 05:00–11:59
Day: 12:00–16:59
Evening: 17:00–22:59
Night: 23:00–04:59
```

Render in Russian:

- утро
- день
- вечер
- ночь

---

# 60. VALIDATION

Use runtime validation for imported JSON.

Can use Zod if useful.

Validate:

- schemaVersion;
- IDs;
- dates;
- timestamps;
- colors;
- arrays;
- intensity range;
- required fields.

Do not crash if the import is malformed.

Show a clear Russian error message.

Example:

**Не удалось импортировать файл: его структура не соответствует резервной копии приложения.**

---

# 61. ERROR HANDLING

User-facing errors must be friendly and concise.

Examples:

**Не удалось сохранить запись. Попробуй ещё раз.**

**Файл не удалось прочитать.**

**Этот файл создан в несовместимой версии приложения.**

Do not display raw stack traces in UI.

---

# 62. AUTOSAVE

Changes should save automatically once confirmed.

Do not require a separate global "Save journal" button.

For forms, use explicit final action:

**Сохранить отметку**

but then persist immediately.

---

# 63. PERFORMANCE

The application is small and should remain fast.

Avoid:

- huge dependencies;
- giant UI frameworks;
- unnecessary animation libraries;
- enormous icon packs.

Use tree-shakable lightweight libraries where necessary.

---

# 64. PRIVACY

Add a small note in settings:

**Все записи хранятся только на этом устройстве, пока ты сама не экспортируешь их.**

No analytics unless explicitly added later.

No hidden external data transfer.

---

# 65. README

Create a README containing:

- project description;
- stack;
- install;
- dev;
- build;
- preview;
- PWA notes;
- where data is stored;
- backup/import explanation.

Commands:

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

# 66. ACCEPTANCE CRITERIA

The first version is complete only if all of the following work:

1. Application runs with Vite.
2. UI is fully usable on mobile.
3. User can add multiple records on the same day.
4. User can select multiple emotions.
5. Emotions are organized hierarchically.
6. User can stop at any hierarchy level.
7. User can specify optional intensity.
8. User can select multiple states.
9. User can write an optional note.
10. Timestamp defaults to current local time.
11. Timestamp can be edited.
12. Records persist after reload.
13. User can edit records.
14. User can delete records.
15. User can choose a precise day color.
16. Color supports shade, saturation and lightness.
17. Exact selected shade appears in calendar.
18. User can optionally name the color.
19. Calendar supports month navigation.
20. Calendar day opens its journal details.
21. Emotion search works.
22. Recent emotions work.
23. Favorites work.
24. Basic statistics work.
25. Export JSON works.
26. Native share is used when supported.
27. Import works.
28. Merge import does not create duplicates.
29. Replace import works after confirmation.
30. Invalid import does not crash the app.
31. PWA works offline after initial load.
32. Interface is coherent in the requested warm Ghibli-inspired visual direction.
33. No copyrighted Ghibli characters or copied scenes are used.
34. There are no psychological diagnoses or forced interpretations.
35. No streaks or punitive gamification are present.

---

# 67. DEVELOPMENT PRIORITY

Implement in this order.

## PHASE 1 — Core

- Vite + React + TypeScript setup
- routing/navigation
- design tokens
- storage layer
- emotion dataset
- state dataset
- Today screen
- Add Entry flow
- timeline
- edit/delete

## PHASE 2 — Day color

- shade picker
- color storage
- optional color label
- color card

## PHASE 3 — Calendar

- month calendar
- exact shades
- day detail
- navigation

## PHASE 4 — Emotion reference

- emotion tree
- search
- recent
- favorites
- "Не могу понять, что чувствую"

## PHASE 5 — Statistics

- frequency
- intensity
- time of day
- color history
- monthly palette

## PHASE 6 — Data portability

- export
- Web Share
- import
- validation
- merge
- replace

## PHASE 7 — PWA and polish

- offline support
- installable app
- dark theme
- animations
- accessibility
- visual polish

---

# 68. FINAL PRODUCT QUALITY

Do not stop after producing skeleton pages.

The result should feel like a small finished application.

It must have:

- realistic default emotion data;
- working interactions;
- persistent storage;
- polished mobile layout;
- proper empty states;
- useful calendar;
- export/import;
- actual statistics;
- consistent styling;
- pleasant micro-animations;
- complete Russian UI.

Do not leave major buttons as placeholders.

Do not use lorem ipsum.

Do not create fake statistics.

Statistics must come from real stored entries.

---

# 69. FINAL VISUAL FEEL

The desired emotional tone of the product:

> A quiet personal journal opened near a window on a calm morning: warm paper, soft sky, leaves moving slightly in the wind, muted natural colors, and enough empty space to think.

The application should feel personal and gentle, but not childish.

Avoid:

- cartoon overload;
- therapy-app clichés;
- excessive pink;
- sterile hospital UI;
- corporate dashboard aesthetics;
- neon;
- noisy gradients;
- excessive illustrations;
- childish stickers.

Aim for:

**warm + quiet + natural + thoughtful + slightly magical + functional.**

Build the complete application according to this specification.
