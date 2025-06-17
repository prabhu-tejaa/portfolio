import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

@Component({
  selector: 'app-galaxy',
  templateUrl: './galaxy.component.html',
  styleUrls: ['./galaxy.component.scss']
})
export class GalaxyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef;
  @ViewChild('sidebar') private sidebar!: ElementRef;

  // Scene properties
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private controls!: OrbitControls;
  private galaxyGroup!: THREE.Group;

  private frameId: number | null = null;

  // Controls state
  public isSidebarOpen = false;
  public rotationSpeed = 0.0005;
  public coreColor = '#fff5b6';
  public armColor = '#9bb0ff';
  

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
    this.hideInfo();
    this.toggleFullscreen();
  }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  public toggleSidebar(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Prevent closing sidebar immediately when clicking hamburger
    }
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public onContainerClick(event: MouseEvent): void {
    if (!this.isSidebarOpen) return;

    if (this.sidebar && !this.sidebar.nativeElement.contains(event.target)) {
      this.isSidebarOpen = false;
    }
  }

  public setRotationSpeed(event: any): void {
    this.rotationSpeed = parseFloat(event.target.value) / 10000;
  }

  public setCoreColor(event: any): void {
    this.coreColor = event.target.value;
    this.regenerateGalaxy();
  }

  public setArmColor(event: any): void {
    this.armColor = event.target.value;
    this.regenerateGalaxy();
  }

  public regenerateGalaxy(): void {
    if (this.galaxyGroup) {
      this.scene.remove(this.galaxyGroup);
      this.galaxyGroup.traverse(child => {
        if (child instanceof THREE.Points) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    }
    this.galaxyGroup = new THREE.Group();
    this.createGalaxy();
    this.scene.add(this.galaxyGroup);
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 5000);
    this.camera.position.z = 1000;
    this.camera.position.y = 500;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 200;
    this.controls.maxDistance = 3000;

    this.galaxyGroup = new THREE.Group();
    this.createGalaxy();
    this.scene.add(this.galaxyGroup);

    this.createBackgroundStars();

    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);

    window.addEventListener('resize', this.onWindowResize);
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private hideInfo(): void {
    const infoElement = document.getElementById('info');
    const loaderElement = document.getElementById('loader');

    if (loaderElement) {
      loaderElement.style.display = 'none';
    }

    if (infoElement) {
      setTimeout(() => {
        infoElement.style.opacity = '0';
        setTimeout(() => {
          infoElement.style.display = 'none';
        }, 1000);
      }, 10000);
    }
  }

  private createGalaxy(): void {
    const particleCount = 100000;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    const coreColorTHREE = new THREE.Color(this.coreColor);
    const armColorTHREE = new THREE.Color(this.armColor);

    const branches = 4, radius = 800, spin = 1.5, randomnessFactor = 0.8;

    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * radius;
      const branchAngle = (i % branches) * (Math.PI * 2 / branches);
      const spinAngle = r * 0.01 * spin;
      const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomnessFactor * (radius / r);
      const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomnessFactor * (radius / r) * 0.3;
      const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomnessFactor * (radius / r);
      const x = Math.cos(branchAngle + spinAngle) * r + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * r + randomZ;
      vertices.push(x, y, z);
      const mixedColor = coreColorTHREE.clone();
      mixedColor.lerp(armColorTHREE, r / radius);
      colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 2.5,
      sizeAttenuation: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });
    const particles = new THREE.Points(geometry, material);
    this.galaxyGroup.add(particles);
  }

  private createBackgroundStars(): void {
    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < starCount; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(4000),
        THREE.MathUtils.randFloatSpread(4000),
        THREE.MathUtils.randFloatSpread(4000)
      );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ size: 1, color: 0xffffff, transparent: true, opacity: 0.5 });
    const backgroundStars = new THREE.Points(geometry, material);
    this.scene.add(backgroundStars);
  }

  private onWindowResize = (): void => {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.composer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  private animate = (): void => {
    this.ngZone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(this.animate);

      this.galaxyGroup.rotation.y += this.rotationSpeed;

      this.controls.update();
      this.composer.render();
    });
  }

  public toggleFullscreen(): void {
    const elem = this.canvas;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        console.error(`Error trying to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
}
