"use strict";

function ManageData() {

    //Global element references
    this._database;
    this._tableName;
    this._isLogigalDelete;
    this._primaryKey;
    this._lst = [];

    //Define default options
    var defaults = {
        conn: null,
        database: '',
        table: '',
        dataobject: null
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
        this.options = extendDefaults(defaults, arguments[0]);
    }

    // Public Methods
    ManageData.prototype.Init = function() {
        var _ = this;
        _._database = this.options.database;
        _._tableName = this.options.table;
        fillDataObjects.call(this, function() {
            if(_._primaryKey == null)
                _._primaryKey = _._lst[0];
            
        });
    }

    // Private Methods
    function fillDataObjects(callback) {
        var _ = this;
        var qry = "select column_name, data_type, case is_nullable when 'YES' then 1 else 0 end is_nullable, character_maximum_length, case column_key when 'PRI' then 1 else 0 end IsPk, case extra when 'auto_increment' then 1 else 0 end IsPkAI from information_schema.columns where table_schema = '" + this._database + "' and table_name='" + this._tableName + "';";
        //console.log(qry);
        _.options.conn.query(qry, function(err, result, fields) {
                if(err) throw err;
                
                this._isLogigalDelete = false;
                Object.keys(result).forEach(function(key) {
                    var row = result[key];
                    var o = new _.options.dataobject();
                    o.FieldName = row.column_name.toLowerCase();
                    o.IsFieldLogicalDelete = false;
                    if(o.FieldName == 'isactive') {
                        o.FieldName = "IsActive";
                        o.IsFieldLogicalDelete = true;
                        _._isLogigalDelete = true;
                    }
                    o.FieldType = row.data_type;
                    o.IsNull = row.is_nullable == 0 ? false : true;
                    o.Character_maximun_length = 0;
                    if(row.character_maximum_length!=null) {
                        o.Character_maximun_length = row.character_maximum_length;
                    }
                    o.IsPk = row.IsPk;
                    o.IsPkAI = row.IsPkAI;
                    if(o.IsPk) {
                        _._primaryKey = o;
                    }
                    _._lst.push(o);
                  });
                callback(); 
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
var dataobject = require('./DataObject.js')
var o = new ManageData({
    conn: pool,
    database: 'dbcasc_qa',
    table: 'aduana',
    dataobject: dataobject
});
o.Init();
