import Image from "next/image";

import banner from "../assets/banner.png";

interface BannerProps {
  containerClassName?: string;
  imageWrapperClassName?: string;
}

const Banner = ({
  containerClassName = "",
  imageWrapperClassName = "",
}: BannerProps) => {
  return (
    <div
      className={`${containerClassName} absolute top-0 right-0 h-full w-[50%] p-[1em] pl-0 max-lg:hidden`}
    >
      <div
        className={`${imageWrapperClassName} flex size-full items-center justify-center rounded-[2em] bg-gray-950 px-[12.5%] py-[5%]`}
      >
        <Image
          src={banner}
          className="max-h-full max-w-full object-scale-down"
          alt="Banner"
        />
      </div>
    </div>
  );
};

export { Banner };
