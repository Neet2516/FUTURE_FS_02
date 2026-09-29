import React, { useEffect, useState } from 'react';
import { contactsApi } from '../services/api';
import { WobblyCard } from '../components/ui/WobblyCard';
import { WobblyButton } from '../components/ui/WobblyButton';
import { WobblyBadge } from '../components/ui/WobblyBadge';
import { SketchModal } from '../components/ui/SketchModal';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Tag,
  FileText,
  DollarSign,
  Trash2,
  ExternalLink,
  Briefcase,
  History,
} from 'lucide-react';

const STATUS_FILTERS = [
  'All',
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Customer',
  'Churned',
];

export function ContactsPage({ onQuickAdd }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsApi.list({ search, status: activeStatus });
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [activeStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContacts();
  };

  const handleOpenDetail = async (contact) => {
    try {
      setDetailLoading(true);
      const detail = await contactsApi.get(contact.id);
      setSelectedContact(detail);
    } catch (err) {
      alert(`Failed to load contact details: ${err.message}`);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this contact and all attached notes?')) return;
    try {
      await contactsApi.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedContact?.contact?.id === id) {
        setSelectedContact(null);
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const parseTags = (tagsRaw) => {
    if (!tagsRaw) return [];
    try {
      return JSON.parse(tagsRaw);
    } catch {
      return [];
    }
  };

  const getStatusVariant = (st) => {
    switch (st) {
      case 'Customer': return 'green';
      case 'Qualified': return 'blue';
      case 'Proposal': return 'yellow';
      case 'Churned': return 'red';
      default: return 'neutral';
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-paper border-2 border-ink wobbly p-5 shadow-hard space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-heading font-bold text-ink">
              Contacts & Lead Directory
            </h3>
            <p className="text-sm font-body text-ink/70">
              Manage client relationships, key stakeholders & prospect notes
            </p>
          </div>

          <WobblyButton variant="primary" onClick={onQuickAdd}>
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Contact</span>
          </WobblyButton>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, email, or role..."
              className="w-full pl-10 pr-4 py-2 bg-[#fdfbf7] border-2 border-ink wobbly-sm font-body text-base outline-none focus:shadow-hard-sm"
            />
          </div>
          <WobblyButton type="submit" variant="secondary" size="md">
            Search
          </WobblyButton>
        </form>

        {/* Status Pill Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-ink/30">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1 font-heading font-bold text-sm border transition-all ${
                activeStatus === st
                  ? 'bg-ink text-paper border-ink wobbly shadow-hard-sm'
                  : 'bg-paper text-ink/70 border-ink/40 hover:border-ink hover:bg-muted-paper/30 wobbly-sm'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <LoadingState message="Fetching address book..." />
      ) : contacts.length === 0 ? (
        <EmptyState
          title="No Contacts Found"
          description="We couldn't find any contacts matching your criteria. Scribble a new one!"
          actionLabel="Add Contact"
          onAction={onQuickAdd}
          icon="📇"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact, idx) => {
            const tags = parseTags(contact.tags);
            const rotations = ['rotate-[0.3deg]', '-rotate-[0.4deg]', 'rotate-0', '-rotate-[0.2deg]'];
            const rot = rotations[idx % rotations.length];

            return (
              <WobblyCard
                key={contact.id}
                hoverable
                onClick={() => handleOpenDetail(contact)}
                className={`p-5 flex flex-col justify-between ${rot}`}
              >
                <div>
                  {/* Top Bar: Status & Delete */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <WobblyBadge variant={getStatusVariant(contact.status)} size="sm">
                      {contact.status}
                    </WobblyBadge>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(contact.id, e)}
                      title="Delete contact"
                      className="p-1 text-ink/40 hover:text-accent-red transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Name and Title */}
                  <h4 className="text-xl font-heading font-bold text-ink leading-tight">
                    {contact.name}
                  </h4>
                  <p className="text-sm font-body text-ink/75 flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-secondary-blue" />
                    <span>{contact.title}</span>
                  </p>

                  <div className="flex items-center gap-1.5 text-sm font-heading font-bold text-ink mt-1">
                    <Building className="w-3.5 h-3.5 text-ink/70" />
                    <span>{contact.company}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3.5 space-y-1.5 text-xs font-body text-ink/80 pt-3 border-t border-dashed border-ink/20">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-ink/60" />
                      <a
                        href={`mailto:${contact.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline hover:text-secondary-blue truncate"
                      >
                        {contact.email}
                      </a>
                    </div>

                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-ink/60" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes Preview */}
                  {contact.notes && (
                    <div className="mt-3 p-2 bg-[#fffdfa] border border-ink/30 wobbly-sm text-xs font-body italic text-ink/80 line-clamp-2">
                      "{contact.notes}"
                    </div>
                  )}
                </div>

                {/* Footer: Tags and Lead Value */}
                <div className="mt-4 pt-3 border-t border-ink/20 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 2).map((tg, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-heading font-bold px-1.5 py-0.2 bg-muted-paper/50 border border-ink wobbly-badge"
                      >
                        #{tg}
                      </span>
                    ))}
                    {tags.length > 2 && (
                      <span className="text-[10px] font-heading font-bold text-ink/60">
                        +{tags.length - 2}
                      </span>
                    )}
                  </div>

                  {contact.lead_value > 0 && (
                    <span className="font-heading font-bold text-sm text-secondary-blue">
                      {formatCurrency(contact.lead_value)}
                    </span>
                  )}
                </div>
              </WobblyCard>
            );
          })}
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <SketchModal
          isOpen={Boolean(selectedContact)}
          onClose={() => setSelectedContact(null)}
          title={selectedContact.contact.name}
          subtitle={`${selectedContact.contact.title} at ${selectedContact.contact.company}`}
        >
          <div className="space-y-6">
            {/* Status & Value Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-postit-yellow/60 border-2 border-ink wobbly-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading font-bold uppercase text-ink/70">Status:</span>
                <WobblyBadge variant={getStatusVariant(selectedContact.contact.status)}>
                  {selectedContact.contact.status}
                </WobblyBadge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-heading font-bold uppercase text-ink/70">Potential Value:</span>
                <span className="text-lg font-heading font-bold text-secondary-blue">
                  {formatCurrency(selectedContact.contact.lead_value)}
                </span>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
              <div className="p-3 bg-paper border border-ink wobbly-sm">
                <span className="font-heading font-bold text-xs uppercase text-ink/60 block mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${selectedContact.contact.email}`}
                  className="text-secondary-blue hover:underline font-bold text-base"
                >
                  {selectedContact.contact.email}
                </a>
              </div>

              <div className="p-3 bg-paper border border-ink wobbly-sm">
                <span className="font-heading font-bold text-xs uppercase text-ink/60 block mb-1">
                  Phone
                </span>
                <span className="text-base text-ink">
                  {selectedContact.contact.phone || 'None recorded'}
                </span>
              </div>
            </div>

            {/* Notes Section */}
            {selectedContact.contact.notes && (
              <div className="p-4 bg-paper border-2 border-ink wobbly-sm">
                <h5 className="font-heading font-bold text-sm text-ink mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-accent-red" />
                  <span>Account Notes</span>
                </h5>
                <p className="font-body text-base text-ink/90 whitespace-pre-wrap">
                  {selectedContact.contact.notes}
                </p>
              </div>
            )}

            {/* Associated Deals */}
            <div>
              <h5 className="font-heading font-bold text-lg text-ink mb-2 flex items-center gap-1.5">
                <DollarSign className="w-5 h-5 text-secondary-blue" />
                <span>Associated Deals ({selectedContact.deals.length})</span>
              </h5>

              {selectedContact.deals.length === 0 ? (
                <p className="text-sm font-body text-ink/60 italic">
                  No deals linked to this contact.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedContact.deals.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 bg-paper border border-ink wobbly-sm flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-heading font-bold text-ink">{d.title}</p>
                        <p className="text-xs font-body text-ink/70">Stage: {d.stage}</p>
                      </div>
                      <span className="font-heading font-bold text-secondary-blue">
                        {formatCurrency(d.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity History */}
            <div>
              <h5 className="font-heading font-bold text-lg text-ink mb-2 flex items-center gap-1.5">
                <History className="w-5 h-5 text-amber-600" />
                <span>Recent History ({selectedContact.activities.length})</span>
              </h5>

              {selectedContact.activities.length === 0 ? (
                <p className="text-sm font-body text-ink/60 italic">
                  No logged interactions yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedContact.activities.map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 bg-[#f5f1e8] border border-ink/40 wobbly-sm text-xs font-body"
                    >
                      <div className="flex items-center justify-between font-heading font-bold text-ink mb-0.5">
                        <span>{a.activity_type}</span>
                        <span className="text-[10px] text-ink/60">
                          {a.created_at.split('T')[0] || a.created_at.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-ink/80">{a.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <WobblyButton variant="primary" onClick={() => setSelectedContact(null)}>
                Close
              </WobblyButton>
            </div>
          </div>
        </SketchModal>
      )}
    </div>
  );
}
