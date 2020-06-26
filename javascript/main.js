const mixinNames = ["red", "white", "blue"]
const handStatusEnum = {
  EMPTY: 1,
  HOLDGLASS: 2
}
const recipes = {
  tonic: ["tonic", "tonic", "tonic"],
  vodka: ["vodka"],
  gin_tonic: ["gin", "tonic"],
  martini: ["martini"],
  vodka_martini: ["vodka", "martini"],
  gin: ["gin"],
  vodka_tonic: ["vodka", "tonic"],
  beer: ["beer", "beer", "beer"]
}
let recipeOptions = Object.keys(recipes);
let handStatus = handStatusEnum.EMPTY;
let selectedLiquor = "js--done";
let glassContent = [];
let currentOrder = recipes[getRandomRecipe()]
let customerPositions = ["3 0 2", "5 0 2", "7 0 3", "7 0 1", "9 0 4","9 0 2", "7 0 -1", "5 0 0", "3 0 -2", "9 0 -1", "7 0 1", "5 0 -2", "3 0 -3"]
const maxCustomers = customerPositions.length
let customerAmount = 0;
let currentCustomer;
let orderBubble;
let score = 0;
let liquorColor;

window.onload = () => {
  const sceneEl = document.querySelector('a-scene');
  const camera = document.querySelector('a-camera');
  const buttons = sceneEl.querySelectorAll(".button");
  const coasters = sceneEl.querySelectorAll(".js--coaster");
  const barkruk = sceneEl.querySelectorAll('.js--barkruk');
  const bell = sceneEl.querySelector("#bell");
  let taps = sceneEl.querySelectorAll(".tap");
  let glass = sceneEl.querySelector('#js--glass');
  let bulbs = sceneEl.querySelectorAll(".bulb");
  let beertap = document.querySelector("#beertap");
  let beertapping = document.querySelector("#beertapping");
  let rig = sceneEl.querySelector('#rig');

  currentCustomer = createCustomer(currentOrder);
  sceneEl.appendChild(currentCustomer);


  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(event){
      changeLightColor(mixinNames[i])
    })
  }

  for (let i = 0; i < taps.length; i++) {
    taps[i].addEventListener("click", function(event){
      let newliquorColor = "white";
      if (glassContent.length < 3 && taps[i].parentNode.getAttribute("id") == selectedLiquor) {
        switch (selectedLiquor) {
          case "js--gin":
            glassContent.push("gin");
            newliquorColor = "#80f6ff"
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
            newliquorColor = "#ffff75"
            break;
          case "js--beer":
            console.log("hoi");
            // currentCustomer.setAttribute("animation", {property: "position", to: customerPositions.pop(), dur: "5000", easing: "easeOutQuad"})
            beertap.setAttribute("visible",false);
            beertapping.setAttribute("visible",true);
            if(glassContent.length == 2) {
              glassContent.push("beer");
              newliquorColor = "#ffffff"
              setTimeout(() => {
                beertap.setAttribute("visible",true);
                beertapping.setAttribute("visible",false);
              },1000)
              break;
            }
            glassContent.push("beer")
            newliquorColor = "#ffc533"
            setTimeout(() => {
              beertap.setAttribute("visible",true);
              beertapping.setAttribute("visible",false);
            },1000)
            break;
          default:
            return;
            break;
        }
        const size = (0.08 * glassContent.length).toString();
        const offsetY = (-0.1 + (0.05 * (glassContent.length - 1))).toString()
        glass.appendChild(createLiquor(size, offsetY, newliquorColor));
        liquorColor = newliquorColor;
      }
    })
  }

  bell.addEventListener("click", function(event){
    if (selectedLiquor == "js--done") {
      let correct = true;
      for (var i = 0; i < glassContent.length; i++) {
        if (currentOrder.includes(glassContent[i])) {
          continue;
        } else {
          correct = false;
          break;
        }
      }
      if (glassContent.length != currentOrder.length) {
        correct = false;
      }
      if (correct) {
        let customerGlass = createGlass(0.2, 1.2, 0.25);
        orderBubble.setAttribute("value", ":)")
        currentCustomer.appendChild(customerGlass)
        score++;
      } else {
        orderBubble.setAttribute("value", ">:(")
      }
      glass.remove();
      glass = createNewGlass()
      glass.addEventListener("click", function(event){
        glass.remove();
        glass = createGlass(0.3, -0.3, -0.5)
        camera.appendChild(glass);
        handStatus = handStatusEnum.HOLDGLASS;
      })
      sceneEl.appendChild(glass)
      currentCustomer.setAttribute("animation", {property: "position", to: customerPositions.pop(), dur: "5000", easing: "easeOutQuad"})
      if (customerAmount < maxCustomers) {
        currentOrder = recipes[getRandomRecipe()]
        currentCustomer = createCustomer(currentOrder)
        sceneEl.appendChild(currentCustomer)
      } else {
        sceneEl.appendChild(createEndScreen())
      }
    }
  })

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

  //click kruk
  for (let i = 0; i < barkruk.length; i++) {
    barkruk[i].addEventListener("click", function(event){
        console.log("x: ", rig.getAttribute('position').x);
        let x = barkruk[i].getAttribute("position").x
        let y = barkruk[i].getAttribute("position").y
        let z = barkruk[i].getAttribute("position").z
        rig.setAttribute('position', {x: x, y: y - 0.35, z: z})
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

createCustomer = (orderText) => {
  let customer = document.createElement('a-entity');
  let head = document.createElement('a-entity');
  let body = document.createElement('a-entity');
  orderBubble = document.createElement('a-text');
  orderBubble.setAttribute("value", orderText);
  orderBubble.object3D.position.set(0, 2.1, 0.5);
  orderBubble.object3D.rotation.set(THREE.Math.degToRad(0), THREE.Math.degToRad(90), THREE.Math.degToRad(0))
  head.setAttribute("mixin", "customerHead");
  head.setAttribute("position", "0 1.7 0");
  body.setAttribute("mixin", "customerBody");
  body.setAttribute("position", "0 0.7 0");
  customer.appendChild(head);
  customer.appendChild(body);
  customer.appendChild(orderBubble)
  customer.setAttribute("animation", {property: "position", to: "10 0 -1.8", dur: "5000", easing: "easeOutQuad"})
  customer.setAttribute("position", "-1 0 7");
  customerAmount++;
  return customer;
}

createNewGlass = () => {
  liquorColor = "#ffffff";
  glassContent = [];
  const glass = createGlass(11, 1.35, -1)
  return glass
}

createEndScreen = () => {
  let endScreen = document.createElement("a-plane");
  endScreen.object3D.position.set(11, 2.35, -2);
  endScreen.object3D.rotation.set(THREE.Math.degToRad(0), THREE.Math.degToRad(90), THREE.Math.degToRad(0))
  endScreen.setAttribute("color", "black");
  endScreen.setAttribute("width", "2");
  endScreen.setAttribute("height", "0.5")
  let scoreBox = document.createElement("a-text");
  let endScore = "Score: "
  endScore = endScore.concat(score, "/", maxCustomers.toString());
  scoreBox.setAttribute("class", "clickable")
  scoreBox.setAttribute("value", endScore);
  scoreBox.object3D.position.set(-0.6, 0, 0);
  endScreen.appendChild(scoreBox);
  return endScreen;
}

function getRandomRecipe() {
  const result = recipeOptions[Math.floor(Math.random()*recipeOptions.length)];
  return result;
}
