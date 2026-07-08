
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ChooseCity from "./pages/ChooseCity";
import Index from "./pages/Index";
import Workshops from "./pages/Workshops";
import WorkshopDetail from "./pages/WorkshopDetail";
import Formats from "./pages/Formats";
import Certificates from "./pages/Certificates";
import Contacts from "./pages/Contacts";
import Cart from "./pages/Cart";
import Reviews from "./pages/Reviews";
import Offer from "./pages/Offer";
import Info from "./pages/Info";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<ChooseCity />} />
            <Route path="/moscow" element={<Index />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops/:slug" element={<WorkshopDetail />} />
            <Route path="/formats" element={<Formats />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/offer" element={<Offer />} />
            <Route path="/info" element={<Info />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;