'use strict' ;

const jwt = require( 'jsonwebtoken' ) ;
const config = require( 'config' ) ;
const sharedSecret = config.get( 'token.sharedSecret' ) ;
const issuer = config.get( 'token.issuer' ) ;

const auth = module.exports = {} ;

auth.verifyToken =  ( request, authOrSecDef, bearer, callback )  => {

    let validateToken = ( decodedToken ) => {
        return ( decodedToken && decodedToken.role && ( accessibleRoles.indexOf( decodedToken.role ) !== -1 )
            && ( decodedToken.iss === issuer ) ) ;
    } ;

    const accessibleRoles = request.swagger.operation[ 'x-security-scopes' ] ;

    if ( bearer && bearer.indexOf( 'Bearer ' ) === 0) {

        let token = bearer.split( ' ' )[ 1 ] ;

        jwt.verify( token, sharedSecret, ( error, decodedToken ) => {
            if( !error && Array.isArray(accessibleRoles) &&  validateToken( decodedToken ) )
            {
                request.auth = decodedToken ;
                return callback(null) ;
            }
            else {
                return callback( request.res.status(403).json( { message: 'Error: Access Denied' } ) ) ;
            }
        } ) ;

    }

} ;

auth.issueToken = ( user, role, accessCode, expiresIn ) => {

    let options = {} ;

    if( expiresIn ) options.expiresIn = expiresIn ;

    return jwt.sign(
        {
            sub: user,
            iss: issuer,
            role: role,
            accessCode: accessCode
        },
        sharedSecret,
        options
    ) ;
} ;

auth.generateRandomString = () => {

   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) ;

} ;


auth.generateOTP = ( length )  => {

    let digits = '0123456789' ;

    let OTP = '';

    for ( let i = 0 ; i < length ; i++ ) {

        OTP += digits[ Math.floor( Math.random() * 10 ) ] ;

    }

    return OTP ;

} ;