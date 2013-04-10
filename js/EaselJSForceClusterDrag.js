;(function() {

    (function ($) {
        brite.registerView("EaselJSForceClusterDrag",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-EaselJSForceClusterDrag",{});
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

				var stage = new createjs.Stage(canvas);
				view.stage = stage;
				var container = createContainer.call(view, data, view.originPoint, true, 0);
				container.name = view.currentContainerName;
				container.alpha = 1;
				stage.addChild(container);
      			stage.update();
			}
        });
        
        // --------- Private Method --------- //
        	function createContainer(data, originPoint, showChildrenLevel,exAngle){
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
				var weightPerLength = showChildrenLevel ? 20 : 5;
      			var baseLineLen = showChildrenLevel ? 80 :40;
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
        			if(!showChildrenLevel && i == 0) return;
        			var cx = fpos[i].x;
			        var cy = fpos[i].y;
			        var cData = childrenData[i];
			        
			        //draw the line
			        var line = createLine.call(view,rx,ry,cx,cy,showChildrenLevel);
			        containerRoot.addChild(line);
			        
			        //draw the node
			        var node = createNodeCircle.call(view,showChildrenLevel);
			        node.name = cData.name;
			        node.x = cx;
			        node.y = cy;
			        node.originPotint = {cx:cx,cy:cy};
			        containerRoot.addChild(node);
			        node.relatedLine = line;
			       	//add the click event for node
			       	if(showChildrenLevel){
						node.addEventListener("click", function(d){clickEvent.call(view,d)});
					}else{
						node.addEventListener("mousedown", function(d){mousedownEvent.call(view,d)});
					}

			        //show the label
			        var text = createText.call(view,cx,cy, cData.name);
			        node.relatedText = text;
			        text.originPotint = {x:cx - 10,y:cy + 10};
			        containerRoot.addChild(text);
			        
			         //show the children level
					if(showChildrenLevel){
						var newData = app.transformData(app.dataSet, cData.name, parentName);
						var newContainer = createContainer.call(view, newData, {x:cx, y:cy}, false, (Math.PI + angle* i)+exAngle);
						node.relatedContainer = newContainer;
						containerRoot.addChild(newContainer);
					}
				});
				
				//draw the origin point
				if(showChildrenLevel){
					var circle = createCenterCircle.call(view);
				   	circle.name = view.cName;
				   	circle.children = childrenData.length;
			      	circle.x = rx;
			      	circle.y = ry;
			      	containerRoot.addChild(circle);
			      	//add the click event for circle
					circle.addEventListener("click", function(d){clickOriginPointEvent.call(view,d)});
			      	
				    var text = createText.call(view,rx,ry, parentName);
	      			containerRoot.addChild(text); 
				}
			    
			    return containerRoot;
        	}
        	
        	function createNodeCircle(showChildrenLevel){
		      	var r = 4;
		      	var color = "#d9eefe";
		    	if(showChildrenLevel){
		    		color = "#0B95B1";
		    	}
		      	var circle = new createjs.Shape();
		      		circle.graphics.beginStroke("#a4998e").drawCircle(0, 0, r+0.5);
		      		circle.graphics.beginFill(color).drawCircle(0, 0, r);
		      	return circle;
		    }
		    
		    function createCenterCircle(){
		      	var r = 6;
		      	var circle = new createjs.Shape();
		      		circle.graphics.beginStroke("#a4998e").drawCircle(0, 0, r+0.5);
		      		circle.graphics.beginFill("#ffe9c2").drawCircle(0, 0, r);
		      		
		      	return circle;
		    }
		    
		    function createLine(x0, y0, x1, y1, showChildrenLevel){
		    	var color = "#dddddd";
		    	if(showChildrenLevel){
		    		color = "#0B95B1";
		    	}
		      	var line = new createjs.Shape();
		      		line.graphics.beginStroke(color).moveTo(x0,y0).lineTo(x1,y1);
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
			    //change the origin node and the click node
			    var stage = view.stage;
			    view.rootName = d.target.name;
			    var rx = view.originPoint.x;
			    var ry = view.originPoint.y;
			    	
			    var statLayout = stage.getChildByName(view.currentContainerName);
			    var oldCenterCircle = statLayout.getChildByName(view.cName);
			    statLayout.removeChild(oldCenterCircle);
			        
			    var newCircle = new createjs.Shape();
			    var newCircle = createCenterCircle.call(view);
				    newCircle.x = d.target.x;
				    newCircle.y = d.target.y;
				    newCircle.name = view.cName;
      			statLayout.addChild(newCircle);
      				
      			statLayout.removeChild(d.target);
      			var node = createNodeCircle.call(view,true);
					node.x = rx;
					node.y = ry;
      			statLayout.addChild(node);
      				
      			app.ContactDao.getByName(d.target.name).done(function(userData){
					//add new container
					var newContainer = createContainer.call(view, userData, {x:view.canvasW/2, y: view.canvasH/2}, true, 0);
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
			
			function mousedownEvent(evt){
				console.log(evt.target);
				var view = this;
			    var stage = view.stage;
			    
				var target = evt.target;
			    var ox = target.x;
			    var oy = target.y;
			    var relatedText = target.relatedText;
			    var relatedLine = target.relatedLine;
			    var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};
			    
			    evt.addEventListener("mousemove",function(ev) {
			    	var offsetX = ev.stageX - target.x + offset.x;
			        var offsetY = ev.stageY - target.y + offset.y;
			        target.x = ev.stageX+offset.x;
			        target.y = ev.stageY+offset.y;
			        relatedText.x = relatedText.x+ offsetX;
			        relatedText.y = relatedText.y+ offsetY;
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
			      		relatedText.x = relatedText.x + perX;
			      		relatedText.y = relatedText.y + perY;
			      		reDrawLine.call(view,relatedLine,relatedLine.x1+perX,relatedLine.y1+perY);
			      		stage.update();
			      		count--;
				      	if(count <= 0){
				      		createjs.Ticker.removeEventListener("tick",tick);
				      		target.x = target.originPotint.cx;
				      		target.y = target.originPotint.cy;
				      		relatedText.x = relatedText.originPotint.x;
				      		relatedText.y = relatedText.originPotint.y;
				      		reDrawLine.call(view,relatedLine,target.originPotint.cx,target.originPotint.cy);
				      		stage.update();
				      	}
			    	}
				});
			}
			
			function reDrawLine(line,offsetX,offsetY) {
		        var view = this;
		        var lineClone = {x0:line.x0+0, y0:line.y0+0, x1:line.x1+0, y1:line.y1+0};
		        line.graphics.clear().beginStroke("#dddddd").moveTo(lineClone.x0, lineClone.y0).lineTo(offsetX, offsetY);
		        line.x1 = offsetX;
		        line.y1 = offsetY;
		    }
        	
			function weightSort(a,b){
				return a.weight>b.weight ? 1 :-1;
			}
		// --------- /Private Method --------- //

    })(jQuery);
})();
