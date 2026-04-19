import { Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "./components/admin/AdminShell";
import { BookingShell } from "./components/layout/BookingShell";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { FirebaseBanner } from "./components/system/FirebaseBanner";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminPostsPage } from "./pages/admin/AdminPostsPage";
import { AdminSitePage } from "./pages/admin/AdminSitePage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { LandingPage } from "./pages/LandingPage";
import { CheckoutScreen } from "./screens/CheckoutScreen";
import { EvaluationScreen } from "./screens/EvaluationScreen";
import { ListingScreen } from "./screens/ListingScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { StatusScreen } from "./screens/StatusScreen";

export default function App() {
  return (
    <>
      <FirebaseBanner />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/app" element={<ProtectedRoute />}>
          <Route element={<BookingShell />}>
            <Route index element={<Navigate to="listing" replace />} />
            <Route path="listing" element={<ListingScreen />} />
            <Route path="profile/:id" element={<ProfileScreen />} />
            <Route path="checkout/:id" element={<CheckoutScreen />} />
            <Route path="status/:id" element={<StatusScreen />} />
            <Route path="evaluation/:id" element={<EvaluationScreen />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="site" element={<AdminSitePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
