import { db_connection } from "../db/db_connection";

const CAJERO_ID = "cajero-2";

export class CajeroDao {
  static async getSaldo(): Promise<number> {
    return new Promise((resolve, reject) => {
      db_connection.get(
        "SELECT saldo FROM cajeros WHERE id = ?",
        [CAJERO_ID],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? row.saldo : 0);
          }
        }
      );
    });
  }

  static async updateSaldo(newSaldo: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db_connection.run(
        "UPDATE cajeros SET saldo = ? WHERE id = ?",
        [newSaldo, CAJERO_ID],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static async createIfNotExists(): Promise<void> {
    return new Promise((resolve, reject) => {
      db_connection.run(
        "INSERT OR IGNORE INTO cajeros (id, saldo) VALUES (?, ?)",
        [CAJERO_ID, 10000], // Saldo inicial
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}