;(function() {

    (function ($) {
        brite.registerView("ReportHeader",  {parent:".MainScreen-header"}, {
            create:function (data, config) {
                var $html = app.render("tmpl-ReportHeader");
               	var $e = $($html);
                return $e;
            },
            postDisplay:function (data, config) {
                var view = this;
                var $e = view.$el;
                
            },
            events:{
            	"btap;.nav li.nav-item":function(e){
            		var view = this;
            		var $e = view.$el;
            		var $li = $(e.currentTarget);
            		$e.find("li").removeClass("active");
            		$li.addClass("active");
            		var menu = $li.attr("data-nav");
            		if(menu == "UserWeight"){
            		  	brite.display("UserWeight");
            		}else if(menu == "UserWeightD3"){
            		  	brite.display("UserWeightD3");
            		}else if(menu == "UserWeightD3Cluster"){
            		  	brite.display("UserWeightD3Cluster");
            		}else if(menu == "D3JSContactCluster"){
            		  	brite.display("D3JSContactCluster");
            		}else if(menu == "EaselJSContactCluster"){
            		  	brite.display("EaselJSContactCluster");
            		}else if(menu == "EaselJSTweenContactCluster"){
            		  	brite.display("EaselJSTweenContactCluster");
            		}else if(menu == "EaselJSForceCluster"){
            		  	brite.display("EaselJSForceCluster");
            		}else if(menu == "EaselJSForceClusterSlider"){
            		  	brite.display("EaselJSForceClusterSlider");
            		}else if(menu == "EaselJSForceClusterSlider2"){
            		  	brite.display("EaselJSForceClusterSlider2");
            		}else if(menu == "EaselJSForceClusterDrag"){
            		  	brite.display("EaselJSForceClusterDrag");
            		}else if(menu == "FabricJSContactCluster"){
            		  	brite.display("FabricJSContactCluster");
            		}
            		
            		$li.closest(".dropdown").addClass("active");
            	}
            }
        });
        
    })(jQuery);
})();