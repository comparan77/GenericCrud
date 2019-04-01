const fs = require('fs');

function fillMng(obj, callback) {

    var strMng = "var BaseMng = require('./basemng.js'); \n\
    \n\
    function " + obj.Name + "Mng (o, lst = null) { \n\
    \tBaseMng.call(this, o, '" + obj.Name + "', lst) \n\
    \n\
    \tthis.Params = { \n\
    \t\tOption: 0, \n\
    \t\tId: 0, \n\
    \t\tCodigo: '', \n\
    \t\tNombre: '' \n\
    \t} \n\
    \n\
    }; \n\
    \n\
    " + obj.Name + "Mng.prototype = Object.create(BaseMng.prototype); \n\
    " + obj.Name + "Mng.prototype.constructor = " + obj.Name + "Mng; \n\
    \n\
    " + obj.Name + "Mng.prototype.fillParameters = function(option) { \n\
    \tthis.Params.Option = option; \n\
    \tthis.Params.Id = this.obj.Id; \n\
    \tthis.Params.Codigo = this.obj.Codigo; \n\
    \tthis.Params.Nombre = this.obj.Nombre; \n\
    } \n\
    \n\
    module.exports = " + obj.Name + "Mng;";

    var data = {
        Str: strMng,
        Name: obj.Name
    }

    if(callback) callback(data);
}

// fillMng({
//     Name: 'Usuario'
// }, function(data) {
//     fs.writeFile("./model/" + data.Name + ".js", data.Str, function(err) {
//         if(err) {
//             return console.log(err);
//         }
    
//         console.log("The file was saved!");
//     }); 
// });

var pool = require('./db.js');
var dataobject = require('./modelgenerator/DataObject.js')
var Common = require('../common/Common.js');

var ManageData = require('./modelgenerator/ManageData');
var o = new ManageData({
    conn: pool,
    database: 'dbcasc_qa',
    table: 'aduana',
    dataobject: dataobject,
    common: Common
});
o.Init();