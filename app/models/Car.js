const BaseModel = require("../../src/BaseModel");

class Car extends BaseModel {
    constructor(attributes = {}) {
        super(attributes);
    }

    static _fillable = {
        name: "string",
        manufacturer: "string",
        model: "string",
        category: "string",
        year: "number",
        image: "string",
        description: "string",
        active: "boolean"
    };
}

module.exports = Car;
