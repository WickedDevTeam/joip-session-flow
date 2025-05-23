
import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import AuthGuard from "./components/layout/AuthGuard";
import MediaBrowserPage from "./pages/MediaBrowserPage";
import SessionsPage from "./pages/sessions/SessionsPage";
import CreateSessionPage from "./pages/sessions/CreateSessionPage";
import EditSessionPage from "./pages/sessions/EditSessionPage";
import SessionPlayerPage from "./pages/sessions/SessionPlayerPage";
import AuthPage from "./pages/auth/AuthPage";
import AccountPage from "./pages/account/AccountPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <Toaster />
        <Sonner />
        <TooltipProvider>
          <BrowserRouter>
            <AuthGuard>
              <Routes>
                <Route path="/" element={<Navigate to="/sessions" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/media" element={<MediaBrowserPage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/sessions/new" element={<CreateSessionPage />} />
                <Route path="/sessions/edit/:id" element={<EditSessionPage />} />
                <Route path="/session/:id" element={<SessionPlayerPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGuard>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
