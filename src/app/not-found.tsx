import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="font-display text-8xl text-gold/80">404</p>
        <h1 className="mt-4 font-display text-3xl text-ivory">This piece isn&apos;t here</h1>
        <p className="mt-2 text-ivory-muted">
          The work you&apos;re looking for may have moved or sold.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-gold">Back home</Link>
          <Link href="/gallery" className="btn-ghost">Browse the gallery</Link>
        </div>
      </div>
    </div>
  );
}
