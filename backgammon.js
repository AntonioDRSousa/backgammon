let colors = ["red","yellow","black","white","white","black","#2C1A0B","#B5651D","white"];

create_divs();
let {canvas,ctx} = create_canvas(600,400);
let buttons_pos = create_position_buttons();
let board = new Board(canvas,ctx,50,1.2,colors);
