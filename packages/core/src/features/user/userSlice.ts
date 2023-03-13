import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchFence, Gen3FenceResponse } from "../fence";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GEN3_DOMAIN } from "../../constants";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { useCoreDispatch, useCoreSelector } from "../../hooks";
import { useEffect } from "react";

export type Gen3User = {
  username?: string;
  email?: string;
  avatar?: string;
  id?: string;
};

interface Gen3FenceUserResponse {
  data: Gen3User;
}

export interface Gen3UserLoginResponse<T> {
  readonly data?: T;
  readonly error?: string;
  readonly loginStatus: LoginStatus;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isAuthenticated: boolean;
  readonly isError: boolean;
}

export const fetchUserState = createAsyncThunk<
  Gen3FenceResponse<Gen3FenceUserResponse>,
  void,
  { dispatch: CoreDispatch; state: CoreState }
>("fence/user", async () => {
  return await fetchFence({
    hostname: `${GEN3_DOMAIN}`,
    endpoint: "/user/user",
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      credentials: "include",
    },
  });
});

export type LoginStatus = "authenticated" | "unauthenticated" | "pending";

export interface Gen3UserState extends Gen3User {
  readonly status: DataStatus;
  readonly loginStatus: LoginStatus;
  readonly error?: string;
}

const initialState: Gen3UserState = {
  status: "uninitialized",
  loginStatus: "unauthenticated",
  error: undefined,
};

const slice = createSlice({
  name: "fence/user",
  initialState,
  reducers: {
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserState.fulfilled, (_, action) => {
        const response = action.payload;
        if (response.errors) {
          return {
            status: "rejected",
            loginStatus: "unauthenticated",
            error: response.errors.filters,
          };
        }

        return {
          ...response.data,
          status: "fulfilled",
          loginStatus: "authenticated",
        };
      })
      .addCase(fetchUserState.pending, () => {
        return { status: "pending", loginStatus: "unauthenticated" };
      })
      .addCase(fetchUserState.rejected, () => {
        return { status: "rejected", loginStatus: "unauthenticated" };
      });
  },
});

export const userReducer = slice.reducer;

export const { resetUserState } = slice.actions;

export interface Gen3USerSelectorResponse<T>
  extends CoreDataSelectorResponse<T> {
  readonly loginStatus: LoginStatus;
}

export const selectUserData = (
  state: CoreState,
): Gen3USerSelectorResponse<Gen3User> => {
  return {
    data: state.user,
    status: state.user.status,
    loginStatus: state.user.loginStatus,
    error: state.user.error,
  };
};

export const selectUser = (state: CoreState): Gen3UserState => state.user;

export const selectUserLoginStatus = (state: CoreState): LoginStatus =>
  state.user.loginStatus;

export const useUser = createUseCoreDataHook(fetchUserState, selectUserData);

/**
 * Hook to return get the authenticated state of the user and if logged in,
 * the user's profile and access data.
 * Note that if fetchUserState gets called, the user's session is renewed.
 */
export const useUserAuth = (renew = false): Gen3UserLoginResponse<Gen3User> => {
  const coreDispatch = useCoreDispatch();
  const { data, status, loginStatus, error } = useCoreSelector(selectUserData);

  useEffect(() => {
    if (status === "uninitialized" || renew) {
      // TODO: need to determine what other states require dispatch
      coreDispatch(fetchUserState());
    }
  }, [status, coreDispatch, renew]);

  return {
    data,
    error,
    loginStatus,
    isUninitialized: status === "uninitialized",
    isFetching: status === "pending",
    isSuccess: status === "fulfilled",
    isError: status === "rejected",
    isAuthenticated: status === "fulfilled",
  };
};
