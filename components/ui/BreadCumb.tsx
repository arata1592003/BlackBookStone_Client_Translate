"use client";

import Link from "next/link";

interface Props {
  slug: string;
  chapterNumber: number;
  bookTitle: string;
  chapterTitle: string;
}

export const Breadcrumb = ({
  slug,
  bookTitle,
  chapterTitle,
}: Props) => {
  const breadcrumbItems = [
    { text: bookTitle, href: `/truyen/${slug}` },
    { text: chapterTitle },
  ];

  return (
    <nav
      className="flex items-center gap-2.5 px-5 py-2.5 relative self-stretch w-full flex-[0_0_auto] rounded-[5px] overflow-hidden border border-solid border-white"
      aria-label="Breadcrumb"
    >
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2.5">
          {item.href ? (
            <Link
              href={item.href}
              className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap no-underline hover:underline"
            >
              {item.text}
            </Link>
          ) : (
            <p className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
              {item.text}
            </p>
          )}

          {index < breadcrumbItems.length - 1 && (
            <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
              /
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};