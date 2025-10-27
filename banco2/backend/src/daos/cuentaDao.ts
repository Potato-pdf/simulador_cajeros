import { db_connection } from "../db/db_connection";
import type { Cuenta } from "../models/cuenta";

export class CuentaDao {
  static async findByCardNumber(cardNumber: string): Promise<Cuenta | null> {
    return new Promise((resolve, reject) => {
      db_connection.get(
        "SELECT id, titular, saldo, pin, card_number FROM cuentas WHERE card_number = ?",
        [cardNumber],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? (row as Cuenta) : null);
          }
        }
      );
    });
  }

  static async findByTitular(titular: string): Promise<Cuenta | null> {
    return new Promise((resolve, reject) => {
      db_connection.get(
        "SELECT id, titular, saldo, pin, card_number FROM cuentas WHERE titular = ?",
        [titular],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? (row as Cuenta) : null);
          }
        }
      );
    });
  }

  static async findById(id: string): Promise<Cuenta | null> {
    return new Promise((resolve, reject) => {
      db_connection.get(
        "SELECT id, titular, saldo, pin, card_number FROM cuentas WHERE id = ?",
        [id],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? (row as Cuenta) : null);
          }
        }
      );
    });
  }

  static async updateSaldo(id: string, newSaldo: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db_connection.run(
        "UPDATE cuentas SET saldo = ? WHERE id = ?",
        [newSaldo, id],
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

  static async create(cuenta: Omit<Cuenta, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      db_connection.run(
        "INSERT INTO cuentas (id, titular, saldo, pin, card_number) VALUES (?, ?, ?, ?, ?)",
        [id, cuenta.titular, cuenta.saldo, cuenta.pin, cuenta.card_number],
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