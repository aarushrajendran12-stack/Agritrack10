import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNavigation } from './components/MobileNavigation';

// Views
import { FarmerDashboardView } from './views/FarmerDashboardView';
import { CropsView } from './views/CropsView';
import { WeatherView } from './views/WeatherView';
import { MarketplaceSection } from './components/MarketplaceSection';
import { FinancialDashboard } from './components/FinancialDashboard';
import { AdminPortal } from './components/AdminPortal';

// Modals
import { AddCropModal } from './components/AddCropModal';
import { CartDrawer } from './components/CartDrawer';
import { OrdersModal } from './components/OrdersModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';

export const App = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal open states
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Desktop Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <div className="app-main">
        {/* Top Header Navbar */}
        <Navbar
          onOpenAddCrop={() => setIsAddCropOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* Viewport Content */}
        <main className="content-wrapper">
          {activeTab === 'dashboard' && (
            <FarmerDashboardView
              setActiveTab={setActiveTab}
              onOpenAddCrop={() => setIsAddCropOpen(true)}
              onOpenCart={() => setIsCartOpen(true)}
            />
          )}

          {activeTab === 'crops' && (
            <CropsView onOpenAddCrop={() => setIsAddCropOpen(true)} />
          )}

          {activeTab === 'weather' && <WeatherView />}

          {activeTab === 'marketplace' && (
            <MarketplaceSection
              onOpenCart={() => setIsCartOpen(true)}
              onOpenOrders={() => setIsOrdersOpen(true)}
            />
          )}

          {activeTab === 'finance' && <FinancialDashboard />}

          {activeTab === 'admin' && <AdminPortal />}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Global Modals */}
      <AddCropModal
        isOpen={isAddCropOpen}
        onClose={() => setIsAddCropOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export default App;
