import { createContext, useContext, useState, ReactNode } from "react";

interface GetStartedModalContextType {
  isOpen: boolean;
  initialView: "choose" | "team-form";
  open: () => void;
  openTeam: () => void;
  close: () => void;
}

const GetStartedModalContext = createContext<GetStartedModalContextType | undefined>(undefined);

export const GetStartedModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialView, setInitialView] = useState<"choose" | "team-form">("choose");

  return (
    <GetStartedModalContext.Provider
      value={{
        isOpen,
        initialView,
        open: () => { setInitialView("choose"); setIsOpen(true); },
        openTeam: () => { setInitialView("team-form"); setIsOpen(true); },
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </GetStartedModalContext.Provider>
  );
};

export const useGetStartedModal = () => {
  const ctx = useContext(GetStartedModalContext);
  if (!ctx) throw new Error("useGetStartedModal must be used within GetStartedModalProvider");
  return ctx;
};
