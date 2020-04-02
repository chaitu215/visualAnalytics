export default function (containerID) {

    // https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}
    // https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}

    //https://api.mapbox.com/styles/v1/sjamonna/cjsrohexb9tg31fs8gehsbwh1.html?fresh=true&title=true&access_token=pk.eyJ1Ijoic2phbW9ubmEiLCJhIjoiY2o4YXcxczVlMDhyMDJxbnlhMTcycWpjZCJ9.3HTi8RSFUAM9dv7FtK3eag#17.2/41.167620/-81.981898/0

    /*
    var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ';

    var mapboxAttr = '';
    var mapboxAccessToken = 'pk.eyJ1Ijoic2phbW9ubmEiLCJhIjoiY2o4YXcxczVlMDhyMDJxbnlhMTcycWpjZCJ9.3HTi8RSFUAM9dv7FtK3eag';*/
    
    let tiles = {
        mapbox: L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: '',
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1Ijoic2phbW9ubmEiLCJhIjoiY2o4YXcxczVlMDhyMDJxbnlhMTcycWpjZCJ9.3HTi8RSFUAM9dv7FtK3eag',
            opacity: 0.6
        })
    };

    // no labels
    /*
    let tiles = {
        mapbox: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '',
            subdomains: 'abcd',
            opacity: 0.6
        })
    };*/

    /*
    var grayScale = L.tileLayer(mapboxUrl, {
        id: 'mapbox.light',
        attribution: mapboxAttr
    });

    var streets = L.tileLayer(mapboxUrl, {
        id: 'mapbox.streets',
        attribution: mapboxAttr
    });

    var openCycleMap = L.tileLayer('http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png', {
        opacity:0.4, visibility:false
    });

    let options = {
        center: [37.0842, -94.5133],
        zoom: 15,
        minZoom: 11,
        maxZoom: 17,
        layers: [streets],
        detectRetina: true,
        zoomControl: false,
        fullscreenControl: true,
        opacity: 0.1,
        preferCanvas: true,
        trackResize: true
    };

    // Initialize leaflet map
    let map = L.map(containerID, options);
    var baseLayers = {
        'Grayscale': grayScale,
        'Streets': streets,
    }
    L.control.layers(baseLayers).addTo(map);*/

    let options = {
        center: [37.0842, -94.5133],
        //center: [50.0842, -94.5133],
        zoom: 15,
        minZoom: 11,
        maxZoom: 17,
        layers: tiles.mapbox,
        detectRetina: true,
        zoomControl: true,
        fullscreenControl: true,
        opacity: 0.1,
        preferCanvas: true,
        trackResize: true
    };

    let map = L.map(containerID, options);

    // Add zoom controls for the main map
    if (containerID === "map") {
        map.zoomControl.setPosition('bottomleft');
    }


    return map;
}

/**
 * mapbox.streets
mapbox.light
mapbox.dark
mapbox.satellite
mapbox.streets-satellite
mapbox.wheatpaste
mapbox.streets-basic
mapbox.comic
mapbox.outdoors
mapbox.run-bike-hike
mapbox.pencil
mapbox.pirates
mapbox.emerald
mapbox.high-contrast
 */