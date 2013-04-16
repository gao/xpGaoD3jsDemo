;(function() {

    (function ($) {
    	var _colors = ["#0B95B1","#ff7f0e","#aec7e8","#dddddd"];
    	var _centerColors = ["#ffe9c2","#0B95B1","#ff7f0e","#aec7e8","#dddddd"];
    	var _weightPerLength = [20,10,8,4];
    	var _baseLineLen = [80,40,20,10];
        brite.registerView("EaselJSForceClusterSlider2",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-EaselJSForceClusterSlider2",{});
               	var $e = $($html);
                return $e;
            },
            postDisplay:function(data, config){
				var view = this;
                var $e = view.$el;
                view.level = $e.closest(".MainScreen").find(".ControlBar #sl1").val();
               	var scaleVal = $e.closest(".MainScreen").find(".ControlBar #sl2").val();
              	view.scaleVal = scaleVal/100;
                
                app.ContactDao.get().done(function(chartData){
                	view.showView(chartData);
				});
			},
			docEvents: {
				"DO_SLIDE_LEVEL": function(event,extra){
					var view = this;
					var stage = view.stage;
					view.level = extra.level;
	               	app.ContactDao.getByName(view.rootName).done(function(chartData){
	                	view.showView(chartData);
					});
				},
				"DO_SLIDE_ZOOM": function(event,extra){
					var view = this;
					view.scaleVal = extra.scaleVal;
	                zoomChange.call(view, extra.scaleVal);
				}
			},
			daoEvents: {
				"dataChange; Contact": function(){
					var view = this;
					app.ContactDao.get().done(function(chartData){
	                	view.showView(chartData);
					});
				}
			},
           	showView:function (data) {
                var view = this;
                var $e = view.$el;
                view.currentContainerName = "currentContainer";
                view.newContainerName = "newContainer";
                view.cName = "centerCircle";
                view.rootName = data.name;
                
                createjs.Ticker.useRAF = true;
				createjs.Ticker.setFPS(60);
                
                var $ClusterChart = $e.find(".clusterChart");
				$ClusterChart.empty();
				$ClusterChart.html('<canvas id="ClusterChart" ></canvas>');  
				  
				var canvas = $e.find("#ClusterChart")[0];
				canvas.width = $e.parent().width();
        		canvas.height = $e.parent().height();
        		
        		view.canvasW = canvas.width;
        		view.canvasH = canvas.height;
        		view.originPoint = {x:view.canvasW/2, y: view.canvasH/2};
        		
        		//transform data to new format
        		var dataF = transformDataLevel.call(view, data, view.originPoint, view.level, 0);
				
                var stage = new createjs.Stage(canvas);
				view.stage = stage;
				
				var container = createContainer.call(view, dataF);
				container.name = view.currentContainerName;
				container.alpha = 1;
				stage.addChild(container);
      			stage.update();
			}
        });
        
        // --------- Private Method --------- //
        	function createContainer(data){
        		var view = this;
        		var containerRoot = new createjs.Container();
        		
        		$.each(data.links,function(i,item){
			        var cData = data.links[i];
			        var line = createLine.call(view,cData.x0,cData.y0,cData.x1,cData.y1,cData.level);
			        containerRoot.addChild(line);
				});
				
				$.each(data.nodes,function(i,item){
			        var cData = data.nodes[i];
			        var node = createNodeCircle.call(view,cData.x,cData.y,cData.name,cData.level);
			        containerRoot.addChild(node);
			       	//add the click event for node
					node.addEventListener("click", function(d){clickEvent.call(view,d)});

			        //show the label
			        if((view.level-cData.level) <= 1){
			        	var text = createText.call(view,cData.x, cData.y, cData.name);
			        	containerRoot.addChild(text);
			        }
				});
				
				
				//draw the origin point
				var rootData = data.root;
				var circle = createCenterCircle.call(view, rootData.x, rootData.y, rootData.name);
				circle.children = rootData.childrenLength;
			    containerRoot.addChild(circle);
			    //add the click event for circle
			    circle.addEventListener("click", function(d){clickOriginPointEvent.call(view,d)});
			    
				var text = createText.call(view, rootData.x, rootData.y, rootData.name);
	      		containerRoot.addChild(text); 
	      			
	      		containerRoot.scaleX = view.scaleVal; 
				containerRoot.scaleY = view.scaleVal; 
				containerRoot.x = (1-view.scaleVal) * view.originPoint.x; 
				containerRoot.y = (1-view.scaleVal) * view.originPoint.y
			    
			    return containerRoot;
        	}
        	
        	/**
			 * Transform the data to the chart data type
			 * @return an array of nodes, like:
			 *         {
			 * 		    root:{name:..,childrenLength:..,x:..,y:..}
			 *         	nodes:[{name:"user1",x:..,y..,level:..},{...}],
			 *          links:[{x0:..,y0:..,x1:..,y1:..,level:..},{...}]
			 *         }
			 */
        	function transformDataLevel(data, originPoint, level, exAngle){
        		var view = this;
        		var obj = {nodes:[],links:[]};
        		
        		obj.root = {"name":data.name, "childrenLength":data.children.length, "x":originPoint.x, "y":originPoint.y};
        		
        		obj = transformDataLevelAlgo.call(view,data, originPoint, level, exAngle,obj);
        		return obj;
        	}
        	
        	function transformDataLevelAlgo(data, originPoint, level, exAngle, obj){
        		var view = this;
        		var parentName = data.name;
        		//sort the weight
				var childrenData = data.children;
				childrenData.sort(weightSort);
				//put the root data as the first one
				childrenData = app.transformDataFirst(childrenData,view.rootName);
				
      			var angle = Math.PI * 2 / childrenData.length ;
      			var rx = originPoint.x;
				var ry = originPoint.y;
     			var fpos = calculateNodePosition.call(view,childrenData,originPoint,level,exAngle);
     			
     			//draw the nodes and line
        		$.each(childrenData,function(i,item){
        			if(level != view.level && i == 0) return;
        			var cx = fpos[i].x;
			        var cy = fpos[i].y;
			        var cData = childrenData[i];
			        obj.links.push({"x0":rx, "y0":ry, "x1":cx, "y1":cy, "level":level});
			        obj.nodes.push({"x":cx, "y":cy, "level":level, "name":cData.name});
			       
			        
			        //show the children level
					if((level-1) > 0){
						var newData = app.transformData(app.dataSet, cData.name, parentName);
						var newContainer = transformDataLevelAlgo.call(view, newData, {x:cx, y:cy}, level-1, (Math.PI + angle* i)+exAngle, obj);
					}
				});
        		
        		return obj;
        	}
        	
        	function calculateNodePosition(childrenData,originPoint,level,exAngle){
        		var view = this;
        		var rx = originPoint.x;
				var ry = originPoint.y;
				var weightPerLength = _weightPerLength[view.level - level];
      			var baseLineLen = _baseLineLen[view.level - level];
      			var angle = Math.PI * 2 / childrenData.length ;
        		
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
			    return fpos;
        	}
        	
        	function zoomChange(val){
				var view = this;
				var stage = view.stage;
				var containerLayout = stage.getChildByName(view.currentContainerName);
      			var scaleVal = val || view.scaleVal;
                containerLayout.scaleX = scaleVal; 
				containerLayout.scaleY = scaleVal; 
				containerLayout.x = (1-scaleVal) * view.originPoint.x; 
				containerLayout.y = (1-scaleVal) * view.originPoint.y; 
				stage.update();
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
		    
		    function createCenterCircle(cx,cy,cName){
		    	var view = this;
		      	var r = 6;
		      	var color = _centerColors[0];
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
		    	
		    	//get the speed value
		    	app.animationSpeed = view.$el.closest(".MainScreen").find(".ControlBar .speed input").val();
		    	
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
      				
      			app.ContactDao.getByName(d.target.name).done(function(chartData){
      				var userData = transformDataLevel.call(view, chartData, view.originPoint, view.level, 0);
					//add new container
					var newContainer = createContainer.call(view, userData);
					    newContainer.name = view.newContainerName;
					    newContainer.x = newContainer.x + (d.target.x - rx)*view.scaleVal;
					    newContainer.y = newContainer.y + (d.target.y - ry)*view.scaleVal;
					    newContainer.alpha = 0;
					stage.addChild(newContainer);
					    
					stage.update();
					    
					createjs.CSSPlugin.install();
					var $contactInfo = view.$el.find(".contact-info");
				   	if($contactInfo.find("span").size() > 0){
				   		var leftVal = $contactInfo.position().left - (d.target.x - rx);
				   		var topVal = $contactInfo.position().top - (d.target.y - ry);
				   		createjs.Tween.get($contactInfo[0]).to({opacity : 0.1, left : leftVal, top : topVal }, app.animationSpeed,createjs.Ease.quartInOut).call(function(){
				   			$contactInfo.empty();
				   		});
				   	}
					      	
					var ox = statLayout.x - (d.target.x - rx);
					var oy = statLayout.y - (d.target.y - ry);
					      	
					createjs.Tween.get(statLayout).to({alpha : 0, x : ox, y : oy }, app.animationSpeed,createjs.Ease.quartInOut); 
					      	
					createjs.Tween.get(newContainer).to({alpha : 1, x : (1-view.scaleVal)*view.originPoint.x, y : (1-view.scaleVal)*view.originPoint.y}, app.animationSpeed,createjs.Ease.quartInOut).call(function() {
					    createjs.Ticker.removeEventListener("tick",stage);
					    //remove oldContainer
						newContainer.x = (1-view.scaleVal)*view.originPoint.x;
						newContainer.y = (1-view.scaleVal)*view.originPoint.y;
						stage.removeChild(statLayout);
						newContainer.name = view.currentContainerName;
						newContainer.alpha = 1;
						stage.update();
					}); 
						
	      			createjs.Ticker.addEventListener("tick", stage);
					    
				});		
			}
			    
			function clickOriginPointEvent(d){
				console.log(d.target);
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
