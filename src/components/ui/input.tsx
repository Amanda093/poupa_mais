"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "font-[400] text-[0.9em] invalid:outline-rose-500 focus:outline-emerald-400 focus:invalid:outline-rose-500 focus:outline-[0.175em] focus:invalid:rose-glow  focus:emerald-glow transition-all outline-solid duration-300 placeholder:text-slate-400  flex w-full min-w-0 rounded-[0.5em] outline-[0.15em] outline-slate-400 px-3 py-[0.3em] shadow-xs transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: " bg-white text-black-950",
        background:
          "outline-emerald-400 focus:outline-emerald-500 placeholder:text-emerald-400 bg-emerald-50 text-emerald-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

function Input({ variant, type, ...props }: InputProps) {
  const [valor, setValor] = React.useState("");

  function handleMoneyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorNumerico = e.target.value.replace(/\D/g, ""); // remove não números
    const valorFloat = parseFloat(valorNumerico) / 100; // ajusta os centavos

    if (isNaN(valorFloat)) {
      setValor("");
      return;
    }

    const valorFormatado = valorFloat.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setValor(valorFormatado);
  }

  // Se for type="money", trata diferente
  if (type === "money") {
    return (
      <input
        type="text"
        data-slot="input"
        value={valor}
        onChange={handleMoneyChange}
        className={cn(inputVariants({ variant }), props.className)}
        {...props}
      />
    );
  }

  // Senão, input normal
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), props.className)}
      {...props}
    />
  );
}

export { Input };
