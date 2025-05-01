"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/clientApp";

import Perfil from "../../../../public/FotoPerfilPlaceHolder.png";
import { Button, LinkHeader } from "../../ui";
import logo from "../assets/poupa-logo.png";

const Header = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <header className="header-shadow flex h-[6em] w-full pt-[2em] pb-[1.5em]">
      <nav className="container flex justify-between">
        {/* logotipo e link */}
        <Link href="/" className="">
          <Image src={logo} alt="Logotipo do Poupa+" /> {/* Este é o Header */}
        </Link>

        {/* links para as outras páginas*/}
        <div className="flex items-center gap-[2.5em] max-sm:gap-[1.5em]">
          <LinkHeader text="Planejar Finanças" path="" />
          {loading ? null : user ? (
            <>
              <LinkHeader text="Histórico" path="historico" />
              <Link href="/historico">
                <Image
                  src={Perfil}
                  className="size-[2.75em] cursor-pointer rounded-[100%] object-scale-down outline-[0.15em] outline-emerald-500 transition-all duration-300 select-none hover:translate-y-[-0.15em] hover:outline-emerald-600"
                  alt="Foto de perfil"
                />
              </Link>
            </>
          ) : (
            <Button variant="default" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export { Header };
