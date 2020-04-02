import { sentimentOption } from '../index';

/**
 * Add modified sentiment score if
 * keyword is not existed in current options
 * @param {string} keyword - object key
 * @param {integer} score - between -5 to 5 
 */
export default function (keyword, score) 
{
    return sentimentOption.extras[keyword] = parseInt(score);
}
