
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { useOffline } from "./hooks/useOffline";
import "./App.css";

const queryClient = new QueryClient();

function AppContent() {
  const { isOnline } = useOffline();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-100">
        {!isOnline && (
          <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center text-yellow-800 text-sm">
            📴 Offline mode - Your data is stored locally
          </div>
        )}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
