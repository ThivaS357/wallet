'use strict';

const app = require( 'express' )() ;
const swaggerTools = require( 'swagger-tools' ) ;
const YAML = require( 'yamljs' ) ;
const cors = require( 'cors' ) ;
const morgan = require( 'morgan' ) ;
const appRoot = require( 'app-root-path' ) ;

process.env[ 'NODE_CONFIG_DIR' ] = appRoot + '/environment/' ;

const swaggerConfig = YAML.load('./api/swagger/swagger.yaml' ) ;

const databaseUnityOperations = require( './database/operation/databaseUnityOperations' ) ;

app.use( cors() ) ;

swaggerTools.initializeMiddleware( swaggerConfig, function ( middleware ) {

    app.use( middleware.swaggerMetadata() ) ;

    app.use( middleware.swaggerValidator( { options: [Object, Array, String, Number, Boolean] } ) ) ;

    app.use( function( error, request, response, next ) {

        let message = '' ;

        if ( error.code === 'SCHEMA_VALIDATION_FAILED' ) {

            if( error && error.results && error.results.errors ) {

                error.results.errors.forEach( function ( error ) {

                    message = 'Validation Error is : ' + error.message  + ' ' + error.path.toString() + '\n' ;

                } ) ;
            }

            error.stack = 'Result: ' + message + '\n' + error.stack ;
        }

        next( error ) ;

        if( error.stack ) {

            response.send( { validationError: message } ) ;

        }

    } ) ;

    const routerConfig = {
        controllers: './api/controllers',
        useStubs: false
    } ;

    app.use( middleware.swaggerRouter( routerConfig ) ) ;

    app.use( middleware.swaggerUi() ) ;

    app.use( morgan( 'combined' ) ) ;

    app.listen( 7100, function() {

        console.log( 'API Base server started on port 7100' ) ;

        databaseUnityOperations.connect() ;

    } ) ;

} ) ;

module.exports = app ;