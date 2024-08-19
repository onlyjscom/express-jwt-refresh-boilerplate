import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { AuthService, JWT_SECRET_AT, JWT_SECRET_RT } from './service';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions as JwtStrategyOptions } from 'passport-jwt';
import { UsersService } from '../users';


const optsForAt: JwtStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_AT,
};

const optsForRt: JwtStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_RT,
    passReqToCallback: true,
};


passport.use('local', new LocalStrategy(
    { passReqToCallback: true, session: false }, async function(req, usernameRaw, password, done) {
        const lang = req.acceptsLanguages()[0].replace('*', '') || 'en';
        const username = req.body.username.toLocaleLowerCase(lang);

        try {
            const user = await AuthService.findUserFromCredentials(username, password);

            return done(null, user);
        } catch (e) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
    },
));

passport.use('jwt', new JwtStrategy(optsForAt, async function(jwtPayload, done) {
    try {
        const user = await UsersService.show(+jwtPayload.sub);

        return done(null, user);
    } catch (e) {
        return done(null, false);
    }
}));

passport.use('jwt-refresh', new JwtStrategy(optsForRt, async function(req, jwtPayload, done) {
    try {
        const user = await UsersService.show(+jwtPayload.sub);
        req.jwtPayload = jwtPayload;

        return done(null, user);
    } catch (e) {
        return done(null, false);
    }
}));


declare global {
    type AuthUser = import('../users').User;
    namespace Express {
        interface User extends AuthUser {
        }
    }
}
