"use client";

import store from "@/redux/store";
import { IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/single-factor-auth";
import React, { createContext, useState, ReactNode } from "react";
import { Provider } from "react-redux";
// Import { persistStore } from "redux-persist";
// Import { PersistGate } from "redux-persist/integration/react";

interface Web3authContextType {
  web3auth: any;
  setWeb3auth: React.Dispatch<React.SetStateAction<any>>;
  provider: any;
  setProvider: React.Dispatch<React.SetStateAction<any>>;
}

const defaultValue: Web3authContextType = {
  web3auth: null,
  // eslint-disable-next-line no-empty-function
  setWeb3auth: () => {},
  provider: null,
  // eslint-disable-next-line no-empty-function
  setProvider: () => {},
};

export const Web3authContext = createContext<Web3authContextType>(defaultValue);

interface Web3authProviderProps {
  children: ReactNode;
}

// Const persistor = persistStore(store);

export const Web3authProvider: React.FC<Web3authProviderProps> = ({
  children,
}) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <Web3authContext.Provider
        value={{ web3auth, setWeb3auth, provider, setProvider }}
      >
        {children}
      </Web3authContext.Provider>
      {/* </PersistGate> */}
    </Provider>
  );
};
