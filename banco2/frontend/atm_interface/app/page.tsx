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
  const [pin, setPin] = useState<string>("")


  // Estado para errores globales
  const [globalError, setGlobalError] = useState<string>("")

  // Conexión real con backend
  const handleLogin = async (cardNumber: string, pinValue: string) => {
    setGlobalError("")
    try {
      // Verifica tarjeta
      const verifyRes = await fetch(`http://localhost:3001/api/verify?cardNumber=${cardNumber}`)
      const verifyData = await verifyRes.json()
      if (!verifyData.valid) {
        setGlobalError("Tarjeta no válida o no encontrada.")
        return
      }
      // Si la tarjeta existe, guarda el pin y pasa a retiro
      setPin(pinValue)
      setTransaction({
        cardNumber,
        amount: 0,
        date: new Date(),
        transactionId: Math.random().toString(36).substring(2, 15).toUpperCase(),
      })
      setStep("withdrawal")
    } catch (err) {
      setGlobalError("Error de conexión con el backend.")
    }
  }

  const handleWithdrawal = async (amount: number) => {
    setGlobalError("")
    if (transaction) {
      try {
        // Determinar si la tarjeta es local (banco2) o remota (banco1)
        // Ejemplo: banco2 tarjetas empiezan con '22', banco1 con '11' (ajusta según tu lógica real)
        const isLocal = transaction.cardNumber.startsWith("22")
        const apiUrl = isLocal
          ? "http://localhost:3001/api/withdraw"
          : "http://localhost:3000/api/withdraw"
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardNumber: transaction.cardNumber,
            pin,
            amount,
          }),
        })
        const data = await res.json()
        if (!data.success) {
          setGlobalError(data.error || data.message || "No se pudo realizar el retiro.")
          return
        }
        setTransaction({
          ...transaction,
          amount,
          date: new Date(),
          transactionId: data.transactionId || transaction.transactionId,
        })
        setStep("receipt")
      } catch (err) {
        setGlobalError("Error de conexión con el backend.")
      }
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
