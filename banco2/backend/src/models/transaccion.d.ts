export interface Transaccion {
  id: string;
  cuenta_id: string;
  tipo: 'retiro' | 'deposito' | 'transferencia';
  monto: number;
  fecha: Date;
  banco_origen?: string;
  banco_destino?: string;
}