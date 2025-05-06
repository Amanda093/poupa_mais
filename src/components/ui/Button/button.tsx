import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/helpers/utils";

//Const que define todas as variações de estilo da tag Button
const buttonVariants = cva(
  //Estilização geral
  "transition-all cursor-pointer duration-300 active:emerald-glow inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.75em] text-[1em] font-[700] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      //Variações passadas através da prop "variant"
      variant: {
        //variant = default
        default:
          "bg-emerald-500 active:bg-emerald-700 text-white p-sm m-0 hover:bg-emerald-600",

        //variant = outline
        outline:
          "outline-[0.15em] outline-emerald-500 text-emerald-500 hover:text-emerald-600 active:text-emerald-700 bg-white hover:outline-emerald-600 active:outline-emerald-700",

        ghost: "", //variant = ghost

        //variant = delete
        delete:
          "outline-[0.15em] active:rose-glow hover:bg-rose-100  rounded-[0.45em] bg-rose-50  text-rose-500 outline-rose-500 hover:text-rose-600 hover:outline-rose-600",
      },
      //Variações passadas através da prop "size"
      size: {
        default: " px-[1.65em] py-[0.35em] has-[>svg]:px-3", //size = default

        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5", //size = sm

        lg: "h-10 rounded-md px-6 has-[>svg]:px-4", //size = lg

        icon: "size-9", //size = icon
      },
    },

    //Define um valor padrão para ambos os parametros
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

//Função que retorna o botão
function Button({
  //Declara as props do component button
  className,
  variant,
  size,
  asChild = false,
  ...props
  //Define o tipo das props, uma combinação de:
}: React.ComponentProps<"button"> & //Props nativas da tag button do html
  VariantProps<typeof buttonVariants> & {
    //Props de uma tipagem vinda de uma função utilitária (cva) que define variações de estilo (variant/size).

    asChild?: boolean; //Prop de controle que ajuda a saber o tipo de componente o qual será renderizado
  }) {
  const Comp = asChild ? Slot : "button"; //Armazena o tipo de componente que será renderizado dependendo do valor da prop "asChild"

  return (
    //Retorna o componente Comp, definido acima
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
