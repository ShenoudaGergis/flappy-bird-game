import Loader from "./assets.js";
import Bird   from "./bird.js";
import Block  from "./wall.js";  
//-------------------------------------------------------------------------------------------------

function Game(canvasID) {
	this.canvas  = document.getElementById(canvasID);
	this.context = this.canvas.getContext("2d");
	this.loader  = new Loader; 
	this.timer   = null;
	this.assets  = {}; 

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
		this.assets["sounds"]["background"].play();
		this.timer = setInterval(() => {

			this.updateGamePhysics();
			this.drawScene();

		} , 30)
		return done;
	} , (error) => {
		throw error
	})
}

//-------------------------------------------------------------------------------------------------

Game.prototype.drawBackground = function() {
	this.context.drawImage(this.assets["images"]["background"] , 0 , 0 , this.canvas.width , this.canvas.height);
}

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

}

//-------------------------------------------------------------------------------------------------

Game.prototype.updateGamePhysics = function() {
	if(this.bird.hit) {
		clearInterval(this.timer);
		this.assets["sounds"]["background"].pause();
		this.assets["sounds"]["lose"].play();
	}
	this.bird.updateMeasures();
	this.block.updateMeasures();
}


//-------------------------------------------------------------------------------------------------

Game.prototype.gameAudio = function() {
	this.assets["sounds"]["background"].loop = true;
	this.assets["sounds"]["background"].play();
	console.log(this.assets["sounds"]["background"])
}


let game = new Game("jesus");
game.start();
 