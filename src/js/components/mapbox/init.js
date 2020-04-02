import mapboxgl from 'mapbox-gl';
import { default as getAccessToken } from './token';
import { default as addMapControls } from './controls';

/**
 * Create mapbox map
 * @param {*} divId - container id
 */
export default function (divId)
{
    // Get mapbox access token
    mapboxgl.accessToken = getAccessToken();
    var center = [-94.5133, 37.0842];

    // create map
    var map = new mapboxgl.Map({
        container: divId,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 15
    });
    
    // Add control
    addMapControls(map);

    return map;
}