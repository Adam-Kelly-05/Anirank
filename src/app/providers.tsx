"use client";

import React from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_Sln68srsF",
  client_id: "1knbc5qbtphhlkv4dqm2humnk2",
  redirect_uri: "https://anirank.ie/",
  response_type: "code",
  scope: "phone openid email",
};

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>;
}
