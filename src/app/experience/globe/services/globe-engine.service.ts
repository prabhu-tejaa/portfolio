import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';

@Injectable({ providedIn: 'root' })
export class GlobeEngineService {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private animationId: number | null = null;

    private earthGroup!: THREE.Group;
    private interactionGroup!: THREE.Group;
    private earth!: THREE.Mesh;
    private clouds!: THREE.Mesh;
    private atmosphere!: THREE.Mesh;
    private stars!: THREE.Mesh;

    // --- NEW: Marker Properties ---
    private hyderabadMarker!: THREE.Group;
    private pulseMesh!: THREE.Mesh;

    private dayMap!: THREE.Texture;
    private nightMap!: THREE.Texture;

    private isReady = false;
    private onReadyCallback?: () => void;
    private clock = new THREE.Clock();
    private currentRoute = '';

    private autoSpin = true;
    private currentTween: any;

    private isDragging = false;
    private previousMouse = { x: 0, y: 0 };
    private targetRotation = new THREE.Vector2(0, 0);
    private currentRotation = new THREE.Vector2(0, 0);
    private lerpFactor = 0.15;
    private canvasElement?: HTMLCanvasElement;

    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();

    constructor(private ngZone: NgZone) { }

    async init(canvas: HTMLCanvasElement, onReady?: () => void) {
        this.canvasElement = canvas;
        this.onReadyCallback = onReady;
        const isMobile = window.innerWidth < 768;
        const segs = isMobile ? 32 : 64;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(0, 0.2, 3.5);

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: !isMobile,
            alpha: false,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        const sun = new THREE.DirectionalLight(0xffffff, 2.0);
        sun.position.set(5, 3, 5);
        const ambient = new THREE.AmbientLight(0x404060, 0.5);
        const rimLight = new THREE.SpotLight(0x00aaff, 5);
        rimLight.position.set(-5, 5, -5);
        rimLight.lookAt(0, 0, 0);
        this.scene.add(sun, ambient, rimLight);

        const texLoader = new THREE.TextureLoader();
        const safeLoad = (url: string) =>
            new Promise<THREE.Texture>((resolve) =>
                texLoader.load(url, resolve, undefined, () => resolve(new THREE.Texture()))
            );

        const [day, cloudsTex, starsTex, normal, specular, night] = await Promise.all([
            safeLoad('textures/earth/day.webp'),
            safeLoad('textures/earth/clouds.webp'),
            safeLoad('textures/earth/stars_milkyway.webp'),
            safeLoad('textures/earth/normal.png'),
            safeLoad('textures/earth/specular.png'),
            safeLoad('textures/earth/night.webp'),
        ]);

        day.colorSpace = THREE.SRGBColorSpace;
        cloudsTex.colorSpace = THREE.SRGBColorSpace;
        starsTex.colorSpace = THREE.SRGBColorSpace;
        night.colorSpace = THREE.SRGBColorSpace;

        this.dayMap = day;
        this.nightMap = night;

        this.interactionGroup = new THREE.Group();
        this.earthGroup = new THREE.Group();
        this.interactionGroup.add(this.earthGroup);

        this.earth = new THREE.Mesh(
            new THREE.SphereGeometry(1, segs * 2, segs * 2),
            new THREE.MeshPhongMaterial({
                map: this.dayMap,
                normalMap: normal,
                specularMap: specular,
                specular: new THREE.Color(0x333333),
                shininess: 15,
                transparent: true,
                opacity: 1.0
            })
        );

        this.clouds = new THREE.Mesh(
            new THREE.SphereGeometry(1.01, segs * 2, segs * 2),
            new THREE.MeshLambertMaterial({
                map: cloudsTex,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            })
        );
        this.clouds.rotation.y = Math.random() * Math.PI * 2;
        this.clouds.rotation.x = Math.random() * Math.PI * 2;

        const atmosphereMaterial = new THREE.ShaderMaterial({
            uniforms: { opacity: { value: 0.1 } },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float opacity;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(1.1 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
                    gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0) * intensity * 1.5 * opacity; 
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false
        });

        this.atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(1.1, segs, segs),
            atmosphereMaterial
        );

        this.stars = new THREE.Mesh(
            new THREE.SphereGeometry(90, 64, 64),
            new THREE.MeshBasicMaterial({
                map: starsTex,
                side: THREE.BackSide,
                transparent: false,
                opacity: 1.0,
                color: 0xffffff
            })
        );

