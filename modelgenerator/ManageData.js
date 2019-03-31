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
        dataobject: null,
        common: null
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
        this.options = extendDefaults(defaults, arguments[0]);
    }

    // Public Methods
    ManageData.prototype.Init = function() {
        var _ = this;
        _._database = _.options.database;
        _._tableName = _.options.table.charAt(0).toUpperCase() + _.options.table.slice(1) ;
        fillDataObjects.call(this, function() {
            if(_._primaryKey == null)
                _._primaryKey = _._lst[0];
            fillBean(_);
            fillMng(_);
        });
    }

    // Private Methods
    function fillBean(_) {

        var strProperties = '';
        var item;
        for(item in _._lst) {
            strProperties += "\tthis." + _._lst[item].FieldName + ";\n"
        }

        var strBean = "function "+ _._tableName + "() { \n" + strProperties +  "}; \nmodule.exports = " + _._tableName + ";"
        console.log(strBean);
    }

    function fillMng(_) {

        var strMng_2 = "";
        var strMng_1 = "var BaseMng = require('./basemng.js');\n\
\n\
function " + _._tableName + "Mng (o, lst = null) {\n\
\tBaseMng.call(this, o, '" + _._tableName + "', lst);\n\
\n\
\tthis.Params = {\n";

        var strParams = '\t\tOption: 0,\n';
        var item;
        var defaultValue;
        var strFillParam = "\tthis.Params.Option = option;\n";

        var lst = _._lst.filter(function (obj) {
            return obj.FieldName != 'IsActive';
        });
        
        for(item in lst) {
            switch (lst[item].FieldType) {
                case 'varchar':
                case 'char':
                case "time":
                case "blob":
                case "date":
                case "datetime":
                    defaultValue = "''";
                    break;
                case "tinyint":
                case "bit":
                    defaultValue = "false";
                    break;
                case "int":
                case "decimal":
                case "double":
                case "float":
                    defaultValue = "0";
                    break;
                default:
                    defaultValue = "UNDEFINIDED " + lst[item].FieldType;
                    break;
            }
            strParams += "\t\t" + lst[item].FieldName + ": " + defaultValue + ",\n";
            strFillParam += "\tthis.Params." + lst[item].FieldName + " = this.obj." + lst[item].FieldName + ";\n";
        }
        strMng_1+= strParams;

        strMng_2 = "\t}\n\
};\n\
" + _._tableName + "Mng.prototype = Object.create(BaseMng.prototype);\n\
" + _._tableName + "Mng.prototype.constructor = " + _._tableName + "Mng;\n\
" + _._tableName + "Mng.prototype.fillParameters = function(option) {\n";

        strMng_2 += strFillParam;
        strMng_2 += "}\
\n\
module.exports = " + _._tableName + "Mng;";
        console.log(strMng_1 + strMng_2);
    }

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
                    
                    o.FieldName = _.options.common.Capitalize(row.column_name.toLowerCase());
                    o.IsFieldLogicalDelete = false;
                    if(o.FieldName == 'Isactive') {
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
var Common = require('../../common/Common.js');

var o = new ManageData({
    conn: pool,
    database: 'dbcasc_qa',
    table: 'aduana',
    dataobject: dataobject,
    common: Common
});
o.Init();
