import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Rocket,
  Target,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { PortalRoute } from '../routes';
import { fetchStrategicInitiatives, type StrategicInitiativeListItem } from '../shared/api/strategic-initiatives';
import { fetchTrends, type TrendListItem } from '../shared/api/trends';

type ModuleDataState =
  | {
      error: null;
      initiatives: StrategicInitiativeListItem[];
      status: 'loading';
      trends: TrendListItem[];
    }
  | {
      error: null;
      initiatives: StrategicInitiativeListItem[];
      status: 'success';
      trends: TrendListItem[];
    }
  | {
      error: string;
      initiatives: StrategicInitiativeListItem[];
      status: 'error';
      trends: TrendListItem[];
    };

type SourceTrace = {
  imported_from_dataset?: string;
  review_status?: string;
  source_contract?: string;
  source_number?: number | string;
  source_row_key?: string;
  source_section?: string;
};

const trendSeedDepartments = new Map<number, string>([
  [1, 'КСС'],
  [2, 'КСС'],
  [3, 'КСС'],
  [4, 'КСС'],
  [5, 'КСС'],
  [6, 'КСС'],
  [7, 'КСС'],
  [8, 'КСС'],
  [10, 'КСС'],
  [11, 'TKC'],
]);

function asSourceTrace(value: unknown): SourceTrace {
  return typeof value === 'object' && value !== null ? value : {};
}

function sourceNumber(value: unknown) {
  const number = asSourceTrace(value).source_number;
  return typeof number === 'number' || typeof number === 'string' ? String(number) : 'PDF';
}

