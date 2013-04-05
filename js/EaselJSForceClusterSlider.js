;(function() {

    (function ($) {
    	var _colors = ["#0B95B1","#ff7f0e","#aec7e8","#dddddd"];
    	var _centerColors = ["#ffe9c2","#0B95B1","#ff7f0e","#aec7e8","#dddddd"];
    	var _weightPerLength = [20,10,8,4];
    	var _baseLineLen = [80,40,20,10];
        brite.registerView("EaselJSForceClusterSlider",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-EaselJSForceClusterSlider",{});
               	var $e = $($html);
                return $e;
            },
            postDisplay:function(data, config){
				var view = this;
                var $e = view.$el;
                
                app.ContactDao.get().done(function(chartData){
                	view.showView(chartData);
				});
			},
           	showView:function (data) {
                var view = this;
                var $e = view.$el;
                view.currentContainerName = "currentContainer";
                view.newContainerName = "newContainer";
                view.cName = "centerCircle";
                view.rootName = data.name;
                view.level = view.level || 2;
                
                $('#sl1').slider().on('slideStop', function(ev){
                	view.level = ev.value;
                	app.ContactDao.getByName(view.rootName).done(function(chartData){
	                	view.showView(chartData);
					});
				});
				
				createjs.Ticker.useRAF = true;
				createjs.Ticker.setFPS(60);
				
				var $ClusterChart = $e.find(".ClusterChart");
				$ClusterChart.empty();
				$ClusterChart.html('<canvas id="ClusterChart" ></canvas>');  
				  
				var canvas = $e.find("#ClusterChart")[0];
				canvas.width = $e.parent().width();
        		canvas.height = $e.parent().height();
        		
        		view.canvasW = canvas.width;
        		view.canvasH = canvas.height;
        		view.originPoint = {x:view.canvasW/2, y: view.canvasH/2};

				var stage = new createjs.Stage(canvas);
				view.stage = stage;
				var container = createContainer.call(view, data, view.originPoint, view.level, 0);
				container.name = view.currentContainerName;
				container.alpha = 1;
				stage.addChild(container);
      			stage.update();
      			
      			$('#sl2').slider().on('slideStop', function(ev){
                	var zoom = ev.value;
                	var containerLayout = stage.getChildByName(view.currentContainerName);
                	var scaleVal = zoom/100;
                	containerLayout.scaleX = scaleVal; 
					containerLayout.scaleY = scaleVal; 
					containerLayout.x = (1-scaleVal) * view.originPoint.x; 
					containerLayout.y = (1-scaleVal) * view.originPoint.y; 
					stage.update();
				});
			}
        });
        
        // --------- Private Method --------- //
        	function createContainer(data, originPoint, level,exAngle){
        		var view = this;
        		var parentName = data.name;
      			//sort the weight
				var childrenData = data.children;
				childrenData.sort(weightSort);
				
				//put the root data as the first one
				childrenData = app.transformDataFirst(childrenData,view.rootName);
				
      			var stage = view.stage;
				var rx = originPoint.x;
				var ry = originPoint.y;
				var weightPerLength = _weightPerLength[view.level - level];
      			var baseLineLen = _baseLineLen[view.level - level];
      			var angle = Math.PI * 2 / childrenData.length ;
     			var containerRoot = new createjs.Container();
     			
     			var fpos = [];
		      	for(var i = 0; i < childrenData.length; i++){
			        var cData = childrenData[i];
			        var weight = cData.weight;
					//the higher weight, the closer the length
					weight = 10 - weight;
					
			        var l = weight * weightPerLength + baseLineLen;
			        var cx = rx + l * Math.sin(angle * i + exAngle);
			        var cy = ry + l * Math.cos(angle * i + exAngle);
			        fpos.push({x:cx, y:cy});
			    }
			   
			    
        		//draw the nodes and line
        		$.each(childrenData,function(i,item){
        			if(level != view.level && i == 0) return;
        			var cx = fpos[i].x;
			        var cy = fpos[i].y;
			        var cData = childrenData[i];
			        
			        var line = createLine.call(view,rx,ry,cx,cy,level);
			        var node = createNodeCircle.call(view,cx,cy,cData.name,level);
			        containerRoot.addChild(line);
			        containerRoot.addChild(node);
			       	//add the click event for node
					node.addEventListener("click", function(d){clickEvent.call(view,d)});

			        //show the label
			        if((view.level-level) <= 1){
			        	var text = createText.call(view,cx,cy, cData.name);
			        	containerRoot.addChild(text);
			        }
			        
			        //show the children level
					if((level-1) > 0){
						var newData = app.transformData(app.dataSet, cData.name, parentName);
						var newContainer = createContainer.call(view, newData, {x:cx, y:cy}, level-1, (Math.PI + angle* i));
						containerRoot.addChild(newContainer);
					}
				});
				
				//draw the origin point
				var circle = createCenterCircle.call(view,rx, ry, view.cName,level);
				circle.children = childrenData.length;
			    containerRoot.addChild(circle);
					
				if((view.level-level) == 0){
					 //add the click event for circle
			    	circle.addEventListener("click", function(d){clickOriginPointEvent.call(view,d)});
			    
				    var text = createText.call(view,rx,ry, parentName);
	      			containerRoot.addChild(text); 
				}
			    
			    return containerRoot;
        	}
        	
        	function createNodeCircle(cx,cy,cName,level){
        		var view = this;
		      	var r = 4;
		    	var color = _colors[view.level - level];
		      	var circle = new createjs.Shape();
		      		circle.graphics.beginStroke("#a4998e").drawCircle(0, 0, r+0.5);
		      		circle.graphics.beginFill(color).drawCircle(0, 0, r);
		      		circle.x = cx;
			        circle.y = cy;
			        circle.name = cName;
		      	return circle;
		    }
		    
		    function createCenterCircle(cx,cy,cName,level){
		    	var view = this;
		      	var r = 6;
		      	var color = _centerColors[view.level - level];
		      	var circle = new createjs.Shape();
		      		circle.graphics.beginStroke("#a4998e").drawCircle(0, 0, r+0.5);
		      		circle.graphics.beginFill(color).drawCircle(0, 0, r);
		      		circle.x = cx;
			        circle.y = cy;
			        circle.name = cName
		      	return circle;
		    }
		    
		    function createLine(x0, y0, x1, y1, level){
		    	var view = this;
		    	var color = _colors[view.level - level];
		      	var line = new createjs.Shape();
		      		line.graphics.beginStroke(color).moveTo(x0,y0).lineTo(x1,y1);
		      	return line;
		    }
		    
		    function createText(x0, y0, name){
		      	var text = new createjs.Text(name, "10px Arial, #000");
		      		text.x = x0 - 10;
		      		text.y = y0 + 10;
		      	return text;
		    }
		    
		    function clickEvent(d){
		    	var view = this;
			    //change the origin node and the click node
			    var stage = view.stage;
			    view.rootName = d.target.name;
			    var rx = view.originPoint.x;
			    var ry = view.originPoint.y;
			    	
			    var statLayout = stage.getChildByName(view.currentContainerName);
			    var oldCenterCircle = statLayout.getChildByName(view.cName);
			    statLayout.removeChild(oldCenterCircle);
			        
			    var newCircle = new createjs.Shape();
			    var newCircle = createCenterCircle.call(view, d.target.x, d.target.y, view.cName, view.level);
      			statLayout.addChild(newCircle);
      				
      			statLayout.removeChild(d.target);
      			var node = createNodeCircle.call(view,rx,ry,view.cName,view.level);
      			statLayout.addChild(node);
      				
      			app.ContactDao.getByName(d.target.name).done(function(userData){
					//add new container
					var newContainer = createContainer.call(view, userData, {x:view.canvasW/2, y: view.canvasH/2}, view.level, 0);
					    newContainer.name = view.newContainerName;
					    newContainer.x = d.target.x - rx;
					    newContainer.y = d.target.y - ry;
					    newContainer.alpha = 0;
					stage.addChild(newContainer);
					    
					stage.update();
					    
					createjs.CSSPlugin.install();
					var $contactInfo = view.$el.find(".contact-info");
				   	if($contactInfo.find("span").size() > 0){
				   		var leftVal = $contactInfo.position().left - (d.target.x - rx);
				   		var topVal = $contactInfo.position().top - (d.target.y - ry);
				   		createjs.Tween.get($contactInfo[0]).to({opacity : 0.1, left : leftVal, top : topVal }, app.speed,createjs.Ease.quartInOut).call(function(){
				   			$contactInfo.empty();
				   		});
				   	}
					      	
					var ox = statLayout.x - (d.target.x - rx);
					var oy = statLayout.y - (d.target.y - ry);
					      	
					createjs.Tween.get(statLayout).to({alpha : 0, x : ox, y : oy }, app.speed,createjs.Ease.quartInOut); 
					      	
					createjs.Tween.get(newContainer).to({alpha : 1, x : 0, y : 0}, app.speed,createjs.Ease.quartInOut).call(function() {
					    createjs.Ticker.removeEventListener("tick",stage);
					    //remove oldContainer
						newContainer.x = 0;
						newContainer.y = 0;
						stage.removeChild(statLayout);
						newContainer.name = view.currentContainerName;
						newContainer.alpha = 1;
						stage.update();
					}); 
						
	      			createjs.Ticker.addEventListener("tick", stage);
					    
				});		
			}
			    
			function clickOriginPointEvent(d){
				var view = this;
			    var children = d.target.children;
			    var $contactInfo = view.$el.find(".contact-info");
			   		
			    if($contactInfo.find("span").size() == 0){
			    	$contactInfo.html('<span class="label label-info">'+view.rootName+": "+children+' friends</span>')
				    $contactInfo.css("top",d.target.y-10);
				    $contactInfo.css("left",d.target.x+20);
				    $contactInfo.css("opacity",1);
			    }else{
			    	$contactInfo.empty();
			    }
			}
        	
			function weightSort(a,b){
				return a.weight>b.weight ? 1 :-1;
			}
		// --------- /Private Method --------- //

    })(jQuery);
})();
