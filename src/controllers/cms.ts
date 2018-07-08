import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserModel } from "../models/User";
import { IVerifyOptions } from "passport-local";

/**
 * GET /
 * Home page.
 */
export let indexRedirect = (req: Request, res: Response) => {
  res.redirect("/cms");
};

/**
 * GET /cms
 * CMS home page
 */
export let index = (req: Request, res: Response) => {
  if (req.user) {
    res.redirect("/cms/projects");
  } else {
    res.redirect("/cms/login");
  }
};

/**
 * GET /cms/login
 * CMS Login Page
 */
export let getLogin = (req: Request, res: Response) => {
  res.render("cms/login", {
    title: "CMS"
  });
};

/**
 * POST /cms/login
 * CMS Login Page
 */
export let postLogin = (req: Request, res: Response, next: NextFunction) => {
  req.assert("email", "Email is not valid").isEmail();
  req.assert("password", "Password cannot be blank").notEmpty();
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/cms/project");
  }

  passport.authenticate("local", (err: Error, user: UserModel, info: IVerifyOptions) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash("errors", info.message);
      return res.redirect("/cms/login");
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/");
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
export let logout = (req: Request, res: Response) => {
  req.logout();
  res.redirect("/");
};