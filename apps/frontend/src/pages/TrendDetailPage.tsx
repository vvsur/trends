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

type SourceTrace = {
  imported_from_dataset?: string;
  review_status?: string;
  source_contract?: string;
  source_hash?: string;
  source_kind?: string;
  source_number?: number | string;
  source_pdf?: string;
  source_raw_text?: string;
  source_row_key?: string;
  source_section?: string;
  version?: number;
};

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function readSourceTrace(sourceTrace: unknown): SourceTrace | null {
  if (!sourceTrace || typeof sourceTrace !== 'object') {
    return null;
  }

  return sourceTrace;
}

function formatSourceNumber(sourceTrace: SourceTrace) {
  return sourceTrace.source_number === undefined ? 'PDF' : `#${String(sourceTrace.source_number)}`;
}

function formatHash(value: string | undefined) {
  return value ? `${value.slice(0, 10)}…${value.slice(-8)}` : 'Не указан';
}

function formatReviewStatus(value: string | undefined) {
  if (value === 'pending') {
    return 'Ожидает review';
  }

  if (value === 'approved') {
    return 'Подтверждено';
  }

  if (value === 'rejected') {
    return 'Отклонено';
  }

  if (value === 'corrected') {
    return 'Исправлено вручную';
  }

  return value ?? 'Не указан';
}

function SourceTraceCard({ sourceTrace }: { sourceTrace: unknown }) {
  const trace = readSourceTrace(sourceTrace);

  if (!trace) {
    return (
      <article className="source-trace-card">
        <div className="source-trace-card-header">
          <Link2 size={20} strokeWidth={2} aria-hidden="true" />
          <div>
            <strong>Source traceability</strong>
            <span>Не назначена</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="source-trace-card">
      <div className="source-trace-card-header">
        <Link2 size={20} strokeWidth={2} aria-hidden="true" />
        <div>
          <strong>Source traceability</strong>
          <span>{trace.source_section ?? 'PDF seed source'}</span>
        </div>
        <span className="trend-status trend-status-info">{formatSourceNumber(trace)}</span>
      </div>

      <dl className="source-trace-grid">
        <div>
          <dt>Источник</dt>
          <dd>{trace.source_kind ?? 'Не указан'}</dd>
        </div>
        <div>
          <dt>Review</dt>
          <dd>{formatReviewStatus(trace.review_status)}</dd>
        </div>
        <div>
          <dt>Dataset</dt>
          <dd>{trace.imported_from_dataset ?? 'Не указан'}</dd>
        </div>
        <div>
          <dt>Row key</dt>
          <dd>{trace.source_row_key ?? 'Не указан'}</dd>
        </div>
        <div>
          <dt>PDF</dt>
          <dd>{trace.source_pdf ?? 'Не указан'}</dd>
        </div>
        <div>
          <dt>Raw text</dt>
          <dd>{trace.source_raw_text ?? 'Не указан'}</dd>
        </div>
        <div>
          <dt>Contract</dt>
          <dd>{trace.source_contract ?? 'Не указан'}</dd>
        </div>
        <div>
          <dt>Hash</dt>
          <dd>{formatHash(trace.source_hash)}</dd>
        </div>
      </dl>
    </article>
  );
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
        <SourceTraceCard sourceTrace={trend.sourceTrace} />
      </div>
    </section>
  );
}
