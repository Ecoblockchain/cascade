var Computed = (function () {
    var id = 0;

    var computedQueue = new ComputedQueue();

    function Computed(definition) {
        Define.super(Observable, this);
        this.id = id;
        id++;

        this.references = [];
        this.definition = definition;
        this.runDefinition(definition);
        this.dirty = false;

        return this.value;
    }

    Define.extend(Computed, Observable, {
        getValue: function (value) {
            Observable.prototype.getValue.apply(this, value);
            if (this.dirty) {
                this.runUpdate();
            }
            return this.value;
        },
        setValue: function (value) {},
        notify: function () {
            if (Observable.sync) {
                this.runUpdate();
            } else {
                this.dirty = true;
                if (computedQueue.completed) {
                    computedQueue = new ComputedQueue();
                }
                computedQueue.add(this);
            }
        },
        runUpdate: function () {
            if (this.dirty) {
                var value = this.value;
                this.runDefinition(this.definition);
                this.dirty = false;
                if (this.value !== value) {
                    this.publish();
                }
            }
        },
        runDefinition: function (definition) {
            //TODO: Reduce unsubscribe calls.
            for (var index = 0, length = this.references.length; index < length; index++) {
                var reference = this.references[index];
                reference.unsubscribe(this);
            }

            Observable.pushContext();
            this.value = definition();
            var context = Observable.popContext();

            //TODO: Prevent redundant subscription.
            for (var index = 0, length = context.length; index < length; index++) {
                var reference = context[index];
                reference.subscribeOnly(this);
            }
        }
    });

    return Computed;
})();