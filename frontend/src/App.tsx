import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <ConversationsProvider>
        <AppRoutes />
      </ConversationsProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = ['/', '/login', '/registro'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
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
    </>
  );
}

export default App;
