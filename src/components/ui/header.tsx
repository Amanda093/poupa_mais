"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "../../../public/poupa-logo.png";
import { Button } from "./button";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full px-[200px] pt-[24px] pb-[18px] flex default-shadow ">
      <nav className="flex justify-between w-full ">
        {/* logotipo e link */}
        <Link href="/" className="">
          <Image src={logo} alt="Logotipo do Poupa+" /> {/* Este é o Header */}
        </Link>

        {/* links para as outras páginas*/}
        <div className="flex">
          <Link
            className={`text-header ${
              pathname === "/" ? "text-header-active" : ""
            }`}
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