function numericSourceNumber(value: unknown) {
  const parsed = Number(sourceNumber(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function trendDepartment(trend: TrendListItem) {
  return trendSeedDepartments.get(numericSourceNumber(trend.sourceTrace)) ?? 'PDF seed';
}

function shortText(value: string, maxLength = 132) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trim()}…` : value;
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function bySourceNumber<T extends { sourceTrace: unknown }>(left: T, right: T) {
  return numericSourceNumber(left.sourceTrace) - numericSourceNumber(right.sourceTrace);
}

function buildDepartmentKpi(trends: TrendListItem[], initiatives: StrategicInitiativeListItem[]) {
  const departments = uniqueValues([
    ...trends.map(trendDepartment),
    ...initiatives.map((initiative) => initiative.department.code),
  ]).sort((left, right) => left.localeCompare(right, 'ru'));

  return departments.map((department) => {
    const candidateTrendCount = trends.filter((trend) => trendDepartment(trend) === department).length;
    const initiativeCount = initiatives.filter((initiative) => initiative.department.code === department).length;

    return {
      candidateTrendCount,
      department,
      initiativeCount,
      missingScoringCount: Math.max(3 - 0, 0),
      scoringTarget: 3,
    };
  });
}

function buildTrendDepartmentRows(trends: TrendListItem[]) {
  return uniqueValues(trends.map(trendDepartment))
    .sort((left, right) => left.localeCompare(right, 'ru'))
    .map((department) => ({
      label: department,
      value: trends.filter((trend) => trendDepartment(trend) === department).length,
    }));
}

function buildInitiativeDepartmentRows(initiatives: StrategicInitiativeListItem[]) {
  return uniqueValues(initiatives.map((initiative) => initiative.department.code))
    .sort((left, right) => left.localeCompare(right, 'ru'))
    .map((department) => ({
      label: department,
      value: initiatives.filter((initiative) => initiative.department.code === department).length,
    }));
}

function percent(value: number, max: number) {
  return max > 0 ? Math.round((value / max) * 100) : 0;
}

function barWidth(value: number, max: number) {
  if (value === 0) {
    return '0%';
  }

  return `${Math.max(percent(value, max), 4)}%`;
}

function GraphicPanel({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="graphic-panel" aria-label={title}>
      <div className="graphic-panel-header">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      {children}
    </section>
  );
}

function BarChart({
  items,
  max,
  unit,
}: {
  items: { label: string; value: number }[];
  max: number;
  unit: string;
}) {
  return (
    <div className="bar-chart">
      {items.map((item) => (
        <div className="bar-row" key={item.label}>
          <div className="bar-row-label">
            <span>{item.label}</span>
            <strong>{item.value} {unit}</strong>
          </div>
          <div className="bar-track" aria-hidden="true">
            <div className="bar-fill" style={{ width: barWidth(item.value, max) }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FunnelChart({
  items,
}: {
  items: { label: string; note: string; value: number }[];
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="funnel-chart">
      {items.map((item) => (
        <div className="funnel-step" key={item.label}>
          <div className="funnel-bar" aria-hidden="true" style={{ width: barWidth(item.value, max) }} />
          <div className="funnel-copy">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            <small>{item.note}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineChart({ initiatives }: { initiatives: StrategicInitiativeListItem[] }) {
  return (
    <div className="timeline-chart">
      {initiatives.map((initiative) => (
        <div className="timeline-item" key={initiative.id}>
          <span>{initiative.year}</span>
          <strong>{initiative.title}</strong>
          <small>{initiative.department.code}</small>
        </div>
      ))}
    </div>
  );
}

function ModuleLoading() {
  return (
    <div className="trend-state trend-state-loading" aria-busy="true">
      <RefreshCw size={22} strokeWidth={2} aria-hidden="true" />
      <strong>Загружаем опубликованные PDF seed данные</strong>
    </div>
  );
}

function ModuleError({ error }: { error: string }) {
  return (
    <div className="trend-state trend-state-error" role="alert">
      <AlertCircle size={22} strokeWidth={2} aria-hidden="true" />
      <strong>Раздел недоступен</strong>
      <span>{error}</span>
    </div>
  );
}

export function ModulePage({ route }: { route: PortalRoute }) {
  const Icon = route.icon;
  const [dataState, setDataState] = useState<ModuleDataState>({
    error: null,
    initiatives: [],
    status: 'loading',
    trends: [],
  });

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchTrends({}, controller.signal),
      fetchStrategicInitiatives(controller.signal),
    ])
      .then(([trends, initiatives]) => {
        setDataState({
          error: null,
          initiatives,
          status: 'success',
          trends,
        });
      })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) {
          setDataState({
            error: caught instanceof Error ? caught.message : 'Module data request failed.',
            initiatives: [],
            status: 'error',
            trends: [],
          });
        }
      });

    return () => controller.abort();
  }, []);

  const sortedTrends = useMemo(() => [...dataState.trends].sort(bySourceNumber), [dataState.trends]);
  const sortedInitiatives = useMemo(() => [...dataState.initiatives].sort(bySourceNumber), [dataState.initiatives]);
  const kpiRows = useMemo(
    () => buildDepartmentKpi(dataState.trends, dataState.initiatives),
    [dataState.initiatives, dataState.trends],
  );

  return (
    <section className="workspace" aria-labelledby="page-title">
      <div className="workspace-header">
        <div className="module-mark" aria-hidden="true">
          <Icon size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="section-kicker">{route.status}</p>
          <h1 id="page-title">{route.label}</h1>
        </div>
      </div>

      {dataState.status === 'loading' ? <ModuleLoading /> : null}
      {dataState.status === 'error' ? <ModuleError error={dataState.error} /> : null}
      {dataState.status === 'success' ? (
        <>
          {route.path === '/scoring' ? <ScoringModule trends={sortedTrends} /> : null}
          {route.path === '/pilots' ? <PilotsModule trends={sortedTrends} initiatives={sortedInitiatives} /> : null}
          {route.path === '/kpi' ? (
            <KpiModule trends={sortedTrends} initiatives={sortedInitiatives} kpiRows={kpiRows} />
          ) : null}
          {route.path === '/cases' ? <CasesModule initiatives={sortedInitiatives} trends={sortedTrends} /> : null}
          {route.path === '/my-trends' ? <MyTrendsModule trends={sortedTrends} initiatives={sortedInitiatives} /> : null}
        </>
      ) : null}
    </section>
  );
}

function ScoringModule({ trends }: { trends: TrendListItem[] }) {
  const departmentRows = buildTrendDepartmentRows(trends);

  return (
    <>
      <div className="summary-grid" aria-label="Сводка скоринга">
        <article className="summary-card">
          <span>Кандидаты из PDF</span>
          <strong>{trends.length} трендов</strong>
        </article>
        <article className="summary-card">
          <span>Факт скоринга</span>
          <strong>0 записей</strong>
        </article>
        <article className="summary-card">
          <span>Регламент</span>
          <strong>Будет опубликован позднее</strong>
        </article>
      </div>

      <div className="module-note">
        <AlertCircle size={20} strokeWidth={2} aria-hidden="true" />
        <span>
          ICE и ограничители показаны как draft-контур из backlog. Итоговые баллы не рассчитаны: PDF прямо
          фиксирует, что регламент скоринга и ограничения будут опубликованы позднее.
        </span>
      </div>

      <div className="graphics-grid" aria-label="Графики скоринга">
        <GraphicPanel title="Воронка скоринга" description="Факт не подменяется seed-кандидатами">
          <FunnelChart
            items={[
              { label: 'PDF кандидаты', note: 'опубликованы в Trend API', value: trends.length },
              { label: 'Оценено', note: 'нет Scoring записей', value: 0 },
              { label: 'Рекомендовано к пилоту', note: 'ожидает решения экспертов', value: 0 },
            ]}
          />
        </GraphicPanel>
        <GraphicPanel title="Кандидаты по подразделениям" description="По source traceability PDF">
          <BarChart items={departmentRows} max={Math.max(...departmentRows.map((row) => row.value), 1)} unit="трендов" />
        </GraphicPanel>
      </div>

      <div className="module-list" aria-label="Кандидаты на скоринг из PDF">
        {trends.map((trend) => (
          <article className="module-row" key={trend.id}>
            <div>
              <span className="trend-status trend-status-warning">Ожидает оценки #{sourceNumber(trend.sourceTrace)}</span>
              <h2>{trend.title}</h2>
              <p>{shortText(trend.description)}</p>
            </div>
            <dl className="trend-meta">
              <div>
                <dt>Подразделение</dt>
                <dd>{trendDepartment(trend)}</dd>
              </div>
              <div>
                <dt>Ответственный</dt>
                <dd>{trend.owner.displayName}</dd>
              </div>
              <div>
                <dt>Draft поля</dt>
                <dd>Impact / Confidence / Ease</dd>
              </div>
              <div>
                <dt>Ограничители</dt>
                <dd>ИБ / Архитектура / Данные</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}

function PilotsModule({
  initiatives,
  trends,
}: {
  initiatives: StrategicInitiativeListItem[];
  trends: TrendListItem[];
}) {
  const rapidInitiative = initiatives.find((initiative) => initiative.title.includes('Рапид'));
  const pilotInitiatives = rapidInitiative ? [rapidInitiative] : initiatives.slice(0, 1);

  return (
    <>
      <div className="summary-grid" aria-label="Сводка пилотов">
        <article className="summary-card">
          <span>Пилоты в системе</span>
          <strong>0 карточек</strong>
        </article>
        <article className="summary-card">
          <span>Кандидаты</span>
          <strong>{trends.length} seed трендов</strong>
        </article>
        <article className="summary-card">
          <span>KPI 2026</span>
          <strong>1 пилот на департамент</strong>
        </article>
      </div>

      <div className="module-note">
        <Rocket size={20} strokeWidth={2} aria-hidden="true" />
        <span>
          Здесь показаны кандидаты к оформлению пилота, а не запущенные пилоты. Фактические даты, LT/CT,
          критерии успеха и решения должны появиться после ручного создания пилотных карточек.
        </span>
      </div>

      <div className="graphics-grid" aria-label="Графики пилотов">
        <GraphicPanel title="Переход к пилотам" description="Показывает разрыв между seed-кандидатами и фактами">
          <FunnelChart
            items={[
              { label: 'Кандидаты к пилоту', note: 'technology seed', value: trends.length },
              { label: 'Карточки пилотов', note: 'пока не созданы', value: 0 },
              { label: 'Решения по итогам', note: 'нет завершенных пилотов', value: 0 },
            ]}
          />
        </GraphicPanel>
        <GraphicPanel title="Инициатива пилотного контура" description="Источник из PDF seed">
          <TimelineChart initiatives={pilotInitiatives} />
        </GraphicPanel>
      </div>

      {rapidInitiative ? (
        <article className="feature-panel">
          <span className="trend-status trend-status-info">Стратегическая инициатива #{sourceNumber(rapidInitiative.sourceTrace)}</span>
          <h2>{rapidInitiative.title}</h2>
          <p>Ответственный: {rapidInitiative.ownerName}. Период: {rapidInitiative.createdQuarter} / {rapidInitiative.year}.</p>
        </article>
      ) : null}

      <div className="module-list" aria-label="Кандидаты к пилотированию">
        {trends.slice(0, 6).map((trend) => (
          <article className="module-row compact" key={trend.id}>
            <div>
              <span className="trend-status trend-status-neutral">Нужна карточка пилота</span>
              <h2>{trend.title}</h2>
            </div>
            <dl className="trend-meta">
              <div>
                <dt>Подразделение</dt>
                <dd>{trendDepartment(trend)}</dd>
              </div>
              <div>
                <dt>Критерий успеха</dt>
                <dd>Не задан</dd>
              </div>
              <div>
                <dt>LT/CT</dt>
                <dd>Не измеряется</dd>
              </div>
              <div>
                <dt>Решение</dt>
                <dd>Не принято</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}

function KpiModule({
  initiatives,
  kpiRows,
  trends,
}: {
  initiatives: StrategicInitiativeListItem[];
  kpiRows: ReturnType<typeof buildDepartmentKpi>;
  trends: TrendListItem[];
}) {
  const seedCoverageRows = kpiRows.map((row) => ({
    label: row.department,
    value: row.candidateTrendCount + row.initiativeCount,
  }));

  return (
    <>
      <div className="summary-grid" aria-label="Сводка KPI">
        <article className="summary-card">
          <span>Seed тренды к скорингу</span>
          <strong>{trends.length}</strong>
        </article>
        <article className="summary-card">
          <span>Стратегические инициативы</span>
          <strong>{initiatives.length}</strong>
        </article>
        <article className="summary-card">
          <span>Фактические score/pilot записи</span>
          <strong>0 / 0</strong>
        </article>
      </div>

      <div className="graphics-grid" aria-label="Графики KPI">
        <GraphicPanel title="Факт скоринга к цели" description="Цель: 3 оценки на подразделение за квартал">
          <BarChart
            items={kpiRows.map((row) => ({ label: row.department, value: row.scoringTarget - row.missingScoringCount }))}
            max={3}
            unit="из 3"
          />
        </GraphicPanel>
        <GraphicPanel title="Seed-покрытие по подразделениям" description="Тренды и инициативы из PDF">
          <BarChart
            items={seedCoverageRows}
            max={Math.max(...seedCoverageRows.map((row) => row.value), 1)}
            unit="записей"
          />
        </GraphicPanel>
      </div>

      <div className="module-table" role="table" aria-label="KPI по подразделениям">
        <div className="module-table-row module-table-head" role="row">
          <span role="columnheader">Подразделение</span>
          <span role="columnheader">Цель скоринга Q2</span>
          <span role="columnheader">Seed кандидаты</span>
          <span role="columnheader">Факт скоринга</span>
          <span role="columnheader">Пилот</span>
        </div>
        {kpiRows.map((row) => (
          <div className="module-table-row" role="row" key={row.department}>
            <span role="cell">{row.department}</span>
            <span role="cell">{row.scoringTarget} инновации</span>
            <span role="cell">{row.candidateTrendCount} трендов / {row.initiativeCount} инициатив</span>
            <span role="cell">0, требуется {row.missingScoringCount}</span>
            <span role="cell">Нет карточки</span>
          </div>
        ))}
      </div>

      <div className="module-note">
        <Target size={20} strokeWidth={2} aria-hidden="true" />
        <span>
          KPI-цели взяты из PDF traceability: не менее 3 скорингов на департамент в квартал и минимум один
          пилот актуального технологического тренда. Факты пока не подменяются seed-кандидатами.
        </span>
      </div>
    </>
  );
}

function CasesModule({
  initiatives,
  trends,
}: {
  initiatives: StrategicInitiativeListItem[];
  trends: TrendListItem[];
}) {
  const libraryInitiative = initiatives.find((initiative) => initiative.title.includes('Библиотека'));
  const initiativeRows = buildInitiativeDepartmentRows(initiatives);

  return (
    <>
      <div className="summary-grid" aria-label="Сводка кейсов">
        <article className="summary-card">
          <span>Апробированные кейсы</span>
          <strong>0</strong>
        </article>
        <article className="summary-card">
          <span>Инициатива библиотеки</span>
          <strong>{libraryInitiative ? `#${sourceNumber(libraryInitiative.sourceTrace)}` : 'Не найдена'}</strong>
        </article>
        <article className="summary-card">
          <span>Кандидаты после пилотов</span>
          <strong>{trends.length} трендов</strong>
        </article>
      </div>

      <div className="graphics-grid" aria-label="Графики кейсов">
        <GraphicPanel title="Воронка кейсов" description="Кейс появляется только после пилота и измеренного эффекта">
          <FunnelChart
            items={[
              { label: 'Стратегические инициативы', note: 'PDF seed', value: initiatives.length },
              { label: 'Завершенные пилоты', note: 'нет фактических карточек', value: 0 },
              { label: 'Апробированные кейсы', note: 'ожидают подтвержденного эффекта', value: 0 },
            ]}
          />
        </GraphicPanel>
        <GraphicPanel title="Инициативы по подразделениям" description="Источник: StrategicInitiative API">
          <BarChart items={initiativeRows} max={Math.max(...initiativeRows.map((row) => row.value), 1)} unit="инициатив" />
        </GraphicPanel>
      </div>

      {libraryInitiative ? (
        <article className="feature-panel">
          <span className="trend-status trend-status-info">PDF seed</span>
          <h2>{libraryInitiative.title}</h2>
          <p>
            Ответственный: {libraryInitiative.ownerName}. Подразделение: {libraryInitiative.department.name}.
            Год: {libraryInitiative.year}.
          </p>
        </article>
      ) : null}

      <div className="module-note">
        <BookOpen size={20} strokeWidth={2} aria-hidden="true" />
        <span>
          Проверенных бизнес-кейсов в базе еще нет. Раздел показывает подготовленную инициативу библиотеки и
          ожидает пилоты с фактическим эффектом, ограничениями и решением о повторном применении.
        </span>
      </div>
    </>
  );
}

