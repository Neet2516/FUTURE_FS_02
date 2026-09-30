import React, { useState, useRef, useEffect } from 'react';
import { EditorialModal } from '../editorial/EditorialModal';
import { EditorialButton } from '../editorial/EditorialButton';
import { contactsApi, dealsApi, tasksApi } from '../../services/api';
import { useToast } from './Toast';

// ── Input constraint constants ──────────────────────────────────────
const CONSTRAINTS = {
  dealTitle: { maxLength: 100, minLength: 2 },
  company: { maxLength: 80, minLength: 1 },
  value: { min: 0, max: 99_999_999, step: 100 },
  probability: { min: 0, max: 100 },
  notes: { maxLength: 2000 },
  contactName: { maxLength: 50, minLength: 2 },
  contactTitle: { maxLength: 80 },
  email: { maxLength: 100 },
  phone: { maxLength: 20 },
  leadValue: { min: 0, max: 99_999_999 },
  tags: { maxLength: 200 },
  taskTitle: { maxLength: 200, minLength: 2 },
};

const CharCount = ({ value, max, warnAt }) => {
  const len = value?.length || 0;
  const warn = len >= (warnAt || max * 0.85);
  if (len === 0) return null;
  return (
    <span className={`font-data text-[10px] ${warn ? 'text-accent font-bold' : 'text-neutral-400'}`}>
      {len}/{max}
    </span>
  );
};

const Field = ({ label, error, children, count }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="editorial-label text-neutral-500">{label}</label>
      {count}
    </div>
    {children}
    {error && <p className="mt-1 font-ui text-[11px] text-accent font-semibold">{error}</p>}
  </div>
);

