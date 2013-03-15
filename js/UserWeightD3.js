;(function() {

    (function ($) {
        brite.registerView("UserWeightD3",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-UserWeightD3");
               	var $e = $($html);
                return $e;
            },
            postDisplay:function (data, config) {
                var view = this;
                var $e = view.$el;
                
                var dataSet = createDataSet(30);
				var chartData = transformData(dataSet);
				view.dataSet = dataSet;
				view.chartData = chartData;
                
                view.showView(chartData);
			},
			showView:function(data){
				var view = this;
                var $e = view.$el;
                
				var $container = $e.find(".UserWeightD3Summary");
                //clear container
				$container.empty();
				$container.append("<div class='fstCon'></div>");
                
                var w = 1000, 
                	h = 800,
				    root;
				    
				var vis = d3.select(".fstCon").append("svg:svg").attr("width", w).attr("height", h);
	
				var force = d3.layout.force().size([w, h])
							.gravity(1)
							.linkDistance(function(d){return (10 - d.weightVal)})
							.charge(-3000);
				root = data;
			  	root.fixed = true;
			  	root.x = w / 2;
			  	root.y = h / 2 - 80;
			  	
				var nodes = flatten(root),
			        links = d3.layout.tree().links(nodes);
			
			  	force
			    	.nodes(nodes)
			      	//.links(links)
			      	.start();
				
				var link = vis.selectAll("line.link")
							.data(links, function(d) { return d.target.id; })
							.enter()
							.append("svg:line")
							.attr("class", "link")
							.style("stroke", "#CCC");
				
				var node = vis.selectAll("g.node")
							.data(nodes, function(d) { return d.id; })
							.enter().append("svg:g").attr("class", "node");
							
					node.append("svg:circle").attr("r", radius).style("fill", color);
					node.call(force.drag);
					node.append("text").attr("dx", 12).attr("dy", ".35em").text(function(d) { return d.name });
					
				node.append("title").text(function(d) { return d.name + ": " + d.weightVal; });
				
				force.on("tick", function() {
					link.attr("x1", function(d) { return d.source.x; })
				        .attr("y1", function(d) { return d.source.y; })
				        .attr("x2", function(d) { return d.target.x; })
				        .attr("y2", function(d) { return d.target.y; });
		
				    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				});
				
				//first undelegate the click event
				$e.undelegate('circle', 'click');
				
				$e.delegate("circle","click",function(){
					var userName = $(this).closest("g").find("text").text();
					
					view.showView(transformData(view.dataSet,userName));
				});
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
					friend.weightVal = RandomData(1,10);
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
			object.children.sort(weightSort);
			console.log(object);
			return object;
		}
		
		// Returns a list of all nodes under the root.
		function flatten(root) {
			var nodes = [], i = 0;
			
			function recurse(node) {
				if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
			    if (!node.id) node.id = ++i;
			    nodes.push(node);
			    return node.size;
			}
			
			root.size = recurse(root);
			return nodes;
		}
		
		//Color leaf nodes orange, and packages white or blue.
		function color(d) {
			return d._children ? "green" : d.children ? "green" : "#fd8d3c";
		}
		
		function radius(d) {
			return d._children ? 10 : d.children ? 10 : 5;
		}
		
		function weightSort(a,b){
			return a.weightVal>b.weightVal ? 1 :-1;
		}
		// --------- /Private Method --------- //
        
    })(jQuery);
})();
