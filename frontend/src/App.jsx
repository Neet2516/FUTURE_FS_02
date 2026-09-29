import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
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

export function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
      <AppContent />
    </AuthProvider>
  );
}
