import {Signal} from "../signal/Signal";
import {Notifier} from "../notifier/Notifier";
import {QueueType} from "../notifier/QueueType";

export class EventBundle {
	private notifier: Notifier;
	private signal: Signal<any> = new Signal<any>();
	private payload: any | undefined;
	private type: QueueType = QueueType.now;
	private milliseconds:number = 0;

	constructor(notifier: Notifier) {
		this.notifier = notifier;
	}

	public notify(signal: Signal<any>): EventBundle {
		this.signal = signal;
		return this;
	}

	public with(payload: any): EventBundle {
		this.payload = payload;
		return this;
	}

	public queue(): void {
		this.type = QueueType.queue;
		this.notifier.schedule(this);
	}

	public delay(milliseconds: number): void {
		this.type = QueueType.delay;
		this.milliseconds = milliseconds;
		this.notifier.schedule(this);
	}

	public now(): void {
		this.type = QueueType.now;
		this.notifier.schedule(this);
	}

	public getType(): QueueType {
		return this.type;
	}

	public getSignal(): Signal<any> {
		return this.signal;
	}

	public getDelayTime(): number {
		return this.milliseconds;
	}

	public emitSignal(): void {
		if (!this.signal) return;
		this.signal.emit(this.payload);
	}
}
