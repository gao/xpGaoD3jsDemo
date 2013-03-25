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
                
                var dataSet = app.createDataSet(30);
				var chartData = app.transformData(dataSet);
				view.dataSet = dataSet;
                
                view.showView(chartData);
			},
           showView:function (data,offset) {
                var view = this;
                var $e = view.$el;
                
        		var $container = $e.find(".EaselJSContactClusterSummary");
        		if(typeof offset == "undefined"){
					offset ={xVal:0,yVal:0};
					$container.append("<div class='fstCon'><canvas id='ClusterChartCanvas' width='960' height='800'></canvas></div>");
				}
				
				//sort the weight
				var childrenData = data.children;
				childrenData.sort(weightSort);
				
			    var w = 1000,
				    h = 800,
				    rx = w / 2,
				    ry = h / 2;
				    
				var canvas = $e.find("#ClusterChartCanvas")[0];
				var stage = new createjs.Stage(canvas);
				stage.enableMouseOver(20);
				var containerRoot = new createjs.Container();
				
			    $.each(childrenData,function(i,item){
					var angle = (360/childrenData.length)*(Math.PI/180)*i;
					var weight = childrenData[i].weight;
					//the higher weight, the closer the length
					weight = 10 - weight;
					
					var outRx = rx + (Math.cos(angle)*weight*40);
					var outRy = ry + (Math.sin(angle)*weight*40);
					
					var container = new createjs.Container();
					container.x = outRx;
					container.y = outRy;
					container.name = item.name;
					container.weight = item.weight;
					
					//draw the node
					var node = new createjs.Shape();
					node.graphics.beginRadialGradientFill(["#FCA000","#F8F28A"],[0,1], 0, 0, 8, 0, 0, 0)
					                    .drawCircle(0, 0 , 8)
					                    .beginStroke("#FB4100").drawCircle(0, 0, 9)
					                    .closePath();
					
					container.addChild(node);
					containerRoot.addChild(container);
					
					//add the click event for node
					container.addEventListener("click", clickEvent);
					
					
					//draw the line
					var line = new createjs.Shape();
					line.graphics.beginStroke("#999")
						.moveTo(rx,ry)
						.lineTo(outRx,outRy)
						.closePath();
					containerRoot.addChild(line);
						
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
			    stage.addChild(containerRoot);
			    stage.update();
			    
			    function clickEvent(d){
			    	console.log(d);
			    	var valX = parseInt(d.target.x - rx);
			    	var valY = parseInt(d.target.y - ry);
			    	var offset ={xVal:valX,yVal:valY};
			    	
			    	createjs.Ticker.setFPS(500);  
				    createjs.Ticker.addListener(function() {  
				    	var container = d.target;
			    		if(Math.abs(parseInt(containerRoot.x)) != Math.abs(valX)){
			    			if(valX >= 0){
					    		containerRoot.x = parseInt(containerRoot.x - 1);
					    	}else{
					    		containerRoot.x = parseInt(containerRoot.x + 1);
					    	}
			    		}
			    		
			    		if(Math.abs(parseInt(containerRoot.y)) != Math.abs(valY)){
			    			if(valY >= 0){
					    		containerRoot.y = parseInt(containerRoot.y - 1);
					    	}else{
					    		containerRoot.y = parseInt(containerRoot.y + 1);
					    	}
			    		}
			    		
			    		if(Math.abs(parseInt(containerRoot.x)) == Math.abs(valX) && Math.abs(parseInt(containerRoot.y)) == Math.abs(valY)){
			    			createjs.Ticker.removeAllListeners();
			    			
			    			window.setTimeout(function(){
					        	var userData = app.transformData(view.dataSet,d.target.name);
					        	view.showView(userData,offset);
					       	},app.speed);
			    		}
			    		
				        stage.update();  
				       
				    });  
			    	
			    	//stage.update();
			    }
			}
			
        });
        
        // --------- Private Method --------- //
		function weightSort(a,b){
			return a.weight>b.weight ? 1 :-1;
		}
		// --------- /Private Method --------- //

    })(jQuery);
})();