export function QuickAddModal({ isOpen, onClose, onCreated }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('deal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Field refs for seamless keyboard navigation
  const dealTitleRef = useRef(null);
  const dealCompanyRef = useRef(null);
  const dealValueRef = useRef(null);
  const dealCloseRef = useRef(null);
  const dealNotesRef = useRef(null);

  const contactNameRef = useRef(null);
  const contactCompanyRef = useRef(null);
  const contactTitleRef = useRef(null);
  const contactEmailRef = useRef(null);
  const contactPhoneRef = useRef(null);
  const contactLeadValueRef = useRef(null);

  const taskTitleRef = useRef(null);
  const taskDateRef = useRef(null);

  // Auto-focus first input on modal open or tab switch
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (activeTab === 'deal') dealTitleRef.current?.focus();
        else if (activeTab === 'contact') contactNameRef.current?.focus();
        else if (activeTab === 'task') taskTitleRef.current?.focus();
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTab]);

  // Advance to next field on Enter; submit on Ctrl+Enter
  const handleAdvance = (e, nextRef, submitFn) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitFn?.(e);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      } else if (submitFn) {
        submitFn(e);
      }
    }
  };

  const [dealForm, setDealForm] = useState({
    title: '', company: '', value: '', stage: 'Lead In',
    priority: 'Medium', probability: 50, expected_close: '', notes: '',
  });

  const [contactForm, setContactForm] = useState({
    name: '', company: '', title: '', email: '', phone: '',
    status: 'New', lead_value: '', tags: '', notes: '',
  });

  const [taskForm, setTaskForm] = useState({
    title: '', due_date: '', priority: 'Medium', color: 'yellow',
  });

  const resetForms = () => {
    setDealForm({ title: '', company: '', value: '', stage: 'Lead In', priority: 'Medium', probability: 50, expected_close: '', notes: '' });
    setContactForm({ name: '', company: '', title: '', email: '', phone: '', status: 'New', lead_value: '', tags: '', notes: '' });
    setTaskForm({ title: '', due_date: '', priority: 'Medium', color: 'yellow' });
    setError(null);
  };

  const handleClose = () => { resetForms(); onClose(); };

  const handleSubmitDeal = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await dealsApi.create({
        ...dealForm,
        value: parseFloat(dealForm.value) || 0,
        probability: Math.min(100, Math.max(0, parseInt(dealForm.probability, 10) || 50)),
      });
      toast.success(`Deal "${dealForm.title}" filed to pipeline.`);
      onCreated?.();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const tagsArray = contactForm.tags.split(',').map((t) => t.trim()).filter(Boolean);
      await contactsApi.create({
        ...contactForm,
        lead_value: parseFloat(contactForm.lead_value) || 0,
        tags: tagsArray,
      });
      toast.success(`Contact "${contactForm.name}" enrolled in directory.`);
      onCreated?.();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await tasksApi.create(taskForm);
      toast.success('Task filed to ledger.');
      onCreated?.();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabClass = (id) =>
    `px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.1em] border-b-2 transition-colors ${
      activeTab === id
        ? 'text-foreground border-accent'
        : 'text-neutral-400 border-transparent hover:text-foreground hover:border-neutral-300'
    }`;

  return (
    <EditorialModal isOpen={isOpen} onClose={handleClose} title="File New Report" subtitle="Create a new deal, contact, or task entry" size="md">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-neutral-200 mb-6 -mt-1">
        <button type="button" onClick={() => { setActiveTab('deal'); setError(null); }} className={tabClass('deal')}>New Deal</button>
        <button type="button" onClick={() => { setActiveTab('contact'); setError(null); }} className={tabClass('contact')}>New Contact</button>
        <button type="button" onClick={() => { setActiveTab('task'); setError(null); }} className={tabClass('task')}>New Task</button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-newsprint border-l-4 border-accent font-ui text-xs font-semibold text-accent">
          {error}
        </div>
      )}

      {/* ── DEAL FORM ── */}
      {activeTab === 'deal' && (
        <form onSubmit={handleSubmitDeal} className="space-y-5">
          <Field
            label="Deal Title *"
            count={<CharCount value={dealForm.title} max={CONSTRAINTS.dealTitle.maxLength} />}
          >
            <input
              ref={dealTitleRef}
              type="text"
              required
              minLength={CONSTRAINTS.dealTitle.minLength}
              maxLength={CONSTRAINTS.dealTitle.maxLength}
              value={dealForm.title}
              onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
              onKeyDown={(e) => handleAdvance(e, dealCompanyRef, handleSubmitDeal)}
              placeholder="Enterprise Cloud Deployment"
              className="input-editorial"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Company *">
              <input
                ref={dealCompanyRef}
                type="text"
                required
                minLength={1}
                maxLength={CONSTRAINTS.company.maxLength}
                value={dealForm.company}
                onChange={(e) => setDealForm({ ...dealForm, company: e.target.value })}
                onKeyDown={(e) => handleAdvance(e, dealValueRef, handleSubmitDeal)}
                placeholder="Apex Dynamics"
                className="input-editorial"
              />
            </Field>
            <Field label="Value (USD) *">
              <input
                ref={dealValueRef}
                type="number"
                required
                min={CONSTRAINTS.value.min}
                max={CONSTRAINTS.value.max}
                step={CONSTRAINTS.value.step}
                value={dealForm.value}
                onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                onKeyDown={(e) => handleAdvance(e, dealCloseRef, handleSubmitDeal)}
                placeholder="45000"
                className="input-editorial"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Stage">
              <select
                value={dealForm.stage}
                onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
                className="select-editorial"
              >
                {['Lead In','Contact Made','Meeting Scheduled','Proposal Sent','Negotiation','Won','Lost'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={dealForm.priority}
                onChange={(e) => setDealForm({ ...dealForm, priority: e.target.value })}
                className="select-editorial"
              >
                {['Low','Medium','High','Urgent'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Probability (%)">
              <input
                type="number"
                min={CONSTRAINTS.probability.min}
                max={CONSTRAINTS.probability.max}
                value={dealForm.probability}
                onChange={(e) => setDealForm({ ...dealForm, probability: Math.min(100, Math.max(0, Number(e.target.value))) })}
                className="input-editorial"
              />
            </Field>
          </div>

          <Field label="Expected Close Date">
            <input
              ref={dealCloseRef}
              type="date"
              value={dealForm.expected_close}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDealForm({ ...dealForm, expected_close: e.target.value })}
              onKeyDown={(e) => handleAdvance(e, dealNotesRef, handleSubmitDeal)}
              className="input-editorial"
            />
          </Field>

          <Field
            label="Notes"
            count={<CharCount value={dealForm.notes} max={CONSTRAINTS.notes.maxLength} />}
          >
            <textarea
              ref={dealNotesRef}
              rows={2}
              maxLength={CONSTRAINTS.notes.maxLength}
              value={dealForm.notes}
              onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSubmitDeal(e);
                }
              }}
              placeholder="Key context, requirements, or negotiation notes... (Ctrl+Enter to save)"
              className="textarea-editorial"
            />
          </Field>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
            <div className="font-data text-[10px] text-neutral-400 hidden sm:flex items-center gap-1.5">
              <span><kbd className="bg-neutral-200 text-neutral-700 px-1 py-0.5 border border-neutral-300">Enter</kbd> Next</span>
              <span>•</span>
              <span><kbd className="bg-neutral-200 text-neutral-700 px-1 py-0.5 border border-neutral-300">Ctrl+Enter</kbd> Save</span>
              <span>•</span>
              <span><kbd className="bg-neutral-200 text-neutral-700 px-1 py-0.5 border border-neutral-300">Esc</kbd> Cancel</span>
            </div>
            <div className="flex justify-end gap-3 w-full sm:w-auto">
              <EditorialButton variant="ghost" onClick={handleClose} type="button">Cancel</EditorialButton>
              <EditorialButton type="submit" variant="primary" disabled={loading}>
                {loading ? 'Filing...' : 'File Deal'}
              </EditorialButton>
            </div>
          </div>
        </form>
      )}

      {/* ── CONTACT FORM ── */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSubmitContact} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Full Name *"
              count={<CharCount value={contactForm.name} max={CONSTRAINTS.contactName.maxLength} />}
            >
              <input
                ref={contactNameRef}
                type="text"
                required
                minLength={CONSTRAINTS.contactName.minLength}
                maxLength={CONSTRAINTS.contactName.maxLength}
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                onKeyDown={(e) => handleAdvance(e, contactCompanyRef, handleSubmitContact)}
                placeholder="Jane Cooper"
                className="input-editorial"
              />
            </Field>
            <Field label="Company *">
              <input
                ref={contactCompanyRef}
                type="text"
                required
                minLength={1}
                maxLength={CONSTRAINTS.company.maxLength}
                value={contactForm.company}
                onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                onKeyDown={(e) => handleAdvance(e, contactTitleRef, handleSubmitContact)}
                placeholder="Acme Dynamics"
                className="input-editorial"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Job Title *">
              <input
                ref={contactTitleRef}
                type="text"
                required
                maxLength={CONSTRAINTS.contactTitle.maxLength}
                value={contactForm.title}
                onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                onKeyDown={(e) => handleAdvance(e, contactEmailRef, handleSubmitContact)}
                placeholder="VP of Engineering"
                className="input-editorial"
              />
            </Field>
            <Field label="Email *">
              <input
                ref={contactEmailRef}
                type="email"
                required
                maxLength={CONSTRAINTS.email.maxLength}
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                onKeyDown={(e) => handleAdvance(e, contactPhoneRef, handleSubmitContact)}
                placeholder="jane@acmedynamics.com"
                className="input-editorial"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Phone">
              <input
                ref={contactPhoneRef}
                type="tel"
                maxLength={CONSTRAINTS.phone.maxLength}
                pattern="[\+]?[\d\s\-\(\)]{0,20}"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                onKeyDown={(e) => handleAdvance(e, contactLeadValueRef, handleSubmitContact)}
                placeholder="+1 555-0192"
                className="input-editorial"
              />
            </Field>
            <Field label="Status">
              <select
                value={contactForm.status}
                onChange={(e) => setContactForm({ ...contactForm, status: e.target.value })}
                className="select-editorial"
              >
                {['New','Contacted','Qualified','Proposal','Customer','Churned'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Lead Value ($)">
              <input
                ref={contactLeadValueRef}
                type="number"
                min={CONSTRAINTS.leadValue.min}
                max={CONSTRAINTS.leadValue.max}
                step={100}
                value={contactForm.lead_value}
                onChange={(e) => setContactForm({ ...contactForm, lead_value: e.target.value })}
                className="input-editorial"
              />
            </Field>
          </div>

          <Field
            label="Tags (comma separated)"
            count={<CharCount value={contactForm.tags} max={CONSTRAINTS.tags.maxLength} />}
          >
            <input
              type="text"
              maxLength={CONSTRAINTS.tags.maxLength}
              value={contactForm.tags}
              onChange={(e) => setContactForm({ ...contactForm, tags: e.target.value })}
              placeholder="Enterprise, SaaS, High-Priority"
              className="input-editorial"
            />
          </Field>

          <Field
            label="Notes"
            count={<CharCount value={contactForm.notes} max={CONSTRAINTS.notes.maxLength} />}
          >
            <textarea
              rows={2}
              maxLength={CONSTRAINTS.notes.maxLength}
              value={contactForm.notes}
              onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSubmitContact(e);
                }
              }}
              placeholder="Key background, relationship context... (Ctrl+Enter to save)"
              className="textarea-editorial"
            />
          </Field>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
            <div className="font-data text-[10px] text-neutral-400 hidden sm:flex items-center gap-1.5">
              <span><kbd className="bg-neutral-200 text-neutral-700 px-1 py-0.5 border border-neutral-300">Enter</kbd> Next</span>
              <span>•</span>
              <span><kbd className="bg-neutral-200 text-neutral-700 px-1 py-0.5 border border-neutral-300">Ctrl+Enter</kbd> Save</span>
              <span>•</span>
              <span><kbd className="bg-neutral-200 text-neutral-700 px-1 py-0.5 border border-neutral-300">Esc</kbd> Cancel</span>
            </div>
            <div className="flex justify-end gap-3 w-full sm:w-auto">
              <EditorialButton variant="ghost" onClick={handleClose} type="button">Cancel</EditorialButton>
              <EditorialButton type="submit" variant="primary" disabled={loading}>
                {loading ? 'Filing...' : 'File Contact'}
              </EditorialButton>
            </div>
          </div>
        </form>
      )}

      {/* ── TASK FORM ── */}
      {activeTab === 'task' && (
        <form onSubmit={handleSubmitTask} className="space-y-5">
          <Field
            label="Task Description *"
            count={<CharCount value={taskForm.title} max={CONSTRAINTS.taskTitle.maxLength} />}
          >
            <textarea
              ref={taskTitleRef}
              required
              rows={3}
              minLength={CONSTRAINTS.taskTitle.minLength}
              maxLength={CONSTRAINTS.taskTitle.maxLength}
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSubmitTask(e);
                }
              }}
              placeholder="Call CFO regarding security clearance approval... (Ctrl+Enter to save)"
              className="textarea-editorial"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Due Date">
              <input
                ref={taskDateRef}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                className="input-editorial"
              />
            </Field>
            <Field label="Priority">
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="select-editorial"
              >
                {['Urgent','High','Medium','Low'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Color Code">
              <select
                value={taskForm.color}
                onChange={(e) => setTaskForm({ ...taskForm, color: e.target.value })}
                className="select-editorial"
              >
                {['yellow','pink','green','blue'].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
            <div className="font-data text-[10px] text-neutral-400 hidden sm:flex items-center gap-1.5">
              <span><kbd className="bg-neutral-200 text-neutral-700 px-1 py-0.5 border border-neutral-300">Ctrl+Enter</kbd> Save</span>
              <span>•</span>
              <span><kbd className="bg-neutral-200 text-neutral-700 px-1 py-0.5 border border-neutral-300">Esc</kbd> Cancel</span>
            </div>
            <div className="flex justify-end gap-3 w-full sm:w-auto">
              <EditorialButton variant="ghost" onClick={handleClose} type="button">Cancel</EditorialButton>
              <EditorialButton type="submit" variant="primary" disabled={loading}>
                {loading ? 'Filing...' : 'File Task'}
              </EditorialButton>
            </div>
          </div>
        </form>
      )}
    </EditorialModal>
  );
}
