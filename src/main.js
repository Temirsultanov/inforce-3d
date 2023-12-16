import { Scene } from "./scene";
import { RotationYOnScroll } from "./scrollAnimation";

function initRotationToModel(modelSrc, beginPoint, endPoint, rotateFrom) {
  const ROTATE_DISTANCE = Math.PI;

  const scene = new Scene();
  scene.init();

  scene.loadModel(modelSrc).then((model) => {
    const rotation = new RotationYOnScroll({
      beginPoint,
      endPoint,
      element: model,
      from: rotateFrom,
      to: rotateFrom + ROTATE_DISTANCE
    })

    rotation.start();
  })
}

initRotationToModel("src/3d/screwdriver.glb", 0, 700, Math.PI * 1.5);
initRotationToModel("src/3d/pliers.glb", 700, 1400, Math.PI * 1.5);
initRotationToModel("src/3d/flashlight.glb", 1400, 2100, Math.PI * 1.5);