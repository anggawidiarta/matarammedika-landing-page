import { clinicDoctors } from "@/data/dokter";
import KlinikPageTitle from "@/components/shared/sections/KlinikPageTitle";

export default function DokterKlinik() {
  return (
    <>
      <main className="bg-surface-tint pb-24">
        <div className="page-container flex flex-col items-center gap-10 pt-10 sm:gap-12">
          <KlinikPageTitle
            title="Informasi Dokter"
            caption="Tenaga medis profesional yang berdedikasi memberikan pelayanan terbaik"
            showSegmented={false}
            titleClassName="opacity-80"
          />

          <ul className="grid w-full list-none grid-cols-1 justify-items-center gap-y-10 p-0 sm:grid-cols-2 sm:justify-items-stretch sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
            {clinicDoctors.map((doctor, index) => (
              <li key={doctor.name} className="w-full max-w-[340px] sm:max-w-none">
                <img
                  src={doctor.card}
                  alt={`${doctor.name}, ${doctor.specialty}`}
                  width={441}
                  height={518}
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-auto w-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
