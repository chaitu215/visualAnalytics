import {dom} from '../../component';
import {enableMenu, resetMenu, update, resetSelection} from '../../../main/geovisuals';
/**
 * Set all menu options
 */
export default function () {

    // Trip radio input events
    dom.tripOptionInput.on('click', (e) => {
        e.stopPropagation();

        if (dom.tripVideoOption.is(':checked')) {
            resetAllMenuItem();
            enableMenu('videoPlayer');
            dom.videoPlayer.show();
            update();
            return;
        }

        if (dom.tripSegnetOption.is(':checked')) {
            resetAllMenuItem();
            enableMenu('segnetPlayer');
            dom.segnetPlayer.show();
            update();
            return;
        }
    });

    // Spatial radio input events
    dom.spatialOptionInput.on('click', (e) => {
        e.stopPropagation();
        // Semantic Bubble
        if (dom.bubbleOption.is(':checked')) {
            resetAllMenuItem();
            enableMenu('semanticBubble');
            dom.semanticBubble.show();
            update();
            return;
        }
        // Sentiment chart
        if (dom.sentimentOption.is(':checked')) {
            resetAllMenuItem();
            enableMenu('sentimentChart');
            dom.sentimentChart.show();
            update();
            return;
        }
        // Keyword tree
        if (dom.treeOption.is(':checked')) {
            resetAllMenuItem();
            enableMenu('keywordTree');
            dom.keywordTree.show();
            update();
            return;
        }

    });

    return;
}

/**
 * Set all menu item to false
 */
export function resetAllMenuItem () {
    resetMenu();
    resetSelection();
    //$('.data-header').removeClass('select');
    // Hide all container
    dom.videoPlayer.hide();
    dom.segnetPlayer.hide();
    dom.semanticBubble.hide();
    dom.sentimentChart.hide();
    dom.keywordTree.hide();
    return;
}