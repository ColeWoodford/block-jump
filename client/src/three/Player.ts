import * as THREE from 'three';
import { Game } from './Game';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export class Player {
  game: any;
  controls: any;

  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  canJump: boolean;

  velocity: THREE.Vector3;
  direction: THREE.Vector3;

  prevJumpTime: any;

  constructor(game: Game) {
    this.animatePlayer = this.animatePlayer.bind(this);

    this.game = game;
    this.controls = new PointerLockControls(this.game.camera, this.game.mountRef.current);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.canJump = false;
  }

  init(): void {
    this.prevJumpTime = performance.now();
    // change to ref?
    const blocker: any = document.getElementById('blocker');
    const instructions: any = document.getElementById('instructions');

    instructions?.addEventListener('click', () => {
      this.controls.lock();
    });

    this.controls.addEventListener('lock', () => {
      instructions.style.display = 'none';
      blocker.style.display = 'none';
    });

    this.controls.addEventListener('unlock', () => {
      blocker.style.display = 'block';
      instructions.style.display = '';
    });

    this.game.scene.add(this.controls.getObject());

    const onKeyDown = (event: any) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = true;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = true;
          break;

        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = true;
          break;

        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = true;
          break;

        case 'Space':
          const time = performance.now();
          const deltaJump = time - this.prevJumpTime;
          if (this.canJump === true && deltaJump > 500) {
            this.velocity.y += 350;
            this.prevJumpTime = time;
          }
          this.canJump = false;
          break;
      }
    };

    const onKeyUp = (event: any) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = false;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = false;
          break;

        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = false;
          break;

        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = false;
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }

  animatePlayer(): void {
    const time = performance.now();

    if (this.controls.isLocked === true) {
      this.game.raycaster.ray.origin.copy(this.controls.getObject().position);
      this.game.raycaster.ray.origin.y -= 10;

      const intersections = this.game.raycaster.intersectObjects(this.game.objects);

      const onObject = intersections.length > 0;

      const delta = (time - this.game.prevTime) / 1000;

      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;

      this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.normalize(); // this ensures consistent movements in all directions

      if (this.moveForward || this.moveBackward)
        this.velocity.z -= this.direction.z * 400.0 * delta;
      if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

      if (onObject === true) {
        this.velocity.y = Math.max(0, this.velocity.y);
        this.canJump = true;
      }

      this.controls.moveRight(-this.velocity.x * delta);
      this.controls.moveForward(-this.velocity.z * delta);

      this.controls.getObject().position.y += this.velocity.y * delta; // new behavior

      if (this.controls.getObject().position.y < 10) {
        this.velocity.y = 0;
        this.controls.getObject().position.y = 10;

        this.canJump = true;
      }
    }
    this.game.prevTime = time;
  }
}
