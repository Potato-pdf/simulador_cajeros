import { useState } from "react";
import { ATMScreen } from "./ATMScreen";
import { NumericKeypad } from "./NumericKeypad";
import { Lock } from "lucide-react";

interface PinInputProps {
  onSubmit: (pin: string) => void;
  onBack: () => void;
}

export const PinInput = ({ onSubmit, onBack }: PinInputProps) => {
  const [pin, setPin] = useState("");

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
  };

  const handleEnter = () => {
    if (pin.length === 4) {
      onSubmit(pin);
    }
  };

  return (
    <ATMScreen>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-accent/10 rounded-full animate-pulse-glow">
              <Lock className="h-12 w-12 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Verificación de Seguridad
          </h2>
          <p className="text-muted-foreground text-lg">
            Ingrese su NIP de 4 dígitos
          </p>
        </div>

        <div className="bg-card border border-accent/20 rounded-lg p-6 text-center min-h-[80px] flex items-center justify-center">
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  pin.length > i
                    ? "bg-accent border-accent scale-110"
                    : "border-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            {pin.length}/4 dígitos
          </div>
          <button
            onClick={onBack}
            className="text-sm text-primary hover:text-primary/80 underline"
          >
            ← Regresar a tarjeta
          </button>
        </div>

        <NumericKeypad
          onNumberClick={handleNumberClick}
          onDelete={handleDelete}
          onClear={handleClear}
          onEnter={handleEnter}
          disabled={false}
        />
      </div>
    </ATMScreen>
  );
};
