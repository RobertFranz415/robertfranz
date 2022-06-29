// particlesJS("particles-js", {
//   particles: {
//     number: { value: 80, density: { enable: true, value_area: 800 } },
//     color: { value: "#13E8E9" },
//     shape: {
//       type: "edge",
//       stroke: { width: 0, color: "#000000" },
//       polygon: { nb_sides: 5 },
//       image: { src: "img/github.svg", width: 100, height: 100 }
//     },
//     opacity: {
//       value: 0.5,
//       random: false,
//       anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
//     },
//     size: {
//       value: 3,
//       random: true,
//       anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
//     },
//     line_linked: {
//       enable: true,
//       distance: 150,
//       color: "#ffffff",
//       opacity: 0.4,
//       width: 1
//     },
//     move: {
//       enable: true,
//       speed: 3,
//       direction: "none",
//       random: false,
//       straight: false,
//       out_mode: "out",
//       bounce: false,
//       attract: { enable: false, rotateX: 600, rotateY: 1200 }
//     }
//   },
//   interactivity: {
//     detect_on: "canvas",
//     events: {
//       onhover: { enable: false, mode: "grab" },
//       onclick: { enable: true, mode: "repulse" },
//       resize: true
//     },
//     modes: {
//       grab: { distance: 400, line_linked: { opacity: 1 } },
//       bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
//       repulse: { distance: 150, duration: 0.4 },
//       push: { particles_nb: 4 },
//       remove: { particles_nb: 2 }
//     }
//   },
//   retina_detect: true
// });
// var count_particles, stats, update;
// stats = new Stats();
// stats.setMode(0);
// stats.domElement.style.position = "absolute";
// stats.domElement.style.left = "0px";
// stats.domElement.style.top = "0px";
// document.body.appendChild(stats.domElement);
// count_particles = document.querySelector(".js-count-particles");
// update = function () {
//   stats.begin();
//   stats.end();
//   if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
//     count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
//   }
//   requestAnimationFrame(update);
// };
// requestAnimationFrame(update);



/*  Visualizer js  */

function togglePlaying() {
  if (song.isPlaying()) {
      song.pause();
      songButton.html("play_arrow");
  } else {
      song.play();
      songButton.html("pause");
  }
}

function updateVol() {
  song.setVolume(volSlider.value());
}

function browserTest() {
  console.log("Browser Test Called");
  var uAgent = navigator.userAgent;
  let browserName;

  if (uAgent.match(/firefox|fxios/i)) {
      browserName = "firefox";
  } else if (uAgent.match(/chrome|chromium|crios/i)) {
      browserName = "chrome";
  } else if (uAgent.match(/safari/i)) {
      browserName = "safari";
  } else if (uAgent.match(/opr\//i)) {
      browserName = "opera";
  } else if (uAgent.match(/edg/i)) {
      browserName = "edge";
  } else {
      browserName = "Unable to detect browser";
  }
  console.log(browserName);
  if (browserName !== 'firefox') {
      document.getElementById("canvas-div").innerHTML = '<div id="browser-warning"> ONLY WORKS IN FIREFOX FOR NOW </div>'
  }
}