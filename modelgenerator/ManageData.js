"use strict";

function ManageData() {

    //Global element references
    this._database;
    this._tableName;
    this._isLogigalDelete;
    this._primaryKey;
    this._lst = [];
    this._result = {
        tblName: '',
        strBean: '',
        strMng: '',
        strSql: '',
        strSqlH: ''
    };

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
    ManageData.prototype.Init = function(callback) {
        var _ = this;
        _._database = _.options.database;
        _._tableName = _.options.table.charAt(0).toUpperCase() + _.options.table.slice(1) ;
        _._result.tblName = _._tableName;
        fillDataObjects.call(this, function() {
            if(_._primaryKey == null)
                _._primaryKey = _._lst[0];
            fillBean(_);
            var lst = fillMng(_);
            fillSQL(_, lst);
            if(callback) callback(_._result);
        });
    }

    ManageData.prototype.Result = function() {
        return this._result;
    }

    // Private Methods
    function fillBean(_) {

        var strProperties = '';
        var item;
        for(item in _._lst) {
            strProperties += "\tthis." + _._lst[item].FieldName + ";\n"
        }

        var strBean = "function "+ _._tableName + "() { \n" + strProperties +  "}; \nmodule.exports = " + _._tableName + ";"
        _._result.strBean = strBean; 
    }

    function fillMng(_) {

        var strMng_2 = "";
        var strMng_1 = "var BaseMng = require('../_common/basemng.js');\n\
\n\
function " + _._tableName + "Mng (o, lst = null) {\n\
\tBaseMng.call(this, o, '" + _.options.table + "', lst);\n\
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
		case "bigint":
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
        //console.log(strMng_1 + strMng_2);
        _._result.strMng = strMng_1 + strMng_2;
        return lst;
    }

    function fillSQL(_, lst) {

        var s_SQL = '';
        var sbSQL = '';
        var sbHeader = "CREATE PROCEDURE `" + _._database + "`.`sp_" + _._tableName + "`(\n";
        var sbParametros = '';
        var sbSelect = '';
        var sbSelectBy = '';
        var sbInsert = '';
        var sbInsertFields = '';
        var sbInsertValues = '';
        var sbUpdate = '';
        var sbDelete = '';
        var sbReActive = '';
        var sbSelectEvenInactive = '';
        var sbFooter = "END CASE;\n";
        sbFooter += "END";
        sbParametros+="\t IN P_opcion INT\n";
        sbSelect+="WHEN 0 THEN\n";
        sbSelect+="\tSELECT\n";
        sbSelectBy+="WHEN 1 THEN\n";
        sbSelectBy+="\tSELECT\n";

        sbInsert+="WHEN 2 THEN\n";
        sbInsert+="\tINSERT INTO " + _.options.table + " (\n";
        sbInsertValues+="\tVALUES (\n";
        sbUpdate+="WHEN 3 THEN\n";
        sbUpdate+="\tUPDATE " + _.options.table + " SET\n";
        sbDelete+="WHEN 4 THEN\n";
        sbSelectEvenInactive+="WHEN 6 THEN\n";
        sbSelectEvenInactive+="\tSELECT\n";

        var o;
        var item;
        var indiceCampo = 0;
        var indiceCampoIdAi = 0;

        for(item in lst) {
            o = lst[item];
            if(o.IsPk)
                sbParametros+="\t,IN P_" + o.FieldName + " " + o.FieldType + (o.Character_maximun_length != null ? "(" + o.Character_maximun_length + ")" : '') + "\n";
            else
                if(!o.IsFieldLogicalDelete)
                    sbParametros+="\t,IN P_" + o.FieldName + " " + o.FieldType + (o.Character_maximun_length != null ? "(" + o.Character_maximun_length + ")" : '') + "\n";
            
            if (indiceCampoIdAi == 0)
            {
                if (!o.IsPk || !o.IsPkAI)
                {
                    sbInsertFields+="\t\t " + o.FieldName + "\n";
                    sbInsertValues+="\t\t P_" + o.FieldName + "\n";
                    sbUpdate+="\t\t " + o.FieldName + " = " + "P_" + o.FieldName + "\n";
                }
                else
                    indiceCampoIdAi--;
            }
            else
            {
                if (!o.IsFieldLogicalDelete)
                {
                    sbInsertFields+="\t\t," + o.FieldName + "\n";
                    sbInsertValues+="\t\t,P_" + o.FieldName + "\n";

                    sbUpdate+="\t\t," + o.FieldName + " = " + "P_" + o.FieldName + "\n";
                }
            }

            if (indiceCampo == 0)
            {
                sbSelect+="\t\t " + o.FieldName + "\n";
                sbSelectBy+="\t\t " + o.FieldName + "\n";
                sbSelectEvenInactive+="\t\t " + o.FieldName + "\n";
            }
            else
            {
                sbSelect+="\t\t," + o.FieldName + "\n";
                sbSelectBy+="\t\t," + o.FieldName + "\n";
                sbSelectEvenInactive+="\t\t," + o.FieldName + "\n";
            }

            indiceCampo++;
            indiceCampoIdAi++;
        }

        sbParametros+=")\n";
        sbParametros+="BEGIN\n";
        sbParametros+="CASE P_opcion\n";

        if (_._isLogigalDelete)
            {
                sbSelect+="\tFROM " + _.options.table + "\n";
                sbSelect+="\tWHERE IsActive = 1;\n";
            }
            else
                sbSelect+="\tFROM " + _.options.table + ";\n";
        
        sbSelectBy+="\tFROM " + _.options.table + "\n";
        
	if (_._isLogigalDelete)
            sbSelectBy+="\tWHERE " + _._primaryKey.FieldName + " = P_" + _._primaryKey.FieldName + ";\n";
        else
            sbSelectBy+="\tWHERE " + _._primaryKey.FieldName + " = P_" + _._primaryKey.FieldName + ";\n";
        
        //insert
        sbInsertFields+="\t)\n";
        sbInsertValues+="\t);\n";
        if (_._primaryKey.IsPkAI) {
            //sbInsertValues+="\tSET P_" + _._primaryKey.FieldName + " = LAST_INSERT_ID();\n";
            sbInsertValues+="\tSELECT LAST_INSERT_ID() id;\n";
        }
        sbInsert+=sbInsertFields;
        sbInsert+=sbInsertValues;
        //update
        sbUpdate+="\tWHERE " + _._primaryKey.FieldName + " = P_" + _._primaryKey.FieldName + ";\n";
        //delete or deactive
        if (_._isLogigalDelete)
                sbDelete+="\tUPDATE " + _.options.table + " SET IsActive = 0 WHERE " + _._primaryKey.FieldName + " = P_" + _._primaryKey.FieldName + ";\n";
            else
                sbDelete+"\tDELETE FROM " + _.options.table + " WHERE " + _._primaryKey.FieldName + " = P_" + _._primaryKey.FieldName + ";\n";

        if (_._isLogigalDelete) {
            sbReActive+="WHEN 5 THEN\n";
            sbReActive+="\tUPDATE " + _.options.table + " SET IsActive = 1 WHERE " + _._primaryKey.FieldName + " = P_" + _._primaryKey.FieldName + ";\n";
        }

        if (_._isLogigalDelete) {
            sbSelectEvenInactive+="\tFROM " + _.options.table + ";\n";
        }

        sbSQL+=sbHeader;
        sbSQL+=sbParametros;
        sbSQL+=sbSelect;
        sbSQL+=sbSelectBy;
        sbSQL+=sbInsert;
        sbSQL+=sbUpdate;
        sbSQL+=sbDelete;
        if (_._isLogigalDelete)
        {
            sbSQL+=sbReActive;
            sbSQL+=sbSelectEvenInactive;
        }
        sbSQL+=sbFooter;
        s_SQL = sbSQL;

        //console.log(s_SQL);
        _._result.strSql = s_SQL;
        _._result.strSqlH = 'DROP PROCEDURE IF EXISTS sp_' + _._tableName;
    }

    function fillDataObjects(callback) {
        var _ = this;
        var qry = "select column_name, data_type, case is_nullable when 'YES' then 1 else 0 end is_nullable, character_maximum_length, case column_key when 'PRI' then 1 else 0 end IsPk, case extra when 'auto_increment' then 1 else 0 end IsPkAI from information_schema.columns where table_schema = '" + this._database + "' and table_name='" + _.options.table + "';";
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
                    o.IsPk = row.IsPk == 1 ? true : false;
                    o.IsPkAI = row.IsPkAI == 1 ? true : false;
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

// var o = new ManageData({
//     conn: pool,
//     database: 'dbcasc_qa',
//     table: 'aduana',
//     dataobject: dataobject,
//     common: Common
// });
// o.Init();

module.exports = ManageData;
