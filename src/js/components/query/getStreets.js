export default function (dbname, collectionName) {

    let result = [],
        url = '/getAllStreets/' + dbname + '/' + collectionName + '/';

    $.ajaxSetup({ 'async': false });
    $.get(url)
        .done(function (data) {
            result = data;
        })
        .fail(function (error) {
            alert(error);
        });
    $.ajaxSetup({ 'async': true });

    return result;
}