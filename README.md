[![Build Status](https://travis-ci.org/rgr-myrg/signal-ts.svg?branch=master)](https://travis-ci.org/rgr-myrg/signal-ts) [![npm version](https://badge.fury.io/js/signal-ts.svg)](https://badge.fury.io/js/signal-ts)

# TypeScript Signal 

[Signal Pattern](https://en.wikipedia.org/wiki/Signals_and_slots) pattern written in Typescript.

Signals are typed and easy to use! 

# Installation

```
npm install signal-ts
```

# Usage

### Creating a Signal

Create an instance of Signal with the specified type, i.e, _string_, _number_, etc.

```typescript
import {Signal} from "signal-ts";

let onCompleted: Signal<number> = new Signal();
```

### Add function callback

Register a callback with **add()**.

```typescript
onCompleted.add((n: number) => {
	console.log("got a number", n);
});
```

You can also register a callback only **once()**.

```typescript
onCompleted.once(n: number) => {
	console.log("got a number once", n);
});
```

### Emitting a Signal

```typescript
onCompleted.emit(299792458);
```

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
class Receiver {
	private message: string;

	constructor() {
		Event.onLoaded.add(this.loaded);
	}
	public loaded(message: string): void {
		this.message = message;
	}
}
```

### Remove a callback

```typescript
Event.onLoaded.remove(this.callback);
```

# License

[MIT License](https://raw.githubusercontent.com/rgr-myrg/signal-slot/master/LICENSE)
