import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll, { useLenis } from './providers/SmoothScroll';
import { useFinePointer } from './hooks/useMedia';
import { BRAND } from './data/content';
import Cursor from './components/ui/Cursor';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Cases from './sections/Cases';
import Process from './sections/Process';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

/** Блокирует инерционный скролл, пока идёт интро, и пересчитывает триггеры после загрузки. */
function ScrollController({ locked }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (locked) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, locked]);

  useEffect(() => {
    if (locked) return undefined;
    const refresh = () => ScrollTrigger.refresh();
    const id = setTimeout(refresh, 100);
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      clearTimeout(id);
      window.removeEventListener('load', refresh);
    };
  }, [locked]);

  return null;
}

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const finePointer = useFinePointer();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${BRAND.name} — digital-агентство полного цикла`;
    document.documentElement.classList.add('theme-creators');
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      document.documentElement.classList.remove('theme-creators');
    };
  }, []);

  return (
    <SmoothScroll>
      <ScrollController locked={!ready} />
      <div className="creators-root relative min-h-screen bg-ink font-sans text-white antialiased selection:bg-acid selection:text-ink">
        <Preloader onComplete={() => setReady(true)} />
        {finePointer && <Cursor />}
        <div aria-hidden className="noise-overlay" />

        <Header />
        <main>
          <Hero ready={ready} />
          <Services />
          <Cases />
          <Process />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
