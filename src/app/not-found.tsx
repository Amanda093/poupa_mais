import Link from "next/link";

import { Button } from "@/components";

export default function NotFound() {
  return (
    <div className="align-center container flex w-full flex-col items-center py-[70px]">
      <h1 className="text-emerald-500">404</h1>
      <br />
      <h3>A página não foi encontrada!</h3>
      <Button asChild>
        <Link href="/">Voltar</Link>
      </Button>
    </div>
  );
}
