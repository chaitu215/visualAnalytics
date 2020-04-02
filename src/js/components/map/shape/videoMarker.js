/**
 * create video marker in circle
 * @param {*} latlng 
 * @param {*} color 
 * @param {*} fill 
 * @param {*} opacity 
 * @param {*} data 
 */
export default function (latlng, color, fill, opacity, data)
{
    // Create flag icon
    /*
    var flagIcon = L.icon({
        iconUrl: "./images/marker/3.png",
        iconSize: [40, 40],
        className: 'rotate-north',
        iconAnchor: [10, 35]
    });
    */

    // Create leaflet marker
    /*
    var marker = new L.marker(latlng, {
        //id: 'video-marker',
        //className: 'test',
        icon: flagIcon,
        //rotationAngle: bearing,
        //rotationOrigin: 'center'
    });*/

    return new L.circleMarker( latlng, {
        color: color,
        opacity: opacity,
        radius: 8,
        fillColor: fill,
        fillOpacity: opacity, // reduce fill opacity
        stroke: true,
        weight: 3,
        data: data,
        interactive: false
    })

    // return marker;
}