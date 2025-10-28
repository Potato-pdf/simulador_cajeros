import { useState, useEffect } from "react";
import { CardInput } from "@/components/CardInput";
import { PinInput } from "@/components/PinInput";
import { AmountSelection } from "@/components/AmountSelection";
import { TransactionReceipt } from "@/components/TransactionReceipt";
import { toast } from "sonner";
import { AtmPresenter, AtmView } from "@/presenters/AtmPresenter";

type Step = "card" | "pin" | "amount" | "receipt";

class IndexView implements AtmView {
  private setStep: (step: Step) => void;
  private setCardNumber: (card: string) => void;
  private cardNumber: string;
  private pin: string;
  private amount: number;
  private setAmount: (amount: number) => void;

  constructor(
    setStep: (step: Step) => void,
    setCardNumber: (card: string) => void,
    cardNumber: string,
    pin: string,
    amount: number,
    setAmount: (amount: number) => void
  ) {
    this.setStep = setStep;
    this.setCardNumber = setCardNumber;
    this.cardNumber = cardNumber;
    this.pin = pin;
    this.amount = amount;
    this.setAmount = setAmount;
  }

  onCardValid() {
    this.setStep("pin");
    toast.success("Tarjeta válida");
  }

  onCardInvalid() {
    toast.error("Tarjeta inválida");
  }

  onPinValid() {
    this.setStep("amount");
    toast.success("PIN verificado correctamente", {
      description: "Acceso autorizado",
    });
  }

  onWithdrawSuccess(message: string) {
    this.setStep("receipt");
    toast.success(message);
  }

  onWithdrawError(message: string) {
    toast.error(message);
  }

  onError(message: string) {
    toast.error(message);
  }
}

const Index = () => {
  const [step, setStep] = useState<Step>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState(0);
  const [presenter, setPresenter] = useState<AtmPresenter | null>(null);

  useEffect(() => {
    const view = new IndexView(setStep, setCardNumber, cardNumber, pin, amount, setAmount);
    const atmPresenter = new AtmPresenter(view);
    setPresenter(atmPresenter);
  }, [cardNumber, pin, amount]);

  const handleCardSubmit = async (card: string) => {
    setCardNumber(card);
    if (presenter) {
      await presenter.verifyCard(card);
    }
  };

  const handlePinSubmit = (pinValue: string) => {
    setPin(pinValue);
    if (presenter) {
      presenter.verifyPin(pinValue);
    }
  };

  const handleAmountSubmit = async (amountValue: number) => {
    setAmount(amountValue);
    if (presenter) {
      await presenter.withdraw(cardNumber, pin, amountValue);
    }
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
