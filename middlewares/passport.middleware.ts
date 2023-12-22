import {
  Strategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import { CustomError } from "../constructors/error.constructor";
import { PassportStatic } from "passport";
import { Identification } from "../types/services/user.service.types";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_SECRET,
};

export const applyPassportStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      options,
      async (data: Identification, done: VerifiedCallback) => {
        try {
          if (data._id) return done(null, data);

          return done(null, false);
        } catch (e) {
          throw new CustomError("Token", "Invalid token", 401);
        }
      }
    )
  );
};
