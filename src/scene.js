import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Scene {
  getViewport() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;
    
    return { width, height, ratio } 
  }

  gltfLoader = new GLTFLoader();
  
  createScene() {
    this.scene = new THREE.Scene();
  }

  setUpRendererViewport(renderer) {
    const { width, height } = this.getViewport();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });

    this.domElement = this.renderer.domElement;
    document.body.append(this.domElement);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.setUpRendererViewport(this.renderer);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
  }
  
  createLights() {
    const pointLight = new THREE.PointLight(0xffffff, 10, 100, 1);
    pointLight.position.set(-40, 20, 0);
    this.scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1000, 100, 0.2, 0.5, 2);
    spotLight.position.set(0, 15, 0);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.002;
    this.scene.add(spotLight);
  }

  createCamera() {
    const { ratio } = this.getViewport();
    this.camera = new THREE.PerspectiveCamera(32, ratio, 0.1, 1000);
    this.camera.position.set(0, 6.7, 8);
    this.camera.rotation.x = 0.1;
    this.scene.add(this.camera);
    this.camera.updateProjectionMatrix();
  }

  async loadModel(src) {
    return new Promise((resolve) => {
      const handleGLTF = (gltf) => {
        const model = gltf.scene.children[0];
        this.scene.add(model);
        resolve(model);
      }
      
      this.gltfLoader.load(src, handleGLTF);
    })
  }

  updateSceneViewport() {
    const { ratio } = this.getViewport();
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
    this.setUpRendererViewport(this.renderer);
  }

  animate() {
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }

  init() {
    this.createScene();
    this.createRenderer();
    this.createLights();
    this.createCamera();
    this.animate();
    window.addEventListener("resize", this.updateSceneViewport.bind(this));

    return () => {
      this.domElement.style.display = "none";
      window.removeEventListener("resize", this.updateSceneViewport.bind(this));
    }
  }
}