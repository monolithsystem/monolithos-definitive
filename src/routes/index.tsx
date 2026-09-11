import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav, type TabValue } from "@/components/top-nav";
import { ReceptionView } from "@/components/reception-view";
import { DirectorView } from "@/components/director-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MonolithOS — Recepção e Painel Executivo da Clínica" },
      {
        name: "description",
        content:
          "MonolithOS: agenda da recepção em tempo real e painel executivo com métricas de confirmação e reativação de pacientes.",
      },
      { property: "og:title", content: "MonolithOS — Medical Suite" },
      {
        property: "og:description",
        content:
          "Agenda da recepção em tempo real e painel executivo de métricas para clínicas médicas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeTab, setActiveTab] = useState<TabValue>("recepcao");
  const [directorUnlocked, setDirectorUnlocked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("monolithos-director-unlocked") === "true") {
      setDirectorUnlocked(true);
    }
  }, []);

  const handleDirectorUnlock = (value: boolean) => {
    setDirectorUnlocked(value);
    if (value) {
      localStorage.setItem("monolithos-director-unlocked", "true");
    } else {
      localStorage.removeItem("monolithos-director-unlocked");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-dark">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-0 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-gold/[0.05] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[50vh] w-[50vh] rounded-full bg-gold/[0.03] blur-[120px]" />
      </div>

      <div className="relative z-10">
        <TopNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          directorUnlocked={directorUnlocked}
        />
        {activeTab === "recepcao" ? (
          <ReceptionView />
        ) : (
          <DirectorView unlocked={directorUnlocked} onUnlock={handleDirectorUnlock} />
        )}
      </div>
    </div>
  );
}
