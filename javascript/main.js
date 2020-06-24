const mixinNames = ["red", "white", "blue"]
const handStatusEnum = {
  EMPTY: 1,
  HOLDGLASS: 2
}
let handStatus = handStatusEnum.PUT;
let selectedLiquor;
let liquorColor = "#ffffff";
let glassContent = [];

window.onload = () => {
  const sceneEl = document.querySelector('a-scene');
  const camera = document.querySelector('a-camera');
  const buttons = sceneEl.querySelectorAll(".button");
  const coasters = sceneEl.querySelectorAll(".js--coaster");
  let taps = sceneEl.querySelectorAll(".tap");
  let glass = sceneEl.querySelector('#js--glass');
  let bulbs = sceneEl.querySelectorAll(".bulb");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(event){
      changeLightColor(mixinNames[i])
    })
  }

  for (let i = 0; i < taps.length; i++) {
    taps[i].addEventListener("click", function(event){
      let newliquorColor = "white";
      if (glassContent.length < 3) {
        switch (selectedLiquor) {
          case "js--gin":
            glassContent.push("gin");
            newliquorColor = "#ff1100"
            break;
          case "js--vodka":
            glassContent.push("vodka")
            newliquorColor = "#bfc0ee"
            break;
          case "js--martini":
            glassContent.push("martini");
            newliquorColor = "#B67721"
            break;
          case "js--tonic":
            glassContent.push("tonic")
            newliquorColor = "#ffffff"
            break;
          default:
            return;
            break;
        }
        const size = (0.08 * glassContent.length).toString();
        const offsetY = (-0.1 + (0.05 * (glassContent.length - 1))).toString()
        const blend = blendColors(liquorColor, newliquorColor, 0.5)
        glass.appendChild(createLiquor(size, offsetY, blend))
        liquorColor = blend;
      }
    })
  }

  //pickup glass
  glass.addEventListener("click", function(event){
    glass.remove();
    glass = createGlass(0.3, -0.3, -0.5)
    camera.appendChild(glass);
    handStatus = handStatusEnum.HOLDGLASS;
  })

  //put down glass
  for (let i = 0; i < coasters.length; i++) {
    coasters[i].addEventListener("click", function(event){
      if (handStatus == handStatusEnum.HOLDGLASS) {
        handStatus = handStatusEnum.EMPTY;
        selectedLiquor = coasters[i].getAttribute("id");
        camera.removeChild(glass);
        glass = createGlass(coasters[i].getAttribute("position").x,
         coasters[i].getAttribute("position").y + 0.15,
         coasters[i].getAttribute("position").z)
         glass.addEventListener("click", function(event){
           glass.remove();
           glass = createGlass(0.3, -0.3, -0.5)
           camera.appendChild(glass);
           handStatus = handStatusEnum.HOLDGLASS;
         })
        sceneEl.appendChild(glass);
      }
    })
  }

  changeLightColor = (color) => {
    for (var i = 0; i < bulbs.length; i++) {
      bulbs[i].setAttribute("mixin", color + " light")
    }
  }
}

createGlass = (x, y, z) => {
  let glass = document.createElement('a-entity');
  glass.setAttribute("class", "js--glass")
  glass.object3D.position.set(x, y, z);
  let cylinder = document.createElement('a-cylinder');
  cylinder.setAttribute("class", "clickable");
  cylinder.setAttribute("mixin", "glass");
  cylinder.setAttribute("height", "0.3");
  cylinder.setAttribute("radius", "0.1");
  cylinder.setAttribute("open-ended", "true");
  glass.appendChild(cylinder);
  if (glassContent.length != 0) {
    const size = (0.08 * glassContent.length).toString();
    const offsetY = (-0.1 + (0.05 * (glassContent.length - 1))).toString()
    glass.appendChild(createLiquor(size, offsetY, liquorColor))
  }
  return glass;
}

createLiquor = (height, y, color) => {
  let liquor = document.createElement('a-cylinder');
  liquor.setAttribute("color", color);
  liquor.setAttribute("height", height);
  liquor.setAttribute("radius", "0.09");
  liquor.object3D.position.set(0, y, 0);
  return liquor;
}

function blendColors(colorA, colorB, amount) {
  const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
  const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
  const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}
