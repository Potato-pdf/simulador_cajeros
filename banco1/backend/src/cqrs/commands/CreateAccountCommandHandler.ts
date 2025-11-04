import type { CreateAccountCommand } from "./CreateAccountCommand";
import { CuentaDao } from "../../daos/cuentaDao";
import { generarNumero16, generarNip } from "../../utils/card_number_generator";

export class CreateAccountCommandHandler {
  static async handle(command: CreateAccountCommand): Promise<{ cardNumber: string; pin: string }> {
    const existingAccount = await CuentaDao.findByTitular(command.titular);
    if (existingAccount) {
      throw new Error("Ya existe una cuenta para este titular");
    }

    let cardNumber: string;
    let attempts = 0;
    do {
      cardNumber = "11" + generarNumero16().slice(2);
      attempts++;
      if (attempts > 10) {
        throw new Error("No se pudo generar un número de tarjeta único");
      }
    } while (await CuentaDao.findByCardNumber(cardNumber) !== null);

    const pin = generarNip();

    await CuentaDao.create({
      titular: command.titular,
      saldo: command.saldoInicial,
      pin,
      card_number: cardNumber,
    });

    return { cardNumber, pin };
  }
}