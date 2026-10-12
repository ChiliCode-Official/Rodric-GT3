/** BlurText nativo: entrada por palabras, sin dependencias. */
export function mountBlurText(element, { delay = 150, direction = 'top', onAnimationComplete } = {}) {
  if (!element || element.dataset.blurMounted || element.children.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  const text = element.textContent.trim();
  if (!text) return;
  const fragment = document.createDocumentFragment();
  const screenReader = document.createElement('span');
  screenReader.className = 'animation-sr-only';
  screenReader.textContent = text;
  fragment.append(screenReader);
  const words = text.split(/\s+/);
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'blur-word';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = word;
    span.style.setProperty('--blur-delay', `${Math.min(index * delay, 1800)}ms`);
    span.style.setProperty('--blur-offset', direction === 'top' ? '-12px' : '12px');
    if (index) fragment.append(document.createTextNode(' '));
    fragment.append(span);
  });
  element.replaceChildren(fragment);
  element.classList.add('blur-text');
  element.dataset.blurMounted = 'true';
  element.querySelector('.blur-word:last-child')?.addEventListener('animationend', () => {
    element.dataset.blurComplete = 'true';
    if (typeof onAnimationComplete === 'function') onAnimationComplete();
  }, { once: true });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      element.classList.add('blur-visible');
      observer.unobserve(element);
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  observer.observe(element);
  reduce.addEventListener('change', event => {
    if (event.matches) { element.classList.add('blur-visible'); observer.disconnect(); }
  });
}
for (const element of document.querySelectorAll('.des > p:not(.eyebrow):not(.ux-credential), .soundtrack-copy > p:not(.eyebrow), .pricing-heading > p:not(.eyebrow)')) {
  mountBlurText(element);
}
