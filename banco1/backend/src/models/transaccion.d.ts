import { uuid } from "../utils/types";

export interface Transaccion {
  id: uuid;
  cuenta_id: uuid;
  tipo: 'retiro' | 'deposito' | 'transferencia';
  monto: number;
  fecha: Date;
  banco_origen?: string;
  banco_destino?: string;
}