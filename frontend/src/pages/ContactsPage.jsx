import React, { useEffect, useState, useCallback } from 'react';
import { contactsApi } from '../services/api';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { EditorialModal } from '../components/editorial/EditorialModal';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import { formatCurrency, formatRelativeTime } from '../utils/format';
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
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  Edit3,
  Check,
  X,
} from 'lucide-react';

const STATUS_FILTERS = ['All', 'New', 'Contacted', 'Qualified', 'Proposal', 'Customer', 'Churned'];

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal', 'Customer', 'Churned'];

const STATUS_BADGE_MAP = {
  Customer: 'dark',
  Qualified: 'accent',
  Proposal: 'accent',
  Churned: 'outline',
  New: 'default',
  Contacted: 'default',
};

export function ContactsPage({ onQuickAdd }) {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contactsApi.list({ search, status: activeStatus });
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, activeStatus]);

  useEffect(() => {
    fetchContacts();
  }, [activeStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContacts();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') fetchContacts();
    if (e.key === 'Escape') {
      setSearch('');
    }
  };

  const handleOpenDetail = async (contact) => {
    try {
      setDetailLoading(true);
      const detail = await contactsApi.get(contact.id);
      setSelectedContact(detail);
    } catch (err) {
      toast.error(`Failed to load contact: ${err.message}`);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Strike "${name}" from the directory? This cannot be undone.`)) return;
    try {
      await contactsApi.delete(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.contact?.id === id) setSelectedContact(null);
      toast.success(`Contact "${name}" removed from directory.`);
    } catch (err) {
      toast.error(`Deletion failed: ${err.message}`);
    }
  };

  const handleInlineStatusUpdate = async (contactId, newStatus) => {
    setStatusUpdating(contactId);
    try {
      const updated = await contactsApi.update(contactId, { status: newStatus });
      setContacts((prev) => prev.map((c) => (c.id === contactId ? updated : c)));
      toast.success(`Status updated to ${newStatus}.`);
    } catch (err) {
      toast.error(`Status update failed: ${err.message}`);
    } finally {
      setStatusUpdating(null);
      setEditingStatusId(null);
    }
  };

  const parseTags = (tagsRaw) => {
    if (!tagsRaw) return [];
    try { return JSON.parse(tagsRaw); } catch { return []; }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'name') return dir * a.name.localeCompare(b.name);
    if (sortField === 'company') return dir * a.company.localeCompare(b.company);
    if (sortField === 'status') return dir * a.status.localeCompare(b.status);
    if (sortField === 'lead_value') return dir * ((a.lead_value || 0) - (b.lead_value || 0));
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-neutral-400" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-foreground" />
      : <ChevronDown className="w-3 h-3 text-foreground" />;
  };

  const SortableHeader = ({ field, children }) => (
    <th
      className="text-left px-4 py-3 editorial-label text-neutral-500 cursor-pointer hover:text-foreground transition-colors select-none group"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1.5">
        {children}
        <SortIcon field={field} />
      </span>
    </th>
  );

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
              Verified corporate directory — click any row to open the full dossier
            </p>
          </div>

          <EditorialButton variant="primary" size="md" onClick={onQuickAdd}>
            <Plus className="w-4 h-4" />
            <span>+ Enroll Contact</span>
          </EditorialButton>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search by name, organization, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 bg-newsprint border border-foreground font-body text-sm outline-none focus:border-accent sharp-corners"
            />
          </div>
          <EditorialButton type="submit" variant="secondary" size="md">
            Query
          </EditorialButton>
          {search && (
            <EditorialButton
              type="button"
              variant="ghost"
              size="md"
              onClick={() => { setSearch(''); fetchContacts(); }}
            >
              <X className="w-4 h-4" />
            </EditorialButton>
          )}
        </form>

        {/* Status Filters */}
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

      {/* Directory Table */}
      {loading ? (
        <LoadingState message="Accessing commercial directory index..." />
      ) : sortedContacts.length === 0 ? (
        <EmptyState
          title="No Records Found"
          description="No entries match your filters. Enroll a new contact to begin."
          actionLabel="Enroll Contact"
          onAction={onQuickAdd}
          icon="📇"
        />
      ) : (
        <div className="border-2 border-foreground bg-newsprint shadow-hard overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-foreground bg-neutral-100">
                  <SortableHeader field="name">Name / Role</SortableHeader>
                  <SortableHeader field="company">Company</SortableHeader>
                  <th className="text-left px-4 py-3 editorial-label text-neutral-500">Contact</th>
                  <SortableHeader field="status">Status</SortableHeader>
                  <SortableHeader field="lead_value">Value</SortableHeader>
                  <th className="text-left px-4 py-3 editorial-label text-neutral-500">Tags</th>
                  <th className="px-4 py-3 editorial-label text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {sortedContacts.map((contact) => {
                  const tags = parseTags(contact.tags);
                  const isEditingStatus = editingStatusId === contact.id;

                  return (
                    <tr
                      key={contact.id}
                      onClick={() => !isEditingStatus && handleOpenDetail(contact)}
                      className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                    >
                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <div className="font-display font-bold text-sm text-foreground group-hover:text-accent transition-colors leading-snug">
                          {contact.name}
                        </div>
                        {contact.title && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Briefcase className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                            <span className="font-ui text-[11px] text-neutral-500 truncate max-w-[160px]">
                              {contact.title}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                          <span className="font-display text-sm font-semibold text-foreground truncate max-w-[140px]">
                            {contact.company}
                          </span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                            <a
                              href={`mailto:${contact.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-data text-[11px] text-neutral-600 hover:text-accent hover:underline truncate max-w-[160px] block"
                            >
                              {contact.email}
                            </a>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                              <span className="font-data text-[11px] text-neutral-500">{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Inline Status */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        {isEditingStatus ? (
                          <div className="flex items-center gap-1">
                            <select
                              autoFocus
                              defaultValue={contact.status}
                              disabled={statusUpdating === contact.id}
                              onChange={(e) => handleInlineStatusUpdate(contact.id, e.target.value)}
                              onBlur={() => setEditingStatusId(null)}
                              className="font-ui text-xs font-bold uppercase border border-foreground bg-newsprint px-2 py-1 outline-none cursor-pointer"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-1.5 cursor-pointer group/status"
                            onClick={() => setEditingStatusId(contact.id)}
                            title="Click to update status"
                          >
                            <EditorialBadge
                              variant={STATUS_BADGE_MAP[contact.status] || 'default'}
                              size="xs"
                            >
                              {contact.status}
                            </EditorialBadge>
                            <Edit3 className="w-3 h-3 text-neutral-300 group-hover/status:text-neutral-500 transition-colors" />
                          </div>
                        )}
                      </td>

                      {/* Lead Value */}
                      <td className="px-4 py-3.5">
                        <span className="font-data text-sm font-bold text-foreground">
                          {contact.lead_value > 0 ? formatCurrency(contact.lead_value) : '—'}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="px-4 py-3.5">
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
                            <span className="text-[10px] font-data text-neutral-400">+{tags.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(contact)}
                            className="p-1.5 text-neutral-400 hover:text-foreground hover:bg-neutral-200 transition-colors sharp-corners"
                            title="Open dossier"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(contact.id, contact.name, e)}
                            title="Strike record"
                            className="p-1.5 text-neutral-400 hover:text-accent hover:bg-red-50 transition-colors sharp-corners"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-2.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <span className="font-data text-[11px] text-neutral-500">
              {sortedContacts.length} record{sortedContacts.length !== 1 ? 's' : ''} displayed
              {search && ` · filtered by "${search}"`}
              {activeStatus !== 'All' && ` · status: ${activeStatus}`}
            </span>
            <span className="font-data text-[11px] text-neutral-400">
              Click status badge to update inline · Click row to open dossier
            </span>
          </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border border-foreground bg-neutral-100">
              <div>
                <span className="editorial-label text-neutral-500 block mb-1">STATUS</span>
                <EditorialBadge
                  variant={STATUS_BADGE_MAP[selectedContact.contact.status] || 'default'}
                  size="md"
                >
                  {selectedContact.contact.status}
                </EditorialBadge>
              </div>
              <div>
                <span className="editorial-label text-neutral-500 block mb-1">VALUATION</span>
                <span className="font-data text-xl font-bold text-foreground">
                  {formatCurrency(selectedContact.contact.lead_value)}
                </span>
              </div>
              <div>
                <span className="editorial-label text-neutral-500 block mb-1">DEALS</span>
                <span className="font-data text-xl font-bold text-foreground">
                  {selectedContact.deals.length}
                </span>
              </div>
              <div>
                <span className="editorial-label text-neutral-500 block mb-1">ACTIVITIES</span>
                <span className="font-data text-xl font-bold text-foreground">
                  {selectedContact.activities.length}
                </span>
              </div>
            </div>

            {/* Contact Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 border border-neutral-300 bg-newsprint">
                <span className="editorial-label text-neutral-500 block mb-1">EMAIL</span>
                <a
                  href={`mailto:${selectedContact.contact.email}`}
                  className="font-data text-sm font-semibold text-foreground hover:underline hover:text-accent"
                >
                  {selectedContact.contact.email}
                </a>
              </div>
              <div className="p-3 border border-neutral-300 bg-newsprint">
                <span className="editorial-label text-neutral-500 block mb-1">PHONE</span>
                <span className="font-data text-sm text-foreground">
                  {selectedContact.contact.phone || '—'}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedContact.contact.notes && (
              <div className="p-4 border border-foreground bg-newsprint">
                <h5 className="font-ui text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  Dossier Memorandum
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
                  Associated Deals ({selectedContact.deals.length})
                </h5>
              </div>

              {selectedContact.deals.length === 0 ? (
                <p className="text-sm font-body text-neutral-500 italic">
                  No deals linked to this account.
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
                        <p className="font-data text-xs text-neutral-500">
                          Stage: {d.stage} · {d.probability}% probability
                        </p>
                      </div>
                      <span className="font-data font-bold text-foreground">
                        {formatCurrency(d.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity History */}
            <div>
              <div className="flex items-center justify-between border-b border-foreground pb-2 mb-3">
                <h5 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <History className="w-4 h-4 text-foreground" />
                  Recorded Dispatches ({selectedContact.activities.length})
                </h5>
              </div>

              {selectedContact.activities.length === 0 ? (
                <p className="text-sm font-body text-neutral-500 italic">
                  No interactions logged yet.
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
                          {formatRelativeTime(a.created_at)}
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
