import {dom} from '../../component';
import {enableMenu, menus} from '../../../main/geovisuals';
import {resetAllMenuItem} from './menuInput'

/**
 * Disable video menu and players
 */
export default function () {
    // Current in videoPlayer mode
    if (menus.videoPlayer) {
        // remove all menu
        resetAllMenuItem();
        enableMenu('semanticBubble');
        //dom.semanticMenu.addClass('select');
        dom.semanticBubble.show();
        dom.tripOptionInput.hide();
        return;
    } else {
        dom.tripOptionInput.hide();
        return;
    }
 }