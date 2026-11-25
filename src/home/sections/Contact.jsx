import { BRAND, CONTACTS } from '../data/content';
import { useScrollTo } from '../providers/SmoothScroll';
import MaskLines from '../components/ui/MaskLines';
import Magnetic from '../components/ui/Magnetic';
import Marquee from '../components/ui/Marquee';
import SectionLabel from '../components/ui/SectionLabel';
import LeadForm from './LeadForm';

export default function Contact() {
  const scrollTo = useScrollTo();

  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Полноширинный CTA */}
      <div className="container-x pb-16 pt-24 md:pb-24 md:pt-40">
        <SectionLabel index="04" label="Начнём?" className="mb-8" />
        <MaskLines
          lines={[
            'Есть идея?',
            <>
              Давайте <span className="font-serif font-normal italic text-acid">запустим</span>
            </>,
            'её вместе',
          ]}
          className="font-grotesk text-[clamp(3rem,11.5vw,13rem)] font-semibold leading-[0.88] tracking-[-0.065em]"
        />

        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-white/55 md:text-lg">
            Расскажите о задаче — в течение 2 часов предложим решение, сроки и прозрачную смету. Без обязательств.
          </p>
          <Magnetic strength={0.45} className="self-start md:self-auto">
            <button
              type="button"
              onClick={() => scrollTo('#brief')}
              className="group relative grid h-40 w-40 place-items-center overflow-hidden rounded-full bg-acid text-ink md:h-52 md:w-52"
            >
              <span aria-hidden className="absolute inset-0 scale-0 rounded-full bg-white transition-transform duration-700 ease-expo group-hover:scale-100" />
              <span className="relative text-center font-grotesk text-lg font-semibold leading-tight tracking-tight md:text-xl">
                Обсудить
                <br />
                проект
                <svg className="mx-auto mt-2 h-5 w-5 transition-transform duration-500 ease-expo group-hover:rotate-45" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="-rotate-2 scale-105 border-y border-white/10 bg-acid py-4 text-ink md:py-6">
        <Marquee
          items={['Давайте работать вместе', "Let's create", 'Обсудим ваш проект', 'Creators Digital']}
          duration={28}
          reverse
          itemClassName="font-grotesk text-3xl font-semibold tracking-[-0.04em] md:text-6xl [&_.text-acid]:text-ink"
        />
      </div>

      {/* Бриф */}
      <div id="brief" className="container-x grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-4">
          <h3 className="font-grotesk text-4xl font-semibold tracking-[-0.05em] md:text-5xl">Бриф проекта</h3>
          <p className="mt-4 max-w-sm text-white/55">
            Заполните форму за минуту или напишите напрямую — отвечаем быстро и по делу.
          </p>
          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {CONTACTS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between py-5 transition-colors"
                >
                  <span>
                    <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{c.label}</span>
                    <span className="mt-1 block text-lg transition-colors group-hover:text-acid">{c.value}</span>
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-acid group-hover:bg-acid group-hover:text-ink">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">{BRAND.city}</p>
        </aside>

        <div className="lg:col-span-8">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
