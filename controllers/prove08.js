const https = require('https');

const ITEMS_PER_PAGE = 10; 

const renderIndex = (req, res, json) => {
    let searchedValue = req.body.searchValue || req.query.searchValue || ''; 
    let page = req.query.page || 1; 

    const indexStart = (page - 1) * ITEMS_PER_PAGE; 
    const indexEnd = page * ITEMS_PER_PAGE;

    const filteredData = global.jsonResponse.filter((x) =>
        x.name.toLowerCase().includes(searchedValue.toLowerCase())
    );

    res.render('../views/pages/prove08', {
        data: filteredData.slice(indexStart, indexEnd),
        path: 'proveAssignments/08',
        title: 'Prove 08',
        searchedValue: searchedValue,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < indexEnd,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    });
};

exports.processJson = (req, res, next) => {
    var url = 'https://byui-cse.github.io/cse341-course/lesson03/items.json';

    https
        .get(url, function (response) {
            var body = '';
            response.on('data', function (chunk) {
                body += chunk;
            });
            response.on('end', function () {
                global.jsonResponse = JSON.parse(body);
                renderIndex(req, res, global.jsonResponse);
            });
        })
        .on('error', function (e) {
            console.log('Got an error: ', e);
        });
};

exports.getIndex = (req, res, next) => {
    renderIndex(req, res, global.jsonResponse); // Render page.
};