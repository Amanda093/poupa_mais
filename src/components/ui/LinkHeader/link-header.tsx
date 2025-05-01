"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LinkHeader = (props: { path: string; text: string }) => {
  const { path, text } = props;
  const pathname = usePathname();

  return (
    <Link
      className={`text-header h-fit ${
        pathname === path ? "text-header-active" : ""
      } transition-all`}
      href={`${path}`}
    >
      {text}
    </Link>
  );
};

export { LinkHeader };
