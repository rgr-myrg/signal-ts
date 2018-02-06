import {Signal} from "../signal/Signal";
import {SlotType} from "../signal/SlotType";

export class Slot {
	private signal: Signal<any>;
	private listener: Function = new Function();
	private callee: Object | undefined;
	private slotType: SlotType = SlotType.normalPriority;

	constructor(signal: Signal<any>) {
		this.signal = signal;
	}

	public callback(callback: Function): Slot {
		this.listener = callback;
		return this;
	}

	public context(context: Object): Slot {
		this.callee = context;
		return this;
	}

	public getCallback(): Function {
		return this.listener;
	}

	public getCallee(): Object {
		return this.callee || this;
	}

	public getType(): SlotType {
		return this.slotType;
	}

	public once(): Slot {
		this.slotType = SlotType.executeOnce;
		return this;
	}

	public prioritize(): Slot {
		this.slotType = SlotType.highPriority;
		return this;
	}

	public bind(): void {
		this.signal.addSlot(this);
	}

	public destroy(): void {
		delete this.signal;
		delete this.listener;
		delete this.callee;
		delete this.slotType;
	}
}
