type Compactable<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export function compact<T extends object>(obj: T): Compactable<T> {
  const result = {} as Compactable<T>;

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      (result as Record<string, unknown>)[key] = value;
    }
  }

  return result;
}
