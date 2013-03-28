var app = app || {};

(function(w){  
  
	w.render = function(templateName, data) {
		var tmpl = Handlebars.templates[templateName];
		if (tmpl) {
			return tmpl(data);
		} else {
			// obviously, handle this case as you think most appropriate.
			return "<small>Error: could not find template: " + templateName + "</small>";
		}
	}

})(window);

(function($) {
	//control the speed of animation
	app.speed = 500;
	
	//create the data set
	app.dataSet = app.createDataSet(300);
	
	app.useRAF = false;
	app.animation = "tween";
	
	app.ContactDao = brite.registerDao(new brite.dao.ContactDaoHandler("Contact"));
	
	app.render = function(templateName,data){
		data = data || {};
		return render(templateName,data);
	}
	

})(jQuery);
