var mysql      = require('mysql');
var pool = mysql.createPool({
  connectionLimit   : 10,
  host              : '38.123.205.133',
  user              : 'usr_casc',
  password          : 'Hadalid1985$',
  database          : 'dbcasc_qa'
});

//conn.connect();

// function Aduana() {
//     this.Id = 0;
//     this.Codigo = '';
//     this.Nombre = '';
//     this.IsActive = false;
// };

var TableMng = require('./TableMng.js');
var Aduana = require('./Aduana.js');
var AduanaMng = require('./AduanaMng.js');


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