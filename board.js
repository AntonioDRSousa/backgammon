/**
* represent board of game
* store state of board and draw board
* @class
*/
class Board{
	/**
	* @constructor
	* @param {HTMLCanvasElement} canvas - canvas
	* @param {CanvasRenderingContext2D} ctx - context of canvas
	* @param {number} bsize - size of border in board
	* @param {number} gap - gap between pieces in a position
	*	gap is a float value
	*	gap should be > 1.0
	*	gap = 1.0 there isn't space between pieces
	*	gap < 1.0 pieces collision
	*	the greater the gap, much bigger are spaces between pieces
	* @param {string[]} colors - codes of colors used for drawing game
	*/
	constructor(canvas,ctx,bsize,gap,colors){
		this.ctx=ctx;
		this.set_sizes(canvas.width,canvas.height,bsize,gap);
		this.set_colors(colors);
		this.play();
	}
	
	
	// Setting Methods
	
	/**
	* set sizes for drawing the game
	* @param {number} width - width of board
	* @param {number} height - height of board
	* @param {number} bsize - size of border in board
	* @param {number} gap - gap between pieces in a position
	*	gap is a float value
	*	gap should be > 1.0
	*	gap = 1.0 there isn't space between pieces
	*	gap < 1.0 pieces collision
	*	the greater the gap, much bigger are spaces between pieces
	* @return {void}
	*/
	set_sizes(width,height,bsize,gap){
		this.height=height;
		this.width=width;
		this.border_size = bsize;
		this.gap = gap;
		
		/*
			h  : altitude of triangle
			y0 : y-position of base of triangle
			
			h = y0 + dh
		*/
		this.dh = (this.height-2*this.border_size)/3;
		
		// triangle base x-position from x0 to x0+dx
		this.dx = ((this.width-this.border_size)/2-this.border_size)/6;
		
		this.size_piece = this.dx/2;
		
		this.size_font_position = this.dx/2;
		this.size_font_piece = this.dx/4;
	}
	
	/**
	* set colors for drawing the game
	* @param {string[]} colors - codes of colors used for drawing game
	* @return {void}
	*/
	set_colors(colors){
		// color of triangles
		this.color = [colors[0],colors[1]];
		
		// color used for background and foreground of pieces
		this.color_piece = {
			0 : colors[2],
			1 : colors[3],
			2 : colors[4],
			3 : colors[5]
		};
		
		this.color_border = colors[6];
		this.color_board = colors[7];
		this.color_font = colors[8];
	}
	
	
	// Game Methods
	
	/**
	* begin the game
	* @param {void}
	* @return {void}
	*/
	play(){
		this.start_position();
		this.draw();
	}
	
	/**
	* init start position for game
	* @param {void}
	* @return {void}
	*/
	start_position(){
		/*
			24 positions
			1 end position for each player : total = 2
			1 captured positions for each player : total = 2
			
			1 .. 24 : positions
			0 , 25  : end positions
			26 , 27 : captured positions
			
			>0 black pieces
			<0 white pieces
			=0 witout pieces
		*/
		this.board = new Array(28).fill(0);
		this.board[1]=-2;
		this.board[6]=5;
		this.board[8]=3;
		this.board[12]=-5;
		this.board[13]=5;
		this.board[17]=-3;
		this.board[19]=-5;
		this.board[24]=2;
	}
	
	
	// Draw Methods
	
	/**
	* draw the game
	* @param {void}
	* @return {void}
	*/
	draw(){
		this.draw_base();
		this.draw_border();
		this.draw_board();
		
		let dice = new Dice(ctx,this.width,this.height,this.border_size,36, "black", "white", "black");
		dice.draw();
	}
	
	
	/**
	* draw the base of game's board
	* drawing a rectangle of dimension of canvas
	* @param {void}
	* return {void}
	*/
	draw_base(){
		this.ctx.fillStyle = this.color_board;
		this.ctx.fillRect(0,0,this.width,this.height);
	}
	
