const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
let overlay;
const map = new ol.Map({ target: document.querySelector('.map') });


function setLayers(map) {
  const layers = [new ol.layer.Tile({ source: new ol.source.OSM() })]; // crea un layer da Open Street Maps
  map.addLayer(new window.ol.layer.Group({ layers })); // lo aggiunge alla mappa
}
function setCenter(map, lonlat) {
  const center = window.ol.proj.fromLonLat(lonlat);
  map.getView().setCenter(center);
}
//fissa il centro della mappa su una certa coppia di coordinate

function setZoom(map, zoom) {
  map.getView().setZoom(zoom);

}
// fissa il livello di zoom

function addMarker(map, point) {
  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(point.coordi))
  });
  feature.id = point.id;
  feature.name = point.nome;
  const layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature]
    }),
    style: [new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        crossOrigin: 'anonymous',
        src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
      })
    }), new ol.style.Style({
      text: new ol.style.Text({
        font: '20px Calibri,sans-serif',
        text: point.nome,
        overflow: true,
        fill: new ol.style.Fill({
          color: '#ffffff'
        }),
        stroke: new ol.style.Stroke({
          color: '#000000',
          width: 3
        }),
        offsetY: 10
      })
    })]
  });
  map.addLayer(layer);
}

const iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 1],
    crossOrigin: 'anonymous',
    src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
  })
})

const labelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '100px Calibri,sans-serif',
    overflow: true,
    fill: new ol.style.Fill({
      color: '#4287f5'
    }),
    stroke: new ol.style.Stroke({
      color: '#f54242',
      width: 10
    }),
    offsetY: -12
  })
})

let style = [iconStyle, labelStyle]

// crea un popup e gestisce l'apertura dell'overlay
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
    if (map.hasFeatureAtPixel(event.pixel) === true) { // se esiste un marker
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => { // lo recupera
        let url = 'https://point-of-interest-docente-5binf-tpsi-2023-2024-2.docente-5binf-tpsi-2023-2024.repl.co/progetto_sito/utente_base/POI.html?id=%ID'
        url = url.replace("%ID", feature.id);
        window.location.replace(url);
      })
    } else {
      overlay.setPosition(undefined); // altrimenti lo nasconde
      closer.blur();
    }
  });
}

export const add_marker = (dati) => {
  dati.forEach((p) => {
    addMarker(map, p);
  })

}

setLayers(map);
setCenter(map, [13.777268090352537, 45.64706244887274]);
setZoom(map, 14);
initOverlay(map);