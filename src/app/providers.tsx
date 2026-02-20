"use client";

import React from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_CE1rF5NoX",
  client_id: "2a56v5hnl5nn65tho958c2rcj3",
  redirect_uri: "https://anirank.ie/profile/",
  response_type: "code",
  scope: "email openid phone",
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
