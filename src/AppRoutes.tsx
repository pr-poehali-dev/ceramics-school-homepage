import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ChooseCity from "./pages/ChooseCity";
import Index from "./pages/Index";
import Suzdal from "./pages/Suzdal";

const Workshops = lazy(() => import("./pages/Workshops"));
const WorkshopDetail = lazy(() => import("./pages/WorkshopDetail"));
const Formats = lazy(() => import("./pages/Formats"));
const Certificates = lazy(() => import("./pages/Certificates"));
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
const SuzdalCertificates = lazy(() => import("./pages/SuzdalCertificates"));
const SuzdalExcursions = lazy(() => import("./pages/SuzdalExcursions"));
const SuzdalContacts = lazy(() => import("./pages/SuzdalContacts"));
const SuzdalOffer = lazy(() => import("./pages/SuzdalOffer"));
const SuzdalPrivacy = lazy(() => import("./pages/SuzdalPrivacy"));
const SuzdalCookies = lazy(() => import("./pages/SuzdalCookies"));
const SuzdalReviews = lazy(() => import("./pages/SuzdalReviews"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

export const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const AppRoutes = () => (
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
      <Route path="/moscow/order-status" element={<OrderPaymentStatus />} />
      <Route path="/moscow/reviews" element={<Reviews />} />
      <Route path="/moscow/offer" element={<Offer />} />
      <Route path="/moscow/info" element={<Info />} />
      <Route path="/moscow/privacy" element={<Privacy />} />
      <Route path="/moscow/cookies" element={<Cookies />} />
      <Route path="/admin" element={<Admin />} />

      {/* SUZDAL */}
      <Route path="/suzdal" element={<Suzdal />} />
      <Route path="/suzdal/workshops" element={<SuzdalWorkshops />} />
      <Route path="/suzdal/workshops/:slug" element={<SuzdalWorkshopDetail />} />
      <Route path="/suzdal/certificates" element={<SuzdalCertificates />} />
      <Route path="/suzdal/excursions" element={<SuzdalExcursions />} />
      <Route path="/suzdal/contacts" element={<SuzdalContacts />} />
      <Route path="/suzdal/about" element={<SuzdalAbout />} />
      <Route path="/suzdal/cart" element={<Cart />} />
      <Route path="/suzdal/checkout" element={<Checkout />} />
      <Route path="/suzdal/order-status" element={<OrderPaymentStatus />} />
      <Route path="/suzdal/offer" element={<SuzdalOffer />} />
      <Route path="/suzdal/privacy" element={<SuzdalPrivacy />} />
      <Route path="/suzdal/cookies" element={<SuzdalCookies />} />
      <Route path="/suzdal/reviews" element={<SuzdalReviews />} />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;