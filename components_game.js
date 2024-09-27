create_divs = function(){
	create_div = function(id){
		let div = document.createElement('div');
		div.id = id;
		document.body.appendChild(div);
	}

	create_div("div-top");
	create_div("div-middle");
	create_div("div-bottom");
}

create_canvas = function(width,height){
	let canvas = document.createElement('canvas');
	document.getElementById("div-middle").appendChild(canvas);
	let ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;
	ctx.textAlign = "center";
	
	return {canvas,ctx};
}

create_position_buttons = function(){
	create_button = function(buttons,id_div,pos){
		buttons[pos] = document.createElement('button');
		(buttons[pos]).textContent = pos.toString();
		document.getElementById(id_div).appendChild(buttons[pos]);
	}

	let buttons_pos = new Array(24);
	for(let i=0;i<12;i++){
		create_button(buttons_pos,"div-top",13+i);
		create_button(buttons_pos,"div-bottom",12-i);
	}
	
	return buttons_pos;
}