"use client";

import React from "react";
import { useAuth } from "react-oidc-context";
import { useUser } from "./UseUser";

export default function OidcAuthPanel() {
  const auth = useAuth();
  const appUser = useUser(auth.user?.id_token as string);

  console.log("ADAM auth/user snapshot", {
    status:
      auth.activeNavigator ??
      (auth.isAuthenticated ? "authenticated" : "unauthenticated"),
    oidcProfile: auth.user?.profile ?? null,
    tokens: {
      id: auth.user?.id_token ?? null,
      access: auth.user?.access_token ?? null,
      refresh: auth.user?.refresh_token ?? null,
    },
    appUser: appUser ?? null,
    error: auth.error?.message ?? null,
  });

  const signOutRedirect = () => {
    const clientId = "2a56v5hnl5nn65tho958c2rcj3";
    const logoutUri = "https://anirank.ie/";
    const cognitoDomain =
      "https://eu-west-1ce1rf5nox.auth.eu-west-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div className="space-y-2 text-sm text-gray-300">
        <pre>Email: {auth.user?.profile.email}</pre>
        <pre>Username: {appUser?.Username ?? auth.user?.profile?.preferred_username}</pre>
        <pre>User ID: {appUser?.userId ?? auth.user?.profile?.sub}</pre>
        <pre>Bio: {appUser?.Bio ?? "N/A"}</pre>
        <pre>Date Joined: {appUser?.DateJoin ?? "N/A"}</pre>
        <pre>Profile Picture: {appUser?.ProfilePicture ?? "N/A"}</pre>
        <pre>ID Token: {auth.user?.id_token}</pre>
        <pre>Access Token: {auth.user?.access_token}</pre>
        <pre>Refresh Token: {auth.user?.refresh_token}</pre>
        <pre>OIDC Profile: {JSON.stringify(auth.user?.profile, null, 2)}</pre>
        <pre>App User: {JSON.stringify(appUser ?? {}, null, 2)}</pre>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}
