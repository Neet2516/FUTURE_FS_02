/**
 * Utility: format a timestamp string into a human-readable relative time.
 * e.g. "2 hours ago", "3 days ago", "just now"
 */
export function formatRelativeTime(timestampStr) {
  if (!timestampStr) return '—';
  // Handle both "2024-01-15T10:30:00" and "2024-01-15 10:30:00" formats
  const normalized = timestampStr.replace(' ', 'T');
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return timestampStr;

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format a date string (YYYY-MM-DD) to display format
 */
export function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Check if a date string is overdue (past today)
 */
export function isOverdue(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr + 'T00:00:00');
  return date < new Date(new Date().toDateString());
}

/**
 * Format currency value
 */
export function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val || 0);
}
