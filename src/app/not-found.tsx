import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-code">۴۰۴</div>
      <p className="not-found-text">صفحه موردنظر پیدا نشد.</p>
      <Link href="/menu" className="not-found-link">
        → بازگشت به منو
      </Link>
    </div>
  );
}