	/**
	* draw the border of game's board
	* @param {void}
	* return {void}
	*/
	draw_border(){
		this.ctx.fillStyle = this.color_border;
		this.ctx.fillRect(0,0,this.border_size,this.height);
		this.ctx.fillRect(0,0,this.width,this.border_size);
		this.ctx.fillRect(this.width-this.border_size,0,this.border_size,this.height);
		this.ctx.fillRect(0,this.height-this.border_size,this.width,this.border_size);
		this.ctx.fillRect((this.width-this.border_size)/2,0,this.border_size,this.height);
	}

	/**
	* draw elements of board
	* draw triangles, number positions of triangles and pieces
	* draw captured pieces
	* @param {void}
	* return {void}
	*/
	draw_board(){
		/*
			board is split in 4 parts:
				top-left, top-right, bottom-left, bottom-right
			each part has 6 positions
			i : represent positions in a part
				0 to 6(exclusive)
			j :
				j=0 : left
				j=1 : right
			k :
				k=0 : top
				k=1 : bottom
		*/
		for(let i=0;i<6;i++){
			for(let j=0;j<2;j++){
				for(let k=0;k<2;k++){
					// x0 , y0 represent x , y of one triangle's point
					let x0 = (j+1)*this.border_size+(6*j+i)*this.dx;
					let y0 = this.border_size+k*(this.height-2*this.border_size);
					
					/*
						point of triangle more extreme in vertical
						
						if k==0 -> h = y0 + dh
						if k==1 -> h = y0 - dh 
						h = y0 + ((-1)**k)*dh
					*/
					let h = y0 + ((-1)**k)*this.dh;
					
					/*
						calculate real position in game with i,j,k
						
						z = (k-1)*(-(i+1))+k*(6-i)+6*place[k][j]
						
						place = [[2,3],[1,0]]
						
						k,j in {0,1}
						
						k=0 j=0 -> 2
						k=0 j=1 -> 3
						k=1 j=0 -> 1
						k=1 j=1 -> 0
						
						Represent this as:
						
						k==0 ? 2+j : 1-j
					*/
					let z = (k-1)*(-(i+1))+k*(6-i)+6*(k==0 ? 2+j : 1-j);
					
					this.draw_triangle(x0,y0,h,i);
					this.draw_numbers_positions(z,x0,y0,k);
					this.draw_pieces(x0,y0,z,k);
				}	
			}
		}
		
		this.draw_captured(0,this.border_size,1);
		this.draw_captured(1,this.height-this.border_size,-1);
		this.draw_off();
	}
	
	/**
	* draw captured pieces of one color
	* @param {number} c - color of pieces
	*	c = 0 color black
	*	c = 1 color white
	* @param {number} y0 - begin position in y-axis for draw pieces
	* @param {number} signal - control signal acording to color of pieces
	* @return {void}
	*/
	draw_captured(c,y0,signal){
		this.ctx.font = this.size_font_piece.toString()+"px Arial";
		this.ctx.fillStyle = this.color_piece[c];
		this.ctx.strokeStyle = this.color_piece[(c+1)%2];
		
		let x = this.width/2;
		let y = y0+signal*this.size_piece/2;
		
		// draw until 5 pieces
		for(let i=0;i<Math.min(this.board[26+c],5);i++,y+=signal*this.size_piece*this.gap){
			this.ctx.beginPath();
			this.ctx.arc(x,y,this.size_piece/2,0,Math.PI*2);
			this.ctx.fill();
			this.ctx.stroke();
		}
		
		// if have more than 5 pieces, then write number of extra pieces in last piece
		if(this.board[26+c]>5){
			this.ctx.fillStyle = this.color_piece[(c+1)%2];
			this.ctx.fillText(this.board[26+c]-4,x,y-signal*this.size_piece*this.gap);
		}
	}
	
	/** draw removed pieces and rectangle for removed pieces
	* @param {void}
	* @return {void}
	*/
	draw_off(){
		// dimensions of space of removed pieces
		let x = this.width-3*this.border_size/4;
		let y = this.border_size;
		let dx = this.border_size/2;
		let dy = this.height-2*this.border_size;
		
		/* 
			height of piece in horizontal
			30 pieces + 2 space between them = 32
		*/
		let dp = dy/32;
		
		// rectangle for space of removed pieces
		this.ctx.fillStyle = this.color_board;
		this.ctx.fillRect(x,y,dx,dy);
		this.ctx.fillStyle = this.color_border;
		this.ctx.fillRect(x,y+15*dp,dx,dp*2);
		
		// draw removed pieces
		this.draw_horizontal(x,dx,dp,0);
		this.draw_horizontal(x,dx,dp,1);
	}
	
