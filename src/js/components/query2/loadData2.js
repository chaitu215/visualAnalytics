export default function() {

    return new Promise (function(resolve, reject) {
        
        var url = '/getNewData/';

        $.ajaxSetup({ 'async': false });
        $.get(url)
            .done(function(data) {
                resolve(data);
            })
            .fail(function(error) {
                reject(error);
            });
        $.ajaxSetup({ 'async': true });
    });
}