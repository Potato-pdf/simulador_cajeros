import { CuentaDao } from "../../daos/cuentaDao";
import type { Cuenta } from "../../models/cuenta";

export class CuentaService {
  static async verificarCuenta(cardNumber: string, pin: string): Promise<Cuenta | null> {
    const cuenta = await CuentaDao.findByCardNumber(cardNumber);
    if (cuenta && cuenta.pin === pin) {
      return cuenta;
    }
    return null;
  }

  static async verificarSaldo(cuenta: Cuenta, monto: number): Promise<boolean> {
    return cuenta.saldo >= monto;
  }

  static async descontarSaldo(cuentaId: string, monto: number): Promise<void> {
    // Obtener saldo actual
    const cuenta = await CuentaDao.findById(cuentaId);
    if (!cuenta) throw new Error('Cuenta no encontrada');
    const newSaldo = cuenta.saldo - monto;
    await CuentaDao.updateSaldo(cuentaId, newSaldo);
  }
}
