function myWebSocket(wsPath){
	this.handlers={};
	var self=this;
	this.messageHandler=null;
	this.defaultHandler=function(data){
		if(this.messageHandler && typeof this.messageHandler === 'function'){
			this.messageHandler(data);
		}
		if(data && data['type']){
			 if (!(data['type'] in this.handlers)) {
			    return ;
			  }
			 var stack = this.handlers[data.type];
			 for (var i = 0, l = stack.length; i < l; i++) {
			    stack[i](data);
			 }
		} 
	}
	
	this.autoReconnect=true;
	this.wsBindFuncs={
		open:function(e) {
			 console.log('on open', e);
		},
		message:function(e) {
			console.log('on message', e);
			var data = JSON.parse(e.data);
			self.defaultHandler(data);
		},
		close : function(e) {
			console.log('on close', e);
			if(self.autoReconnect){
		        setTimeout(function(){startWS();}, 5000);
			}
		}
		,error : function(e) {
			console.log('on error', e);
		} 
	}
	var ws = null;
	function startWS(){
		ws = new WebSocket(wsPath);
		ws.onopen = self.wsBindFuncs.open;
		ws.onmessage = self.wsBindFuncs.message;
		ws.onclose =self.wsBindFuncs.close;
		ws.onerror = self.wsBindFuncs.error;
	};
	if(wsPath)startWS();
	this.getWS = function(){return ws;};
	this.wsBind= function(onEvt, func, thisObj){
	  //if(!ws){alert('websocket is not initial yet.');return;}
	  //ws[(onEvt.indexOf('on')!=0?'on'+onEvt:onEvt)]=func.bind(this);
		if(thisObj && typeof thisObj === 'object')
			this.wsBindFuncs[onEvt] = func.bind(thisObj);
		else
			this.wsBindFuncs[onEvt] = func;
	};
	this.closeWS=function(){
		if(ws != null){
			var b = this.autoReconnect;
			this.autoReconnect=false;
			ws.close();
			this.autoReconnect = b;
		}
	};
	this.sendWS=function(type, msg) {
	  var json = {
		    "type": type,
		    "msg": msg,
		    date: Date.now()
		  };

		  ws.send(JSON.stringify(json));
	};
	this.reStartWS=function(wpath){
		if(wpath)wsPath=wpath;
		ws=null; 
		startWS();
	};
 }
myWebSocket.prototype.setMessageHandler = function(func, thisObj){
	if(thisObj && typeof thisObj === 'object')
		this.messageHandler = func.bind(thisObj);
	else
		this.messageHandler=func;
}
myWebSocket.prototype.addEventHandler = function(type, callback) {
  if (!(type in this.handlers)) {
    this.handlers[type] = [];
  }
  if(typeof callback === 'function')
	  this.handlers[type].push(callback);
};
myWebSocket.prototype.addEventHandlers = function(ehandlers) {
	  for(var key in ehandlers){
		  this.addEventHandler(key, ehandlers[key]);
	  }
};
myWebSocket.prototype.removeEventHandler = function(type, callback) {
  if (!(type in this.handlers)) {
    return;
  }
  var stack = this.handlers[type];
  for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback){
      stack.splice(i, 1);
      return;
    }
  }
};
myWebSocket.prototype.removeHandlersByType = function(type) {
  if (!(type in this.handlers)) {
    return;
  }
  var stack = this.handlers[type];
  for (var i = 0, l = stack.length; i < l; i++) {
      stack.splice(i, 1);
  }
  delete this.handlers[type];
  return;
};