        this.earthGroup.add(this.earth, this.clouds);
        this.scene.add(this.stars, this.interactionGroup, this.atmosphere);

        // --- NEW: Add the Buzzing Marker ---
        this.addHyderabadMarker();

        this.earthGroup.rotation.z = 23.5 * (Math.PI / 180);
        this.earthGroup.rotation.y = 3.0;

        canvas.style.willChange = 'transform, opacity';
        canvas.style.touchAction = 'none';
        if (isMobile) {
            const scale = 0.7;
            this.earthGroup.scale.set(scale, scale, scale);
            this.camera.position.set(0, 0.2, 3.5);
            this.atmosphere.scale.set(scale, scale, scale);
        }

        window.addEventListener('resize', this.onResize);
        document.addEventListener('visibilitychange', this.onVisibilityChange);

        this.ngZone.runOutsideAngular(() => {
            window.addEventListener('pointerdown', this.onPointerDown, { passive: false });
            window.addEventListener('pointermove', this.onPointerMove, { passive: false });
            window.addEventListener('pointerup', this.onPointerUp, { passive: false });
        });

        this.ngZone.runOutsideAngular(() => this.animate());

        // --- NEW: Texture Pre-warming ---
        // Briefly assign night map and render to ensure GPU has it cached
        if (this.nightMap) {
            const tempMap = this.earth.material as THREE.MeshPhongMaterial;
            tempMap.map = this.nightMap;
            this.renderer.render(this.scene, this.camera);
            tempMap.map = this.dayMap;
        }

