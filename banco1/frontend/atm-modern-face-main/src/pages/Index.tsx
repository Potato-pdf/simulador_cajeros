import { useState, useEffect } from "react";
import { CardInput } from "@/components/CardInput";
import { PinInput } from "@/components/PinInput";
import { AmountSelection } from "@/components/AmountSelection";
import { TransactionReceipt } from "@/components/TransactionReceipt";
import { toast } from "sonner";
import { AtmViewModel } from "@/viewmodels/AtmViewModel";

/**
 * Index Component - MVVM Pattern
 * 
 * Este componente implementa el patrón MVVM donde:
 * - ViewModel (AtmViewModel): Mantiene el estado reactivo con observables
 * - View (Index): Se suscribe a los observables del ViewModel
 * - Binding automático: Los cambios en ViewModel se reflejan automáticamente en la View
 */
const Index = () => {
  // Crear instancia única del ViewModel
  const [viewModel] = useState(() => new AtmViewModel());

  // Estados locales de React que se sincronizan con el ViewModel
  const [step, setStep] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // MVVM Binding: Suscribirse a los observables del ViewModel
  useEffect(() => {
    const stepSubscription = viewModel.step$.subscribe((newStep) => {
      setStep(newStep as any);
    });

    const cardSubscription = viewModel.cardNumber$.subscribe((newCard) => {
      setCardNumber(newCard);
    });

    const pinSubscription = viewModel.pin$.subscribe((newPin) => {
      setPin(newPin);
    });

    const amountSubscription = viewModel.amount$.subscribe((newAmount) => {
      setAmount(newAmount);
    });

    const errorSubscription = viewModel.errorMessage$.subscribe((error) => {
      setErrorMessage(error);
      if (error) {
        toast.error(error);
      }
    });

    const loadingSubscription = viewModel.isLoading$.subscribe((loading) => {
      setIsLoading(loading);
    });

    // Cleanup: desuscribirse cuando el componente se desmonta
    return () => {
      stepSubscription.unsubscribe();
      cardSubscription.unsubscribe();
      pinSubscription.unsubscribe();
      amountSubscription.unsubscribe();
      errorSubscription.unsubscribe();
      loadingSubscription.unsubscribe();
    };
  }, [viewModel]);

  // Event Handlers que invocan comandos del ViewModel
  const handleCardSubmit = async (card: string) => {
    await viewModel.verifyCard(card);
  };

  const handlePinSubmit = (pinValue: string) => {
    viewModel.verifyPin(pinValue).then((success) => {
      if (success) {
        toast.success("PIN verificado correctamente", {
          description: "Acceso autorizado",
        });
      }
    });
  };

  const handleAmountSubmit = async (amountValue: number) => {
    const success = await viewModel.withdraw(amountValue);
    if (success) {
      toast.success("Retiro exitoso");
    }
  };

  const handleFinish = () => {
    viewModel.resetSession();
    toast.info("Sesión finalizada", {
      description: "Gracias por usar nuestros servicios",
    });
  };

  const handleBackToCard = () => {
    viewModel.goToStep("card");
    toast.info("Regresando al inicio");
  };

  const handleBackToPin = () => {
    viewModel.goToStep("pin");
    toast.info("Regresando a verificación");
  };

  return (
    <div className="min-h-screen bg-atm-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {step === "card" && <CardInput onSubmit={handleCardSubmit} />}
        {step === "pin" && <PinInput onSubmit={handlePinSubmit} onBack={handleBackToCard} />}
        {step === "amount" && (
          <AmountSelection onSubmit={handleAmountSubmit} onBack={handleBackToPin} />
        )}
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
