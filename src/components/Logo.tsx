import { Link } from 'react-router';

export default function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      aria-label="Prairie Web Studio — Home"
    >
      <img
        src="/assets/logo.svg"
        alt=""
        width="40"
        height="40"
        className="h-10 w-10"
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
      />
      <span className="text-lg font-bold tracking-tight text-ink-900">
        Prairie Web <span className="text-brand-800">Studio</span>
      </span>
    </Link>
  );
}
