import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AuraWebGLCanvasProps {
  className?: string;
}

export function AuraWebGLCanvas({ className = '' }: AuraWebGLCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    if (prefersReducedMotion || isSoftwareGl) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // 1. Flowing Champagne-Silk GLSL Shader (Webflow GL atmospheric backdrop)
    const silkGeometry = new THREE.PlaneGeometry(18, 12, 1, 1);
    const silkUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    };

    const silkMaterial = new THREE.ShaderMaterial({
      uniforms: silkUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform float uScroll;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 3; i++) {
            v += a * noise(p);
            p *= 2.02;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          vec2 pointerOffset = (uPointer - 0.5) * 0.16;
          float t = uTime * 0.18 + uScroll * 0.6;

          float n = fbm(uv * 2.4 + vec2(t * 0.4, -t * 0.25) + pointerOffset);
          float wave = sin((uv.x + uv.y * 0.55) * 4.2 + n * 3.1 - t * 0.8);
          float silk = smoothstep(-0.3, 0.9, wave);

          vec3 alabaster = vec3(0.980, 0.973, 0.961);
          vec3 warmStone = vec3(0.941, 0.922, 0.890);
          vec3 champagne = vec3(0.820, 0.715, 0.515);

          vec3 col = mix(alabaster, warmStone, silk * 0.7);
          float sheen = smoothstep(0.58, 0.94, silk) * (1.0 - smoothstep(0.94, 1.0, silk));
          col = mix(col, champagne, sheen * 0.20);

          float dist = distance(uv, vec2(0.72 + pointerOffset.x * 0.35, 0.48 + pointerOffset.y * 0.35));
          float auraGlow = exp(-dist * 2.7) * 0.14;
          col = mix(col, champagne, auraGlow);

          gl_FragColor = vec4(col, 0.95);
        }
      `,
    });

    const silkMesh = new THREE.Mesh(silkGeometry, silkMaterial);
    silkMesh.position.z = -2.2;
    scene.add(silkMesh);

    // 2. Subtle Floating Champagne Light Motes
    const particleCount = 42;
    const particlePositions = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 9.0;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.8 - 0.6;
      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('aPhase', new THREE.BufferAttribute(particlePhases, 1));

    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      vertexShader: `
        attribute float aPhase;
        uniform float uTime;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.4 + aPhase) * 0.12;
          pos.x += cos(uTime * 0.28 + aPhase * 1.3) * 0.08;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 15.0 * (1.0 / max(1.8, -mvPosition.z));
          vAlpha = 0.20 + 0.18 * sin(uTime * 0.8 + aPhase);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float soft = 1.0 - smoothstep(0.1, 0.5, d);
          gl_FragColor = vec4(0.76, 0.63, 0.38, soft * vAlpha);
        }
      `,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const targetPointer = new THREE.Vector2(0.5, 0.5);
    const currentPointer = new THREE.Vector2(0.5, 0.5);
    let scrollFactor = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetPointer.x = event.clientX / Math.max(1, window.innerWidth);
      targetPointer.y = 1.0 - event.clientY / Math.max(1, window.innerHeight);
    };

    const handleScroll = () => {
      scrollFactor = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };

    const handleResize = () => {
      if (!container) return;
      const nextWidth = container.clientWidth || window.innerWidth;
      const nextHeight = container.clientHeight || window.innerHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const startTime = performance.now();
    let prevTime = startTime;
    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 8);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 85);
          }
        };
        frameId = window.setTimeout(poll, 8);
      } else {
        frameId = window.setTimeout(cb, 85);
      }
    }

    function tick() {
      if (isDisposed) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - prevTime) / 1000);
      const elapsed = (now - startTime) / 1000;
      prevTime = now;

      currentPointer.x = THREE.MathUtils.damp(currentPointer.x, targetPointer.x, 4.5, dt);
      currentPointer.y = THREE.MathUtils.damp(currentPointer.y, targetPointer.y, 4.5, dt);

      silkUniforms.uTime.value = elapsed;
      silkUniforms.uPointer.value.copy(currentPointer);
      silkUniforms.uScroll.value = scrollFactor;
      particlesMaterial.uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);

      if (prefersReducedMotion) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    let visible = false;
    const resume = () => {
      cancelAnimationFrame(frameId);
      if (visible && !document.hidden && !isDisposed) {
        prevTime = performance.now();
        tick();
      }
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      resume();
    });
    observer.observe(container);
    document.addEventListener('visibilitychange', resume);

    return () => {
      isDisposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', resume);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      silkGeometry.dispose();
      silkMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="webgl-canvas"
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    />
  );
}
