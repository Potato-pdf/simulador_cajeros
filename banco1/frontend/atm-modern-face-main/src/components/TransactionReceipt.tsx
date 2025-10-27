import { ATMScreen } from "./ATMScreen";
import { Button } from "@/components/ui/button";
import { CheckCircle, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TransactionReceiptProps {
  cardNumber: string;
  amount: number;
  onFinish: () => void;
}

export const TransactionReceipt = ({ cardNumber, amount, onFinish }: TransactionReceiptProps) => {
  const transactionDate = new Date();
  const transactionId = `ATM${Date.now().toString().slice(-8)}`;
  const formattedCard = cardNumber.replace(/(\d{4})/g, "$1 ").trim();
  const maskedCard = `**** **** **** ${cardNumber.slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <ATMScreen>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-accent/20 rounded-full">
              <CheckCircle className="h-16 w-16 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-accent">
            ¡Transacción Exitosa!
          </h2>
          <p className="text-muted-foreground text-lg">
            Su retiro ha sido procesado correctamente
          </p>
        </div>

        <Card className="bg-card border border-accent/20 p-6 space-y-4">
          <div className="border-b border-dashed border-muted pb-4">
            <h3 className="text-center text-xl font-bold text-foreground mb-2">
              BANCO DIGITAL ATM
            </h3>
            <p className="text-center text-xs text-muted-foreground">
              Comprobante de Retiro
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-mono text-foreground">
                {transactionDate.toLocaleDateString("es-MX")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Hora:</span>
              <span className="font-mono text-foreground">
                {transactionDate.toLocaleTimeString("es-MX")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">No. Transacción:</span>
              <span className="font-mono text-foreground">{transactionId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Tarjeta:</span>
              <span className="font-mono text-foreground">{maskedCard}</span>
            </div>

            <div className="border-t border-dashed border-muted pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-semibold">Monto Retirado:</span>
                <span className="text-2xl font-bold text-accent">
                  ${amount.toLocaleString()} MXN
                </span>
              </div>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Comisión:</span>
              <span className="text-foreground">$0.00 MXN</span>
            </div>

            <div className="border-t border-dashed border-muted pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span className="text-foreground">Total:</span>
                <span className="text-accent text-xl">
                  ${amount.toLocaleString()} MXN
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-muted pt-4 mt-4">
            <p className="text-center text-xs text-muted-foreground">
              Conserve este comprobante para cualquier aclaración
            </p>
            <p className="text-center text-xs text-muted-foreground mt-1">
              Gracias por usar nuestros servicios
            </p>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex-1 h-14 text-lg"
          >
            <Printer className="mr-2 h-5 w-5" />
            Imprimir
          </Button>
          <Button
            onClick={onFinish}
            className="flex-1 h-14 text-lg bg-accent hover:bg-accent/80 text-accent-foreground"
          >
            Nueva Transacción
          </Button>
        </div>
      </div>
    </ATMScreen>
  );
};
