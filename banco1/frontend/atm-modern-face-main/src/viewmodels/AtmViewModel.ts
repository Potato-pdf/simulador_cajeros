import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type Step = 'card' | 'pin' | 'amount' | 'receipt';

export interface AtmState {
  step: Step;
  cardNumber: string;
  pin: string;
  amount: number;
  isLoading: boolean;
  errorMessage: string;
}

/**
 * AtmViewModel - MVVM Pattern Implementation
 * 
 * Responsabilidades:
 * - Mantener el estado reactivo de la aplicación
 * - Exponer observables para que las vistas se suscriban
 * - Ejecutar la lógica de presentación
 * - Comunicarse con el Presenter (que luego se comunica con el backend)
 */
export class AtmViewModel {
  // BehaviorSubject privado para mantener el estado
  private stateSubject = new BehaviorSubject<AtmState>({
    step: 'card',
    cardNumber: '',
    pin: '',
    amount: 0,
    isLoading: false,
    errorMessage: '',
  });

  // Observables públicos - las vistas se suscriben a estos
  public state$: Observable<AtmState> = this.stateSubject.asObservable();

  // Observables derivados para fácil acceso a propiedades específicas
  public step$: Observable<Step> = this.state$.pipe(map(state => state.step));
  public cardNumber$: Observable<string> = this.state$.pipe(map(state => state.cardNumber));
  public pin$: Observable<string> = this.state$.pipe(map(state => state.pin));
  public amount$: Observable<number> = this.state$.pipe(map(state => state.amount));
  public isLoading$: Observable<boolean> = this.state$.pipe(map(state => state.isLoading));
  public errorMessage$: Observable<string> = this.state$.pipe(map(state => state.errorMessage));

  /**
   * Obtiene el estado actual sin necesidad de Observable
   */
  get currentState(): AtmState {
    return this.stateSubject.getValue();
  }

  /**
   * Actualiza el estado de forma reactiva
   */
  private updateState(partial: Partial<AtmState>): void {
    const currentState = this.currentState;
    this.stateSubject.next({ ...currentState, ...partial });
  }

  /**
   * Comando: Navegar a siguiente paso
   */
  public goToNextStep(): void {
    const currentStep = this.currentState.step;
    const nextStep: Step = 
      currentStep === 'card' ? 'pin' :
      currentStep === 'pin' ? 'amount' :
      currentStep === 'amount' ? 'receipt' :
      'card';
    
    this.updateState({ step: nextStep });
  }

  /**
   * Comando: Ir a paso específico
   */
  public goToStep(step: Step): void {
    this.updateState({ step });
  }

  /**
   * Comando: Establecer número de tarjeta
   */
  public setCardNumber(cardNumber: string): void {
    this.updateState({ cardNumber });
  }

  /**
   * Comando: Establecer PIN
   */
  public setPin(pin: string): void {
    this.updateState({ pin });
  }

  /**
   * Comando: Establecer monto
   */
  public setAmount(amount: number): void {
    this.updateState({ amount });
  }

  /**
   * Comando: Establecer estado de carga
   */
  public setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  /**
   * Comando: Establecer mensaje de error
   */
  public setError(errorMessage: string): void {
    this.updateState({ errorMessage });
  }

  /**
   * Comando: Limpiar mensaje de error
   */
  public clearError(): void {
    this.updateState({ errorMessage: '' });
  }

  /**
   * Comando: Verificar tarjeta (simulación)
   * En implementación real, aquí iría la lógica de negocio
   */
  public async verifyCard(cardNumber: string): Promise<boolean> {
    this.setLoading(true);
    this.clearError();

    try {
      const response = await fetch(`http://localhost:3000/api/verify?cardNumber=${cardNumber}`);
      const data = await response.json();

      if (data.valid) {
        this.setCardNumber(cardNumber);
        this.goToNextStep(); // card -> pin
        return true;
      } else {
        this.setError('Tarjeta inválida');
        return false;
      }
    } catch (error) {
      this.setError('Error al verificar tarjeta');
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Comando: Verificar PIN
   */
  public async verifyPin(pin: string): Promise<boolean> {
    this.setLoading(true);
    this.clearError();

    try {
      if (pin.length === 4) {
        this.setPin(pin);
        this.goToNextStep(); // pin -> amount
        return true;
      } else {
        this.setError('PIN inválido (debe tener 4 dígitos)');
        return false;
      }
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Comando: Procesar retiro
   */
  public async withdraw(amount: number): Promise<boolean> {
    this.setLoading(true);
    this.clearError();

    try {
      const { cardNumber, pin } = this.currentState;

      const response = await fetch('http://localhost:3000/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, pin, amount })
      });

      const data = await response.json();

      if (data.success) {
        this.setAmount(amount);
        this.goToNextStep(); // amount -> receipt
        return true;
      } else {
        this.setError(data.message || 'Error en la transacción');
        return false;
      }
    } catch (error) {
      this.setError('Error en la transacción');
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Comando: Resetear sesión
   */
  public resetSession(): void {
    this.stateSubject.next({
      step: 'card',
      cardNumber: '',
      pin: '',
      amount: 0,
      isLoading: false,
      errorMessage: '',
    });
  }

  /**
   * Comando: Retroceder un paso
   */
  public goBack(): void {
    const currentStep = this.currentState.step;
    const previousStep: Step = 
      currentStep === 'pin' ? 'card' :
      currentStep === 'amount' ? 'pin' :
      currentStep === 'receipt' ? 'amount' :
      'card';

    this.updateState({ step: previousStep });
  }
}
