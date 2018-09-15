import {Signal} from '../ts/Signal';

describe('Signal Tests', () => {
    class Receiver {
        onReceive(x: number): void {}
        onOnce(x: number): void {}
    }

    let signal: Signal<number>;
    let receiver: Receiver;

    beforeAll(() => {
        signal = new Signal();
        receiver = new Receiver();

        spyOn(signal,'notify').and.callThrough();
        spyOn(receiver,'onReceive').and.callThrough();
        spyOn(receiver,'onOnce').and.callThrough();
    });

    it('add() should register the callback', () => {
        signal.add(() => {});
        expect(signal.slots.length).toBeGreaterThan(0);
    });

    it('once() should register the callback', () => {
        signal.once(() => {});
        expect(signal.onces.length).toBeGreaterThan(0);
    });

    it('remove() should deregister the callback', () => {
        let fn: Function = () => {};
        signal.add(fn);

        let length: number = signal.slots.length;
        signal.remove(fn);

        expect(signal.onces.length).toEqual(length - 1);
    });

    it('emit() should execute the callback', () => {
        signal.add(receiver.onReceive);
        signal.emit(5);
        expect(receiver.onReceive).toHaveBeenCalledWith(5);
    });

    it('emit() should execute the callback only once', () => {
        signal.once(receiver.onOnce);
        signal.emit(5);
        signal.emit(0);
        expect(receiver.onOnce).toHaveBeenCalledWith(5);
        expect(receiver.onOnce).toHaveBeenCalledTimes(1);
        expect(signal.onces.length).toBe(0);
    });

    it('emit() should invoke the Signal\'s notify method', () => {
        signal.emit(5);
        expect(signal.notify).toHaveBeenCalled();
    });

    it('notify() should execute the callback with the payload', () => {
        signal.add(receiver.onReceive);
        signal.notify(signal.slots, 5);
        expect(receiver.onReceive).toHaveBeenCalledWith(5);
    });
});
