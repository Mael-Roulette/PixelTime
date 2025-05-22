import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="home">
      <h1>{t("home.title")}</h1>
      <p>This is the main page of the application.</p>
    </div>
  );
}