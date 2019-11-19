'use strict' ;

const should = require('should' ) ;
const request = require('supertest' ) ;
const server = require('../../../app' ) ;

describe( 'controllers', function() {

    describe( 'account_controller', function() {

        describe( 'POST /accounts', function() {

            it( 'Should return saved account', function(done) {

                request( server )
                    .post( '/accounts' )
                    .set( 'Accept', 'application/json' )
                    .send( { name:'test' } )
                    .expect( 'Content-Type', /json/ )
                    .expect(200 )
                    .end(function ( err, res ) {
                        should.not.exist( err ) ;
                        done() ;
                    } ) ;


            } ) ;

            it( 'Should be a bad request', function(done) {

                request( server )
                    .post( '/accounts' )
                    .set( 'Accept', 'application/json' )
                    .expect(400 )
                    .end(function ( err, res ) {
                        done() ;
                    } ) ;


            } ) ;

        } ) ;

        /*describe( 'POST /accounts/{id}', function() {
            it( 'Should return saved account', function(done) {

            } ) ;
        } ) ;*/

    } ) ;

} ) ;