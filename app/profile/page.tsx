"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSystemUsers, SystemUser } from "@/services/systemUserApi";

export default function ProfilePage() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [profile, setProfile] = useState<SystemUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      getSystemUsers({ email: user.email })
        .then(res => {
          setProfile(res.data && res.data.length > 0 ? res.data[0] : null);
          setLoading(false);
        })
        .catch(() => {
          setError("Unable to load profile info");
          setLoading(false);
        });
    }
  }, [user?.email]);

  if (authLoading || loading) return <div className="p-8">Loading profile...</div>;
  if (authError || error) return <div className="p-8 text-red-500">{authError || error}</div>;
  if (!profile) return <div className="p-8 text-gray-500">No profile information found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="flex items-center gap-4 mb-4">
        <img
          src={profile.image || "/placeholder-user.jpg"}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold text-lg">{profile.lastName} {profile.firstName}</div>
          <div className="text-gray-500">{profile.email}</div>
        </div>
      </div>
      <div className="mb-2"><b>Role:</b> {profile.role}</div>
      {profile.updatedAt && <div className="mb-2"><b>Last updated:</b> {new Date(profile.updatedAt).toLocaleString()}</div>}
    </div>
  );
} 