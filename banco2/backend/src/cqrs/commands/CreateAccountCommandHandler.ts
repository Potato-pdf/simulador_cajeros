import type { CreateAccountCommand } from "./CreateAccountCommand";
import { CuentaDao } from "../../daos/cuentaDao";

export class CreateAccountCommandHandler {
  static async handle(command: CreateAccountCommand): Promise<{ cardNumber: string; pin: string }> {
    // Verificar si el titular ya tiene una cuenta
    const existingAccount = await CuentaDao.findByTitular(command.titular);
    if (existingAccount) {
      throw new Error("Ya existe una cuenta para este titular");
    }

    let cardNumber: string;
    let attempts = 0;
    do {
      cardNumber = "22" + Math.floor(Math.random() * 1e14).toString().padStart(14, '0'); // Para banco 2, 16 dígitos total
      attempts++;
      if (attempts > 10) {
        throw new Error("No se pudo generar un número de tarjeta único");
      }
    } while (await CuentaDao.findByCardNumber(cardNumber) !== null);

    const pin = (Math.floor(1000 + Math.random() * 9000)).toString();

    await CuentaDao.create({
      titular: command.titular,
      saldo: command.saldoInicial,
      pin,
      card_number: cardNumber,
    });

    return { cardNumber, pin };
  }
}