import { Serialize } from "@/types/Serialize";

export function serialize<T extends object>(obj: T): Serialize<T> {
  // recusrive stringify dates
  const replacer = (key: string, value: any) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  };

  return JSON.parse(JSON.stringify(obj, replacer));
}
