import React, { useEffect, useState, useRef } from 'react';
import { tasksApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import { isOverdue, formatDate } from '../utils/format';
import { Plus, Check, Trash2, Calendar, AlertCircle, Clock, ChevronDown } from 'lucide-react';

const PRIORITY_BADGE = {
  Urgent: 'accent',
  High: 'accent',
  Medium: 'dark',
  Low: 'default',
};

export function TasksPage({ onQuickAdd }) {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending'); // default to pending view
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [inlineForm, setInlineForm] = useState({
    title: '',
    due_date: '',
    priority: 'Medium',
  });
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const titleInputRef = useRef(null);

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

  useEffect(() => {
    if (showInlineAdd && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showInlineAdd]);

  const handleToggle = async (task) => {
    try {
      const updated = await tasksApi.update(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      if (!task.completed) {
        toast.success(`Task completed: "${task.title.slice(0, 40)}"`);
      }
    } catch (err) {
      toast.error(`Failed to update task: ${err.message}`);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Strike "${title}" from the ledger?`)) return;
    try {
      await tasksApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task removed from ledger.');
    } catch (err) {
      toast.error(`Failed to remove task: ${err.message}`);
    }
  };

  const handleInlineSubmit = async (e) => {
    e.preventDefault();
    if (!inlineForm.title.trim()) return;
    setInlineSubmitting(true);
    try {
      const created = await tasksApi.create({
        title: inlineForm.title.trim(),
        due_date: inlineForm.due_date || undefined,
        priority: inlineForm.priority,
        color: 'yellow',
      });
      setTasks((prev) => [created, ...prev]);
      setInlineForm({ title: '', due_date: '', priority: 'Medium' });
      setShowInlineAdd(false);
      toast.success('Task filed to ledger.');
    } catch (err) {
      toast.error(`Failed to file task: ${err.message}`);
    } finally {
      setInlineSubmitting(false);
    }
  };

  const handleInlineKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowInlineAdd(false);
      setInlineForm({ title: '', due_date: '', priority: 'Medium' });
    }
  };

  if (loading) return <LoadingState message="Auditing editorial action items & ledger..." />;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'overdue') return !t.completed && t.due_date && isOverdue(t.due_date);
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const overdueCount = tasks.filter((t) => !t.completed && t.due_date && isOverdue(t.due_date)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">
              SECTION 04 • ACTION DISPATCH
            </span>
            <EditorialBadge variant="dark" size="xs">
              {pendingCount} Pending
            </EditorialBadge>
            {overdueCount > 0 && (
              <EditorialBadge variant="accent" size="xs">
                {overdueCount} Overdue
              </EditorialBadge>
            )}
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Operational Task Ledger
          </h2>
          <p className="font-body text-sm text-neutral-600">
            Follow-ups, agreements, and critical reminders — sorted by urgency
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Pills */}
          <div className="flex border border-foreground sharp-corners">
            {[
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'overdue', label: `Overdue (${overdueCount})` },
              { id: 'completed', label: `Done (${completedCount})` },
              { id: 'all', label: `All (${tasks.length})` },
            ].map(({ id, label }, i) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 font-ui text-xs font-bold uppercase tracking-wider transition-colors ${
                  i > 0 ? 'border-l border-foreground' : ''
                } ${
                  filter === id
                    ? 'bg-foreground text-newsprint'
                    : 'bg-transparent text-foreground hover:bg-neutral-200'
                } ${id === 'overdue' && overdueCount > 0 && filter !== 'overdue' ? 'text-accent' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <EditorialButton
            variant="primary"
            size="md"
            onClick={() => setShowInlineAdd((v) => !v)}
          >
            <Plus className="w-4 h-4" />
            <span>+ Quick Task</span>
          </EditorialButton>
        </div>
      </div>

      {/* Inline Quick-Add Form */}
      {showInlineAdd && (
        <form
          onSubmit={handleInlineSubmit}
          onKeyDown={handleInlineKeyDown}
          className="border-2 border-foreground bg-newsprint shadow-hard p-5 flex flex-col sm:flex-row gap-4 items-end"
        >
          <div className="flex-1">
            <label className="editorial-label text-neutral-500 block mb-2">Task Description *</label>
            <input
              ref={titleInputRef}
              type="text"
              required
              value={inlineForm.title}
              onChange={(e) => setInlineForm({ ...inlineForm, title: e.target.value })}
              placeholder="Follow up with CFO on security clearance..."
              className="w-full bg-newsprint border-b-2 border-foreground py-2 font-body text-sm outline-none focus:border-accent placeholder-neutral-400 transition-colors"
            />
          </div>
          <div className="w-full sm:w-36">
            <label className="editorial-label text-neutral-500 block mb-2">Due Date</label>
            <input
              type="date"
              value={inlineForm.due_date}
              onChange={(e) => setInlineForm({ ...inlineForm, due_date: e.target.value })}
              className="w-full bg-newsprint border-b-2 border-foreground py-2 font-data text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="w-full sm:w-28">
            <label className="editorial-label text-neutral-500 block mb-2">Priority</label>
            <select
              value={inlineForm.priority}
              onChange={(e) => setInlineForm({ ...inlineForm, priority: e.target.value })}
              className="w-full bg-newsprint border-b-2 border-foreground py-2 font-ui text-xs font-bold uppercase outline-none focus:border-accent cursor-pointer"
            >
              {['Urgent', 'High', 'Medium', 'Low'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <EditorialButton type="submit" variant="primary" size="md" disabled={inlineSubmitting}>
              {inlineSubmitting ? 'Filing...' : 'File Task'}
            </EditorialButton>
            <EditorialButton
              type="button"
              variant="ghost"
              size="md"
              onClick={() => { setShowInlineAdd(false); setInlineForm({ title: '', due_date: '', priority: 'Medium' }); }}
            >
              Cancel
            </EditorialButton>
          </div>
        </form>
      )}

      {/* Task Ledger */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title={filter === 'overdue' ? 'No Overdue Tasks' : filter === 'completed' ? 'No Completed Tasks' : 'Ledger Cleared'}
          description={
            filter === 'overdue'
              ? 'All tasks are within their deadlines. Excellent standing.'
              : filter === 'completed'
              ? 'No tasks have been resolved yet.'
              : 'No tasks in the current view. File a task to begin.'
          }
          actionLabel="File Task"
          onAction={() => setShowInlineAdd(true)}
          icon="📋"
        />
      ) : (
        <div className="border-2 border-foreground bg-newsprint shadow-hard divide-y divide-foreground">
          {filteredTasks.map((task, idx) => {
            const taskIsOverdue = !task.completed && task.due_date && isOverdue(task.due_date);

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  task.completed
                    ? 'bg-neutral-100/70'
                    : taskIsOverdue
                    ? 'bg-red-50/30 hover:bg-red-50/50'
                    : 'hover:bg-neutral-50'
                }`}
              >
                {/* Left: Checkbox + Content */}
                <div className="flex items-start gap-4 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggle(task)}
                    className={`mt-0.5 w-6 h-6 border-2 border-foreground sharp-corners flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-foreground text-newsprint'
                        : taskIsOverdue
                        ? 'border-accent hover:bg-accent/10'
                        : 'bg-newsprint hover:border-accent'
                    }`}
                    aria-label={task.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
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
                          variant={PRIORITY_BADGE[task.priority] || 'default'}
                          size="xs"
                        >
                          {task.priority}
                        </EditorialBadge>
                      )}
                      {taskIsOverdue && (
                        <span className="flex items-center gap-0.5 text-accent font-ui text-[11px] font-bold uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3" />
                          OVERDUE
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className={`font-body text-sm text-neutral-700 max-w-2xl ${
                        task.completed ? 'line-through text-neutral-400' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Meta + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-300">
                  {task.due_date && (
                    <div className={`flex items-center gap-1.5 font-data text-xs ${
                      taskIsOverdue ? 'text-accent font-bold' : 'text-neutral-600'
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(task.due_date)}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(task.id, task.title)}
                    title="Strike from ledger"
                    className="p-1.5 text-neutral-400 hover:text-accent hover:bg-neutral-200 transition-colors sharp-corners"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary footer */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="font-data text-xs text-neutral-500">
            {completedCount} of {tasks.length} tasks resolved ·{' '}
            {Math.round((completedCount / tasks.length) * 100)}% completion rate
          </span>
          {overdueCount > 0 && (
            <span className="font-ui text-xs font-bold text-accent uppercase tracking-wider">
              ⚠ {overdueCount} overdue
            </span>
          )}
        </div>
      )}
    </div>
  );
}
