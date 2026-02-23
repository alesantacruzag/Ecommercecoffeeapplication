"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group !flex !items-center !justify-between !gap-3 !rounded-xl !border !px-4 !py-3 !shadow-sm !transition-all",
          title: "!font-semibold !text-[15px] !flex-1",
          success: "!bg-[#f0f9eb] !border-[#b7eb8f] !text-[#52c41a]",
          error: "!bg-[#fff1f0] !border-[#ffa39e] !text-[#f5222d]",
          warning: "!bg-[#fffbe6] !border-[#ffe58f] !text-[#faad14]",
          info: "!bg-[#e6f7ff] !border-[#91d5ff] !text-[#1890ff]",
          icon: "!w-5 !h-5 !text-inherit !shrink-0",
          closeButton:
            "!static !order-last !opacity-100! !text-inherit hover:!bg-black/5 !p-1 !rounded-md !transition-colors !ml-auto !border-none !flex !items-center !justify-center !w-6 !h-6 !self-center !transform-none !top-auto !right-auto !bottom-auto",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
