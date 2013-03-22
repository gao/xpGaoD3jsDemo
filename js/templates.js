Handlebars.templates = Handlebars.templates || {};


// template --- tmpl-D3JSContactCluster ---
Handlebars.templates['tmpl-D3JSContactCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"D3JSContactCluster\">\n		<div class=\"D3JSContactClusterSummary\"></div>\n	</div>";}
);

// template --- tmpl-MainScreen ---
Handlebars.templates['tmpl-MainScreen'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"MainScreen\">\n	    <div class=\"MainScreen-header\">\n	    </div>\n	    <div class=\"MainScreen-main\">\n	    </div>\n    </div>";}
);

// template --- tmpl-ReportHeader ---
Handlebars.templates['tmpl-ReportHeader'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"ReportHeader\">\n		<div class=\"navbar  navbar-inverse navbar-fixed-top\">\n		  <div class=\"navbar-inner\">\n		    <a class=\"brand\" href=\"#\">D3JS Demo</a>\n		    <ul class=\"nav\">\n		      <li data-nav=\"UserWeight\" class=\"menu\">UserWeight</li>\n		      <li data-nav=\"UserWeightD3\" class=\"menu\">UserWeightD3Force</li>\n		      <li data-nav=\"UserWeightD3Cluster\" class=\"menu\">UserWeightD3Cluster</li>\n		      <li data-nav=\"D3JSContactCluster\" class=\"menu active\">D3JSContactCluster</li>\n		      <li data-nav=\"UserWeightEaseljsCluster\" class=\"menu\">UserWeightEaseljsCluster</li>\n		    </ul>\n		  </div>\n		</div>\n	</div>";}
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

// template --- tmpl-UserWeightEaseljsCluster ---
Handlebars.templates['tmpl-UserWeightEaseljsCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"UserWeightEaseljsCluster\">\n		<div class=\"UserWeightEaseljsClusterSummary\"></div>\n		<div class=\"hoverBoxContainer\"></div>\n	</div>";}
);

// template --- tmpl-section-hover ---
Handlebars.templates['tmpl-section-hover'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"hoverDiv\">\n		<span>Name:";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span><br>\n		<span>Weight:";
  foundHelper = helpers.weight;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.weight; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span>\n	</div>";
  return buffer;}
);
