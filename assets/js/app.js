import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import vertex from "../shaders/vertex";
import fragment from "../shaders/fragment";
import * as dat from "dat.gui";

export default class Scene {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.scene = new THREE.Scene();
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.windowWidth / this.windowHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.container = document.querySelector("#scene-container");
    this.container.appendChild(this.renderer.domElement);

    this.renderer.setSize(this.windowWidth, this.windowHeight);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.init();
  }

  init() {
    this.settingsParams();
    this.addObjects();
    this.animate();
    this.onWindowResize();
    this.listeners();
    this.datGui();
  }

  settingsParams() {
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
  }

  datGui() {
    this.settings = {
      progress: 0.5
    };
    this.gui = new dat.GUI();
    this.gui.addFolder("Settings");
    this.gui.add(this.settings, "progress", 0, 5).step(0.01);
  }

  addObjects() {
    const geometry = new THREE.PlaneBufferGeometry(2, 2, 10);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide
    });
    const cube = new THREE.Mesh(geometry, material);

    this.scene.add(cube);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  listeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

new Scene();
