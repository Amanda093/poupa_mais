import Image from "next/image";

import banner from "../assets/banner.png";
import { FluidBackground } from "./FluidBackground";

// Define que a prop 'containerClassName' do banner deve ser do tipo string, caso ela exista
interface BannerProps {
  containerClassName?: string;
}

//Função que retorna o banner
const Banner = ({ containerClassName = "" }: BannerProps) => {
  return (
    //Div do banner
    <div
      className={`${containerClassName} absolute top-0 h-full w-[50%] p-[1em] max-lg:hidden`}
    >
      {/* Conteúdo */}
      <div className="relative flex size-full items-center justify-center rounded-[2em] bg-gray-950 px-[12.5%] py-[5%]">
        <Image
          src={banner}
          className="z-10 max-h-full max-w-full animate-[float_6s_ease-in-out_infinite] object-scale-down select-none"
          alt="Banner"
        />

        {/* Background */}
        <FluidBackground />
      </div>
    </div>
  );
};

export { Banner };
