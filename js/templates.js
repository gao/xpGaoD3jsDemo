Handlebars.templates = Handlebars.templates || {};


// template --- tmpl-D3JSContactCluster ---
Handlebars.templates['tmpl-D3JSContactCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"D3JSContactCluster\">\n		<div class=\"D3JSContactClusterSummary\"></div>\n	</div>";}
);

// template --- tmpl-EaselJSContactCluster ---
Handlebars.templates['tmpl-EaselJSContactCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"EaselJSContactCluster\">\n		<div class=\"EaselJSContactClusterSummary\"></div>\n	</div>";}
);

// template --- tmpl-EaselJSForceCluster ---
Handlebars.templates['tmpl-EaselJSForceCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"EaselJSForceCluster easelJSContainer\">\n		<div class=\"clusterChart\"></div>\n		<div class=\"contact-info\"></div>\n	</div>";}
);

// template --- tmpl-EaselJSForceClusterDrag ---
Handlebars.templates['tmpl-EaselJSForceClusterDrag'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"EaselJSForceClusterDrag easelJSContainer\">\n		<div class=\"clusterChart\"></div>\n		<div class=\"contact-info\"></div>\n	</div>";}
);

// template --- tmpl-EaselJSForceClusterSlider ---
Handlebars.templates['tmpl-EaselJSForceClusterSlider'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"EaselJSForceClusterSlider easelJSContainer\">\n		<div class=\"clusterChart\"></div>\n		<div class=\"contact-info\"></div>\n		<div class=\"contact-toolbar\">\n			<div class=\"toolItems\">\n				<div class=\"toolbar-item\">\n					<label>Show Level: </label> \n					<div class=\"toolbar-item-content showLevel\">\n						<input type=\"text\" class=\"span2\" data-slider-min=\"1\" data-slider-max=\"4\" data-slider-value=\"2\" value=\"\" id=\"sl1\" >\n					</div>\n				</div>\n				<div class=\"toolbar-item\">\n					<label>Zoom: </label> \n					<div class=\"toolbar-item-content zoom\">\n						<input type=\"text\" class=\"span2\" data-slider-min=\"40\" data-slider-max=\"200\" data-slider-value=\"100\" data-slider-step=\"20\" value=\"\" id=\"sl2\" >\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>";}
);

// template --- tmpl-EaselJSTweenContactCluster ---
Handlebars.templates['tmpl-EaselJSTweenContactCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"EaselJSTweenContactCluster easelJSContainer\">\n		<div class=\"clusterChart\"></div>\n		<div class=\"contact-info\"></div>\n		<div class=\"contact-toolbar\">\n			<div class=\"toolItems\">\n				<div class=\"toolbar-item\">\n					<label>Use RAF: </label> \n					<div class=\"toolbar-item-content useRAF\">\n						<input type=\"checkbox\"/>\n					</div>\n				</div>\n				<div class=\"toolbar-item\">\n					<label>Animation: </label> \n					<div class=\"toolbar-item-content animation\">\n						<input name=\"targetType\" type=\"radio\" value=\"tween\"><span>Tween</span>\n						<input name=\"targetType\" type=\"radio\" value=\"tick\"><span>Tick</span>\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>";}
);

// template --- tmpl-FabricJSContactCluster ---
Handlebars.templates['tmpl-FabricJSContactCluster'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"FabricJSContactCluster\">\n		<div class=\"ClusterChart\"></div>\n		<div class=\"contact-info\"></div>\n	</div>";}
);

// template --- tmpl-MainScreen ---
Handlebars.templates['tmpl-MainScreen'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"MainScreen\">\n	    <div class=\"MainScreen-header\">\n	    </div>\n	    <div class=\"MainScreen-main\">\n	    </div>\n    </div>";}
);

// template --- tmpl-ReportHeader ---
Handlebars.templates['tmpl-ReportHeader'] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"ReportHeader\">\n		<div class=\"navbar  navbar-inverse navbar-fixed-top\">\n		  <div class=\"navbar-inner\">\n		    <a class=\"brand\" href=\"#\">Demo</a>\n		    <ul class=\"nav\">\n		      <li data-nav=\"UserWeight\" class=\"menu\">UserWeight</li>\n		      <li data-nav=\"UserWeightD3\" class=\"menu\">D3JSForce</li>\n		      <li data-nav=\"UserWeightD3Cluster\" class=\"menu\">D3JSCluster</li>\n		      <li data-nav=\"D3JSContactCluster\" class=\"menu\">D3JS ContactCluster</li>\n		      <li data-nav=\"EaselJSContactCluster\" class=\"menu\">EaselJS</li>\n		      <li data-nav=\"EaselJSTweenContactCluster\" class=\"menu\">EaselJS TweenJS</li>\n		      <li data-nav=\"EaselJSForceCluster\" class=\"menu\">EaselJS ForceCluster</li>\n		      <li data-nav=\"EaselJSForceClusterSlider\" class=\"menu active\">EaselJS Slider</li>\n		      <li data-nav=\"EaselJSForceClusterDrag\" class=\"menu\">EaselJS Drag</li>\n		      <li data-nav=\"FabricJSContactCluster\" class=\"menu\">FabricJS</li>\n		    </ul>\n		  </div>\n		</div>\n	</div>";}
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
