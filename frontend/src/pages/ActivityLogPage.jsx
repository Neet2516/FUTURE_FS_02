import React, { useEffect, useState } from 'react';
import { activitiesApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { formatRelativeTime } from '../utils/format';
import {
  History,
  PhoneCall,
  Mail,
  Calendar,
  Award,
  FileText,
  Clock,
  Plus,
} from 'lucide-react';

const FILTER_TYPES = ['All', 'Stage Change', 'Call', 'Email', 'Meeting', 'Note'];

const getActivityIcon = (type) => {
  switch (type) {
    case 'Call': return <PhoneCall className="w-4 h-4 text-foreground" />;
    case 'Email': return <Mail className="w-4 h-4 text-foreground" />;
    case 'Meeting': return <Calendar className="w-4 h-4 text-foreground" />;
    case 'Stage Change': return <Award className="w-4 h-4 text-accent" />;
    default: return <FileText className="w-4 h-4 text-foreground" />;
  }
};

const getBadgeVariant = (type) => {
  switch (type) {
    case 'Stage Change': return 'accent';
    case 'Call': return 'dark';
    case 'Email': return 'default';
    default: return 'outline';
  }
};

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

  if (loading) return <LoadingState message="Accessing chronological dispatch archives..." />;

  const filtered = activities.filter((a) => {
    if (activeFilter === 'All') return true;
    return a.activity_type === activeFilter;
  });

  // Group activities by date for timeline rendering
  const grouped = filtered.reduce((acc, act) => {
    const raw = act.created_at || '';
    const dateKey = raw.split('T')[0] || raw.split(' ')[0] || 'Unknown';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(act);
    return acc;
  }, {});

  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const formatDateHeading = (dateStr) => {
    if (!dateStr || dateStr === 'Unknown') return 'Unknown Date';
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">
              SECTION 05 • DISPATCH WIRE & AUDIT
            </span>
            <EditorialBadge variant="dark" size="xs">
              {activities.length} Entries
            </EditorialBadge>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Activity Chronicle & Audit Log
          </h2>
          <p className="font-body text-sm text-neutral-600">
            Immutable chronological dispatch log of stakeholder interactions and deal progressions
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTER_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveFilter(t)}
              className={`px-3 py-1 font-ui text-xs font-bold uppercase tracking-wider border transition-colors sharp-corners ${
                activeFilter === t
                  ? 'bg-foreground text-newsprint border-foreground'
                  : 'bg-transparent text-foreground border-neutral-300 hover:border-foreground'
              }`}
            >
              {t}
              {t !== 'All' && (
                <span className="ml-1 font-data opacity-60">
                  ({activities.filter(a => a.activity_type === t).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline by Date */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Archive Entries Found"
          description="No dispatches match the selected activity filter."
          icon="📜"
        />
      ) : (
        <div className="space-y-6">
          {dateKeys.map((dateKey) => (
            <div key={dateKey}>
              {/* Date Heading */}
              <div className="flex items-center gap-4 mb-3">
                <span className="font-ui text-xs font-bold uppercase tracking-widest text-neutral-500">
                  {formatDateHeading(dateKey)}
                </span>
                <div className="flex-1 h-px bg-neutral-300" />
                <span className="font-data text-[11px] text-neutral-400">
                  {grouped[dateKey].length} {grouped[dateKey].length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              <div className="border-2 border-foreground bg-newsprint shadow-hard divide-y divide-foreground">
                {grouped[dateKey].map((act, idx) => (
                  <div
                    key={act.id}
                    className="p-5 hover:bg-neutral-100/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className="w-8 h-8 border border-foreground bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5 sharp-corners">
                        {getActivityIcon(act.activity_type)}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-data text-xs text-neutral-400">
                            ENTRY #{String(grouped[dateKey].length - idx).padStart(3, '0')}
                          </span>
                          <EditorialBadge variant={getBadgeVariant(act.activity_type)} size="xs">
                            {act.activity_type}
                          </EditorialBadge>
                          {act.deal_id && (
                            <span className="font-data text-xs text-neutral-500 font-semibold">
                              DEAL: {act.deal_id.slice(0, 10)}
                            </span>
                          )}
                        </div>

                        <p className="font-body text-base text-foreground leading-relaxed pt-1">
                          {act.description}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 font-data text-xs text-neutral-500 flex-shrink-0 pt-1 sm:pt-0 sm:self-start whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formatRelativeTime(act.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
