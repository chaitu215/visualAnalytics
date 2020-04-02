export default function (dbname)
{
    let result = [],
        url = '/listCollection/' + dbname + '/';

    $.ajaxSetup({ 'async': false });
    $.get(url)
        .done(function (data) {
            result = data;
        })
        .fail(function (error) {
            alert(dbname + ' database is not connected.\nError:' + error);
        });
    $.ajaxSetup({ 'async': false });

    return result;   
}