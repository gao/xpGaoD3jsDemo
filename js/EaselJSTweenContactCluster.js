;(function() {

    (function ($) {
        brite.registerView("EaselJSTweenContactCluster",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-EaselJSTweenContactCluster",{});
               	var $e = $($html);
                return $e;
            },
            postDisplay:function(data, config){
				var view = this;
                var $e = view.$el;
                
                $e.find(".useRAF input[type='checkbox']").attr("checked",app.useRAF ? true : false);
                if(app.animation == "tween"){
                	$e.find(".animation input[type='radio'][value='tween']").attr("checked","checked");
                }else{
                	$e.find(".animation input[type='radio'][value='tick']").attr("checked","checked");
                }
                
                app.ContactDao.get().done(function(chartData){
                	view.chartData = chartData;
                	view.showView(chartData);
				});
			},
			events: {
				"change; .useRAF input[type='checkbox']" : function(event){
					var view = this;
					if(app.useRAF){
						app.useRAF = false;
					}else{
						app.useRAF = true;
					}
					console.log("----useRAF:"+app.useRAF);
					view.showView(view.chartData);
				},
				
				"change; .animation input[type='radio']" : function(event){
					var view = this;
					var $this = $(event.currentTarget);
					var type = $this.val();
					app.animation = type;
					console.log("----animation:"+app.animation);
					view.showView(view.chartData);
				}
			},
           	showView:function (data) {
                var view = this;
                var $e = view.$el;
                view.currentContainerName = "currentContainer";
                view.newContainerName = "newContainer";
				
				//sort the weight
				var childrenData = data.children;
				childrenData.sort(weightSort);
				
				if(app.useRAF){
					createjs.Ticker.useRAF = true;
					createjs.Ticker.setFPS(60);
				}else{
					createjs.Ticker.useRAF = false;
				}
				
				var $ClusterChart = $e.find(".ClusterChart");
				$ClusterChart.empty();
				$ClusterChart.html('<canvas id="ClusterChart" ></canvas>');  
				  
				var canvas = $e.find("#ClusterChart")[0];
				canvas.width = $e.parent().width();
        		canvas.height = $e.parent().height();
        		
        		view.canvasW = canvas.width;
        		view.canvasH = canvas.height;

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
      			var w = view.canvasW,
				    h = view.canvasH,
				    rx = w / 2,
				    ry = h / 2;
				var weightPerLength = 20;
      			var baseLineLen = 80;
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
			        
			        var friendData = app.transformData(app.dataSet,cData.name);
			        for( j = i - 1; j >= 0; j--){
			          	for(var k = 0; k < friendData.children.length; k++){
				            var fData = friendData.children[k];
				            // has relation, draw the line
				            if(fData.name == childrenData[j].name){
				              	var fLine = createLine.call(view,fpos[i].x,fpos[i].y,fpos[j].x,fpos[j].y);
				              	containerRoot.addChild(fLine);
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
			    
			    
			    function clickEvent(d){
			    	//change the origin node and the click node
			    	containerRoot.removeChild(circle);
			    	var newCircle = new createjs.Shape();
			    	var newCircle = createCenterCircle.call(view);
				    newCircle.x = d.target.x;
				    newCircle.y = d.target.y;
      				containerRoot.addChild(newCircle);
      				
      				containerRoot.removeChild(d.target);
      				var node = createNodeCircle.call(view);
					node.x = rx;
					node.y = ry;
      				containerRoot.addChild(node);
      				
      				app.ContactDao.getByName(d.target.name).done(function(userData){
      					view.chartData = userData;
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
					    
					    stage.update();
					    
					    if(app.animation == 'tween'){
					    	console.log("--animation tween--");
							createjs.CSSPlugin.install();
						    var $contactInfo = view.$el.find(".contact-info");
				   			if($contactInfo.find("span").size() > 0){
				   				var leftVal = $contactInfo.position().left - (d.target.x - rx);
				   				var topVal = $contactInfo.position().top - (d.target.y - ry);
				   				createjs.Tween.get($contactInfo[0]).to({opacity : 0.1, left : leftVal, top : topVal }, app.speed,createjs.Ease.quartInOut).call(function(){
				   					$contactInfo.empty();
				   				});
				   			}
					      	
					      	var ox = containerRoot.x - (d.target.x - rx);
					      	var oy = containerRoot.y - (d.target.y - ry);
					      	
					      	createjs.Tween.get(containerRoot).to({alpha : 0, x : ox, y : oy }, app.speed,createjs.Ease.quartInOut); 
					      	
					      	createjs.Tween.get(newContainer).to({alpha : 1, x : 0, y : 0}, app.speed,createjs.Ease.quartInOut).call(function() {
					      		createjs.Ticker.removeEventListener("tick",stage);
					        	//remove oldContainer
						        newContainer.x = 0;
						        newContainer.y = 0;
						        stage.removeChild(containerRoot);
						        newContainer.name = view.currentContainerName;
						        newContainer.alpha = 1;
					          	stage.update();
					      	}); 
						
	      					createjs.Ticker.addEventListener("tick", stage);
						}else{
							console.log("--animation tick--");
							createjs.Ticker.addEventListener("tick", tick);
							
		      				function tick(event) {
		      					var $contactInfo = view.$el.find(".contact-info");
					   			if($contactInfo.find("span").size() > 0){
					   				/*
					   				var offsetX = d.target.x - rx;
					                var offsetY = d.target.y - ry
					                $contactInfo.css("transform", "translate(0px,0px)");
					                setTimeout(function() {
					                  	$contactInfo.addClass("transition-medium");
					                	$contactInfo.css("transform", "translate(" + (-1*offsetX) + "px," + (-1*offsetY) + "px)");
					                	$contactInfo.on('btransitionend',function(){
					                  	$contactInfo.removeClass("transition-medium");
					                  	$contactInfo.css("transform", "");
					                      	$contactInfo.empty();
					                  	});
					                }, 1);*/
					               $contactInfo.empty();
					   			}
					   			
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
		      		text.y = y0 + 20;
		      	return text;
		    }
        	
			function weightSort(a,b){
				return a.weight>b.weight ? 1 :-1;
			}
		// --------- /Private Method --------- //

    })(jQuery);
})();
