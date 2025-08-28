export default function GradientOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -top-32 right-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl" />
    </div>
  );
}