import {dom} from '../../ui';
import {addJSlider, videoIndex} from '../../component';
import { update, modes, getCurrentTrip } from '../../../main/geovisuals';

export default function () {
    dom.sdpToggleBtn.on("click", function (e) {
        // Stop overlap ui elements
        e.stopPropagation();
        dom.sdpToggleBtn.toggleClass("active");
        if (dom.sdpToggleBtn.hasClass("active")) {
            dom.visContainer.css({ width : "calc(100% - 45%)" });
            dom.sdpContainer.css({ width: "30%" });
            modes.showSDPs = true;
            //update();
        } else {
            dom.visContainer.css({ width: "calc(100% - 15%)" });
            dom.sdpContainer.css({ width: "0%" });
            modes.showSDPs = false;
            //update();
        }
    });

    $(".detail-view").on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', 
    function() {
        //doSomething
        addJSlider(getCurrentTrip(), videoIndex);
    });

    return;
}