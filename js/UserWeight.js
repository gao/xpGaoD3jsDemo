;(function() {

    (function ($) {
        brite.registerView("UserWeight",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-UserWeight");
               	var $e = $($html);
                return $e;
            },
            postDisplay:function (data, config) {
                var view = this;
                var $e = view.$el;
                
                var $container = $e.find(".UserWeightSummary");
                //clear container
				$container.empty();
				$container.append("<div class='fstCon'></div>");
				
				var dataSet = createDataSet(30);
				var chartData = transformData(dataSet);
				view.chartData = chartData;
                
                var w = 960, h = 700;

				var labelDistance = 0;
				
				var vis = d3.select(".fstCon").append("svg:svg").attr("width", w).attr("height", h);
	
				var force = d3.layout.force().size([w, h])
							.nodes(chartData.nodes)
							.links(chartData.links)
							.gravity(1)
							.linkDistance(50)
							.charge(-3000);
				force.start();
				
				var link = vis.selectAll("line.link")
							.data(chartData.links)
							.enter()
							.append("svg:line")
							.attr("class", "link")
							.style("stroke", "#CCC");
				
				var node = vis.selectAll("g.node").data(chartData.nodes).enter().append("svg:g").attr("class", "node");
					node.append("svg:circle").attr("r", 5).style("fill", "#555").style("stroke", "#FFF").style("stroke-width", 3);
					node.call(force.drag);
					node.append("text").attr("dx", 12).attr("dy", ".35em").text(function(d) { return d.name });
				
				force.on("tick", function() {
					link.attr("x1", function(d) { return d.source.x; })
				        .attr("y1", function(d) { return d.source.y; })
				        .attr("x2", function(d) { return d.target.x; })
				        .attr("y2", function(d) { return d.target.y; });
		
				    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				});/**/
			}
        });
        
        // --------- Private Method --------- //
        /**
		 * Create a random dataset that can be use for rendering
		 * @return an array of users, like:
		 *         [{id:..,
		 *           name:..,
		 *           friends:[{id:..,weight:..},{..}]
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
				
				//each user have 3 to 7 friends
				var friendsNum = RandomData(3,7);
				var friendsArr = [];
				for(var j = 0; j < friendsNum;j++){
					var friend = {};
					friend.id = j;
					friend.weight = RandomData(1,10);
					friendsArr.push(friend);
				}
				data.friends = friendsArr;
				
				dataSet.push(data);
			}
			
			return dataSet;
		}
		
		
		function RandomData(fromNum,toNum){ 
			return parseInt(Math.random()*(toNum-fromNum) + fromNum); 
		}
		
		function transformData(dataSet){ 
			var object = {nodes:[],links:[]};
			$.each(dataSet,function(i,user){
				object.nodes.push({name:user.name});
				$.each(user.friends,function(j,friend){
					object.links.push({"source":user.id-1,"target":friend.id,"weight":friend.weight});
				});
			})
			return object;
		}
		// --------- /Private Method --------- //
        
    })(jQuery);
})();
