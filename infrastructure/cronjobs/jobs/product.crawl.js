const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

module.exports = function (agenda) {
    agenda.define("crawlProduct", async () => {
        $.post( "/category-api",{ storeId: "601974473bb314a8f475e723" }, function( data ) {
            console.log(data);
          });
    });
};