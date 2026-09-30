import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { Masthead } from './components/editorial/Masthead';
import { EditorialNav } from './components/editorial/EditorialNav';
import { EditorialFooter } from './components/editorial/EditorialFooter';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PipelineKanbanPage } from './pages/PipelineKanbanPage';
import { ContactsPage } from './pages/ContactsPage';
import { TasksPage } from './pages/TasksPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { QuickAddModal } from './components/common/QuickAddModal';
import { tasksApi } from './services/api';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-newsprint flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black text-foreground tracking-tight mb-3">PaperCRM</h1>
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-foreground animate-pulse" />
          <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">Initialising session...</span>
        </div>
      </div>
    </div>
  );
}

export function AppContent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);

  const refreshPendingCount = async () => {
    if (!isAuthenticated) return;
    try {
      const tasks = await tasksApi.list();
      setPendingTaskCount(tasks.filter((t) => !t.completed).length);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (isAuthenticated) refreshPendingCount();
  }, [refreshKey, isAuthenticated]);

  const handleQuickAddSuccess = () => setRefreshKey((k) => k + 1);

  // 1. While checking stored session
  if (loading) return <LoadingScreen />;

  // 2. Not authenticated — show login/register
  if (!isAuthenticated) {
    return <AuthPage onAuthenticated={login} />;
  }

  // 3. Authenticated — show main app
  return (
    <div className="min-h-screen flex flex-col bg-newsprint text-foreground">
      <Masthead user={user} onLogout={logout} />

      <EditorialNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onQuickAdd={() => setIsQuickAddOpen(true)}
        pendingTaskCount={pendingTaskCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {currentTab === 'dashboard' && (
          <DashboardPage key={refreshKey} onNavigate={setCurrentTab} onQuickAdd={() => setIsQuickAddOpen(true)} />
        )}
        {currentTab === 'pipeline' && (
          <PipelineKanbanPage key={refreshKey} onQuickAdd={() => setIsQuickAddOpen(true)} />
        )}
        {currentTab === 'contacts' && (
          <ContactsPage key={refreshKey} onQuickAdd={() => setIsQuickAddOpen(true)} />
        )}
        {currentTab === 'tasks' && (
          <TasksPage key={refreshKey} onQuickAdd={() => setIsQuickAddOpen(true)} />
        )}
        {currentTab === 'activity' && (
          <ActivityLogPage key={refreshKey} onQuickAdd={() => setIsQuickAddOpen(true)} />
        )}
        {currentTab === 'settings' && <SettingsPage user={user} onLogout={logout} />}
      </main>

      <EditorialFooter />

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
