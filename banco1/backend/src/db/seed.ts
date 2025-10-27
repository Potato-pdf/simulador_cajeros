import { CuentaDao } from "../daos/cuentaDao";
import { generarNumero16, generarNip } from "../utils/card_number_generator";

export async function seedDatabase() {
  // Crear cuentas de ejemplo
  const cuentas = [
    { titular: "Juan Perez", saldo: 5000, pin: generarNip(), card_number: "1" + generarNumero16().slice(1) },
    { titular: "Maria Lopez", saldo: 3000, pin: generarNip(), card_number: "1" + generarNumero16().slice(1) },
  ];

  for (const cuenta of cuentas) {
    await CuentaDao.create(cuenta);
  }

  console.log("Database seeded");
}