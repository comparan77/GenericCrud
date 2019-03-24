var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : '38.123.205.133',
  user     : 'usr_casc',
  password : 'Hadalid1985$',
  database : 'dbcasc_qa'
});

conn.connect();

function Aduana() {
    this.Id = 0;
    this.Codigo = '';
    this.Nombre = '';
    this.IsActive = false;
};

var AduanaMng = require('./AduanaMng.js');

;(function() {
    this.TableMng = function() {

        //Global element references
        //this.param;

        //Define default options
        var defaults = {
            objMng: null
        }

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        //private methods
        function AddParameters(op) {
            this.param = [
                op,
                this.options.obj.Id,
                this.options.obj.Codigo,
                this.options.obj.Nombre
            ];
        }

        //public methods
        TableMng.prototype.ObjMng = function(objMng = null) {
            if(objMng == null)
                return this.options.objMng;
            else 
                this.options.objMng = objMng;
        }

        TableMng.prototype.Action = function(action, callback, tran = null) {
            var _ = this;
            var opcion = 0;
            switch (action) {
                case 'get':
                    opcion = 1;
                    break;
                case 'add':
                    opcion = 2;
                    break;
                case 'udt':
                    opcion = 3;
                    break;
                case 'dlt':
                    opcion = 4;
                    break;
                default:
                    break;
            }

            //AddParameters.call(_,opcion);
            _.options.objMng.fillParameters(opcion);
            var values = Object.values(_.options.objMng.Params);
            var params = '(' + Object.values(_.options.objMng.Params).fill('?') + ')';
            var query = conn.query('call sp_' + _.options.objMng.TableName + params, values, function(err, res, fields) {
                if(err) throw err;
                if(callback) callback(res[0]);
            });
        }

        TableMng.prototype.fillLst = function(callback, tran = null) {
            var _ = this;
            AddParameters.call(_,0);
            var query = conn.query('call sp_aduana_t(?,?,?,?)', _.param, function(err, res, fields) {
                if(err) throw err;
                if(callback) callback(res);
            });
        }

        TableMng.prototype.selById = function(callback, tran = null) {
            var _ = this;
            AddParameters.call(_,1);
            var query = conn.query('call sp_aduana_t(?,?,?,?)', _.param, function(err, res, fields) {
                if(err) throw err;
                if(callback) callback(res);
            });
        }

        TableMng.prototype.Add = function(callback, tran = null) {
            var _ = this;
            AddParameters.call(_,2);
            var query = conn.query('call sp_aduana_t(?,?,?,?)', _.param, function(err, res, fields) {
                if(err) throw err;
                if(callback) callback(res);
            });
        }

        TableMng.prototype.Udt = function(callback, tran = null) {
            var _ = this;
            AddParameters.call(_,3);
            var query = conn.query('call sp_aduana_t(?,?,?,?)', _.param, function(err, res, fields) {
                if(err) throw err;
                if(callback) callback(res);
            });
        }

        TableMng.prototype.Dlt = function(callback, tran = null) {
            var _ = this;
            AddParameters.call(_,4);
            var query = conn.query('call sp_aduana_t(?,?,?,?)', _.param, function(err, res, fields) {
                if(err) throw err;
                if(callback) callback(res);
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
}());

// oAduana.Id = 2,
// oMng.Obj = oAduana;
// oMng.selById(function(data) {
//     console.log(data);
// });

// oAduana.Codigo = '98';
// oAduana.Nombre = 'Nombre';

// oMng.Action('add', function(data) {
//     oAduana.Id = data[0][0].id;
//     oMng.Obj(oAduana);
//     oMng.Action('get', function(data) {
//         console.log(data);
//         oAduana.Nombre = 'Gil';
//         oMng.Obj(oAduana);
//         oMng.Action('udt', function(data) {

//             oMng.Action('get', function(data) {
//                 console.log(data);
//             });

//         });
//     });
// });

// oMng.selById(function(data) {
//     console.log(data);
// });

var oAduana = new Aduana();
oAduana.Id = 45;
oAduana.Nombre = 'Gill';
oAduana.Codigo = '23';
var oMgnAduana = new AduanaMng(oAduana);
var oMng = new TableMng({
    objMng: oMgnAduana
});

oMng.Action('lst', function(data) {
    console.log(data)
});