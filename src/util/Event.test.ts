import { expect, mock, test } from "bun:test";
import { createEvent, emit, Subscribe } from "./Event";

test("event subscription", () => {
  const TestEvent = createEvent();
  const fn = mock();

  class Subscriber {
    @Subscribe(TestEvent)
    listen() {
      fn();
    }
  }

  const subscriber = new Subscriber();
  emit(subscriber, TestEvent);
  expect(fn).toHaveBeenCalled();
});

test("emit event data", () => {
  const MessageEvent = createEvent<string>();
  const testMessage = "This is a test message!";
  const fn = mock();

  class Listener {
    @Subscribe(MessageEvent)
    listen(message: string) {
      fn(message);
    }
  }

  const listener = new Listener();
  emit(listener, MessageEvent, testMessage);
  expect(fn).toHaveBeenCalledWith(testMessage);
});
