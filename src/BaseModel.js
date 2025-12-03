const mongoose = require("mongoose");

class BaseModel {
    constructor(attributes = {}) {
        const fillable = this.constructor._fillable || {};

        Object.entries(fillable).forEach(([key, type]) => {
            let value = attributes[key] ?? null;
            if (value !== null) {
                if (type === "number") value = Number(value);
                else if (type === "string") value = String(value);
                else if (type === "boolean") value = Boolean(value);
                else if (type === "date") value = new Date(value);
            }
            this[key] = value; // plus besoin de préfixe _
        });
    }

    async save() {
        const Model = this.constructor.getMongooseModel();
        const doc = new Model(this); // crée un document Mongoose
        const saved = await doc.save(); // MongoDB génère l'_id automatiquement
        this._id = saved._id; // stocke l'_id dans l'instance si besoin
        return saved;
    }

    static async all() {
        return await this.getMongooseModel().find({});
    }

    static async find(filters = {}) {
        return await this.getMongooseModel().find(filters);
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
                    const map = { string: String, number: Number, boolean: Boolean, date: Date };
                    return [key, map[type] || String];
                })
            );
            const schema = new mongoose.Schema(schemaDef, { timestamps: true });
            this._mongooseModel = mongoose.model(this.name, schema);
        }
        return this._mongooseModel;
    }
}

module.exports = BaseModel;