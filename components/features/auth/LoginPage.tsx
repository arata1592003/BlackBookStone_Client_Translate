"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-auth-card shadow-xl rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-auth-text">
            Đăng nhập vào tài khoản của bạn
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-auth-border placeholder-gray-500 text-auth-text rounded-t-md focus:outline-none focus:ring-auth-focus-ring focus:border-auth-focus-ring focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-auth-border placeholder-gray-500 text-auth-text rounded-b-md focus:outline-none focus:ring-auth-focus-ring focus:border-auth-focus-ring focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <label htmlFor="remember-me" className="ml-2 block text-sm text-auth-text">
                Ghi nhớ tôi
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-medium text-auth-primary hover:text-auth-focus-ring">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-auth-primary hover:bg-auth-primary-hover focus:ring-2 focus:ring-offset-2 focus:ring-auth-focus-ring"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-auth-text-muted">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-medium text-auth-primary hover:text-auth-focus-ring">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
