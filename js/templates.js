Handlebars.templates = Handlebars.templates || {};


// template --- tmpl-MainScreen ---
Handlebars.templates['tmpl-MainScreen'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"MainScreen\">\n	    <div class=\"MainScreen-header\">\n	    </div>\n	    <div class=\"MainScreen-main\">\n	    </div>\n    </div>";}
);

// template --- tmpl-ReportHeader ---
Handlebars.templates['tmpl-ReportHeader'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"ReportHeader\">\n		<div class=\"navbar  navbar-inverse navbar-fixed-top\">\n		  <div class=\"navbar-inner\">\n		    <a class=\"brand\" href=\"#\">D3JS Demo</a>\n		    <ul class=\"nav\">\n		      <li data-nav=\"UserWeight\" class=\"menu active\">UserWeight</li>\n		      <li data-nav=\"UserWeightD3\" class=\"menu\">UserWeightD3Force</li>\n		      <li data-nav=\"UserWeightD3Cluster\" class=\"menu\">UserWeightD3Cluster</li>\n		    </ul>\n		  </div>\n		</div>\n	</div>";}
);

// template --- tmpl-UserWeight ---
Handlebars.templates['tmpl-UserWeight'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"UserWeight\">\n		<div class=\"UserWeightSummary\"></div>\n	</div>";}
);

// template --- tmpl-UserWeightD3 ---
Handlebars.templates['tmpl-UserWeightD3'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"UserWeightD3\">\n		<div class=\"UserWeightD3Summary\"></div>\n	</div>";}
);

// template --- tmpl-UserWeightD3Cluster ---
Handlebars.templates['tmpl-UserWeightD3Cluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"UserWeightD3Cluster\">\n		<div class=\"UserWeightD3ClusterSummary\"></div>\n	</div>";}
);
