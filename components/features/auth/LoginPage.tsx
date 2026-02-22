"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { login } from "@/app/actions/auth";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className="w-full bg-auth-primary hover:bg-auth-primary-hover focus:ring-2 focus:ring-offset-2 focus:ring-auth-focus-ring"
    >
      {pending ? "Đang xử lý..." : "Đăng nhập"}
    </Button>
  );
};

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get("error");
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-auth-card shadow-xl rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-auth-text">
            Đăng nhập vào tài khoản của bạn
          </h2>
        </div>
        {/* Form được liên kết trực tiếp với Server Action */}
        <form className="mt-8 space-y-6" action={login}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Địa chỉ email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-auth-border placeholder-muted-foreground text-auth-text rounded-t-md focus:outline-none focus:ring-auth-focus-ring focus:border-auth-focus-ring focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-auth-border placeholder-muted-foreground text-auth-text rounded-b-md focus:outline-none focus:ring-auth-focus-ring focus:border-auth-focus-ring focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-auth-primary focus:ring-auth-focus-ring border-auth-border rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-auth-text"
              >
                Ghi nhớ tôi
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-auth-primary hover:text-auth-focus-ring"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}
          <SubmitButton /> {/* Sử dụng component nút gửi mới */}
        </form>
        <div className="text-center text-sm text-auth-text-muted">
          Chưa có tài khoản?{" "}
          <Link
            href="/dang-ky"
            className="font-medium text-auth-primary hover:text-auth-focus-ring"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
