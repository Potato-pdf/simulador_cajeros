import { useState } from "react";
import { ATMScreen } from "./ATMScreen";
import { NumericKeypad } from "./NumericKeypad";
import { CreditCard } from "lucide-react";

interface CardInputProps {
  onSubmit: (cardNumber: string) => void;
}

export const CardInput = ({ onSubmit }: CardInputProps) => {
  const [cardNumber, setCardNumber] = useState("");

  const handleNumberClick = (num: string) => {
    if (cardNumber.length < 16) {
      setCardNumber(cardNumber + num);
    }
  };

  const handleDelete = () => {
    setCardNumber(cardNumber.slice(0, -1));
  };

  const handleClear = () => {
    setCardNumber("");
  };

  const handleEnter = () => {
    if (cardNumber.length === 16) {
      onSubmit(cardNumber);
    }
  };

  const formatCardNumber = (num: string) => {
    return num.match(/.{1,4}/g)?.join(" ") || num;
  };

  return (
    <ATMScreen>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full animate-pulse-glow">
              <CreditCard className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Bienvenido
          </h2>
          <p className="text-muted-foreground text-lg">
            Ingrese su número de tarjeta
          </p>
        </div>

        <div className="bg-card border border-primary/20 rounded-lg p-6 text-center min-h-[80px] flex items-center justify-center">
          <span className="text-3xl font-mono tracking-widest text-primary">
            {formatCardNumber(cardNumber) || "---- ---- ---- ----"}
          </span>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {cardNumber.length}/16 dígitos
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
