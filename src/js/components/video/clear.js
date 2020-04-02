// Clear video garbage
export default function () {
    let garbage = document.getElementById('video-right');
    if (garbage) {
        garbage.pause();
        garbage.src="";
        garbage.load();
        $('#video-right').remove();
    }
    let garbage2 = document.getElementById('video-left');
    if (garbage2) {
        garbage2.pause();
        garbage2.src="";
        garbage2.load();
        $('#video-left').remove();
    }
}