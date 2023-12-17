import { login, get } from "./remote.js";
const username = document.getElementById("username");
const password = document.getElementById("password");
const b_login = document.getElementById("b_login");
const div_login = document.getElementById("div_login");
const div_mappa = document.getElementById("v");
const mappa = document.getElementById("mappa");
const mapp = document.getElementById("mapp");
const elenco = document.getElementById("elenco");
const visualizzazione = document.getElementById("visualizzazione");
const token = "9e5c0fd5-063b-46d3-865b-3914ac60f12c";
const POI_bottoni = document.getElementById("b_POI");
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
let overlay;
let lista_POI = [];

function callback2(content) {
  console.log(content);
  lista_POI = JSON.parse(content.result);
  render();
}

div_login.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    login(callback, token, username.value, password.value);
  }
});

function callback(content) {
  content = JSON.parse(content.result);
  if (content === true) {
    get(token, callback2);
    div_login.classList.remove("d-block");
    div_login.classList.add("d-none");
    div_mappa.classList.remove("d-none");
    div_mappa.classList.add("d-block");
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

function pag_dettaglio() {
  const dettaglio = document.querySelectorAll(".dettaglio");
  dettaglio.forEach((element) => {
    element.onclick = () => {
      console.log(element.nome)
      let index = parseInt(element.id.replace("dettaglio", ""), 10);
      let url = `https://point-of-interest-docente-5binf-tpsi-2023-2024-3.docente-5binf-tpsi-2023-2024.repl.co/singolo.html?id=${index}`;
      window.open(url, "_self");
    }
  })
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
  lista_POI.forEach((element) => {
    html += template.replace("%nome", element.nome).replace("%url", element.url[0]).replace("dettaglio", "dettaglio" + element.id)
  })
  visualizzazione.innerHTML = html;
  pag_dettaglio();
}

elenco.onclick = () => {
  mapp.classList.remove("d-block");
  mapp.classList.add("d-none");
  visualizzazione.classList.remove("d-none");
  visualizzazione.classList.add("d-block");
  render();
}

function setLayers(map) {
  const layers = [new ol.layer.Tile({ source: new ol.source.OSM() })];
  map.addLayer(new window.ol.layer.Group({ layers }));
}
function setCenter(map, lonlat) {
  const center = window.ol.proj.fromLonLat(lonlat);
  map.getView().setCenter(center);
}
function setZoom(map, zoom) {
  map.getView().setZoom(zoom);
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
function initOverlay(map, points) {
  overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });
  map.addOverlay(overlay);
  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  map.on('singleclick', function(event) {
    if (map.hasFeatureAtPixel(event.pixel) === true) {
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        const coordinate = event.coordinate;
        content.innerHTML = feature.name;
        overlay.setPosition(coordinate);
      })
    } else {
      overlay.setPosition(undefined);
      closer.blur();
    }
  });

}

mappa.onclick = () => {
  visualizzazione.classList.remove("d-block");
  visualizzazione.classList.add("d-none");
  mapp.classList.remove("d-none");
  mapp.classList.add("d-block");
  const map = new ol.Map({ target: document.querySelector('.map') });
  setLayers(map);
  setCenter(map, [10.9916215, 45.4383842]);
  setZoom(map, 15);
  lista_POI.forEach((element) => {
    addMarker(map, { lonlat: [element.lon, element.lat], name: element.nome });
  })
  initOverlay(map);
  let html = ``;
  let template = `<div class="row"><button type="button"  id="dettaglio" class="dettaglio btn btn-success">%nome</button></div><br>`;
  lista_POI.forEach((element) => {
    html += template.replace("%nome", element.nome).replace("dettaglio", "dettaglio" + element.id);
  })
  POI_bottoni.innerHTML = html;
  const dettaglio = document.querySelectorAll(".dettaglio");
  console.log(dettaglio)
  dettaglio.forEach((element) => {
    console.log(element.id)
    element.onclick = () => {
      console.log(element.nome)
      let index = parseInt(element.id.replace("dettaglio", ""), 10);
      let url = `https://point-of-interest-docente-5binf-tpsi-2023-2024-3.docente-5binf-tpsi-2023-2024.repl.co/singolo.html?id=${index}`;
      window.open(url, "_self");
    }
  })
}