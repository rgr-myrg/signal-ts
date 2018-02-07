import {Notifier} from "../../ts/notifier/Notifier";
import {Signal} from "../../ts/signal/Signal";

describe("Notifier Tests", () => {
	let notifier: Notifier;
	let onLoad:Signal<number>;
	let onComplete:Signal<number>;
	let subscriber: TestSubscriber;
	let handlerSpy: any;
	let completeSpy: any;

	class TestSubscriber {
		private data: number | undefined;
		private completed: boolean = false;
		public handler(data: number): void {
			this.data = data;
		}
		public complete(): void {
			this.completed = true;
		}
		public getData(): any {
			return this.data;
		}
		public isComplete(): boolean {
			return this.completed;
		}
	}

	beforeEach(() => {
		notifier = new Notifier();
		onLoad = new Signal();
		onComplete = new Signal();
		subscriber = new TestSubscriber();
		handlerSpy = spyOn(subscriber, "handler").and.callThrough();
		completeSpy = spyOn(subscriber, "complete").and.callThrough();

		onLoad.do(subscriber.handler).context(subscriber).bind();
		onComplete.do(subscriber.complete).context(subscriber).bind();
		onComplete.do(subscriber.complete).context(subscriber).bind();
	});

	it("now() should immediately notify the signal with the payload", () => {
		let data: number = 5;
		notifier.notify(onLoad).with(data).now();

		expect(subscriber.handler).toHaveBeenCalledWith(data);
		expect(subscriber.handler).toHaveBeenCalledTimes(1);
		expect(subscriber.getData()).toEqual(data);
	});

	it("when() should start the queue when the specified event is added to the queue", () => {
		notifier.when(onComplete).start();

		notifier.notify(onLoad).queue();
		notifier.notify(onLoad).queue();
		notifier.notify(onLoad).queue();
		notifier.notify(onComplete).queue();

		expect(subscriber.handler).toHaveBeenCalledTimes(3);
	});

	it("pause() should pause the queue at the specified point", () => {
		notifier.start();

		notifier.notify(onLoad).queue();
		notifier.notify(onLoad).queue();
		notifier.notify(onLoad).queue();
		notifier.pause();
		notifier.notify(onLoad).queue();

		expect(subscriber.handler).toHaveBeenCalledTimes(3);
	});

	it("queue() should add to the queue and not process without start()", () => {
		notifier.notify(onLoad).queue();
		notifier.notify(onLoad).queue();
		notifier.notify(onLoad).queue();

		expect(subscriber.handler).toHaveBeenCalledTimes(0);
	});

	it("delay() should postpone the callback", (done) => {
		notifier.notify(onComplete).delay(1000);
		setTimeout(() => {
			done();
			expect(subscriber.isComplete()).toBe(true);
			expect(subscriber.complete).toHaveBeenCalledTimes(1);
		}, 1000);
	});
});
