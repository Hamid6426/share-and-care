import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-full flex relative">
    {/* <div className="w-full flex relative bg-background px-8 h-screen py-12"> */}
      {/* <div className="flex flex-col justify-center w-3/6 pl-12">
        <div className="text-primary text-5xl font-bold">Give What You Can.</div>
        <div className="text-primary text-5xl font-bold mt-2 mb-6">Get What You Need.</div>
        <div className="text-text-primary text-xl font-bold">A platform to donate items which are used or worn out</div>
        <div className="text-text-primary text-xl font-bold">but still usable and help the society</div>
      </div>
      <Image src="/hero-3.png" alt="Hero Image" width={480} height={400} className="w-3/6 rounded-2xl" /> */}

      <Image
        src="/hero-3.png"
        alt="Hero Image"
        width={1280}
        height={720}
        className="aspect-video w-full"
      />

      <div className="absolute top-[5%] left-[5%] flex flex-col gap-0 justify-center text-[4.5vw]">
        <div className="text-primary font-bold text-nowrap">
          Give What You Can.
        </div>
        <div className="text-primary font-bold mb-6 text-nowrap">
          Get What You Need.
        </div>
        {/* <div className="text-card text-xl font-bold">
          A platform to donate your used items and help the society
        </div> */}
        {/* <div className="text-card text-xl font-bold">
          but still usable and help the society
        </div> */}
      </div>
    </div>
  );
}
