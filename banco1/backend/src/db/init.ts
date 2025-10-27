import { db_write_connection } from "./db_write_connection";
import { CajeroDao } from "../daos/cajeroDao";
import { seedDatabase } from "./seed";

export async function initDatabase() {
  return new Promise<void>((resolve, reject) => {
    db_write_connection.serialize(() => {
      db_write_connection.run(`
        CREATE TABLE IF NOT EXISTS cuentas (
          id TEXT PRIMARY KEY,
          titular TEXT NOT NULL,
          saldo REAL NOT NULL,
          pin TEXT NOT NULL,
          card_number TEXT UNIQUE NOT NULL
        )
      `);

      db_write_connection.run(`
        CREATE TABLE IF NOT EXISTS cajeros (
          id TEXT PRIMARY KEY,
          saldo REAL NOT NULL
        )
      `);

      db_write_connection.run(`
        CREATE TABLE IF NOT EXISTS transacciones (
          id TEXT PRIMARY KEY,
          cuenta_id TEXT NOT NULL,
          tipo TEXT NOT NULL,
          monto REAL NOT NULL,
          fecha TEXT NOT NULL,
          banco_origen TEXT,
          banco_destino TEXT,
          FOREIGN KEY (cuenta_id) REFERENCES cuentas (id)
        )
      `, async (err) => {
        if (err) {
          reject(err);
        } else {
          // Inicializar cajero si no existe
          await CajeroDao.createIfNotExists();
          // Seed data
          await seedDatabase();
          resolve();
        }
      });
    });
  });
}