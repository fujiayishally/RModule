export function Queue() {
    this.queue = [];
    this.cb = function () {
    };
}

Queue.prototype = {
    add(value: any) {
        this.queue.push(value);
    },
    next() {
        if (!this.done()) {
            return this.queue.shift();
        } else {
            this.cb();
        }
    },
    done() {
        return this.queue.length <= 0;
    }
};