        this.isReady = true;
        if (this.onReadyCallback) this.onReadyCallback();
    }

    // --- NEW FEATURE METHOD ---
    private addHyderabadMarker() {
        this.hyderabadMarker = new THREE.Group();

        // 1. Static Core Dot
        const coreGeo = new THREE.SphereGeometry(0.012, 16, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const core = new THREE.Mesh(coreGeo, coreMat);

        // 2. Pulse (The "Buzz" Effect)
        const pulseGeo = new THREE.SphereGeometry(0.013, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7
        });
        this.pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);

        this.hyderabadMarker.add(core, this.pulseMesh);

        // Position Logic for Hyderabad (17.3850 N, 78.4867 E)
        const lat = 17.3850;
        const lon = 78.4867;
        const radius = 1;

        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        this.hyderabadMarker.position.set(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );

        // Child of earthMesh means it rotates with Earth
        this.earth.add(this.hyderabadMarker);

        // GSAP "Buzzing" Animation
        gsap.to(this.pulseMesh.scale, {
            x: 5, y: 5, z: 5,
            duration: 2,
            repeat: -1,
            ease: "power2.out"
        });
        gsap.to(this.pulseMesh.material, {
            opacity: 0,
            duration: 2,
            repeat: -1,
            ease: "power2.out"
        });
    }

    private onVisibilityChange = () => {
        document.hidden ? this.clock.stop() : this.clock.start();
    };

    private onPointerDown = (event: PointerEvent) => {
        if (this.currentRoute.includes('work')) return;

        const target = event.target as HTMLElement;
        if (target.closest('button, a, input, textarea, .interactive')) return;

        if (!this.earth) return;
        const earthMat = this.earth.material as THREE.MeshPhongMaterial;
        if (earthMat.opacity < 0.1) return;

        if (!this.renderer || !this.camera) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.earth);

        if (intersects.length === 0) return;

        this.isDragging = true;
        this.previousMouse = { x: event.clientX, y: event.clientY };

        if (this.canvasElement) {
            this.canvasElement.style.cursor = 'grabbing';
            this.canvasElement.classList.add('globe-dragging');
        }

        if (event.cancelable) event.preventDefault();

        gsap.killTweensOf(this.targetRotation);
    };

    private onPointerMove = (event: PointerEvent) => {
        if (this.currentRoute.includes('work')) return;

        // Hover handling for cursor
        if (!this.isDragging && this.renderer && this.camera && this.earth) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObject(this.earth);

            if (this.canvasElement) {
                this.canvasElement.style.cursor = intersects.length > 0 ? 'grab' : 'default';
            }
        }

        if (!this.isDragging) return;
        if (event.cancelable) event.preventDefault();

        const deltaX = event.movementX !== undefined ? event.movementX : (event.clientX - this.previousMouse.x);
        const deltaY = event.movementY !== undefined ? event.movementY : (event.clientY - this.previousMouse.y);

        const sensitivity = 0.003;
        this.targetRotation.y += deltaX * sensitivity;
        this.targetRotation.x += deltaY * sensitivity;

        this.previousMouse = { x: event.clientX, y: event.clientY };
    };

    private onPointerUp = () => {
        if (!this.isDragging) return;
        this.isDragging = false;

        if (this.canvasElement) {
            this.canvasElement.style.cursor = 'grab';
            this.canvasElement.classList.remove('globe-dragging');
        }

        gsap.to(this.targetRotation, {
            x: 0,
            y: 0,
            duration: 2,
            ease: 'power2.out'
        });
    };

    public rotateGlobally(deltaX: number, deltaY: number) {
        gsap.killTweensOf(this.targetRotation);
        const sensitivity = 0.005;
        this.targetRotation.y += deltaX * sensitivity;
        this.targetRotation.x += deltaY * sensitivity;
    }

    transitionTo(route: string) {
        if (!this.camera || !this.earthGroup) return;

        // Strip query parameters for cleaner route matching
        const cleanRoute = route.split('?')[0];

        if (this.currentRoute === cleanRoute) return;
        this.currentRoute = cleanRoute;

        gsap.killTweensOf(this.camera.position);
        gsap.killTweensOf((this.earth.material as THREE.Material));
        gsap.killTweensOf((this.clouds.material as THREE.Material));
        gsap.killTweensOf((this.atmosphere.material as THREE.ShaderMaterial).uniforms['opacity']);
        gsap.killTweensOf(this.earth.rotation);

        const earthMat = this.earth.material as THREE.MeshPhongMaterial;
        const cloudMat = this.clouds.material as THREE.Material;
        const atmoMat = this.atmosphere.material as THREE.ShaderMaterial;

        let targetX = 0;
        let targetY = 0.2;
        let targetZ = 3.5;
        let targetFade = 1.0;
        let spin = true;
        let targetMap = this.dayMap;

        const isWork = cleanRoute.includes('work');
        const fadeSpeed = cleanRoute.includes('about') ? 1.2 : 1.5;

        if (cleanRoute.includes('about')) {
            targetZ = 0.8;
            targetFade = 0;
            spin = false;
            targetMap = this.dayMap;
        }
        else if (isWork) {
            targetX = 0; targetY = 0.2; targetZ = 3.5;
            targetFade = 1.0; spin = true; targetMap = this.nightMap;
        }
        else if (cleanRoute.includes('social')) {
            targetX = 0; targetY = 1.4; targetZ = 3.5;
            targetFade = 1; spin = true; targetMap = this.dayMap;
        }

        const finalCloudOpacity = targetFade === 0 ? 0 : 0.8;

        gsap.to(this.camera.position, {
            duration: fadeSpeed,
            x: targetX, y: targetY, z: targetZ,
            ease: 'power2.inOut',
            force3D: true
        });

        if (earthMat.map !== targetMap) {
            earthMat.map = targetMap;
            earthMat.needsUpdate = true;
        }

        gsap.to(earthMat, { duration: fadeSpeed, opacity: targetFade, ease: 'power2.inOut' });
        gsap.to(cloudMat, { duration: fadeSpeed, opacity: finalCloudOpacity, ease: 'power2.inOut' });
        gsap.to(atmoMat.uniforms['opacity'], { duration: fadeSpeed, value: 0.06, ease: 'power2.inOut' });

        this.autoSpin = spin;

        if (this.canvasElement) {
            this.canvasElement.style.pointerEvents = isWork ? 'none' : 'auto';
        }
    }

    private animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();

        if (this.autoSpin) {
            this.earth.rotation.y += 0.04 * delta;
            this.clouds.rotation.y += 0.03 * delta;
        } else {
            this.clouds.rotation.y += 0.01 * delta;
        }

        const lerpSpeed = 1.0 - Math.pow(0.0001, delta);
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * lerpSpeed;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * lerpSpeed;

        if (this.interactionGroup) {
            this.interactionGroup.rotation.x = this.currentRotation.x;
            this.interactionGroup.rotation.y = this.currentRotation.y;
        }

        this.stars.rotation.y += 0.009 * delta;
        this.stars.rotation.x += 0.009 * delta;

        this.renderer.render(this.scene, this.camera);
    };

    private onResize = () => {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        window.removeEventListener('resize', this.onResize);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
        this.renderer.dispose();
    }
}