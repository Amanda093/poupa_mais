"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoMenu } from "react-icons/io5";

import Placeholder from "@/components/assets/FotoPerfilPlaceHolder.png";
import logo from "@/components/assets/poupa-logo.png";
import { auth } from "@/lib/services/clientApp";

import { Button, LinkHeader } from "../../ui";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const [menu, setMenu] = useState(false);

  // Define qual imagem usar
  const profilePicture = user?.photoURL || Placeholder;

  return (
    <header className="header-shadow flex h-[6em] w-full pt-[2em] pb-[1.5em] max-sm:h-auto max-sm:pb-[0.5em]">
      <nav className="container flex justify-between max-sm:flex-col max-sm:gap-[0.5em]">
        {/* logotipo e link */}
        <Link href="/" className="flex justify-center">
          <Image src={logo} alt="Logotipo do Poupa+" /> {/* Este é o Header */}
        </Link>

        {/*Icon de menu sanduiche*/}
        <div
          className="hidden w-full justify-center max-sm:flex"
          onClick={() => setMenu(!menu)}
        >
          <IoMenu className="hidden size-[3em] text-emerald-600 max-sm:flex" />
        </div>

        {/* links para as outras páginas*/}
        <div
          className={`flex items-center gap-[2em] transition-[max-height] duration-300 ease-in-out max-sm:flex-col max-sm:gap-[0.5em] max-sm:overflow-hidden max-sm:pb-[0.25em] ${
            menu ? "max-sm:max-h-[500px]" : "max-sm:max-h-0"
          }`}
        >
          <LinkHeader text="Planejar Finanças" path="/" />
          {/* Leva para a página de FAQ */}
          <LinkHeader text="FAQ" path="/FAQ" />

          {/* Verifica se o usuário está logado */}
          {loading ? null : user ? (
            <>
              {/* Leva para a página de histórico */}
              <LinkHeader text="Histórico" path="/historico" />

              {/* Leva para a página de histórico */}
              <Link href="/historico" className="max-sm:hidden">
                <Image
                  src={profilePicture}
                  className="size-[2.75em] cursor-pointer rounded-full object-cover outline-[0.15em] outline-emerald-500 transition-all duration-300 select-none hover:translate-y-[-0.15em] hover:outline-emerald-600"
                  alt="Foto de perfil"
                  width={45}
                  height={44}
                  unoptimized // necessário se for URL externa
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
