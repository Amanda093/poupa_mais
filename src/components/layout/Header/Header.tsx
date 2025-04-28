import Image from "next/image";
import Link from "next/link";

import { Button, LinkHeader } from "../../ui";
import logo from "../assets/poupa-logo.png";

const Header = () => {
  return (
    <header className="header-shadow flex w-full px-[200px] pt-[40px] pb-[28px]">
      <nav className="container flex justify-between">
        {/* logotipo e link */}
        <Link href="/" className="">
          <Image src={logo} alt="Logotipo do Poupa+" /> {/* Este é o Header */}
        </Link>

        {/* links para as outras páginas*/}
        <div className="flex items-center gap-[50px]">
          <LinkHeader text="Planejar Finanças" path="/"></LinkHeader>
          <Button variant="default" asChild>
            <Link href="/login" className="">
              Login
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export { Header };
