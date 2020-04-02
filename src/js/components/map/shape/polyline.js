/**
 * Generate leaflet polyline shape
 * @param {*} path 
 * @param {*} color 
 * @param {*} weight 
 * @param {*} opacity 
 */
export default function (path, color, weight, opacity, interact) {
    return new L.Polyline(path, {
        color: color,
        weight: weight,
        opacity: opacity,
        smoothFactor: 1,
        interactive: interact,
        lineCap: "square"
    });
}