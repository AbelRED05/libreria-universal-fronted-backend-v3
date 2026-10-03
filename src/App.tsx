import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedShowcase } from './components/FeaturedShowcase';
import { CatalogSection } from './components/CatalogSection';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BookDetailModal } from './components/BookDetailModal';
import { BookFormModal } from './components/BookFormModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { FAQModal } from './components/FAQModal';
import { TermsModal } from './components/TermsModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { activeView } = useLibrary();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2C1E14]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <HeroSection />
            <FeaturedShowcase />
            <CatalogSection />
          </>
        )}
      </main>

      {/* Interactive Overlays & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <BookDetailModal />
      <BookFormModal />
      <UserProfileModal />
      <AuthModal />
      <FAQModal />
      <TermsModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <MainContent />
    </LibraryProvider>
  );
}
