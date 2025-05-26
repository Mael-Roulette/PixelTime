import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export default function LogIn() {
  const { t } = useTranslation();

  return (
    <>
      <header className="header-login">
        <NavLink to={"/"}>{t("global.backHome")}</NavLink>
      </header>
      <main>
        <div>
          <h1>{t("login.title")}</h1>
          <form>
            <label for="email">
              Email
              <input type="email" name="email"></input>
            </label>
            <label for="password">
              {t("login.password")}
              <input type="password" name="password"></input>
            </label>
            <input type="submit" value={t("login.continue")} />
          </form>
          <p>
            {t("login.noAccount")}
            <a href="/inscription">{t("login.signup")}</a>
            </p>
        </div>
      </main>
    </>
  )

}