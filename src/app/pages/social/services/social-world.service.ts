import { Injectable, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';

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

    // --- CONFIGURATION ---
    private readonly BASE_ICON_SIZE = 2.2;
    private readonly ORBIT_RADIUS = 9.5;
    private readonly AVATAR_SIZE = 5.5;
    private readonly NORMAL_SPEED = 0.003;
    private readonly CRAZY_SPEED = 0.15;
    private readonly BASE_CAMERA_Z = 18;
    // ---------------------

    private speedUpInterval: any = null;
    private isTransitioning = false;
    private hoveredObject: THREE.Object3D | null = null;
    private currentOrbitSpeed = 0.003;

    // Callback for when user clicks an item
    public onInteraction?: (event: InteractionEvent) => void;

    constructor(private zone: NgZone) { }

    public init(container: HTMLElement): void {
        this.container = container;
        this.initThree();
        this.createSceneContent();

        // Loop outside Angular to avoid CD thrashing
        this.zone.runOutsideAngular(() => {
            this.animate();
        });
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
            // Remove listeners
            this.renderer.domElement.removeEventListener('click', this.boundOnCanvasClick);
            this.renderer.domElement.removeEventListener('mousemove', this.boundOnMouseMove);
            this.renderer.domElement.removeEventListener('touchstart', this.boundOnTouchStart);

            this.renderer.dispose();
            this.renderer.forceContextLoss();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        // Clear references
        this.onInteraction = undefined;
    }

    // Bind methods to keep 'this' context
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

        // Event Listeners
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
        const loader = new THREE.TextureLoader();

        // --- 1. THE AVATAR ---
        loader.load('assets/me.jpeg', (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            const roundedTexture = this.getRoundedTexture(texture);
            roundedTexture.colorSpace = THREE.SRGBColorSpace;

            const avatarMat = new THREE.MeshBasicMaterial({
                map: roundedTexture,
                transparent: false,
                side: THREE.DoubleSide
            });

            const avatarGeo = new THREE.CircleGeometry(this.AVATAR_SIZE / 2, 64);
            const avatar = new THREE.Mesh(avatarGeo, avatarMat);

            avatar.name = "meAvatar";
            avatar.position.set(0, 0, 0);
            this.scene.add(avatar);
        });

        // --- 2. ORBITING ICONS ---
        this.orbitGroup = new THREE.Group();
        this.scene.add(this.orbitGroup);

        const objectsData = [
            { type: 'link', url: 'https://instagram.com/cosmic_monke', icon: 'assets/instagram.png' },
            { type: 'link', url: 'https://instagram.com/monke_with_a_camera', icon: 'assets/photography.png' },
            { type: 'link', url: 'https://discord.com/users/1065107790525378570', icon: 'assets/discord.png' },
            { type: 'link', url: 'https://www.youtube.com/@pratej.p', icon: 'assets/youtube.png' },
            { type: 'contact', url: '', icon: 'assets/email.png' }
        ];

        objectsData.forEach((data, index) => {
            loader.load(data.icon, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 1.0 });
                const sprite = new THREE.Sprite(material);

                const angle = (index / objectsData.length) * Math.PI * 2;
                sprite.position.set(Math.cos(angle) * this.ORBIT_RADIUS, 0, Math.sin(angle) * this.ORBIT_RADIUS);
                sprite.scale.set(this.BASE_ICON_SIZE, this.BASE_ICON_SIZE, 1);
                sprite.userData = { ...data };
                this.orbitGroup.add(sprite);
            });
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
            const breath = Math.sin(time * 2.5) * 0.15;
            avatar.scale.set(1 + breath / 5, 1 + breath / 5, 1);
        }

        if (this.orbitGroup && this.orbitGroup.children.length) {
            const children = this.orbitGroup.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i] as THREE.Sprite;

                if (!this.isTransitioning) {
                    child.position.y = Math.sin(time + child.position.x) * 0.4;
                }

                const targetScaleValue = (child === this.hoveredObject) ? 3.2 : this.BASE_ICON_SIZE;
                child.scale.x += (targetScaleValue - child.scale.x) * 0.1;
                child.scale.y += (targetScaleValue - child.scale.y) * 0.1;
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
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.updateRaycaster(touch.clientX, touch.clientY, rect);
            // Simulate click for touch devices
            this.onCanvasClick({} as MouseEvent);
        }
    }

    private updateRaycaster(clientX: number, clientY: number, rect: DOMRect) {
        this.mouseVector.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouseVector.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouseVector, this.camera);

        if (!this.orbitGroup || this.orbitGroup.children.length === 0) return;

        const intersects = this.raycaster.intersectObjects(this.orbitGroup.children);

        if (intersects.length > 0) {
            this.hoveredObject = intersects[0].object;
            this.renderer.domElement.style.cursor = 'pointer';
        } else {
            this.hoveredObject = null;
            this.renderer.domElement.style.cursor = 'default';
        }
    }

    private onCanvasClick(event: MouseEvent): void {
        if (this.hoveredObject && this.onInteraction) {
            const data = this.hoveredObject.userData;
            this.onInteraction({
                type: data.type,
                url: data.url,
                data: data
            });
        }
    }
}
