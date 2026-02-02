"use client";

import React from "react";
import { useAuth } from "react-oidc-context";
import { useGetUser } from "./UseUserGet";

export default function OidcAuthPanel() {
  const auth = useAuth();
  const appUser = useGetUser(auth.user?.profile?.sub as string);

  const clearClientStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore storage access issues (e.g. disabled in browser).
    }

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const name = cookie.split("=")[0].trim();
      if (!name) continue;
      document.cookie = `${name}=; Max-Age=0; path=/;`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.anirank.ie;`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=anirank.ie;`;
    }
  };

  const signOutRedirect = () => {
    const clientId = "2a56v5hnl5nn65tho958c2rcj3";
    const logoutUri = "https://anirank.ie/";
    const cognitoDomain =
      "https://eu-west-1ce1rf5nox.auth.eu-west-1.amazoncognito.com";
    clearClientStorage();
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

  // if (auth.isAuthenticated) {
  //   return (
  //     <div className="space-y-2 text-sm text-gray-300">
  //       <pre>Email: {auth.user?.profile.email}</pre>
  //       <pre>Username: {appUser?.Username ?? auth.user?.profile?.preferred_username}</pre>
  //       <pre>User ID: {appUser?.userId ?? auth.user?.profile?.sub}</pre>
  //       <pre>Bio: {appUser?.Bio ?? "N/A"}</pre>
  //       <pre>Date Joined: {appUser?.DateJoin ?? "N/A"}</pre>
  //       <pre>Profile Picture: {appUser?.ProfilePicture ?? "N/A"}</pre>
  //       <button onClick={() => auth.removeUser()}>Sign out</button>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="appearance-none rounded border-2 border-green-600 bg-transparent px-4 py-2 text-green-600 hover:border-green-700 hover:text-green-700 active:border-green-700 active:text-green-700 focus-visible:border-green-600 focus-visible:ring-0"
        onClick={() => auth.signinRedirect()}
      >
        Sign in
      </button>
      <button
        className="appearance-none rounded border-2 border-red-600 bg-transparent px-4 py-2 text-red-600 hover:border-red-700 hover:text-red-700 active:border-red-700 active:text-red-700 focus-visible:border-red-600 focus-visible:ring-0"
        onClick={() => signOutRedirect()}
      >
        Sign out
      </button>
    </div>
  );
}
