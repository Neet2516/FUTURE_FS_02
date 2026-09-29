import React, { useEffect, useState } from 'react';
import { tasksApi } from '../services/api';
import { StickyNote } from '../components/ui/StickyNote';
import { WobblyButton } from '../components/ui/WobblyButton';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Plus, CheckCircle2, ListTodo, Flame } from 'lucide-react';

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
      setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    } catch (err) {
      alert(`Failed to update task: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Discard this sticky note?')) return;
    try {
      await tasksApi.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(`Failed to delete task: ${err.message}`);
    }
  };

  if (loading) return <LoadingState message="Pinning sticky notes to the corkboard..." />;

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-1.5', '-rotate-0.5', 'rotate-2'];

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="bg-paper border-2 border-ink wobbly p-5 shadow-hard flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-heading font-bold text-ink flex items-center gap-2">
            <span>Sticky Notes & Reminders</span>
            <span className="text-xl">📌</span>
          </h3>
          <p className="text-sm font-body text-ink/70">
            Handwritten reminders, urgent action items & daily checklists
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Pills */}
          <div className="flex gap-1.5 p-1 bg-muted-paper/50 border border-ink wobbly-sm">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 font-heading font-bold text-xs border transition-all ${
                filter === 'all'
                  ? 'bg-ink text-paper border-ink wobbly shadow-hard-sm'
                  : 'bg-transparent text-ink border-transparent hover:border-ink/50'
              }`}
            >
              All ({tasks.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 font-heading font-bold text-xs border transition-all ${
                filter === 'pending'
                  ? 'bg-ink text-paper border-ink wobbly shadow-hard-sm'
                  : 'bg-transparent text-ink border-transparent hover:border-ink/50'
              }`}
            >
              To-Do ({pendingCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 font-heading font-bold text-xs border transition-all ${
                filter === 'completed'
                  ? 'bg-ink text-paper border-ink wobbly shadow-hard-sm'
                  : 'bg-transparent text-ink border-transparent hover:border-ink/50'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          <WobblyButton variant="yellow" onClick={onQuickAdd}>
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Pin Note</span>
          </WobblyButton>
        </div>
      </div>

      {/* Sticky Notes Grid */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          description="No tasks in this view. Take a breather or scribble a new note!"
          actionLabel="Pin a Note"
          onAction={onQuickAdd}
          icon="📌"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {filteredTasks.map((task, idx) => (
            <StickyNote
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              rotation={rotations[idx % rotations.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
