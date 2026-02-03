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
    bio: "",
    profilePicture: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  React.useEffect(() => {
    if (fetchedUser) {
      setForm({
        username: fetchedUser.Username || "",
        bio: fetchedUser.Bio || "",
        profilePicture: fetchedUser.ProfilePicture || "",
      });
    }
  }, [fetchedUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            Bio: form.bio,
            ProfilePicture: form.profilePicture || null,
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
              {/* Profile Picture Preview */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-primary/20">
                {form.profilePicture ? (
                  <Image
                    src={form.profilePicture}
                    alt="Profile Preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-cover shadow-2xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                    {form.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="text-sm text-gray-400">Profile Picture Preview</p>
              </div>

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

              {/* Bio Field */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Profile Picture URL Field */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  name="profilePicture"
                  value={form.profilePicture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to use default avatar
                </p>
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
