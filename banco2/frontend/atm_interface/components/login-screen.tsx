"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Lock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type LoginScreenProps = {
  onLogin: (cardNumber: string, pin: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const groups = numbers.match(/.{1,4}/g)
    return groups ? groups.join(" ") : numbers
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted)
      setError("")
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setPin(value)
      setError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCardNumber = cardNumber.replace(/\s/g, "")

    if (cleanCardNumber.length !== 16) {
      setError("El número de tarjeta debe tener 16 dígitos")
      return
    }

    if (pin.length !== 4) {
      setError("El NIP debe tener 4 dígitos")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLogin(cleanCardNumber, pin)
    }, 1500)
  }

  const cardProgress = (cardNumber.replace(/\s/g, "").length / 16) * 100
  const pinProgress = (pin.length / 4) * 100

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 dark:bg-white mb-4">
                <CreditCard className="w-8 h-8 text-white dark:text-slate-900" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Cajero Automático</h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">Ingrese sus credenciales para continuar</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Number Input */}
                <div className="space-y-3">
                  <label
                    htmlFor="cardNumber"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Número de Tarjeta
                  </label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="h-14 text-lg font-mono tracking-wider border-slate-300 dark:border-slate-700 rounded-xl focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                    disabled={isLoading}
                  />
                  <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 dark:bg-white transition-all duration-300"
                      style={{ width: `${cardProgress}%` }}
                    />
                  </div>
                </div>

                {/* PIN Input */}
                <div className="space-y-3">
                  <label
                    htmlFor="pin"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    NIP
                  </label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="••••"
                    value={pin}
                    onChange={handlePinChange}
                    className="h-14 text-2xl font-mono tracking-widest border-slate-300 dark:border-slate-700 rounded-xl focus:border-slate-900 dark:focus:border-white focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
                    disabled={isLoading}
                  />
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i < pin.length ? "bg-slate-900 dark:bg-white" : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="rounded-xl border-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 text-base font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900 rounded-full animate-spin" />
                      Verificando...
                    </span>
                  ) : (
                    "Ingresar"
                  )}
                </Button>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Conexión segura</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
