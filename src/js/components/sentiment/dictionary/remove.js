import { sentimentOption } from '../index';
/**
 * Remove keyword from sentiment options
 * if its existed
 * @param {string} keyword - object key 
 */
export default function (keyword) 
{
    if (keyword in sentimentOption.extras) {
        delete sentimentOption.extras[keyword];
    }
    return;
}