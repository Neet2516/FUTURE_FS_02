import React, { useEffect, useState } from 'react';
import { dealsApi } from '../services/api';
import { WobblyCard } from '../components/ui/WobblyCard';
import { WobblyButton } from '../components/ui/WobblyButton';
import { WobblyBadge } from '../components/ui/WobblyBadge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Plus, ArrowRight, ArrowLeft, Trophy, DollarSign, Calendar, AlertCircle } from 'lucide-react';
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

export function PipelineKanbanPage({ onQuickAdd }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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
      // Trigger confetti if won!
      if (nextStage === 'Won') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff4d4d', '#2d5da1', '#fff9c4', '#2d2d2d'],
        });
      }

      const updated = await dealsApi.updateStage(dealId, nextStage);
      setDeals(prev => prev.map(d => (d.id === dealId ? updated : d)));
    } catch (err) {
      alert(`Failed to move deal: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (loading) return <LoadingState message="Loading deals onto the Kanban board..." />;

  const priorityVariants = {
    Urgent: 'red',
    High: 'red',
    Medium: 'yellow',
    Low: 'neutral',
  };

  return (
    <div className="space-y-6">
      {/* Board Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-paper border-2 border-ink wobbly p-4 shadow-hard">
        <div>
          <h3 className="text-2xl font-heading font-bold text-ink">
            Sales Pipeline Kanban Board
          </h3>
          <p className="text-sm font-body text-ink/70">
            Track and advance deals across all stages of negotiation
          </p>
        </div>

        <WobblyButton variant="primary" onClick={onQuickAdd}>
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ New Opportunity</span>
        </WobblyButton>
      </div>

      {/* Kanban Columns Horizontal Scroll Container */}
      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 select-none">
        {STAGES.map((stageName, idx) => {
          const stageDeals = deals.filter(d => d.stage === stageName);
          const stageTotal = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
          const isWon = stageName === 'Won';
          const isLost = stageName === 'Lost';

          return (
            <div
              key={stageName}
              className={`flex-shrink-0 w-80 bg-[#f9f6ef] border-2 border-ink wobbly p-3.5 shadow-hard flex flex-col max-h-[78vh] ${
                isWon ? 'bg-emerald-50/70' : isLost ? 'bg-rose-50/70' : ''
              }`}
            >
              {/* Stage Header */}
              <div className="border-b-2 border-ink pb-3 mb-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-heading font-bold text-lg text-ink flex items-center gap-1.5">
                    {isWon && <Trophy className="w-4 h-4 text-emerald-700" />}
                    <span>{stageName}</span>
                  </h4>
                  <span className="text-xs px-2 py-0.5 bg-paper border border-ink wobbly-badge font-heading font-bold">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="font-heading font-bold text-sm text-ink/80 mt-1">
                  {formatCurrency(stageTotal)}
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {stageDeals.length === 0 ? (
                  <div className="py-10 text-center border-2 border-dashed border-ink/20 wobbly-sm font-body text-sm text-ink/50">
                    No deals in {stageName}
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const currentStageIdx = STAGES.indexOf(deal.stage);
                    const canMoveLeft = currentStageIdx > 0;
                    const canMoveRight = currentStageIdx < STAGES.length - 1;

                    return (
                      <div
                        key={deal.id}
                        className="relative bg-paper border-2 border-ink wobbly-sm p-4 shadow-hard-sm hover:shadow-hard hover:-translate-y-0.5 transition-all"
                      >
                        {/* Washi Tape Accent */}
                        <div className="absolute -top-2 right-4 w-12 h-3 bg-[#ede7db] border-l border-r border-dashed border-ink/30 rotate-2 pointer-events-none" />

                        {/* Title & Priority */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h5 className="font-heading font-bold text-base text-ink leading-snug">
                            {deal.title}
                          </h5>
                          <WobblyBadge
                            variant={priorityVariants[deal.priority] || 'neutral'}
                            size="sm"
                          >
                            {deal.priority}
                          </WobblyBadge>
                        </div>

                        {/* Company & Contact */}
                        <p className="font-body text-sm text-ink/80 mb-2">
                          <b>{deal.company}</b>
                          {deal.contact_name && (
                            <span className="text-ink/60"> • {deal.contact_name}</span>
                          )}
                        </p>

                        {/* Financial Value & Probability */}
                        <div className="flex items-center justify-between text-sm font-heading font-bold text-ink mb-3 pt-2 border-t border-dashed border-ink/20">
                          <span className="text-lg text-secondary-blue">
                            {formatCurrency(deal.value)}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-muted-paper/50 border border-ink wobbly-badge">
                            {deal.probability}% Prob
                          </span>
                        </div>

                        {/* Close Date */}
                        {deal.expected_close && (
                          <div className="flex items-center gap-1.5 text-xs text-ink/70 font-body mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Target: {deal.expected_close}</span>
                          </div>
                        )}

                        {/* Stage Transition Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-ink/20">
                          {canMoveLeft ? (
                            <button
                              type="button"
                              disabled={updatingId === deal.id}
                              onClick={() => handleMoveStage(deal.id, STAGES[currentStageIdx - 1])}
                              className="p-1 hover:bg-muted-paper/60 border border-ink wobbly-sm text-xs font-heading font-bold flex items-center gap-1 disabled:opacity-50"
                              title={`Move back to ${STAGES[currentStageIdx - 1]}`}
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : <div />}

                          {/* Quick Jump Dropdown */}
                          <select
                            value={deal.stage}
                            disabled={updatingId === deal.id}
                            onChange={(e) => handleMoveStage(deal.id, e.target.value)}
                            className="text-xs font-heading font-bold bg-transparent border border-ink wobbly-sm px-1.5 py-0.5 outline-none cursor-pointer"
                          >
                            {STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          {canMoveRight ? (
                            <button
                              type="button"
                              disabled={updatingId === deal.id}
                              onClick={() => handleMoveStage(deal.id, STAGES[currentStageIdx + 1])}
                              className="p-1 bg-postit-yellow hover:bg-[#fff59d] border border-ink wobbly-sm text-xs font-heading font-bold flex items-center gap-1 shadow-[1px_1px_0px_#2d2d2d] disabled:opacity-50"
                              title={`Advance to ${STAGES[currentStageIdx + 1]}`}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : <div />}
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
