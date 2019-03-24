var pool = require('./db.js');
var TableMng = require('./TableMng.js');
var Aduana = require('./Aduana.js');
var AduanaMng = require('./AduanaMng.js');

var oAduana = new Aduana();
oAduana.Id = 45;
oAduana.Nombre = 'Gil';
oAduana.Codigo = '23';
var oMgnAduana = new AduanaMng(oAduana);
var oMng = new TableMng({
    objMng: oMgnAduana,
    pool: pool
});

oMng.Action('get', function(data) {
    console.log(data)
});