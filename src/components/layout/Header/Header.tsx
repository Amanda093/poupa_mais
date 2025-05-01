"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

import Placeholder from "@/components/assets/FotoPerfilPlaceHolder.png";
import logo from "@/components/assets/poupa-logo.png";
import { auth } from "@/lib/clientApp";

import { Button, LinkHeader } from "../../ui";

const Header = () => {
  const [user, loading] = useAuthState(auth);

  // Define qual imagem usar
  const profilePicture = user?.photoURL || Placeholder;

  return (
    <header className="header-shadow flex h-[6em] w-full pt-[2em] pb-[1.5em]">
      <nav className="container flex justify-between">
        <Link href="/">
          <Image src={logo} alt="Logotipo do Poupa+" />
        </Link>

        <div className="flex items-center gap-[2.5em] max-sm:gap-[1.5em]">
          <LinkHeader text="Planejar Finanças" path="" />
          {loading ? null : user ? (
            <>
              <LinkHeader text="Histórico" path="historico" />
              <Link href="/historico">
                <Image
                  src={profilePicture}
                  className="size-[2.75em] cursor-pointer rounded-full object-cover outline-[0.15em] outline-emerald-500 transition-all duration-300 select-none hover:translate-y-[-0.15em] hover:outline-emerald-600"
                  alt="Foto de perfil"
                  width={44}
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
