import React, { useState } from 'react';
import { EditorialModal } from '../editorial/EditorialModal';
import { EditorialButton } from '../editorial/EditorialButton';
import { contactsApi, dealsApi, tasksApi } from '../../services/api';

export function QuickAddModal({ isOpen, onClose, onCreated }) {
  const [activeTab, setActiveTab] = useState('deal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dealForm, setDealForm] = useState({
    title: '', company: '', value: '', stage: 'Lead In',
    priority: 'Medium', probability: 40, expected_close: '', notes: '',
  });

  const [contactForm, setContactForm] = useState({
    name: '', company: '', title: '', email: '', phone: '',
    status: 'New', lead_value: '', tags: '', notes: '',
  });

  const [taskForm, setTaskForm] = useState({
    title: '', due_date: '', priority: 'Medium', color: 'yellow',
  });

  const handleSubmitDeal = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await dealsApi.create({
        ...dealForm,
        value: parseFloat(dealForm.value) || 0,
        probability: parseInt(dealForm.probability, 10) || 40,
      });
      onCreated && onCreated();
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const tagsArray = contactForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      await contactsApi.create({
        ...contactForm,
        lead_value: parseFloat(contactForm.lead_value) || 0,
        tags: tagsArray,
      });
      onCreated && onCreated();
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await tasksApi.create(taskForm);
      onCreated && onCreated();
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const tabClass = (id) =>
    `px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.1em] border-b-2 transition-colors ${
      activeTab === id
        ? 'text-foreground border-accent'
        : 'text-neutral-400 border-transparent hover:text-foreground hover:border-neutral-300'
    }`;

  return (
    <EditorialModal
      isOpen={isOpen}
      onClose={onClose}
      title="File New Report"
      subtitle="Create a new deal, contact, or task entry"
      size="md"
    >
      {/* Tab Switcher */}
      <div className="flex gap-0 border-b border-neutral-200 mb-6 -mt-1">
        <button type="button" onClick={() => setActiveTab('deal')} className={tabClass('deal')}>
          New Deal
        </button>
        <button type="button" onClick={() => setActiveTab('contact')} className={tabClass('contact')}>
          New Contact
        </button>
        <button type="button" onClick={() => setActiveTab('task')} className={tabClass('task')}>
          New Task
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-newsprint border-l-4 border-accent font-ui text-sm text-foreground">
          {error}
        </div>
      )}

      {/* Deal Form */}
      {activeTab === 'deal' && (
        <form onSubmit={handleSubmitDeal} className="space-y-5">
          <div>
            <label className="editorial-label text-neutral-500 block mb-2">Deal Title *</label>
            <input type="text" required value={dealForm.title}
              onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
              placeholder="Enterprise Cloud Deployment"
              className="input-editorial" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Company *</label>
              <input type="text" required value={dealForm.company}
                onChange={(e) => setDealForm({ ...dealForm, company: e.target.value })}
                placeholder="Apex Dynamics"
                className="input-editorial" />
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Value (USD) *</label>
              <input type="number" required min="0" step="500" value={dealForm.value}
                onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                placeholder="45000"
                className="input-editorial" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Stage</label>
              <select value={dealForm.stage}
                onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
                className="select-editorial">
                {['Lead In','Contact Made','Meeting Scheduled','Proposal Sent','Negotiation','Won','Lost'].map(s =>
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Priority</label>
              <select value={dealForm.priority}
                onChange={(e) => setDealForm({ ...dealForm, priority: e.target.value })}
                className="select-editorial">
                {['Low','Medium','High','Urgent'].map(p =>
                  <option key={p} value={p}>{p}</option>
                )}
              </select>
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Expected Close</label>
              <input type="date" value={dealForm.expected_close}
                onChange={(e) => setDealForm({ ...dealForm, expected_close: e.target.value })}
                className="input-editorial" />
            </div>
          </div>
          <div>
            <label className="editorial-label text-neutral-500 block mb-2">Notes</label>
            <textarea rows={2} value={dealForm.notes}
              onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
              placeholder="Contract discussion notes..."
              className="textarea-editorial" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-neutral-200">
            <EditorialButton variant="ghost" onClick={onClose}>Cancel</EditorialButton>
            <EditorialButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Filing...' : 'File Deal'}
            </EditorialButton>
          </div>
        </form>
      )}

      {/* Contact Form */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSubmitContact} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Full Name *</label>
              <input type="text" required value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Jane Cooper"
                className="input-editorial" />
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Company *</label>
              <input type="text" required value={contactForm.company}
                onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                placeholder="Acme Dynamics"
                className="input-editorial" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Job Title *</label>
              <input type="text" required value={contactForm.title}
                onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                placeholder="VP of Engineering"
                className="input-editorial" />
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Email *</label>
              <input type="email" required value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="jane@acmedynamics.com"
                className="input-editorial" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Phone</label>
              <input type="text" value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="+1 555-0192"
                className="input-editorial" />
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Status</label>
              <select value={contactForm.status}
                onChange={(e) => setContactForm({ ...contactForm, status: e.target.value })}
                className="select-editorial">
                {['New','Contacted','Qualified','Proposal','Customer','Churned'].map(s =>
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Lead Value ($)</label>
              <input type="number" value={contactForm.lead_value}
                onChange={(e) => setContactForm({ ...contactForm, lead_value: e.target.value })}
                placeholder="35000"
                className="input-editorial" />
            </div>
          </div>
          <div>
            <label className="editorial-label text-neutral-500 block mb-2">Tags (comma separated)</label>
            <input type="text" value={contactForm.tags}
              onChange={(e) => setContactForm({ ...contactForm, tags: e.target.value })}
              placeholder="Enterprise, SaaS, High-Priority"
              className="input-editorial" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-neutral-200">
            <EditorialButton variant="ghost" onClick={onClose}>Cancel</EditorialButton>
            <EditorialButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Filing...' : 'File Contact'}
            </EditorialButton>
          </div>
        </form>
      )}

      {/* Task Form */}
      {activeTab === 'task' && (
        <form onSubmit={handleSubmitTask} className="space-y-5">
          <div>
            <label className="editorial-label text-neutral-500 block mb-2">Task Description *</label>
            <textarea required rows={3} value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="Call CFO regarding security clearance..."
              className="textarea-editorial" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Due Date</label>
              <input type="date" value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                className="input-editorial" />
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Priority</label>
              <select value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="select-editorial">
                {['Urgent','High','Medium','Low'].map(p =>
                  <option key={p} value={p}>{p}</option>
                )}
              </select>
            </div>
            <div>
              <label className="editorial-label text-neutral-500 block mb-2">Color Code</label>
              <select value={taskForm.color}
                onChange={(e) => setTaskForm({ ...taskForm, color: e.target.value })}
                className="select-editorial">
                {['yellow','pink','green','blue'].map(c =>
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                )}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-neutral-200">
            <EditorialButton variant="ghost" onClick={onClose}>Cancel</EditorialButton>
            <EditorialButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Filing...' : 'File Task'}
            </EditorialButton>
          </div>
        </form>
      )}
    </EditorialModal>
  );
}
