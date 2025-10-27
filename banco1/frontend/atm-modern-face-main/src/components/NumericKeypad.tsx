import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onEnter: () => void;
  disabled?: boolean;
}

export const NumericKeypad = ({ 
  onNumberClick, 
  onDelete, 
  onClear, 
  onEnter,
  disabled = false 
}: NumericKeypadProps) => {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {numbers.map((num) => (
        <Button
          key={num}
          onClick={() => onNumberClick(num)}
          disabled={disabled}
          className="h-16 text-2xl font-semibold bg-[hsl(var(--atm-button))] hover:bg-[hsl(var(--atm-button-hover))] border border-primary/20 transition-all duration-200 hover:scale-105 active:scale-95"
          variant="ghost"
        >
          {num}
        </Button>
      ))}
      
      <Button
        onClick={onClear}
        disabled={disabled}
        className="h-16 text-lg font-semibold bg-destructive/20 hover:bg-destructive/30 border border-destructive/40"
        variant="ghost"
      >
        Borrar
      </Button>
      
      <Button
        onClick={onDelete}
        disabled={disabled}
        className="h-16 bg-[hsl(var(--atm-button))] hover:bg-[hsl(var(--atm-button-hover))] border border-primary/20"
        variant="ghost"
      >
        <Delete className="h-6 w-6" />
      </Button>
      
      <Button
        onClick={onEnter}
        disabled={disabled}
        className="h-16 text-lg font-semibold bg-accent hover:bg-accent/80 text-accent-foreground border border-accent/40 transition-all duration-200 hover:scale-105"
      >
        Entrar
      </Button>
    </div>
  );
};
