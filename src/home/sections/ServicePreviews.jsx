// Микро-превью для карточек Bento. Анимации запускаются через group-hover родительской карточки
// и используют только transform/opacity — дешево для композитора.

const T = 'transition-all duration-700 ease-expo';

export function BrowserPreview() {
  return (
    <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-800/80 p-3 shadow-2xl shadow-black/50 sm:p-4">
      <div className="flex items-center gap-1.5 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <div className="ml-3 h-6 flex-1 truncate rounded-full bg-white/[0.05] px-3 font-mono text-[10px] leading-6 text-white/40">
          creators-digital.work
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        <div className={`col-span-4 flex h-24 flex-col justify-end rounded-xl bg-white/[0.06] p-3 sm:h-36 ${T} group-hover:bg-acid`}>
          <div className={`h-2.5 w-3/4 rounded-full bg-white/20 ${T} group-hover:bg-ink/70`} />
          <div className={`mt-2 h-2.5 w-1/2 rounded-full bg-white/10 ${T} group-hover:bg-ink/40`} />
        </div>
        <div className={`col-span-2 h-24 rounded-xl bg-gradient-to-br from-volt/40 to-transparent sm:h-36 ${T} group-hover:-translate-y-1 group-hover:rotate-2`} />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`col-span-2 h-16 rounded-xl border border-white/5 bg-white/[0.03] sm:h-24 ${T} group-hover:-translate-y-2 group-hover:border-white/15`}
            style={{ transitionDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
      {/* Курсор-указатель, который «кликает» по главному блоку */}
      <svg
        className={`absolute bottom-6 right-8 h-6 w-6 text-white drop-shadow-lg duration-1000 ${T} group-hover:-translate-x-[38%] group-hover:-translate-y-[260%] sm:group-hover:-translate-x-[240%]`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4 2l16 9-7 2-3 7z" />
      </svg>
    </div>
  );
}

export function LayersPreview() {
  return (
    <div className="relative flex h-28 w-full items-center justify-center">
      <span className={`absolute h-16 w-16 -translate-x-6 rounded-full border border-white/25 bg-white/[0.04] ${T} group-hover:-translate-x-14`} />
      <span className={`absolute h-16 w-16 rounded-full bg-acid ${T} group-hover:scale-110`} />
      <span className={`absolute h-16 w-16 translate-x-6 rounded-full bg-volt/80 mix-blend-screen ${T} group-hover:translate-x-14`} />
    </div>
  );
}

export function TypePreview() {
  return (
    <div className="relative flex h-28 w-full items-center justify-center gap-4">
      <span className={`font-grotesk text-7xl font-light leading-none tracking-[-0.06em] ${T} group-hover:font-extrabold group-hover:text-acid`}>
        Aa
      </span>
      <span className={`text-3xl text-acid duration-1000 ${T} group-hover:rotate-180 group-hover:scale-125`}>✦</span>
    </div>
  );
}

export function CardsPreview() {
  const cards = [
    { pos: '-rotate-6 group-hover:-translate-x-12 group-hover:-rotate-12', bg: 'bg-white/[0.06]' },
    { pos: 'rotate-0 group-hover:-translate-y-3', bg: 'bg-white/10' },
    { pos: 'rotate-6 group-hover:translate-x-12 group-hover:rotate-12', bg: 'bg-acid' },
  ];
  return (
    <div className="relative flex h-28 w-full items-center justify-center">
      {cards.map((c, i) => (
        <span
          key={i}
          className={`absolute flex h-24 w-[4.5rem] flex-col justify-end gap-1 rounded-xl border border-white/10 p-2 ${c.bg} ${T} ${c.pos}`}
        >
          <span className={`h-1.5 w-3/4 rounded-full ${i === 2 ? 'bg-ink/50' : 'bg-white/30'}`} />
          <span className={`h-1.5 w-1/2 rounded-full ${i === 2 ? 'bg-ink/30' : 'bg-white/15'}`} />
        </span>
      ))}
    </div>
  );
}

export function ChatPreview() {
  const bubbles = [
    { text: 'Новая заявка 🔥', cls: 'self-start bg-white/10' },
    { text: 'Сайт · 1,5 млн ₸', cls: 'self-start bg-white/10' },
    { text: 'Беру в работу ✓', cls: 'self-end bg-acid text-ink' },
  ];
  return (
    <div className="flex h-28 w-full flex-col justify-center gap-1.5">
      {bubbles.map((b, i) => (
        <span
          key={b.text}
          className={`rounded-2xl px-3 py-1.5 text-xs font-medium opacity-40 ${b.cls} ${T} translate-y-1 group-hover:translate-y-0 group-hover:opacity-100`}
          style={{ transitionDelay: `${i * 140}ms` }}
        >
          {b.text}
        </span>
      ))}
    </div>
  );
}

export function ShapePreview() {
  return (
    <div className="relative flex h-28 w-full items-center justify-center [perspective:600px]">
      <span className="animate-[spin_14s_linear_infinite]">
        <span
          className={`block h-16 w-16 rounded-2xl border-2 border-acid duration-1000 ${T} group-hover:rounded-full group-hover:bg-acid/10 group-hover:[transform:rotateX(60deg)_scale(1.2)]`}
        />
      </span>
      <span className={`absolute h-3 w-3 rounded-full bg-volt ${T} group-hover:translate-x-12 group-hover:-translate-y-8`} />
    </div>
  );
}

export const PREVIEWS = {
  browser: BrowserPreview,
  layers: LayersPreview,
  type: TypePreview,
  cards: CardsPreview,
  chat: ChatPreview,
  shape: ShapePreview,
};
