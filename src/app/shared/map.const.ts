import { tileLayer } from 'leaflet';

export class MapConst {
  static LAYER_OCM = {
    id: 'opencyclemap',
    name: 'Open Cycle Map',
    enabled: false,
    layer: tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 6,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Map layer: Open Cycle Map',
    }),
  };
  static LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Open Street Map',
    enabled: false,
    layer: tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 6,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }),
  };
  static LAYER_HOSM = {
    id: 'humanitarianopenstreetmap',
    name: 'Humanitarian Open Street Map',
    enabled: false,
    layer: tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 6,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Map layer: Humanitarian Open Street Map',
    }),
  };
  static LAYER_ESRI = {
    id: 'esrimap',
    name: 'ESRI Map',
    enabled: false,
    layer: tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      minZoom: 6,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Map layer: ESRI Map',
    }),
  };
  static LAYER_WMFLABS = {
    id: 'wmflabsmap',
    name: 'WMFLABS Map',
    enabled: true,
    layer: tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 2,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Map layer: WMFLABS Map',
    }),
  };
}
