import "reflect-metadata";
import { Container, ServiceIdentifier, Newable } from "inversify";

export const container = new Container();

export function bindIdentifier<T>(
  identifier: ServiceIdentifier<T>,
  instance: Newable<T>
) {
  return container.bind(identifier).to(instance).inSingletonScope();
}

export function bindSelf<T>(instance: Newable<T>) {
  return container.bind(instance).toSelf().inSingletonScope();
}

export function getInstance<T>(identifier: ServiceIdentifier<T>): T {
  return container.get(identifier);
}
