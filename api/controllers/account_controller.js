'use strict' ;

const accountAPIs = module.exports = {} ;

const resp = require( '../helpers/response' ) ;

const httpStatus = require( 'http-status-codes' ) ;

const accountCollection = require('../../database/schema/account').collectionName ;

const accountModel = require( '../../database/schema/account' ).model ;

const unityOperation = require('../../database/operation/databaseUnityOperations') ;

const config = require( 'config' ) ;

accountAPIs.create = ( request, response ) => {

    let account = new accountModel( request.body ) ;

    account.save( ( error, savedAccount ) => {
        if( error ){
            resp.send( response, httpStatus.INTERNAL_SERVER_ERROR, error ) ;
        }
        else {
            resp.send( response, httpStatus.OK, null, { data: savedAccount } );
        }
    } ) ;
} ;