class Dice{
	/**
	* @constructor
	*/
	constructor(ctx,width,height,bsize,size, color1, color2, color3){
		this.dice_gra = [[[' ',' ',' '],
						  [' ','*',' '],
						  [' ',' ',' ']],
						 [[' ',' ','*'],
						  [' ',' ',' '],
						  ['*',' ',' ']],
						 [[' ',' ','*'],
						  [' ','*',' '],
						  ['*',' ',' ']],
						 [['*',' ','*'],
						  [' ',' ',' '],
						  ['*',' ','*']],
						 [['*',' ','*'],
						  [' ','*',' '],
						  ['*',' ','*']],
						 [['*','*','*'],
						  [' ',' ',' '],
						  ['*','*','*']]];
						  
		
		this.x = 3*(width-2*size)/4;
		this.y = (height-size)/2;
		this.size = size;
		this.color1 = color1;
		this.color2 = color2;
		this.color3 = color3;
		
		this.ctx = ctx;
		
		this.numbers = new Array(2);
		
		this.roll_dices();
	}
	
	/**
	* roll dices
	* @param {void}
	* @return {void}
	*/
	roll_dices(){
		for(let i=0;i<2;i++){
			this.numbers[i] = Math.floor(Math.random() * 6) + 1;
		}
	}
	
	/**
	* draw dices
	* @param {void}
	* @return {void}
	*/
	draw(){
		for(let i=0;i<2;i++){
			let x = this.x+i*2*this.size;
			
			this.ctx.strokeStyle = this.color1;
			this.ctx.fillStyle = this.color2;
			this.ctx.fillRect(x,this.y,this.size,this.size);
			this.ctx.strokeRect(x,this.y,this.size,this.size);
			
			this.ctx.fillStyle = this.color3;
			for(let j=0;j<3;j++){
				for(let k=0;k<3;k++){
					if(this.dice_gra[this.numbers[i]-1][j][k]=='*'){
						this.ctx.beginPath();
						this.ctx.arc(x+(j+1)*this.size/4,this.y+(k+1)*this.size/4,this.size/10,0,Math.PI*2);
						this.ctx.fill();
					}
				}
			}
		}
	}
}