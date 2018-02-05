import {Slot} from "../signal/Slot";
import {SlotType} from "../signal/SlotType";

export class Signal<T> {
	private slotsPriority: Slot[] = [];
	private slotsOnce: Slot[] = [];
	private slots: Slot[] = [];

	public do(listener: Function): Slot {
		return new Slot(this).callback(listener);
	}

	public unbind(listener: Function): Signal<T> {
		this.slotsPriority = this.filter(listener, this.slotsPriority);
		this.slotsOnce = this.filter(listener, this.slotsOnce);
		this.slots = this.filter(listener, this.slots);

		return this;
	}

	public addSlot(slot: Slot): void {
		switch (slot.getType()) {
			case SlotType.highPriority:
				this.registerPriority(slot);
				break;
			case SlotType.executeOnce:
				this.registerOnce(slot);
				break;
			case SlotType.normalPriority:
				this.registerNormal(slot);
				break;
			default:
				break;
		}
	}

	public emit(data: T): void;
	public emit(): void;
	public emit(): void {console.log("[emit]", arguments);
		if (this.slotsPriority.length > 0) {
			this.notify(this.slotsPriority, arguments[0]);
		}
		if (this.slotsOnce.length > 0) {
			this.notify(this.slotsOnce, arguments[0]);
			this.slotsOnce = [];
		}
		if (this.slots.length > 0) {
			this.notify(this.slots, arguments[0]);
		}
	}

	private notify(slots: Slot[], payload: T):void {
		// http://jsbench.github.io/#174d623c29798680e44b867dcf9732e7
		// Reverse loop with implicit comparison
		for (let i = slots.length; i--;) {
			let slot: Slot = slots[i];
			slot.getCallback().call(slot.getCallee() || this, payload);
		}
	}

	private registerPriority(slot: Slot): void {
		if (!this.hasSlot(slot.getCallback(), this.slotsPriority)) {
			this.slotsPriority.unshift(slot);
		}
	}

	private registerOnce(slot: Slot): void {
		if (!this.hasSlot(slot.getCallback(), this.slotsOnce)) {
			this.slotsOnce.unshift(slot);
		}
	}

	private registerNormal(slot: Slot): void {
		if (!this.hasSlot(slot.getCallback(), this.slots)) {
			this.slots.unshift(slot);
		}
	}

	private filter(callback: Function, slots: Slot[]): Slot[] {
		let filteredSlots: Slot[] = slots.filter(
			item => item.getCallback() !== callback
		);

		return filteredSlots;
	}

	private hasSlot(callback: Function, slots: Slot[]): boolean {
		return slots.some((item) => {
			return item.getCallback() === callback;
		});
	}
}
