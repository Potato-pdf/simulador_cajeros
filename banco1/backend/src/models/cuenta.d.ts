import { uuid } from "./uuid";

export interface Cuenta {
  id: uuid;
  titular: string;
  saldo: number;
}