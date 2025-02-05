"use client";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, shallowEqual } from "react-redux";
import { Web3authContext } from "@/providers/web3authProvider";
import { useRouter } from "next/navigation";

import { setUser } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { useAuth0 } from "@auth0/auth0-react";
import { SolanaWallet } from "@web3auth/solana-provider";

const useAuth = () => {
  const router = useRouter();

  const [web3authStatus, setWeb3authStatus] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { web3auth, provider, setProvider } = useContext(Web3authContext);
  const { logout } = useAuth0();

  const { userData } = useAppSelector((state: any) => {
    return { userData: state?.userReducer?.user };
  }, shallowEqual);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      const currentUser = JSON.parse(userData);
      console.log({ currentUser });
    }
  }, []);

  useEffect(() => {
    const initStatus = async () => {
      if (web3auth && web3auth?.status === "connected" && provider) {
        setWeb3authStatus(true);
      } else {
        setWeb3authStatus(false);
      }
    };
    initStatus();
  }, [web3auth?.status, provider]);

  useEffect(() => {
    const initStatus = async () => {
      if (web3authStatus && userData) {
        setIsLoggedIn(true);
        localStorage.removeItem("referralCode");
      } else {
        setIsLoggedIn(false);
      }
    };
    initStatus();
  }, [web3authStatus, userData?.blockchainAddress, provider]);

  // Helper: Fetch user credentials from Web3Auth
  const fetchUserCredential = async () => {
    try {
      const credentials = await web3auth.authenticateUser();
      return credentials.idToken;
    } catch (error) {
      return null;
    } finally {
      console.info(
        "Refetching wallet info, web3auth status: ",
        web3auth?.status
      );
    }
  };

  // Helper: Handle user not found scenario
  const handleUserNotFound = async () => {
    try {
      const userInfo = await web3auth.getUserInfo();
      const solanaWallet = new SolanaWallet(provider);
      const [blockchainAddress] = await solanaWallet.requestAccounts();

      const categoryData = {
        email: userInfo.email,
        blockchainAddress,
      };

      localStorage.setItem("category", JSON.stringify(categoryData));
      router.replace("/auth/join");
    } catch (error) {
      console.error("Error handling user not found:", error);
    }
  };

  const signIn = ({ user }: { user: any }) => {
    if (user) console.log({ user });
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logOut = async () => {
    await logout();
    setProvider(null);
    sessionStorage.clear();
    localStorage.clear();
  };

  const signOut = async () => {
    await logOut();
    router.push("/auth");
  };

  const redirectToAuth = async () => {
    router.push("/auth");
  };

  const updateProfile = (updatedUser: any) => {
    console.log({ updatedUser });
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const redirectIfUnauthenticated = () => {
    if (web3auth && web3auth.status === "connected") return false;

    router.push("/auth");
    toast.success(
      "Congratulation!!! To ensure your your actions are saved and recognized, register now with SkyTrade."
    );
    return true;
  };

  return {
    signIn,
    signOut,
    updateProfile,
    isLoggedIn,
    user: userData,
    web3authStatus,

    redirectIfUnauthenticated,

    fetchUserCredential,
    handleUserNotFound,
    redirectToAuth,
  };
};

export default useAuth;
