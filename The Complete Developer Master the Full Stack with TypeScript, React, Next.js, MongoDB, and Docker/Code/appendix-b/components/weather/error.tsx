"use client";

export default function WeatherError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="content error">
      <span className="flag">app/components/weather/error(.tsx)</span>
      <h2>Something went wrong!</h2>
      <blockquote>{error?.toString()}</blockquote>
      <button onClick={() => reset()}>Try again (re-render)</button>
    </section>
  );
}