	/** draw removed pieces of one color
	* @param {number} x - position of rectangle of removed pieces
	* @param {number} dx - width of rectangle of removed pieces
	* @param {number} dp - width of pieces in horizontal
	* @param {number} arg - color of pieces
	*	0 - white
	*	1 - black
	* @return {void}
	*/
	draw_horizontal(x,dx,dp,arg){
		let y = arg*(this.height - dp*this.board[25]) + (-1)**(arg)*this.border_size;
		for(let i=0;i<this.board[arg*25];i++){
			this.ctx.fillStyle = this.color_piece[(arg+1)%2];
			this.ctx.strokeStyle = this.color_piece[arg];
			this.ctx.fillRect(x,y+i*dp,dx,dp);
			this.ctx.strokeRect(x,y+i*dp,dx,dp);
		}
	}
	
	
	/**
	* draw number positions of board
	* @param {void}
	* return {void}
	*/
	draw_numbers_positions(z,x0,y0,k){
		this.ctx.fillStyle = this.color_font;
		ctx.font = this.size_font_position.toString()+"px Arial";
		this.ctx.fillText(z, x0+this.dx/2, y0 + ((-1)**(k+1))*this.size_font_position);
	}
	
	draw_triangle(x0,y0,h,i){
		// alternate colors of triangles
		this.ctx.fillStyle = this.color[i%2];
		
		/*
		triangle:
			x = x0        , y = y0
			x = x0+dx     , y = y0
			x = x0+(dx/2) , y = h
		*/
		this.ctx.beginPath();
		this.ctx.moveTo(x0,y0);
		this.ctx.lineTo(x0+this.dx,y0);
		this.ctx.lineTo(x0+this.dx/2,h);
		this.ctx.fill();
	}
	
	/**
	* draw pieces of board
	* @param {number} x0 - x-position of reference point of triangle
	* @param {number} y0 - y-position of reference point of triangle
	* @param {number} z - real position in game of triangle
	* @param {number} k - inform side(top or bottom) of triangle
	* return {void}
	*/
	draw_pieces(x0,y0,z,k){
		this.ctx.fillStyle = this.color_piece[Math.sign(this.board[z])+1];
		this.ctx.strokeStyle = this.color_piece[Math.sign(this.board[z])+2];
				
		for(let p=this.board[z];p!=0;p-=Math.sign(this.board[z])){
			this.ctx.beginPath();
			this.ctx.arc(x0+this.dx/2,y0+this.dy(k,p),this.size_piece/2,0,Math.PI*2);
			this.ctx.fill();
			this.ctx.stroke();
		}
		
		this.draw_num_pieces(x0,y0,z,k);
	}
	
	/**
	* draw number inside 5th piece if there's more than 5 pieces
	* number = number of excess pieces + 1
	* 	because 5th represent itself plus the excess pieces
	* @param {number} x0 - x-position of reference point of triangle
	* @param {number} y0 - y-position of reference point of triangle
	* @param {number} z - real position in game of triangle
	* @param {number} k - inform side(top or bottom) of triangle
	* @return {void}
	*/
	draw_num_pieces(x0,y0,z,k){
		if(Math.abs(this.board[z])>5){
			this.ctx.fillStyle = this.color_piece[Math.sign(this.board[z])+2];
			ctx.font = this.size_font_piece.toString()+"px Arial";
			this.ctx.fillText(Math.abs(this.board[z])-4, x0+this.dx/2,y0+this.dy(k,5));
		}
	}
	
	/**
	* auxiliary method for calculate the y-position of piece in reference to y0 of triangle
	* y = y0+dy
	* @param {void}
	* @return {void}
	*/
	dy(k,p){
		return ((-1)**k)*((1/2)+(Math.abs(p)-1)*this.gap*Number(Math.abs(p)<6))*this.size_piece;
	}
}