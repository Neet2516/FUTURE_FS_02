import React, { useEffect, useState } from 'react';
import { activitiesApi } from '../services/api';
import { WobblyCard } from '../components/ui/WobblyCard';
import { WobblyButton } from '../components/ui/WobblyButton';
import { WobblyBadge } from '../components/ui/WobblyBadge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import {
  History,
  PhoneCall,
  Mail,
  Calendar,
  Award,
  FileText,
  Plus,
  Clock,
} from 'lucide-react';

const FILTER_TYPES = ['All', 'Stage Change', 'Call', 'Email', 'Meeting', 'Note'];

export function ActivityLogPage({ onQuickAdd }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activitiesApi.list();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return <PhoneCall className="w-5 h-5 text-emerald-700" />;
      case 'Email': return <Mail className="w-5 h-5 text-blue-700" />;
      case 'Meeting': return <Calendar className="w-5 h-5 text-amber-700" />;
      case 'Stage Change': return <Award className="w-5 h-5 text-accent-red" />;
      default: return <FileText className="w-5 h-5 text-ink" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'Call': return 'green';
      case 'Email': return 'blue';
      case 'Meeting': return 'yellow';
      case 'Stage Change': return 'red';
      default: return 'neutral';
    }
  };

  if (loading) return <LoadingState message="Unrolling the activity audit timeline..." />;

  const filtered = activities.filter(a => {
    if (activeFilter === 'All') return true;
    return a.activity_type === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-paper border-2 border-ink wobbly p-5 shadow-hard flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-heading font-bold text-ink flex items-center gap-2">
            <History className="w-6 h-6 text-secondary-blue" />
            <span>Activity Audit Timeline</span>
          </h3>
          <p className="text-sm font-body text-ink/70">
            Complete chronological record of team calls, meetings, notes & pipeline advances
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-muted-paper/50 border border-ink wobbly-sm">
          {FILTER_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveFilter(t)}
              className={`px-3 py-1 font-heading font-bold text-xs border transition-all ${
                activeFilter === t
                  ? 'bg-ink text-paper border-ink wobbly shadow-hard-sm'
                  : 'bg-transparent text-ink border-transparent hover:border-ink/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Activities Found"
          description="No records match this activity filter."
          icon="📜"
        />
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-1 before:bg-ink before:border-l-2 before:border-dashed before:border-ink/50">
          {filtered.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline Pin Node */}
              <div className="absolute -left-6 sm:-left-10 top-3 w-8 h-8 rounded-full border-2 border-ink bg-postit-yellow flex items-center justify-center shadow-hard-sm group-hover:scale-110 transition-transform">
                {getActivityIcon(act.activity_type)}
              </div>

              {/* Event Card */}
              <WobblyCard className="p-4 sm:p-5 ml-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <WobblyBadge variant={getBadgeVariant(act.activity_type)} size="sm">
                      {act.activity_type}
                    </WobblyBadge>
                    {act.deal_id && (
                      <span className="text-xs font-heading font-bold text-ink/60">
                        Deal: #{act.deal_id}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-heading text-ink/60">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{act.created_at}</span>
                  </div>
                </div>

                <p className="font-body text-base text-ink leading-relaxed">
                  {act.description}
                </p>
              </WobblyCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
