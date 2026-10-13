import rawAulia from "@/assets/dokter/aulia-dalila.svg";
import rawBunga from "@/assets/dokter/bunga-nurmalita.svg";
import rawDewi from "@/assets/dokter/dewi-gotama.svg";
import rawDhesty from "@/assets/dokter/dhesty-dadhilah.svg";
import rawElly from "@/assets/dokter/elly-rosila-wijaya.svg";
import rawFebrina from "@/assets/dokter/febrina-rambu.svg";
import rawKristopher from "@/assets/dokter/kristopher-pamudji.svg";
import rawMusa from "@/assets/dokter/musa-taufiq.svg";
import rawNila from "@/assets/dokter/nila-febriana.svg";
import rawOutline from "@/assets/dokter/outline.svg";
import rawPanji from "@/assets/dokter/panji-syabila.svg";
import rawRico from "@/assets/dokter/rico-novyanto.svg";
import rawSlamet from "@/assets/dokter/slamet-tjahjono.svg";
import rawZainul from "@/assets/dokter/zainul-mujahid.svg";
import { assetUrl } from "@/components/shared/data/assetUrl";

export const doctorOutline = assetUrl(rawOutline);

export type DoctorProfile = {
  name: string;
  specialty: string;
  card: string;
};

export const clinicDoctors: DoctorProfile[] = [
  {
    name: "dr. Kristopher May Pamudji, Sp.A",
    specialty: "Spesialis Anak",
    card: assetUrl(rawKristopher),
  },
  {
    name: "dr. Musa Taufiq, Sp.OG",
    specialty: "Spesialis Kandungan",
    card: assetUrl(rawMusa),
  },
  {
    name: "dr. Dewi Gotama, Sp.D.V.E",
    specialty: "Spesialis Kulit, Kelamin & Estetika",
    card: assetUrl(rawDewi),
  },
  {
    name: "dr. Zainul Mujahid, Sp.T.H.T.B.K.L",
    specialty: "Spesialis THT, Bedah Kepala & Leher",
    card: assetUrl(rawZainul),
  },
  {
    name: "drg. Bunga Nurmalita",
    specialty: "Gigi",
    card: assetUrl(rawBunga),
  },
  {
    name: "drg. Aulia Dalila",
    specialty: "Gigi",
    card: assetUrl(rawAulia),
  },
  {
    name: "drg. M. Panji Syabila Abd Majid",
    specialty: "Gigi",
    card: assetUrl(rawPanji),
  },
  {
    name: "dr. Rico Novyanto, Sp.PD, FINASIM",
    specialty: "Spesialis Penyakit Dalam",
    card: assetUrl(rawRico),
  },
  {
    name: "dr. Slamet Tjahjono, Sp.P(K), FISR",
    specialty: "Spesialis Paru, Konsultan Infeksi Paru",
    card: assetUrl(rawSlamet),
  },
  {
    name: "dr. Elly Rosila Wijaya, Sp.K.J, M.M",
    specialty: "Spesialis Kesehatan Jiwa",
    card: assetUrl(rawElly),
  },
  {
    name: "dr. Febrina Rambu, Sp.N, AIFO-K",
    specialty: "Spesialis Neurologi",
    card: assetUrl(rawFebrina),
  },
  {
    name: "dr. Nila Febriana Iswara",
    specialty: "Umum",
    card: assetUrl(rawNila),
  },
  {
    name: "dr. Dhesty Dadhilah Faatin",
    specialty: "Umum",
    card: assetUrl(rawDhesty),
  },
];
