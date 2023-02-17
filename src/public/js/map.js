/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
// Gets City Buttons by ID
const atlanta = document.getElementById('atlanta');
const smyrna = document.getElementById('smyrna');
const peachtreecorners = document.getElementById('peachtree-corners');
const addMarkerButton = document.getElementById('add-marker');
const markerName = document.getElementById('marker-name');
const markerLatitude = document.getElementById('marker-latitude');
const markerLongitude = document.getElementById('marker-longitude');
const markerDescription = document.getElementById('marker-description');

let mapData;
let googleStreets;
let map;
let markerData;

const listenForClick = () => {
  if (map) {
    map.on('dblclick', (e) => {
      map.eachLayer((layer) => {
        if (layer !== googleStreets) layer.remove();
      });
      L.marker(e.latlng).addTo(map);
      markerLatitude.value = e.latlng.lat;
      markerLongitude.value = e.latlng.lng;
    });
  }
};

// Renders Map Tile with Leaflet.js Library with Default Zoom
const renderMapData = (lat, lon, zoom = 5.5) => {
  if (map) map.remove();
  map = L.map('map').setView([lat, lon], zoom);

  googleStreets = L.tileLayer(
    'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    },
  );
  googleStreets.addTo(map);
};

const init = async () => {
  try {
  let initialMapData = await fetch('/api/maps/default');
  let { map_coordinates_lat, map_coordinates_lon } =
    await initialMapData.json();

  renderMapData(map_coordinates_lat, map_coordinates_lon);
  } catch (err) {
    console.error(err);
    throw new Error("Init Error");
  }
};

const renderMapMarkers = (markers) => {
  for (let mark of markers) {
    // eslint-disable-next-line prefer-const
    let marker = new L.Marker([
      mark.marker_coordinates_lat,
      mark.marker_coordinates_lon,
    ]);
    marker.addTo(map);
    marker
      .bindPopup(`<h2><strong>${mark.name}</strong></h2>${mark.description}`)
      .openPopup();
  }

  listenForClick();
};

const getMapAndMarkerData = async (value) => {
  addMarkerButton.disabled = false;

  if (!mapData) mapData = await (await fetch(`/api/maps/${value}`)).json();
  let { id, map_coordinates_lat, map_coordinates_lon } = mapData;

  let mapMarkers = await fetch(`/api/markers/${id}`);
  markerData = await mapMarkers.json();

  renderMapData(map_coordinates_lat, map_coordinates_lon, 11);

  renderMapMarkers(markerData);
};

const sendNewMarkerToDB = async () => {
  let body = {
    name: markerName.value,
    description: markerDescription.value,
    marker_coordinates_lat: markerLatitude.value,
    marker_coordinates_lon: markerLongitude.value,
  };

  await fetch(`/api/markers/${mapData.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  markerName.value = '';
  markerLatitude.value = '';
  markerLongitude.value = '';
  markerDescription.value = '';

  getMapAndMarkerData();
};

init();

// Click functions to render specific map coordinates
atlanta.addEventListener('click', (e) => {
  e.preventDefault();
  mapData = '';
  let value = atlanta.innerText;
  getMapAndMarkerData(value);
});

smyrna.addEventListener('click', (e) => {
  e.preventDefault();
  mapData = '';
  let value = smyrna.innerText;
  getMapAndMarkerData(value);
});

peachtreecorners.addEventListener('click', (e) => {
  e.preventDefault();
  mapData = '';
  let value = peachtreecCorners.innerText;
  getMapAndMarkerData(value);
});

addMarkerButton.addEventListener('click', (e) => {
  e.preventDefault();
  sendNewMarkerToDB();
});
