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
      const isSameBank = command.cardNumber.startsWith('1'); // Asumir banco 1 tarjetas empiezan con 1

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
        // Interbanco: descontar cajero, y llamar a API de banco 2 para descontar cuenta
        await CajeroService.descontarSaldo(command.amount);

        // Aquí preparar llamada a API de banco 2
        // Por ejemplo, fetch('http://localhost:3001/api/withdraw', { method: 'POST', body: JSON.stringify({ cardNumber: command.cardNumber, amount: command.amount }) })
        // Asumir que devuelve success

        // Registrar transacción
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