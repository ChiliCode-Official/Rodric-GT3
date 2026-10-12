/** Fondo de cromo líquido nativo, compartiendo el renderer del Porsche. */
export function createLiquidChrome(THREE, {
  color = '#ffffff', speed = 0.2, amplitude = 0.3,
  detail = 4, thickness = 1, interactive = true,
} = {}) {
  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uSpeed: { value: speed },
    uAmplitude: { value: amplitude },
    uThickness: { value: thickness },
    uAspect: { value: innerWidth / innerHeight },
    uPointer: { value: new THREE.Vector2(0, 0) },
  };
  const pointer = new THREE.Vector2(0, 0);
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: false,
    depthTest: false,
    depthWrite: false,
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }`,
    fragmentShader: `precision mediump float;
      varying vec2 vUv;
      uniform float uTime, uSpeed, uAmplitude, uThickness, uAspect;
      uniform vec3 uColor;
      uniform vec2 uPointer;
      void main() {
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.0;
        p += uPointer * 0.06;
        float t = uTime * uSpeed;
        for (int i = 0; i < ${Math.max(1, Math.min(4, Math.round(detail)))}; i++) {
          float f = float(i) + 1.0;
          p += uAmplitude / f * vec2(sin(p.y * f * 1.7 + t * 0.7), cos(p.x * f * 1.4 - t * 0.5));
        }
        float wave = sin(p.x * 2.1 + p.y * 1.6 + t * 0.35);
        float ridge = exp(-abs(wave) * (10.0 / max(uThickness, 0.1)));
        float broad = 0.5 + 0.5 * cos(p.y * 2.0 - p.x + t * 0.3);
        float edge = smoothstep(0.15, 0.65, abs(vUv.x - 0.5));
        float vignette = 1.0 - smoothstep(0.25, 0.85, length(vUv - 0.5));
        float alpha = (ridge * 0.09 + broad * 0.025) * mix(0.35, 1.0, edge) * vignette;
        gl_FragColor = vec4(uColor * alpha, alpha);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  const move = event => {
    if (!interactive || event.pointerType === 'touch') return;
    pointer.set((event.clientX / innerWidth - 0.5) * 2, (0.5 - event.clientY / innerHeight) * 2);
  };
  const reset = () => pointer.set(0, 0);
  addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  return {
    mesh,
    update(time) {
      uniforms.uTime.value = time;
      uniforms.uPointer.value.lerp(pointer, 0.04);
    },
    resize() { uniforms.uAspect.value = innerWidth / innerHeight; },
    dispose() {
      removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', reset);
      mesh.geometry.dispose();
      material.dispose();
    },
  };
}
