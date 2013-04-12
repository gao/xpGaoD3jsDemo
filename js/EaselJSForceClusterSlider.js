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
                view.scaleVal = view.scaleVal || 1;
                
                $('#sl1').slider().off('slideStop');
                $('#sl1').slider().on('slideStop', function(ev){
                	view.level = ev.value;
                	app.ContactDao.getByName(view.rootName).done(function(chartData){
	                	view.showView(chartData);
					});
				});
				
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
        		view.mousemove = false;

				var stage = new createjs.Stage(canvas);
				view.stage = stage;
				stage.enableMouseOver(100);
				var container = createContainer.call(view, data, view.originPoint, view.level, 0);
				container.name = view.currentContainerName;
				container.alpha = 1;
				stage.addChild(container);
      			stage.update();
      			
      			$('#sl2').slider().off('slideStop');
      			$('#sl2').slider().on('slideStop', function(ev){
                	var zoom = ev.value;
                	var scaleVal = zoom/100;
                	view.scaleVal = scaleVal;
                	zoomChange.call(view, view.scaleVal);
				});
			}
        });
        
        // --------- Private Method --------- //
        	function createContainer(data, originPoint, level, exAngle){
        		var view = this;
        		var parentName = data.name;
      			//sort the weight
				var childrenData = data.children;
				childrenData.sort(weightSort);
				
				//put the root data as the first one
				childrenData = app.transformDataFirst(childrenData,view.rootName);
				
      			var stage = view.stage;
      			var angle = Math.PI * 2 / childrenData.length ;
      			var rx = originPoint.x;
				var ry = originPoint.y;
     			var containerRoot = new createjs.Container();
     			
     			var fpos = calculateNodePosition.call(view,childrenData,originPoint,level,exAngle);
			    
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
			        node.originPotint = {cx:cx,cy:cy};
			        node.relatedLine = line;
			        node.weight = cData.weight;
			        
			        //add the mouseover event for node
			        node.addEventListener("mouseover", function(d){mouseoverEvent.call(view,d)});
			        
			        //add the mouseout event for node
			        node.addEventListener("mouseout", function(d){mouseoutEvent.call(view,d)});
			        
			        //add the mousedown event for node
			        node.addEventListener("mousedown", function(d){mousedownEvent.call(view,d)});
			        
			       	//add the click event for node
					node.addEventListener("click", function(d){clickEvent.call(view,d)});

			        //show the label
			        if((view.level-level) <= 1){
			        	var text = createText.call(view,cx,cy, cData.name);
			        	node.relatedText = text;
			        	text.originPotint = {x:cx - 10,y:cy + 10};
			        	containerRoot.addChild(text);
			        }
			        
			        //show the children level
					if((level-1) > 0){
						var newData = app.transformData(app.dataSet, cData.name, parentName);
						var newContainer = createContainer.call(view, newData, {x:cx, y:cy}, level-1, (Math.PI + angle* i)+exAngle);
						node.relatedContainer = newContainer;
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
	      			
	      			containerRoot.scaleX = view.scaleVal; 
					containerRoot.scaleY = view.scaleVal; 
					containerRoot.x = (1-view.scaleVal) * view.originPoint.x; 
					containerRoot.y = (1-view.scaleVal) * view.originPoint.y; 
				}
			    
			    return containerRoot;
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
		      		line.color = color;
		      		line.x0 = x0;
			        line.y0 = y0;
			        line.x1 = x1;
			        line.y1 = y1;
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
		    	if(view.mousemove) return;
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
				   		createjs.Tween.get($contactInfo[0]).to({opacity : 0.1, left : leftVal, top : topVal }, app.speed,createjs.Ease.quartInOut).call(function(){
				   			$contactInfo.empty();
				   		});
				   	}
					      	
					var ox = statLayout.x - (d.target.x - rx);
					var oy = statLayout.y - (d.target.y - ry);
					      	
					createjs.Tween.get(statLayout).to({alpha : 0, x : ox, y : oy }, app.speed,createjs.Ease.quartInOut); 
					      	
					createjs.Tween.get(newContainer).to({alpha : 1, x : (1-view.scaleVal)*view.originPoint.x, y : (1-view.scaleVal)*view.originPoint.y}, app.speed,createjs.Ease.quartInOut).call(function() {
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
			
			function mouseoverEvent(evt){
				var view = this;
			    var stage = view.stage;
			    var target = evt.target;
			    
			    var $contactInfo = view.$el.find(".contact-info");
			    $contactInfo.html('<span class="label label-info">Name: '+target.name+", Weight: "+target.weight+'</span>')
				$contactInfo.css("top",target.y-10);
				$contactInfo.css("left",target.x+20);
				$contactInfo.css("opacity",1);
			}
			
			function mouseoutEvent(evt){
				var view = this;
			    $contactInfo = view.$el.find(".contact-info").empty();
			}
			
			function mousedownEvent(evt){
				var view = this;
			    var stage = view.stage;
			    view.mousemove = false;
				var target = evt.target;
			    var ox = target.x;
			    var oy = target.y;
			    var relatedContainer = target.relatedContainer;
			    var relatedText = target.relatedText;
			    var relatedLine = target.relatedLine;
			    var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};
				
			    evt.addEventListener("mousemove",function(ev) {
			    	//hide the contact info when mousemove
			    	view.$el.find(".contact-info").empty();
			    	
			    	view.mousemove = true;
			    	var offsetX = ev.stageX - target.x + offset.x;
			        var offsetY = ev.stageY - target.y + offset.y;
			        target.x = ev.stageX+offset.x;
			        target.y = ev.stageY+offset.y;
			        if(relatedContainer){
			        	relatedContainer.x = relatedContainer.x+ offsetX;
			        	relatedContainer.y = relatedContainer.y+ offsetY;
			        }
			        if(relatedText){
			        	relatedText.x = relatedText.x+ offsetX;
			        	relatedText.y = relatedText.y+ offsetY;
			        }
			        reDrawLine.call(view,relatedLine,target.x,target.y);
			        stage.update();
			    });
			    
			    evt.addEventListener("mouseup",function(ev) {
			    	var perX = (target.originPotint.cx - target.x) /10;
			        var perY = (target.originPotint.cy - target.y) /10;
			        createjs.Ticker.addEventListener("tick", tick);
			        
			        var count = 10;
			        function tick(event) {
			      		target.x = target.x + perX;
			      		target.y = target.y + perY;
			      		if(relatedContainer){
			      			relatedContainer.x = relatedContainer.x+perX;
			      			relatedContainer.y = relatedContainer.y+perY;
			      		}
			      		
			      		if(relatedText){
				      		relatedText.x = relatedText.x + perX;
				      		relatedText.y = relatedText.y + perY;
				      	}
			      		reDrawLine.call(view,relatedLine,relatedLine.x1+perX,relatedLine.y1+perY);
			      		stage.update();
			      		count--;
				      	if(count <= 0){
				      		createjs.Ticker.removeEventListener("tick",tick);
				      		if(relatedContainer){
					      		relatedContainer.x = 0;
					      		relatedContainer.y = 0;
				      		}
				      		target.x = target.originPotint.cx;
				      		target.y = target.originPotint.cy;
				      		if(relatedText){
					      		relatedText.x = relatedText.originPotint.x;
					      		relatedText.y = relatedText.originPotint.y;
				      		}
				      		reDrawLine.call(view,relatedLine,target.originPotint.cx,target.originPotint.cy);
				      		stage.update();
				      	}
			    	}
				});
			}
			
			function reDrawLine(line,offsetX,offsetY) {
		        var view = this;
		        var lineClone = {x0:line.x0+0, y0:line.y0+0, x1:line.x1+0, y1:line.y1+0};
		        line.graphics.clear().beginStroke(line.color).moveTo(lineClone.x0, lineClone.y0).lineTo(offsetX, offsetY);
		        line.x1 = offsetX;
		        line.y1 = offsetY;
        	}
        	
			function weightSort(a,b){
				return a.weight>b.weight ? 1 :-1;
			}
		// --------- /Private Method --------- //

    })(jQuery);
})();
