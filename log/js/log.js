var raybot = {};

raybot.applySelectBehaviour = function() {
	$('#selectLog').change(function() {
		$.ajax({url:'http://localhost:8001/' + this.value,
			context: document.body,
			success: function(data) {
				$('#results').text(data);
			}
		});	
	});
}

$(document).ready(function() {
		raybot.applySelectBehaviour();
});

