import { AlertCircle, ArrowLeft, CalendarDays, Gauge, GitBranch, Link2, RefreshCw, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchTrend, type TrendDetailItem } from '../shared/api/trends';

type TrendDetailState =
  | {
      error: null;
      status: 'loading';
      trend: null;
    }
  | {
      error: null;
      status: 'success';
      trend: TrendDetailItem;
    }
  | {
      error: string;
      status: 'error';
      trend: null;
    };

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function sourceTraceText(sourceTrace: unknown) {
  if (!sourceTrace) {
    return 'Source traceability не назначена';
  }

  if (typeof sourceTrace === 'object') {
    return JSON.stringify(sourceTrace);
  }

  return String(sourceTrace);
}

function DetailEmptySection({ icon: Icon, title }: { icon: typeof Gauge; title: string }) {
  return (
    <article className="detail-empty-section">
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
      <strong>{title}</strong>
      <span>Нет связанных записей</span>
    </article>
  );
}

export function TrendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detailState, setDetailState] = useState<TrendDetailState>({
    error: null,
    status: 'loading',
    trend: null,
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller = new AbortController();

    fetchTrend(id, controller.signal)
      .then((trend) => {
        setDetailState({
          error: null,
          status: 'success',
          trend,
        });
      })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) {
          setDetailState({
            error: caught instanceof Error ? caught.message : 'Trend detail request failed.',
            status: 'error',
            trend: null,
          });
        }
      });

    return () => controller.abort();
  }, [id]);

  if (!id) {
    return (
      <section className="workspace trend-detail-page" aria-labelledby="page-title">
        <Link className="back-link" to="/trends">
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
          К списку
        </Link>
        <div className="trend-state trend-state-error" role="alert">
          <AlertCircle size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Карточка недоступна</strong>
          <span>Trend id is missing.</span>
        </div>
      </section>
    );
  }

  if (detailState.status === 'loading') {
    return (
      <section className="workspace trend-detail-page" aria-labelledby="page-title">
        <Link className="back-link" to="/trends">
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
          К списку
        </Link>
        <div className="trend-state trend-state-loading" aria-busy="true">
          <RefreshCw size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Загружаем карточку тренда</strong>
        </div>
      </section>
    );
  }

  if (detailState.status === 'error') {
    return (
      <section className="workspace trend-detail-page" aria-labelledby="page-title">
        <Link className="back-link" to="/trends">
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
          К списку
        </Link>
        <div className="trend-state trend-state-error" role="alert">
          <AlertCircle size={22} strokeWidth={2} aria-hidden="true" />
          <strong>Карточка недоступна</strong>
          <span>{detailState.error}</span>
        </div>
      </section>
    );
  }

  const { trend } = detailState;

  return (
    <section className="workspace trend-detail-page" aria-labelledby="page-title">
      <Link className="back-link" to="/trends">
        <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        К списку
      </Link>

      <div className="trend-detail-hero">
        <span className="trend-status trend-status-info">{trend.status.name}</span>
        <div>
          <p className="section-kicker">{trend.domain.name}</p>
          <h1 id="page-title">{trend.title}</h1>
        </div>
        <p>{trend.description}</p>
      </div>

      <dl className="detail-metrics">
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

      <div className="detail-sections">
        <DetailEmptySection icon={GitBranch} title="Связанные инновации" />
        <DetailEmptySection icon={GitBranch} title="Связанные пилоты" />
        <DetailEmptySection icon={Gauge} title="Метрики" />
        <article className="detail-empty-section">
          <Link2 size={20} strokeWidth={2} aria-hidden="true" />
          <strong>Source traceability</strong>
          <span>{sourceTraceText(trend.sourceTrace)}</span>
        </article>
      </div>
    </section>
  );
}
