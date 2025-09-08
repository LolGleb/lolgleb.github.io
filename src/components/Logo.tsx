interface LogoProps {
  className?: string;
}

// Responsive Logo Component
export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`inline-block transition-opacity hover:opacity-80 ${className}`}>
      {/* Desktop: Horizontal Logo */}
      <div className="hidden lg:block">
        <h1 className="text-2xl tracking-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
          <span className="font-medium">Ticket </span>
          <span className="italic lowercase" style={{ color: '#FF00A8' }}>to</span>
          <span className="font-medium"> Socks</span>
        </h1>
      </div>
      
      {/* Tablet & Mobile: Square Logo */}
      <div className="block lg:hidden">
        <h1 className="text-xl tracking-tight" style={{ fontFamily: 'var(--font-headlines)' }}>
          <span className="font-medium">T</span>
          <span className="italic lowercase" style={{ color: '#FF00A8' }}>t</span>
          <span className="font-medium">S</span>
        </h1>
      </div>
    </div>
  );
}