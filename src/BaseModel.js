class BaseModel {
    static data = [];

    constructor(attributes = {}) {
        const fillable = this.constructor._fillable || {};

        Object.keys(fillable).forEach(key => {
            const type = fillable[key];

            let value = attributes[key] ?? null;

            if (value !== null) {
                if (type === "number") value = Number(value);
                if (type === "string") value = String(value);
            }

            // Stockage privé
            this[`_${key}`] = value;

            // Getter et setter dynamique
            Object.defineProperty(this, key, {
                get: () => this[`_${key}`],
                set: (val) => { this[`_${key}`] = val; },
                enumerable: true,
            });
        });

        // Id automatique si non fourni
        if (!this.id) {
            this.id = Date.now();
        }
    }

    save() {
        const index = this.constructor.data.findIndex(d => d.id === this.id);
        if (index === -1) this.constructor.data.push(this);
        else this.constructor.data[index] = this;
    }

    static all() {
        return this.data;
    }

    static find(id) {
        return this.data.find(d => d.id == id);
    }

    static delete(id) {
        this.data = this.data.filter(d => d.id != id);
    }
}

module.exports = BaseModel;