function MyTrendsModule({
  initiatives,
  trends,
}: {
  initiatives: StrategicInitiativeListItem[];
  trends: TrendListItem[];
}) {
  const employeeValueInitiatives = initiatives.filter((initiative) =>
    ['Обучение', 'поощрения', 'PR инновационной культуры'].some((fragment) => initiative.title.includes(fragment)),
  );
  const myTrendRows = buildTrendDepartmentRows(trends);

  return (
    <>
      <div className="summary-grid" aria-label="Персональная сводка">
        <article className="summary-card">
          <span>Профиль</span>
          <strong>Локальный MVP actor</strong>
        </article>
        <article className="summary-card">
          <span>Релевантные trend seed</span>
          <strong>{trends.length} technology</strong>
        </article>
        <article className="summary-card">
          <span>Идеи сотрудника</span>
          <strong>Нет записей</strong>
        </article>
      </div>

      <div className="module-note">
        <UserRound size={20} strokeWidth={2} aria-hidden="true" />
        <span>
          Персональный профиль и подписки еще не заведены в API, поэтому страница показывает общий technology
          seed-набор и инициативы, которые прямо связаны с обучением, поощрением и инновационной культурой.
        </span>
      </div>

      <div className="graphics-grid" aria-label="Графики личной страницы">
        <GraphicPanel title="Персональная воронка" description="Факты по идеям и пилотам еще не заведены">
          <FunnelChart
            items={[
              { label: 'Релевантные technology seed', note: 'общий набор до профиля', value: trends.length },
              { label: 'Employee value инициативы', note: 'обучение, поощрение, культура', value: employeeValueInitiatives.length },
              { label: 'Мои идеи', note: 'нет записей сотрудника', value: 0 },
              { label: 'Открытые пилоты', note: 'нет карточек пилотов', value: 0 },
            ]}
          />
        </GraphicPanel>
        <GraphicPanel title="Тренды вокруг моего контура" description="До персональных подписок используется seed-распределение">
          <BarChart items={myTrendRows} max={Math.max(...myTrendRows.map((row) => row.value), 1)} unit="трендов" />
        </GraphicPanel>
      </div>

      <div className="module-list" aria-label="Мои релевантные тренды">
        {trends.slice(0, 5).map((trend) => (
          <article className="module-row compact" key={trend.id}>
            <div>
              <span className="trend-status trend-status-info">Technology #{sourceNumber(trend.sourceTrace)}</span>
              <h2>{trend.title}</h2>
            </div>
            <dl className="trend-meta">
              <div>
                <dt>Что значит для сотрудника</dt>
                <dd>Нужна экспертная интерпретация</dd>
              </div>
              <div>
                <dt>Открытый пилот</dt>
                <dd>Нет карточки</dd>
              </div>
              <div>
                <dt>Навыки</dt>
                <dd>Не сопоставлены</dd>
              </div>
              <div>
                <dt>Владелец</dt>
                <dd>{trend.owner.displayName}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      {employeeValueInitiatives.length > 0 ? (
        <div className="module-action-strip" aria-label="Инициативы личной пользы">
          {employeeValueInitiatives.map((initiative) => (
            <article key={initiative.id}>
              <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" />
              <strong>{initiative.title}</strong>
              <span>{initiative.ownerName}</span>
            </article>
          ))}
        </div>
      ) : null}

      <div className="module-table" role="table" aria-label="Статус моей идеи">
        <div className="module-table-row module-table-head" role="row">
          <span role="columnheader">Идея</span>
          <span role="columnheader">Статус</span>
          <span role="columnheader">SLA обратной связи</span>
          <span role="columnheader">Следующий шаг</span>
        </div>
        <div className="module-table-row" role="row">
          <span role="cell">Нет созданных идей</span>
          <span role="cell">Не применимо</span>
          <span role="cell">Не запущен</span>
          <span role="cell">Нужен workflow TR-074/TR-075</span>
        </div>
      </div>
    </>
  );
}
