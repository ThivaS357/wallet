'use strict' ;

const commonAPIs = module.exports = {} ;

const auth = require( '../helpers/auth' ) ;

const resp = require( '../helpers/response' ) ;

const httpStatus = require( 'http-status-codes' ) ;

const common = require( '../../database/schema/helpers/common' ) ;

const config = require( 'config' ) ;

commonAPIs.initialHandshake = ( request, response ) => {

    let accessCode = auth.generateRandomString() ;

    let visitorToken = auth.issueToken(
        request.body.deviceId,
        common.enums.ACCESS_TYPE[ 2 ],
        accessCode,
        config.get( 'token.visitorExpireTime' )
    ) ;

    resp.send( response, httpStatus.OK, false,{ token: visitorToken } ) ;

} ;