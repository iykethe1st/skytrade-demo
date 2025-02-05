import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

interface UserState {
  newAirspaceModal: boolean;
  additionalInfoModal: boolean;
  airspaceData: {};

  user: any | null;
  isWaitingScreenVisible: boolean;

  isTriggerRefresh: boolean;
  userSolBalance: number;
  activeFilters: number;
  isCreateAuctionModalOpen: boolean;

  priceRange: number[];
  endDate: string | null;
  minSalePrice: number | null;
  assetId: string;
  toggleRequest: boolean;
  toggleDraw: boolean;
  isRequestAuctionModalOpen: boolean;

  requestedAirspaces: any[] | null;
  searchTerm: string;
  notifications: any[];
  pendingNotificationsCount: number | null;
  isFetchingNotifications: boolean;
  isCheckingSFA: boolean;
}

const initialState: UserState = {
  newAirspaceModal: false,
  additionalInfoModal: false,
  airspaceData: {},

  user: null,
  isWaitingScreenVisible: false,

  isTriggerRefresh: false,
  userSolBalance: 0,
  activeFilters: 0,
  isCreateAuctionModalOpen: false,

  priceRange: [0, 0],
  endDate: null,
  minSalePrice: null,
  assetId: "",
  toggleRequest: false,
  toggleDraw: false,
  isRequestAuctionModalOpen: false,

  requestedAirspaces: null,
  searchTerm: "",
  notifications: [],
  pendingNotificationsCount: null,
  isFetchingNotifications: true,
  isCheckingSFA: false,
};

const userSlice: Slice<UserState> = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNewAirspaceModal: (state, action: PayloadAction<boolean>) => {
      state.newAirspaceModal = action.payload;
    },

    setAdditionalInfoModal: (state, action: PayloadAction<boolean>) => {
      state.additionalInfoModal = action.payload;
    },

    setAirspaceData: (state, action: PayloadAction<{}>) => {
      state.airspaceData = action.payload;
    },

    setIsWaitingScreenVisible: (state, action: PayloadAction<boolean>) => {
      state.isWaitingScreenVisible = action.payload;
    },

    setIsTriggerRefresh: (state, action: PayloadAction<boolean>) => {
      state.isTriggerRefresh = action.payload;
    },
    setUserSolBalance: (state, action: PayloadAction<number>) => {
      state.userSolBalance = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
    },
    setMinSalePrice: (state, action: PayloadAction<number>) => {
      state.minSalePrice = action.payload;
    },
    setAssetId: (state, action: PayloadAction<string>) => {
      state.assetId = action.payload;
    },

    setPriceRange: (state, action: PayloadAction<number[]>) => {
      state.priceRange = action.payload;
    },
    setActiveFilters: (state, action: PayloadAction<number>) => {
      state.activeFilters = action.payload;
    },

    setIsCreateAuctionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateAuctionModalOpen = action.payload;
    },

    setToggleRequest: (state, action: PayloadAction<boolean>) => {
      state.toggleRequest = action.payload;
    },
    setToggleDraw: (state, action: PayloadAction<boolean>) => {
      state.toggleDraw = action.payload;
    },
    setIsRequestAuctionModal: (state, action: PayloadAction<boolean>) => {
      state.isRequestAuctionModalOpen = action.payload;
    },

    setRequestedAirspaces: (state, action: PayloadAction<any[]>) => {
      state.requestedAirspaces = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload;
    },
    setPendingNotificationsCount: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.pendingNotificationsCount = action.payload;
    },
    setIsFetchingNotifications: (state, action: PayloadAction<boolean>) => {
      state.isFetchingNotifications = action.payload;
    },
    setIsCheckingSFA: (state, action: PayloadAction<boolean>) => {
      state.isCheckingSFA = action.payload;
    },
  },
});

export const {
  setNewAirspaceModal,
  setAdditionalInfoModal,
  setAirspaceData,

  setIsWaitingScreenVisible,
  setUser,

  setIsTriggerRefresh,
  setUserSolBalance,
  setActiveFilters,
  setIsCreateAuctionModalOpen,

  setPriceRange,
  setEndDate,
  setMinSalePrice,
  setAssetId,
  setToggleRequest,
  setToggleDraw,
  setIsRequestAuctionModal,
  setRequestedAirspace,
  setRequestedAirspaces,
  setSearchTerm,
  setNotifications,
  setPendingNotificationsCount,
  setIsFetchingNotifications,
  setIsCheckingSFA,
} = userSlice.actions;
export default userSlice.reducer;
