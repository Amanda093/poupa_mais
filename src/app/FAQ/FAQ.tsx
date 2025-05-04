import Image from "next/image";

import logo from "@/components/assets/poupa-logo.png";

const FaqPage = () => {
  return (
    //Div que contém toda página
    <div>
      {/*Div da logo*/}
      <div>
        <Image src={logo} alt="Logo" />
      </div>
    </div>
  );
};

export default FaqPage;
