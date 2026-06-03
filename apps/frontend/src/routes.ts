import {
  BarChart3,
  BookOpen,
  Gauge,
  Lightbulb,
  Radar,
  Rocket,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type PortalRoute = {
  path: string;
  label: string;
  metric: string;
  status: string;
  icon: LucideIcon;
};

export const portalRoutes: PortalRoute[] = [
  { path: '/trends', label: 'Техрадар', metric: '10 трендов', status: 'technology', icon: Radar },
  { path: '/innovations', label: 'Реестр', metric: '17 инициатив', status: 'manual input', icon: Lightbulb },
  { path: '/scoring', label: 'Скоринг', metric: 'ICE draft', status: 'review', icon: Gauge },
  { path: '/pilots', label: 'Пилоты', metric: 'KPI 1.3', status: 'planned', icon: Rocket },
  { path: '/kpi', label: 'KPI', metric: '2026', status: 'value', icon: BarChart3 },
  { path: '/cases', label: 'Кейсы', metric: 'library', status: 'reuse', icon: BookOpen },
  { path: '/my-trends', label: 'Мои тренды', metric: 'employee', status: 'SLA', icon: UserRound },
];
