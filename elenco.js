import { login, get } from "./remote.js";
const username = document.getElementById("username");
const password = document.getElementById("password");
const b_login = document.getElementById("b_login");
const div_login = document.getElementById("div_login");
const mappa = document.getElementById("mappa");
const visualizzazione = document.getElementById("visualizzazione");
const token = "9e5c0fd5-063b-46d3-865b-3914ac60f12c";
let lista_POI = [];

function callback2(content) {
  console.log(content);
  lista_POI = JSON.parse(content.result);
  render();
}

function callback(content) {
  content = JSON.parse(content.result);
  if (content === true) {
    get(token, callback2);
    div_login.classList.remove("d-block");
    div_login.classList.add("d-none");
    visualizzazione.classList.remove("d-none");
    visualizzazione.classList.add("d-block");
  }
  else {
    text.classList.remove("d-none");
    text.classList.add("border-danger");
    text.innerText = "Credenziali errate";
  }
}

b_login.onclick = () => {
  login(callback, token, username.value, password.value);
}

function render() {
  let html = ``;
  let template = `
  <div class="row">
   <div class="col"></div>
   <div class="col-6 text-center centro">
  <div class="card border-success mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="%url" class="img-fluid rounded-start" style="height:100% ;width:100%""> 
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h3 class="card-title">%nome</h3>
        <br>
        <br>
        <button type="button" id="dettaglio" class="dettaglio btn btn-success">Dettaglio</button>
      </div>
    </div> 
  </div>
  </div>
  </div>
   <div class="col"></div>
   </div>`;
  lista_POI.forEach((element, index) => {
    html += template.replace("%nome", element.nome).replace("%url", element.url[0]).replace("dettaglio", "dettaglio" + index)
  })
  visualizzazione.innerHTML += html
  const dettaglio = document.querySelectorAll(".dettaglio")
  dettaglio.forEach((element) => {
    element.onclick = () => {
      let index = parseInt(element.id.replace("dettaglio", ""), 10);
      let url = `https://point-of-interest-docente-5binf-tpsi-2023-2024-3.docente-5binf-tpsi-2023-2024.repl.co/singolo.html?id=${index}`;
      window.open(url, "_self");
    }
  })
}

mappa.onclick = () => {
  console.log("ciao")
  const mapp = document.getElementById("mapp");
  visualizzazione.classList.remove("d-block");
  visualizzazione.classList.add("d-none");
  mapp.classList.remove("d-none");
  mapp.classList.add("d-block");
  const map = new ol.Map({ target: document.querySelector('.map') });
  setLayers(map);
  setCenter(map, [,]);
  setZoom(map, 12);
  addMarker(map, { lonlat: [,], name: "" });
  addMarker(map, { lonlat: [,], name: "" });
}


function setLayers(map) {
  const layers = [new ol.layer.Tile({ source: new ol.source.OSM() })]; // crea un layer da Open Street Maps
  map.addLayer(new window.ol.layer.Group({ layers })); // lo aggiunge alla mappa
}
function setCenter(map, lonlat) {
  const center = window.ol.proj.fromLonLat(lonlat);
  map.getView().setCenter(center); //fissa il centro della mappa su una certa coppia di coordinate
}
function setZoom(map, zoom) {
  map.getView().setZoom(zoom); // fissa il livello di zoom
}
function addMarker(map, point) {
  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(point.lonlat))
  });
  feature.name = point.name;
  const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature]
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        crossOrigin: 'anonymous',
        src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
      })
    })
  });
  map.addLayer(layer);
}