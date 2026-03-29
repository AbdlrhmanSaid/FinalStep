"use client";

import { useAppContext } from "../../../contexts/AppContext";
import { translations } from "../../../lib/translations";
import Footer from "../../../components/home/Footer";

export default function DashboardFooter() {
  const { isRTL, language } = useAppContext();
  const t = translations[language || "en"];

  return <Footer t={t} isRTL={isRTL} />;
}
