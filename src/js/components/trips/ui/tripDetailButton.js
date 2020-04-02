import {default as intializeCompare} from '../compare/init';
import { minimap } from '../map/showMinimap';
import { resizeMap } from '../../component';

export default function ()
{
    $('#trip-detail-btn').off().on('click', () => {

        //$('#trip-wordcloud').toggleClass("hide");
        $('#trip-detail-container').toggleClass("hide");

        if ( /*$('#trip-wordcloud').hasClass('hide') &&*/ $('#trip-detail-container').hasClass('hide')) {
            //$('#trip-wordcloud').hide();
            $('#trip-detail-container').hide();
            // resizeMap(minimap);
            //$('#equalizer').hide();
        } else {
            //$('#trip-wordcloud').show();
            $('#trip-detail-container').show();
            //$('#equalizer').show();
        }
    });

    $('#equalizer-btn').off().on('click', () => {
        $('#equalizer').toggleClass("show");

        if ($('#equalizer').hasClass('show')) {
            $('#equalizer').show();
        } else {
            $('#equalizer').hide();
        }
    });

    $('#compare-btn').off().on('click', () => {
        intializeCompare();
    });

    return;
}