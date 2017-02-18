const ELEMENTS = { "wall": "img/wall.png", "space": "img/space.png", "robot": "img/robot.png", "battery": "img/battery.png" }
const field_height = 6;
const field_width = 12;
const number_of_walls = 15;

var put_to_empty_space = function ( field, src ) {
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

$(document).ready(function () {
	
    $('.js-new-game').on('click', function (e) {
        e.preventDefault();
		
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
		
        var grid = $('#grid'), row = 0, column = 0;
        grid.children().each(function () {
			column = 0;
			$(this).children().each(function () {
				$(this).children().attr('src', field[row][column]);
			   	column += 1;
			});
			row += 1;
        });
    });
});