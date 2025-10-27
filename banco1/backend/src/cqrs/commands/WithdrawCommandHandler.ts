import type { WithdrawCommand } from "./WithdrawCommand";
import { CuentaService } from "../../domain/services/CuentaService";
import { CajeroService } from "../../domain/services/CajeroService";
import { TransaccionService } from "../../domain/services/TransaccionService";

export class WithdrawCommandHandler {
  static async handle(command: WithdrawCommand): Promise<{ success: boolean; message: string }> {
    try {
      // Verificar cuenta
      const cuenta = await CuentaService.verificarCuenta(command.cardNumber, command.pin);
      if (!cuenta) {
        return { success: false, message: "Tarjeta o PIN incorrecto" };
      }

      // Verificar saldo cuenta
      const saldoSuficienteCuenta = await CuentaService.verificarSaldo(cuenta, command.amount);
      if (!saldoSuficienteCuenta) {
        return { success: false, message: "Saldo insuficiente en la cuenta" };
      }

      // Verificar saldo cajero
      const saldoSuficienteCajero = await CajeroService.verificarSaldo(command.amount);
      if (!saldoSuficienteCajero) {
        return { success: false, message: "Saldo insuficiente en el cajero" };
      }

      // Determinar si es mismo banco
      const isSameBank = command.cardNumber.startsWith('11'); // Banco 1 tarjetas empiezan con 11

      if (isSameBank) {
        // Descontar de cuenta y cajero
        await CuentaService.descontarSaldo(cuenta.id, command.amount);
        await CajeroService.descontarSaldo(command.amount);

        // Registrar transacción
        await TransaccionService.registrarTransaccion({
          cuenta_id: cuenta.id,
          tipo: 'retiro',
          monto: command.amount,
          fecha: new Date(),
          banco_origen: 'banco1',
        });
      } else {
        // Interbanco: llamar a API de banco 2 para procesar retiro
        const res = await fetch('http://localhost:3001/api/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardNumber: command.cardNumber,
            pin: command.pin,
            amount: command.amount,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          return { success: false, message: data.message || 'Error interbancario en banco2' };
        }
        // Registrar transacción local
        await CajeroService.descontarSaldo(command.amount);
        await TransaccionService.registrarTransaccion({
          cuenta_id: cuenta.id,
          tipo: 'retiro',
          monto: command.amount,
          fecha: new Date(),
          banco_origen: 'banco1',
          banco_destino: 'banco2',
        });
      }

      return { success: true, message: "Retiro exitoso" };
    } catch (error) {
      return { success: false, message: "Error en la transacción" };
    }
  }
}