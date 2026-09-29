import React, { useEffect, useState } from 'react';
import { tasksApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Plus, Check, Trash2, Calendar, AlertCircle, Clock } from 'lucide-react';

export function TasksPage({ onQuickAdd }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.list();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = async (task) => {
    try {
      const updated = await tasksApi.update(task.id, {
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      alert(`Failed to update task record: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Strike this reminder from the dispatch ledger?')) return;
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(`Failed to strike task: ${err.message}`);
    }
  };

  if (loading) return <LoadingState message="Auditing editorial action items & ledger..." />;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'Urgent':
      case 'High':
        return 'accent';
      case 'Medium':
        return 'dark';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">
              SECTION 04 • ACTION DISPATCH
            </span>
            <EditorialBadge variant="dark" size="xs">
              {pendingCount} Pending
            </EditorialBadge>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Operational Task Ledger
          </h2>
          <p className="font-body text-sm text-neutral-600">
            Chronological checklist of client follow-ups, agreements, and critical reminders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Pills */}
          <div className="flex border border-foreground sharp-corners">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 font-ui text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === 'all'
                  ? 'bg-foreground text-newsprint'
                  : 'bg-transparent text-foreground hover:bg-neutral-200'
              }`}
            >
              All ({tasks.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 font-ui text-xs font-bold uppercase tracking-wider border-l border-foreground transition-colors ${
                filter === 'pending'
                  ? 'bg-foreground text-newsprint'
                  : 'bg-transparent text-foreground hover:bg-neutral-200'
              }`}
            >
              Pending ({pendingCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 font-ui text-xs font-bold uppercase tracking-wider border-l border-foreground transition-colors ${
                filter === 'completed'
                  ? 'bg-foreground text-newsprint'
                  : 'bg-transparent text-foreground hover:bg-neutral-200'
              }`}
            >
              Resolved ({completedCount})
            </button>
          </div>

          <EditorialButton variant="primary" size="md" onClick={onQuickAdd}>
            <Plus className="w-4 h-4" />
            <span>+ File Task</span>
          </EditorialButton>
        </div>
      </div>

      {/* Task Ledger Table / Cards */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="Ledger Cleared"
          description="No tasks remaining under the current filter view. Create an action item to populate the dispatch ledger."
          actionLabel="File Task"
          onAction={onQuickAdd}
          icon="📋"
        />
      ) : (
        <div className="border-2 border-foreground bg-newsprint shadow-hard divide-y divide-foreground">
          {filteredTasks.map((task, idx) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                task.completed ? 'bg-neutral-100/70' : 'hover:bg-neutral-50'
              }`}
            >
              {/* Left: Checkbox & Content */}
              <div className="flex items-start gap-4 flex-1">
                {/* Sharp Checkbox Button */}
                <button
                  type="button"
                  onClick={() => handleToggle(task)}
                  className={`mt-0.5 w-6 h-6 border-2 border-foreground sharp-corners flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-foreground text-newsprint'
                      : 'bg-newsprint hover:border-accent'
                  }`}
                  aria-label={task.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-data text-xs text-neutral-400">
                      #{String(idx + 1).padStart(3, '0')}
                    </span>
                    <h4
                      className={`font-display text-lg font-bold text-foreground leading-snug ${
                        task.completed ? 'line-through text-neutral-500' : ''
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.priority && (
                      <EditorialBadge
                        variant={getPriorityBadgeVariant(task.priority)}
                        size="xs"
                      >
                        {task.priority}
                      </EditorialBadge>
                    )}
                  </div>

                  {task.description && (
                    <p
                      className={`font-body text-sm text-neutral-700 max-w-2xl ${
                        task.completed ? 'line-through text-neutral-400' : ''
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Meta & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-300">
                {task.due_date && (
                  <div className="flex items-center gap-1.5 font-data text-xs text-neutral-600">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Due: {task.due_date}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  title="Strike task from ledger"
                  className="p-1.5 text-neutral-400 hover:text-accent hover:bg-neutral-200 transition-colors sharp-corners"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
