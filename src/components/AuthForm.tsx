"use client";
import React, { FC, useContext } from "react";
import Image from "next/image";

import Link from "next/link";

import useAuth from "@/hooks/useAuth";

import { Web3authContext } from "@/providers/web3authProvider";

import { useAuth0 } from "@auth0/auth0-react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { decodeToken } from "@web3auth/single-factor-auth";
import UserService from "@/services/UserService";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  isNewsletterChecked: boolean;
  setIsNewsletterChecked: (value: boolean) => void;
  handleRedirectToSky: () => void;
}

const AuthForm: FC<AuthFormProps> = ({
  isLogin,
  setIsLogin,
  isNewsletterChecked,
  setIsNewsletterChecked,
  handleRedirectToSky,
}) => {
  const { handleUserNotFound, signOut } = useAuth();
  const { loginWithRedirect, user } = useAuth0();
  const { web3auth, setProvider } = useContext(Web3authContext);
  const { getUser } = UserService();

  const handleSwitchingBetweenLoginAndRegister = () => {
    setIsLogin(!isLogin);
    setIsNewsletterChecked(!isNewsletterChecked);
  };

  const onSuccess = async (response: CredentialResponse) => {
    try {
      if (!web3auth) {
        return;
      }
      const idToken = response.credential;
      if (!idToken) {
        throw new Error("No id token found");
      }
      const { payload } = decodeToken(idToken);

      const subVerifierInfoArray = [
        {
          verifier: process.env.NEXT_PUBLIC_GOOGLE_VERIFIER_SUBIDENTIFIER,
          idToken: idToken!,
        },
      ];
      const web3authProvider = await web3auth.connect({
        verifier: process.env.NEXT_PUBLIC_VERIFIER,
        verifierId: (payload as any).email,
        idToken: idToken!,
        subVerifierInfoArray,
      });

      localStorage.setItem("showbanner", "true");
      setProvider(web3authProvider);

      const { error, data } = await getUser();
      console.log({ error, data });
    } catch (err) {
      console.error(err);
    }
  };

  console.log({ user });

  return (
    <div className="mx-auto flex h-screen w-screen items-center justify-center md:h-full md:w-full">
      <div className="m-auto flex w-full flex-col items-center justify-center gap-[15px] bg-background-light px-[30px] py-[40px] dark:bg-background-RaisinBlack md:w-[449px]">
        <Image
          src={
            "https://hoversafe.com/wp-content/uploads/2024/07/hoversafe-logo.svg"
          }
          alt="Company's logo"
          width={199}
          height={77}
        />

        {user && <p>User logged in as {user?.email}</p>}

        {user ? (
          <button
            color={""}
            type="button"
            onClick={handleRedirectToSky}
            className="flex w-full justify-center rounded-md bg-blue-500 px-24 py-4 text-[15px] text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
          >
            Redirect to SKY
          </button>
        ) : (
          <button
            color={""}
            type="button"
            onClick={() => loginWithRedirect()}
            className="flex w-full justify-center rounded-md bg-blue-500 px-24 py-4 text-[15px] text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
