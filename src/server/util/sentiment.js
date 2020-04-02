import Sentiment from 'sentiment';

/**
 * Calculate sentiment score
 * @param {String} narrative 
 */
export default function (narrative)
{
    let sentiment  = new Sentiment();
    let score = sentiment.analyze(narrative).score;

    return score;
}