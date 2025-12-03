const BaseModel = require("../../src/BaseModel");

class Team extends BaseModel {
    constructor(attributes = {}) {
        super(attributes);
    }

    static _fillable = {
        name: "string",
        category: "string"
    };
}

module.exports = Team;
