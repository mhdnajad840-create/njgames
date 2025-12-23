const game=document.getElementById("game");
const player=document.getElementById("player");
const scoreEl=document.getElementById("score");
const speedEl=document.getElementById("speed");
const music=document.getElementById("music");
const crash=document.getElementById("crash");

let x=130,score=0,speed=5,run=false,sound=true;
let enemyTimer,tiltEnabled=false;

document.getElementById("high").innerText=
localStorage.getItem("highScore")||0;

function startGame(){
document.getElementById("start").style.display="none";
game.style.display="block";
document.getElementById("hud").style.display="flex";
document.getElementById("controls").style.display="block";
run=true;
if(sound) music.play();
enemyTimer=setInterval(createEnemy,1500);
requestOrientation();
gameLoop();
}

function restartGame(){location.reload();}

function moveLeft(){if(x>0){x-=20;player.style.left=x+"px";}}
function moveRight(){if(x<260){x+=20;player.style.left=x+"px";}}

document.addEventListener("keydown",e=>{
if(e.key==="ArrowLeft"||e.key==="a") moveLeft();
if(e.key==="ArrowRight"||e.key==="d") moveRight();
if(e.key===" ") pauseGame();
});

function pauseGame(){
run=!run;
run?music.play():music.pause();
}

function toggleSound(){
sound=!sound;
sound && run?music.play():music.pause();
}

function createEnemy(){
if(!run) return;
let e=document.createElement("div");
e.className="enemy";
e.style.left=Math.random()*260+"px";
game.appendChild(e);
let y=-80;

let move=setInterval(()=>{
if(!run) return;
y+=speed;
e.style.top=y+"px";

if(y>350 && y<430 && Math.abs(parseInt(e.style.left)-x)<40){
if(sound) crash.play();
endGame();
clearInterval(move);
}

if(y>500){
e.remove();clearInterval(move);
score++;
if(score%10===0) speed++;
}
},20);
}

function gameLoop(){
if(!run) return;
scoreEl.innerText=score;
speedEl.innerText=speed;
requestAnimationFrame(gameLoop);
}

function endGame(){
run=false;
music.pause();
clearInterval(enemyTimer);
document.getElementById("restart").style.display="block";
let high=localStorage.getItem("highScore")||0;
if(score>high) localStorage.setItem("highScore",score);
}

/* TOUCH DRAG CONTROL */
let dragging=false;
player.addEventListener("touchstart",()=>dragging=true);
player.addEventListener("touchend",()=>dragging=false);
game.addEventListener("touchmove",e=>{
if(!dragging) return;
let r=game.getBoundingClientRect();
x=e.touches[0].clientX-r.left-20;
x=Math.max(0,Math.min(260,x));
player.style.left=x+"px";
});

/* TILT CONTROL */
function requestOrientation(){
if(typeof DeviceOrientationEvent!=="undefined"){
if(DeviceOrientationEvent.requestPermission){
DeviceOrientationEvent.requestPermission().then(p=>{
if(p==="granted") tiltEnabled=true;
});
}else tiltEnabled=true;
}
}
window.addEventListener("deviceorientation",e=>{
if(!tiltEnabled||!run) return;
x+=e.gamma*0.5;
x=Math.max(0,Math.min(260,x));
player.style.left=x+"px";
});