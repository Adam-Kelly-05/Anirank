"use client";

import React from "react";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_O9S7Dru8C",
  client_id: "7o79k59ebj2jg5s02mio124jc",
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
