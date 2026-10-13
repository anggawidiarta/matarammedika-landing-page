import { clinicDoctors } from "@/components/dokter/doctorData";
import KlinikPageShell from "@/components/shared/layout/KlinikPageShell";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";

export default function DokterKlinik() {
  return (
    <KlinikPageShell activeLabel="Dokter" headerTone="tint">
      <main className="bg-surface-tint pb-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10 px-5 pt-10 sm:gap-12 sm:px-6">
          <KlinikPageTitle
            title="Informasi Dokter"
            caption="Tenaga medis profesional yang berdedikasi memberikan pelayanan terbaik"
            showSegmented={false}
            titleClassName="opacity-80"
          />

          <ul className="grid w-full list-none grid-cols-1 justify-items-center gap-y-10 p-0 sm:grid-cols-2 sm:justify-items-stretch sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
            {clinicDoctors.map((doctor) => (
              <li key={doctor.name} className="w-full max-w-[340px] sm:max-w-none">
                <img
                  src={doctor.card}
                  alt={`${doctor.name}, ${doctor.specialty}`}
                  width={441}
                  height={518}
                  className="h-auto w-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </KlinikPageShell>
  );
}
