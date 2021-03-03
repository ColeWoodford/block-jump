import * as THREE from "three";
import { Player } from "./Player";

export class Game {
  mountRef: any;

  player: Player;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;
  raycaster: THREE.Raycaster;

  objects: any[];

  prevTime: any;

  vertex: THREE.Vector3;
  color: THREE.Color;

  highScore: number;

  constructor(mountRef: any) {
    this.animate = this.animate.bind(this);
    this.delete = this.delete.bind(this);

    this.mountRef = mountRef;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    this.scene.add(light);

    this.vertex = new THREE.Vector3();
    this.color = new THREE.Color();

    this.highScore = 0;

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.objects = [];

    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      10
    );

    this.player = new Player(this);

    this.prevTime = performance.now();
  }

  init(): void {
    this.camera.position.y = 10;

    this.player.init();

    // floor
    let floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    // vertex displacement
    let position: any = floorGeometry.attributes;

    for (let i = 0, l = position.count; i < l; i++) {
      this.vertex.fromBufferAttribute(position, i);

      this.vertex.x += Math.random() * 20 - 10;
      this.vertex.y += Math.random() * 2;
      this.vertex.z += Math.random() * 20 - 10;

      position.setXYZ(i, this.vertex.x, this.vertex.y, this.vertex.z);
    }

    //@ts-ignore
    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

    position = floorGeometry.attributes.position;
    const colorsFloor = [];

    for (let i = 0, l = position.count; i < l; i++) {
      this.color.setHSL(
        Math.random() * 0.3 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      );
      colorsFloor.push(this.color.r, this.color.g, this.color.b);
    }

    floorGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorsFloor, 3)
    );

    const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.scene.add(floor);

    // objects
    //@ts-ignore
    const boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20).toNonIndexed();

    position = boxGeometry.attributes.position;
    const colorsBox = [];

    for (let i = 0, l = position.count; i < l; i++) {
      this.color.setHSL(
        Math.random() * 0.3 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      );
      colorsBox.push(this.color.r, this.color.g, this.color.b);
    }

    boxGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorsBox, 3)
    );

    for (let i = 0; i < 700; i++) {
      const boxMaterial = new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        flatShading: true,
        vertexColors: true,
      });
      boxMaterial.color.setHSL(
        Math.random() * 0.2 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      );

      const cubeDensity = 20; // how spread out are cubes
      const verticalDistribution = 40; // how high up should the cubes extend

      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.x =
        Math.floor(Math.random() * cubeDensity - 10) * cubeDensity;
      box.position.y =
        Math.floor(Math.random() * verticalDistribution) * cubeDensity + 10;
      box.position.z =
        Math.floor(Math.random() * cubeDensity - 10) * cubeDensity;

      this.scene.add(box);
      this.objects.push(box);
    }

    //@ts-ignore
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.mountRef.current.appendChild(this.renderer.domElement);
  }

  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  getHighScore(): number {
    return Math.ceil(this.highScore);
  }

  animate(): void {
    requestAnimationFrame(this.animate);

    if (this.camera.position.y > this.highScore) {
      this.highScore = this.camera.position.y;
    }

    this.player.animatePlayer();

    this.renderer.render(this.scene, this.camera);
  }

  delete(): void {
    this.player.delete();
  }
}

export default Game;
