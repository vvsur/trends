import { AlertCircle, BookOpen, CalendarDays, RefreshCw, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchStrategicInitiatives, type StrategicInitiativeListItem } from '../shared/api/strategic-initiatives';

type InitiativeListState =
  | {
      error: null;
      status: 'loading';
      initiatives: StrategicInitiativeListItem[];
    }
  | {
      error: null;
      status: 'success';
      initiatives: StrategicInitiativeListItem[];
    }
  | {
      error: string;
      status: 'error';
      initiatives: StrategicInitiativeListItem[];
    };

function sourceNumber(value: unknown) {
  if (typeof value === 'object' && value && 'source_number' in value) {
    return String(value.source_number);
  }

  return 'PDF';
}

export function InitiativeListPage() {
  const [listState, setListState] = useState<InitiativeListState>({
    error: null,
    initiatives: [],
    status: 'loading',
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchStrategicInitiatives(controller.signal)
      .then((initiatives) => {
        setListState({
          error: null,
          initiatives,
          status: 'success',
        });
      })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) {
          setListState({
            error: caught instanceof Error ? caught.message : 'Strategic initiatives request failed.',
            initiatives: [],
            status: 'error',
          });
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="workspace initiative-list-page" aria-labelledby="page-title">
      <div className="workspace-header">
        <div className="module-mark" aria-hidden="true">
          <BookOpen size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="section-kicker">PDF seed</p>
          <h1 id="page-title">Реестр инициатив</h1>
        </div>
      </div>

      <div className="trend-list-summary" aria-live="polite">
        <span>{listState.status === 'loading' ? 'Загрузка' : `${listState.initiatives.length} инициатив`}</span>
        <strong>Source traceability</strong>
      </div>

      {listState.status === 'loading' ? (
        <div className="trend-state trend-state-loading" aria-busy="true">
          <RefreshCw size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Загружаем инициативы из PDF seed</strong>
        </div>
      ) : listState.status === 'error' ? (
        <div className="trend-state trend-state-error" role="alert">
          <AlertCircle size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Реестр недоступен</strong>
          <span>{listState.error}</span>
        </div>
      ) : listState.initiatives.length === 0 ? (
        <div className="trend-state">
          <BookOpen size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Инициативы ещё не опубликованы в БД</strong>
        </div>
      ) : (
        <div className="initiative-list" aria-label="Стратегические инициативы из PDF">
          {listState.initiatives.map((initiative) => (
            <article className="initiative-row" key={initiative.id}>
              <div className="initiative-row-main">
                <span className="trend-status trend-status-info">#{sourceNumber(initiative.sourceTrace)}</span>
                <h2>{initiative.title}</h2>
                {initiative.comment ? <p>{initiative.comment}</p> : null}
              </div>

              <dl className="trend-meta">
                <div>
                  <dt>Подразделение</dt>
                  <dd>{initiative.department.name}</dd>
                </div>
                <div>
                  <dt>
                    <CalendarDays size={16} strokeWidth={2} aria-hidden="true" />
                    Период
                  </dt>
                  <dd>{initiative.createdQuarter} / {initiative.year}</dd>
                </div>
                <div>
                  <dt>
                    <UserRound size={16} strokeWidth={2} aria-hidden="true" />
                    Ответственный
                  </dt>
                  <dd>{initiative.ownerName}</dd>
                </div>
                <div>
                  <dt>Traceability</dt>
                  <dd>{initiative.seedKey}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
