import { callFetchAccount } from "@/app/config/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  errorRefreshToken: string;
  activeMenu: string;
  user: {
    token: string;
    email: string;
    lastName: string;
    firstName: string;
  };
}

export const fetchAccount = createAsyncThunk(
  "acount/fetchAcount",
  async ({ accessToken }: { accessToken: String }) => {
    const response = await callFetchAccount(accessToken);
    return response.data;
  }
);

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: "",
  activeMenu: "home",
  user: {
    token: "",
    email: "",
    lastName: "",
    firstName: "",
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user.token = action?.payload?.token;
      state.user.lastName = action.payload.lastName;
      state.user.firstName = action.payload.firstName;
    },
    setLogoutAction: (state, action) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = {
        token: "",
        email: "",
        lastName: "",
        firstName: "",
      };
    },
    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false;
      state.errorRefreshToken = action.payload?.message ?? "";
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = true;
      }
    });

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user.token = action?.payload?.token;
        state.user.lastName = action.payload.lastName;
        state.user.firstName = action.payload.firstName;
      }
    });

    builder.addCase(fetchAccount.rejected, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = false;
      }
    });
  },
});

export const { setUserLoginInfo, setLogoutAction, setRefreshTokenAction } =
  accountSlice.actions;

export default accountSlice.reducer;
