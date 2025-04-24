import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-full relative bg-[#CFE5CB]">
      <Image src="/hero-2.png" alt="Hero Image" width={480} height={180} className="max-w-5xl mx-auto w-full" />
      <div className="flex flex-col gap-4 absolute top-20 left-[20%] z-5">
        <div className="text-green-800 text-5xl font-bold">Give What You Can.</div>
        <div className="text-green-800 text-5xl font-bold">Get What You Need.</div>
        <div className="text-green-500 text-xl font-bold">A platform to donate items which are used or worn out</div>
        <div className="text-green-500 text-xl font-bold">but still usable and help the society</div>
      </div>
    </div>
  );
}
