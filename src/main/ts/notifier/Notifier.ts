import {Signal} from "../signal/Signal";
import {EventBundle} from "../notifier/EventBundle";
import {QueueType} from "../notifier/QueueType";

export class Notifier {
	private liveQueue: Signal<any>[] = [];
	private delayQueue: Signal<any>[] = [];
	private queue: EventBundle[] = [];
	private matchSignal: Signal<any> | undefined;
	private shouldRun: boolean = false;

	public notify(signal: Signal<any>):EventBundle {
		return new EventBundle(this).notify(signal);
	}

	public when(signal: Signal<any>): Notifier {
		this.matchSignal = signal;
		return this;
	}

	public start(): void {
		this.shouldRun = true;
	}

	public pause(): void {
		this.shouldRun = false;
	}

	public flush(): void {
		this.shouldRun = true;
		this.processQueue();
		this.shouldRun = false;
	}

	public schedule(bundle: EventBundle): void {
		switch (bundle.getType()) {
			case QueueType.delay:
				this.postDelay(bundle);
				break;
			case QueueType.queue:
				this.postQueue(bundle);
				break;
			case QueueType.now:
				this.postNow(bundle);
				break;
		}
	}

	private postQueue(bundle: EventBundle): void {
		this.queue.unshift(bundle);

		if (this.matchSignal && this.matchSignal === bundle.getSignal()) {
			this.shouldRun = true;
		}

		this.processQueue();
	}

	private postDelay(bundle: EventBundle): void {
		setTimeout(() => {bundle.emitSignal()}, bundle.getDelayTime());
	}

	private postNow(bundle: EventBundle): void {
		bundle.emitSignal();
	}

	private processQueue():void {
		// http://jsbench.github.io/#174d623c29798680e44b867dcf9732e7
		// Reverse loop with implicit comparison
		for (let i = this.queue.length; i--;) {
			if (!this.shouldRun) break;
			// non-null assertion operator postfix.
			this.queue.shift()!.emitSignal();
		}
	}
}
