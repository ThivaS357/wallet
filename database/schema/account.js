'use strict' ;

const accounts = module.exports = {} ;

const mongoose = require( 'mongoose' ) ;

const timestamps = require( 'mongoose-timestamp' ) ;

const collectionName = 'accounts' ;

const accountSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            default: 0.0
        },
        promotionalBalance: {
            type: Number,
            default: 0.0
        },
        promotionExprDate: {
            type: Date,
            default: null
        },
        promotionApplied: {
            type: Number,
            default: 1
        } // 0 no promo, 1 welcome promo, 2 salt promo
    }
) ;

accountSchema.plugin( timestamps ) ;

const usersModel = mongoose.model( collectionName, accountSchema ) ;

accounts.model = usersModel ;
accounts.collectionName = collectionName ;