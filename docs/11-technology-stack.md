# Technology Stack Constraints

## Статус

Этот документ фиксирует ограничения по стеку для будущей реализации. Код сейчас не создается и зависимости не устанавливаются.

## Обязательные ограничения

- Frontend: React.
- Backend: TypeScript.
- UI: MOEX design system skills после подключения `.skills`.

## Frontend

Frontend должен разрабатываться на React.

Обязательные правила:

- использовать React для построения пользовательского интерфейса;
- не выбирать альтернативные UI-фреймворки как основу приложения без отдельного архитектурного решения;
- до активной UI-разработки подключить MOEX design system skills и закрепить правила в `AGENTS.md`;
- все UI-компоненты строить с учетом `docs/10-design-system-ui-rules.md`.

Архитектурное решение TR-120:

- frontend build tool/framework для MVP: Vite + React + TypeScript SPA;
- ADR: `docs/adr/0001-frontend-build-tool.md`;
- routing будет добавлен как frontend-level React Router library в skeleton-срезе, без принятия full-stack React framework mode в MVP.

## Backend

Backend должен разрабатываться на TypeScript.

Обязательные правила:

- backend-код, доменная логика, API и интеграционные сервисы должны быть типизированы на TypeScript;
- не использовать JavaScript без TypeScript для production backend-кода;
- конкретный backend framework выбирается отдельным архитектурным решением;
- open collector может быть отдельным сервисом, но если он входит в продуктовый backend-контур, он также должен соответствовать TypeScript-ограничению.

## Требует отдельного решения

Перед началом реализации нужно выбрать и зафиксировать:

- backend runtime и framework;
- API style: REST, GraphQL или mixed;
- схема shared types между frontend и backend;
- стратегия тестирования frontend/backend;
- способ интеграции с закрытым контуром, import gateway и audit log.
