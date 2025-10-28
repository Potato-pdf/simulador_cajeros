function secureRandomDigits(length: number): string {
  if (length <= 0) throw new Error("length must be > 0");
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);

  return Array.from(bytes, (b) => String(b % 10)).join("");
}

/** Genera un número aleatorio de 16 dígitos (como string). */
export function generarNumero16(): string {
  return secureRandomDigits(16);
}

/** Genera un NIP/PIN de 'digits' dígitos (por defecto 4). */
export function generarNip(digits = 4): string {
  if (digits < 4 || digits >= 5) throw new Error("digits must be 4");
  return secureRandomDigits(digits);
}

