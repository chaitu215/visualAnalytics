import { update, setSpatialUnit } from "../../../main/geovisuals";
import {dom} from '../../ui';

/**
 * Set spatial unit from radio button
 */
export default function () {
    dom.unitInput.on('click', function (e) {
        e.stopPropagation();
        
        // Check spitial units
        if (dom.streetUnit.is(':checked')) {
            // Set street spatial unit
            setSpatialUnit('street');
            update();
            return;
        }

        if (dom.regionUnit.is(':checked')) {
            // Set region spatial unit
            setSpatialUnit('region');
            update();
            return;
        }
    });

    return;
}