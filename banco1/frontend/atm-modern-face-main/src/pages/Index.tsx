import { useState } from "react";
import { CardInput } from "@/components/CardInput";
import { PinInput } from "@/components/PinInput";
import { AmountSelection } from "@/components/AmountSelection";
import { TransactionReceipt } from "@/components/TransactionReceipt";
import { toast } from "sonner";

type Step = "card" | "pin" | "amount" | "receipt";

const Index = () => {
  const [step, setStep] = useState<Step>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState(0);

  const handleCardSubmit = (card: string) => {
    setCardNumber(card);
    setStep("pin");
    toast.success("Tarjeta ingresada correctamente");
  };

  const handlePinSubmit = (pinValue: string) => {
    setPin(pinValue);
    // Simulación de verificación
    setTimeout(() => {
      setStep("amount");
      toast.success("PIN verificado correctamente", {
        description: "Acceso autorizado",
      });
    }, 800);
  };

  const handleAmountSubmit = (amountValue: number) => {
    setAmount(amountValue);
    // Simulación de procesamiento
    toast.loading("Procesando transacción...", { duration: 1500 });
    
    setTimeout(() => {
      setStep("receipt");
      toast.success("Transacción completada", {
        description: `Se ha retirado $${amountValue.toLocaleString()} MXN`,
      });
    }, 1500);
  };

  const handleFinish = () => {
    setStep("card");
    setCardNumber("");
    setPin("");
    setAmount(0);
    toast.info("Sesión finalizada", {
      description: "Gracias por usar nuestros servicios",
    });
  };

  const handleBackToCard = () => {
    setStep("card");
    setCardNumber("");
    toast.info("Regresando al inicio");
  };

  const handleBackToPin = () => {
    setStep("pin");
    toast.info("Regresando a verificación");
  };

  return (
    <div className="min-h-screen bg-atm-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {step === "card" && <CardInput onSubmit={handleCardSubmit} />}
        {step === "pin" && <PinInput onSubmit={handlePinSubmit} onBack={handleBackToCard} />}
        {step === "amount" && <AmountSelection onSubmit={handleAmountSubmit} onBack={handleBackToPin} />}
        {step === "receipt" && (
          <TransactionReceipt
            cardNumber={cardNumber}
            amount={amount}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
