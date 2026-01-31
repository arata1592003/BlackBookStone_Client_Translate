'use client';

import Image from "next/image";

export const UserHeader = () => {
  return (
    <header className="flex flex-col items-start self-stretch w-full relative flex-[0_0_auto]">
      <div className="flex flex-col items-start gap-2.5 p-5 relative self-stretch w-full flex-[0_0_auto] bg-surface-overlay">
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
            <Image
              className="relative object-cover"
              alt="Logo icon"
              src="/icon-logo-540x540.png"
              width={32}
              height={32}
            />
            <h1 className="relative flex items-center justify-center w-fit font-roboto font-medium text-white text-2xl tracking-[0.10px] leading-6 whitespace-nowrap">
              Hắc Thạch Thôn
            </h1>
          </div>
          <span className="relative flex items-center justify-center w-fit font-roboto font-medium text-text-faint text-xs tracking-[0.10px] leading-4 whitespace-nowrap">
            Beta 1.0
          </span>
        </div>
      </div>
    </header>
  );
};
