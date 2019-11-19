'use strict' ;

const mongoose = require( 'mongoose' ) ;

const mongooseIncrement = require( 'mongoose-increment' ) ;

const common = module.exports = {} ;

common.increment = mongooseIncrement( mongoose ) ;

common.schemaFields = {} ;

common.schemaFields.requiredString = { type: String, required: true } ;

common.schemaFields.requiredUniqueString = { type: String, required: true, unique:true, sparse: true } ;

common.enums = {} ;

common.enums.ACCESS_TYPE = [ 'Admin', 'Cashier','Waiter','Visitor'] ;