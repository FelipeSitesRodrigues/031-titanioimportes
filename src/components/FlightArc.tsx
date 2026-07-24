/** Rota de voo — a órbita do avião do logo, como grafismo de assinatura. */
export function FlightArc({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 820 320"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        className="flight-arc"
        pathLength={1}
        d="M10 290 C 240 40, 560 40, 810 150"
        stroke="var(--color-brand)"
        strokeWidth="1.5"
      />
      {/* marcador cromado no fim da rota */}
      <circle cx="810" cy="150" r="4" fill="var(--color-chrome)" />
      <circle cx="10" cy="290" r="3" fill="var(--color-brand)" />
    </svg>
  );
}
