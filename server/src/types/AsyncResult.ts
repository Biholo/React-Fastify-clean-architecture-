import { NonUndefined } from "@/types/NonUndefined";
import { Result } from "@thames/monads";

export type AsyncResult<
  T extends NonUndefined,
  U extends NonUndefined
> = Promise<Result<T, U>>;
