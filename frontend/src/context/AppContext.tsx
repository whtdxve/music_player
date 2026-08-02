import { createContext, useContext, useState, type ReactNode } from "react";
import type { ContentSource } from "../types/contentSource";

interface AppContextType {
    contentSource: ContentSource | null;
    setContentSource: (contentSource: ContentSource | null) => void;
    isAdditionalSidebarOpen: boolean;
    setIsAdditionalSidebarOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [contentSource, setContentSource] = useState<ContentSource | null>(null);
    const [isAdditionalSidebarOpen, setIsAdditionalSidebarOpen] = useState(false);
    
    return (
        <AppContext.Provider value={{
            contentSource,
            setContentSource,
            isAdditionalSidebarOpen,
            setIsAdditionalSidebarOpen
        }}>
            {children}
        </AppContext.Provider>
    );
}   

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp должен использоваться внутри AppProvider');
  return context;
}