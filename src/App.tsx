import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import OnlineBooking from "./components/OnlineBooking";
import BookingDrawer from "./components/BookingDrawer";
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
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RedirectWorkshop = () => {
  const { slug } = useParams();
  return <Navigate to={`/moscow/workshops/${slug}`} replace />;
};

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
              <Route path="/moscow/workshops" element={<Workshops />} />
              <Route path="/moscow/workshops/:slug" element={<WorkshopDetail />} />
              <Route path="/moscow/formats" element={<Formats />} />
              <Route path="/moscow/certificates" element={<Certificates />} />
              <Route path="/moscow/contacts" element={<Contacts />} />
              <Route path="/moscow/cart" element={<Cart />} />
              <Route path="/moscow/checkout" element={<Checkout />} />
              <Route path="/moscow/reviews" element={<Reviews />} />
              <Route path="/moscow/offer" element={<Offer />} />
              <Route path="/moscow/info" element={<Info />} />
              <Route path="/moscow/privacy" element={<Privacy />} />
              <Route path="/moscow/cookies" element={<Cookies />} />
              <Route path="/admin" element={<Admin />} />

              {/* Redirects for old flat routes */}
              <Route path="/workshops" element={<Navigate to="/moscow/workshops" replace />} />
              <Route path="/workshops/:slug" element={<RedirectWorkshop />} />
              <Route path="/formats" element={<Navigate to="/moscow/formats" replace />} />
              <Route path="/certificates" element={<Navigate to="/moscow/certificates" replace />} />
              <Route path="/contacts" element={<Navigate to="/moscow/contacts" replace />} />
              <Route path="/cart" element={<Navigate to="/moscow/cart" replace />} />
              <Route path="/checkout" element={<Navigate to="/moscow/checkout" replace />} />
              <Route path="/reviews" element={<Navigate to="/moscow/reviews" replace />} />
              <Route path="/offer" element={<Navigate to="/moscow/offer" replace />} />
              <Route path="/info" element={<Navigate to="/moscow/info" replace />} />
              <Route path="/privacy" element={<Navigate to="/moscow/privacy" replace />} />
              <Route path="/cookies" element={<Navigate to="/moscow/cookies" replace />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <OnlineBooking />
          <BookingDrawer />
          <CookieConsent />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;