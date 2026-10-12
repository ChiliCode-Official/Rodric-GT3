/** SplitText nativo: conserva palabras y accesibilidad del encabezado. */
export function mountSplitText(element, { delay = 100, duration = 0.6, threshold = 0.1, rootMargin = '0px 0px -100px 0px', onLetterAnimationComplete } = {}) {
  if (!element || element.dataset.splitMounted) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  const original = [...element.childNodes];
  const label = original.map(node => node.nodeName === 'BR' ? ' ' : node.textContent).join('').replace(/\s+/g, ' ').trim();
  element.setAttribute('aria-label', label);
  const fragment = document.createDocumentFragment();
  const glyphs = [];
  let index = 0;
  for (const node of original) {
    if (node.nodeName === 'BR') { fragment.append(document.createElement('br')); continue; }
    for (const token of (node.textContent || '').split(/(\s+)/)) {
      if (!token) continue;
      if (/^\s+$/.test(token)) { fragment.append(document.createTextNode(' ')); continue; }
      const word = document.createElement('span');
      word.className = 'split-word';
      word.setAttribute('aria-hidden', 'true');
      for (const char of Array.from(token)) {
        const glyph = document.createElement('span');
        glyph.className = 'split-char';
        glyph.textContent = char;
        glyph.style.setProperty('--split-delay', `${index++ * delay}ms`);
        glyph.style.setProperty('--split-duration', `${duration}s`);
        word.append(glyph);
        glyphs.push(glyph);
      }
      fragment.append(word);
    }
  }
  element.replaceChildren(fragment);
  element.classList.add('split-text');
  element.dataset.splitMounted = 'true';
  const finish = () => {
    element.dataset.splitComplete = 'true';
    if (typeof onLetterAnimationComplete === 'function') onLetterAnimationComplete();
  };
  glyphs.at(-1)?.addEventListener('animationend', finish, { once: true });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      element.classList.add('split-visible');
      observer.unobserve(element);
    }
  }, { threshold, rootMargin });
  observer.observe(element);
  reduce.addEventListener('change', event => {
    if (event.matches) { element.classList.add('split-visible'); observer.disconnect(); }
  });
}
for (const element of document.querySelectorAll('h2, .pricing-plan')) mountSplitText(element);
