document.body.style.backgroundColor="skyblue"

//* intializing the canvas workspace
let canvas = document.querySelector("canvas");
function canvasClearFrame(){
    c.fillStyle="black"
    c.fillRect(0, 0, canvas.width , canvas.height)
}
canvas.width=1024;
canvas.height=576;

//* we don't wanna write the function everytime right ?
let c= canvas.getContext("2d");

c.fillStyle="black"
c.fillRect(0,0,canvas.width,canvas.height);

//* making the constant of gravity 
const gravity = 0.8

//* sprite class
class sprite {
    constructor({width,height,color,Direction},{position,velocity},HpBar){
        this.position=position
        this.velocity=velocity
        this.height=height//176
        this.width=width//80
        this.color=color//whatever
        this.Direction=Direction;
        this.hp=100
        this.HpBar=HpBar
        this.HpBar.style.width=this.hp+"%"
        this.attack={
            position:this.position,
            width:120,
            height:50
        }
        this.keys={
            leftKey:{
                pressed:false
            },
            rightKey:{
                pressed:false
            },
            upKey:{
                pressed:false
            },
            lastKey:null
        }
        this.isAttacking=false;
    }
    
    
    draw(){
        //! draw the character
        c.fillStyle=this.color
        c.fillRect(this.position.x , this.position.y , this.width , this.height)
     
        //!draw attack
        if(this.isAttacking){
            if(this.Direction==="left"){
                c.fillStyle="white"
                c.fillRect(this.attack.position.x-(this.attack.width-this.width), this.attack.position.y , this.attack.width , this.attack.height)
            }
            else{
                c.fillStyle="white"
                c.fillRect(this.attack.position.x , this.attack.position.y , this.attack.width , this.attack.height)
            }
        }
    }
    update(){
        //! moving by adding veloctiy to position
        this.position.y+=this.velocity.y;
        this.position.x+=this.velocity.x;    
        //!cheking if it's going to touch the bottom
        if((this.position.y+this.height+this.velocity.y)>=canvas.height){
            this.velocity.y=0;
        }
        else{
        //? if not we just add the gravity value that
        //? speeds up the falling speed normaly
            this.velocity.y+=gravity; 
        }
        //!finally draw it up
        this.draw()
    }
    
    moving(hm , vm){
        //*horizontally
        //! checking which key is pressed , if both were
        //! pressed we check which key was last touched!
        if(this.keys.leftKey.pressed===true && this.keys.lastKey==="ArrowLeft")
        this.velocity.x=-hm
        else if (this.keys.rightKey.pressed===true && this.keys.lastKey==="ArrowRight")
        this.velocity.x=hm
        else this.velocity.x=0
        //*vetically (jumbing)
        if(this.keys.upKey.pressed===true)
        this.velocity.y=-vm;
    }
    attackYo(){
        this.isAttacking=true;
        setTimeout(()=>{
            this.isAttacking=false;
        },250)
        
    }

    subHealth(){
        this.hp-=10;
        this.HpBar.style.width=this.hp+"%"
    }
}

//*creating the player and the enemy
const player = new sprite(
    {width:80,height:176,color:"red",Direction:"right"},
    {
    position:{
    x:100,y:0}, 
    velocity:{
    x:0,y:10}
},document.getElementById("playerHp"))

const enemy = new sprite(
    {width:80,height:176,color:"green",Direction:"left"},
    {
    position:{
    x:800,y:0}, 
    velocity:{
    x:0,y:10}
},document.getElementById("enemyHp"))

