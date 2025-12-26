import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';

@Injectable({ providedIn: 'root' })
export class GlobeEngineService {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private animationId: number | null = null;

    // Objects
    private earthGroup!: THREE.Group;
    private earth!: THREE.Mesh;
    private clouds!: THREE.Mesh;
    private atmosphere!: THREE.Mesh;
    private stars!: THREE.Mesh;

    // 🔥 Textures for Map Switching
    private dayMap!: THREE.Texture;
    private nightMap!: THREE.Texture;

    // State
    private isReady = false;
    private onReadyCallback?: () => void;
    private clock = new THREE.Clock();

    // Animation State
    private autoSpin = true;
    private currentTween: any;

    constructor(private ngZone: NgZone) {}

    async init(canvas: HTMLCanvasElement, onReady?: () => void) {
        this.onReadyCallback = onReady;
        const isMobile = window.innerWidth < 768;
        const segs = isMobile ? 32 : 64;

        /* ---------- SCENE & CAMERA ---------- */
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000); 

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(0, 0.2, 3.5); 

        /* ---------- RENDERER ---------- */
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

        /* ---------- LIGHTING ---------- */
        const sun = new THREE.DirectionalLight(0xffffff, 2.0);
        sun.position.set(5, 3, 5);
        const ambient = new THREE.AmbientLight(0x404060, 0.5);
        const rimLight = new THREE.SpotLight(0x00aaff, 5);
        rimLight.position.set(-5, 5, -5);
        rimLight.lookAt(0, 0, 0);
        this.scene.add(sun, ambient, rimLight);

        /* ---------- TEXTURES ---------- */
        const texLoader = new THREE.TextureLoader();
        const safeLoad = (url: string) => 
            new Promise<THREE.Texture>((resolve) => 
                texLoader.load(url, resolve, undefined, () => resolve(new THREE.Texture()))
            );

        // Load Night map as well
        const [day, cloudsTex, starsTex, normal, specular, night] = await Promise.all([
            safeLoad('/textures/earth/day.webp'),
            safeLoad('/textures/earth/clouds.webp'),
            safeLoad('/textures/earth/stars_milkyway.webp'),
            safeLoad('/textures/earth/normal.png'),
            safeLoad('/textures/earth/specular.png'),
            safeLoad('/textures/earth/night.webp'), 
        ]);

        day.colorSpace = THREE.SRGBColorSpace;
        cloudsTex.colorSpace = THREE.SRGBColorSpace;
        starsTex.colorSpace = THREE.SRGBColorSpace;
        night.colorSpace = THREE.SRGBColorSpace;

        // Store the textures on the service
        this.dayMap = day;
        this.nightMap = night;

        /* ---------- MESHES ---------- */
        this.earthGroup = new THREE.Group();
        
        // 1. EARTH
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

        // 2. CLOUDS
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

        // 3. ATMOSPHERE
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

        // 4. STARS
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
        this.scene.add(this.stars, this.earthGroup, this.atmosphere);

        
        this.earthGroup.rotation.z = 0; 
        this.earthGroup.rotation.y = 3.0; 


        if (isMobile) {
            const scale = 0.7; 
            this.earthGroup.scale.set(scale, scale, scale);
            this.camera.position.set(0, 0.2, 3.5); 
            this.atmosphere.scale.set(scale, scale, scale);

            console.log(`Mobile: Earth and Atmosphere scaled to ${scale * 100}%`);
        }

        window.addEventListener('resize', this.onResize);
        document.addEventListener('visibilitychange', this.onVisibilityChange);

        this.ngZone.runOutsideAngular(() => this.animate());
        
