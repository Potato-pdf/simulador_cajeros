"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Banknote, AlertCircle, DollarSign } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type WithdrawalScreenProps = {
  cardNumber: string
  onWithdraw: (amount: number) => void
  onCancel: () => void
}

const QUICK_AMOUNTS = [200, 500, 1000, 2000, 3000, 5000]

export function WithdrawalScreen({ cardNumber, onWithdraw, onCancel }: WithdrawalScreenProps) {
  const [customAmount, setCustomAmount] = useState("")
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const maskedCard = `•••• •••• •••• ${cardNumber.slice(-4)}`

  const handleQuickAmount = (amount: number) => {
    processWithdrawal(amount)
  }

  const handleCustomWithdrawal = (e: React.FormEvent) => {
    e.preventDefault()

    const amount = Number.parseFloat(customAmount)

    if (!amount || amount <= 0) {
      setError("Ingrese un monto válido")
      return
    }

    if (amount < 100) {
      setError("El monto mínimo es $100")
      return
    }

    if (amount > 10000) {
      setError("El monto máximo es $10,000")
      return
    }

    if (amount % 100 !== 0) {
      setError("El monto debe ser múltiplo de $100")
      return
    }

    processWithdrawal(amount)
  }

  const processWithdrawal = (amount: number) => {
    setIsProcessing(true)
    setError("")

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      onWithdraw(amount)
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/20 mb-2">
          <Banknote className="w-10 h-10 text-secondary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-balance">Retiro de Efectivo</h1>
        <p className="text-muted-foreground text-lg font-mono">Tarjeta: {maskedCard}</p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <Card className="p-8 shadow-2xl border-2">
          <h2 className="text-xl font-semibold mb-6">Montos Rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {QUICK_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="h-20 text-xl font-semibold hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all bg-transparent"
                onClick={() => handleQuickAmount(amount)}
                disabled={isProcessing}
              >
                ${amount.toLocaleString()}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-8 shadow-2xl border-2">
          <h2 className="text-xl font-semibold mb-6">Monto Personalizado</h2>
          <form onSubmit={handleCustomWithdrawal} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-semibold">
                Ingrese el monto (múltiplo de $100)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setError("")
                  }}
                  className="pl-11 h-14 text-2xl font-semibold"
                  disabled={isProcessing}
                  min="100"
                  max="10000"
                  step="100"
                />
              </div>
              <p className="text-sm text-muted-foreground">Mínimo: $100 | Máximo: $10,000</p>
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 text-base font-semibold bg-transparent"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-base font-semibold bg-secondary hover:bg-secondary/90"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  "Retirar"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
