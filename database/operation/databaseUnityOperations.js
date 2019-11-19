'use strict' ;

const databaseUnityOperations = module.exports = {} ;
const mongoose = require( 'mongoose' ) ;
const config = require( 'config' ) ;
const assert = require( 'assert' ) ;
const appRoot = require( 'app-root-path' ) ;

const DATABASE_CONNECTION_ERROR = 'Database Connection Error' ;

var databaseConnection = null ;

databaseUnityOperations.connect = () => {

    let url = config.get( 'database.dbURLPrefix' ) + config.get( 'database.username' ) + ':' +
        config.get( 'database.password' ) + '@' + config.get( 'database.host' ) + '/' +
        config.get( 'database.database' ) ;

    if( !databaseConnection || !databaseConnection.serverConfig.isConnected() ) {

        console.log( '|| ..... Connecting to mongodb server..... ||' ) ;

        mongoose.connect( url, { useNewUrlParser: true, useCreateIndex: true }, ( error, connection ) => {

            assert.equal( null, error ) ;

            console.log( '|| ..... Connected to mongodb server..... ||' ) ;

            databaseConnection = connection ;

            require( 'require-all' )( appRoot + '/database/schema/' ) ;

        } ) ;
    }

} ;

databaseUnityOperations.findOne = ( collection, query, callBack ) => {

    if( databaseConnection ) {

        databaseConnection.model( collection ).findOne( query, ( error, result )  => {

            return callBack( error, result ) ;

        } ) ;

    }
    else return callBack( true, { message: DATABASE_CONNECTION_ERROR } ) ;

} ;

databaseUnityOperations.save = ( collection, data, callBack ) => {

    if( databaseConnection ) {

        new ( databaseConnection.model( collection ) )( data ).save( ( error, result ) =>  {

            return callBack( error, result ) ;

        } ) ;
    }
    else return callBack( true, { message: DATABASE_CONNECTION_ERROR } ) ;

} ;

databaseUnityOperations.aggregate = ( collection, query, callBack ) => {

    if( databaseConnection ) {

        databaseConnection.model( collection ).aggregate( query ).exec( ( error, result ) => {

            return callBack( error, result ) ;

        } ) ;

    }
    else return callBack( true, { message: DATABASE_CONNECTION_ERROR } ) ;

} ;

databaseUnityOperations.close = () =>  {

    if( databaseConnection ) databaseConnection.close(  ) ;

    console.log( '|| ..... Database Connection Closed ..... ||' ) ;

    databaseConnection = null ;
} ;

