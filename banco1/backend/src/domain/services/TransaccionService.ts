import { TransaccionDao } from "../../daos/transaccionDao";
import type { Transaccion } from "../../models/transaccion";

export class TransaccionService {
  static async registrarTransaccion(transaccion: Omit<Transaccion, 'id'>): Promise<string> {
    return await TransaccionDao.create(transaccion);
  }
}