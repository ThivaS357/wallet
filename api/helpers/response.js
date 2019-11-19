'use strict' ;

const response = module.exports = {} ;
const httpStatus = require( 'http-status-codes' ) ;

response.send = ( response, statusCode, error, data ) => {

    if( error ) console.log( error ) ;
    data = data ? data : {} ;
    data.statusMessage = httpStatus.getStatusText( statusCode ) ;

    response.status( statusCode ).send( data ) ;

} ;