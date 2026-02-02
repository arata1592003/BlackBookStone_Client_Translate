"use client";

import Link from "next/link";
import React, { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage(
          "Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.",
        );
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-auth-card shadow-xl rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-auth-text">
            Tạo tài khoản mới
          </h2>
        </div>
        {successMessage ? (
          <div className="text-green-600 text-center">{successMessage}</div>
        ) : (
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
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-auth-border placeholder-gray-500 text-auth-text focus:outline-none focus:ring-auth-focus-ring focus:border-auth-focus-ring focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-auth-border placeholder-gray-500 text-auth-text rounded-b-md focus:outline-none focus:ring-auth-focus-ring focus:border-auth-focus-ring focus:z-10 sm:text-sm"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </div>
          </form>
        )}
        <div className="text-center text-sm text-auth-text-muted">
          Đã có tài khoản?{" "}
          <Link
            href="/dang-nhap"
            className="font-medium text-auth-primary hover:text-auth-focus-ring"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
