import Image from "next/image";

import banner from "../assets/banner.png";
import { FluidBackground } from "./FluidBackground";

interface BannerProps {
  containerClassName?: string;
}

const Banner = ({ containerClassName = "" }: BannerProps) => {
  return (
    <div
      className={`${containerClassName} absolute top-0 h-full w-[50%] p-[1em] max-lg:hidden`}
    >
      {/* Conteúdo */}
      <div className="relative flex size-full items-center justify-center rounded-[2em] bg-gray-950 px-[12.5%] py-[5%]">
        <Image
          src={banner}
          className="z-10 max-h-full max-w-full object-scale-down select-none"
          alt="Banner"
        />

        {/* Background */}
        <FluidBackground />
      </div>
    </div>
  );
};

export { Banner };
