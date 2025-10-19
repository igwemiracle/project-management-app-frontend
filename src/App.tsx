import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getProfile } from './store/slices/authSlice';
import { useSocket } from './hooks/useSocket';
import { AuthPage } from './components/Auth/AuthPage';
import { WorkspaceList } from './components/Workspace/WorkspaceList';
import { BoardList } from './components/Board/BoardList';
import { KanbanBoard } from './components/Board/KanbanBoard';

type View = 'workspaces' | 'boards' | 'board';

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState<View>('workspaces');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  useSocket();

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [token, user, dispatch]);

  const handleSelectWorkspace = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setCurrentView('boards');
  };

  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setCurrentView('board');
  };

  const handleBackToWorkspaces = () => {
    setSelectedWorkspaceId(null);
    setSelectedBoardId(null);
    setCurrentView('workspaces');
  };

  const handleBackToBoards = () => {
    setSelectedBoardId(null);
    setCurrentView('boards');
  };

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <>
      {currentView === 'workspaces' && (
        <WorkspaceList onSelectWorkspace={handleSelectWorkspace} />
      )}
      {currentView === 'boards' && selectedWorkspaceId && (
        <BoardList
          workspaceId={selectedWorkspaceId}
          onSelectBoard={handleSelectBoard}
          onBack={handleBackToWorkspaces}
        />
      )}
      {currentView === 'board' && selectedBoardId && (
        <KanbanBoard boardId={selectedBoardId} onBack={handleBackToBoards} />
      )}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
