import React, { useState } from 'react';
import { SketchModal } from '../ui/SketchModal';
import { WobblyButton } from '../ui/WobblyButton';
import { contactsApi, dealsApi, tasksApi } from '../../services/api';
import { Users, DollarSign, CheckSquare } from 'lucide-react';

export function QuickAddModal({ isOpen, onClose, onCreated }) {
  const [activeTab, setActiveTab] = useState('deal'); // 'deal' | 'contact' | 'task'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Deal Form State
  const [dealForm, setDealForm] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'Lead In',
    priority: 'Medium',
    probability: 40,
    expected_close: '',
    notes: '',
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    status: 'New',
    lead_value: '',
    tags: '',
    notes: '',
  });

  // Task Form State
  const [taskForm, setTaskForm] = useState({
    title: '',
    due_date: '',
    priority: 'Medium',
    color: 'yellow',
  });

  const handleSubmitDeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dealsApi.create({
        ...dealForm,
        value: parseFloat(dealForm.value) || 0,
        probability: parseInt(dealForm.probability, 10) || 40,
      });
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tagsArray = contactForm.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      await contactsApi.create({
        ...contactForm,
        lead_value: parseFloat(contactForm.lead_value) || 0,
        tags: tagsArray,
      });
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await tasksApi.create(taskForm);
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SketchModal
      isOpen={isOpen}
      onClose={onClose}
      title="Scribble New Entry"
      subtitle="Quickly add a deal, contact, or sticky note reminder"
    >
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 border-b-2 border-ink pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('deal')}
          className={`flex items-center gap-2 px-4 py-2 font-heading font-bold text-base border-2 border-ink transition-all ${
            activeTab === 'deal'
              ? 'bg-postit-yellow text-ink wobbly shadow-hard-sm -rotate-1'
              : 'bg-paper text-ink/70 hover:bg-muted-paper/40 wobbly-sm'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>New Deal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 font-heading font-bold text-base border-2 border-ink transition-all ${
            activeTab === 'contact'
              ? 'bg-postit-yellow text-ink wobbly shadow-hard-sm rotate-1'
              : 'bg-paper text-ink/70 hover:bg-muted-paper/40 wobbly-sm'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>New Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('task')}
          className={`flex items-center gap-2 px-4 py-2 font-heading font-bold text-base border-2 border-ink transition-all ${
            activeTab === 'task'
              ? 'bg-postit-yellow text-ink wobbly shadow-hard-sm -rotate-1'
              : 'bg-paper text-ink/70 hover:bg-muted-paper/40 wobbly-sm'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Sticky Note</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-100 border-2 border-rose-800 text-rose-950 font-heading font-bold text-sm wobbly-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 1. Deal Form */}
      {activeTab === 'deal' && (
        <form onSubmit={handleSubmitDeal} className="space-y-4">
          <div>
            <label className="block font-heading font-bold text-sm text-ink mb-1">
              Deal Title *
            </label>
            <input
              type="text"
              required
              value={dealForm.title}
              onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
              placeholder="e.g. Enterprise Cloud Deployment"
              className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={dealForm.company}
                onChange={(e) => setDealForm({ ...dealForm, company: e.target.value })}
                placeholder="e.g. Apex Dynamics"
                className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Deal Value ($ USD) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={dealForm.value}
                onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                placeholder="e.g. 45000"
                className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Initial Stage
              </label>
              <select
                value={dealForm.stage}
                onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              >
                <option value="Lead In">Lead In</option>
                <option value="Contact Made">Contact Made</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Priority
              </label>
              <select
                value={dealForm.priority}
                onChange={(e) => setDealForm({ ...dealForm, priority: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Expected Close
              </label>
              <input
                type="date"
                value={dealForm.expected_close}
                onChange={(e) => setDealForm({ ...dealForm, expected_close: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-heading font-bold text-sm text-ink mb-1">
              Notes & Next Steps
            </label>
            <textarea
              rows={2}
              value={dealForm.notes}
              onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
              placeholder="Handwritten notes on contract discussion..."
              className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <WobblyButton variant="ghost" onClick={onClose}>
              Cancel
            </WobblyButton>
            <WobblyButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating Deal...' : 'Create Deal'}
            </WobblyButton>
          </div>
        </form>
      )}

      {/* 2. Contact Form */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSubmitContact} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Jane Cooper"
                className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Company *
              </label>
              <input
                type="text"
                required
                value={contactForm.company}
                onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                placeholder="Acme Dynamics"
                className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={contactForm.title}
                onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                placeholder="VP of Engineering"
                className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="jane@acmedynamics.com"
                className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Phone
              </label>
              <input
                type="text"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="+1 555-0192"
                className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Lead Status
              </label>
              <select
                value={contactForm.status}
                onChange={(e) => setContactForm({ ...contactForm, status: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Customer">Customer</option>
                <option value="Churned">Churned</option>
              </select>
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Lead Value ($)
              </label>
              <input
                type="number"
                value={contactForm.lead_value}
                onChange={(e) => setContactForm({ ...contactForm, lead_value: e.target.value })}
                placeholder="35000"
                className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-heading font-bold text-sm text-ink mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={contactForm.tags}
              onChange={(e) => setContactForm({ ...contactForm, tags: e.target.value })}
              placeholder="Enterprise, SaaS, High-Priority"
              className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <WobblyButton variant="ghost" onClick={onClose}>
              Cancel
            </WobblyButton>
            <WobblyButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Adding Contact...' : 'Save Contact'}
            </WobblyButton>
          </div>
        </form>
      )}

      {/* 3. Task Form */}
      {activeTab === 'task' && (
        <form onSubmit={handleSubmitTask} className="space-y-4">
          <div>
            <label className="block font-heading font-bold text-sm text-ink mb-1">
              Sticky Note Reminder *
            </label>
            <textarea
              required
              rows={3}
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="e.g. Call CFO regarding security clearance questions..."
              className="w-full px-3.5 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Priority
              </label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              >
                <option value="Urgent">Urgent 🔥</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-heading font-bold text-sm text-ink mb-1">
                Post-It Color
              </label>
              <select
                value={taskForm.color}
                onChange={(e) => setTaskForm({ ...taskForm, color: e.target.value })}
                className="w-full px-3 py-2 bg-paper border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
              >
                <option value="yellow">Yellow 🟨</option>
                <option value="pink">Pink 🌸</option>
                <option value="green">Mint 🌿</option>
                <option value="blue">Blue 💧</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <WobblyButton variant="ghost" onClick={onClose}>
              Cancel
            </WobblyButton>
            <WobblyButton type="submit" variant="yellow" disabled={loading}>
              {loading ? 'Pinning...' : '📌 Pin to Board'}
            </WobblyButton>
          </div>
        </form>
      )}
    </SketchModal>
  );
}
