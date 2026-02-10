"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/components/UseUserPatch";
import { User } from "@/types/User";

type EditUserFormProps = {
  user?: User | null;
  onSaved?: () => Promise<void> | void;
  onCancel?: () => void;
};

export function EditUserForm({ user, onSaved, onCancel }: EditUserFormProps) {
  const { updateUser } = useUpdateUser();
  const [form, setForm] = React.useState({
    username: user?.Username ?? "",
    bio: user?.Bio ?? "",
    profilePicture: user?.ProfilePicture ?? "",
  });
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  React.useEffect(() => {
    setForm({
      username: user?.Username ?? "",
      bio: user?.Bio ?? "",
      profilePicture: user?.ProfilePicture ?? "",
    });
  }, [user?.Username, user?.Bio, user?.ProfilePicture]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const ok = await updateUser({
        payload: {
          Username: form.username,
          Bio: form.bio,
          ProfilePicture: form.profilePicture || null,
        },
      });

      if (!ok) {
        throw new Error("Failed to update account");
      }

      setSaveSuccess(true);
      if (onSaved) {
        await onSaved();
      }
      setTimeout(() => setSaveSuccess(false), 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update account.";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      username: user?.Username ?? "",
      bio: user?.Bio ?? "",
      profilePicture: user?.ProfilePicture ?? "",
    });
    setSaveError("");
    setSaveSuccess(false);
    onCancel?.();
  };

  return (
    <Card className="mb-8 bg-card border-primary/20">
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
            <label className="block text-white font-semibold mb-2">Username</label>
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
            <label className="block text-white font-semibold mb-2">Bio</label>
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
            <label className="block text-white font-semibold mb-2">Profile Picture URL</label>
            <input
              type="url"
              name="profilePicture"
              value={form.profilePicture}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-primary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to use default avatar</p>
          </div>

          {/* Error/Success Messages */}
          {saveError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
              Account updated successfully!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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
  );
}
