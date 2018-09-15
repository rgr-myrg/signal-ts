export class Signal<T> {
    public slots: Function[] = [];
    public onces: Function[] = [];

    public add(slot: Function): Signal<T> {
        typeof slot === 'function' && this.slots.push(slot);

        return this;
    }

    public once(slot: Function): Signal<T> {
        typeof slot === 'function' && this.onces.push(slot);

        return this;
    }

    public remove(slot: Function) {
        this.slots = this.slots.filter(item => item !== slot);
        this.onces = this.onces.filter(item => item !== slot);

        return this;
    }

    public emit(payload: T): void {
        this.notify(this.slots, payload);
        this.notify(this.onces, payload);

        this.onces = [];
    }

    /*
     * Use reverse loop with implicit comparison.
     * http://jsbench.github.io/#174d623c29798680e44b867dcf9732e7
     */
    public notify(slots: Function[], payload: T):void {
		for (let i = slots.length; i--;) {
			let slot: Function = slots[i];
			slot.call(slot, payload || null);
		}
	}
}
