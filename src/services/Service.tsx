import { useContext } from "react";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import { Web3authContext } from "@/providers/web3authProvider";
import axios from "axios";
import base58 from "bs58";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/nextjs";

import { io } from "socket.io-client";
import useAuth from "@/hooks/useAuth";
import RESPONSE_ERRORS from "@/utils/errors";

interface RequestI {
  uri: string;
  isPublic?: boolean;
  postData?: any;
  suppressErrorReporting?: boolean;
}

const TIMEOUT = 300000;
const CUSTOM_ERROR_MESSAGE = "An Error occured! Please try again later.";

const Service = () => {
  const { provider, web3auth } = useContext(Web3authContext);
  const { fetchUserCredential } = useAuth();

  const getRequestUrl = (uri: string): string => {
    const serverUrl = String(process.env.NEXT_PUBLIC_SERVER_URL);

    return `${serverUrl}${uri}`;
  };

  const toastError = (error: any, suppressErrorReporting?: boolean) => {
    console.error(error);
    if (!navigator.onLine) {
      toast.error(
        "Network unavailable. Please check your connection and try again."
      );
      return;
    }
    if (!suppressErrorReporting && error.response) {
      const backendError =
        error?.response?.data?.errorMesagge ||
        error?.response?.data?.message ||
        error?.response?.data?.data?.message;

      console.error(backendError, error.response.data);

      if (backendError !== "USER_NOT_FOUND") {
        const customBackendError =
          //@ts-ignore
          RESPONSE_ERRORS[backendError] || backendError;

        if (customBackendError) {
          toast.error(customBackendError);
        } else {
          toast.error(CUSTOM_ERROR_MESSAGE);
        }
      }
    }
    Sentry.captureException(error);
    return error;
  };

  const createHeader = async ({
    isPublic,
    uri,
  }: {
    uri?: string;
    isPublic?: boolean;
  }) => {
    try {
      let newHeader = {};

      if (!isPublic) {
        const userCredential = await fetchUserCredential();
        if (provider && userCredential) {
          const solanaWallet = new SolanaWallet(provider);
          const accounts = await solanaWallet.requestAccounts();

          const payload = new SIWPayload();
          payload.domain = String(process.env.NEXT_PUBLIC_FRONTEND_DOMAIN);
          payload.uri = encodeURI(
            `${process.env.NEXT_PUBLIC_SERVER_URL}${uri}`
          );
          payload.address = accounts[0];
          payload.statement = "Sign in to SkyTrade app.";
          payload.version = "1";
          payload.chainId = 1;

          const header = { t: "sip99" };
          const network = "solana";

          const message = new SIWWeb3({ header, payload, network });

          const messageText = message.prepareMessage();
          const msg = new TextEncoder().encode(messageText);
          const result = await solanaWallet.signMessage(msg);

          const signature = base58.encode(result);

          const userInformation = await web3auth.getUserInfo();
          newHeader = {
            "Content-Type": "application/json",
            sign: signature,
            sign_issue_at: message.payload.issuedAt,
            sign_nonce: message.payload.nonce,
            sign_address: accounts[0],
            email_address: userInformation.email,
          };
        } else {
          console.info("Provider not set");
          return undefined;
        }
      } else {
        newHeader = {
          "Content-Type": "application/json",
        };
      }

      return {
        ...newHeader,
        api_key: process.env.NEXT_PUBLIC_FRONTEND_API_KEY, // TODO: remove
      };
    } catch (error) {
      console.error(error);
    }
  };

  const getRequest = async ({
    uri,
    isPublic,
    suppressErrorReporting,
  }: RequestI) => {
    try {
      const headers = await createHeader({ isPublic, uri });
      if (!isPublic && !headers) return null;
      return await axios({
        method: "get",
        timeout: TIMEOUT,
        url: getRequestUrl(uri),
        headers,
      });
    } catch (error) {
      return toastError(error, suppressErrorReporting);
    }
  };

  const postRequest = async ({
    uri,
    postData,
    isPublic,
    suppressErrorReporting,
  }: RequestI) => {
    try {
      const headers = await createHeader({ isPublic, uri });

      if (!isPublic && !headers) return null;

      return await axios({
        method: "post",
        url: getRequestUrl(uri),
        timeout: TIMEOUT,
        data: { ...postData },
        headers,
      });
    } catch (error) {
      toastError(error, suppressErrorReporting);
      //@ts-ignore
      throw new Error(error?.response?.data?.message || error?.message);
    }
  };

  const patchRequest = async ({
    uri,
    postData,
    isPublic,
    suppressErrorReporting,
  }: RequestI) => {
    try {
      const headers = await createHeader({ isPublic, uri });

      if (!isPublic && !headers) return null;

      return await axios({
        method: "patch",
        url: getRequestUrl(uri),
        timeout: TIMEOUT,
        data: { ...postData },
        headers,
      });
    } catch (error) {
      return toastError(error, suppressErrorReporting);
    }
  };

  const deleteRequest = async ({
    uri,
    postData,
    isPublic,
    suppressErrorReporting,
  }: RequestI) => {
    try {
      const headers = await createHeader({ isPublic, uri });

      if (!isPublic && !headers) return null;

      return await axios({
        method: "delete",
        url: getRequestUrl(uri),
        timeout: TIMEOUT,
        data: { ...postData },
        headers,
      });
    } catch (error) {
      return toastError(error, suppressErrorReporting);
    }
  };

  const initialiseWebsocket = async () => {
    try {
      const socket = io(
        `${process.env.NEXT_PUBLIC_SERVER_SOCKET_IO_BASE_URL}/notifications`,
        {
          transports: ["websocket"],
          auth: await createHeader({ isPublic: false, uri: "/notifications" }),
        }
      );
      socket.on("connect", () => console.info("WebSocket connected!"));
      socket.on("connect_error", (err) =>
        console.error("WebSocket connection error:", err.message)
      );
      return socket;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getRequest,
    postRequest,
    patchRequest,
    deleteRequest,
    initialiseWebsocket,
    createHeader,
  };
};

export default Service;
