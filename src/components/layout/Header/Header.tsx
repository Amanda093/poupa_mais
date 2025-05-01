"use client"

import Image from "next/image";
import Link from "next/link";

import { Button, LinkHeader } from "../../ui";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/clientApp';
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
          <LinkHeader text="Planejar Finanças" path="/"></LinkHeader>
          {loading ? null : user ? (
            <Button variant="default" asChild>
              <Link href="/historico">
                Meu Perfil
              </Link>
            </Button>
          ) : (
            <Button variant="default" asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export { Header };
