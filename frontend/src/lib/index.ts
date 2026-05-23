
export { API_BASE_URL, API_ORIGIN, apiRequest } from '../api/client';
export { login } from '../api/auth';
export { getCategories } from '../api/categories';
export {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  getArticlesByCategory,
  getMyArticles,
  renewArticle,
  updateArticle,
} from '../api/articles';
export {
  deleteConversation,
  getConversation,
  getMyConversations,
  markConversationAsRead,
  sendConversationMessage,
  startConversation,
} from '../api/conversations';
export {
  followArticle,
  getFollowedArticles,
  unfollowArticle,
} from '../api/follows';
export {
  changeMyPassword,
  createUser,
  getMyProfile,
  getUserContact,
  updateMyProfile,
  updateMyProfileImage,
} from '../api/users';

export { default as Navbar } from '../components/layout/Navbar';
export { default as FollowedProductsSection } from '../components/sections/FollowedProductsSection';
export { default as BackButton } from '../components/ui/BackButton';
export { default as ProductCard } from '../components/ui/ProductCard';

export { ConversationsProvider } from '../context/ConversationsContext';
export { ConversationsContext } from '../context/conversationsContextValue';
export { useConversations } from '../context/useConversations';

export { categories } from '../data/categories';

export { default as App } from '../App';
export { default as AuthPage } from '../pages/AuthPage';
export { default as ChangePasswordPage } from '../pages/ChangePasswordPage';
export { default as ChatPage } from '../pages/ChatPage';
export { default as ConversationsPage } from '../pages/ConversationsPage';
export { default as CreateListingPage } from '../pages/CreateListingPage';
export { default as EditProfilePage } from '../pages/EditProfilePage';
export { default as HomePage } from '../pages/HomePage';
export { default as LandingPage } from '../pages/LandingPage';
export { default as MyAdsPage } from '../pages/MyAdsPage';
export { default as ProductDetailPage } from '../pages/ProductDetailPage';
export { default as SellerInfoPage } from '../pages/SellerInfoPage';

export { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_LABEL } from '../utils/files';
export { validateImageSize } from '../utils/files';
export { getOtherConversationUser } from '../utils/conversationUsers';
export { getBackendImageUrl } from '../utils/images';
export {
  clearSession,
  getSessionToken,
  getSessionUserId,
  saveSession,
} from '../utils/session';

export type {
  ArticleCardResponse,
  ArticleRequest,
  ArticleResponse,
} from '../api/articles';
export type { LoginRequest, LoginResponse } from '../api/auth';
export type { CategoryResponse } from '../api/categories';
export type {
  ConversationResponse,
  ConversationUserResponse,
  MessageResponse,
} from '../api/conversations';
export type {
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserContactResponse,
} from '../api/users';
export type { ConversationsContextValue } from '../context/conversationsContextValue';
export type { Categoria } from '../data/categories';
export type {
  Conversation,
  ConversationMessage,
} from '../types/conversation';
export type { EstadoArticulo } from '../types/enums/estado-articulo';
export type {
  CategoriaSlug,
  Product,
  ProductCardData,
} from '../types/product';
export type { SellerContact } from '../types/seller';
export type { UserProfile } from '../types/user';
