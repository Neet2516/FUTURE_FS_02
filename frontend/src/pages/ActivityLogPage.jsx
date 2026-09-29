import React, { useEffect, useState } from 'react';
import { activitiesApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
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
      case 'Call':
        return <PhoneCall className="w-4 h-4 text-foreground" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-foreground" />;
      case 'Meeting':
        return <Calendar className="w-4 h-4 text-foreground" />;
      case 'Stage Change':
        return <Award className="w-4 h-4 text-accent" />;
      default:
        return <FileText className="w-4 h-4 text-foreground" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'Stage Change':
        return 'accent';
      case 'Call':
        return 'dark';
      case 'Email':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (loading) return <LoadingState message="Accessing chronological dispatch archives..." />;

  const filtered = activities.filter((a) => {
    if (activeFilter === 'All') return true;
    return a.activity_type === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
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
            Immutable chronological dispatch log of stakeholder communications and deal progressions
          </p>
        </div>

        {/* Filter Buttons */}
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
            </button>
          ))}
        </div>
      </div>

      {/* Chronicle Timeline */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Archive Entries Found"
          description="There are no dispatches matching the selected activity filter."
          icon="📜"
        />
      ) : (
        <div className="border-2 border-foreground bg-newsprint shadow-hard divide-y divide-foreground">
          {filtered.map((act, idx) => (
            <div
              key={act.id}
              className="p-5 hover:bg-neutral-100/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Node marker */}
                <div className="w-8 h-8 border border-foreground bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5 sharp-corners">
                  {getActivityIcon(act.activity_type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-data text-xs text-neutral-400">
                      ENTRY #{String(filtered.length - idx).padStart(3, '0')}
                    </span>
                    <EditorialBadge
                      variant={getBadgeVariant(act.activity_type)}
                      size="xs"
                    >
                      {act.activity_type}
                    </EditorialBadge>
                    {act.deal_id && (
                      <span className="font-data text-xs text-neutral-500 font-semibold">
                        DEAL REF: #{act.deal_id}
                      </span>
                    )}
                  </div>

                  <p className="font-body text-base text-foreground leading-relaxed pt-1">
                    {act.description}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1.5 font-data text-xs text-neutral-500 flex-shrink-0 pt-2 sm:pt-0 sm:self-start">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{act.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
