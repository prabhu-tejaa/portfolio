import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import * as THREE from 'three';
import { GlobeEngineService } from '../../../experience/globe/services/globe-engine.service';

export interface InteractionEvent {
    type: 'link' | 'contact';
    url?: string;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class SocialWorldService implements OnDestroy {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private orbitGroup!: THREE.Group;
    private raycaster = new THREE.Raycaster();
    private mouseVector = new THREE.Vector2();
    private animationId: number = 0;
    private container!: HTMLElement;
    private textureCache: Map<string, THREE.Texture> = new Map();
    private avatarTexture: THREE.Texture | null = null;

    private readonly BASE_ICON_SIZE = 2.2;
    private readonly ORBIT_RADIUS = 9.5;
    private readonly AVATAR_SIZE = 5.5;
    private readonly NORMAL_SPEED = 0.003;
    private readonly CRAZY_SPEED = 0.15;
    private readonly BASE_CAMERA_Z = 18;

    private speedUpInterval: any = null;
    private isTransitioning = false;
    private hoveredObject: THREE.Object3D | null = null;
    private currentOrbitSpeed = 0.003;

    public onInteraction?: (event: InteractionEvent) => void;

    private globeEngine = inject(GlobeEngineService);

    // Easter Egg Audio Props
    private audioListener!: THREE.AudioListener;
    private ambientSound!: THREE.Audio;
    private audioAnalyser!: THREE.AudioAnalyser;
    private hasTriggeredEasterEgg = false;
    private isPlaying = false;
    private isAvatarHovered = false;
    private readonly AUDIO_PATH = 'assets/audio/cosmic-glow.mp3';

    private playQueued = false;

    constructor(private zone: NgZone) { }

    public init(container: HTMLElement): void {
        this.container = container;
        this.initThree();
        this.createSceneContent();

        this.zone.runOutsideAngular(() => {
            this.animate();
        });
    }

    public preloadTextures(): void {
        const loader = new THREE.TextureLoader(this.globeEngine.getLoadingManager());
        const assets = [
            'assets/me.jpeg',
            'assets/instagram.png',
            'assets/photography.png',
            'assets/discord.png',
            'assets/youtube.png',
            'assets/email.png'
        ];

        assets.forEach(path => {
            if (this.textureCache.has(path)) return;

            loader.load(path, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                if (path === 'assets/me.jpeg') {
                    this.avatarTexture = this.getRoundedTexture(texture);
                } else {
                    this.textureCache.set(path, texture);
                }
            });
        });

        // Preload Audio
        const audioLoader = new THREE.AudioLoader(this.globeEngine.getLoadingManager());
        audioLoader.load(
            this.AUDIO_PATH,
            (buffer) => {
                console.log('Audio loaded successfully');
                this.ambientSound.setBuffer(buffer);
                this.ambientSound.setLoop(true);
                this.ambientSound.setVolume(0); // Start at 0 for fade in

                // Smart Queue: If user tried to play while loading, start now.
                if (this.playQueued) {
                    console.log('Auto-playing queued audio...');
                    this.isPlaying = true;
                    if (this.audioListener.context.state === 'suspended') {
                        this.audioListener.context.resume();
                    }
                    this.ambientSound.play();
                }
            },
            undefined,
            (error) => {
                console.error('FAILED TO LOAD AUDIO:', error);
            }
        );
    }

    public setTransitionState(isTransitioning: boolean) {
        this.isTransitioning = isTransitioning;
    }

    public setSpeedUp(isSpeeding: boolean) {
        this.speedUpInterval = isSpeeding ? true : null;
    }

    public resetScene() {
        this.isTransitioning = false;
        this.stopCrazyRotation();

        if (!this.orbitGroup) return;

        this.orbitGroup.children.forEach((child: any, index) => {
            child.visible = true;
            child.scale.set(this.BASE_ICON_SIZE, this.BASE_ICON_SIZE, 1);
            const angle = (index / this.orbitGroup.children.length) * Math.PI * 2;
            child.position.set(Math.cos(angle) * this.ORBIT_RADIUS, 0, Math.sin(angle) * this.ORBIT_RADIUS);
        });
    }

    public stopCrazyRotation() {
        this.speedUpInterval = null;
    }

    ngOnDestroy(): void {
        this.dispose();
    }

    public dispose(): void {
        this.stopCrazyRotation();
        if (this.animationId) cancelAnimationFrame(this.animationId);

        // Stop Audio on Destroy
        if (this.ambientSound) {
            if (this.ambientSound.isPlaying) this.ambientSound.stop();
            if (this.ambientSound.source) this.ambientSound.disconnect();
        }

        if (this.scene) {
            this.scene.traverse((object: any) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((m: any) => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                    if (object.material.map) object.material.map.dispose();
                }
            });
        }

