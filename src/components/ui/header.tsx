"use client";
{
  /*TODO: Alterar para apenas o Link ser client component */
}

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logo from "../../../public/poupa-logo.png";
import { Button } from "./button";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="default-shadow flex w-full px-[200px] pt-[24px] pb-[18px]">
      <nav className="flex w-full justify-between">
        {/* logotipo e link */}
        <Link href="/" className="">
          <Image src={logo} alt="Logotipo do Poupa+" /> {/* Este é o Header */}
        </Link>

        {/* links para as outras páginas*/}
        <div className="flex items-center gap-[50px]">
          <Link
            className={`text-header h-fit ${
              pathname === "/" ? "text-header-active" : ""
            } transition-all`}
            href="/"
          >
            Planejar Finanças
          </Link>

          <Button variant="default">Login</Button>
        </div>
      </nav>
    </header>
  );
};

export { Header };
