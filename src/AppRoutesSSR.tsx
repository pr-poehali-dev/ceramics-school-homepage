/**
 * Версия маршрутов для серверного пререндера (SSG).
 * В отличие от AppRoutes.tsx использует ПРЯМЫЕ (не lazy) импорты страниц,
 * т.к. renderToString() не умеет дожидаться React.lazy() — без этого
 * прегенерированный HTML содержал бы только "крутилку" загрузки.
 */
import { Routes, Route } from "react-router-dom";
import ChooseCity from "./pages/ChooseCity";
import Index from "./pages/Index";
import Suzdal from "./pages/Suzdal";
import Workshops from "./pages/Workshops";
import WorkshopDetail from "./pages/WorkshopDetail";
import Formats from "./pages/Formats";
import Certificates from "./pages/Certificates";
import Contacts from "./pages/Contacts";
import Reviews from "./pages/Reviews";
import Offer from "./pages/Offer";
import Info from "./pages/Info";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import SuzdalWorkshops from "./pages/SuzdalWorkshops";
import SuzdalWorkshopDetail from "./pages/SuzdalWorkshopDetail";
import SuzdalAbout from "./pages/SuzdalAbout";
import SuzdalCertificates from "./pages/SuzdalCertificates";
import SuzdalExcursions from "./pages/SuzdalExcursions";
import SuzdalContacts from "./pages/SuzdalContacts";
import SuzdalOffer from "./pages/SuzdalOffer";
import SuzdalPrivacy from "./pages/SuzdalPrivacy";
import SuzdalCookies from "./pages/SuzdalCookies";
import SuzdalReviews from "./pages/SuzdalReviews";
import PageNotFound from "./pages/PageNotFound";

const AppRoutesSSR = () => (
  <Routes>
    <Route path="/" element={<ChooseCity />} />
    <Route path="/moscow" element={<Index />} />
    <Route path="/moscow/workshops" element={<Workshops />} />
    <Route path="/moscow/workshops/:slug" element={<WorkshopDetail />} />
    <Route path="/moscow/formats" element={<Formats />} />
    <Route path="/moscow/certificates" element={<Certificates />} />
    <Route path="/moscow/contacts" element={<Contacts />} />
    <Route path="/moscow/reviews" element={<Reviews />} />
    <Route path="/moscow/offer" element={<Offer />} />
    <Route path="/moscow/info" element={<Info />} />
    <Route path="/moscow/privacy" element={<Privacy />} />
    <Route path="/moscow/cookies" element={<Cookies />} />

    {/* SUZDAL */}
    <Route path="/suzdal" element={<Suzdal />} />
    <Route path="/suzdal/workshops" element={<SuzdalWorkshops />} />
    <Route path="/suzdal/workshops/:slug" element={<SuzdalWorkshopDetail />} />
    <Route path="/suzdal/certificates" element={<SuzdalCertificates />} />
    <Route path="/suzdal/excursions" element={<SuzdalExcursions />} />
    <Route path="/suzdal/contacts" element={<SuzdalContacts />} />
    <Route path="/suzdal/about" element={<SuzdalAbout />} />
    <Route path="/suzdal/offer" element={<SuzdalOffer />} />
    <Route path="/suzdal/privacy" element={<SuzdalPrivacy />} />
    <Route path="/suzdal/cookies" element={<SuzdalCookies />} />
    <Route path="/suzdal/reviews" element={<SuzdalReviews />} />

    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AppRoutesSSR;