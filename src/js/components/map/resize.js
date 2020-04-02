// Resize map when resize its container.
export default function (map)
{
    return setTimeout(function(){ map.invalidateSize()}, 400);
}