/** TechText nativo: letras, trazos y partículas sin dependencias. */
export function mountTechText(element, { fontWeight = 600, dashLength = 4, dashGap = 2, specks = 15 } = {}) {
  if (!element || element.dataset.techMounted) return;
  const lines = (element.dataset.techText || element.innerText).split('|');
  element.setAttribute('aria-label', lines.join(' '));
  element.style.fontWeight = String(fontWeight);
  const fragment = document.createDocumentFragment();
  let index = 0;
  for (const text of lines) {
    const line = document.createElement('span');
    line.className = 'tech-line';
    line.setAttribute('aria-hidden', 'true');
    for (const letter of text) {
      const glyph = document.createElement('span');
      glyph.className = 'tech-letter';
      glyph.textContent = letter === ' ' ? '\u00a0' : letter;
      glyph.style.setProperty('--letter-delay', `${index++ * 85}ms`);
      line.append(glyph);
    }
    fragment.append(line);
  }
  const ornament = document.createElement('span');
  ornament.className = 'tech-ornament';
  ornament.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 0 20 L 0 0 L 20 0 M 80 0 L 100 0 L 100 20 M 100 80 L 100 100 L 80 100 M 20 100 L 0 100 L 0 80');
  path.setAttribute('vector-effect', 'non-scaling-stroke');
  path.setAttribute('stroke-dasharray', `${dashLength} ${dashGap}`);
  svg.append(path);
  ornament.append(svg);
  for (let i = 0; i < Math.min(specks, 15); i++) {
    const dot = document.createElement('span');
    dot.className = 'tech-speck';
    dot.style.cssText = `left:${(i * 37 + 7) % 100}%;top:${(i * 43 + 11) % 100}%;--speck-delay:${i * -0.43}s`;
    ornament.append(dot);
  }
  fragment.append(ornament);
  element.replaceChildren(fragment);
  element.classList.add('tech-text');
  element.dataset.techMounted = 'true';
  const observer = new IntersectionObserver(([entry]) => {
    element.classList.toggle('tech-visible', entry.isIntersecting);
  }, { threshold: 0.15 });
  observer.observe(element);
  document.addEventListener('visibilitychange', () => {
    element.classList.toggle('tech-paused', document.hidden);
  });
}
mountTechText(document.querySelector('#hero-title'));
