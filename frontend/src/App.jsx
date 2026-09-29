import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { PipelineKanbanPage } from './pages/PipelineKanbanPage';
import { ContactsPage } from './pages/ContactsPage';
import { TasksPage } from './pages/TasksPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { QuickAddModal } from './components/common/QuickAddModal';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleQuickAddSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Sales Overview & Metrics';
      case 'pipeline': return 'Deals & Pipeline Kanban';
      case 'contacts': return 'Contacts & Leads';
      case 'tasks': return 'Sticky Notes & Reminders';
      case 'activity': return 'Audit Trail & Activity Log';
      case 'settings': return 'Preferences & Design Guide';
      default: return 'PaperCRM';
    }
  };

  return (
    <Layout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      title={getPageTitle()}
      onQuickAdd={() => setIsQuickAddOpen(true)}
    >
      {currentTab === 'dashboard' && (
        <DashboardPage
          key={refreshKey}
          onNavigate={setCurrentTab}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />
      )}

      {currentTab === 'pipeline' && (
        <PipelineKanbanPage
          key={refreshKey}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />
      )}

      {currentTab === 'contacts' && (
        <ContactsPage
          key={refreshKey}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />
      )}

      {currentTab === 'tasks' && (
        <TasksPage
          key={refreshKey}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />
      )}

      {currentTab === 'activity' && (
        <ActivityLogPage
          key={refreshKey}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />
      )}

      {currentTab === 'settings' && <SettingsPage />}

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onCreated={handleQuickAddSuccess}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
