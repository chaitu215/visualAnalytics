import { set_video_flying_text } from '../../main/geovisuals';
import {setModeInput, setUnitInput, setSDPToggle, setMenuItems, 
        setMapLayerButton} from '../ui';
/**
 * Initialize ui events
 */
export default function () {

    $('#video-flying-text').off().on('click', () => {
        //console.log('df')
        $('#video-flying-text').toggleClass('select');

        if ($('#video-flying-text').hasClass('select')) {
            $('#video-flying-text').css({ background: '#313695' });
            set_video_flying_text(true);
        } else {
            $('#video-flying-text').css({ background: '#a50026' });
            set_video_flying_text(false);
            $('.flying-text').remove();
        }
    });

    setModeInput();
    setSDPToggle();
    setMenuItems();
    setUnitInput();

    // Add map layer button events
    setMapLayerButton();

    return;
}