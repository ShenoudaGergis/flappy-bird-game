import Loader from "./assets.js";
import Bird   from "./bird.js";
import Block  from "./wall.js"; 
import { randomInteger } from "./utils.js" 
//-------------------------------------------------------------------------------------------------

function Game(canvasID) {
	this.canvas   = document.getElementById(canvasID);
	this.context  = this.canvas.getContext("2d");
	this.loader   = new Loader; 
	this.timer    = null;
	this.assets   = {};
	this.gameOn   = false; 

	this.adjustDimensions();
	this.addCanvasControllers();

	this.bird  = new Bird(this.canvas.width , this.canvas.height);
	this.block = new Block(this.canvas.width , this.canvas.height , this.bird); 
}

//-------------------------------------------------------------------------------------------------

Game.prototype.adjustDimensions = function() {
    document.getElementsByTagName("html")[0].style.margin   = "0px";
    document.getElementsByTagName("body")[0].style.margin   = "0px";
    document.getElementsByTagName("html")[0].style.padding  = "0px";
    document.getElementsByTagName("body")[0].style.padding  = "0px";
    document.getElementsByTagName("html")[0].style.overflow = "hidden";
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;


};

//-------------------------------------------------------------------------------------------------

Game.prototype.addCanvasControllers = function() {
    document.addEventListener('keydown', (event) => {
        if(event.code === "Space") this.bird.pushedUp = true;
    });
    document.addEventListener('keyup', (event) => {
        if(event.code === "Space") this.bird.pushedUp = false;
    });
};

//-------------------------------------------------------------------------------------------------

Game.prototype.start = function() {
	return this.loader.fetch().then((done) => {
		console.log("By the name of jesus christ all done..." , done);
		this.assets = done;
		this.gameOn = true;
		this.timer = setInterval(() => {

			this.updateGamePhysics();
			this.drawScene();
			this.gameAudio();
			this.checkEnd();

		} , 30)
		return done;
	} , (error) => {
		throw error
	})
}

//-------------------------------------------------------------------------------------------------

Game.prototype.checkEnd = function() {
	if(!this.gameOn) clearInterval(this.timer);
}

//-------------------------------------------------------------------------------------------------

Game.prototype.drawBackground = function() {
	this.context.drawImage(this.assets["images"]["background-0"] , 0 , 0 , this.canvas.width , this.canvas.height);
}

//-------------------------------------------------------------------------------------------------

Game.prototype.drawGameoverScene = function() {
    this.context.font = "bold 50px atari2";
    this.context.fillStyle   = "#FFF";
    this.context.globalAlpha = 0.5;
    this.context.fillRect(0 , 0 , this.canvas.width , this.canvas.height);
    this.context.fillStyle   = "black";
    this.context.fillText("Game Over" , Math.floor(this.canvas.width) / 2 - (Math.floor(this.context.measureText("Game Over").width / 2)) , Math.floor(this.canvas.height) / 2 , this.canvas.width);
};

//-------------------------------------------------------------------------------------------------

Game.prototype.drawScore = function() {
	this.context.font = "20px atari1";
	this.context.fillText(this.bird.score , (this.canvas.width / 2)  , 50);
}

//-------------------------------------------------------------------------------------------------

Game.prototype.drawScene = function() {	
	this.context.clearRect(0 , 0 , this.canvas.width , this.canvas.height);
	this.drawBackground();
	this.block.draw(this.context , this.assets["images"]["pipe"]);
	this.bird.draw(this.context , this.assets["images"]["bird-0"] , this.assets["images"]["bird-1"] , this.assets["images"]["bird-2"] , this.assets["images"]["bird-3"]);
	this.drawScore();
	if(!this.gameOn) this.drawGameoverScene();

}

//-------------------------------------------------------------------------------------------------

Game.prototype.updateGamePhysics = function() {
	if(this.bird.hit) {
		this.gameOn = false;
	}
	this.bird.updateMeasures();
	this.block.updateMeasures();
}


//-------------------------------------------------------------------------------------------------

Game.prototype.gameAudio = function() {
	if(!this.gameOn) {
		this.assets["sounds"]["background"].pause();
		this.assets["sounds"]["lose"].play();
	} else {
		this.assets["sounds"]["background"].play();
	}
}

//-------------------------------------------------------------------------------------------------

let game = new Game("jesus");
game.start();
 