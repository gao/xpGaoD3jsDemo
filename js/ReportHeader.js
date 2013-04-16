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
                view.level = view.level || 2;
                view.scaleVal = view.scaleVal || 1;
                
                $e.find("li.d3jsPart").hide();
                $e.find("li.fabricjsPart").hide();
                
                $('#sl1').slider().off('slide');
                $('#sl1').slider().on('slide', function(ev){
                	if(view.level != ev.value){
                		view.level = ev.value;
	                	view.$el.trigger("DO_SLIDE_LEVEL",{level:ev.value});
                	}
				});
				
				$('#sl2').slider().off('slide');
      			$('#sl2').slider().on('slide', function(ev){
                	var zoom = ev.value;
                	var scaleVal = zoom/100;
                	view.scaleVal = scaleVal;
                	view.$el.trigger("DO_SLIDE_ZOOM",{scaleVal:scaleVal});
				});
            },
            events:{
            	"btap; .toolbar-button .btn":function(e){
            		app.ContactDao.update(app.createDataSet(30,3,6));
            	},
            	
            	"btap;.nav li.nav-menu":function(e){
            		var view = this;
            		var $e = view.$el;
            		var $li = $(e.currentTarget);
            		$e.find("li.nav-menu").removeClass("active");
            		$li.addClass("active");
            		var menu = $li.attr("data-nav");
            		
            		if(menu == "D3JS Demo"){
            			$e.find("li.easeljsPart").hide();
            		  	$e.find("li.d3jsPart").show();
                		$e.find("li.fabricjsPart").hide();
                		brite.display("D3JSContactCluster");
                		$e.find("li.nav-item").removeClass("active");
                		$e.find("li.nav-item[data-nav='D3JSContactCluster']").addClass("active");
            		}else if(menu == "EaselJS Demo"){
            		  	$e.find("li.easeljsPart").show();
            		  	$e.find("li.d3jsPart").hide();
                		$e.find("li.fabricjsPart").hide();
                		brite.display("EaselJSForceClusterSlider");
                		$e.find("li.nav-item").removeClass("active");
                		$e.find("li.nav-item[data-nav='EaselJSForceClusterSlider']").addClass("active");
            		}else if(menu == "FabricJS Demo"){
            		  	$e.find("li.easeljsPart").hide();
            		  	$e.find("li.d3jsPart").hide();
                		$e.find("li.fabricjsPart").show();
                		brite.display("FabricJSContactCluster");
                		$e.find("li.nav-item").removeClass("active");
                		$e.find("li.nav-item[data-nav='FabricJSContactCluster']").addClass("active");
            		}
            		
            		$li.closest(".dropdown").find(".dropDownTitle").html(menu);
            	},
            	
            	"btap;.nav li.nav-item":function(e){
            		var view = this;
            		var $e = view.$el;
            		var $li = $(e.currentTarget);
            		$e.find("li.nav-item").removeClass("active");
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
            		}else if(menu == "EaselJSForceClusterSlider"){
            		  	brite.display("EaselJSForceClusterSlider");
            		}else if(menu == "EaselJSForceClusterSlider2"){
            		  	brite.display("EaselJSForceClusterSlider2");
            		}else if(menu == "FabricJSContactCluster"){
            		  	brite.display("FabricJSContactCluster");
            		}
            	}
            }
        });
        
    })(jQuery);
})();