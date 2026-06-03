# Design System / UI Rules

## Статус

Этот документ фиксирует будущие работы. На текущем этапе submodule не подключается, UI не реализуется и CSS не мигрируется.

## Источник дизайн-системы

Корпоративная дизайн-система MOEX должна быть подключена как git submodule в директорию `.skills`:

```bash
git submodule add git@github.com:ui-sigma/sigma-skills.git .skills
```

После подключения команда должна обновить корневой `AGENTS.md` и закрепить обязательные правила UI-разработки для всех будущих изменений интерфейса.

## Обязательные скиллы

- `foundations-tokens`
- `foundations-themes`
- `component-button`

## Обязательные правила для будущих UI-изменений

- Перед любыми UI-изменениями читать и применять скиллы из `.skills`.
- Использовать только токены и рецепты из `.skills/skills/foundations-tokens/tokens.yaml`.
- Перед выбором цветов, semantic и emphasis читать `.skills/skills/foundations-tokens/decision-guide.yaml`.
- Для тем использовать `.skills/skills/foundations-themes/SKILL.md`.
- Для кнопок использовать `.skills/skills/component-button/SKILL.md`.
- Не придумывать свои цвета, состояния, границы, тени и варианты кнопок.
- Не использовать raw-цвета в CSS: `#hex`, `rgb()`, `rgba()`, `hsl()`, если они не являются частью токенов.
- Поддерживать light, dark и inverted темы.
- CSS `:active` маппить на состояние `pressed`.
- Состояние `active` использовать только для выбранного/включенного элемента.
- Не использовать `negative ghost button`.
- Все кнопки должны соответствовать documented size, emphasis, semantic, state, loading, focus и accessibility rules.
- После UI-изменений проверять интерфейс в браузере на текущем разрешении.

## Registry скиллов для `AGENTS.md`

После подключения `.skills` в корневой `AGENTS.md` должен быть добавлен registry:

```json
{
  "foundations-tokens": {
    "slug": "foundations-tokens",
    "name": "Design Tokens",
    "category": "foundations",
    "skillPath": "skills/foundations-tokens/SKILL.md",
    "description": "MOEX design token system with decision guide (decision-guide.yaml), token values and recipes (tokens.yaml). Supports light/dark/inverted themes."
  },
  "foundations-themes": {
    "slug": "foundations-themes",
    "name": "Theme System",
    "category": "foundations",
    "skillPath": "skills/foundations-themes/SKILL.md",
    "description": "MOEX theme system: light/dark themes with inverted variants, state mapping, surface hierarchy, contrast requirements"
  },
  "component-button": {
    "slug": "component-button",
    "name": "Button",
    "category": "components",
    "skillPath": "skills/component-button/SKILL.md",
    "description": "Complete Button component: 4 sizes (SM/MD/LG/XL), 4 emphasis levels (solid/soft/outline/ghost), 6 semantics (brand/neutral/positive/negative/warning/info), all states, button groups, a11y. Full MOEX token recipes for light/dark themes."
  }
}
```

## Запрет на ad hoc UI-стили

Будущая UI-разработка не должна использовать самодельные визуальные правила поверх дизайн-системы:

- raw-цвета вне токенов;
- самодельные темы или CSS variables;
- неописанные варианты кнопок;
- произвольные hover/pressed/active/focus состояния;
- произвольные границы, тени, radii и spacing, если для них есть токены/рецепты MOEX.

## Проверка после UI-изменений

После каждого UI-изменения команда должна проверить:

- интерфейс в браузере на текущем разрешении;
- light, dark и inverted темы;
- кнопки по documented size, emphasis, semantic, state, loading, focus и accessibility rules;
- отсутствие raw-цветов в CSS/TS/TSX;
- корректность маппинга CSS `:active` в `pressed`;
- использование `active` только для выбранного/включенного элемента.

