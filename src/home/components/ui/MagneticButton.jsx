import Magnetic from './Magnetic';

const VARIANTS = {
  primary: {
    base: 'bg-acid text-ink',
    fill: 'bg-white',
  },
  ghost: {
    base: 'border border-white/15 text-white hover:text-ink',
    fill: 'bg-acid',
  },
  light: {
    base: 'bg-white text-ink',
    fill: 'bg-acid',
  },
};

const SIZES = {
  sm: 'h-11 px-5 text-[13px]',
  md: 'h-14 px-7 text-sm',
  lg: 'h-16 px-9 text-base',
};

/**
 * Магнитная кнопка-пилюля с заливкой снизу и «перекатом» текста при наведении.
 * Рендерится как <a>, если передан href, иначе — <button>.
 */
export default function MagneticButton({
  label,
  icon,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  strength = 0.3,
  ...rest
}) {
  const Comp = href ? 'a' : 'button';
  const v = VARIANTS[variant];

  return (
    <Magnetic strength={strength}>
      <Comp
        href={href}
        type={href ? undefined : rest.type ?? 'button'}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium tracking-tight transition-colors duration-500 ease-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid disabled:pointer-events-none disabled:opacity-60 ${v.base} ${SIZES[size]} ${className}`}
        {...rest}
      >
        <span
          aria-hidden
          className={`absolute inset-0 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-in-out-expo group-hover:translate-y-0 ${v.fill}`}
        />
        <span className="relative z-10 flex items-center gap-3">
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-500 ease-in-out-expo group-hover:-translate-y-full">
              {label}
            </span>
            <span
              aria-hidden
              className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-in-out-expo group-hover:translate-y-0"
            >
              {label}
            </span>
          </span>
          {icon && (
            <span className="transition-transform duration-500 ease-expo group-hover:rotate-45">{icon}</span>
          )}
        </span>
      </Comp>
    </Magnetic>
  );
}

export const ArrowIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
