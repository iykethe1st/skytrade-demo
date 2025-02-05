"use client";
import Image from "next/image";
import { useAuth0 } from "@auth0/auth0-react";
import AuthForm from "@/components/AuthForm";
import { Suspense, useContext, useEffect, useState } from "react";
import useSFAAuthCheck from "@/hooks/useSFAAuthCheck";
import { decodeToken } from "@web3auth/single-factor-auth";
import { useSearchParams } from "next/navigation";
import { Web3authContext } from "@/providers/web3authProvider";
import { toast } from "react-toastify";
import UserService from "@/services/UserService";
import useInitAuth from "@/hooks/useInitAuth";
import { SolanaWallet } from "@web3auth/solana-provider";
import useAuth from "@/hooks/useAuth";
import { useAppSelector } from "@/redux/store";
import { shallowEqual } from "react-redux";

export default function Home() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  useInitAuth();
  useSFAAuthCheck(token);

  const { web3auth, provider, setProvider } = useContext(Web3authContext);
  const [accounts, setAccounts] = useState("");
  const { user } = useAuth0();

  const { email } = useAppSelector((state) => {
    const { email } = state.userReducer;
    return {
      email,
    };
  }, shallowEqual);

  const getAccounts = async () => {
    if (provider) {
      try {
        const solanaWallet = new SolanaWallet(provider);

        const accounts = await solanaWallet?.requestAccounts();
        console.log("Solana public key(s):", accounts);
        setAccounts(accounts[0]);
        // If it returns an array, typically the first index [0] is your main public key
      } catch (error) {
        console.error("Failed to get Solana accounts:", error);
      }
    }
  };

  useEffect(() => {
    getAccounts();
  }, [provider]);
  return (
    <Suspense>
      <div className="flex flex-col gap-8 px-12">
        <div className="p-4">
          <Image
            src={"https://dev.sky.trade/images/logo-1.svg"}
            alt="Company's logo"
            width={199}
            height={77}
          />
        </div>
        <p>
          Web3auth Status:{" "}
          {web3auth?.status ? web3auth?.status : "disconnected"}
        </p>
        {email && <p>User: {email}</p>}
        {accounts && <p>Generated Wallet: {accounts}</p>}
      </div>
    </Suspense>
  );
}
