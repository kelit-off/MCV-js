const BaseModel = require("../../src/BaseModel");

class User extends BaseModel {
    constructor(attributes = {}) {
        super(attributes);
    }

    static _fillable = {
        name: "string",
        email: "string",
        age: "number",
    };
}

module.exports = User;
