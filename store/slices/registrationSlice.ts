import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BuyerRegistrationData {
    fullName?: string;
    email?: string;
    phone?: string;
    gender?: string;
    nidNumber?: string;
    country?: string;
    nidFrontPhotoUrl?: string; // URI
    nidBackPhotoUrl?: string;  // URI
    profilePhotoUrl?: string;  // URI
}

interface VendorRegistrationData {
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    storename?: string;
    storeDescription?: string;
    logo?: string;
    nationalIdNumber?: string;
    bussinessRegNumber?: string;
    nidFront?: string;
    nidBack?: string;
    businessId?: string;
    gender?: string;
    country?: string;
}

interface RegistrationState {
    buyer: BuyerRegistrationData;
    vendor: VendorRegistrationData;
}

const initialState: RegistrationState = {
    buyer: {},
    vendor: {},
};

const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        updateBuyerRegistration: (state, action: PayloadAction<Partial<BuyerRegistrationData>>) => {
            state.buyer = { ...state.buyer, ...action.payload };
        },
        resetBuyerRegistration: (state) => {
            state.buyer = {};
        },
        updateVendorRegistration: (state, action: PayloadAction<Partial<VendorRegistrationData>>) => {
            state.vendor = { ...state.vendor, ...action.payload };
        },
        resetVendorRegistration: (state) => {
            state.vendor = {};
        },
    },
});

export const {
    updateBuyerRegistration,
    resetBuyerRegistration,
    updateVendorRegistration,
    resetVendorRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;
