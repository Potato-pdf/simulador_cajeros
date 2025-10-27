"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { WithdrawalScreen } from "@/components/withdrawal-screen"
import { ReceiptScreen } from "@/components/receipt-screen"

export type Transaction = {
  cardNumber: string
  amount: number
  date: Date
  transactionId: string
}

export default function ATMPage() {
  const [step, setStep] = useState<"login" | "withdrawal" | "receipt">("login")
  const [transaction, setTransaction] = useState<Transaction | null>(null)

  const handleLogin = (cardNumber: string, pin: string) => {
    // Simulate authentication
    setTransaction({
      cardNumber,
      amount: 0,
      date: new Date(),
      transactionId: Math.random().toString(36).substring(2, 15).toUpperCase(),
    })
    setStep("withdrawal")
  }

  const handleWithdrawal = (amount: number) => {
    if (transaction) {
      setTransaction({
        ...transaction,
        amount,
        date: new Date(),
      })
      setStep("receipt")
    }
  }

  const handleNewTransaction = () => {
    setTransaction(null)
    setStep("login")
  }

  return (
    <main className="min-h-screen">
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
