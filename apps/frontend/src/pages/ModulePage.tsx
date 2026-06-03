import type { PortalRoute } from '../routes';

export function ModulePage({ route }: { route: PortalRoute }) {
  const Icon = route.icon;

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

      <div className="summary-grid" aria-label="Сводка раздела">
        <article className="summary-card">
          <span>Контур</span>
          <strong>{route.metric}</strong>
        </article>
        <article className="summary-card">
          <span>Данные</span>
          <strong>Audit ready</strong>
        </article>
        <article className="summary-card">
          <span>Режим</span>
          <strong>Manual first</strong>
        </article>
      </div>

      <div className="work-surface">
        <div className="surface-row">
          <span>Owner</span>
          <strong>Назначается через RBAC</strong>
        </div>
        <div className="surface-row">
          <span>Traceability</span>
          <strong>Source fields required</strong>
        </div>
        <div className="surface-row">
          <span>Next step</span>
          <strong>Skeleton API contract</strong>
        </div>
      </div>
    </section>
  );
}
