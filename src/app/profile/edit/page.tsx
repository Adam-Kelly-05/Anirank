"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/components/UseUser";
import { useAuth } from "react-oidc-context";

export default function EditAccountPage() {
  const router = useRouter();
  const auth = useAuth();
  const fetchedUser = useUser(auth.user?.profile?.sub as string);

  const [form, setForm] = React.useState({
    username: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  React.useEffect(() => {
    if (fetchedUser) {
      setForm({
        username: fetchedUser.Username || "",
      });
    }
  }, [fetchedUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const response = await fetch(
        `https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/${auth.user?.profile?.sub}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Username: form.username,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update account");
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      setSaveError(err.message || "Failed to update account.");
    } finally {
      setSaving(false);
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400 mb-4">Please log in to edit your account</p>
            <Button onClick={() => router.push('/profile')}>Go to Profile</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!fetchedUser) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="mb-4 border-primary/30 text-gray-400 hover:text-white hover:border-primary/50"
          >
            ← Back to Profile
          </Button>
          <h1 className="text-4xl font-bold text-white">Edit Account</h1>
          <p className="text-gray-400 mt-2">Update your profile information</p>
        </div>

        {/* Edit Form */}
        <Card className="bg-card border-primary/20">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Error/Success Messages */}
              {saveError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                  Account updated successfully! Redirecting...
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  disabled={saving}
                  className="border-primary/30 text-gray-400 hover:text-white hover:border-primary/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
