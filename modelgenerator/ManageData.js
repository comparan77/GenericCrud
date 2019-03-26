"use strict";

function ManageData() {

    //Global element references
    this._database;
    this._tableName;
    this._isLogigalDelete;

    //Define default options
    var defaults = {
        conn: null,
        database: '',
        table: ''
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
        this.options = extendDefaults(defaults, arguments[0]);
    }

    // Public Methods
    ManageData.prototype.Init = function() {
        this._database = this.options.database;
        this._tableName = this.options.table;
        fillDataObjects.call(this);
    }

    // Private Methods
    function fillDataObjects() {
        this.options.conn.query("select column_name, data_type, case is_nullable when 'YES' then 1 else 0 end is_nullable, character_maximum_length, case column_key when 'PRI' then 1 else 0 end IsPk, case extra when 'auto_increment' then 1 else 0 end IsPkAI from information_schema.columns where table_schema = '" + this._database + "' and table_name='" + this._tableName + "';", function(err, res, fields) {
                if(err) throw err;
                
                this._isLogigalDelete = false;
                console.log(JSON.stringify(res));

            });
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }
}

var pool = require('../db.js');
var o = new ManageData({
    conn: pool,
    database: 'dbcasc_qa',
    table: 'aduana'
});
o.Init();
