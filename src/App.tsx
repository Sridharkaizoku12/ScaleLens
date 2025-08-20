import React, { Suspense } from "react"; // ✅ Import Suspense for lazy loading
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"; // ✅ Import Outlet for layouts
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// ✅ LAZY LOADING: Import pages using React.lazy
const Index = React.lazy(() => import("./pages/Index"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));

const queryClient = new QueryClient();

// ✅ A simple fallback component to show while lazy-loaded pages are loading
const PageLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// ✅ LAYOUT ROUTE: A layout for all protected dashboard pages
const DashboardLayout = () => (
  <ProtectedRoute>
    {/* You could add a shared Sidebar and Navbar here */}
    <main>
      <Outlet /> {/* This renders the nested child route (e.g., Dashboard) */}
    </main>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* ✅ FIX: Removed the redundant <Toaster /> component */}
        <Sonner />
        <BrowserRouter>
          {/* ✅ LAZY LOADING: Wrap Routes in Suspense to handle loading states */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* ✅ LAYOUT ROUTE: All routes inside this element are now protected */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* You can add more protected routes here easily */}
                {/* <Route path="/dashboard/settings" element={<Settings />} /> */}
              </Route>
              
              {/* Catch-all route must remain at the bottom */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
