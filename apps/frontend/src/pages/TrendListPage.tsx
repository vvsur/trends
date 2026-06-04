import { AlertCircle, CalendarDays, Filter, RefreshCw, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchTrends, type TrendListFilters, type TrendListItem } from '../shared/api/trends';

const domainOptions = [
  { label: 'Все домены', value: '' },
  { label: 'Технологии', value: 'technology' },
] as const;

const statusOptions = [
  { label: 'Все статусы', value: '' },
  { label: 'Черновик', value: 'draft' },
  { label: 'На проверке', value: 'in_review' },
  { label: 'Опубликован', value: 'published' },
  { label: 'Архив', value: 'archived' },
] as const;

const ownerOptions = [
  { label: 'Все владельцы', value: '' },
  { label: 'Local Admin', value: 'user-local-admin' },
] as const;

const departmentOptions = [
  { label: 'Все подразделения', value: '' },
  { label: 'ITG', value: 'department-itg' },
  { label: 'КСС', value: 'department-kss' },
  { label: 'TKC', value: 'department-tkc' },
] as const;

type TrendListState =
  | {
      error: null;
      key: string;
      status: 'loading';
      trends: TrendListItem[];
    }
  | {
      error: null;
      key: string;
      status: 'success';
      trends: TrendListItem[];
    }
  | {
      error: string;
      key: string;
      status: 'error';
      trends: TrendListItem[];
    };

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function readFilters(params: URLSearchParams): TrendListFilters {
  return {
    departmentId: params.get('departmentId') ?? undefined,
    domainCode: params.get('domainCode') ?? undefined,
    ownerId: params.get('ownerId') ?? undefined,
    statusCode: params.get('statusCode') ?? undefined,
  };
}

function setFilterParam(params: URLSearchParams, key: keyof TrendListFilters, value: string) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

function statusClassName(statusCode: string) {
  if (statusCode === 'published') {
    return 'trend-status trend-status-positive';
  }

  if (statusCode === 'in_review') {
    return 'trend-status trend-status-warning';
  }

  if (statusCode === 'archived') {
    return 'trend-status trend-status-neutral';
  }

  return 'trend-status trend-status-info';
}

export function TrendListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const filtersKey = searchParams.toString();
  const [listState, setListState] = useState<TrendListState>({
    error: null,
    key: '',
    status: 'loading',
    trends: [],
  });
  const isLoading = listState.key !== filtersKey || listState.status === 'loading';
  const trends = listState.trends;
  const error = listState.key === filtersKey && listState.status === 'error' ? listState.error : null;

  useEffect(() => {
    const controller = new AbortController();

    fetchTrends(filters, controller.signal)
      .then((items) => {
        setListState({
          error: null,
          key: filtersKey,
          status: 'success',
          trends: items,
        });
      })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) {
          setListState({
            error: caught instanceof Error ? caught.message : 'Trend list request failed.',
            key: filtersKey,
            status: 'error',
            trends: [],
          });
        }
      });

    return () => controller.abort();
  }, [filters, filtersKey]);

  const updateFilter = (key: keyof TrendListFilters, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    setFilterParam(nextParams, key, value);
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = Boolean(filters.domainCode || filters.statusCode || filters.ownerId || filters.departmentId);

  return (
    <section className="workspace trend-list-page" aria-labelledby="page-title">
      <div className="workspace-header trend-list-header">
        <div className="module-mark" aria-hidden="true">
          <Filter size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="section-kicker">technology</p>
          <h1 id="page-title">Техрадар</h1>
        </div>
      </div>

      <div className="trend-toolbar" aria-label="Фильтры списка трендов">
        <label>
          <span>Домен</span>
          <select value={filters.domainCode ?? ''} onChange={(event) => updateFilter('domainCode', event.target.value)}>
            {domainOptions.map((option) => (
              <option key={option.value || 'all-domains'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Статус</span>
          <select value={filters.statusCode ?? ''} onChange={(event) => updateFilter('statusCode', event.target.value)}>
            {statusOptions.map((option) => (
              <option key={option.value || 'all-statuses'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Владелец</span>
          <select value={filters.ownerId ?? ''} onChange={(event) => updateFilter('ownerId', event.target.value)}>
            {ownerOptions.map((option) => (
              <option key={option.value || 'all-owners'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Подразделение</span>
          <select value={filters.departmentId ?? ''} onChange={(event) => updateFilter('departmentId', event.target.value)}>
            {departmentOptions.map((option) => (
              <option key={option.value || 'all-departments'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button className="text-button text-button-neutral" type="button" disabled={!hasFilters} onClick={resetFilters}>
          <RefreshCw size={18} strokeWidth={2} aria-hidden="true" />
          Сбросить
        </button>
      </div>

      <div className="trend-list-summary" aria-live="polite">
        <span>{isLoading ? 'Загрузка' : `${trends.length} записей`}</span>
        <strong>Manual first</strong>
      </div>

      {isLoading ? (
        <div className="trend-state trend-state-loading" aria-busy="true">
          <RefreshCw size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Загружаем список трендов</strong>
        </div>
      ) : error ? (
        <div className="trend-state trend-state-error" role="alert">
          <AlertCircle size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Список недоступен</strong>
          <span>{error.includes('401') || error.includes('403') ? 'Недостаточно прав для просмотра.' : 'Backend API не ответил корректно.'}</span>
        </div>
      ) : trends.length === 0 ? (
        <div className="trend-state">
          <Filter size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Нет трендов по выбранным фильтрам</strong>
        </div>
      ) : (
        <div className="trend-list" aria-label="Список трендов">
          {trends.map((trend) => (
            <article className="trend-row" key={trend.id}>
              <div className="trend-row-main">
                <span className={statusClassName(trend.status.code)}>{trend.status.name}</span>
                <h2>
                  <Link to={`/trends/${trend.id}`}>{trend.title}</Link>
                </h2>
                <p>{trend.description}</p>
              </div>

              <dl className="trend-meta">
                <div>
                  <dt>Домен</dt>
                  <dd>{trend.domain.name}</dd>
                </div>
                <div>
                  <dt>Зрелость</dt>
                  <dd>{trend.maturityRing.name}</dd>
                </div>
                <div>
                  <dt>Рекомендация</dt>
                  <dd>{trend.recommendation.name}</dd>
                </div>
                <div>
                  <dt>
                    <UserRound size={16} strokeWidth={2} aria-hidden="true" />
                    Владелец
                  </dt>
                  <dd>{trend.owner.displayName}</dd>
                </div>
                <div>
                  <dt>
                    <CalendarDays size={16} strokeWidth={2} aria-hidden="true" />
                    Review
                  </dt>
                  <dd>{formatDate(trend.reviewDate)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
