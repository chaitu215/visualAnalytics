export default function (roiIndex, listIndex) {
    $('.region-header').css({'background': '#f0f0f0'});
    $('.list-container').css({'background': 'none'});
    $('#region-' + roiIndex + '-' + listIndex).css({'background': '#ffeda0'});
    return;
}