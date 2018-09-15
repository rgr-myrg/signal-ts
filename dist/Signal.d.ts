export declare class Signal<T> {
    slots: Function[];
    onces: Function[];
    add(slot: Function): Signal<T>;
    once(slot: Function): Signal<T>;
    remove(slot: Function): this;
    emit(payload: T): void;
    notify(slots: Function[], payload: T): void;
}
