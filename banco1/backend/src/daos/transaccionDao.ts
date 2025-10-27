import { db_write_connection } from "../db/db_write_connection";
import type { Transaccion } from "../models/transaccion";

export class TransaccionDao {
  static async create(transaccion: Omit<Transaccion, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      db_write_connection.run(
        "INSERT INTO transacciones (id, cuenta_id, tipo, monto, fecha, banco_origen, banco_destino) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, transaccion.cuenta_id, transaccion.tipo, transaccion.monto, transaccion.fecha.toISOString(), transaccion.banco_origen, transaccion.banco_destino],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(id);
          }
        }
      );
    });
  }
}