;(function() {

    (function ($) {
        brite.registerView("FabricJSContactCluster",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-FabricJSContactCluster");
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
				
				//sort the weight
				var childrenData = data.children;
				childrenData.sort(weightSort);
				
				var width = $e.parent().width();
        		var height = $e.parent().height();

				var $ClusterChart = $e.find(".ClusterChart");
				$ClusterChart.empty();
				$ClusterChart.html('<canvas id="FabricClusterChartCanvas" width='+width+' height='+height+'></canvas>');  
				   
				var canvas = new fabric.Canvas('FabricClusterChartCanvas');
        		view.canvasW = canvas.width;
        		view.canvasH = canvas.height;
        		view.canvas = canvas;
        		
				createChart.call(view,data.name,childrenData);
			}
        });
        
        // --------- Private Method --------- //
	        function createChart(parentName, childrenData){
	        	var view = this;
	        	var w = view.canvasW,
					h = view.canvasH,
					rx = w / 2,
					ry = h / 2;
				var weightPerLength = 20;
	      		var baseLineLen = 80;
	      		var angle = Math.PI * 2 / childrenData.length ;
				var fpos = [];
				
				//draw the friends line
		      	for(var i = 0; i < childrenData.length; i++){
			        var cData = childrenData[i];
			        var weight = cData.weight;
					//the higher weight, the closer the length
					weight = 10 - weight;
			        var l = weight * weightPerLength + baseLineLen;
			        var cx = rx + l * Math.sin(angle * i);
			        var cy = ry + l * Math.cos(angle * i);
			        fpos.push({x:cx, y:cy});
			        
			        var friendData = app.transformData(app.dataSet,cData.name);
			        for( j = i - 1; j >= 0; j--){
			          	for(var k = 0; k < friendData.children.length; k++){
				            var fData = friendData.children[k];
				            // has relation, draw the line
				            if(fData.name == childrenData[j].name){
				              	var fLine = createLine.call(view,[fpos[i].x,fpos[i].y,fpos[j].x,fpos[j].y]);
				              	view.canvas.add(fLine);
				              	break;
				            }
			          	}
			        }
				}
				
				//draw the nodes and line
        		$.each(childrenData,function(i,item){
        			var cx = fpos[i].x;
			        var cy = fpos[i].y;
			        var cData = childrenData[i];

					//draw the line
			        var line = createLine.call(view,[rx,ry,cx,cy]);
			        view.canvas.add(line);
			        
			        //draw the node
			        var node = createNodeCircle.call(view);
			        node.name = cData.name;
			        node.set({left:cx, top:cy});
					/*
			        node.on('selected', function(options) {
						console.log("--node--click----");
						console.log(options);
						console.log("--node---"+options.e.name);
					 	if (options.target) {
					    	console.log('an object was clicked! ', options.target.type);
					  	}	
					});*/
			        view.canvas.add(node);

			        //show the label
			        var text = createText.call(view,cx,cy, cData.name);
			        view.canvas.add(text);
				});
				
				//draw the origin point
				var circle = createCenterCircle.call(view);
			   	circle.name = parentName;
			   	circle.children = childrenData.length;
		      	circle.set({left:rx, top:ry});
		      	view.canvas.add(circle);
		      	
			    var text = createText.call(view,rx,ry, parentName);
      			view.canvas.add(text);
      			
      			/**/
      			view.canvas.off('mouse:down');
      			view.canvas.on('mouse:down', function(options) {
					if (options.target && options.target.type == 'circle') {
						console.log(options.target);
						var name = options.target.name;
						var ox = rx - options.target.left;
						var oy = ry - options.target.top;
						
						app.ContactDao.getByName(name).done(function(userData){
	      					//sort the weight
			                var childrenData = userData.children;
							childrenData.sort(weightSort);
							
							view.canvas.forEachObject(function(obj) {
						      	obj.animate('opacity', 0.1, {
								  onChange: view.canvas.renderAll.bind(view.canvas),
								  duration: 500,
								  easing: fabric.util.ease.easeOutQuad,
								  onComplete: function() {
								      obj.remove();
								  },
								});
						    });

							var newChart = createChart.call(view,name,childrenData);
						});	
					}
				});
      			
      			return view.canvas;
	        }	
	        
	        function createLine(coords) {
			  	return new fabric.Line(coords, {
			    	fill: '#dddddd',
			    	strokeWidth: 2,
			    	selectable: false
			  	});
			}
			
			function createNodeCircle(){
		      	var c = new fabric.Circle({
				    strokeWidth: 1,
				    radius: 7,
				    fill: '#d9eefe',
				    stroke: '#979ca3'
				});
		      	return c;
		    }
		    
		    function createCenterCircle(){
		      	var c = new fabric.Circle({
				    strokeWidth: 1,
				    radius: 7,
				    fill: '#ffe9c2',
				    stroke: '#a4998e'
				});
				return c;
		    }
		    
		    function createText(x0, y0, name){
		      	var text = new fabric.Text(name, { left: x0+30 , top: y0+5, fontSize: 12, fontWeight: 'normal'});
		      	return text;
		    }
	        	
			function weightSort(a,b){
				return a.weight>b.weight ? 1 :-1;
			}
		// --------- /Private Method --------- //

    })(jQuery);
})();
