import * as AuthRoutes from "client/routes/authentication-routes";
import * as config from "config";
import { Context } from "graphql-api/context";
import { buildContext } from "./context";

const baseUrl = `${config.get<string>("server.protocol")}://${config.get<
  string
>("server.publicHost")}`;
const clientSamlUrl = baseUrl + AuthRoutes.SAML_CALLBACK;
const clientSamlLogoutCallback = baseUrl + AuthRoutes.SAML_LOGOUT_CALLBACK;

export function createContext(req: any, res: any, next: any) {
  if (req.user) {
    const context = buildContext({ userId: req!.user.userId });
    req.context = context;
  } else {
    req.context = new Context();
  }
  return next();
}

export async function ensureAuthenticatedAndSetStatus(
  req: any,
  res: any,
  next: any
) {
  try {
    if (req.isAuthenticated()) {
      const user = await req.context!.repos.users.findById.load(
        req!.user.userId
      );
      if (!user) {
        req.logout();
        res.status(403);
        return res.send({
          error: "User authenticated but does not exist in database",
        });
      }

      return next();
    } else {
      res.status(403);
      res.send({ error: "User not authenticated." });
    }
  } catch {
    try {
      req.logout();
    } catch {
      res.status(403);
      return res.send({
        error: "Cannot logout",
      });
    }
    res.status(403);
    return res.send({
      error: "Unknown Error",
    });
  }
}

export function ensureAuthenticatedAndRedirect(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next();
  }
  // No user, redirect to login.
  return res.redirect(AuthRoutes.LOGIN);
}

export interface UserSession {
  userId: number;
}
