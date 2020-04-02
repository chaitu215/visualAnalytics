export default function (roiIndex) {
    $('.region-header').css({'background': '#f0f0f0'});
    $('.list-container').css({'background': 'none'});
    $('#region-' + roiIndex).css({'background': '#ffeda0'});
    return;
}