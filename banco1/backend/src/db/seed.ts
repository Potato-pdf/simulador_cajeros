import { CuentaDao } from "../daos/cuentaDao";
import { generarNumero16, generarNip } from "../utils/card_number_generator";

export async function seedDatabase() {
  // Crear cuentas de ejemplo con tarjetas fijas para testing
  const cuentas = [
    { titular: "Juan Perez", saldo: 5000, pin: "1234", card_number: "1111222233334444" },
    { titular: "Maria Lopez", saldo: 3000, pin: "5678", card_number: "1111555566667777" },
  ];

  for (const cuenta of cuentas) {
    await CuentaDao.create(cuenta);
  }

  console.log("Database seeded");
}