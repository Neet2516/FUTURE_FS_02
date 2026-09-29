import React, { useEffect, useState } from 'react';
import { contactsApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { EditorialModal } from '../components/editorial/EditorialModal';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Briefcase,
  Trash2,
  FileText,
  DollarSign,
  History,
  Tag,
  ArrowUpRight,
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
      alert(`Failed to load contact record: ${err.message}`);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Strike this contact and associated records from the directory?')) return;
    try {
      await contactsApi.delete(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.contact?.id === id) {
        setSelectedContact(null);
      }
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
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

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'Customer':
        return 'dark';
      case 'Qualified':
      case 'Proposal':
        return 'accent';
      case 'Churned':
        return 'outline';
      default:
        return 'default';
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      {/* Directory Header Bar */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">
                SECTION 03 • ROLL OF ACCOUNTS
              </span>
              <EditorialBadge variant="dark" size="xs">
                {contacts.length} Records
              </EditorialBadge>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Client & Lead Directory
            </h2>
            <p className="font-body text-sm text-neutral-600">
              Verified corporate directory, relationship records and key contact dossiers
            </p>
          </div>

          <EditorialButton variant="primary" size="md" onClick={onQuickAdd}>
            <Plus className="w-4 h-4" />
            <span>+ Enroll Contact</span>
          </EditorialButton>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, organization, dispatch email, or role..."
              className="w-full pl-10 pr-4 py-2.5 bg-newsprint border border-foreground font-body text-sm outline-none focus:border-accent sharp-corners"
            />
          </div>
          <EditorialButton type="submit" variant="secondary" size="md">
            Query
          </EditorialButton>
        </form>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-300">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1 font-ui text-xs font-bold uppercase tracking-wider border transition-colors sharp-corners ${
                activeStatus === st
                  ? 'bg-foreground text-newsprint border-foreground'
                  : 'bg-transparent text-foreground border-neutral-300 hover:border-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <LoadingState message="Accessing commercial directory index..." />
      ) : contacts.length === 0 ? (
        <EmptyState
          title="No Records Found"
          description="We found no entries matching your specified filters. Enroll a new contact to index their dossier."
          actionLabel="Enroll Contact"
          onAction={onQuickAdd}
          icon="📇"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => {
            const tags = parseTags(contact.tags);

            return (
              <div
                key={contact.id}
                onClick={() => handleOpenDetail(contact)}
                className="bg-newsprint border border-foreground p-5 sharp-corners flex flex-col justify-between cursor-pointer hover:shadow-hard transition-all duration-150 group"
              >
                <div>
                  {/* Top Bar: Status & Delete */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <EditorialBadge variant={getStatusBadgeVariant(contact.status)} size="xs">
                      {contact.status}
                    </EditorialBadge>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(contact.id, e)}
                      title="Strike record from directory"
                      className="p-1 text-neutral-400 hover:text-accent transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Name and Title */}
                  <h3 className="font-display text-xl font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
                    {contact.name}
                  </h3>
                  <div className="flex items-center gap-1.5 font-ui text-xs font-semibold text-neutral-700 mt-1">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{contact.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-display text-sm font-bold text-foreground mt-1">
                    <Building className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{contact.company}</span>
                  </div>

                  {/* Contact Info Ledger */}
                  <div className="mt-4 space-y-1.5 text-xs font-body text-neutral-700 pt-3 border-t border-neutral-300">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <a
                        href={`mailto:${contact.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline hover:text-accent truncate font-data text-[11px]"
                      >
                        {contact.email}
                      </a>
                    </div>

                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                        <span className="font-data text-[11px]">{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes Excerpt */}
                  {contact.notes && (
                    <div className="mt-3 p-2.5 bg-neutral-100 border-l-2 border-foreground text-xs font-body italic text-neutral-700 line-clamp-2">
                      "{contact.notes}"
                    </div>
                  )}
                </div>

                {/* Footer: Tags & Valuation */}
                <div className="mt-5 pt-3 border-t border-neutral-300 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 2).map((tg, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-data px-1.5 py-0.5 bg-neutral-200 border border-neutral-400 uppercase"
                      >
                        #{tg}
                      </span>
                    ))}
                    {tags.length > 2 && (
                      <span className="text-[10px] font-data text-neutral-500">
                        +{tags.length - 2}
                      </span>
                    )}
                  </div>

                  {contact.lead_value > 0 && (
                    <span className="font-data font-bold text-sm text-foreground">
                      {formatCurrency(contact.lead_value)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact Dossier Detail Modal */}
      {selectedContact && (
        <EditorialModal
          isOpen={Boolean(selectedContact)}
          onClose={() => setSelectedContact(null)}
          title={selectedContact.contact.name}
          subtitle={`${selectedContact.contact.title} • ${selectedContact.contact.company}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Status & Valuation Ledger */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-foreground bg-neutral-100">
              <div>
                <span className="editorial-label text-neutral-500 block mb-1">
                  CURRENT STANDING
                </span>
                <EditorialBadge
                  variant={getStatusBadgeVariant(selectedContact.contact.status)}
                  size="md"
                >
                  {selectedContact.contact.status}
                </EditorialBadge>
              </div>

              <div>
                <span className="editorial-label text-neutral-500 block mb-1">
                  PROJECTED VALUATION
                </span>
                <span className="font-data text-xl font-bold text-foreground">
                  {formatCurrency(selectedContact.contact.lead_value)}
                </span>
              </div>
            </div>

            {/* Direct Comms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 border border-neutral-300 bg-newsprint">
                <span className="editorial-label text-neutral-500 block mb-1">
                  COMMUNICATION ADDRESS
                </span>
                <a
                  href={`mailto:${selectedContact.contact.email}`}
                  className="font-data text-sm font-semibold text-foreground hover:underline hover:text-accent"
                >
                  {selectedContact.contact.email}
                </a>
              </div>

              <div className="p-3 border border-neutral-300 bg-newsprint">
                <span className="editorial-label text-neutral-500 block mb-1">
                  PHONE CONTACT
                </span>
                <span className="font-data text-sm text-foreground">
                  {selectedContact.contact.phone || 'No phone recorded'}
                </span>
              </div>
            </div>

            {/* Notes Section */}
            {selectedContact.contact.notes && (
              <div className="p-4 border border-foreground bg-newsprint">
                <h5 className="font-ui text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  <span>Dossier Memorandum</span>
                </h5>
                <p className="font-body text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.contact.notes}
                </p>
              </div>
            )}

            {/* Associated Deals */}
            <div>
              <div className="flex items-center justify-between border-b border-foreground pb-2 mb-3">
                <h5 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  <span>Associated Commercial Deals ({selectedContact.deals.length})</span>
                </h5>
              </div>

              {selectedContact.deals.length === 0 ? (
                <p className="text-sm font-body text-neutral-500 italic">
                  No commercial deals linked to this account dossier.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedContact.deals.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 border border-foreground bg-newsprint flex items-center justify-between text-sm sharp-corners"
                    >
                      <div>
                        <p className="font-display font-bold text-foreground">{d.title}</p>
                        <p className="font-data text-xs text-neutral-500">Stage: {d.stage}</p>
                      </div>
                      <span className="font-data font-bold text-foreground">
                        {formatCurrency(d.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* History Feed */}
            <div>
              <div className="flex items-center justify-between border-b border-foreground pb-2 mb-3">
                <h5 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <History className="w-4 h-4 text-foreground" />
                  <span>Recorded Dispatches ({selectedContact.activities.length})</span>
                </h5>
              </div>

              {selectedContact.activities.length === 0 ? (
                <p className="text-sm font-body text-neutral-500 italic">
                  No logged interactions recorded yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedContact.activities.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 border border-neutral-300 bg-neutral-100 text-xs font-body sharp-corners"
                    >
                      <div className="flex items-center justify-between font-ui font-bold uppercase text-foreground mb-1">
                        <span>{a.activity_type}</span>
                        <span className="font-data text-[10px] text-neutral-500">
                          {a.created_at.split('T')[0] || a.created_at.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-neutral-700">{a.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-foreground">
              <EditorialButton variant="primary" size="md" onClick={() => setSelectedContact(null)}>
                Close Dossier
              </EditorialButton>
            </div>
          </div>
        </EditorialModal>
      )}
    </div>
  );
}
