import { default as dom } from './dom';
import { default as reinitialize } from '../init';

export default function (trips, indexes) {

    // default slider values
    var min = 0.25;
    var max = 1;
    var step = 0.05;
    var value = 0.25;

    // set slider range attributes
    dom.cellwidthSlider.attr('min', min);
    dom.cellwidthSlider.attr('max', max);
    dom.cellwidthSlider.attr('step', step);
    dom.cellwidthSlider.attr('value', value);

    // set value text
    dom.cellwidthValue.html('&nbsp;' + dom.cellwidthSlider.val() + ' miles');

    // set slider events
    dom.cellwidthSlider.off().on('input', function () {
        dom.cellwidthValue.html('&nbsp;' + dom.cellwidthSlider.val() + ' miles');
        reinitialize(trips, indexes);
    });

    return;
}