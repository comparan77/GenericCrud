const fs = require('fs');

var pool = require('./db.js');
var dataobject = require('./modelgenerator/DataObject.js')
var Common = require('../common/Common.js');

var ManageData = require('./modelgenerator/ManageData');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Nombre de la tabla ', (tblName) => {
  // TODO: Log the answer in a database
  // console.log(`Thank you for your valuable feedback: ${answer}`);

  var o = new ManageData({
      conn: pool,
      database: '4_Test',
      table: tblName,
      dataobject: dataobject,
      common: Common
  });

  GenericCode(o);

  rl.close();
});


function GenericCode(o) {
  o.Init(function(result) {
      
      fs.writeFile("/home/gil/Develop/node/4CAD_Model/model/" + result.tblName + ".js", result.strBean, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      });

      fs.writeFile("/home/gil/Develop/node/4CAD_Model/model/" + result.tblName + "Mng.js", result.strMng, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
      });

      pool.getConnection(function(err, conn) {
          if (err) throw err;

          conn.beginTransaction(function(err) {
              if(err) { throw err; }
              conn.query(result.strSqlH, function(error, results, fields) {
                  if (error) {
                      return conn.rollback(function() {
                        throw error;
                      });
                  }
              
                  conn.query(result.strSql, function(error, results, fields) {
                  if (error) {
                      return conn.rollback(function() {
                        throw error;
                      });
                    }
                    conn.commit(function(err) {
                      if (err) {
                        return conn.rollback(function() {
                          throw err;
                        });
                      }
                      console.log('success procedure!');
                  });
                  });
              });
          });
          conn.release();
      //fin get connection
      })
  });
}
