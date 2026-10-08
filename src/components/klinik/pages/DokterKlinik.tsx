import { clinicDoctors } from "@/components/klinik/data/doctorData";
import KlinikPageShell from "@/components/klinik/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/klinik/sections/KlinikPageTitle";

export default function DokterKlinik() {
  return (
    <KlinikPageShell activeLabel="Dokter" headerTone="tint">
      <main className="bg-surface-tint pb-24">
        <div className="mx-auto flex max-w-[1230px] flex-col items-center gap-12 px-6 pt-10">
          <KlinikPageTitle
            title="Informasi Dokter"
            caption="Tenaga medis profesional yang berdedikasi memberikan pelayanan terbaik"
            showSegmented={false}
            titleClassName="opacity-80"
          />

          <ul className="grid w-full list-none grid-cols-1 justify-items-center gap-x-8 gap-y-10 p-0 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-16">
            {clinicDoctors.map((doctor) => (
              <li key={doctor.name} className="w-full max-w-[324px]">
                <img
                  src={doctor.card}
                  alt={`${doctor.name}, ${doctor.specialty}`}
                  width={324}
                  height={456}
                  className="h-auto w-full max-w-none"
                />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </KlinikPageShell>
  );
}
