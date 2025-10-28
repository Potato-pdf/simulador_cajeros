import type { WithdrawCommand } from "./WithdrawCommand";
import { CuentaService } from "../../domain/services/CuentaService";
import { CajeroService } from "../../domain/services/CajeroService";
import { TransaccionService } from "../../domain/services/TransaccionService";
import { ExternalBankService } from "../../domain/services/ExternalBankService";

export class WithdrawCommandHandler {
  static async handle(command: WithdrawCommand): Promise<{ success: boolean; message: string }> {
    try {
      // Determinar si es mismo banco
      const isSameBank = command.cardNumber.startsWith('22');

      if (isSameBank) {
        // Lógica local
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

        // Descontar de cuenta y cajero
        await CuentaService.descontarSaldo(cuenta.id, command.amount);
        await CajeroService.descontarSaldo(command.amount);

        // Registrar transacción
        await TransaccionService.registrarTransaccion({
          cuenta_id: cuenta.id,
          tipo: 'retiro',
          monto: command.amount,
          fecha: new Date(),
          banco_origen: 'banco2',
        });
      } else {
        // Interbanco: usar ExternalBankService
        const interbankResult = await ExternalBankService.performInterbankWithdrawal(command.cardNumber, command.pin, command.amount);
        if (!interbankResult.success) {
          return { success: false, message: interbankResult.message };
        }
        // Descontar cajero local
        await CajeroService.descontarSaldo(command.amount);
        // Registrar transacción local
        await TransaccionService.registrarTransaccion({
          cuenta_id: 'external', // Placeholder, since we don't have the account ID
          tipo: 'retiro',
          monto: command.amount,
          fecha: new Date(),
          banco_origen: 'banco2',
          banco_destino: 'banco1',
        });
      }

      return { success: true, message: "Retiro exitoso" };
    } catch (error) {
      return { success: false, message: "Error en la transacción" };
    }
  }
}