import {dom} from '../../ui';
import {resizeMap} from '../../map';
export default function (map) {
    // Expand width of the map container
    dom.mapContainer.width('100%');
    // Resize main map
    resizeMap(map);
    return;
}