/**
 * Бесконечная бегущая строка на чистом CSS (transform-анимация на GPU).
 * Контент дублируется дважды, трек сдвигается на -50% — шов незаметен.
 */
export default function Marquee({
  items,
  duration = 40,
  reverse = false,
  className = '',
  itemClassName = '',
  separator = '✦',
}) {
  const renderGroup = (copy) =>
    items.map((item, i) => (
      <span key={`${copy}-${i}`} className={`flex shrink-0 items-center ${itemClassName}`} aria-hidden={copy > 0}>
        <span>{item}</span>
        <span className="mx-[0.6em] text-acid">{separator}</span>
      </span>
    ));

  return (
    <div className={`marquee flex select-none overflow-hidden ${className}`}>
      <div
        className="marquee-track flex shrink-0 items-center"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {renderGroup(0)}
        {renderGroup(1)}
      </div>
    </div>
  );
}
