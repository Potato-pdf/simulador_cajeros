import { uuid } from "../utils/types";

export interface Cuenta {
  id: uuid;
  titular: string;
  saldo: number;
}