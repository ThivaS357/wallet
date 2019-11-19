'use strict' ;

const should = require('should' ) ;
const request = require('supertest' ) ;
const server = require('../../../app' ) ;

describe( 'controllers', function() {

    describe( 'common_controller', function() {

        describe( 'POST /handshake', function() {

            it( 'Should return a Bearer Visitor Token', function(done) {

                request( server )
                    .post( '/handshake' )
                    .set( 'Accept', 'application/json' )
                    .send( { deviceId:'20867A57-0222-44CB-9828-FEA49F89B16D' } )
                    .expect( 'Content-Type', /json/ )
                    .expect(200 )
                    .end(function ( err, res ) {
                        should.not.exist( err ) ;
                        res.body.should.have.property( 'token' ) ;
                        done() ;
                    } ) ;
            } ) ;

        } ) ;

    } ) ;

} ) ;

