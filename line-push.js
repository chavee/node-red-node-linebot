module.exports = function(RED) {

	function jsonparse(jstr) {
		try {
			var out = JSON.parse(jstr);
			return out;
		}
		catch(e) {
			return "";
		}
	}

    function LinePushNode(config) {
    	var rest = require('restler');

        RED.nodes.createNode(this, config);
        var node = this;
	
	    node.on('input', function(msg) {
	    	var token = config.token;
	    	var text = config.textType=='str'?config.text:(msg[config.text]||'');
	    	var target = config.target;

	    	var data = {
	    		to : target,
	    		messages : [{
	    			'type' : 'text',
	    			'text' : text
	    		}]
	    	}

	    	if (text && target && token) {
				rest.post('https://api.line.me/v2/bot/message/push', {
					headers: {
						'Content-Type'  : "application/json",
						'Authorization' : "Bearer " + token
					},
					data: JSON.stringify(data),
				}).on('complete', function(data) {
					var msg = {
		        		topic : "&status",
		        		payload : jsonparse(data),
				        raw_payload: data
		        	};
		            node.send(msg);
				});
			}
        });
    }
    RED.nodes.registerType("line",LinePushNode);
}