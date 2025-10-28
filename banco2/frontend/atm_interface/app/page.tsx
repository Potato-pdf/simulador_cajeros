"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { WithdrawalScreen } from "@/components/withdrawal-screen"
import { ReceiptScreen } from "@/components/receipt-screen"
import { AtmPresenter, AtmView } from "@/presenters/AtmPresenter"

export type Transaction = {
  cardNumber: string
  amount: number
  date: Date
  transactionId: string
}

class PageView implements AtmView {
  private setStep: (step: "login" | "withdrawal" | "receipt") => void;
  private setTransaction: (transaction: Transaction | null) => void;
  private setGlobalError: (error: string) => void;
  private transaction: Transaction | null;
  private pin: string;

  constructor(
    setStep: (step: "login" | "withdrawal" | "receipt") => void,
    setTransaction: (transaction: Transaction | null) => void,
    setGlobalError: (error: string) => void,
    transaction: Transaction | null,
    pin: string
  ) {
    this.setStep = setStep;
    this.setTransaction = setTransaction;
    this.setGlobalError = setGlobalError;
    this.transaction = transaction;
    this.pin = pin;
  }

  onLoginSuccess(cardNumber: string, pin: string) {
    this.setTransaction({
      cardNumber,
      amount: 0,
      date: new Date(),
      transactionId: Math.random().toString(36).substring(2, 15).toUpperCase(),
    });
    this.setStep("withdrawal");
  }

  onLoginError(message: string) {
    this.setGlobalError(message);
  }

  onWithdrawSuccess() {
    this.setStep("receipt");
  }

  onWithdrawError(message: string) {
    this.setGlobalError(message);
  }

  onError(message: string) {
    this.setGlobalError(message);
  }
}

export default function ATMPage() {
  const [step, setStep] = useState<"login" | "withdrawal" | "receipt">("login")
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [pin, setPin] = useState<string>("")
  const [globalError, setGlobalError] = useState<string>("")
  const [presenter, setPresenter] = useState<AtmPresenter | null>(null);

  useEffect(() => {
    const view = new PageView(setStep, setTransaction, setGlobalError, transaction, pin);
    const atmPresenter = new AtmPresenter(view);
    setPresenter(atmPresenter);
  }, [transaction, pin]);

  const handleLogin = async (cardNumber: string, pinValue: string) => {
    setGlobalError("")
    setPin(pinValue);
    if (presenter) {
      await presenter.login(cardNumber, pinValue);
    }
  }

  const handleWithdrawal = async (amount: number) => {
    setGlobalError("")
    if (transaction && presenter) {
      await presenter.withdraw(transaction.cardNumber, pin, amount);
      setTransaction({
        ...transaction,
        amount,
        date: new Date(),
      });
    }
  }

  const handleNewTransaction = () => {
    setTransaction(null)
    setStep("login")
  }

  return (
    <main className="min-h-screen">
      {globalError && (
        <div className="bg-red-100 text-red-700 p-4 text-center font-bold">{globalError}</div>
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
