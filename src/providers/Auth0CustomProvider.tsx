"use client";

import React from "react";

import { Auth0Provider } from "@auth0/auth0-react";

type GoogleAuthProviderProps = {
  children: React.ReactNode;
};

export function Auth0CustomProvider({ children }: GoogleAuthProviderProps) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: process.env.NEXT_PUBLIC_AUTH0_BASE_URL || "",
      }}
    >
      {children}
    </Auth0Provider>
  );
}
