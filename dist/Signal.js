"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Signal = /** @class */ (function () {
    function Signal() {
        this.slots = [];
        this.onces = [];
    }
    Signal.prototype.add = function (slot) {
        typeof slot === 'function' && this.slots.push(slot);
        return this;
    };
    Signal.prototype.once = function (slot) {
        typeof slot === 'function' && this.onces.push(slot);
        return this;
    };
    Signal.prototype.remove = function (slot) {
        this.slots = this.slots.filter(function (item) { return item !== slot; });
        this.onces = this.onces.filter(function (item) { return item !== slot; });
        return this;
    };
    Signal.prototype.emit = function (payload) {
        this.notify(this.slots, payload);
        this.notify(this.onces, payload);
        this.onces = [];
    };
    /*
     * Use reverse loop with implicit comparison.
     * http://jsbench.github.io/#174d623c29798680e44b867dcf9732e7
     */
    Signal.prototype.notify = function (slots, payload) {
        for (var i = slots.length; i--;) {
            var slot = slots[i];
            slot.call(slot, payload || null);
        }
    };
    return Signal;
}());
exports.Signal = Signal;
//# sourceMappingURL=Signal.js.map