//!player event listener
window.addEventListener("keydown",event=>{
    switch(event.key){
        case "a" :
        player.keys.leftKey.pressed=true;
        player.keys.lastKey="ArrowLeft"
        break ;
        case "d" :
        player.keys.rightKey.pressed=true;
        player.keys.lastKey="ArrowRight"
        break ;
        case "w" :
        player.keys.upKey.pressed=true;
        break ;
        case "s" :
        player.attackYo();
        break ;
    }
})
window.addEventListener("keyup",event=>{
    switch(event.key){
        case "a" :
        player.keys.leftKey.pressed=false;
        player.keys.lastKey="ArrowLeft"
        break ;
        case "d" :
        player.keys.rightKey.pressed=false;
        player.keys.lastKey="ArrowRight"
        break ;
        case "w" :
        player.keys.upKey.pressed=false;
        break ;
    }
})


//!enemy event listeners
window.addEventListener("keydown",event=>{
    switch(event.key){
        case "ArrowLeft" :
        enemy.keys.leftKey.pressed=true;
        enemy.keys.lastKey="ArrowLeft"
        break ;
        case "ArrowRight" :
        enemy.keys.rightKey.pressed=true;
        enemy.keys.lastKey="ArrowRight"
        break ;
        case "ArrowUp" :
        enemy.keys.upKey.pressed=true;
        break ;
        case "ArrowDown" :
        enemy.attackYo();
        break ;
    }
})
window.addEventListener("keyup",event=>{
    switch(event.key){
        case "ArrowLeft" :
        enemy.keys.leftKey.pressed=false;
        enemy.keys.lastKey="ArrowLeft"
        break ;
        case "ArrowRight" :
        enemy.keys.rightKey.pressed=false;
        enemy.keys.lastKey="ArrowRight"
        break ;
        case "ArrowUp" :
        enemy.keys.upKey.pressed=false;
        break ;
    }
})

//!where detect if attack collision has happend...
function detectCollision(player1,player2){
    return(
        player1.position.x+player1.attack.width>=player2.position.x
        &&player1.position.x<=player2.position.x+player2.width
        &&player1.position.y>=player2.position.y-player2.attack.height
        &&player1.position.y-player1.attack.height<=player2.position.y
        &&(player1.isAttacking||player2.isAttacking)
        )
}
//!detect a hit
function detectHit(player1,player2){
    //!collision detection
    let hit = detectCollision(player1,player2)
  
    //!if collision is detected 
    //!which one has attacked!!
    //!substruct health from the attacked!
    if(hit){
        if(player1.isAttacking){
            player2.subHealth()
            player1.isAttacking=false
            }
        else {
            player1.subHealth()
            player2.isAttacking=false
            }
    }
}


//?just change time rh to change game duration

//! stop time is when a player just win before end time
let stopTime=false

//! it works in both situation ...
let timeEnd=false

//* once any of those is true game ends !!


//! timer
let time = 60
let timer=document.getElementsByClassName("timer")[0]
timer.textContent=time

function decreaseTime(){
    let timeDecreasing = setInterval(
        ()=>{
        time-=1
        timer.textContent=time
        if(time===0||stopTime===true){
            clearInterval(timeDecreasing)
            timeEnd=true;
        }
            }
            ,1000)
}

decreaseTime()


//!game repeater
//!checking winner
function checkWin(){
    //!time end situation 
    if(timeEnd){
        if(player.hp>enemy.hp) result.textContent="player has won"
        else if(player.hp<enemy.hp) result.textContent="enemy has won"
        else result.textContent="it's a draw"

        timeEnd=false
        }

    //!hp end situation
    if(enemy.hp===0||player.hp===0){
        if(enemy.hp===0) result.textContent="player has won"
        else result.textContent="enemy has won"
        stopTime=true
        enemy.subHealth()
        player.subHealth()
        }
    }
    

    //!result ...
    //?winner :
    let result = document.getElementById("gameResult").getElementsByTagName("p")[0];


//*game's infinit loop...
function animate(){
    window.requestAnimationFrame(animate)
    canvasClearFrame()
    player.update()
    enemy.update()
    player.moving(4,16)
    enemy.moving(4,16)
    detectHit(player,enemy)
    checkWin()
} 

//*starting the game !!
animate()

