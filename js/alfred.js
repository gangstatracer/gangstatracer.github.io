const ELEMENTS = { "wall": "img/wall.png", "space": "img/space.png", "robot": "img/robot.png", "battery": "img/battery.png" }
const field_height = 6;
const field_width = 12;
const number_of_walls = 15;

var AlfredModel = function() {
	var self = this;
	
	//commands section
	
	self.commands = ko.observableArray();
	
	self.availableCommands = ko.observableArray(["Вверх", "Вниз", "Вправо", "Влево"]);
	
	self.selectedCommandChanged = function () {
		var times = field_width - 1;
		self.repeatTimes.removeAll();
		
		if(self.selectedCommand() == "Вверх" || self.selectedCommand() == "Вниз") {
			times = field_height - 1;			
		}
		
		for(var i = 1; i <= times; i++ ) {
			self.repeatTimes.push(i);
		}
		
		self.selectedTimes(self.repeatTimes()[0]);
	}
	
	self.repeatTimes = ko.observableArray();
	
	self.selectedTimes = ko.observable(self.repeatTimes()[0]);
	
	self.selectedCommand = ko.observable(self.availableCommands()[0]);
	
	self.selectedCommandChanged();
	
	self.addCommand = function () {
		self.commands.push({
			name : self.selectedCommand(),
			isActive : ko.observable(0),
			isError : ko.observable(0),
			times : ko.observable(self.selectedTimes())
		});
	}
	
	self.removeCommand = function (command) {
		self.commands.remove(command);
	}
	
	self.executeCommand = function (i) {
		var new_position = { x : self.robot.x, y : self.robot.y };
		var under_element = ELEMENTS['space'];
		switch(self.commands()[i].name){
			case "Вверх":
				new_position.x --;
				break;
			case "Вниз":
				new_position.x ++;
				break;
			case "Вправо":
				new_position.y ++;
				break;
			case "Влево":
				new_position.y --;
				break;
		}
		if(
			new_position.x < 0 
			|| new_position.y < 0 
			|| new_position.x >= field_height 
			|| new_position.y >= field_width
			|| self.field()[new_position.x]()[new_position.y].src() == ELEMENTS['wall']
		) {
			throw new Error("Illegal move");
		}
		else {
			self.putToPoint(self.robot, under_element);
			under_element = self.field()[new_position.x]()[new_position.y].src();
			self.putToPoint(new_position, ELEMENTS['robot']);
			self.robot.x = new_position.x;
			self.robot.y = new_position.y;
		}
	}
		
	self.disableButtons = function (disable) {
		if(disable != false) {
			$('.btn').addClass('disabled');
		}
		else {
			$('.btn').removeClass('disabled');
		}
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
	
	self.newGame = function () {
		self.disableButtons(true);
		
		for(var i = 0; i < self.field().length; i++ ){
			for(var j = 0; j < self.field()[i]().length; j++ ){
				self.putToPoint({x: i, y: j}, ELEMENTS['space']);
			}
		}
		self.robot = self.randomEmptyPoint();
		self.robot_bkp = { x : self.robot.x , y : self.robot.y };
		self.putToPoint(self.robot, ELEMENTS['robot']);

		self.battery = self.randomEmptyPoint();	
		self.putToPoint(self.battery, ELEMENTS['battery']);

		for(var i = 0; i < number_of_walls; i++){
			self.putToPoint(self.randomEmptyPoint(), ELEMENTS['wall']);
		}
		
		self.disableButtons(false);
	}
	
	self.resetGame = function () {
		self.disableButtons(true);
		
		self.putToPoint(self.robot, ELEMENTS['space']);
		self.putToPoint(self.robot_bkp, ELEMENTS['robot']);
		self.putToPoint(self.battery, ELEMENTS['battery']);
		self.robot.x = self.robot_bkp.x;
		self.robot.y = self.robot_bkp.y;
		self.commands().forEach(function (elem, i) {
			self.commands()[i].isActive(0);
			self.commands()[i].isError(0);
		});
		
		self.disableButtons(false);
	}
	
	self.startGame = function () {
		self.resetGame();
		self.disableButtons(true);
		
		var rec_exec = function (i, count) {
			self.commands()[i].isActive(1);
			
			try {
				self.executeCommand(i);
			}
			catch (err) {
				self.commands()[i].isActive(0);
				self.commands()[i].isError(1);
				self.disableButtons(false);
				return;
			}
			if ( self.robot.x == self.battery.x && self.robot.y == self.battery.y ) {
				$('#congratModal').modal();
				self.disableButtons(false);
				self.commands()[i].isActive(0);
				return;
			}
			count --;
			if(i < self.commands().length - 1 || count > 0) {
				setTimeout(function () {
					self.commands()[i].isActive(0);
					if ( count > 0 ) {
						rec_exec(i, count);
					}
					else {
						rec_exec(i + 1, self.commands()[i + 1].times())
					}
				}, 500); 				
			}
			else {
				self.commands()[i].isActive(0);
				self.disableButtons(false);
			}
		};
		
		rec_exec(0, self.commands()[0].times());
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
	
	self.newGame();
}

$(document).ready(function () {
	
	ko.applyBindings(new AlfredModel());
	
});