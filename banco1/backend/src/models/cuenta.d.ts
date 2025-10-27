import { uuid, card_number } from "../utils/types";

export interface Cuenta {
  id: uuid;
  titular: string;
  saldo: number;
  pin: string;
  card_number: card_number;
}