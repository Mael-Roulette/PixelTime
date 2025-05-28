import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { useState } from "react";


export default function forgotPassword() {
  const { t } = useTranslation();

  return (
    <>
      <header className="header-login">
        <NavLink to={"/"}>{t("global.backHome")}</NavLink>
      </header>

      <main className="main-login">
        <div className="main-login-form">
          <h1>{t("forgotPassword.title")}</h1>
          <form>
            <div className="form-group">
              <label htmlFor="email">
                Email
                <input type="email" name="email" placeholder="email@email.com" />
              </label>
            </div>
            <input type="submit" value={t("forgotPassword.resetPassword")} className="submit-button button-primary" />
          </form>
           <p>
            {t("forgotPassword.notForgotPassword")}
            <a href="/login"> {t("forgotPassword.login")}</a>
          </p>
        </div>
      </main>
    </>
  )
}