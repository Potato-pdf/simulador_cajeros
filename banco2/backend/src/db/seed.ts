import { CuentaDao } from "../daos/cuentaDao";
import { generarNumero16, generarNip } from "../utils/card_number_generator";

export async function seedDatabase() {
  const cuentas = [
    { titular: "Ana Gomez", saldo: 4000, pin: "1234", card_number: "2222111133334444" },
    { titular: "Carlos Ruiz", saldo: 6000, pin: "5678", card_number: "2222555566667777" },
  ];

  for (const cuenta of cuentas) {
    await CuentaDao.create(cuenta);
  }

  console.log("Database seeded");
}