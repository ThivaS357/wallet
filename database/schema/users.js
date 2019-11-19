'use strict' ;

const users = module.exports = {} ;

const mongoose = require( 'mongoose' ) ;

const timestamps = require( 'mongoose-timestamp' ) ;

const common = require( './helpers/common' ) ;

const collectionName = 'users' ;

const usersSchema = new mongoose.Schema(
    {
        mobileCountryCode: common.schemaFields.requiredString,

        mobileNumber: common.schemaFields.requiredString,

        deviceId: common.schemaFields.requiredString,

        newDeviceId: {
            type: String,
            default: null
        },

        codeOTP: common.schemaFields.requiredString,

        codeOTPTime: {
            type: Date,
            required: true
        },

        codeOTPType: {
            type: Number,
            min: 1, // account Login
            max: 2  // mobile No Change
        },

        token: String,

        tokenTime: Date,

        activeStatus: {
            type: Boolean,
            default: false
        },

        blockStatus: {
            type: Boolean,
            default: false
        },

        accessCode: String,

        userName: String,

        profilePicture: String,

        fcmTopic: String,

        fcmTopicTime: Date

    }
) ;

usersSchema.plugin( timestamps ) ;

const usersModel = mongoose.model( 'users', usersSchema ) ;

users.model = usersModel ;
users.collectionName = collectionName ;