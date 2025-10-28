import { CajeroDao } from "../../daos/cajeroDao";

export class CajeroService {
  static async verificarSaldo(monto: number): Promise<boolean> {
    const saldo = await CajeroDao.getSaldo();
    return saldo >= monto;
  }

  static async descontarSaldo(monto: number): Promise<void> {
    const saldoActual = await CajeroDao.getSaldo();
    const newSaldo = saldoActual - monto;
    await CajeroDao.updateSaldo(newSaldo);
  }
}