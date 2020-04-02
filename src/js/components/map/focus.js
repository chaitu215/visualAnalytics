export default function (map, layer) {
    // Get bounding box layers
    let bounds = layer.getBounds();
    return map.flyToBounds(bounds);
}