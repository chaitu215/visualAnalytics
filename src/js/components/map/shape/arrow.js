/**
 * Direction arrow shape
 * @param {*} layer 
 * @param {*} color 
 * @param {*} opacity 
 * @param {*} weight 
 */
export default function (layer, color, opacity, weight) {
    return new L.polylineDecorator(layer, {
        patterns: [{
            offset: 10,
            repeat: 50,
            symbol: L.Symbol.arrowHead({
                pixelSize: 5,
                pathOptions: {
                    opacity: opacity,
                    fillColor: color,
                    fillOpacity: 1,
                    weight: weight,
                    interaction: false,
                }
            })
        }]
    });
}