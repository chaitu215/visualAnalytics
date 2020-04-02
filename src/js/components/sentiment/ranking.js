import { analyzeSentiment, sentimentOption } from './index';
/**
 * create word sentiment ranking table
 * @param {*} container 
 * @param {*} keywords 
 * @param {*} points 
 * @param {*} narratives 
 */
export default function (keywords, points, narratives) 
{   
    // find top 10 sentiment keywords
    return rank(keywords, narratives, 10);

    function rank (keywords, narratives, top) {
        
        var result = [];
        var index = 0;
        // extract keywords and stroe it
        keywords.forEach( keyword => {
            for (var i = 0; i < keyword.length; ++i) {
                var word = keyword[i];
                var score = analyzeSentiment(word, sentimentOption).score;
                // position of existing keyword
                var pos = result.map( x => {
                    return x.word;
                }).indexOf(word);

                if (pos === -1 ) {
                    result.push(createItem( word, 
                                            score, 
                                            narratives[index], 
                                            points[index]))
                } else {
                    result[pos].narratives.push(narratives[index]); 
                    result[pos].points.push(points[index]);
                    result[pos].freq++;
                }
            }
            index++;
        });

        // sort sentiment score
        result.sort( function (a,b) {
            return b.score - a.score;
        });
        // return both positive and negative value
        return {
            positive: result.slice(0, top),
            negative: result.slice(1).slice(-top).reverse()
        }
    } 

    function createItem (word, score, narrative, point) {
        var item = {
            word: word,
            score: score,
            freq: 1,
            narratives: [],
            points: []
        }
        item.narratives.push(narrative);
        item.points.push(point);
        return item;
    }
}