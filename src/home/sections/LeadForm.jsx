import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { BUDGETS, FORM_SERVICES } from '../data/content';
import { submitLead } from '../lib/submitLead';
import Magnetic from '../components/ui/Magnetic';
import Toast from '../components/Toast';

const INITIAL = { name: '', contact: '', services: [], budget: '', message: '' };
const MAX_MESSAGE = 1000;

function validate(values) {
  const errors = {};
  const contact = values.contact.trim();
  const digits = contact.replace(/[\s()+-]/g, '');

  if (values.name.trim().length < 2) errors.name = 'Как к вам обращаться? Минимум 2 символа';

  if (!contact) errors.contact = 'Оставьте телефон, @telegram или e-mail';
  else if (
    !/^\d{10,15}$/.test(digits) &&
    !/^@[a-zA-Z0-9_]{4,32}$/.test(contact) &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)
  ) {
    errors.contact = 'Формат: +7 777 000 00 00, @username или name@mail.kz';
  }

  if (!values.services.length) errors.services = 'Выберите хотя бы одно направление';
  if (values.message.length > MAX_MESSAGE) errors.message = `Не более ${MAX_MESSAGE} символов`;
  return errors;
}

function ErrorText({ id, error }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden text-xs text-red-400"
        >
          <span className="block pt-2">{error}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Field({ id, name = id, label, error, textarea = false, ...props }) {
  const Comp = textarea ? 'textarea' : 'input';
  return (
    <div className="relative">
      <Comp
        id={id}
        name={name}
        placeholder=" "
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        rows={textarea ? 3 : undefined}
        className={`peer block w-full resize-none border-b bg-transparent pb-3 pt-7 text-base text-white outline-none transition-colors duration-300 sm:text-lg ${
          error ? 'border-red-400/70' : 'border-white/15 hover:border-white/30'
        }`}
        {...props}
      />
      <span
        aria-hidden
        className={`absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-expo peer-focus:scale-x-100 ${
          error ? 'bg-red-400' : 'bg-acid'
        }`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-7 max-w-full truncate text-base text-white/40 transition-all duration-300 ease-expo peer-focus:top-0 peer-focus:text-xs peer-focus:text-acid peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
      >
        {label}
      </label>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ease-expo active:scale-95 ${
        active ? 'border-acid bg-acid text-ink' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function LeadForm() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [toast, setToast] = useState(null);
  const formRef = useRef(null);
  const shake = useAnimationControls();

  const update = (field, value) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const onBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const toggleService = (service) => {
    const services = values.services.includes(service)
      ? values.services.filter((s) => s !== service)
      : [...values.services, service];
    setTouched((t) => ({ ...t, services: true }));
    const next = { ...values, services };
    setValues(next);
    setErrors(validate(next));
  };

  const closeToast = useCallback(() => setToast(null), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, contact: true, services: true, message: true });

    if (Object.keys(nextErrors).length) {
      shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } });
      const first = Object.keys(nextErrors)[0];
      formRef.current?.querySelector(`[name="${first}"], [data-field="${first}"]`)?.focus();
      return;
    }

    setStatus('loading');
    try {
      await submitLead(values);
      setStatus('success');
      setToast({
        id: Date.now(),
        type: 'success',
        title: 'Заявка отправлена!',
        message: `Спасибо, ${values.name.trim()}! Мы свяжемся с вами в течение 2 часов в рабочее время.`,
      });
      setValues(INITIAL);
      setTouched({});
      setErrors({});
      setTimeout(() => setStatus('idle'), 2600);
    } catch {
      setStatus('idle');
      setToast({
        id: Date.now(),
        type: 'error',
        title: 'Не удалось отправить',
        message: 'Проверьте соединение и попробуйте ещё раз или напишите нам в Telegram.',
      });
    }
  };

  const err = (field) => (touched[field] ? errors[field] : undefined);

  return (
    <>
      <motion.form
        ref={formRef}
        animate={shake}
        onSubmit={onSubmit}
        noValidate
        className="relative rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl [overflow:clip] sm:p-10 md:p-12"
      >
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.25),transparent_70%)]" />

        <div className="relative grid gap-8 md:grid-cols-2 md:gap-10">
          <Field
            id="lead-name"
            name="name"
            label="Ваше имя или компания *"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            onBlur={onBlur('name')}
            error={err('name')}
          />
          <Field
            id="lead-contact"
            name="contact"
            label="Телефон, @telegram или email *"
            autoComplete="tel"
            value={values.contact}
            onChange={(e) => update('contact', e.target.value)}
            onBlur={onBlur('contact')}
            error={err('contact')}
          />
        </div>

        <fieldset className="relative mt-10">
          <legend className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Что нужно сделать? *</legend>
          <div className="flex flex-wrap gap-2 outline-none" data-field="services" tabIndex={-1}>
            {FORM_SERVICES.map((s) => (
              <Chip key={s} active={values.services.includes(s)} onClick={() => toggleService(s)}>
                {s}
              </Chip>
            ))}
          </div>
          <ErrorText id="services-error" error={err('services')} />
        </fieldset>

        <fieldset className="relative mt-10">
          <legend className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Бюджет</legend>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <Chip key={b} active={values.budget === b} onClick={() => update('budget', values.budget === b ? '' : b)}>
                {b}
              </Chip>
            ))}
          </div>
        </fieldset>

        <div className="relative mt-10">
          <Field
            id="lead-message"
            name="message"
            textarea
            label="Расскажите о задаче (необязательно)"
            value={values.message}
            maxLength={MAX_MESSAGE + 50}
            onChange={(e) => update('message', e.target.value)}
            onBlur={onBlur('message')}
            error={err('message')}
          />
          <span className="absolute right-0 top-1 font-mono text-[10px] text-white/30">
            {values.message.length}/{MAX_MESSAGE}
          </span>
        </div>

        <div className="relative mt-12 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-xs leading-relaxed text-white/40">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
          </p>
          <Magnetic strength={0.25} className="w-full sm:w-auto">
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
              className={`relative flex h-16 w-full items-center justify-center overflow-hidden rounded-full px-10 font-medium transition-colors duration-500 sm:w-auto sm:min-w-[260px] ${
                status === 'success' ? 'bg-white text-ink' : 'bg-acid text-ink hover:bg-white'
              } disabled:cursor-wait`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3"
                >
                  {status === 'loading' && (
                    <>
                      <Spinner /> Отправляем…
                    </>
                  )}
                  {status === 'success' && <>✓ Заявка отправлена</>}
                  {status === 'idle' && (
                    <>
                      Отправить заявку
                      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </Magnetic>
        </div>
      </motion.form>

      <Toast toast={toast} onClose={closeToast} />
    </>
  );
}
