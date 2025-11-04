"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { WithdrawalScreen } from "@/components/withdrawal-screen"
import { ReceiptScreen } from "@/components/receipt-screen"
import { AtmViewModel, Transaction } from "@/viewmodels/AtmViewModel"

/**
 * ATMPage Component - MVVM Pattern
 * 
 * Este componente implementa el patrón MVVM donde:
 * - ViewModel (AtmViewModel): Mantiene el estado reactivo con observables
 * - View (ATMPage): Se suscribe a los observables del ViewModel
 * - Binding automático: Los cambios en ViewModel se reflejan automáticamente en la View
 */
export default function ATMPage() {
  // Crear instancia única del ViewModel
  const [viewModel] = useState(() => new AtmViewModel());

  // Estados locales de React que se sincronizan con el ViewModel
  const [step, setStep] = useState<"login" | "withdrawal" | "receipt">("login")
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // MVVM Binding: Suscribirse a los observables del ViewModel
  useEffect(() => {
    const stepSubscription = viewModel.step$.subscribe((newStep) => {
      setStep(newStep as any);
    });

    const transactionSubscription = viewModel.transaction$.subscribe((newTransaction) => {
      setTransaction(newTransaction);
    });

    const errorSubscription = viewModel.errorMessage$.subscribe((error) => {
      setErrorMessage(error);
    });

    const loadingSubscription = viewModel.isLoading$.subscribe((loading) => {
      setIsLoading(loading);
    });

    // Cleanup: desuscribirse cuando el componente se desmonta
    return () => {
      stepSubscription.unsubscribe();
      transactionSubscription.unsubscribe();
      errorSubscription.unsubscribe();
      loadingSubscription.unsubscribe();
    };
  }, [viewModel]);

  // Event Handlers que invocan comandos del ViewModel
  const handleLogin = async (cardNumber: string, pinValue: string) => {
    await viewModel.login(cardNumber, pinValue);
  }

  const handleWithdrawal = async (amount: number) => {
    await viewModel.withdraw(amount);
  }

  const handleNewTransaction = () => {
    viewModel.newTransaction();
  }

  return (
    <main className="min-h-screen">
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 text-center font-bold">{errorMessage}</div>
      )}
      {step === "login" && <LoginScreen onLogin={handleLogin} />}
      {step === "withdrawal" && transaction && (
        <WithdrawalScreen
          cardNumber={transaction.cardNumber}
          onWithdraw={handleWithdrawal}
          onCancel={handleNewTransaction}
        />
      )}
      {step === "receipt" && transaction && (
        <ReceiptScreen transaction={transaction} onNewTransaction={handleNewTransaction} />
      )}
    </main>
  )
}
