;(function() {

    (function ($) {
        brite.registerView("EaselJSForceCluster",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-EaselJSForceCluster",{});
               	var $e = $($html);
                return $e;
            },
            postDisplay:function(data, config){
				var view = this;
                var $e = view.$el;
                
                app.ContactDao.get().done(function(chartData){
                	view.chartData = chartData;
                	view.showView(chartData);
				});
			},
           	showView:function (data) {
                var view = this;
                var $e = view.$el;
                view.currentContainerName = "currentContainer";
                view.newContainerName = "newContainer";
                view.rootName = data.name;
				
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
				var container = createContainer.call(view, data, view.originPoint, true);
				container.name = view.currentContainerName;
				container.alpha = 1;
				stage.addChild(container);
      			stage.update();
			}
        });
        
        // --------- Private Method --------- //
        	function createContainer(data, originPoint, showChildrenLevel){
        		var view = this;
        		var parentName = data.name;
      			//sort the weight
				var childrenData = data.children;
				childrenData.sort(weightSort);

				//remove the same node
				if(!showChildrenLevel){
					for(var i = 0; i < childrenData.length; i++){
						console.log(childrenData[i].name,  view.rootName);
						if(childrenData[i].name == view.rootName){
							console.log("remove")
							childrenData.splice(i,1);
							break;
						}
					}
				}

				
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
			        var cx = rx + l * Math.sin(angle * i);
			        var cy = ry + l * Math.cos(angle * i);
			        fpos.push({x:cx, y:cy});
			    }
			    
        		//draw the nodes and line
        		$.each(childrenData,function(i,item){
        			if(view.rootName == item.name) return;
        			var cx = fpos[i].x;
			        var cy = fpos[i].y;
			        var cData = childrenData[i];
			        
			        //draw the line
			        var line = createLine.call(view,rx,ry,cx,cy);
			        containerRoot.addChild(line);
			        
			        //draw the node
			        var node = createNodeCircle.call(view);
			        node.name = cData.name;
			        node.x = cx;
			        node.y = cy;
			        containerRoot.addChild(node);
			        
			       	//add the click event for node
					node.addEventListener("click", clickEvent);

			        //show the label
			        var text = createText.call(view,cx,cy, cData.name);
			        containerRoot.addChild(text);
				});
				
				//draw the origin point
				if(showChildrenLevel){
					var circle = createCenterCircle.call(view);
				   	circle.name = parentName;
				   	circle.children = childrenData.length;
			      	circle.x = rx;
			      	circle.y = ry;
			      	containerRoot.addChild(circle);
			      	
			      	//add the click event for circle
					circle.addEventListener("click", clickOriginPointEvent);
			      	
				    var text = createText.call(view,rx,ry, parentName);
	      			containerRoot.addChild(text); 
				}
				
			    //show the children level
				if(showChildrenLevel){
	        		$.each(childrenData,function(i,item){
	        			var cx = fpos[i].x;
				        var cy = fpos[i].y;
				        var cData = childrenData[i];
				        
				        var childName = cData.name;
				        
					    app.ContactDao.getByName(childName).done(function(userData){
							var newContainer = createContainer.call(view, userData, {x:cx, y:cy}, false);
							containerRoot.addChild(newContainer);
					    });
					});
				}
			    
			    function clickEvent(d){
			    	//change the origin node and the click node
			    	var stage = view.stage;
			    	view.rootName = d.target.name;
			    	
			    	var statLayout = stage.getChildByName(view.currentContainerName);
			    	statLayout.removeChild(circle);
			    	var newCircle = new createjs.Shape();
			    	var newCircle = createCenterCircle.call(view);
				    newCircle.x = d.target.x;
				    newCircle.y = d.target.y;
      				statLayout.addChild(newCircle);
      				
      				statLayout.removeChild(d.target);
      				var node = createNodeCircle.call(view);
					node.x = rx;
					node.y = ry;
      				statLayout.addChild(node);
      				
      				app.ContactDao.getByName(d.target.name).done(function(userData){
      					view.chartData = userData;
						
						//add new container
						var newContainer = createContainer.call(view, userData, {x:view.canvasW/2, y: view.canvasH/2}, true);
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
			    	var name = d.target.name;
			    	var children = d.target.children;
			    	
			    	var $contactInfo = view.$el.find(".contact-info");
			   		
			    	if($contactInfo.find("span").size() == 0){
			    		$contactInfo.html('<span class="label label-info">'+name+": "+children+' friends</span>')
				    	$contactInfo.css("top",d.target.y-10);
				    	$contactInfo.css("left",d.target.x+20);
				    	$contactInfo.css("opacity",1);
			    	}else{
			    		$contactInfo.empty();
			    	}
			    	
			    }
			    
			    return containerRoot;
        	}
        	
        	function createNodeCircle(name){
		      	var r = 7;
		      	var circle = new createjs.Shape();
		      		circle.graphics.beginFill("#d9eefe").drawCircle(0, 0, r);
		      		circle.graphics.beginStroke("#979ca3").drawCircle(0, 0, r+1);
		      		circle.graphics
		      	return circle;
		    }
		    
		    function createCenterCircle(name){
		      	var r = 7;
		      	var circle = new createjs.Shape();
		      		circle.graphics.beginStroke("#a4998e").drawCircle(0, 0, r+1);
		      		circle.graphics.beginFill("#ffe9c2").drawCircle(0, 0, r);
		      	return circle;
		    }
		    
		    function createLine(x0, y0, x1, y1){
		      	var line = new createjs.Shape();
		      		line.graphics.beginStroke("#dddddd").moveTo(x0,y0).lineTo(x1,y1);
		      	return line;
		    }
		    
		    function createText(x0, y0, name){
		      	var text = new createjs.Text(name, "12px Arial, #000");
		      		text.x = x0 - 10;
		      		text.y = y0 + 10;
		      	return text;
		    }
        	
			function weightSort(a,b){
				return a.weight>b.weight ? 1 :-1;
			}
		// --------- /Private Method --------- //

    })(jQuery);
})();
