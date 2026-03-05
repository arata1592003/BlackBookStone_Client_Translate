"use client";

import { UserProfileForm } from "@/components/features/user/UserProfileForm";

export default function UserInfoPage() {
  return (
    <div className="flex-1 flex flex-col items-start gap-5 p-5 relative self-stretch w-full grow bg-surface-section">
      <div className="flex flex-col items-start gap-2.5">
        <h2 className="text-3xl font-bold text-text-primary">
          Thông tin cá nhân
        </h2>
        <p className="text-lg text-text-secondary">
          Quản lý thông tin cá nhân của bạn.
        </p>
      </div>
      <UserProfileForm />
    </div>
  );
}
