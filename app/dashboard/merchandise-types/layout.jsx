import React from 'react';
import CreateMerchandiseTypeModal from '@/components/Modals/CreateMerchandiseTypeModal';

export const metadata = {
  title: 'Merchandise Types | Hydroshark',
  description: "India's First Carbonated Hydration Drink",
};

const Layout = ({ children }) => {
  return (
    <main>
      {children}
      <CreateMerchandiseTypeModal />
    </main>
  );
};

export default Layout;
