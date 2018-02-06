import {Signal} from "../../ts/signal/Signal";

describe("Signal Tests", () => {
	let onLoad:Signal<number>;
	let subscriber: TestSubscriber;
	let handlerSpy: any;

	class TestSubscriber {
		private data: number | undefined;
		public handler(data: number): void {
			this.data = data;
		}
		public priority(data: number): void {
			this.data = data;
		}
		public noData(): void {}
		public getData(): any {
			return this.data;
		}
	}

	beforeEach(() => {
		onLoad = new Signal();
		subscriber = new TestSubscriber();
		handlerSpy = spyOn(subscriber, "handler").and.callThrough();
		spyOn(subscriber, "priority").and.callThrough();
		spyOn(subscriber, "noData").and.callThrough();
	});

	it("emit() should notify with the test data", () => {
		let data: number = 1;

		onLoad.do(subscriber.handler).context(subscriber).bind();
		onLoad.emit(data);

		expect(subscriber.handler).toHaveBeenCalledWith(data);
		expect(subscriber.getData()).toEqual(data);
	});

	it("emit() should notify the listener only once", () => {
		onLoad.do(subscriber.handler).once().context(subscriber).bind();

		onLoad.emit(1);
		onLoad.emit(2);

		expect(subscriber.handler).toHaveBeenCalledWith(1);
		expect(subscriber.getData()).toEqual(1);
		expect(subscriber.handler).toHaveBeenCalledTimes(1);
	});

	it("do() should prevent listeners from registering multiple times", () => {
		let func: Function = (data: number) => subscriber.handler(data);

		// try to register multiple times
		for (let x: number = 0; x < 5; x++) {
			onLoad.do(func).bind();
		}

		onLoad.emit(1);

		expect(subscriber.handler).toHaveBeenCalledWith(1);
		expect(subscriber.handler).toHaveBeenCalledTimes(1);
		expect(subscriber.getData()).toEqual(1);
	});

	it("prioritize() should execute the priority listener ahead of the queue", () => {
		onLoad.do(subscriber.handler).context(subscriber).bind();
		onLoad.do(subscriber.priority).prioritize().context(subscriber).bind();
		onLoad.emit(1);
		expect(subscriber.priority).toHaveBeenCalledBefore(handlerSpy);
	});

	it("unbind() should delete the listener from the queue", () => {
		let func: Function = (data: number) => subscriber.handler(data);
		onLoad.do(func).bind();
		onLoad.emit(1);
		onLoad.unbind(func);
		onLoad.emit(2);

		expect(subscriber.handler).toHaveBeenCalledTimes(1);
	});

	it("unbind() should delete the listener from the priority queue", () => {
		let func: Function = (data: number) => subscriber.handler(data);
		onLoad.do(func).prioritize().bind();
		onLoad.do(subscriber.priority).context(subscriber).bind();
		onLoad.emit(1);
		onLoad.unbind(func);
		onLoad.emit(2);

		expect(subscriber.handler).toHaveBeenCalledWith(1);
		expect(subscriber.handler).toHaveBeenCalledTimes(1);
		expect(subscriber.getData()).toEqual(2);
		expect(subscriber.priority).toHaveBeenCalledTimes(2);
	});

	it("emit() should notify the listener without parameters", () => {
		onLoad.do(subscriber.noData).context(subscriber).bind();
		onLoad.emit();

		expect(subscriber.noData).toHaveBeenCalled();
		expect(subscriber.noData).toHaveBeenCalledTimes(1);
	});
});
