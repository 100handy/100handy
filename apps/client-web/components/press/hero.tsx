import Image from "next/image";

interface PressHeroProps {
  title: string;
  image: string;
}

export function PressHero({ title, image }: PressHeroProps): React.JSX.Element {
  return (
    <section className="relative h-[470px] bg-[#3D4539]">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image}
          alt="100 Handy Press"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
      </div>

      <div className="relative h-full flex items-center justify-center">
        <div className="relative z-10 text-center">
          <h1 className="text-[67px] font-bold leading-none text-white">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
