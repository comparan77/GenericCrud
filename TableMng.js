function TableMng() {

        //Global element references

        //Define default options
        var defaults = {
            objMng: null,
            pool: null
        }

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        //private methods

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

            _.options.objMng.fillParameters(opcion);
            var values = Object.values(_.options.objMng.Params);
            var params = '(' + Object.values(_.options.objMng.Params).fill('?') + ')';
            _.options.pool.query('call sp_' + _.options.objMng.TableName + params, values, function(err, res, fields) {
                if(err) throw err;
                if(callback) callback(res[0]);
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

    };

module.exports = TableMng;
