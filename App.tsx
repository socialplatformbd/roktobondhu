import { HashRouter, Route, Routes } from "react-router-dom";
import { I18nProvider } from "@/i18n/I18nContext";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute, AdminRoute } from "@/components/RouteGuards";

import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import ProfileSetup from "@/pages/ProfileSetup";
import DonorDirectory from "@/pages/DonorDirectory";
import DonorDetails from "@/pages/DonorDetails";
import ContactInbox from "@/pages/ContactInbox";
import CreateBloodRequest from "@/pages/CreateBloodRequest";
import BloodRequestList from "@/pages/BloodRequestList";
import BloodRequestDetails from "@/pages/BloodRequestDetails";
import MyRequests from "@/pages/MyRequests";
import Settings from "@/pages/Settings";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Help from "@/pages/Help";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                }
              />
              <Route path="/donors" element={<DonorDirectory />} />
              <Route path="/donors/:uid" element={<DonorDetails />} />
              <Route
                path="/inbox"
                element={
                  <ProtectedRoute>
                    <ContactInbox />
                  </ProtectedRoute>
                }
              />
              <Route path="/requests" element={<BloodRequestList />} />
              <Route
                path="/requests/new"
                element={
                  <ProtectedRoute>
                    <CreateBloodRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests/mine"
                element={
                  <ProtectedRoute>
                    <MyRequests />
                  </ProtectedRoute>
                }
              />
              <Route path="/requests/:id" element={<BloodRequestDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help" element={<Help />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </HashRouter>
      </AuthProvider>
    </I18nProvider>
  );
}
