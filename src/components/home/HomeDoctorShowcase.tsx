import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clinicDoctors, doctorOutline } from "@/data/dokter";

const ROTATE_MS = 3000;
const FADE_MS = 600;

export default function HomeDoctorShowcase() {
  const [current, setCurrent] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduceMotionRef = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const currentRef = useRef(0);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = mq.matches;
    setUserPaused(mq.matches);
    const onChange = () => {
      reduceMotionRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const next = clinicDoctors[(current + 1) % clinicDoctors.length];
    const img = new Image();
    img.src = next.card;
  }, [current]);

  useEffect(() => {
    if (clinicDoctors.length < 2 || hoverPaused || userPaused) return;

    const id = window.setInterval(() => {
      const prev = currentRef.current;
      const next = (prev + 1) % clinicDoctors.length;

      if (reduceMotionRef.current) {
        setOutgoing(null);
        setCurrent(next);
        return;
      }

      setOutgoing(prev);
      setCurrent(next);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [hoverPaused, userPaused]);

  useEffect(() => {
    if (outgoing === null) return;
    const t = window.setTimeout(() => setOutgoing(null), FADE_MS);
    return () => window.clearTimeout(t);
  }, [outgoing]);

  const currentDoctor = clinicDoctors[current];
  const outgoingDoctor = outgoing !== null ? clinicDoctors[outgoing] : null;
  const isFading = outgoingDoctor !== null;
  const outlineClass =
    "pointer-events-none absolute left-[4%] top-[6%] z-0 h-[92%] w-[92%] object-contain";

  return (
    <div
      className="relative mx-auto aspect-[441/518] w-[min(100%,360px)] overflow-visible sm:w-[413px]"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={(event) => {
        if (!toggleRef.current?.contains(event.target as Node)) setHoverPaused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHoverPaused(false);
        }
      }}
    >
      {clinicDoctors.length > 1 ? (
        <button
          type="button"
          ref={toggleRef}
          onClick={() => {
            setHoverPaused(false);
            setUserPaused((value) => !value);
          }}
          aria-pressed={userPaused}
          aria-label={
            userPaused ? "Putar pergantian dokter otomatis" : "Jeda pergantian dokter otomatis"
          }
          className="text-heading shadow-float hover:text-blue focus-visible:outline-blue absolute top-0 left-0 z-20 flex size-11 items-center justify-center rounded-full bg-white transition-[color,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:active:scale-[0.94] motion-reduce:transition-none"
        >
          {userPaused ? (
            <Play size={20} aria-hidden strokeWidth={2} className="fill-current" />
          ) : (
            <Pause size={20} aria-hidden strokeWidth={2} className="fill-current" />
          )}
        </button>
      ) : null}

      {isFading ? (
        <img
          src={doctorOutline}
          alt=""
          aria-hidden
          width={378}
          height={506}
          className={`${outlineClass} doctor-showcase-fade-out`}
        />
      ) : null}

      <img
        key={`outline-${currentDoctor.name}`}
        src={doctorOutline}
        alt=""
        aria-hidden
        width={378}
        height={506}
        className={`${outlineClass} ${isFading ? "doctor-showcase-fade-in" : ""}`}
      />

      {outgoingDoctor ? (
        <img
          src={outgoingDoctor.card}
          alt=""
          aria-hidden
          width={441}
          height={518}
          className="doctor-showcase-fade-out pointer-events-none absolute inset-0 z-10 h-full w-full object-contain"
        />
      ) : null}

      <img
        key={currentDoctor.name}
        src={currentDoctor.card}
        alt={`${currentDoctor.name}, ${currentDoctor.specialty}`}
        width={441}
        height={518}
        fetchPriority="high"
        decoding="async"
        className={`absolute inset-0 z-10 h-full w-full object-contain ${
          isFading ? "doctor-showcase-fade-in" : ""
        }`}
      />
    </div>
  );
}
