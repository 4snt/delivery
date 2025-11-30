// Converts BigInt values to Number recursively so NextResponse.json can serialize
export function serializeBigInt<T>(data: T): any {
  if (typeof data === 'bigint') {
    return Number(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeBigInt(item));
  }

  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        key,
        serializeBigInt(value),
      ]),
    );
  }

  return data;
}
