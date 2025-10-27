import { useState } from "react";
import { ATMScreen } from "./ATMScreen";
import { NumericKeypad } from "./NumericKeypad";
import { Button } from "@/components/ui/button";
import { Banknote } from "lucide-react";

interface AmountSelectionProps {
  onSubmit: (amount: number) => void;
  onBack: () => void;
}

export const AmountSelection = ({ onSubmit, onBack }: AmountSelectionProps) => {
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const presetAmounts = [200, 500, 1000, 2000, 3000, 5000];

  const handleNumberClick = (num: string) => {
    if (customAmount.length < 6) {
      setCustomAmount(customAmount + num);
    }
  };

  const handleDelete = () => {
    setCustomAmount(customAmount.slice(0, -1));
  };

  const handleClear = () => {
    setCustomAmount("");
  };

  const handleEnter = () => {
    const amount = parseInt(customAmount);
    if (amount >= 100 && amount <= 10000) {
      onSubmit(amount);
    }
  };

  const handlePresetClick = (amount: number) => {
    onSubmit(amount);
  };

  return (
    <ATMScreen>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-accent/10 rounded-full">
              <Banknote className="h-12 w-12 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Seleccione el Monto
          </h2>
          <p className="text-muted-foreground text-lg">
            Elija una cantidad o ingrese un monto personalizado
          </p>
        </div>

        {!showCustom ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handlePresetClick(amount)}
                  className="h-20 text-2xl font-bold bg-[hsl(var(--atm-button))] hover:bg-[hsl(var(--atm-button-hover))] border border-primary/20 transition-all duration-200 hover:scale-105"
                  variant="ghost"
                >
                  ${amount.toLocaleString()}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setShowCustom(true)}
              className="w-full h-16 text-xl font-semibold bg-accent hover:bg-accent/80 text-accent-foreground"
            >
              Otro Monto
            </Button>
          </>
        ) : (
          <>
            <div className={`bg-card border rounded-lg p-6 text-center min-h-[80px] flex items-center justify-center transition-colors ${
              parseInt(customAmount) >= 100 && parseInt(customAmount) <= 10000 ? 'border-accent/20' : customAmount ? 'border-red-500/50' : 'border-accent/20'
            }`}>
              <input
                type="text"
                value={customAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCustomAmount(value);
                }}
                placeholder="0"
                className="text-4xl font-bold text-accent bg-transparent border-none outline-none text-center w-full"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Monto: $100 - $10,000 MXN
            </div>

            <NumericKeypad
              onNumberClick={handleNumberClick}
              onDelete={handleDelete}
              onClear={handleClear}
              onEnter={handleEnter}
              disabled={false}
            />

            <Button
              onClick={() => setShowCustom(false)}
              variant="outline"
              className="w-full"
            >
              ← Volver a montos predefinidos
            </Button>
          </>
        )}

        <button
          onClick={onBack}
          className="w-full text-sm text-primary hover:text-primary/80 underline"
        >
          ← Regresar
        </button>
      </div>
    </ATMScreen>
  );
};
