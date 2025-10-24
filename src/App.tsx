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
import { BoardList } from "./components/Board/BoardList";
import { KanbanBoard } from "./components/Board/KanbanBoard";
import Navbar from "./components/Navbar/Navbar";
import { VerifyEmail } from "./components/Auth/VerifyEmail";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { getProfile } from "./store/slices/authSlice";
import { ModalProvider } from "./context/ModalContext";
import { GlobalModals } from "./components/GlobalModals";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./components/Homepage/Homepage";

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // ✅ Check if user session is still valid
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (!initialized) {
    // ✅ Wait until auth check completes before deciding
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthRoute =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/verify-email");

  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={4000} />
      {!isAuthRoute && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* <Route path="/workspaces" element={<WorkspaceList />} /> */}
        <Route path="/" element={<Homepage />} />
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