        if (this.renderer) {
            this.renderer.domElement.removeEventListener('click', this.boundOnCanvasClick);
            this.renderer.domElement.removeEventListener('mousemove', this.boundOnMouseMove);
            this.renderer.domElement.removeEventListener('touchstart', this.boundOnTouchStart);

            this.renderer.dispose();
            this.renderer.forceContextLoss();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        this.onInteraction = undefined;
    }

    private boundOnCanvasClick = this.onCanvasClick.bind(this);
    private boundOnMouseMove = this.onMouseMove.bind(this);
    private boundOnTouchStart = this.onTouchStart.bind(this);

    private initThree(): void {
        this.scene = new THREE.Scene();
        this.scene.fog = null;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.updateCameraPosition(width, height);

        // Init Audio
        this.audioListener = new THREE.AudioListener();
        this.camera.add(this.audioListener);
        this.ambientSound = new THREE.Audio(this.audioListener);
        this.audioAnalyser = new THREE.AudioAnalyser(this.ambientSound, 32);

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.NoToneMapping;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);

        this.renderer.domElement.addEventListener('click', this.boundOnCanvasClick);
        this.renderer.domElement.addEventListener('mousemove', this.boundOnMouseMove);
        this.renderer.domElement.addEventListener('touchstart', this.boundOnTouchStart, { passive: false });

