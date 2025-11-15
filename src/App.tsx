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
import { SwitchAccounts } from "./components/Auth/SwitchAccounts";
import { AuthLayout } from "./components/Auth/AuthLayout";
import ResetPassword from "./components/Auth/ResetPassword";
import { NavbarSkeleton } from "./components/SkeletonLoader/NavbarSkeleton";
import Loader from "./components/UI/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

  const isAuthRoute =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/verify-email") ||
    location.pathname.startsWith("/switch-accounts") ||
    location.pathname.startsWith("/reset-password");

  if (!initialized) {
    // ✅ Show different loader depending on route
    if (isAuthRoute) {
      return <Loader />;
    }
    return <NavbarSkeleton />;
  }

  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={4000} />
      {!isAuthRoute && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <VerifyEmail />
            </AuthLayout>
          }
        />
        <Route
          path="/switch-accounts"
          element={
            <AuthLayout>
              <SwitchAccounts />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />

        {/* Main app routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/workspaces/:workspaceId/boards" element={<BoardList />} />
        <Route path="/boards/:boardId" element={<KanbanBoard />} />
      </Routes>
    </div>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ModalProvider>
          <GlobalModals />
          <Router>
            <AppContent />
          </Router>
        </ModalProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
