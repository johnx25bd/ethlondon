mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA';

var color = d3.schemeSet2;
var map = new mapboxgl.Map({
  container: 'zone-map',
  style: 'mapbox://styles/mapbox/dark-v9',
  center: [
    14.038784600499525,
    49.29969274777156
  ],
  zoom: 5.7,
  pitch: 70, // pitch in degrees
});


map.on('style.load', function () {
  map.style.stylesheet.layers.forEach(function(layer) {
    if (layer.type === 'symbol') {
      map.removeLayer(layer.id);
    }
  });

  // map.addSource('london-source', {
  //   "type": 'geojson',
  //   'data': geojson[0]
  // });
  //
  // map.addLayer({
  //   'id': 'london',
  //   'type': 'fill',
  //   'source': 'london-source',
  //   'layout': {},
  //   'paint': {
  //     'fill-color': 'lightblue',
  //     'fill-opacity': 0.2
  //   }
  // });
  //
  // map.addSource('dover-source', {
  //   "type": 'geojson',
  //   'data': geojson[1]
  // });
  //
  // map.addLayer({
  //   'id': 'dover',
  //   'type': 'fill',
  //   'source': 'dover-source',
  //   'layout': {},
  //   'paint': {
  //     'fill-color': 'red',
  //     'fill-opacity': 0.4
  //   }
  // });
  //
  // map.addSource('rotterdam-source', {
  //   "type": 'geojson',
  //   'data': geojson[2]
  // });
  //
  // map.addLayer({
  //   'id': 'rotterdam',
  //   'type': 'fill',
  //   'source': 'rotterdam-source',
  //   'layout': {},
  //   'paint': {
  //     'fill-color': 'green',
  //     'fill-opacity': 0.4
  //   }
  // });
})
