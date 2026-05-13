import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Ticker from './components/layout/Ticker';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PostDetail from './pages/PostDetail';
import Posts from './pages/Posts';
import Events from './pages/Events';
import Partners from './pages/Partners';
import DynamicPage from './pages/DynamicPage';
import Oglasi from './pages/Oglasi';
import JSP from './pages/JSP';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Search from './pages/Search';
import Scholarships from './pages/Scholarships';
import JoinUs from './pages/JoinUs';
import Brucosi from './pages/Brucosi';
import Upisi from './pages/Upisi';
import Domovi from './pages/Domovi';
import ProdolzuvanjeStipendija from './pages/ProdolzuvanjeStipendija';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Ticker />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/oglasi" element={<Oglasi />} />
          <Route path="/jsp" element={<JSP />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/search" element={<Search />} />
          <Route path="/stipendii" element={<Scholarships />} />
          <Route path="/pridruzi-se" element={<JoinUs />} />
          <Route path="/brucosi" element={<Brucosi />} />
          <Route path="/upisi-2025-26" element={<Upisi />} />
          <Route path="/studentski-domovi" element={<Domovi />} />
          <Route path="/prodolzuvanje-stipendija" element={<ProdolzuvanjeStipendija />} />
          <Route path="/join-us" element={<Navigate to="/pridruzi-se" replace />} />
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/:slug" element={<DynamicPage />} />
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
