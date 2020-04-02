/**
 * Create gallery with bootstrap modals
 * Image is based on keywords
 * (c) 2019, Suphanut Jamonnak
 */

import { default as dom } from './ui-element';
import { default as update } from './update';
/**
 * 
 * @param {Array} keywords 
 * @param {Array of Objects} trips 
 */
export default function (keywords) {

    // UI event
    setImageOptionButtons(keywords);
    setGroupByRadio(keywords);
    reset();
    return;
}

function setImageOptionButtons (keywords) {
    
    dom.originalBtn.off().on('click', () => {
        clearImageOptions();
        imageOptions.original = true;
        setSelectOptions(dom.originalBtn);
        update(keywords);
    });

    dom.customBtn.off().on('click', () => {
        clearImageOptions();
        imageOptions.custom = true;
        setSelectOptions(dom.customBtn);
        update(keywords);
    });

    dom.grayscaleBtn.off().on('click', () => {
        clearImageOptions();
        imageOptions.grayscale = true;
        setSelectOptions(dom.grayscaleBtn);
        update(keywords);
    });

    return;
}

function setGroupByRadio (keywords) {
    
    dom.groupByInput.off().on('click', function (e) {
        e.stopPropagation();
        if (dom.dateGroup.is(':checked')) {
            groupBy.date = true;
            groupBy.street = false;
            update(keywords);
            return;
        }
        if (dom.streetGroup.is(':checked')) {
            groupBy.date = false;
            groupBy.street = true;
            update(keywords);
            return;
        }
    });
    return;
}

export let imageOptions = {
    original: true,
    custom: false,
    grayscale: false
};

export let groupBy = {
    date: true,
    street: false
}

function reset () {
    Object.keys(imageOptions).forEach(opt => imageOptions[opt] = false);
    imageOptions.original = true;
    groupBy.date = true;
    groupBy.street = false;
    $('.image-mode').removeClass('selected');
    dom.originalBtn.addClass('selected');
    dom.dateGroup.click();
    return;
}

function clearImageOptions () {
    Object.keys(imageOptions).forEach(opt => imageOptions[opt] = false);
    return;
}

function setSelectOptions (button) {
    $('.image-mode').removeClass('selected');
    button.addClass('selected');
    return;
}