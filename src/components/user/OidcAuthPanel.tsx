"use client";

import React from "react";
import { useAuth } from "react-oidc-context";
import { useGetUser } from "./UseUserGet";

export default function OidcAuthPanel() {
  const auth = useAuth();
  const { user: appUser, loading: userLoading } = useGetUser(auth.user?.profile?.sub as string);
  const isSignedIn = auth.isAuthenticated || (!!auth.user && !userLoading) || !!appUser;

  const clearClientStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const name = cookie.split("=")[0].trim();
      if (!name) continue;
      document.cookie = `${name}=; Max-Age=0; path=/;`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.anirank.ie;`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=anirank.ie;`;
    }
  };

  const signOutRedirect = async () => {
    const clientId = "2a56v5hnl5nn65tho958c2rcj3";
    const logoutUri = "https://anirank.ie/";
    const cognitoDomain = "https://eu-west-1ce1rf5nox.auth.eu-west-1.amazoncognito.com";
    try {
      await auth.removeUser();
    } catch {}
    clearClientStorage();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri,
    )}`;
  };

  if (auth.isLoading || auth.activeNavigator) {
    return null;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="flex w-full justify-center items-center text-center">
      {isSignedIn ? (
        <button
          className="appearance-none rounded border-2 border-red-600 bg-transparent px-4 py-2 text-red-600 hover:border-red-700 hover:text-red-700 active:border-red-700 active:text-red-700 focus-visible:border-red-600 focus-visible:ring-0"
          onClick={() => signOutRedirect()}
        >
          Sign out
        </button>
      ) : (
        <button
          className="appearance-none rounded border-2 border-blue-600 bg-transparent px-4 py-2 text-blue-600 hover:border-blue-700 hover:text-blue-700 active:border-blue-700 active:text-blue-700 focus-visible:border-blue-600 focus-visible:ring-0"
          onClick={() => auth.signinRedirect()}
        >
          Sign in
        </button>
      )}
    </div>
  );
}