        this.isReady = true;
        if (this.onReadyCallback) this.onReadyCallback();
    }

    private onVisibilityChange = () => {
        document.hidden ? this.clock.stop() : this.clock.start();
    };

    /**
     * Transitions the camera view and Earth appearance based on the route.
     * Uses simple map/opacity change, relying on the background rotation for smoothness.
     */
    transitionTo(route: string) {
        if (!this.camera || !this.earthGroup) return;
        
        // 1. Kill any running animations so they don't fight
        gsap.killTweensOf(this.camera.position);
        gsap.killTweensOf((this.earth.material as THREE.Material)); 
        gsap.killTweensOf((this.clouds.material as THREE.Material));
        gsap.killTweensOf((this.atmosphere.material as THREE.ShaderMaterial).uniforms['opacity']);
        gsap.killTweensOf(this.earth.rotation); 

        const earthMat = this.earth.material as THREE.MeshPhongMaterial; 
        const cloudMat = this.clouds.material as THREE.Material;
        const atmoMat = this.atmosphere.material as THREE.ShaderMaterial;

        // --- DEFAULTS (Home Page) ---
        let targetX = 0;
        let targetY = 0.2;
        let targetZ = 3.5;
        let targetFade = 1.0; 
        // ❌ Removed targetCloudOpacity declaration to use the derived value below
        let spin = true;
        let targetMap = this.dayMap; 

        const isMobile = window.innerWidth <= 768; 
        const isWork = route.includes('work');
        const fadeSpeed = route.includes('about') ? 1.2 : 1.5; 

        // --- ROUTE SPECIFIC LOGIC ---
        if (route.includes('about')) {
            // === ABOUT PAGE === (Zoom in and fade out)
            targetZ = 0.8; 
            targetFade = 0; // Earth and clouds fully fade out
            spin = false;
            targetMap = this.dayMap; 
        } 

        else if (isWork) {
            // === WORK PAGE: CENTERED NIGHT VIEW ===
            targetX = 0;     
            targetY = 0.2;   
            targetZ = 3.5; 
            targetFade = 1.0; // Earth remains fully visible
            spin = true;
            targetMap = this.nightMap; // Target Night Map
            console.log('Using centered night-view with visible clouds');
        }

        else if (route.includes('social')) {
            // === SOCIAL PAGE ===
            targetX = 0;    
            targetY = 1.4;  
            targetZ = 3.5;   
            targetFade = 1;  // Earth remains fully visible
            spin = true;     
            targetMap = this.dayMap; 
        }

        // 🔥 TIE CLOUD OPACITY TO EARTH FADE:
        // If targetFade is 0 (about page), cloud opacity becomes 0.
        // If targetFade is 1.0 (home/work/social), cloud opacity returns to its base value (0.8).
        const finalCloudOpacity = targetFade === 0 ? 0 : 0.8;
        
        // 2. Animate Camera Position
        gsap.to(this.camera.position, {
            duration: fadeSpeed,
            x: targetX,
            y: targetY,
            z: targetZ,
            ease: 'power2.inOut'
        });

        // 3. SIMPLE MAP SWAP (Instantaneous)
        if (earthMat.map !== targetMap) {
            earthMat.map = targetMap;
            earthMat.needsUpdate = true;
        }

        // 4. Animate Earth Opacity
        gsap.to(earthMat, {
            duration: fadeSpeed,
            opacity: targetFade,
            ease: 'power2.inOut'
        });

        // 5. Animate Clouds Opacity (NOW TIED TO EARTH FADE)
        gsap.to(cloudMat, {
            duration: fadeSpeed,
            opacity: finalCloudOpacity, // Uses the derived opacity (0 or 0.8)
            ease: 'power2.inOut'
        });

        // 6. Animate Atmosphere Uniforms
        gsap.to(atmoMat.uniforms['opacity'], {
            duration: fadeSpeed,
            value: 0.06,
            ease: 'power2.inOut'
        });

        this.autoSpin = spin;
    }

    private animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();

        if (this.autoSpin) {
            this.earth.rotation.y += 0.05 * delta;
            this.clouds.rotation.y += 0.07 * delta; 
        } else {
            // No custom spin, just regular rotation
            this.clouds.rotation.y += 0.02 * delta;
        }

        this.stars.rotation.y += 0.0009 * delta; 
        this.stars.rotation.x += 0.0003 * delta;
        
        this.earthGroup.rotation.z = 23.5 * (Math.PI / 180);
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
        this.renderer.dispose();
    }
}