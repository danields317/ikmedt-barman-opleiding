const mixinNames = ["red", "white", "blue"]
let bulbs

window.onload = () => {
  const sceneEl = document.querySelector('a-scene');
  const buttons = sceneEl.querySelectorAll(".button");
  bulbs = sceneEl.querySelectorAll(".bulb");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(event){
      changeLightColor(mixinNames[i])
    })
  }
}

changeLightColor = (color) => {
  for (var i = 0; i < bulbs.length; i++) {
    bulbs[i].setAttribute("mixin", color + " light")
  }
}
