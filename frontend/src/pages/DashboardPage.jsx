import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import { BentoGrid, BentoGridItem } from '../components/ui/AceternityBentoGrid';
import { CardSpotlight } from '../components/ui/AceternityCardSpotlight';
import { WobblyCard } from '../components/ui/WobblyCard';
import { WobblyButton } from '../components/ui/WobblyButton';
import { WobblyBadge } from '../components/ui/WobblyBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ScribbleUnderline, RoughCircle } from '../components/ui/SketchAnnotation';
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckSquare,
  Award,
  ArrowUpRight,
  Activity,
  Flame,
  Clock,
  Sparkles,
  PhoneCall,
  Mail,
  Calendar,
  FileText,
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

  if (loading) return <LoadingState message="Summing up the ledger & calculating pipeline..." />;

  if (error || !stats) {
    return (
      <div className="p-8 border-2 border-ink wobbly bg-rose-50 text-center shadow-hard">
        <h3 className="font-heading font-bold text-2xl text-rose-950 mb-2">Error Loading Dashboard</h3>
        <p className="font-body text-rose-800 mb-4">{error || 'Could not fetch stats'}</p>
        <WobblyButton variant="primary" onClick={fetchStats}>Retry</WobblyButton>
      </div>
    );
  }

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return <PhoneCall className="w-4 h-4 text-emerald-700" />;
      case 'Email': return <Mail className="w-4 h-4 text-blue-700" />;
      case 'Meeting': return <Calendar className="w-4 h-4 text-amber-700" />;
      case 'Stage Change': return <Award className="w-4 h-4 text-accent-red" />;
      default: return <FileText className="w-4 h-4 text-ink" />;
    }
  };

  // Find max value in stage breakdown for relative bar widths
  const maxStageValue = Math.max(...stats.stage_breakdown.map(s => s.value), 1);

  return (
    <div className="space-y-8">
      {/* 1. Hero Bento Grid */}
      <BentoGrid>
        {/* Bento 1: Total Pipeline Value (Large Spotlight) */}
        <BentoGridItem
          className="md:col-span-2 bg-[#fdfbf7]"
          header={
            <CardSpotlight className="p-6 bg-[#fffdfa] border-none shadow-none">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="font-heading font-bold text-sm uppercase tracking-wider text-ink/70">
                  Total Active Pipeline
                </span>
                <WobblyBadge variant="green" size="sm">
                  +18.4% This Month
                </WobblyBadge>
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className="text-4xl sm:text-6xl font-heading font-bold text-ink">
                  {formatCurrency(stats.total_pipeline_value)}
                </span>
              </div>

              <p className="font-body text-base text-ink/75 mt-2">
                Across <RoughCircle color="#ff4d4d"><b>{stats.active_deals_count} active opportunities</b></RoughCircle> currently progressing in your sales funnel.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <WobblyButton
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('pipeline')}
                >
                  <span>Open Pipeline Kanban</span>
                  <ArrowUpRight className="w-4 h-4" />
                </WobblyButton>
                <WobblyButton
                  variant="secondary"
                  size="sm"
                  onClick={onQuickAdd}
                >
                  + Add Deal
                </WobblyButton>
              </div>
            </CardSpotlight>
          }
        />

        {/* Bento 2: Win Rate Stamp */}
        <BentoGridItem
          className="bg-postit-yellow/90 md:col-span-1 -rotate-[0.5deg]"
          header={
            <div className="p-4 text-center">
              <div className="w-14 h-14 mx-auto mb-3 border-2 border-ink rounded-full bg-paper flex items-center justify-center shadow-hard-sm rotate-6">
                <Award className="w-8 h-8 text-accent-red" />
              </div>
              <span className="font-heading font-bold text-xs uppercase tracking-widest text-ink/70">
                Win Rate
              </span>
              <div className="text-5xl font-heading font-bold text-ink my-1">
                {stats.win_rate_percentage}%
              </div>
              <p className="font-body text-sm text-ink/80">
                {stats.won_deals_count} Closed Won Deals
              </p>
            </div>
          }
        />

        {/* Bento 3: Total Contacts */}
        <BentoGridItem
          className="md:col-span-1 rotate-[0.5deg]"
          header={
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-ink/70">
                  Total Contacts
                </span>
                <Users className="w-5 h-5 text-secondary-blue" />
              </div>
              <div className="text-4xl font-heading font-bold text-ink">
                {stats.total_contacts_count}
              </div>
              <p className="font-body text-sm text-ink/70 mt-1">
                Leads, clients & partners
              </p>
            </div>
          }
          onClick={() => onNavigate('contacts')}
        />

        {/* Bento 4: Tasks Pending */}
        <BentoGridItem
          className="md:col-span-1 -rotate-[0.5deg]"
          header={
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-ink/70">
                  Sticky Notes To-Do
                </span>
                <CheckSquare className="w-5 h-5 text-accent-red" />
              </div>
              <div className="text-4xl font-heading font-bold text-ink">
                {stats.pending_tasks_count}
              </div>
              <p className="font-body text-sm text-ink/70 mt-1">
                {stats.completed_tasks_count} completed this week
              </p>
            </div>
          }
          onClick={() => onNavigate('tasks')}
        />

        {/* Bento 5: Quick Notes / System Health */}
        <BentoGridItem
          className="md:col-span-1 bg-[#f5f1e8]"
          header={
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-ink/70">
                  Rust Axum Engine
                </span>
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-xl font-heading font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Healthy & Active</span>
              </div>
              <p className="font-body text-sm text-ink/70 mt-1">
                Sub-millisecond SQLite WAL queries
              </p>
            </div>
          }
        />
      </BentoGrid>

      {/* 2. Pipeline Stage Distribution & Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hand-Drawn Pipeline Funnel */}
        <WobblyCard withTape tapeColor="yellow" className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-4 mb-5">
            <div>
              <h3 className="text-2xl font-heading font-bold text-ink">
                Deal Flow by Stage
              </h3>
              <p className="text-sm font-body text-ink/70">
                Visual pipeline breakdown across all 7 deal stages
              </p>
            </div>
            <WobblyButton
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('pipeline')}
            >
              View Kanban Board
            </WobblyButton>
          </div>

          {/* Hand-drawn Stage Bars */}
          <div className="space-y-4">
            {stats.stage_breakdown.map((item) => {
              const pct = Math.round((item.value / maxStageValue) * 100);
              const isWon = item.stage === 'Won';
              const isLost = item.stage === 'Lost';

              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm font-heading font-bold">
                    <span className="flex items-center gap-2">
                      <span className={isWon ? 'text-emerald-700' : isLost ? 'text-rose-700' : 'text-ink'}>
                        {item.stage}
                      </span>
                      <span className="text-xs px-1.5 py-0.2 bg-paper border border-ink wobbly-badge font-body text-ink/80">
                        {item.count} {item.count === 1 ? 'deal' : 'deals'}
                      </span>
                    </span>
                    <span>{formatCurrency(item.value)}</span>
                  </div>

                  {/* Hand-drawn ink bar meter */}
                  <div className="w-full h-4 bg-muted-paper/40 border-2 border-ink wobbly-sm overflow-hidden p-0.5">
                    <div
                      className={`h-full border-r-2 border-ink transition-all duration-500 ${
                        isWon
                          ? 'bg-emerald-400'
                          : isLost
                          ? 'bg-rose-300'
                          : 'bg-postit-yellow'
                      }`}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </WobblyCard>

        {/* Right 1 Col: Recent Activities Log */}
        <WobblyCard withTape tapeColor="pink" className="p-6">
          <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-4 mb-4">
            <h3 className="text-2xl font-heading font-bold text-ink flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary-blue" />
              <span>Activity Log</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('activity')}
              className="text-xs font-heading font-bold text-secondary-blue hover:underline"
            >
              All →
            </button>
          </div>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {stats.recent_activities.length === 0 ? (
              <p className="text-sm font-body text-ink/60 text-center py-6">
                No recent activity logged yet.
              </p>
            ) : (
              stats.recent_activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-paper border border-ink wobbly-sm shadow-hard-sm transition-transform hover:-translate-y-0.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="flex items-center gap-1.5 font-heading font-bold text-ink">
                      {getActivityIcon(act.activity_type)}
                      <span>{act.activity_type}</span>
                    </span>
                    <span className="text-[10px] text-ink/60 font-body">
                      {act.created_at.split('T')[0] || act.created_at.split(' ')[0]}
                    </span>
                  </div>
                  <p className="font-body text-sm text-ink/90 line-clamp-2">
                    {act.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </WobblyCard>
      </div>
    </div>
  );
}
