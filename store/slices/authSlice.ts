import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: {
        id: string;
        name?: string;
        fullName?: string;
        fulllName?: string; // Backend typo support
        email: string;
        phone?: string;
        nationalIdNumber?: string;
        gender?: string;
        userType: string;
        vendorCode?: string;
        vendor?: string; // Backend alias
        businessName?: string;
        storename?: string;
        address?: string;
        aboutStore?: string;
        logo?: string;
        image?: string; // Backend alias
        avatar?: string; // Frontend alias
        dob?: string;
        idType?: string;
        idNumber?: string;
    } | null;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: AuthState['user']; accessToken: string; refreshToken: string }>
        ) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        logOut: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectCurrentRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;

export default authSlice.reducer;
