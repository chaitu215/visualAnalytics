import Sentiment from 'sentiment';
import { sentimentOption } from './index';

/**
 * Analyze sentiment result
 * @param {string} text - can be sentences or only one keywords
 */
export default function (text)
{
    let sentiment = new Sentiment();
    let result = sentiment.analyze(text, sentimentOption);
    return result;
}