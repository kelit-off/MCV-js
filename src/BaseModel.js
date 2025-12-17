const mongoose = require("mongoose");

class BaseModel {
    constructor(attributes = {}) {
        const fillable = this.constructor._fillable || {};

        Object.entries(fillable).forEach(([key, type]) => {
            // Valeur initiale
            let value = attributes[key] ?? null;

            Object.defineProperty(this, `get${capitalize(key)}`, {
                value: () => this[key],
            });

            // Setter direct
            Object.defineProperty(this, `set${capitalize(key)}`, {
                value: (val) => {
                    this[key] = val;
                },
            });

            // Déclare le champ avec getter/setter automatique
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,

                get: () => {
                    const accessor = this[`get${capitalize(key)}Attribute`];
                    if (typeof accessor === "function") {
                        return accessor(value);
                    }
                    return value;
                },

                set: (newValue) => {
                    const mutator = this[`set${capitalize(key)}Attribute`];
                    if (typeof mutator === "function") {
                        value = mutator(newValue);
                    } else {
                        value = castType(newValue, type);
                    }
                },
            });

            // Initialise en passant par la méthode set()
            this[key] = value;
        });
    }

    async save() {
        const Model = this.constructor.getMongooseModel();
        const doc = new Model(this);
        const saved = await doc.save();
        this._id = saved._id;
        return saved;
    }

    static async all() {
        return await this.getMongooseModel().find({});
    }

    static async find(filters = {}, populate = null) {
        let query = this.getMongooseModel().find(filters);

        if (populate) {
            query = query.populate(populate);
        }

        return await query;
    }

    static async findById(id) {
        return await this.getMongooseModel().findById(id);
    }

    static async delete(id) {
        return await this.getMongooseModel().findByIdAndDelete(id);
    }

    static getMongooseModel() {
        if (!this._mongooseModel) {
            const schemaDef = Object.fromEntries(
                Object.entries(this._fillable).map(([key, type]) => {
                    const map = {
                        string: String,
                        number: Number,
                        boolean: Boolean,
                        date: Date,
                        objectId: mongoose.Schema.Types.ObjectId,
                    };
                    return [key, map[type] || String];
                })
            );

            const schema = new mongoose.Schema(schemaDef, { timestamps: true });
            this._mongooseModel = mongoose.model(this.name, schema);

            this.autoMigrate().catch(console.error);
        }
        return this._mongooseModel;
    }

    static async autoMigrate() {
        const Model = this.getMongooseModel();
        const fields = Object.keys(this._fillable);

        for (const field of fields) {
            await Model.updateMany(
                { [field]: { $exists: false } }, // champ manquant
                { $set: { [field]: null } } // valeur par défaut
            );
        }
    }
}

// ----------- Helpers -----------

function castType(val, type) {
    if (type === "number") return Number(val);
    if (type === "boolean") return Boolean(val);
    if (type === "date") return new Date(val);
    return String(val);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = BaseModel;
