import { sentimentOption } from '../index';
/**
 * Remove all modified sentiment keywords
 */
export default function () {
    return sentimentOption.extras = {};
}