export function selectList (roiIndex, lists) {
    // Reset all selection colors
    $('.region-header').css({'background': '#f0f0f0'});
    $('.list-container').css({'background': 'none'});
    lists.forEach(listIndex => {
        $('#region-' + roiIndex + '-' + listIndex).css({'background': '#ffeda0'});
    })
    return;
}

export function selectRoi (roiIndex) {
    $('.region-header').css({'background': '#f0f0f0'});
    $('.list-container').css({'background': 'none'});
    $('#region-' + roiIndex).css({'background': '#ffeda0'});
    return;
}