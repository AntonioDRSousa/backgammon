const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;
ctx.textAlign = "center";

class Board{
	constructor(canvas,ctx){
		this.height=canvas.height;
		this.width=canvas.width;
		this.ctx=ctx;
		
		this.border_size = 20;
		this.dh = (this.height-2*this.border_size)/3;
		this.color = ["red","yellow"];
		
		this.color_piece = {
			0 : "black",
			1 : "white",
			2 : "white",
			3 : "black"
		};
		
		this.dx = ((this.width-this.border_size)/2-this.border_size)/6;
		this.size_piece = this.dx/2;
		this.gap = 1.2;
		
		/*
			24 positions
			2 end position for each player
		*/
		this.start_position();
		
		this.draw_border();
		this.draw_board();
	}
	
	start_position(){
		/*
			>0 black pieces
			<0 white pieces
			=0 witout pieces
		*/
		this.board = new Array(26).fill(0);
		this.board[1]=-2;
		this.board[6]=5;
		this.board[8]=3;
		this.board[12]=-5;
		this.board[13]=5;
		this.board[17]=-3;
		this.board[19]=-5;
		this.board[24]=2;
	}


	draw_board(){
		const place = [[2,3],[1,0]];
		
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
					let x0 = (j+1)*this.border_size+(6*j+i)*this.dx;
					let y0 = this.border_size+k*(this.height-2*this.border_size);
					/*
						if k==0 -> h = y0 + dh
						if k==1 -> h = y0 - dh 
						h = y0 + ((-1)**k)*dh
					*/
					let h = y0 + ((-1)**k)*this.dh;
					
					// calculate position
					let z = (k-1)*(-(i+1))+k*(6-i)+6*place[k][j];
					
					this.draw_triangle(x0,y0,h,i);
					
					// draw numbers of positions
					this.ctx.fillStyle = "white";
					this.ctx.fillText(z, x0+this.border_size, y0 + ((-1)**(k+1))*(this.border_size/2));
					
					if(this.board[z]!=0){
						this.draw_pieces(x0,y0,z,k);
					}
					
				}	
			}
		}
	}
	
	draw_border(){
		this.ctx.fillStyle = "#2C1A0B";
		this.ctx.fillRect(0,0,this.border_size,this.height);
		this.ctx.fillRect(0,0,this.width,this.border_size);
		this.ctx.fillRect(this.width-this.border_size,0,this.border_size,this.height);
		this.ctx.fillRect(0,this.height-this.border_size,this.width,this.border_size);
		this.ctx.fillRect((this.width-this.border_size)/2,0,this.border_size,this.height);
	}
	
	draw_triangle(x0,y0,h,i){
		this.ctx.fillStyle = this.color[i%2];
		this.ctx.beginPath();
		this.ctx.moveTo(x0,y0);
		this.ctx.lineTo(x0+this.dx,y0);
		/*middle of triangle base
			(x0 + x0+dx ) / 2 =
			(2*x0 + dx) / 2 = 
			x0 + (dx/2)
		*/
		this.ctx.lineTo(x0+this.dx/2,h);
		this.ctx.fill();
	}
	
	draw_pieces(x0,y0,z,k){
		
		
		this.ctx.fillStyle = this.color_piece[Math.sign(this.board[z])+1];
		this.ctx.strokeStyle = this.color_piece[Math.sign(this.board[z])+2];
				
		for(let p=this.board[z];(p!=0);p-=Math.sign(this.board[z])){
			this.ctx.beginPath();
			if(Math.abs(p)<6){
				this.ctx.arc(x0+this.dx/2,y0+((-1)**k)*(1+(Math.abs(p)-1)*2*this.gap)*this.size_piece/2,this.size_piece/2,0,Math.PI*2);
			}
			else{
				this.ctx.arc(x0+this.dx/2,y0+((-1)**k)*this.size_piece/2,this.size_piece/2,0,Math.PI*2);
			}
			this.ctx.fill();
			this.ctx.stroke();
		}
		
		if(Math.abs(this.board[z])>5){
			this.ctx.fillStyle = this.color_piece[Math.sign(this.board[z])+2];
			this.ctx.fillText(Math.abs(this.board[z])-4, x0+this.dx/2,y0+((-1)**k)*(1+(Math.abs(5)-1)*2*this.gap)*this.size_piece/2);
		}
	}
}


let board = new Board(canvas,ctx);
