import type { WithdrawCommand } from "./WithdrawCommand";
import { CuentaService } from "../../domain/services/CuentaService";
import { CajeroDao } from "../../daos/cajeroDao";
import { TransaccionDao } from "../../daos/transaccionDao";

export class WithdrawCommandHandler {
  static async handle(command: WithdrawCommand): Promise<{ success: boolean; message: string }> {
    try {
      // Detectar si la tarjeta es local (banco2) o remota (banco1)
      const isLocal = command.cardNumber.startsWith("22"); // Ajusta el prefijo según tu lógica
      if (!isLocal) {
        // Interbancario: consulta el backend de banco1
        const res = await fetch("http://localhost:3000/api/withdraw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardNumber: command.cardNumber,
            pin: command.pin,
            amount: command.amount,
          }),
        });
        const data = await res.json();
        return {
          success: data.success,
          message: data.message || (data.success ? "Retiro exitoso en banco1" : "Error interbancario: " + (data.message || "")),
        };
      }

      // Lógica local (banco2)
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
      const saldoCajero = await CajeroDao.getSaldo();
      if (saldoCajero < command.amount) {
        return { success: false, message: "Saldo insuficiente en el cajero" };
      }

      // Descontar de cuenta y cajero
      await CuentaService.descontarSaldo(cuenta.id, command.amount);
      await CajeroDao.updateSaldo(saldoCajero - command.amount);

      // Registrar transacción
      await TransaccionDao.create({
        cuenta_id: cuenta.id,
        tipo: 'retiro',
        monto: command.amount,
        fecha: new Date(),
        banco_origen: 'banco2',
      });

      return { success: true, message: "Retiro exitoso" };
    } catch (error) {
      return { success: false, message: "Error en la transacción" };
    }
  }
}