"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Printer, Home } from "lucide-react"
import type { Transaction } from "@/app/page"

type ReceiptScreenProps = {
  transaction: Transaction
  onNewTransaction: () => void
}

export function ReceiptScreen({ transaction, onNewTransaction }: ReceiptScreenProps) {
  const maskedCard = `•••• •••• •••• ${transaction.cardNumber.slice(-4)}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/20 mb-2 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-14 h-14 text-success" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-balance text-success">Transacción Exitosa</h1>
        <p className="text-muted-foreground text-lg">Su retiro ha sido procesado correctamente</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 overflow-hidden">
        <div className="bg-primary text-primary-foreground p-6 text-center">
          <h2 className="text-2xl font-bold">Comprobante de Retiro</h2>
          <p className="text-sm opacity-90 mt-1">Cajero Automático</p>
        </div>

        <div className="p-8 space-y-6 bg-card print:bg-white">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-dashed">
              <span className="text-muted-foreground">ID Transacción</span>
              <span className="font-mono font-semibold">{transaction.transactionId}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-dashed">
              <span className="text-muted-foreground">Fecha y Hora</span>
              <span className="font-semibold">
                {transaction.date.toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                <br />
                {transaction.date.toLocaleTimeString("es-MX")}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-dashed">
              <span className="text-muted-foreground">Tarjeta</span>
              <span className="font-mono font-semibold">{maskedCard}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-dashed">
              <span className="text-muted-foreground">Tipo de Operación</span>
              <span className="font-semibold">Retiro de Efectivo</span>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-semibold">Monto Retirado</span>
              <span className="text-3xl font-bold text-success">${transaction.amount.toLocaleString("es-MX")}</span>
            </div>
          </div>

          <div className="pt-6 border-t space-y-3">
            <div className="bg-muted/50 p-4 rounded-lg text-center text-sm text-muted-foreground">
              <p className="font-semibold mb-1">Importante</p>
              <p>Conserve este comprobante para cualquier aclaración</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted/30 border-t flex gap-3 print:hidden">
          <Button variant="outline" className="flex-1 h-12 font-semibold bg-transparent" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button className="flex-1 h-12 font-semibold" onClick={onNewTransaction}>
            <Home className="w-4 h-4 mr-2" />
            Nueva Operación
          </Button>
        </div>
      </Card>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        Gracias por utilizar nuestro cajero automático. No olvide retirar su tarjeta y su efectivo.
      </p>
    </div>
  )
}
