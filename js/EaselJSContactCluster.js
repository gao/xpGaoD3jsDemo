;(function() {

    (function ($) {
        brite.registerView("EaselJSContactCluster",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-EaselJSContactCluster");
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
                view.originPoint = "originPoint";
                
        		var $container = $e.find(".EaselJSContactClusterSummary");
				$container.append("<div class='fstCon'><canvas id='ClusterChartCanvas' width='960' height='800'></canvas></div>");
				
				//sort the weight
				var childrenData = data.children;
				childrenData.sort(weightSort);
				    
				var canvas = $e.find("#ClusterChartCanvas")[0];
				var stage = new createjs.Stage(canvas);
				view.stage = stage;
				var container = createContainer.call(view,data.name,childrenData);
				container.name = view.currentContainerName;
				container.alpha = 1;
				stage.addChild(container);
      			stage.update();
			}
        });
        
        // --------- Private Method --------- //
        	function createContainer(parentName, childrenData){
        		var view = this;
      			var stage = view.stage;
      			var w = 1000,
				    h = 800,
				    rx = w / 2,
				    ry = h / 2;
				    
     			var containerRoot = new createjs.Container();
        		//draw the nodes and line
        		$.each(childrenData,function(i,item){
					var angle = Math.PI * 2 / childrenData.length * i;
					var weight = childrenData[i].weight;
					//the higher weight, the closer the length
					weight = 10 - weight;
					
					var outRx = rx + (Math.cos(angle)*weight*40);
					var outRy = ry + (Math.sin(angle)*weight*40);
					
					//draw the line
					var line = new createjs.Shape();
					line.graphics.beginStroke("#999")
						.moveTo(rx,ry)
						.lineTo(outRx,outRy)
						.closePath();
					containerRoot.addChild(line);
					
					//draw the node
					var node = new createjs.Shape();
					node.graphics.beginRadialGradientFill(["#FCA000","#F8F28A"],[0,1], 0, 0, 8, 0, 0, 0)
					                    .drawCircle(0, 0 , 8)
					                    .beginStroke("#FB4100").drawCircle(0, 0, 9)
					                    .closePath();
					node.x = outRx;
					node.y = outRy;
					node.name = item.name;
					node.weight = item.weight;
					containerRoot.addChild(node);
					
					//add the click event for node
					node.addEventListener("click", clickEvent);
					
					//show the label
					var text = new createjs.Text(childrenData[i].name, "12px Arial", "#777");
					text.x = outRx+10;
					text.y = outRy-10;
					containerRoot.addChild(text);
				});
				
				//draw the origin point
				var circle = new createjs.Shape();
			    circle.graphics
			    		.beginRadialGradientFill(["#CCFFCC", "#006400"], [0, 1], rx, ry, 0, rx, ry, 10)
			    		.drawCircle(rx, ry, 10)
			    		.beginStroke("#006400").drawCircle(rx, ry, 11)
			    		.closePath();
			    containerRoot.addChild(circle);
			    var text = new createjs.Text(parentName, "12px Arial", "#777");
					text.x = rx+10;
					text.y = ry+10;
				containerRoot.addChild(text);
			    
			    
			    function clickEvent(d){
			    	//change the origin node and the click node
			    	containerRoot.removeChild(circle);
			    	var newCircle = new createjs.Shape();
				    newCircle.graphics
				    		.beginRadialGradientFill(["#CCFFCC", "#006400"], [0, 1], 0, 0, 0, 0, 0, 10)
				    		.drawCircle(0, 0, 10)
				    		.beginStroke("#006400").drawCircle(0, 0, 11)
				    		.closePath();
				    newCircle.x = d.target.x;
				    newCircle.y = d.target.y;
      				containerRoot.addChild(newCircle);
      				
      				containerRoot.removeChild(d.target);
      				var node = new createjs.Shape();
					node.graphics.beginRadialGradientFill(["#FCA000","#F8F28A"],[0,1], 0, 0, 8, 0, 0, 0)
					                    .drawCircle(0, 0 , 8)
					                    .beginStroke("#FB4100").drawCircle(0, 0, 9)
					                    .closePath();
					node.x = rx;
					node.y = ry;
      				containerRoot.addChild(node);
      				
      				app.ContactDao.getByName(d.target.name).done(function(userData){
      					//sort the weight
		                var childrenData = userData.children;
						childrenData.sort(weightSort);
						
						//add new container
						var newContainer = createContainer.call(view, userData.name, childrenData);
					    newContainer.name = view.newContainerName;
					    newContainer.x = d.target.x - rx;
					    newContainer.y = d.target.y - ry;
					    newContainer.alpha = 0;
					    stage.addChild(newContainer);
					});				
					
					
				    stage.update();
					
      				createjs.Ticker.addEventListener("tick", tick);
      				
      				function tick(event) {
				        var oldContainer = stage.getChildByName(view.currentContainerName);
				        var newContainer = stage.getChildByName(view.newContainerName);
				        oldContainer.alpha = oldContainer.alpha - 0.1;
				        newContainer.alpha = newContainer.alpha + 0.1;
				        
				        oldContainer.x =  oldContainer.x - (d.target.x - rx) * 0.1;
				        oldContainer.y =  oldContainer.y - (d.target.y - ry) * 0.1;
				        newContainer.x =  newContainer.x - (d.target.x - rx) * 0.1;
				        newContainer.y =  newContainer.y - (d.target.y - ry) * 0.1;
				        
				        stage.update(event);
				        if(oldContainer.alpha <= 0){
				        	createjs.Ticker.removeEventListener("tick",tick);
					        //remove oldContainer
					        newContainer.x = 0;
					        newContainer.y = 0;
					        stage.removeChild(oldContainer);
					        newContainer.name = view.currentContainerName;
					        newContainer.alpha = 1;
				          	stage.update(event);
						}
      				}
			    }
			    
			    return containerRoot;
        	}
        	
			function weightSort(a,b){
				return a.weight>b.weight ? 1 :-1;
			}
		// --------- /Private Method --------- //

    })(jQuery);
})();
