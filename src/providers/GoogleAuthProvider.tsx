"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

type GoogleAuthProviderProps = {
  children: React.ReactNode;
};

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>{children}</GoogleOAuthProvider>
  );
}
