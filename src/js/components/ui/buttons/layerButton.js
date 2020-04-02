import {dom} from '../index';
import {resizeMap} from '../../map';
import {currentMap} from '../../ui/events/minimap';
import {getCurrentMap} from '../../../main/geovisuals';
export default function () {
    // Expand layer button change to div
    dom.layerButton.on('mouseover', (e) => {
        e.stopPropagation();
        dom.layerContainer.show();
    });

    dom.layerContainer.on('mouseleave', (e) => {
        e.stopPropagation();
        dom.layerContainer.hide();
    });

    // Switch map
    dom.switchmapButton.on('click', (e) => {
        dom.switchmapButton.toggleClass('switched');
        if (dom.switchmapButton.hasClass('switched')) {
            //dom.mapContainer.hide();
            // Switch minimap
            dom.videoPlayerMinimap.css({
                border: '3px solid #ffffff',
                width: '100%',
                height: '60%',
                float: 'left',
                position: 'relative'
            });
            dom.videoPlayerMinimap.insertAfter($('#trip-wordcloud'));

            dom.mapContainer.css({
                width: '100%',
                height: '120px',
                border: '2px solid #000',
                cursor: 'pointer',
            });
            dom.mapContainer.insertBefore(dom.currentTripNarrative);

            resizeMap(getCurrentMap());
            resizeMap(currentMap);
            enableInteraction();
        } else {
            // Switch current map
            //dom.mapContainer.show();
            dom.videoPlayerMinimap.css({
                width: '100%',
                height: '120px',
                border: '2px solid #000',
                cursor: 'pointer',
            });
            dom.videoPlayerMinimap.insertBefore(dom.currentTripNarrative);

            dom.mapContainer.css({
                border: '3px solid #ffffff',
                width: '100%',
                height: '60%',
                float: 'left',
                position: 'relative'
            });
            dom.mapContainer.insertAfter($('#trip-wordcloud'));
            
            resizeMap(getCurrentMap());
            resizeMap(currentMap);
            disableInteraction();
        }
    });
}

function enableInteraction () {
    currentMap.dragging.enable();
    currentMap.touchZoom.enable();
    currentMap.doubleClickZoom.enable();
    currentMap.scrollWheelZoom.enable();
    currentMap.boxZoom.enable();
    currentMap.keyboard.enable();
    return;
}

function disableInteraction () {
    currentMap.dragging.disable();
    currentMap.touchZoom.disable();
    currentMap.doubleClickZoom.disable();
    currentMap.scrollWheelZoom.disable();
    currentMap.boxZoom.disable();
    currentMap.keyboard.disable();
    return;
}