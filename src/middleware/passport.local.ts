import { prisma } from "config/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserSumCart,
  getUserWithByRole,
} from "services/client/auth.service";
import { comparePassword } from "services/user.service";

const configPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async function verify(req, username, password, callback) {
        const { session } = req as any;
        if (session?.messages?.length) {
          session.messages = [];
        }
        console.log(">>>>check username/password: ", username, password);
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (!user) {
          // throw Error(`Username: ${username} not found`);
          return callback(null, false, {
            message: `Username/Pasword invalid`,
          });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          // throw Error(`Invalid password`);
          return callback(null, false, { message: `Invalid password` });
        }

        return callback(null, user as any);
      }
    )
  );

  passport.serializeUser(function (user: any, callback) {
    callback(null, { id: user.id, username: user.username });
  });

  passport.deserializeUser(async function (user: any, callback) {
    const { id, username } = user;
    const userInDB: any = await getUserWithByRole(id);
    const sumCart = await getUserSumCart(id);
    console.log(">>> Check sum: ", sumCart);
    return callback(null, { ...userInDB, sumCart });
  });
};
export { configPassportLocal };
