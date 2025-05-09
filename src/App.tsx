
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SlideshowPage from "./pages/SlideshowPage";
import SessionsPage from "./pages/sessions/SessionsPage";
import CreateSessionPage from "./pages/sessions/CreateSessionPage";
import EditSessionPage from "./pages/sessions/EditSessionPage";
import SessionPlayerPage from "./pages/sessions/SessionPlayerPage";
import AccountPage from "./pages/account/AccountPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/slideshow" element={<SlideshowPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/sessions/new" element={<CreateSessionPage />} />
          <Route path="/sessions/edit/:id" element={<EditSessionPage />} />
          <Route path="/session/:id" element={<SessionPlayerPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
