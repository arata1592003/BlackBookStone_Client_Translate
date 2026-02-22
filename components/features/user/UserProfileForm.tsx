// components/features/user/UserProfileForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserProfile } from "@/modules/user/user.type";
import { updateUserProfileAction } from "@/app/actions/user";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const UserProfileForm = () => {
  const { user, userProfile, isProfileLoading } = useAuth();
  const queryClient = useQueryClient();

  const [state, setState] = useState<{ success?: string | null; error?: string | null }>({
    success: null,
    error: null,
  });
  const [pending, setPending] = useState(false); // Trạng thái pending thủ công

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
      // Clear message after some time
      const timer = setTimeout(() => setState({ success: null, error: null }), 5000);
      return () => clearTimeout(timer);
    }
    if (state?.error) {
      const timer = setTimeout(() => setState({ success: null, error: null }), 5000);
      return () => clearTimeout(timer);
    }
  }, [state, user?.id, queryClient]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setState({ success: null, error: null }); // Reset state

    const formData = new FormData(event.currentTarget);
    const result = await updateUserProfileAction(state, formData); // Truyền state ban đầu

    setState(result);
    setPending(false);
  };

  if (isProfileLoading) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const defaultValues: Partial<UserProfile> = {
    first_name: userProfile?.first_name || "",
    last_name: userProfile?.last_name || "",
    phone: userProfile?.phone || "",
    date_of_birth: userProfile?.date_of_birth || "",
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      {state?.success && (
        <div className="bg-success/20 text-success p-3 rounded-md text-sm">
          {state.success}
        </div>
      )}
      {state?.error && (
        <div className="bg-destructive/20 text-destructive p-3 rounded-md text-sm">
          {state.error}
        </div>
      )}

      {/* First Name */}
      <div>
        <Label htmlFor="first_name">Họ</Label>
        <Input
          id="first_name"
          name="first_name"
          type="text"
          defaultValue={defaultValues.first_name || ""}
          required
          placeholder="Nhập họ của bạn"
        />
      </div>

      {/* Last Name */}
      <div>
        <Label htmlFor="last_name">Tên</Label>
        <Input
          id="last_name"
          name="last_name"
          type="text"
          defaultValue={defaultValues.last_name || ""}
          required
          placeholder="Nhập tên của bạn"
        />
      </div>

      {/* Email (Read-only) */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email || ""}
          readOnly
          disabled
          className="bg-muted cursor-not-allowed"
          placeholder="Email của bạn"
        />
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues.phone || ""}
          placeholder="Ví dụ: 0912345678"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <Label htmlFor="date_of_birth">Ngày sinh</Label>
        <Input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          defaultValue={defaultValues.date_of_birth || ""}
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
};
