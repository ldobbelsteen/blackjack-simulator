export type EntropySource = "crypto" | "math" | "deterministic";

/** Heavily optimized array shuffler. */
export class Shuffler {
  private index: number;
  private length: number;
  private entropy: Uint16Array;
  private entropySource: (arr: Uint16Array) => void;

  constructor(entropySource: EntropySource = "crypto") {
    this.index = 0;
    this.length = 65536 / Uint16Array.BYTES_PER_ELEMENT;
    this.entropy = new Uint16Array(this.length);

    switch (entropySource) {
      case "crypto":
        this.entropySource = cryptoEntropySource;
        break;
      case "math":
        this.entropySource = mathEntropySource;
        break;
      case "deterministic":
        this.entropySource = deterministicEntropySource;
        break;
    }

    this.fetchEntropy();
  }

  /** Fill the entropy array with new randomness. */
  private fetchEntropy(): void {
    this.entropySource(this.entropy);
    this.index = 0;
  }

  /** Get a random Uint16 (two bytes) from the entropy. */
  private twoRandomBytes(): number {
    const bytes = this.entropy[this.index];
    this.index += 1;
    if (this.index === this.length) {
      this.fetchEntropy();
    }
    return bytes;
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
    for (let index = length - 1, random: number; index > 0; index -= 1) {
      if ((index & (index + 1)) === 0) mask >>= 1;
      do {
        random = this.twoRandomBytes() & mask;
      } while (random > index);
      [arr[index], arr[random]] = [arr[random], arr[index]];
    }
  }
}

/**
 * Entropy source using the Crypto API, specifically the getRandomValues function.
 * This is a cryptographically secure entropy source, which should be sufficiently
 * random for any use case.
 */
function cryptoEntropySource(arr: Uint16Array) {
  crypto.getRandomValues(arr);
}

/** Entropy source using the Math API. */
function mathEntropySource(arr: Uint16Array) {
  for (let i = 0; i < arr.length; i += 1) {
    const rand = Math.random();
    arr[i] = Math.floor(rand * 65536);
  }
}

/** Deterministic entropy source for testing purposes. */
function deterministicEntropySource(arr: Uint16Array) {
  let seed = 1;
  for (let i = 0; i < arr.length; i += 1) {
    const rand = seededRandom(seed++);
    arr[i] = Math.floor(rand * 65536);
  }
}

/** Get a random number between 0 and 1 with a seed (not very random). */
function seededRandom(seed: number) {
  const result = Math.sin(seed) * 10000;
  return result - Math.floor(result);
}
