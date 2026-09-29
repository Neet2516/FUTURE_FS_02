import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { EditorialCard, EditorialCardHeader, EditorialCardBody } from '../components/editorial/EditorialCard';
import { StatBlock } from '../components/editorial/StatBlock';
import { SectionHeader } from '../components/editorial/SectionHeader';
import { NewsTicker } from '../components/editorial/NewsTicker';
import { LoadingState } from '../components/common/LoadingState';
import {
  ArrowUpRight,
  Award,
  PhoneCall,
  Mail,
  Calendar,
  FileText,
  TrendingUp,
  Flame,
  CheckSquare,
  Users,
  Clock,
  Briefcase,
} from 'lucide-react';

export function DashboardPage({ onNavigate, onQuickAdd }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingState message="Compiling Front Page edition & pipeline figures..." />;

  if (error || !stats) {
    return (
      <div className="p-8 border-2 border-foreground bg-newsprint text-center shadow-hard">
        <h3 className="font-display font-bold text-2xl text-foreground mb-2">
          Unable to Load Dispatch
        </h3>
        <p className="font-body text-neutral-600 mb-4">{error || 'Could not fetch dashboard data'}</p>
        <EditorialButton variant="primary" onClick={fetchStats}>
          Retry Query
        </EditorialButton>
      </div>
    );
  }

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return <PhoneCall className="w-3.5 h-3.5 text-foreground" />;
      case 'Email': return <Mail className="w-3.5 h-3.5 text-foreground" />;
      case 'Meeting': return <Calendar className="w-3.5 h-3.5 text-foreground" />;
      case 'Stage Change': return <Award className="w-3.5 h-3.5 text-accent" />;
      default: return <FileText className="w-3.5 h-3.5 text-foreground" />;
    }
  };

  const maxStageValue = Math.max(...stats.stage_breakdown.map((s) => s.value), 1);

  // Ticker items from recent activities and metrics
  const tickerItems = [
    `TOTAL PIPELINE: ${formatCurrency(stats.total_pipeline_value)}`,
    `ACTIVE OPPORTUNITIES: ${stats.active_deals_count} DEALS`,
    `WIN RATIO: ${stats.win_rate_percentage}% CONFIRMED`,
    `WON REVENUE: ${stats.won_deals_count} CLOSED DEALS`,
    `CLIENT DIRECTORY: ${stats.total_contacts_count} CONTACTS`,
    `PENDING REMINDERS: ${stats.pending_tasks_count} ACTION ITEMS`,
  ];

  return (
    <div className="space-y-8">
      {/* 1. Breaking News Ticker */}
      <NewsTicker items={tickerItems} />

      {/* 2. Lead Article / Hero Pipeline Overview */}
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
                Commercial negotiations remain resilient across <strong>{stats.active_deals_count} active opportunities</strong> currently progressing through the sales funnel. Win conversion stands at <strong>{stats.win_rate_percentage}%</strong> across all qualified opportunities.
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
              <EditorialButton
                variant="secondary"
                size="md"
                onClick={onQuickAdd}
              >
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
                  sublabel="Verified entries"
                  onClick={() => onNavigate('contacts')}
                />
                <StatBlock
                  label="PENDING TO-DO"
                  value={stats.pending_tasks_count}
                  sublabel={`${stats.completed_tasks_count} completed`}
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

            <div className="p-3 border border-dashed border-foreground/40 bg-newsprint text-xs font-body text-neutral-600">
              <strong className="font-ui uppercase tracking-wider text-foreground">Editor's Memo:</strong> Deal progression velocity is tracked in real-time. Review stagnant negotiations in the pipeline room.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Editorial Two-Column Dispatch: Deal Flow vs Activity Record */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Deal Flow by Stage (7 cols) */}
        <div className="lg:col-span-7">
          <SectionHeader
            number={1}
            title="Deal Flow Distribution"
            subtitle="Volume and monetary exposure across all seven pipeline stages"
            action={
              <EditorialButton
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('pipeline')}
              >
                View Kanban →
              </EditorialButton>
            }
          />

          <EditorialCard className="p-6">
            <div className="space-y-4">
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
                        <span className={isWon ? 'text-foreground font-black' : isLost ? 'text-neutral-500' : 'text-foreground'}>
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

                    {/* Editorial Progress Bar */}
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
          </EditorialCard>
        </div>

        {/* Activity Log / Dispatch Wire (5 cols) */}
        <div className="lg:col-span-5">
          <SectionHeader
            number={2}
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
                      <span className="font-data text-[10px] text-neutral-500">
                        {act.created_at.split('T')[0] || act.created_at.split(' ')[0]}
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
  );
}
