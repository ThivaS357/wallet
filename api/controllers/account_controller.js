'use strict' ;

const accountAPIs = module.exports = {} ;

const resp = require( '../helpers/response' ) ;

const httpStatus = require( 'http-status-codes' ) ;

const accountCollection = require('../../database/schema/account').collectionName ;

const accountModel = require( '../../database/schema/account' ).model ;

const unityOperation = require('../../database/operation/databaseUnityOperations') ;

const config = require( 'config' ) ;

const mongoose = require( 'mongoose' ) ;

const NO_PROMO = 0 ;

const WELCOME_PROMO = 1 ;

const SALTSIDE_PROMO = 2 ;

const MINIMUM_RELOAD_AMMOUNT_FOR_PROMO = 50 ;

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

accountAPIs.reload = ( request, response ) => {
    unityOperation.findOne(
        accountCollection,
        { _id: new mongoose.Types.ObjectId( request.swagger.params.id.value ) },
        ( error, account ) => {
            if( error ){
                resp.send( response, httpStatus.INTERNAL_SERVER_ERROR, error ) ;
            }
            else if( !account ){
                resp.send( response, httpStatus.NOT_FOUND, error ) ;
            }
            else{
                if( ( account.promotionApplied === WELCOME_PROMO ) &&
                    ( request.body.amount > MINIMUM_RELOAD_AMMOUNT_FOR_PROMO ) ) {

                    account.promotionalBalance = 20;
                    account.promotionApplied = NO_PROMO ;
                    account.promotionExprDate = +new Date() + 30 * 24 * 60 * 60 * 1000 ;

                }
                else if( ( account.promotionApplied === SALTSIDE_PROMO ) &&
                    ( request.body.amount > MINIMUM_RELOAD_AMMOUNT_FOR_PROMO ) ) {

                    account.promotionalBalance = request.body.amount * 0.1 ;
                    account.promotionApplied = NO_PROMO ;
                    account.promotionExprDate = +new Date() + 30 * 24 * 60 * 60 * 1000 ;

                }

                account.balance = account.balance + request.body.amount ;

                if( account.promotionExprDate && ( account.promotionExprDate <= new Date() ) )
                    account.promotionExprDate = null ;


                account.save( ( error, savedAccount ) => {
                    if( error ){
                        resp.send( response, httpStatus.INTERNAL_SERVER_ERROR, error ) ;
                    }
                    else {
                        resp.send( response, httpStatus.OK, null, { data: savedAccount } );
                    }
                } ) ;
            }
        }
    ) ;
} ;

accountAPIs.useMoney = ( request, response ) => {
    unityOperation.findOne(
        accountCollection,
        { _id: new mongoose.Types.ObjectId( request.swagger.params.id.value ) },
        ( error, account ) => {
            if (error) {
                resp.send( response, httpStatus.INTERNAL_SERVER_ERROR, error ) ;
            }
            else if( !account ){
                resp.send( response, httpStatus.NOT_FOUND, error ) ;
            }
            else{
                if( account.promotionExprDate <= new Date() ) {
                    account.promotionExprDate = null ;
                    account.promotionalBalance = 0 ;
                }

                let message = config.get( 'response.reduced') ;
                if( ( account.balance + account.promotionalBalance ) < request.body.reduction ) {
                    message = config.get( 'response.lowBalance' ) ;
                }

                else {
                    let reduction = request.body.reduction ;

                    if( account.promotionalBalance  >= reduction ) {
                        account.promotionalBalance = account.promotionalBalance - reduction ;
                        reduction = 0 ;
                    }
                    else {
                        reduction = reduction - account.promotionalBalance ;
                        account.promotionalBalance = 0 ;
                    }

                    if( account.promotionalBalance === 0 ) account.promotionExprDate = null ;

                    account.balance = account.balance - reduction ;
                }

                account.save( ( error, savedAccount ) => {
                    if( error ){
                        resp.send( response, httpStatus.INTERNAL_SERVER_ERROR, error ) ;
                    }
                    else {
                        resp.send( response, httpStatus.OK, null, { data: savedAccount, message: message } );
                    }
                } ) ;
            }
        } ) ;
} ;

accountAPIs.get = ( request, response ) => {
    unityOperation.findOne(
        accountCollection,
        { _id: new mongoose.Types.ObjectId( request.swagger.params.id.value ) },
        ( error, account ) => {
            if (error) {
                resp.send(response, httpStatus.INTERNAL_SERVER_ERROR, error);
            } else if (!account) {
                resp.send(response, httpStatus.NOT_FOUND, error);
            } else {
                if( account.promotionExprDate <= new Date() ) {
                    account.promotionExprDate = null ;
                    account.promotionalBalance = 0 ;
                }

                account.save( ( error, savedAccount ) => {
                    if( error ){
                        resp.send( response, httpStatus.INTERNAL_SERVER_ERROR, error ) ;
                    }
                    else {
                        resp.send( response, httpStatus.OK, null, { data: savedAccount } );
                    }
                } ) ;


            }
        } ) ;
} ;

accountAPIs.applyPromo = ( request, response ) => {
    unityOperation.findOne(
        accountCollection,
        { _id: new mongoose.Types.ObjectId( request.swagger.params.id.value ) },
        ( error, account ) => {
            if (error) {
                resp.send(response, httpStatus.INTERNAL_SERVER_ERROR, error);
            } else if (!account) {
                resp.send(response, httpStatus.NOT_FOUND, error);
            } else {
                if( request.swagger.params.type.value === SALTSIDE_PROMO ) {
                    account.promotionApplied = SALTSIDE_PROMO ;

                    account.save( ( error, savedAccount ) => {
                        if( error ){
                            resp.send( response, httpStatus.INTERNAL_SERVER_ERROR, error ) ;
                        }
                        else {
                            resp.send( response, httpStatus.OK, null, { data: savedAccount } );
                        }
                    } ) ;

                }
                else{
                    resp.send( response, httpStatus.NOT_ACCEPTABLE, error ) ;
                }
            }
        } ) ;
} ;