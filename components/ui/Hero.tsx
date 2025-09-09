import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#258aff] via-[#2f77ff] to-[#4fa3ff]">
      {/* decorative dots */}
      <div className="pointer-events-none absolute inset-0">
        <svg className="absolute -left-10 top-20 opacity-40" width="120" height="120">
          <circle cx="20" cy="20" r="4" fill="white"/>
          <circle cx="60" cy="80" r="6" fill="white"/>
          <circle cx="100" cy="40" r="3" fill="white"/>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <div className="bg-black/20 text-white rounded-xl px-5 py-4 inline-block">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HỆ THỐNG CHẤM ĐIỂM TỰ ĐỘNG CSCORE
            </h1>
            <p className="text-sm sm:text-base opacity-90 mt-2">
              Đổi mới tư duy, làm giàu thêm tri thức - đổi sống
            </p>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="rounded-xl ring-1 ring-black/10 shadow-2xl overflow-hidden bg-white">
            {/* Mock screenshot frame */}
            <div className="bg-slate-200 h-6 w-full" />
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50">
              <Image src="/hero-illustration.png" alt="preview" width={640} height={360} className="w-full h-auto"/>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -bottom-8 w-[120%] -translate-x-1/2" aria-hidden>
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white"><path d="M0 67c80 22 240 67 400 52s320-89 480-104 320 30 400 52v53H0z"/></svg>
      </div>
    </section>
  );
}
