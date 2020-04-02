import Sentiment from 'sentiment';
import { dom } from './component';

export default function (trips) {
    let result = [];
    
    trips.forEach( trip => {
        for (let i = 0, len = trip.keywords.length; i < len; ++i) {
            let keywords = trip.keywords[i];
            if (keywords.length > 0) {
                keywords.forEach( keyword => {
                    let pos = result.map( x => {
                        return x.word;
                    }).indexOf(keyword);

                    if (pos === -1) {
                        let sentiment  = new Sentiment();
                        var score = sentiment.analyze(keyword).score;
                        let item = {
                            word: keyword,
                            score: score
                        }
                        result.push(item);
                    }
                });
            }
        }
    });

    var r = () => {
        // Need to add webpack config here.
        console.log(r.pos)
    };

    result.sort( function (a,b) {
        return b.score - a.score;
    });

    dom.visContainer.css({ width : "calc(100% - 45%)" });
    dom.sdpContainer.css({ width: "30%" });

    $('.detail-view').empty();
    let table = $('<table/>').css({
        width: '100%',
        height: '100%',
        'overflow': 'auto'
    });

    let body = $('<tbody/>');
    result.forEach( d => {
        let tr = $('<tr/>').css({
            'border-bottom': '1px solid #000'
        }).html('<td>' + d.word + '</td><td>' + d.score + '</td>');
        body.append(tr);
    });
    
    table.append(body);
    $('.detail-view').append(table);
    return;
}