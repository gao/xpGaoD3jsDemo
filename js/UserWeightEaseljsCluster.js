;(function() {

    (function ($) {
        brite.registerView("UserWeightEaseljsCluster",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-UserWeightEaseljsCluster");
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
           showView:function (data) {
                var view = this;
                var $e = view.$el;
        		var $container = $e.find(".UserWeightEaseljsClusterSummary");
				$container.append("<div class='fstCon'><canvas id='ClusterChartCanvas' width='960' height='800'></canvas></div>");
				
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
					node.graphics.beginFill("rgba(255,102,0,0.75)")
					                    .drawCircle(0, 0 , 8)
					                    .closePath();
					
					container.addChild(node);
					
					//add the click event for node
					container.addEventListener("click", clickEvent);
					/*
					container.addEventListener("mouseover",function(evt){
						var html = app.render("tmpl-section-hover",evt.target);
						var $hoverBoxContainer = $e.find(".hoverBoxContainer");
						$hoverBoxContainer.empty();
						$hoverBoxContainer.append(html);
					});*/
					
					stage.addChild(container);
					
					
					//draw the line
					var line = new createjs.Shape();
					line.graphics.beginStroke("#999")
						.moveTo(rx,ry)
						.lineTo(outRx,outRy)
						.closePath();
					stage.addChild(line)
						
					//show the label
					var text = new createjs.Text(childrenData[i].name, "12px Arial", "#777");
					text.x = outRx+10;
					text.y = outRy-10;
					stage.addChild(text);
				});
				
				//draw the origin point
				var circle = new createjs.Shape();
			    circle.graphics
			    		.beginRadialGradientFill(["#CCFFCC", "#006400"], [0.1, 0.9], rx, ry, 1, rx, ry, 10)
			    		.drawCircle(rx, ry, 10)
			    		.closePath();
			    stage.addChild(circle);
			    
			    stage.update();
			    
			    
			    function clickEvent(d){
			    	console.log(d);
			    	var valX = d.target.x - rx;
			    	var valY = d.target.y - ry;
			    	console.log(d.target.x+":"+d.target.y)
			    	console.log(rx+"-"+ry);
			    	createjs.Ticker.setFPS(30);  
				    createjs.Ticker.addListener(function() {  
				    	var container = d.target;
			    		if(parseInt(container.x) != rx){
			    			if(valX >= 0){
					    		container.x = parseInt(container.x - 1);
					    	}else{
					    		container.x = parseInt(container.x + 1);
					    	}
			    		}
			    		
			    		if(parseInt(container.y) != ry){
			    			if(valY >= 0){
					    		container.y = parseInt(container.y - 1);
					    	}else{
					    		container.y = parseInt(container.y + 1);
					    	}
			    		}
			    		console.log(container.x+":::"+container.y);
			    		
			    		if(container.x == rx && container.y == ry){
			    			createjs.Ticker.removeAllListeners();
			    		}
				        stage.update();  
				    });  
			    	
			    	//stage.update();
			    }
			}
			
        });
        
        // --------- Private Method --------- //
        /**
		 * Create a random dataset that can be use for rendering
		 * @return an array of users, like:
		 *         [{id:..,
		 *           name:..,
		 *           friends:[{id:..,name:..,weight:..},{..}]
		 *          },
		 *          {..}]
		 */
		function createDataSet(dataSize){
			var dataSet = [];
			dataSize = dataSize || 10;
			
			for(var i = 1; i <= dataSize;i++){
				var data = {};
				data.id = i;
				data.name = "User" + i;
				
				//each user have 5 to 10 friends
				var friendsNum = RandomData(5,10);
				var friendsArr = [];
				for(var j = 1; j < friendsNum;j++){
					var friend = {};
					if(j == i) continue;
					friend.id = j;
					friend.name = "User" + j;
					friend.weight = RandomData(1,10);
					friendsArr.push(friend);
				}
				data.friends = friendsArr;
				
				dataSet.push(data);
			}
			
			return dataSet;
		}
		
		//generate the data between fromNum and toNum
		function RandomData(fromNum,toNum){ 
			return parseInt(Math.random()*(toNum-fromNum) + fromNum); 
		}
		
		/**
		 * Transform the data get the dataSet by name ,default the first one
		 * @return  like:
		 *         {id:..,
		 *           name:..,
		 *           children:[{id:..,name:..,weight:..},{..}]
		 *          }
		 */
		function transformData(dataSet,name){ 
			var object = {};
			if(typeof name == 'undefined'){
				var dataPart = dataSet[0];
				object.id = dataPart.id;
				object.name = dataPart.name;
				object.children = dataPart.friends;
			}else{
				$.each(dataSet,function(i,user){
					if(name == user.name){
						var dataPart = dataSet[i];
						object.id = dataPart.id;
						object.name = dataPart.name;
						object.children = dataPart.friends;
					}
				});
			}

			return object;
		}
		
		function weightSort(a,b){
			return a.weight>b.weight ? 1 :-1;
		}
		// --------- /Private Method --------- //

    })(jQuery);
})();
