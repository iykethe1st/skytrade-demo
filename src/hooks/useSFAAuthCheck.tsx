"use client";
import { useEffect, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { decodeToken } from "@web3auth/single-factor-auth";
import { Web3authContext } from "@/providers/web3authProvider";
import { toast } from "react-toastify";
import UserService from "@/services/UserService";
import { useRouter, useSearchParams } from "next/navigation";
import useInitAuth from "./useInitAuth";
import useAuth from "./useAuth";
import { useAppDispatch } from "@/redux/store";
import { setEmail, setIsCheckingSFA } from "@/redux/slices/userSlice";

const useSFAAuthCheck = () => {
  const dispatch = useAppDispatch();
  useInitAuth();

  const { user, getIdTokenClaims } = useAuth0();
  const { web3auth, provider, setProvider } = useContext(Web3authContext);
  const { getUser } = UserService();
  const { handleUserNotFound } = useAuth();
  const params = useSearchParams();

  useEffect(() => {
    const connectToSFA = async () => {
      dispatch(setIsCheckingSFA(true));

      try {
        // Get the Auth0 ID token
        const idToken = params.get("token");
        if (!idToken) {
          console.error("No Auth0 ID token found");
          return;
        }

        // Decode token to get user info
        const { payload } = decodeToken(idToken);
        console.log({ idToken });
        if (payload) {
          //@ts-ignore
          dispatch(setEmail(payload.email));
        }

        //@ts-ignore
        if (payload && !payload.email_verified) {
          toast.info(
            "A verification email has been sent to your account. Please verify your email to login"
          );
        }

        const subVerifierInfoArray = [
          {
            verifier: process.env.NEXT_PUBLIC_EMAIL_VERIFIER_SUBIDENTIFIER,
            idToken,
          },
        ];

        const providerFromSFA = await web3auth?.connect({
          verifier: process.env.NEXT_PUBLIC_VERIFIER,
          verifierId: (payload as any).email,
          idToken,
          subVerifierInfoArray,
        });

        setProvider(providerFromSFA);

        const { error, data } = await getUser();
        if (error) {
          if (error && data?.message === "USER_NOT_FOUND") {
            await handleUserNotFound();
          }
        }
      } catch (err) {
        console.error("Error connecting to Web3Auth SFA:", err);
      } finally {
        dispatch(setIsCheckingSFA(false));
      }
    };
    if (user) connectToSFA();
  }, [user, web3auth]);
};

export default useSFAAuthCheck;
