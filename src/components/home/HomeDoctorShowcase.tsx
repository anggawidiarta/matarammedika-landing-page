import { useEffect, useRef, useState } from "react";
import { clinicDoctors, doctorOutline } from "@/components/dokter/doctorData";

const ROTATE_MS = 3000;
const FADE_MS = 600;

export default function HomeDoctorShowcase() {
  const [current, setCurrent] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reduceMotionRef = useRef(false);
  const currentRef = useRef(0);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = mq.matches;
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
    if (clinicDoctors.length < 2 || paused) return;

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
  }, [paused]);

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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
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
