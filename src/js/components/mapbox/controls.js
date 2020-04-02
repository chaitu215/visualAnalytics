import mapboxgl from 'mapbox-gl';

/**
 * Add controls to current map
 * @param {*} map - mapbox object
 */

export default function (map)
{

    var navigation = new mapboxgl.NavigationControl({
        position: 'top-left'
    });



    map.addControl(navigation);
    navigation._container.parentNode.className = 'mapboxgl-ctrl-bottom-center';

    // Add fullscreen control
    // map.addControl(new mapboxgl.FullscreenControl());

    return;
}