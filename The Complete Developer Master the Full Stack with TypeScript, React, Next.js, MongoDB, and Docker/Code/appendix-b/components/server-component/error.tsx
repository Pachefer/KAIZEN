"use client"; // Error components must be Client components

export default function ServerComponentError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="content">
      <span className="flag">app/components/server-component/error(.tsx)</span>
      <h2>Something went wrong!</h2>
      <code>{error?.toString()}</code>
      <button onClick={() => reset()}>Try again (re-render)</button>
    </section>
  );
}
