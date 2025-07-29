interface Event<_> {
  id: symbol;
}

export function createEvent<D = undefined>(): Event<D> {
  return { id: Symbol() };
}

type SubscriptionData = Record<symbol, any[]>; // TODO update value type to method

const SUBSCRIPTION_SYMBOL = Symbol("subscriptions");
function getSubscriptionData(target: object): SubscriptionData {
  if (!Reflect.has(target, SUBSCRIPTION_SYMBOL))
    Reflect.set(target, SUBSCRIPTION_SYMBOL, {});
  return Reflect.get(target, SUBSCRIPTION_SYMBOL);
}

interface SubscribedFunction<D> extends PropertyDescriptor {
  value?: (data: D) => void;
}

export function Subscribe<D>(event: Event<D>) {
  return (target: object, key: string, _: SubscribedFunction<D>) => {
    const data = getSubscriptionData(target);
    if (!data[event.id]) data[event.id] = [];
    data[event.id]!.push(Reflect.get(target, key));
  };
}

export function emit<D>(target: object, event: Event<D>, data?: D) {
  const subscriptions = getSubscriptionData(target)[event.id] ?? [];
  for (const handler of subscriptions) handler(data);
}
