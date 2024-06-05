timer=1000,score=0;
var changeState=false,reset=false;

window.onload=function(){
    
    let bar=[[0,0,0],[0,0,0],[1,1,1]];
    let zed=[[0,0,0],[1,1,0],[0,1,1]];
    let L=[[1,0,0],[1,0,0],[1,1,0]];
    let box=[[0,0,0],[0,1,1],[0,1,1]];
    let shoter=[[0,0,0],[1,1,1],[0,1,0]];
    //creating more shapes
    let barA=[bar,[[0,1,0],[0,1,0],[0,1,0]]];
    let LA=[L,[[1,1,0],[1,0,0],[1,0,0]],[[0,1,1],[0,0,1],[0,0,1]],[[0,0,1],[0,0,1],[0,1,1]]];
    let zedA=[zed,[[0,0,1],[0,1,1],[0,1,0]]];
    let shoterA=[shoter,[[0,0,1],[0,1,1],[0,0,1]],[[0,0,0],[0,1,0],[1,1,1]],[[1,0,0],[1,1,0],[1,0,0]]];
    
    let tiles=[
        {   name:"LA",
            index:1,
            color:"#006400"
        },
        {   name:"barA",
            index:2,
            color:"#ff0000"
        },
        {   name:"zedA",
            index:3,
            color:"#ffff00"
        },
        {   name:"shoterA",
            index:5,
            color:"brown"
        }
    ];
    //let tileNames=["bar","zed","box","shoter"];
    let Xcolor={
        L:{
            color:"#006400"
        },
        bar:{
            color:"#ff0000"
        },
        zed:{
            color:"#ffff00"
        },
        box:{
            color:"#00008b"
        },
        shoter:{
            color:"brown"
        }
    }
    let start_row=0,count=0,start_col=0,rows=20,cols=20,size=6,stop=false,increment=7,changeImage=true;

    var canvas=document.getElementById("paper");
    canvas.style.height=700+"px";
    canvas.style.width=600+"px";

var ctx=canvas.getContext("2d");
ctx.scale(1.5,1);

let Board=[],remind=[],currentTile;


function    createGrid(){
    let table=Array.from({length:21},()=>Array(20).fill(0));                                                                                                                               
    return  table;
}

function bitBoard(state){
    Board=createGrid();
  if(remind.length!=0) Board=updateBoard();
for(let i=start_row,k=0; k<state.length; ++i,++k){
    for(let j=start_col,m=0; m<state[k].length; ++j,++m){
     Board[i][j]=state[k][m];
        if(Board[i+1][j]==1 && Board[i][j]==1) stop=true;
    }
}


}



function paintBoard(board,color){
    ctx.clearRect(0,0,600,800);
   for(let i=start_row; i<rows; ++i){
        for(let j=start_col; j<cols; ++j){
           if(board[i][j]==1){
            updateScreen(j,i,"cyan");
        }
        }
    }
    //painting saved data
if(start_col!=0){
    for(let i=start_row; i<rows; ++i){
        for(let j=0; j<cols; ++j){
           if(board[i][j]==1){
            updateScreen(j,i,color);
        }
        }
    }
}

}




function chooseBlock(){
 return Math.floor(Math.random()*4);
//    return 1;
}

//the coords of every 1 on the board are stored and "retrieved this way"
function updateBoard(){
    for(let i=0; i<remind.length; ++i){
    let obj=remind[i];
    Board[obj.y][obj.x]=1;
    }
    return Board;
}



function updateScreen(x,y,color){
ctx.beginPath();
ctx.fillStyle=color;
ctx.fillRect(x*increment,y*increment,size,size);
ctx.fill();
ctx.strokeStyle="yellow";
ctx.stroke();
return true;
}


function drawImage(tile){
let obj=eval(tile.name);
let block=obj[0];

let canvas2=document.createElement("canvas");
let ctx2=canvas2.getContext("2d");
    ctx2.scale(4,3);

for(i=0; i<3; ++i){
    for(j=0; j<3; ++j){
        if(block[i][j]==1){
        ctx2.fillStyle=tile.color;
        ctx2.fillRect(12+(7*i),12+(7*j),size,size);//experimental values
        ctx2.fill();
    }
    }    
}

let img=canvas2.toDataURL();
document.getElementById("nextBlock").setAttribute("src",img);

return true;
}
 
    //piece object
    class piece{
        constructor(block){
            this.block=eval(block.name);
            this.color="cyan";//block.color;
            this.index=0;
            this.state=this.block[this.index];
        }
        draw=function(){
               let n=setInterval(()=>{
                if(changeState==true) return;//pause handing
               else if(reset==true){ //reseting
                    reset=false;
                    console.log("reseting...");
                    clearInterval(n,timer);
                    Board=[];
                    start_row=0;
                    start_col=0;
                    changeImage=true;
                    ctx.clearRect(0,0,600,700);
                    run();
                }
              else  if(start_row==18||stop==true){//first row full? or block found down?
                    console.log("stopping...");
                    clearInterval(n,timer);
                    start_row=0;
                    start_col=0;
                    stop=false;
                   this.lock();
                   this.checkRowFull(n);
                   run();
                }
                else{
                    console.log(start_row);
                    bitBoard(this.state);
                    paintBoard(Board,this.color);
                    ++start_row;
                }
               },timer);
        }
        //please note the i,j interchange ...not a mistake,but bug solving
        lock=function(){
            console.log("locking...");
            for(let i=start_row; i<rows; ++i){
                for(let j=start_col; j<cols; ++j){
             if(Board[i][j]==1) remind.push({x:j,y:i}); 
                }
    }
    changeImage=true;
}
checkRowFull=(interval)=>{
    console.log("checking performance...");
    let counter=0;
    let fullRows=0;
    for(let i=start_row; i<rows; ++i){
        for(let j=start_col; j<cols; ++j){
     if(Board[i][j]==1) ++counter;
     if(counter>=20){
        score+=2;
        console.log("score obtained");
        document.getElementById("score").innerHTML=score;
        /*removing the full row by cleaning the reminding store->remind*/
        //removing row
        for(let j=0; j<remind.length; ++j){
            if(remind[j].y==i){
                remind[j].x=remind[j].x+1;
                remind[j].y=remind[j].y+1;
            }
        }
        //extending bloks down
        for(let k=0; k<remind.length; ++k){
            if(remind[k].y<i){
                remind[k].y+=1;
            }
        }
     }
        }
        counter=0;
}


for(let i=start_row; i<rows; ++i){
    for(let j=start_col; j<cols; ++j){
 if(Board[i][j]==1){
    fullRows++;
    break;
 }
    }
}

if(fullRows==19){
    stop=true;
    console.log("Game over");
}
}

  moveRight=()=> ++start_col;
  moveLeft=()=>--start_col;
  rotate=()=>{
    this.index+=1;
    this.state=this.block[this.index];
    if(this.state==undefined) {
        this.index-=1;
           this.state=this.block[this.index];
    }
}
    }


       function run(){
    let  tile=tiles[chooseBlock()];
     currentTile=new piece(tile);
       currentTile.draw();

       if(changeImage){
       drawImage(tile);
        changeImage=false;
    }

       return true;
       }
 
      
       window.addEventListener("keydown",(e)=>{
        e.preventDefault();
        if(e.key=="ArrowRight"){
        currentTile.moveRight();
        }
        else    if(e.key=="ArrowLeft"){
            currentTile.moveLeft();
        }
        else    if(e.key=="ArrowUp") currentTile.rotate();
    });

    async function start(){
        run();
        await(alert("press ok when ready to start"));
    }
    start();
    
    }




    function mode(usermode){
        if(usermode=="easy") timer=3000;
        else if(usermode=="medium") timer=1000;
        else if(usermode=="hard") timer=500;
        console.log("mode changed to:"+usermode+".."+timer);
    }


    function handleState(btnValue){
       if(btnValue=="pause"){ 
        changeState=true;
        document.getElementById("stateBtn").value="resume";   
        console.log("game paused");
    }
       else {
        changeState=false;
        document.getElementById("stateBtn").value="pause";
        console.log("game resumed");
    }
        return true;
    }

function ResetGame(){
   return reset=true;
}















