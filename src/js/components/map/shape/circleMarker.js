/**
 * Create circle marker shape
 * @param {*} point 
 * @param {*} color 
 * @param {*} opacity 
 * @param {*} data 
 */
export default function (point, color, fill, opacity, data) {
    return new L.circleMarker(point, {
        color: color,
        opacity: opacity,
        radius: 3.5,
        fillColor: fill,
        fillOpacity: opacity,
        stroke: true,
        weight: 1,
        data: data
    });
}