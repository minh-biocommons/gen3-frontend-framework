import {
  useUser,
  useUserAuth,
  resetUserState,
  fetchUserState,
  isAuthenticated,
  selectUser,
  selectUserData,
  selectUserLoginStatus,
  useIsUserLoggedIn,
} from './userSlice';

import {
  useFetchUserDetailsQuery,
  useLazyFetchUserDetailsQuery,
  selectUserDetails,
  selectUserAuthStatus,
  useGetCSRFQuery,
  selectCSRFToken,
  selectCSRFTokenData,
  selectHeadersWithCSRFToken,
  type CSRFToken,
} from './userSliceRTK';

import {
  useGetExternalLoginsQuery,
  useHasExistingSessionQuery,
  useLazyHasExistingSessionQuery,
} from './externalLoginsSlice';
import {
  type UserProfile,
  type LoginStatus,
  type JWTSessionStatus,
  type Gen3User,
  type ExternalProvider,
  type NamedURL,
} from './types';

export {
  type Gen3User,
  type LoginStatus,
  type UserProfile,
  type JWTSessionStatus,
  type CSRFToken,
  type ExternalProvider,
  type NamedURL,
  useUser,
  useUserAuth,
  resetUserState,
  selectUser,
  selectUserData,
  selectUserLoginStatus,
  fetchUserState,
  isAuthenticated,
  useIsUserLoggedIn,
  useGetExternalLoginsQuery,
  useFetchUserDetailsQuery,
  useLazyFetchUserDetailsQuery,
  selectUserDetails,
  selectUserAuthStatus,
  useGetCSRFQuery,
  selectCSRFToken,
  selectCSRFTokenData,
  useHasExistingSessionQuery,
  useLazyHasExistingSessionQuery,
  selectHeadersWithCSRFToken,
};
