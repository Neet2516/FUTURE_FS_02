import React from 'react';
import { Thumbtack } from './Thumbtack';
import { WobblyBadge } from './WobblyBadge';
import { Check, Trash2, Calendar, AlertCircle } from 'lucide-react';

export function StickyNote({
  task,
  onToggle,
  onDelete,
  rotation = '-1deg',
}) {
  const colorMap = {
    yellow: 'bg-[#fff9c4] text-amber-950',
    pink: 'bg-[#ffd1dc] text-rose-950',
    green: 'bg-[#d4edda] text-emerald-950',
    blue: 'bg-[#d0e8ff] text-blue-950',
  };

  const priorityVariants = {
    Urgent: 'red',
    High: 'red',
    Medium: 'yellow',
    Low: 'neutral',
  };

  const colorClass = colorMap[task.color] || colorMap.yellow;

  return (
    <div
      style={{ transform: `rotate(${rotation})` }}
      className={`relative p-5 pt-7 border-2 border-ink wobbly shadow-hard transition-all duration-200 hover:shadow-hard-lg hover:-translate-y-1 hover:rotate-0 flex flex-col justify-between min-h-[190px] ${colorClass}`}
    >
      {/* Pushpin at top */}
      <Thumbtack className="top-1 left-1/2 -translate-x-1/2" color={task.priority === 'Urgent' ? '#ff4d4d' : '#2d5da1'} />

      <div>
        {/* Priority & Status header */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <WobblyBadge
            variant={priorityVariants[task.priority] || 'neutral'}
            size="sm"
          >
            {task.priority}
          </WobblyBadge>

          {task.due_date && (
            <div className="flex items-center gap-1 text-xs font-heading opacity-75">
              <Calendar className="w-3.5 h-3.5" />
              <span>{task.due_date}</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <p className={`font-heading text-lg leading-snug break-words ${task.completed ? 'line-through opacity-50' : 'font-bold'}`}>
          {task.title}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-ink/20">
        <button
          type="button"
          onClick={() => onToggle && onToggle(task)}
          className={`flex items-center gap-1.5 text-xs font-heading font-bold px-2.5 py-1 border border-ink wobbly-sm transition-transform active:scale-95 ${
            task.completed ? 'bg-emerald-600 text-white' : 'bg-paper text-ink hover:bg-white'
          }`}
        >
          <div className={`w-4 h-4 border border-ink rounded-sm flex items-center justify-center ${task.completed ? 'bg-emerald-600 text-white' : 'bg-white'}`}>
            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>{task.completed ? 'Done!' : 'Mark Done'}</span>
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-1 hover:text-accent-red transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
