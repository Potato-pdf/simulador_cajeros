import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ATMScreenProps {
  children: ReactNode;
  title?: string;
}

export const ATMScreen = ({ children, title }: ATMScreenProps) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Card className="bg-[hsl(var(--atm-screen))] border-2 border-primary/20 shadow-2xl overflow-hidden">
        <div className="bg-atm-gradient p-6 border-b border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
              <h1 className="text-2xl font-bold text-foreground tracking-wide">
                {title || "BANCO DIGITAL ATM"}
              </h1>
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <div className="p-8 min-h-[500px] flex flex-col justify-center animate-fade-in">
          {children}
        </div>
      </Card>
    </div>
  );
};
