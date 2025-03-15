import { NonUndefined } from "@/types/NonUndefined";
import { Option } from "@thames/monads";

export type AsyncOption<T extends NonUndefined> = Promise<Option<T>>;
