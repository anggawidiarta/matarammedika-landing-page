import rawAulia from "@/assets/doctors/aulia-dalila.webp";
import rawBunga from "@/assets/doctors/bunga-nurmalita.webp";
import rawDewi from "@/assets/doctors/dewi-gotama.webp";
import rawElly from "@/assets/doctors/elly-rosila-wijaya.webp";
import rawKristopher from "@/assets/doctors/kristopher-pamudji.webp";
import rawLira from "@/assets/doctors/lira-purnamawati.webp";
import rawMusa from "@/assets/doctors/musa-taufiq.webp";
import rawNila from "@/assets/doctors/nila-febriana.webp";
import rawPanji from "@/assets/doctors/panji-syabila.webp";
import rawRico from "@/assets/doctors/rico-novyanto.webp";
import rawSlamet from "@/assets/doctors/slamet-tjahjono.webp";
import rawZainul from "@/assets/doctors/zainul-mujahid.webp";
import { assetUrl } from "@/components/klinik/data/assets";

export type DoctorProfile = {
  name: string;
  specialty: string;
  card: string;
};

export const clinicDoctors: DoctorProfile[] = [
  {
    name: "dr. Kristopher May Pamudji",
    specialty: "Spesialis Anak",
    card: assetUrl(rawKristopher),
  },
  {
    name: "dr. Musa Taufiq",
    specialty: "Spesialis Kandungan",
    card: assetUrl(rawMusa),
  },
  {
    name: "dr. Dewi Gotama",
    specialty: "Spesialis Kulit & Kelamin",
    card: assetUrl(rawDewi),
  },
  {
    name: "dr. Zainul Mujahid",
    specialty: "Spesialis THT",
    card: assetUrl(rawZainul),
  },
  {
    name: "dr. Bunga Nurmalita",
    specialty: "Gigi",
    card: assetUrl(rawBunga),
  },
  {
    name: "dr. Aulia Dalila",
    specialty: "Gigi",
    card: assetUrl(rawAulia),
  },
  {
    name: "dr. M. Panji Syabila Abd Majid",
    specialty: "Gigi",
    card: assetUrl(rawPanji),
  },
  {
    name: "dr. Rico Novyanto",
    specialty: "Spesialis Penyakit Dalam",
    card: assetUrl(rawRico),
  },
  {
    name: "dr. Slamet Tjahjono",
    specialty: "Spesialis Paru",
    card: assetUrl(rawSlamet),
  },
  {
    name: "dr. Elly Rosila Wijaya",
    specialty: "Spesialis Kejiwaan",
    card: assetUrl(rawElly),
  },
  {
    name: "dr. Lira Purnamawati",
    specialty: "Umum",
    card: assetUrl(rawLira),
  },
  {
    name: "dr. Nila Febriana Iswara",
    specialty: "Umum",
    card: assetUrl(rawNila),
  },
];
