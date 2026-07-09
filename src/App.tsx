import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ChooseCity from "./pages/ChooseCity";
import Index from "./pages/Index";
import { CartProvider } from "./context/CartContext";

const Workshops = lazy(() => import("./pages/Workshops"));
const WorkshopDetail = lazy(() => import("./pages/WorkshopDetail"));
const Formats = lazy(() => import("./pages/Formats"));
const Certificates = lazy(() => import("./pages/Certificates"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Offer = lazy(() => import("./pages/Offer"));
const Info = lazy(() => import("./pages/Info"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<ChooseCity />} />
              <Route path="/moscow" element={<Index />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/workshops/:slug" element={<WorkshopDetail />} />
              <Route path="/formats" element={<Formats />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/offer" element={<Offer />} />
              <Route path="/info" element={<Info />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;