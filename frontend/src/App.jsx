import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { Masthead } from './components/editorial/Masthead';
import { EditorialNav } from './components/editorial/EditorialNav';
import { EditorialFooter } from './components/editorial/EditorialFooter';
import { DashboardPage } from './pages/DashboardPage';
import { PipelineKanbanPage } from './pages/PipelineKanbanPage';
import { ContactsPage } from './pages/ContactsPage';
import { TasksPage } from './pages/TasksPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { QuickAddModal } from './components/common/QuickAddModal';
import { tasksApi } from './services/api';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);

  // Fetch pending task count for nav badge
  const refreshPendingCount = async () => {
    try {
      const tasks = await tasksApi.list();
      setPendingTaskCount(tasks.filter((t) => !t.completed).length);
    } catch {
      // silent fail — nav badge is non-critical
    }
  };

  useEffect(() => {
    refreshPendingCount();
  }, [refreshKey]);

  const handleQuickAddSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-newsprint text-foreground">
      {/* Masthead */}
      <Masthead />

      {/* Navigation */}
      <EditorialNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onQuickAdd={() => setIsQuickAddOpen(true)}
        pendingTaskCount={pendingTaskCount}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
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
      </main>

      {/* Footer */}
      <EditorialFooter />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onCreated={handleQuickAddSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
