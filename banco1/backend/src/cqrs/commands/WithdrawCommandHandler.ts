import type { WithdrawCommand } from "./WithdrawCommand";
import { CuentaService } from "../../domain/services/CuentaService";
import { CajeroService } from "../../domain/services/CajeroService";
import { TransaccionService } from "../../domain/services/TransaccionService";
import { ExternalBankService } from "../../domain/services/ExternalBankService";

export class WithdrawCommandHandler {
  static async handle(command: WithdrawCommand): Promise<{ success: boolean; message: string }> {
    console.log('WithdrawCommandHandler banco1: Comando recibido', command);
    try {
      // Verificar saldo cajero
      const saldoSuficienteCajero = await CajeroService.verificarSaldo(command.amount);
      if (!saldoSuficienteCajero) {
        return { success: false, message: "Saldo insuficiente en el cajero" };
      }

      // Determinar si es mismo banco
      const isSameBank = command.cardNumber.startsWith('11');
      console.log('WithdrawCommandHandler banco1: isSameBank', isSameBank, 'for', command.cardNumber);

      if (isSameBank) {
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
        console.log('WithdrawCommandHandler banco1: Retiro interbancario para', command.cardNumber);
        // Interbanco: usar ExternalBankService
        const interbankResult = await ExternalBankService.performInterbankWithdrawal(command.cardNumber, command.pin, command.amount);
        console.log('WithdrawCommandHandler banco1: Resultado interbanco', interbankResult);
        if (!interbankResult.success) {
          return { success: false, message: interbankResult.message };
        }
        // Descontar cajero local
        await CajeroService.descontarSaldo(command.amount);
        // Registrar transacción local (sin cuenta_id, ya que es externa)
        await TransaccionService.registrarTransaccion({
          cuenta_id: 'interbanco', // Placeholder
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
