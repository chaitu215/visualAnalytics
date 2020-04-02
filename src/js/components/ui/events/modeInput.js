import {setAnalysisMode, update, setRoiIndex, enableMenu} from '../../../main/geovisuals';
import {dom} from '../../ui';
import { resetAllMenuItem } from './menuInput';

export default function () {
    dom.modeInput.on('click', function (e) {
        e.stopPropagation();

        // Check analysis mode
        if (dom.tripMode.is(':checked')) {
            setAnalysisMode('trip');
            // Hide units
            dom.unitsContainer.hide();
            dom.roiContainer.css({'height': '45%'});
            // Enable all trip menu
            enableTripMenu();
        } else {
            setAnalysisMode('spatial');
            // Show units
            dom.unitsContainer.show();
            dom.roiContainer.css({'height': '35%'});
            // Enable all spatial menu
            enableSpatialMenu();
        }

        // update current geovisual system
        // Set roi back to 1 when change mode
        setRoiIndex(1);
        update();
        return;
    });
}

// Set default visualization
export function enableTripMenu () {

    dom.spatialMenus.hide();
    dom.tripMenus.show();

    //dom.semanticMenu.hide();
    //dom.sentimentMenu.hide();
    //dom.keywordTreeMenu.hide();
    //dom.videoMenu.show();
    //dom.segnetMenu.show();
    // Set video player as default
    resetAllMenuItem();
    enableMenu('videoPlayer');
    //dom.videoMenu.addClass('select');
    dom.videoPlayer.show();
    return;
}

// Set default visualization 
export function enableSpatialMenu () {

    dom.spatialMenus.show();
    dom.tripMenus.hide();

    // dom.semanticMenu.show();
    // dom.sentimentMenu.show();
    // dom.keywordTreeMenu.show();
    // dom.videoMenu.hide();
    // dom.segnetMenu.hide();
    // Set video player as default
    resetAllMenuItem();
    enableMenu('semanticBubble');
    //dom.semanticMenu.addClass('select');
    dom.semanticBubble.show();
    return;
}