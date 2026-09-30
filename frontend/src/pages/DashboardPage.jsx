import React, { useEffect, useState, useMemo } from 'react';
import { dashboardApi, dealsApi, tasksApi, contactsApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { EditorialCard } from '../components/editorial/EditorialCard';
import { StatBlock } from '../components/editorial/StatBlock';
import { SectionHeader } from '../components/editorial/SectionHeader';
import { NewsTicker } from '../components/editorial/NewsTicker';
import { LoadingState } from '../components/common/LoadingState';
import { formatRelativeTime, formatCurrency, isOverdue, formatDate } from '../utils/format';
import { DonutBreakdownChart } from '../components/charts/DonutBreakdownChart';
import { PipelineFunnelChart } from '../components/charts/PipelineFunnelChart';
import { DealVelocityBarChart } from '../components/charts/DealVelocityBarChart';
import { WinRateGaugeChart } from '../components/charts/WinRateGaugeChart';
import {
  ArrowUpRight,
  Award,
  PhoneCall,
  Mail,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  User,
  Zap,
  CheckSquare,
  BarChart3,
  PieChart,
  Filter,
  Layers,
  TrendingUp,
} from 'lucide-react';

export function DashboardPage({ onNavigate, onQuickAdd }) {
  const [stats, setStats] = useState(null);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState('funnel');

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [statsData, dealsData, tasksData, contactsData] = await Promise.all([
        dashboardApi.getStats(),
        dealsApi.list(),
        tasksApi.list(),
        contactsApi.list(),
      ]);
      setStats(statsData);
      setDeals(dealsData);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Derive "Needs Attention" items from real data
  const needsAttention = useMemo(() => {
    const items = [];

    // Overdue tasks
    const overdueTasks = tasks.filter(
      (t) => !t.completed && t.due_date && isOverdue(t.due_date)
    );
    if (overdueTasks.length > 0) {
      items.push({
        type: 'overdue_tasks',
        severity: 'high',
        label: 'OVERDUE TASKS',
        headline: `${overdueTasks.length} task${overdueTasks.length > 1 ? 's' : ''} past due date`,
        detail: overdueTasks.slice(0, 2).map((t) => t.title).join(', '),
        action: () => onNavigate('tasks'),
        actionLabel: 'View Tasks →',
      });
    }

    // New contacts (status = "New") — need outreach
    const newContacts = contacts.filter((c) => c.status === 'New');
    if (newContacts.length > 0) {
      items.push({
        type: 'new_leads',
        severity: 'medium',
        label: 'NEW LEADS',
        headline: `${newContacts.length} uncontacted lead${newContacts.length > 1 ? 's' : ''} in queue`,
        detail: newContacts.slice(0, 2).map((c) => `${c.name} @ ${c.company}`).join('; '),
        action: () => onNavigate('contacts'),
        actionLabel: 'View Directory →',
      });
    }

    // Deals stuck in early stages (Lead In / Contact Made)
    const stuckDeals = deals.filter(
      (d) => d.stage === 'Lead In' || d.stage === 'Contact Made'
    );
    if (stuckDeals.length > 2) {
      items.push({
        type: 'stalled',
        severity: 'low',
        label: 'STALLED PIPELINE',
        headline: `${stuckDeals.length} deals stagnant in early stages`,
        detail: `${formatCurrency(stuckDeals.reduce((s, d) => s + (d.value || 0), 0))} in unadvanced negotiations`,
        action: () => onNavigate('pipeline'),
        actionLabel: 'Open Pipeline →',
      });
    }

    // Deals with expired close dates
    const expiredDeals = deals.filter(
      (d) => d.expected_close && isOverdue(d.expected_close) && !['Won', 'Lost'].includes(d.stage)
    );
    if (expiredDeals.length > 0) {
      items.push({
        type: 'expired_close',
        severity: 'high',
        label: 'EXPIRED TARGET DATES',
        headline: `${expiredDeals.length} deal${expiredDeals.length > 1 ? 's' : ''} past expected close`,
        detail: expiredDeals.slice(0, 2).map((d) => d.title).join(', '),
        action: () => onNavigate('pipeline'),
        actionLabel: 'Review Pipeline →',
      });
    }

    return items;
  }, [deals, tasks, contacts, onNavigate]);

  if (loading) return <LoadingState message="Compiling Front Page edition & pipeline figures..." />;

  if (error || !stats) {
    return (
      <div className="p-8 border-2 border-foreground bg-newsprint text-center shadow-hard">
        <h3 className="font-display font-bold text-2xl text-foreground mb-2">
          Unable to Load Dispatch
        </h3>
        <p className="font-body text-neutral-600 mb-4">{error || 'Could not fetch dashboard data'}</p>
        <EditorialButton variant="primary" onClick={fetchAll}>
          Retry Query
        </EditorialButton>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return <PhoneCall className="w-3.5 h-3.5 text-foreground" />;
      case 'Email': return <Mail className="w-3.5 h-3.5 text-foreground" />;
      case 'Meeting': return <Calendar className="w-3.5 h-3.5 text-foreground" />;
      case 'Stage Change': return <Award className="w-3.5 h-3.5 text-accent" />;
      default: return <FileText className="w-3.5 h-3.5 text-foreground" />;
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-4 border-l-accent bg-red-50/40';
      case 'medium': return 'border-l-4 border-l-foreground bg-neutral-50';
      default: return 'border-l-4 border-l-neutral-400 bg-newsprint';
    }
  };

  const maxStageValue = Math.max(...stats.stage_breakdown.map((s) => s.value), 1);

  const tickerItems = [
    `TOTAL PIPELINE: ${formatCurrency(stats.total_pipeline_value)}`,
    `ACTIVE OPPORTUNITIES: ${stats.active_deals_count} DEALS`,
    `WIN RATIO: ${stats.win_rate_percentage}% CONFIRMED`,
    `WON REVENUE: ${stats.won_deals_count} CLOSED DEALS`,
    `CLIENT DIRECTORY: ${stats.total_contacts_count} CONTACTS`,
    `PENDING REMINDERS: ${stats.pending_tasks_count} ACTION ITEMS`,
    ...(needsAttention.length > 0 ? [`⚠ NEEDS ATTENTION: ${needsAttention.length} ITEMS REQUIRE ACTION`] : []),
  ];

  return (
    <div className="space-y-8">
      {/* 1. Breaking News Ticker */}
      <NewsTicker items={tickerItems} />

      {/* 2. NEEDS ATTENTION — only shown when there are items */}
      {needsAttention.length > 0 && (
        <div>
          <SectionHeader
            number="⚠"
            title="Needs Attention"
            subtitle="Critical items requiring immediate action from the editorial desk"
          />
          <div className="border-2 border-foreground shadow-hard divide-y divide-foreground bg-newsprint">
            {needsAttention.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-neutral-100/50 ${getSeverityStyles(item.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      item.severity === 'high' ? 'text-accent' : 'text-neutral-600'
                    }`}
                  />
                  <div>
                    <span className="editorial-label text-neutral-500 block mb-0.5">
                      {item.label}
                    </span>
                    <p className="font-display font-bold text-base text-foreground leading-snug">
                      {item.headline}
                    </p>
                    {item.detail && (
                      <p className="font-body text-xs text-neutral-600 mt-0.5 line-clamp-1">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
                <EditorialButton variant="ghost" size="sm" onClick={item.action}>
                  {item.actionLabel}
                </EditorialButton>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Lead Article / Hero Pipeline Overview */}
      <div className="border-2 border-foreground bg-newsprint shadow-hard">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-foreground">
          {/* Main Headline Section (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <EditorialBadge variant="accent" size="sm">
                  LEAD REPORT
                </EditorialBadge>
                <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">
                  FISCAL CYCLE 2026-Q3
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[0.95] tracking-tight mb-4">
                Total Active Pipeline Reaches {formatCurrency(stats.total_pipeline_value)}
              </h2>

              <p className="font-body text-base sm:text-lg text-neutral-700 leading-relaxed max-w-xl">
                Commercial negotiations remain resilient across{' '}
                <strong>{stats.active_deals_count} active opportunities</strong> currently
                progressing through the sales funnel. Win conversion stands at{' '}
                <strong>{stats.win_rate_percentage}%</strong> across all qualified opportunities.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-300 flex flex-wrap items-center gap-4">
              <EditorialButton
                variant="primary"
                size="md"
                onClick={() => onNavigate('pipeline')}
              >
                <span>Examine Pipeline Board</span>
                <ArrowUpRight className="w-4 h-4" />
              </EditorialButton>
              <EditorialButton variant="secondary" size="md" onClick={onQuickAdd}>
                + File New Deal
              </EditorialButton>
            </div>
          </div>

          {/* Key Indicators Column (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-neutral-100/50 flex flex-col justify-between space-y-6">
            <div>
              <span className="editorial-label text-neutral-500 block mb-3">
                QUICK STATISTICAL LEDGER
              </span>

              <div className="grid grid-cols-2 gap-4">
                <StatBlock
                  label="WIN RATE"
                  value={`${stats.win_rate_percentage}%`}
                  sublabel={`${stats.won_deals_count} Closed Won`}
                  accent
                />
                <StatBlock
                  label="CONTACTS"
                  value={stats.total_contacts_count}
                  sublabel={`${contacts.filter(c => c.status === 'New').length} new uncontacted`}
                  onClick={() => onNavigate('contacts')}
                />
                <StatBlock
                  label="PENDING TO-DO"
                  value={stats.pending_tasks_count}
                  sublabel={`${tasks.filter(t => !t.completed && t.due_date && isOverdue(t.due_date)).length} overdue`}
                  onClick={() => onNavigate('tasks')}
                />
                <div className="p-4 border border-foreground bg-newsprint sharp-corners">
                  <span className="editorial-label text-neutral-500 block mb-1">
                    ENGINE HEALTH
                  </span>
                  <div className="font-display text-lg font-bold text-foreground flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 bg-foreground animate-pulse" />
                    <span>RUST AXUM</span>
                  </div>
                  <span className="data-label text-neutral-500 block mt-2">
                    Sub-ms PostgreSQL
                  </span>
                </div>
              </div>
            </div>

            {/* Urgent tasks preview */}
            {tasks.filter(t => !t.completed && t.priority === 'Urgent').length > 0 && (
              <div className="p-3 border border-dashed border-accent/60 bg-red-50/30">
                <span className="editorial-label text-accent block mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  URGENT QUEUE
                </span>
                {tasks
                  .filter(t => !t.completed && t.priority === 'Urgent')
                  .slice(0, 2)
                  .map((t) => (
                    <div key={t.id} className="flex items-center gap-2 mb-1">
                      <CheckSquare className="w-3 h-3 text-accent flex-shrink-0" />
                      <span className="font-body text-xs text-foreground line-clamp-1">{t.title}</span>
                    </div>
                  ))}
              </div>
            )}

            <div className="p-3 border border-dashed border-foreground/40 bg-newsprint text-xs font-body text-neutral-600">
              <strong className="font-ui uppercase tracking-wider text-foreground">Editor's Memo:</strong>{' '}
              Deal progression velocity is tracked in real-time. Review stagnant negotiations in the pipeline room.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Editorial Two-Column Dispatch: Deal Flow & Visual Analytics vs Activity Record */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Deal Flow & Visual Analytics (7 cols) */}
        <div className="lg:col-span-7">
          <SectionHeader
            number={1}
            title="Pipeline Visual Analytics & Conversion"
            subtitle="Interactive funnel, portfolio donut & capital exposure distribution"
            action={
              <div className="flex items-center gap-1 bg-neutral-200 p-0.5 border border-foreground">
                <button
                  type="button"
                  onClick={() => setActiveChartTab('funnel')}
                  className={`px-2.5 py-1 text-xs font-ui font-bold flex items-center gap-1.5 transition-all ${
                    activeChartTab === 'funnel'
                      ? 'bg-foreground text-newsprint shadow-sm'
                      : 'text-neutral-700 hover:text-foreground'
                  }`}
                  title="Conversion Funnel"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Funnel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveChartTab('donut')}
                  className={`px-2.5 py-1 text-xs font-ui font-bold flex items-center gap-1.5 transition-all ${
                    activeChartTab === 'donut'
                      ? 'bg-foreground text-newsprint shadow-sm'
                      : 'text-neutral-700 hover:text-foreground'
                  }`}
                  title="Portfolio Donut"
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Donut</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveChartTab('bars')}
                  className={`px-2.5 py-1 text-xs font-ui font-bold flex items-center gap-1.5 transition-all ${
                    activeChartTab === 'bars'
                      ? 'bg-foreground text-newsprint shadow-sm'
                      : 'text-neutral-700 hover:text-foreground'
                  }`}
                  title="Capital Columns"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Columns</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveChartTab('ledger')}
                  className={`px-2.5 py-1 text-xs font-ui font-bold flex items-center gap-1.5 transition-all ${
                    activeChartTab === 'ledger'
                      ? 'bg-foreground text-newsprint shadow-sm'
                      : 'text-neutral-700 hover:text-foreground'
                  }`}
                  title="Stage Ledger"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ledger</span>
                </button>
              </div>
            }
          />

          <EditorialCard className="p-2 sm:p-4 min-h-[380px] flex flex-col justify-center">
            {activeChartTab === 'funnel' && (
              <PipelineFunnelChart data={stats.stage_breakdown} />
            )}
            {activeChartTab === 'donut' && (
              <DonutBreakdownChart data={stats.stage_breakdown} />
            )}
            {activeChartTab === 'bars' && (
              <DealVelocityBarChart data={stats.stage_breakdown} />
            )}
            {activeChartTab === 'ledger' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
                  <span className="editorial-label text-neutral-500">
                    NUMERICAL STAGE LEDGER
                  </span>
                  <span className="font-data text-xs text-neutral-600">
                    Peak: {formatCurrency(maxStageValue)}
                  </span>
                </div>
                {stats.stage_breakdown.map((item, idx) => {
                  const pct = Math.round((item.value / maxStageValue) * 100);
                  const isWon = item.stage === 'Won';
                  const isLost = item.stage === 'Lost';

                  return (
                    <div key={item.stage} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-ui font-bold">
                        <div className="flex items-center gap-2">
                          <span className="font-data text-neutral-400">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={
                              isWon
                                ? 'text-foreground font-black'
                                : isLost
                                ? 'text-neutral-500'
                                : 'text-foreground'
                            }
                          >
                            {item.stage}
                          </span>
                          <EditorialBadge
                            variant={isWon ? 'accent' : 'default'}
                            size="xs"
                          >
                            {item.count} {item.count === 1 ? 'deal' : 'deals'}
                          </EditorialBadge>
                        </div>
                        <span className="font-data font-semibold text-foreground">
                          {formatCurrency(item.value)}
                        </span>
                      </div>

                      <div className="w-full h-3 bg-neutral-200 border border-foreground sharp-corners overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isWon
                              ? 'bg-accent'
                              : isLost
                              ? 'bg-neutral-400'
                              : 'bg-foreground'
                          }`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </EditorialCard>
        </div>

        {/* Efficiency Gauge & Chronological Wire (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <SectionHeader
              number={2}
              title="Win Velocity Gauge"
              subtitle="Closed won efficiency versus pipeline targets"
            />
            <EditorialCard className="p-2 sm:p-4">
              <WinRateGaugeChart
                winRate={stats.win_rate_percentage}
                wonCount={stats.won_deals_count}
                activeCount={stats.active_deals_count}
                totalPipeline={stats.total_pipeline_value}
              />
            </EditorialCard>
          </div>

          <div>
            <SectionHeader
              number={3}
              title="Chronological Wire"
              subtitle="Latest interactions, stage advancements & recorded dispatches"
              action={
                <EditorialButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('activity')}
                >
                  Full Archive →
                </EditorialButton>
              }
            />

            <EditorialCard className="p-0">
            <div className="divide-y divide-neutral-200 max-h-[440px] overflow-y-auto">
              {stats.recent_activities.length === 0 ? (
                <p className="p-6 text-sm font-body text-neutral-500 text-center">
                  No dispatches recorded in the current cycle.
                </p>
              ) : (
                stats.recent_activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 hover:bg-neutral-100/60 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {getActivityIcon(act.activity_type)}
                        <span className="font-ui text-xs font-bold uppercase tracking-wider text-foreground">
                          {act.activity_type}
                        </span>
                      </div>
                      <span className="font-data text-[10px] text-neutral-400 whitespace-nowrap">
                        {formatRelativeTime(act.created_at)}
                      </span>
                    </div>
                    <p className="font-body text-sm text-neutral-800 leading-snug line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </EditorialCard>
        </div>
      </div>
    </div>
    </div>
  );
}
