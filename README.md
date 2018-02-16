[![Build Status](https://travis-ci.org/rgr-myrg/signal-slot-ts.svg?branch=master)](https://travis-ci.org/rgr-myrg/signal-slot-ts)

# Signal Slot

[Signals and Slots](https://en.wikipedia.org/wiki/Signals_and_slots) pattern written in Typescript.

# Installation

```
npm install signal-slot
```

# Usage

### Creating a Signal

Create an instance of Signal with the specified type, i.e, _string_, _number_, etc.

```typescript
import {Signal} from "signal-slot";

let onCompleted: Signal<number> = new Signal();
```

### Binding a function callback

Bind a simple callback with **do()** and **bind()**.

```typescript
onCompleted.do((n: number) => {
	console.log("got a number", n);
}).bind();
```

You can also **prioritize()** a callback.

```typescript
onCompleted.do((n: number) => {
	console.log("got a priority number", n);
}).prioritize().bind();
```

Or run the callback only **once()**.

```typescript
onCompleted.do((n: number) => {
	console.log("got a number once", n);
}).once().bind();
```

### Execution Context

Use the **context()** when a function should be called as a method of an object.

```typescript
onCompleted.do(this.methodHandler).context(this).bind();
```

### Emitting a Signal

```typescript
onCompleted.emit(299792458);
```
# Built-in Notifier
The Notifier comes with a queue that can be controlled with _start()_, _pause()_, _flush()_, _now()_, _delay()_, and _when()_ methods.

You can delegate emitting signals to the notifier if you need signals to emit in sequence. In other words, if the order of events is important to your app, you can use the Notifier to your advantage.

Create an instance of Notifier:
```typescript
import {Notifier} from "signal-slot";

let notifier = new Notifier();
```
To add signal events to the queue:
```typescript
let onStarted: Signal<string> = new Signal();
let onCompleted: Signal<string> = new Signal();
notifier.notify(onStarted).with("data").queue();
notifier.notify(onCompleted).with("data").queue();
```
To start processing the queue:
```typescript
notifier.start();
```
To pause the queue:
```typescript
notifier.pause();
```
Use _now()_ to bypass the queue and notify immediately:
```typescript
notifier.notify(onStarted).with("data").now();
```
Use _delay()_ to bypass the queue and delay the notification:
```typescript
notifier.notify(onCompleted).with("data").delay(1000);
```
### Capturing signals and controlling when to start the queue
Sometimes there is a need to add signal events to the queue and fire them if and only _when()_ a specific signal was dispatched.

For example your app needs to load configuration data async but the sequence of events needs to be maintained until the async is complete.

```typescript
// Tell notifier to start only when onAsyncCompleted is notified
notifier.when(onAsyncCompleted).start();

// Capture sequence
notifier.notify(onLoaded).with("data").queue();
notifier.notify(onStarted).with("data").queue();
notifier.notify(onCompleted).queue();

// The following will trigger the queue start
notifier.notify(onAsyncCompleted).queue();
```
In the above scenario the queue will only start to process once a notification for the onAsyncCompleted signal is added to the queue.

# Pro-Tips

### Organize your events in a module or namespace.

```typescript
export namespace Event {
	export const onLoaded: Signal<string> = new Signal();
	export const onCompleted: Signal<number> = new Signal();
}
```

### Bind to events in your constructor.

```typescript
class Subscriber {
	private message: string;
	constructor() {
		Event.onLoaded
			.do(this.loaded)
			.once()
			.context(this)
			.bind();
	}
	public loaded(message: string): void {
		this.message = message;
	}
}
```

### Remove a callback

```typescript
Event.onLoaded.unbind(this.callback);
```

## Sequence Diagram

![Diagram](sequence-diagram.svg)

# To-do

- Code comments and JsDoc

# License

[MIT License](https://raw.githubusercontent.com/rgr-myrg/signal-slot/master/LICENSE)
