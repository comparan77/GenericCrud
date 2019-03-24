var BaseMng = require('./basemng.js');

function AduanaMng (o, lst = null) {
    BaseMng.call(this, o, 'Aduana', lst)
    
    this.Params = {
        Option: 0,
        Id: 0,
        Codigo: '',
        Nombre: ''
    }

};

AduanaMng.prototype = Object.create(BaseMng.prototype);
AduanaMng.prototype.constructor = AduanaMng;

AduanaMng.prototype.fillParameters = function(option) {
    this.Params.Option = option;
    this.Params.Id = this.obj.Id;
    this.Params.Codigo = this.obj.Codigo;
    this.Params.Nombre = this.obj.Nombre;
}

module.exports = AduanaMng;