import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CreateListingPage from './pages/CreateListingPage';
import EditProfilePage from './pages/EditProfilePage';
import MyAdsPage from './pages/MyAdsPage';
import ConversationsPage from './pages/ConversationsPage';
import ChatPage from './pages/ChatPage';
import SellerInfoPage from './pages/SellerInfoPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import { ConversationsProvider } from './context/ConversationsContext';

/**
 * Componente raiz de la aplicacion.
 *
 * Configura React Router y el proveedor global de conversaciones para que todas
 * las pantallas puedan compartir estado de mensajeria.
 *
 * @returns Arbol principal de la aplicacion.
 */
function App() {
  return (
    <BrowserRouter>
      <ConversationsProvider>
        <AppRoutes />
      </ConversationsProvider>
    </BrowserRouter>
  );
}

/**
 * Define las rutas principales y la navegacion modal del chat.
 *
 * @remarks
 * Cuando una ruta llega con `backgroundLocation`, el chat se renderiza como
 * overlay sobre la pantalla anterior manteniendo la ruta de fondo.
 *
 * @returns Rutas renderizables de la aplicacion.
 */
function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;
  const hideNavbar = ['/', '/login', '/registro'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div style={{ zoom: 0.8, minHeight: 'calc(100vh / 0.80)' }}>
        <Routes location={backgroundLocation ?? location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/registro" element={<AuthPage mode="register" />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/publicar-anuncio" element={<CreateListingPage />} />
          <Route path="/modificar-perfil" element={<EditProfilePage />} />
          <Route path="/modificar-password" element={<ChangePasswordPage />} />
          <Route path="/mis-anuncios" element={<MyAdsPage />} />
          <Route path="/mis-conversaciones" element={<ConversationsPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/vendedor/:id" element={<SellerInfoPage />} />
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route path="/chat/:id" element={<ChatPage isOverlay />} />
          </Routes>
        )}
      </div>
    </>
  );
}

export default App;
