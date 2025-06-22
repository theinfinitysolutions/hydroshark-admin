import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  showCreateProductModal: {
    show: false,
    id: '',
    mode: 'create',
    refresh: false,
  },
  setShowCreateProductModal: (showCreateProductModal) => set({ showCreateProductModal }),

  user: null,
  setUser: (user) => set({ user }),

  showUserDetailsModal: {
    show: false,
    id: '',
  },
  setShowUserDetailsModal: (showUserDetailsModal) => set({ showUserDetailsModal }),

  showOrderDetailsModal: {
    show: false,
    id: '',
  },
  setShowOrderDetailsModal: (showOrderDetailsModal) => set({ showOrderDetailsModal }),

  showCartDetailsModal: {
    show: false,
    id: '',
  },
  setShowCartDetailsModal: (showCartDetailsModal) => set({ showCartDetailsModal }),

  showCreateMerchandiseModal: {
    show: false,
    id: '',
    mode: 'create',
    refresh: false,
  },
  setShowCreateMerchandiseModal: (modal) => set({ showCreateMerchandiseModal: modal }),

  showCreateMerchandiseTypeModal: {
    show: false,
    id: '',
    mode: 'create',
    refresh: false,
  },
  setShowCreateMerchandiseTypeModal: (modal) => set({ showCreateMerchandiseTypeModal: modal }),
}));

export default useStore;
