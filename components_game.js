/**
* create 3 div
* @param {number} width - width of board
* @param {number} height - height of board
* @param {number} bsize - size of border in board
* @return {void}
*/
create_divs = function(width,height,bsize){
	create_div = function(id){
		let div = document.createElement('div');
		div.id = id;
		document.body.appendChild(div);
		return div;
	}
	
	create_corner = function(id,margin){
		let d=create_div(id);
		d.style.marginLeft = margin+"px";
		d.style.marginRight = "0px";
		return d;
	}
	
	create_div_tb = function(id){
		let div = create_div("div-"+id);
		div.style.display = "flex";
		div.style.marginLeft = bsize+"px";
		div.appendChild(create_corner("div-left-"+id,0));
		div.appendChild(create_corner("div-right-"+id,bsize));
	}
	
	create_div_tb("top");
	create_div("div-middle");
	create_div_tb("bottom");
}

/**
* create canvas and context
* @param {number} width - width of board
* @param {number} height - height of board
* @return {canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}
*/
create_canvas = function(width,height){
	let canvas = document.createElement('canvas');
	document.getElementById("div-middle").appendChild(canvas);
	let ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;
	ctx.textAlign = "center";
	
	return {canvas,ctx};
}

/**
* create buttons of positions in boardgame
* @param {number} width - width of board
* @param {number} height - height of board
* @param {number} bsize - size of border in board
* @return {HTMLButtonElement[]}
*/
create_position_buttons = function(width,height,bsize){
	create_button = function(buttons,id_div,pos){
		buttons[pos] = document.createElement('button');
		(buttons[pos]).textContent = pos.toString();
		(buttons[pos]).className = "button_position";
		
		document.getElementById(id_div).appendChild(buttons[pos]);
	}

	let buttons_pos = new Array(24);
	for(let i=0;i<6;i++){
		for(let t of [["left-top",13,1],["left-bottom",12,-1],["right-top",19,1],["right-bottom",6,-1]]){
			create_button(buttons_pos,"div-"+t[0],t[1]+t[2]*i);
		}
	}
	
	let v = document.querySelectorAll(".button_position");
	v.forEach(function(e){e.style.width=(width-3*border_size)/12+"px";});
	
	return buttons_pos;
}