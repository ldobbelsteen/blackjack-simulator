/**
 * Heavily optimized array shuffling. Uses the Crypto API, specifically the
 * getRandomValues function. This is a cryptographically secure entropy source,
 * which should be sufficiently random in any use case.
 */
export class Shuffler {
  private index: number;
  private length: number;
  private entropy: Uint16Array;

  constructor() {
    this.index = 0;
    this.length = 65536 / Uint16Array.BYTES_PER_ELEMENT;
    this.entropy = new Uint16Array(this.length);
    this.fetchEntropy();
  }

  /** Fill the entropy array with new randomness */
  private fetchEntropy(): void {
    crypto.getRandomValues(this.entropy);
    this.index = 0;
  }

  /** Get a random Uint16 (two bytes) from the entropy */
  private twoRandomBytes(): number {
    const byte = this.entropy[(this.index += 1)];
    if (this.index === this.length) this.fetchEntropy();
    return byte;
  }

  /**
   * Shuffle an array using the Fischer-Yates shuffling algorithm. Uses a mask
   * to resize the two bytes we can extract from the entropy to the desired
   * size. Because the source of randomness is two bytes, the maximum array size
   * is 65536 (2^16). The mask is used to discard unnecessary bits, such that
   * after applying the mask, we have the least number of bits into which the
   * desired range falls. That way we waste less entropy. This results in a
   * uniform distribution and prevents any biases.
   */
  shuffle<T>(arr: T[]): void {
    let mask = 0;
    const length = arr.length;
    for (let index = length; index > 0; index >>= 1) mask = (mask << 1) | 1;
    for (let index = length - 1, random; index > 0; index--) {
      if ((index & (index + 1)) === 0) mask >>= 1;
      do {
        random = this.twoRandomBytes() & mask;
      } while (random > index);
      [arr[index], arr[random]] = [arr[random], arr[index]];
    }
  }
}
