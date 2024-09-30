let colors = ["red","yellow","black","white","white","black","#2C1A0B","#B5651D","white"];
let width = 600;
let height = 400;
let border_size = 50;
let gap = 1.2;

create_divs(width,height,border_size);
let {canvas,ctx} = create_canvas(width,height);
let buttons_pos = create_position_buttons(width,height,border_size);
let board = new Board(canvas,ctx,border_size,gap,colors);
