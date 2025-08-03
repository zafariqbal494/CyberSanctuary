import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PageLoader } from "@/components/ui/loading-spinner";

// Layouts
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";

// Core components that are needed immediately
import NotFound from "./pages/NotFound";

// Lazily loaded components
// Public pages
const Index = lazy(() => import("./pages/Index"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// User dashboard pages
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const UserCourses = lazy(() => import("./pages/dashboard/UserCourses"));
const UserSettings = lazy(() => import("./pages/dashboard/UserSettings"));
const ResetPasswordPage = lazy(() => import("./pages/dashboard/ResetPasswordPage"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminCourses = lazy(() => import("./pages/admin/Courses"));
const AdminPayments = lazy(() => import("./pages/admin/Payments"));
const EditCourse = lazy(() => import("./pages/admin/EditCourse"));
const ReviewManagement = lazy(() => import("./pages/admin/ReviewManagement"));
const Settings = lazy(() => import("./pages/admin/Settings"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
            </Route>
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* User Dashboard Routes */}
            <Route path="/dashboard" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="courses" element={<UserCourses />} />
              <Route path="settings" element={<UserSettings />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>
            
            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="courses/edit/:id" element={<EditCourse />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reviews" element={<ReviewManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
