const ELEMENTS = { "wall": "img/wall.png", "space": "img/space.png", "robot": "img/robot.png", "battery": "img/battery.png" }
const field_height = 6;
const field_width = 12;
const number_of_walls = 15;

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
	
	self.randomEmptyPoint = function () {
		while(true) {
			var x = Math.floor(Math.random() * field_height);
			var y = Math.floor(Math.random() * field_width);
			if(self.field()[x]()[y].src() == ELEMENTS['space']) {
				return {x: x, y: y};
			}	
		}	
	}

	self.putToPoint = function (point, value) {
		self.field()[point.x]()[point.y].src(value);
	}
	
	self.new_game = function () {
		for(var i = 0; i < self.field().length; i++ ){
			for(var j = 0; j < self.field()[i]().length; j++ ){
				self.putToPoint({x: i, y: j}, ELEMENTS['space']);
			}
		}
		self.robot = self.randomEmptyPoint();
		self.putToPoint(self.robot, ELEMENTS['robot']);

		self.battery = self.randomEmptyPoint();	
		self.putToPoint(self.battery, ELEMENTS['battery']);

		for(var i = 0; i < number_of_walls; i++){
			self.putToPoint(self.randomEmptyPoint(), ELEMENTS['wall']);
		}
	}
	
	self.GameFieldCell = function (src) {
		this.src = ko.observable(src);
	}
	
	self.field = ko.observableArray();
	
	for(var i = 0; i < field_height; i++) {
		self.field.push(ko.observableArray());
		for(var j = 0; j < field_width; j++) {
			self.field()[i]().push(new self.GameFieldCell(ELEMENTS['space']));
		}
	}
	
	self.new_game();
}

$(document).ready(function () {
	
	ko.applyBindings(new AlfredModel());
	
});