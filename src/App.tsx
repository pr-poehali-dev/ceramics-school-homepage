import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import ErrorBoundary from "./components/ErrorBoundary";
import OnlineBooking from "./components/OnlineBooking";
import BookingDrawer from "./components/BookingDrawer";
import ChooseCity from "./pages/ChooseCity";
import Index from "./pages/Index";
import Suzdal from "./pages/Suzdal";
import { CartProvider } from "./context/CartContext";

const Workshops = lazy(() => import("./pages/Workshops"));
const WorkshopDetail = lazy(() => import("./pages/WorkshopDetail"));
const Formats = lazy(() => import("./pages/Formats"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderPaymentStatus = lazy(() => import("./pages/checkout/OrderPaymentStatus"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Offer = lazy(() => import("./pages/Offer"));
const Info = lazy(() => import("./pages/Info"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Admin = lazy(() => import("./pages/Admin"));
const SuzdalWorkshops = lazy(() => import("./pages/SuzdalWorkshops"));
const SuzdalWorkshopDetail = lazy(() => import("./pages/SuzdalWorkshopDetail"));
const SuzdalAbout = lazy(() => import("./pages/SuzdalAbout"));
const SuzdalExcursions = lazy(() => import("./pages/SuzdalExcursions"));
const SuzdalContacts = lazy(() => import("./pages/SuzdalContacts"));
const SuzdalInfo = lazy(() => import("./pages/SuzdalInfo"));
const SuzdalOffer = lazy(() => import("./pages/SuzdalOffer"));
const SuzdalPrivacy = lazy(() => import("./pages/SuzdalPrivacy"));
const SuzdalCookies = lazy(() => import("./pages/SuzdalCookies"));
const SuzdalReviews = lazy(() => import("./pages/SuzdalReviews"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Tracking = lazy(() => import("./pages/Tracking"));
const QrRedirect = lazy(() => import("./pages/QrRedirect"));
const QrRedirectSuzdal = lazy(() => import("./pages/QrRedirect").then((m) => ({ default: m.QrRedirectSuzdal })));
const ManagerLogin = lazy(() => import("./pages/ManagerLogin"));
const ManagerDashboard = lazy(() => import("./pages/ManagerDashboard"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

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
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<ChooseCity />} />
              <Route path="/moscow" element={<Index />} />
              <Route path="/moscow/workshops" element={<Workshops />} />
              <Route path="/moscow/workshops/:slug" element={<WorkshopDetail />} />
              <Route path="/moscow/formats" element={<Formats />} />
              <Route path="/moscow/contacts" element={<Contacts />} />
              <Route path="/moscow/cart" element={<Cart />} />
              <Route path="/moscow/checkout" element={<Checkout />} />
              <Route path="/moscow/order-status" element={<OrderPaymentStatus />} />
              <Route path="/moscow/reviews" element={<Reviews />} />
              <Route path="/moscow/offer" element={<Offer />} />
              <Route path="/moscow/info" element={<Info />} />
              <Route path="/moscow/privacy" element={<Privacy />} />
              <Route path="/moscow/cookies" element={<Cookies />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/tracking/qr" element={<QrRedirect />} />
              <Route path="/tracking/qr-suzdal" element={<QrRedirectSuzdal />} />
              <Route path="/manager" element={<Navigate to="/manager/login" replace />} />
              <Route path="/manager/login" element={<ManagerLogin />} />
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />

              {/* SUZDAL */}
              <Route path="/suzdal" element={<Suzdal />} />
              <Route path="/suzdal/workshops" element={<SuzdalWorkshops />} />
              <Route path="/suzdal/workshops/:slug" element={<SuzdalWorkshopDetail />} />
              <Route path="/suzdal/excursions" element={<SuzdalExcursions />} />
              <Route path="/suzdal/contacts" element={<SuzdalContacts />} />
              <Route path="/suzdal/info" element={<SuzdalInfo />} />
              <Route path="/suzdal/about" element={<SuzdalAbout />} />
              <Route path="/suzdal/cart" element={<Cart />} />
              <Route path="/suzdal/checkout" element={<Checkout />} />
              <Route path="/suzdal/order-status" element={<OrderPaymentStatus />} />
              <Route path="/suzdal/offer" element={<SuzdalOffer />} />
              <Route path="/suzdal/privacy" element={<SuzdalPrivacy />} />
              <Route path="/suzdal/cookies" element={<SuzdalCookies />} />
              <Route path="/suzdal/reviews" element={<SuzdalReviews />} />

              {/* Redirects for old flat routes */}
              <Route path="/workshops" element={<Navigate to="/moscow/workshops" replace />} />
              <Route path="/workshops/:slug" element={<RedirectWorkshop />} />
              <Route path="/formats" element={<Navigate to="/moscow/formats" replace />} />
              <Route path="/contacts" element={<Navigate to="/moscow/contacts" replace />} />
              <Route path="/cart" element={<Navigate to="/moscow/cart" replace />} />
              <Route path="/checkout" element={<Navigate to="/moscow/checkout" replace />} />
              <Route path="/reviews" element={<Navigate to="/moscow/reviews" replace />} />
              <Route path="/offer" element={<Navigate to="/moscow/offer" replace />} />
              <Route path="/info" element={<Navigate to="/moscow/info" replace />} />
              <Route path="/privacy" element={<Navigate to="/moscow/privacy" replace />} />
              <Route path="/cookies" element={<Navigate to="/moscow/cookies" replace />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>
          <OnlineBooking />
          <BookingDrawer />
          <CookieConsent />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;