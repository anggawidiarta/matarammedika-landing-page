import { WA_KLINIK } from "@/data/site";
import iconFacebook from "@/assets/icons/facebook.svg";
import iconInstagram from "@/assets/icons/instagram.svg";
import Logo from "@/components/shared/ui/Logo";
import WhatsAppIcon from "@/components/shared/ui/WhatsAppIcon";

const linkClass =
  "inline-block rounded-sm py-1 underline-offset-4 transition-colors duration-200 ease-out hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const socialClass =
  "flex size-11 items-center justify-center rounded-full transition-[background-color,transform] duration-200 ease-out hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:active:scale-[0.94]";

export default function SiteFooter() {
  return (
    <footer id="kontak" className="bg-footer text-white">
      <div className="page-container flex flex-col gap-10 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Logo variant="light" />
              <p className="font-body max-w-117.75 text-base leading-normal font-light">
                Jl. Catur Warga No.13, Mataram Tim., Kec. Mataram,
                <br />
                Kota Mataram, Nusa Tenggara Bar. 83126
              </p>
            </div>
            <div className="-ml-2 flex gap-3">
              <a href="https://instagram.com" aria-label="Instagram" className={socialClass}>
                <img src={iconInstagram.src} alt="" width={27.5} height={27.5} />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className={socialClass}>
                <img src={iconFacebook.src} alt="" width={32} height={32} />
              </a>
              <a href={WA_KLINIK} aria-label="WhatsApp" className={socialClass}>
                <WhatsAppIcon size={32} />
              </a>
            </div>
          </div>
          <div id="profil">
            <h2 className="font-body text-xl font-semibold">Tentang</h2>
            <ul className="font-accent mt-4 flex flex-col gap-2 text-base text-white/80">
              <li>
                <a href="/profil-klinik" className={linkClass}>
                  Profil
                </a>
              </li>
              <li>
                <a href="/#kontak" className={linkClass}>
                  Karir
                </a>
              </li>
              <li>
                <a href="/layanan-klinik" className={linkClass}>
                  Info Layanan
                </a>
              </li>
            </ul>
          </div>
          <div id="dokter">
            <h2 className="font-body text-xl font-semibold">Kontak Kami</h2>
            <ul className="font-accent mt-4 flex flex-col gap-2 text-base text-white/80">
              <li>
                <a href="tel:+6287878847788" className={linkClass}>
                  +6287878847788 (Klinik)
                </a>
              </li>
              <li>
                <a href="mailto:klinikmatarammedika@gmail.com" className={linkClass}>
                  klinikmatarammedika@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+6281805204605" className={linkClass}>
                  +6281805204605 (Apotek)
                </a>
              </li>
              <li>
                <a href="mailto:apotekmatarammedika@gmail.com" className={linkClass}>
                  apotekmatarammedika@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-white/30" />
        <p className="font-accent text-center text-base text-white/80">
          Copyright © Apotek & Klinik Mataram Medika {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
