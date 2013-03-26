
// --------- Contact Dao --------- //
(function($) {

	function ContactDaoHandler(entityType) {
        this._entityType = entityType;
	}

	// ------ DAO Interface Implementation ------ //
	ContactDaoHandler.prototype.getIdName = function() {
		return "id";
	};

    // --------- DAO Info Methods --------- //
    ContactDaoHandler.prototype.entityType = function () {
        return this._entityType;
    };
    // --------- DAO Info Methods --------- //


	ContactDaoHandler.prototype.get = function(id) {
		var objectType = this._entityType;
		var resultSet = {};
		var dataSet = app.dataSet;

		//get the first one as default
		if(typeof id == "undefined"){
			var dataPart = dataSet[0];
			resultSet.id = dataPart.id;
			resultSet.name = dataPart.name;
			resultSet.children = dataPart.friends;
		}else{
			$.each(dataSet,function(i,user){
				if(id == user.id){
					var dataPart = dataSet[i];
					resultSet.id = dataPart.id;
					resultSet.name = dataPart.name;
					resultSet.children = dataPart.friends;
				}
			});
		}
		return resultSet;
	}
	
	ContactDaoHandler.prototype.getByName = function(name) {
		var objectType = this._entityType;
		var resultSet = {};
		var dataSet = app.dataSet;

		//get the first one as default
		if(typeof name == "undefined"){
			var dataPart = dataSet[0];
			resultSet.id = dataPart.id;
			resultSet.name = dataPart.name;
			resultSet.children = dataPart.friends;
		}else{
			$.each(dataSet,function(i,user){
				if(name == user.name){
					var dataPart = dataSet[i];
					resultSet.id = dataPart.id;
					resultSet.name = dataPart.name;
					resultSet.children = dataPart.friends;
				}
			});
		}
		
		return resultSet;
	}

	brite.dao.ContactDaoHandler = ContactDaoHandler;
	// ------ /DAO Interface Implementation ------ //

})(jQuery);
// --------- /Contact Dao --------- //