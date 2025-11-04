import type { WithdrawCommand } from "./WithdrawCommand";
import { CuentaService } from "../../domain/services/CuentaService";
import { CajeroService } from "../../domain/services/CajeroService";
import { TransaccionService } from "../../domain/services/TransaccionService";
import { ExternalBankService } from "../../domain/services/ExternalBankService";

export class WithdrawCommandHandler {
  static async handle(command: WithdrawCommand & { isInterbankRequest?: boolean }): Promise<{ success: boolean; message: string }> {
    try {
      const isSameBank = command.cardNumber.startsWith('22');

      if (isSameBank) {
        const cuenta = await CuentaService.verificarCuenta(command.cardNumber, command.pin);
        if (!cuenta) {
          return { success: false, message: "Tarjeta o PIN incorrecto" };
        }

        const saldoSuficienteCuenta = await CuentaService.verificarSaldo(cuenta, command.amount);
        if (!saldoSuficienteCuenta) {
          return { success: false, message: "Saldo insuficiente en la cuenta" };
        }

        if (!command.isInterbankRequest) {
          const saldoSuficienteCajero = await CajeroService.verificarSaldo(command.amount);
          if (!saldoSuficienteCajero) {
            return { success: false, message: "Saldo insuficiente en el cajero" };
          }
        }

        await CuentaService.descontarSaldo(cuenta.id, command.amount);
        
        if (!command.isInterbankRequest) {
          await CajeroService.descontarSaldo(command.amount);
        }

        await TransaccionService.registrarTransaccion({
          cuenta_id: cuenta.id,
          tipo: 'retiro',
          monto: command.amount,
          fecha: new Date(),
          banco_origen: 'banco2',
        });
      } else {
        const interbankResult = await ExternalBankService.performInterbankWithdrawal(command.cardNumber, command.pin, command.amount);
        if (!interbankResult.success) {
          return { success: false, message: interbankResult.message };
        }
        await CajeroService.descontarSaldo(command.amount);
        await TransaccionService.registrarTransaccion({
          cuenta_id: 'external', 
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