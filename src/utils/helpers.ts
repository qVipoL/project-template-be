export function exclude<T extends object, Key extends keyof T>(
  obj: T,
  keys: Key[],
): Omit<T, Key> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<T, Key>;
}

export function excludeFromArray<T extends object, Key extends keyof T>(
  arr: T[],
  keys: Key[],
): Omit<T, Key>[] {
  return arr.map(
    (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key as Key)),
      ) as Omit<T, Key>,
  );
}
