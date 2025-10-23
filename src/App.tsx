import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
// import { useSocket } from "./hooks/useSocket";
import { WorkspaceList } from "./components/Workspace/WorkspaceList";
import { BoardList } from "./components/Board/BoardList";
import { KanbanBoard } from "./components/Board/KanbanBoard";
import Navbar from "./components/Navbar/Navbar";
import { VerifyEmail } from "./components/Auth/VerifyEmail";
import { Toaster } from "react-hot-toast";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { getProfile } from "./store/slices/authSlice";
import { ModalProvider } from "./context/ModalContext";
import { GlobalModals } from "./components/GlobalModals";

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(getProfile()); // ✅ Check if user session is still valid
  }, [dispatch]);

  const isAuthRoute =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/verify-email");

  // ✅ Show loader only while we're checking session (not every fetch)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // ✅ Once initialized, protect routes normally
  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {!isAuthRoute && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/workspaces" element={<WorkspaceList />} />
        <Route path="/workspaces/:workspaceId/boards" element={<BoardList />} />
        <Route path="/boards/:boardId" element={<KanbanBoard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ModalProvider>
        <GlobalModals />
        <Router>
          <AppContent />
        </Router>
      </ModalProvider>
    </Provider>
  );
}

export default App;
