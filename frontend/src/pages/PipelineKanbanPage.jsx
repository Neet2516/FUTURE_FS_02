import React, { useEffect, useState } from 'react';
import { dealsApi, activitiesApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { SectionHeader } from '../components/editorial/SectionHeader';
import { LoadingState } from '../components/common/LoadingState';
import { useToast } from '../components/common/Toast';
import { formatCurrency, isOverdue, formatDate } from '../utils/format';
import { DonutBreakdownChart } from '../components/charts/DonutBreakdownChart';
import { PipelineFunnelChart } from '../components/charts/PipelineFunnelChart';
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Calendar,
  Building,
  User,
  AlertTriangle,
  Trash2,
  PieChart,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STAGES = [
  'Lead In',
  'Contact Made',
  'Meeting Scheduled',
  'Proposal Sent',
  'Negotiation',
  'Won',
  'Lost',
];

const PRIORITY_BADGE = { Urgent: 'accent', High: 'accent', Medium: 'dark', Low: 'default' };

export function PipelineKanbanPage({ onQuickAdd }) {
  const toast = useToast();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const data = await dealsApi.list();
      setDeals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleMoveStage = async (dealId, nextStage) => {
    try {
      setUpdatingId(dealId);
      if (nextStage === 'Won') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#CC0000', '#111111', '#E5E5E0', '#737373'],
        });
        toast.success('Deal won! Excellent work. 🎉');
      }
      const updated = await dealsApi.updateStage(dealId, nextStage);
      setDeals((prev) => prev.map((d) => (d.id === dealId ? updated : d)));
    } catch (err) {
      toast.error(`Failed to advance stage: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (dealId, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Remove deal "${title}" from the pipeline?`)) return;
    setDeletingId(dealId);
    try {
      await dealsApi.delete(dealId);
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
      toast.success(`Deal "${title}" removed.`);
    } catch (err) {
      toast.error(`Failed to remove deal: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingState message="Organizing Pipeline ledger and columns..." />;

  const totalBoardValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
  const activeDeals = deals.filter((d) => !['Won', 'Lost'].includes(d.stage));

  const stageBreakdown = STAGES.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    return {
      stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + (d.value || 0), 0),
    };
  });

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">
              SECTION 02 • COMMERCIAL BOARDROOM
            </span>
            <EditorialBadge variant="dark" size="xs">
              {activeDeals.length} Active
            </EditorialBadge>
            <EditorialBadge variant="accent" size="xs">
              {deals.filter((d) => d.stage === 'Won').length} Won
            </EditorialBadge>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Sales Negotiation Pipeline
          </h2>
          <p className="font-body text-sm text-neutral-600">
            Cumulative portfolio currently standing at{' '}
            <strong className="font-data text-foreground font-bold">{formatCurrency(totalBoardValue)}</strong>
            {' '}· Advance deals with the stage arrows or dropdown
          </p>
        </div>

        <div className="flex items-center gap-3">
          <EditorialButton
            variant="secondary"
            size="md"
            onClick={() => setShowAnalytics((v) => !v)}
          >
            <PieChart className="w-4 h-4" />
            <span>{showAnalytics ? 'Hide Visual Charts' : 'Visual Charts'}</span>
          </EditorialButton>

          <EditorialButton variant="primary" size="md" onClick={onQuickAdd}>
            <Plus className="w-4 h-4" />
            <span>+ File Opportunity</span>
          </EditorialButton>
        </div>
      </div>

      {/* Collapsible Visual Charts Drawer */}
      {showAnalytics && (
        <div className="border-2 border-foreground bg-newsprint shadow-hard p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-soft-fade-in">
          <div className="border border-neutral-300 bg-white/40 p-2 sm:p-4">
            <DonutBreakdownChart data={stageBreakdown} />
          </div>
          <div className="border border-neutral-300 bg-white/40 p-2 sm:p-4">
            <PipelineFunnelChart data={stageBreakdown} />
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none items-start">
        {STAGES.map((stageName, idx) => {
          const stageDeals = deals.filter((d) => d.stage === stageName);
          const stageTotal = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
          const isWon = stageName === 'Won';
          const isLost = stageName === 'Lost';

          return (
            <div
              key={stageName}
              className={`flex-shrink-0 w-72 border-2 border-foreground bg-newsprint sharp-corners flex flex-col max-h-[80vh] shadow-hard-sm ${
                isWon ? 'border-accent' : isLost ? 'opacity-80' : ''
              }`}
            >
              {/* Column Header */}
              <div
                className={`p-3.5 border-b-2 border-foreground flex-shrink-0 ${
                  isWon ? 'bg-foreground text-newsprint' : 'bg-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-data text-[10px] ${isWon ? 'opacity-60' : 'text-neutral-400'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h4 className="font-ui text-xs font-bold uppercase tracking-wider">
                      {stageName}
                    </h4>
                  </div>
                  <EditorialBadge variant={isWon ? 'accent' : 'dark'} size="xs">
                    {stageDeals.length}
                  </EditorialBadge>
                </div>
                <div className={`font-data text-sm font-bold mt-1 ${isWon ? 'text-newsprint' : 'text-foreground'}`}>
                  {formatCurrency(stageTotal)}
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {stageDeals.length === 0 ? (
                  <div className="py-10 text-center border border-dashed border-neutral-400 font-body text-xs text-neutral-500">
                    Empty stage
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const currentStageIdx = STAGES.indexOf(deal.stage);
                    const canMoveLeft = currentStageIdx > 0;
                    const canMoveRight = currentStageIdx < STAGES.length - 1;
                    const dealOverdue = deal.expected_close && isOverdue(deal.expected_close) && !['Won', 'Lost'].includes(deal.stage);

                    return (
                      <div
                        key={deal.id}
                        className={`bg-newsprint border border-foreground sharp-corners p-4 hover:shadow-hard transition-all duration-150 flex flex-col justify-between ${
                          dealOverdue ? 'border-l-4 border-l-accent' : ''
                        }`}
                      >
                        {/* Header */}
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5
                              className="font-display text-sm font-bold text-foreground leading-snug flex-1 min-w-0 break-words"
                              title={deal.title}
                            >
                              {deal.title}
                            </h5>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {deal.priority && (
                                <EditorialBadge
                                  variant={PRIORITY_BADGE[deal.priority] || 'default'}
                                  size="xs"
                                >
                                  {deal.priority}
                                </EditorialBadge>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleDelete(deal.id, deal.title, e)}
                                disabled={deletingId === deal.id}
                                className="p-1 text-neutral-400 hover:text-accent hover:bg-neutral-200/60 border border-transparent hover:border-neutral-300 transition-colors"
                                title="Remove deal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 mb-3">
                            <div className="flex items-center gap-1.5 font-ui text-xs font-semibold text-neutral-800">
                              <Building className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                              <span className="truncate">{deal.company}</span>
                            </div>
                            {deal.contact_name && (
                              <div className="flex items-center gap-1.5 font-body text-xs text-neutral-600">
                                <User className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                                <span className="truncate">{deal.contact_name}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Value + Meta */}
                        <div className="pt-2.5 border-t border-neutral-300">
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="font-data text-base font-bold text-foreground">
                              {formatCurrency(deal.value)}
                            </span>
                            <span className="font-data text-xs text-neutral-500">
                              {deal.probability}%
                            </span>
                          </div>

                          {deal.expected_close && (
                            <div className={`flex items-center gap-1 text-[11px] font-data mb-3 ${
                              dealOverdue ? 'text-accent font-bold' : 'text-neutral-500'
                            }`}>
                              {dealOverdue ? (
                                <AlertTriangle className="w-3 h-3" />
                              ) : (
                                <Calendar className="w-3 h-3 text-neutral-400" />
                              )}
                              <span>
                                {dealOverdue ? 'OVERDUE: ' : 'Target: '}
                                {formatDate(deal.expected_close)}
                              </span>
                            </div>
                          )}

                          {/* Stage Controls */}
                          <div className="flex items-center justify-between pt-2 border-t border-dashed border-neutral-300 gap-1.5">
                            {canMoveLeft ? (
                              <button
                                type="button"
                                disabled={updatingId === deal.id}
                                onClick={() => handleMoveStage(deal.id, STAGES[currentStageIdx - 1])}
                                className="p-1 border border-foreground hover:bg-neutral-200 transition-colors disabled:opacity-40"
                                title={`Back to ${STAGES[currentStageIdx - 1]}`}
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <div className="w-6" />
                            )}

                            <select
                              value={deal.stage}
                              disabled={updatingId === deal.id}
                              onChange={(e) => handleMoveStage(deal.id, e.target.value)}
                              className="font-ui text-[11px] font-bold uppercase tracking-wider bg-transparent border border-foreground px-1.5 py-0.5 outline-none cursor-pointer flex-1 text-center"
                            >
                              {STAGES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>

                            {canMoveRight ? (
                              <button
                                type="button"
                                disabled={updatingId === deal.id}
                                onClick={() => handleMoveStage(deal.id, STAGES[currentStageIdx + 1])}
                                className="p-1 bg-foreground text-newsprint border border-foreground hover:bg-accent hover:border-accent transition-colors disabled:opacity-40"
                                title={`Advance to ${STAGES[currentStageIdx + 1]}`}
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <div className="w-6" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
