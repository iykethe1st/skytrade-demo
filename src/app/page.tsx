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

export default function Home() {
  // useInitAuth();
  const { loginWithRedirect } = useAuth0();
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { user, getIdTokenClaims } = useAuth0();
  const { web3auth, provider, setProvider } = useContext(Web3authContext);
  const { getUser } = UserService();
  // useSFAAuthCheck();
  const connectToSFA = async () => {
    const params = useSearchParams();

    const token = params.get("token");
    try {
      // Get the Auth0 ID token
      if (!token) {
        console.error("No Auth0 ID token found");
        return;
      }

      // Decode token to get user info
      const { payload } = decodeToken(token);
      console.log({ token });

      //@ts-ignore
      if (payload && !payload.email_verified) {
        toast.info(
          "A verification email has been sent to your account. Please verify your email to login"
        );
      }

      const subVerifierInfoArray = [
        {
          verifier: process.env.NEXT_PUBLIC_EMAIL_VERIFIER_SUBIDENTIFIER,
          token,
        },
      ];

      const providerFromSFA = await web3auth.connect({
        verifier: process.env.NEXT_PUBLIC_VERIFIER,
        verifierId: (payload as any).email,
        token,
        subVerifierInfoArray,
      });

      console.log({ providerFromSFA });

      setProvider(providerFromSFA);

      const { error, data } = await getUser();
      if (error) {
        if (error && data?.message === "USER_NOT_FOUND") {
          console.log("USER_NOT_FOUND");
        }
      }
    } catch (err) {
      console.error("Error connecting to Web3Auth SFA:", err);
    }
  };

  useEffect(() => {
    if (web3auth?.status === "ready") connectToSFA();
  }, [web3auth?.status]);

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
        <p>Web3auth Status: {web3auth?.status}</p>
      </div>
    </Suspense>
  );
}
