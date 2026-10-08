import { iconFacebook, iconInstagram, iconWhatsapp } from "./assets";
import { Logo } from "./ui";

const WA_KLINIK = "https://wa.me/6287878847788";

export default function SiteFooter() {
  return (
    <footer id="kontak" className="text-white bg-footer">
      <div className="flex flex-col gap-10 px-6 py-16 mx-auto max-w-307">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Logo variant="light" />
              <p className="max-w-117.75 font-body text-base font-light leading-normal">
                Jl. Catur Warga No.13, Mataram Tim., Kec. Mataram,
                <br />
                Kota Mataram, Nusa Tenggara Bar. 83126
              </p>
            </div>
            <div className="flex gap-8">
              <a href="https://instagram.com" aria-label="Instagram">
                <img src={iconInstagram} alt="" width={27.5} height={27.5} />
              </a>
              <a href="https://facebook.com" aria-label="Facebook">
                <img src={iconFacebook} alt="" width={32} height={32} />
              </a>
              <a href={WA_KLINIK} aria-label="WhatsApp">
                <img src={iconWhatsapp} alt="" width={32} height={32} />
              </a>
            </div>
          </div>
          <div id="profil">
            <h2 className="text-xl font-semibold font-body">Tentang</h2>
            <ul className="flex flex-col gap-4 mt-6 text-base opacity-80 font-accent">
              <li>
                <a href="/profil-klinik">Profil</a>
              </li>
              <li>
                <a href="/#kontak">Karir</a>
              </li>
              <li>
                <a href="/layanan-klinik">Info Layanan</a>
              </li>
            </ul>
          </div>
          <div id="dokter">
            <h2 className="text-xl font-semibold font-body">Kontak Kami</h2>
            <ul className="flex flex-col gap-4 mt-6 text-base opacity-80 font-accent">
              <li>+6287878847788 (Klinik)</li>
              <li>
                <a href="mailto:klinikmatarammedika@gmail.com">
                  klinikmatarammedika@gmail.com
                </a>
              </li>
              <li>+6281805204605 (Apotek)</li>
              <li>
                <a href="mailto:apotekmatarammedika@gmail.com">
                  apotekmatarammedika@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-white/30" />
        <p className="text-base text-center opacity-80 font-accent">
          Copyright © Apotek & Klinik Mataram Medika {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