        window.addEventListener('resize', () => this.onWindowResize());
    }

    private updateCameraPosition(width: number, height: number): void {
        const aspect = width / height;
        if (aspect < 1) {
            this.camera.position.z = this.BASE_CAMERA_Z / aspect * 0.9;
        } else {
            this.camera.position.z = this.BASE_CAMERA_Z;
        }
    }

    private createSceneContent(): void {
        const loader = new THREE.TextureLoader(this.globeEngine.getLoadingManager());

        const setupAvatar = (tex: THREE.Texture) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            const avatarMat = new THREE.MeshBasicMaterial({
                map: tex,
                transparent: false,
                side: THREE.DoubleSide
            });
            const avatarGeo = new THREE.CircleGeometry(this.AVATAR_SIZE / 2, 64);
            const avatar = new THREE.Mesh(avatarGeo, avatarMat);
            avatar.name = "meAvatar";
            avatar.position.set(0, 0, 0);
            this.scene.add(avatar);
        };

        if (this.avatarTexture) {
            setupAvatar(this.avatarTexture);
        } else {
            loader.load('assets/me.jpeg', (texture) => {
                this.avatarTexture = this.getRoundedTexture(texture);
                setupAvatar(this.avatarTexture);
            });
        }

        this.orbitGroup = new THREE.Group();
        this.scene.add(this.orbitGroup);

        const objectsData = [
            { type: 'link', url: 'https://instagram.com/cosmic_monke', icon: 'assets/instagram.png' },
            { type: 'link', url: 'https://www.youtube.com/@pratej.p', icon: 'assets/youtube.png' },
            { type: 'contact', url: '', icon: 'assets/email.png' },
            { type: 'link', url: 'https://leetcode.com/u/prabhu-tejaa/', icon: 'assets/leetcode.png' },
            { type: 'link', url: 'https://www.linkedin.com/', icon: 'assets/linkedin.png' },
            { type: 'link', url: 'https://github.com/prabhu-tejaa', icon: 'assets/github.png' },
            { type: 'link', url: 'https://discord.com/users/1065107790525378570', icon: 'assets/discord.png' },
            { type: 'link', url: 'https://music.youtube.com/@pratej.p', icon: 'assets/youtubeMusic.png' },
            { type: 'link', url: 'https://instagram.com/monke_with_a_camera', icon: 'assets/photography.png' },
        ];

        objectsData.forEach((data, index) => {
            const setupSprite = (tex: THREE.Texture) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                const material = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 1.0 });
                const sprite = new THREE.Sprite(material);
                const angle = (index / objectsData.length) * Math.PI * 2;
                sprite.position.set(Math.cos(angle) * this.ORBIT_RADIUS, 0, Math.sin(angle) * this.ORBIT_RADIUS);
                sprite.scale.set(this.BASE_ICON_SIZE, this.BASE_ICON_SIZE, 1);
                sprite.userData = { ...data };
                this.orbitGroup.add(sprite);
            };

            const cached = this.textureCache.get(data.icon);
            if (cached) {
                setupSprite(cached);
            } else {
                loader.load(data.icon, (texture) => {
                    this.textureCache.set(data.icon, texture);
                    setupSprite(texture);
                });
            }
        });
    }

    private getRoundedTexture(texture: THREE.Texture): THREE.CanvasTexture {
        const image = texture.image as HTMLImageElement;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const size = Math.min(image.width, image.height);
        canvas.width = size;
        canvas.height = size;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, size, size);

        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.colorSpace = THREE.SRGBColorSpace;
        return canvasTexture;
    }

    private animate(): void {
        this.animationId = requestAnimationFrame(() => this.animate());
        if (!this.scene || !this.camera) return;

        const time = Date.now() * 0.001;
        const targetSpeed = this.speedUpInterval ? this.CRAZY_SPEED : this.NORMAL_SPEED;

        this.currentOrbitSpeed += (targetSpeed - this.currentOrbitSpeed) * 0.05;

        if (this.orbitGroup) {
            this.orbitGroup.rotation.y += this.currentOrbitSpeed;
        }

        const avatar = this.scene.getObjectByName("meAvatar");
        if (avatar) {
            avatar.lookAt(this.camera.position);

            // Simple breathe + hover scaling
            const breath = Math.sin(time * 2.5) * 0.15;
            const targetScale = 1 + (this.isAvatarHovered ? 0.1 : 0) + (breath / 5);
            avatar.scale.x += (targetScale - avatar.scale.x) * 0.1;
            avatar.scale.y += (targetScale - avatar.scale.y) * 0.1;
        }

        // Music reaction for orbit icons
        let musicIntensity = 0;
        if (this.isPlaying && this.audioAnalyser) {
            const data = this.audioAnalyser.getAverageFrequency();
            musicIntensity = data / 255;
        }

        if (this.orbitGroup && this.orbitGroup.children.length) {
            const children = this.orbitGroup.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i] as THREE.Sprite;

                if (!this.isTransitioning) {
                    child.position.y = Math.sin(time + (i * 1.5)) * 0.4;
                }

                const isHovered = (child === this.hoveredObject);
                const baseScale = isHovered ? 3.2 : this.BASE_ICON_SIZE;

                // Simple, Clean Pulse Logic
                const pulse = musicIntensity * 0.4;
                const targetScaleValue = baseScale + pulse;

                child.scale.x += (targetScaleValue - child.scale.x) * 0.15;
                child.scale.y += (targetScaleValue - child.scale.y) * 0.15;
            }
        }

        // Linear Audio Fade Logic (1s duration)
        if (this.ambientSound && this.ambientSound.buffer) {
            const currentVol = this.ambientSound.getVolume();
            const fadeStep = 0.02; // Slightly faster fade for responsiveness

            if (this.isPlaying) {
                // Fade In
                if (currentVol < 0.5) {
                    this.ambientSound.setVolume(Math.min(0.5, currentVol + fadeStep));
                }
            } else {
                // Fade Out
                if (currentVol > 0) {
                    const newVol = Math.max(0, currentVol - fadeStep);
                    this.ambientSound.setVolume(newVol);
                    if (newVol === 0 && this.ambientSound.isPlaying) {
                        this.ambientSound.pause();
                    }
                }
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    private onWindowResize(): void {
        if (this.renderer && this.camera && this.container) {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.updateCameraPosition(width, height);
            this.camera.updateProjectionMatrix();
        }
    }

    private onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.updateRaycaster(event.clientX, event.clientY, rect);
    }

    private onTouchStart(event: TouchEvent): void {
        event.preventDefault(); // Prevents double-firing (touch + click)
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.updateRaycaster(touch.clientX, touch.clientY, rect);
            this.onCanvasClick({} as MouseEvent);
        }
    }

    private updateRaycaster(clientX: number, clientY: number, rect: DOMRect) {
        this.mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouseVector, this.camera);

        if (!this.scene) return;

        const avatar = this.scene.getObjectByName("meAvatar");
        const interactables = [...(this.orbitGroup?.children || [])];
        if (avatar) interactables.push(avatar);

        const intersects = this.raycaster.intersectObjects(interactables);

        if (intersects.length > 0) {
            this.hoveredObject = intersects[0].object;
            this.renderer.domElement.style.cursor = 'pointer';

            // Check if avatar is hovered
            this.isAvatarHovered = (this.hoveredObject.name === "meAvatar");
        } else {
            this.hoveredObject = null;
            this.isAvatarHovered = false;
            this.renderer.domElement.style.cursor = 'default';
        }
    }

    private onCanvasClick(event: MouseEvent): void {
        if (!this.hoveredObject) return;

        // Easter Egg Interaction
        if (this.hoveredObject.name === 'meAvatar') {
            // Browser Autoplay Policy: Resume context on user interaction
            if (this.audioListener.context.state === 'suspended') {
                this.audioListener.context.resume();
            }

            if (this.ambientSound && this.ambientSound.buffer) {
                this.isPlaying = !this.isPlaying;

                // CRITICAL: Play MUST be called directly within the click/touch event for mobile
                if (this.isPlaying) {
                    if (!this.ambientSound.isPlaying) {
                        this.ambientSound.play();
                    }
                }
            } else {
                // Audio Still Loading: Queue the intent
                this.playQueued = !this.playQueued;
                console.log(this.playQueued ? 'Audio queued for autoplay...' : 'Audio queue cancelled');
            }

            this.hasTriggeredEasterEgg = true;
            return;
        }

        if (this.onInteraction) {
            const data = this.hoveredObject.userData;
            this.onInteraction({
                type: data['type'],
                url: data['url'],
                data: data
            });
        }
    }
}
