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

        <div className={`bg-card border rounded-lg p-6 text-center min-h-[80px] flex items-center justify-center transition-colors ${
          pin.length === 4 ? 'border-accent/20' : pin.length > 0 ? 'border-red-500/50' : 'border-accent/20'
        }`}>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
              setPin(value);
            }}
            placeholder="****"
            className="text-3xl font-mono tracking-widest text-accent bg-transparent border-none outline-none text-center w-32"
            maxLength={4}
          />
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
