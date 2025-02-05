import React, { useContext, useEffect } from "react";
import { Web3authContext } from "@/providers/web3authProvider";

import { Web3Auth } from "@web3auth/single-factor-auth";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || "",
  rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET || "",
  displayName: process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME || "",
  blockExplorer: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana Token",
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig },
});

const web3authSfa = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // or testnet, cyan, etc
  usePnPKey: true, // returns the same key as PnP Web SDK
  privateKeyProvider,
});

const useInitAuth = () => {
  const { setWeb3auth, setProvider, web3auth } = useContext(Web3authContext);

  const init = async () => {
    console.log({ provider: web3authSfa.provider });
    try {
      setWeb3auth(web3authSfa);

      if (web3authSfa && web3authSfa.provider) {
        setProvider(web3authSfa.provider);
        console.log("Web3Auth initialized successfully");
      }

      const result = await web3authSfa.init();
      console.log({ result });
    } catch (error) {
      console.error("Error in init:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (web3auth && web3auth.provider) {
      setProvider(web3auth.provider);
    }
  }, [web3auth?.provider]);

  return { init };
};

export default useInitAuth;
