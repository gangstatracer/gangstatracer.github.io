const ELEMENTS = { "wall": "img/wall.png", "space": "img/space.png", "robot": "img/robot.png", "battery": "img/battery.png" }
const field_height = 6;
const field_width = 12;
const number_of_walls = 15;

var field = [];
var robot_start = {};

var AlfredModel = function() {
	var self = this;
	
	//commands section
	self.commands = ko.observableArray();
	self.availableCommands = ko.observableArray(["Вверх", "Вниз", "Вправо", "Влево"]);
	self.selectedCommand = ko.observable("Вверх");
	
	self.addCommand = function () {
		self.commands.push({
			name : self.selectedCommand()
		});
	}
	
	self.removeCommand = function (command) {
		self.commands.remove(command);
	}
	
	//field section
	self.field = ko.observableArray();
	for(var i = 0; i < field_height; i++) {
		var row = ko.observableArray();
		for(var j = 0; j < field[i].length; j++) {
			row.push(ELEMENTS['space']);
		}
		self.field.push(row);
	}
}
ko.applyBindings(new AlfredModel());

function sleep(milliseconds) {
  var start = new Date().getTime();
  while(true) {
    if ((new Date().getTime() - start) > milliseconds){
      return;
    }
  }
}

function put_to_empty_space( field, src ) {
	var put = false;
	while(!put) {
		var x = Math.floor(Math.random() * field_height);
		var y = Math.floor(Math.random() * field_width);
		if(field[x][y] == ELEMENTS['space']) {
			field[x][y] = src;
			put = true;
		}	
	}
}

function init_field () {
	var field = new Array(field_height);
	for(var i = 0; i < field.length; i++) {
		field[i] = new Array(field_width);
		for(var j = 0; j < field[i].length; j++) {
			field[i][j] = ELEMENTS['space'];
		}
	}

	put_to_empty_space(field, ELEMENTS['robot']);
	put_to_empty_space(field, ELEMENTS['battery'])

	for(var i = 0; i < number_of_walls; i++) {
		put_to_empty_space(field, ELEMENTS['wall']);
	}
	return field;
}

function render_field (field) {
	var grid = $('#grid'), row = 0, column = 0;
	grid.children().each(function () {
		column = 0;
		$(this).children().each(function () {
			$(this).children().attr('src', field[row][column]);
			column += 1;
		});
		row += 1;
	});	
}

function init () {
	field = init_field();
	render_field(field)
}

function render_item (item, point) {
	field[point.x][point.y] = item;
	render_field(field);
}

$(document).ready(function () {
	
	init();	
    
	$('.js-new-game').on('click', function (e) {
        e.preventDefault();
		init();       
    });
	
	$('.js-reset').on('click', function (e) {
		e.preventDefault();
		render_field(field);
	});
	
	$('.js-run').on('click', function (e) {
		var robot = { "x": 0, "y": 0};
		for(var i = 0; i < field.length; i++) {
			for(var j = 0; j < field[i].length; j++) {
				if(field[i][j] == ELEMENTS['robot']) {
					robot.x = i;
					robot.y = j;
				}
			}
		}
		robot_start = jQuery.extend({}, robot);
		
		$('#commands-list').children().each(function (index) {
			var row = $(this), vector = {"x": 0, "y": 0};
			var command = row.children('.command').text();
			row.addClass('info');
				switch(command) {
					case 'Вверх':
						vector.x--;
						break;
					case 'Вниз':
						vector.x++;
						break;
					case 'Вправо':
						vector.y++;
						break;
					case 'Влево':
						vector.y--;
						break;
				}
			render_item(ELEMENTS['space'], robot);
			robot = {"x": robot.x + vector.x, "y": robot.y + vector.y}
			render_item(ELEMENTS['robot'], robot);
			sleep(500);
			row.removeClass('info');			
		});
	});
	
	$('.js-add-command').on('click', function (e) {
		e.preventDefault();
		$('#commands-list').append(
			'<tr><td class="command-number">' 
			+ ($('#commands-list').children().length + 1) 
			+ '</td><td class="command">' 
			+ $('#command-selection option:selected').text() 
			+ '</td><td><span class="glyphicon glyphicon-remove js-remove-command" aria-hidden="true"></span></td></tr>');
	});
	
	$('#commands-list').on('click', '.js-remove-command', function (e) {
		$(this).parent().parent().remove();
		$('#commands-list').children().each(function (index) {
			$(this).children('.command-number').text(index + 1);
		});
	});
	
});