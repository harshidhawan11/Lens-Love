import confetti from "canvas-confetti";

// A tasteful, on-brand confetti burst — blush, gold, and cream.
export function celebrate(origin?: { x: number; y: number }) {
  const colors = ["#DC9A8D", "#C9A85F", "#F6EFDD", "#E9BAB0", "#EBDBB4"];
  const defaults = {
    spread: 70,
    ticks: 200,
    gravity: 0.9,
    decay: 0.92,
    scalar: 0.95,
    colors,
    origin: origin ?? { x: 0.5, y: 0.4 },
  };

  confetti({ ...defaults, particleCount: 60, startVelocity: 38 });
  setTimeout(
    () => confetti({ ...defaults, particleCount: 35, startVelocity: 26, spread: 100 }),
    160,
  );
}
