import { default as dom } from './dom';
import { map, default as addMap } from '../addMap';
import { resizeMap } from '../../../component';
import { default as addGSV } from '../addGsv';
import {currentLocation} from './showSdps';


export default function () {

    dom.gsvButton.off().on('click', () => {
        dom.gsv.css({ display: 'block' });
        dom.map.css({ display: 'none' });
        dom.gsvButton.css({ color: 'red' });
        dom.mapButton.css({ color: 'black' });
        addGSV(currentLocation);
    });

    dom.mapButton.off().on('click', () => {
        dom.map.css({ display: 'block' });
        dom.gsv.css({ display: 'none' });
        dom.mapButton.css({ color: 'red' });
        dom.gsvButton.css({ color: 'black' });
        resizeMap(map);
        addMap(currentLocation);
    });

    return;
}