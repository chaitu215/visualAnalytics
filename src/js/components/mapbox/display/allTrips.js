import { default as layers } from '../layers';
import mapboxgl from 'mapbox-gl';

/**
 * Display all trips over a mapbox
 * @param {*} trips 
 * @param {*} map 
 */
export default function (trips, map) 
{
    // Clear all coordinates data
    layers.allTrips.source.data.features = [];

    // Convert coordinates to geojson
    function coordsToGeojson (coords) {
        return [coords[1], coords[0]];
    }


    trips.forEach( trip => {

        var lineString = {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        }

        // Create line string from trip path
        // Need to convert latlng to geojson
        trip.path.forEach( point => {
            let geojsonPoint = coordsToGeojson(point);
            lineString.geometry.coordinates.push(geojsonPoint);
        });
        
        // Add line string to feature collection
        layers.allTrips.source.data.features.push(lineString);
    });

    var bounds = new mapboxgl.LngLatBounds();
    layers.allTrips.source.data.features.forEach( feature => {
        bounds.extend(feature.geometry.coordinates);
    });

    map.fitBounds(bounds);
    map.addLayer(layers.allTrips);
    //});

    return;
}