import {drawWordcloud} from '../../vis';
import {prepareKeywords} from '../../utils';

export default function (div, data) {
    
    let count = 0;
    // count narrative
    data.narratives.forEach(function (narrative) {
        if (narrative !== 'none') {
            count++;
        }
    });

    let narrativeBtn = $('<button/>', {
        'title': 'show all words',
        'type': 'button',
        'class': 'narrativeBtn float-right',
    }).html('<i class="fa fa-comments" aria-hidden="true" style="color: #fff;"></i>&nbsp;&nbsp' + count);

    // Narrative btn on click
    narrativeBtn.on('click', function (e) {
        e.stopPropagation();
        div.toggleClass('narratives');
        if (div.hasClass('narratives')) {
            // Get wordcloud
            let wordcloud = getNarrativeWordCloud(div.attr('id'));
            // Add wordcloud div under data container
            div.after(wordcloud);

            // Need to add this
            let keywords = prepareKeywords(data.keywords);
            drawWordcloud(wordcloud, keywords, '#000');

        } else {
            $('#' + div.attr('id') + '-narratives').remove();
            console.log('remove narrative');
        }
    });

    return div.append(narrativeBtn)
}

function getNarrativeWordCloud (id) {
    let div = $('<div/>', {
        id: id + '-narratives'
    });
    div.css({
        width: '100%',
        height: '100px',
        border: '1px solid #000',
    });
    return div;
}