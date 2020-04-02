import { layers, getKeywordCollections } from '../component';
import { getCurrentMap } from '../../main/geovisuals';
import { default as showGallery } from './create';

/**
 * create select keywords
 * @param {*} keywords 
 */
export default function (keywords, colors) {

    let map = getCurrentMap();
    //let keywords = getKeywordCollections();


    // Clear keywords selection
    layers.currentKeywords.remove();
    layers.currentKeywords.onAdd = function (map) {
        // Create container
        var div = L.DomUtil.create('div', 'info legend');
        $(div).html('<strong> Selected Keywords </strong>');

        for (var i = 0; i < keywords.length; ++i) {
            var keyword = keywords[i];
            var color = colors[i];

            var keywordContainer = $('<div/>').css({
                width: '100%',
                cursor: 'pointer',
                color: '#000',
                background: color,
                border: '1px solid #000',
                'border-radius': '2px',
                'padding-left': '5px',
                'font-weight': 'bold',
                'margin-bottom': '2px'
            }).html(keyword);
            
            $(div).append(keywordContainer);
        }
        
        let GalleryButton = getGalleryButton(keywords);
        $(div).append(GalleryButton);
        
        return div;
    }

    layers.currentKeywords.addTo(map);

    function getGalleryButton (keywords) {
        let button = $('<button/>', {
            type: 'button',
            'data-toggle': 'modal',
            'data-target': '#gallery-modal'
        }).css({
            'margin-top': '5px'
        }).html('<i class="fa fa-picture" aria-hidden"true"></i> Gallery By Keywords');

        button.on('click', function () {
            showGallery(keywords);
        });

        return button;
    }

    return;
}