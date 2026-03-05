"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabase/client";
import { 
  Chrome, 
  Lock, 
  AlertCircle, 
  ArrowRight
} from "lucide-react";

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [loadingGoogle, setLoading] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get("error");
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Lỗi đăng nhập Google.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-surface-card border border-border-default shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8 md:p-10 text-center">
            {/* Logo/Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                <Lock size={32} className="text-primary" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-text-primary mb-2">
                Chào mừng trở lại
              </h2>
              <p className="text-text-secondary text-sm max-w-[280px]">
                Đăng nhập nhanh chóng và an toàn bằng tài khoản Google của bạn
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-left animate-in slide-in-from-top-2">
                <AlertCircle className="text-destructive shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-destructive font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <Button
                onClick={handleGoogleLogin}
                disabled={loadingGoogle}
                className="w-full h-14 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                {loadingGoogle ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.84h2.64c1.55-1.42 2.43-3.58 2.43-5.27z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.84c-.73.49-1.66.78-2.64.78-2.03 0-3.75-1.37-4.36-3.22H2.02v3.06C3.83 21.36 7.64 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M7.64 15.06c-.15-.45-.24-.95-.24-1.46s.09-1.01.24-1.46V9.08H2.02c-.5.99-.78 2.09-.78 3.26s.28 2.27.78 3.26l5.62-3.06z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.64 1 3.83 2.64 2.02 5.64l5.62 3.06c.61-1.85 2.33-3.22 4.36-3.22z"
                      />
                    </svg>
                    <span>Tiếp tục với Google</span>
                    <ArrowRight size={18} className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </>
                )}
              </Button>

              <div className="pt-8 border-t border-border-default/50">
                <p className="text-sm text-text-muted mb-6">
                  Bằng cách đăng nhập, bạn đồng ý với các{" "}
                  <Link href="/dieu-khoan-su-dung" className="text-primary hover:underline font-medium">
                    Chính sách
                  </Link>{" "}
                  của BlackStoneBook.
                </p>
                
                <div className="bg-surface-raised/50 p-4 rounded-2xl flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-medium">Lần đầu tới đây?</span>
                  <Link
                    href="/dang-ky"
                    className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-xl font-bold transition-all"
                  >
                    Tạo tài khoản
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted italic">
            Privacy First & Secured by Google
          </span>
        </div>
      </div>
    </div>
  );
};
