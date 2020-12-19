import { percentOf , randomInteger } from "./utils.js";
//-------------------------------------------------------------------------------------------------

function Wall() {
	this.pos    = {x : null , y : null};
	this.height = null;
	this.width  = null;
}

//-------------------------------------------------------------------------------------------------

Wall.prototype.draw = function(img , context) {
	context.drawImage(img , this.pos.x , this.pos.y , this.width , this.height);
}

//-------------------------------------------------------------------------------------------------

export default function Block(canvasWidth , canvasHeight , bird) {
	this.blocks       = [];
	this.wallWidth    = percentOf(canvasWidth , 6);
	this.wallGap      = this.wallWidth * 6;
	this.bird         = bird;
	this.wallHole     = this.bird.radius * 2;
	this.canvasWidth  = canvasWidth;
	this.canvasHeight = canvasHeight;
}

//-------------------------------------------------------------------------------------------------

Block.prototype.wallInsertion = function() {
	if(this.blocks.length === 0 || 
		this.canvasWidth - this.blocks[this.blocks.length - 1]["upper"].pos.x >= this.wallGap  
		) {
		let randomHeight = randomInteger(0 , this.canvasHeight - this.wallHole);
		let upperWall = new Wall();
		let lowerWall = new Wall();

		upperWall.pos.x  = this.canvasWidth;
		upperWall.pos.y  = 0;
		upperWall.height = randomHeight; 
		upperWall.width  = this.wallWidth;

		lowerWall.pos.x  = this.canvasWidth;
		lowerWall.pos.y  = upperWall.pos.y + upperWall.height + this.wallHole;
		lowerWall.height = this.canvasHeight - (upperWall.height + this.wallHole); 
		lowerWall.width  = this.wallWidth;

		let newBlock = {
			"upper"  : upperWall,
			"lower"  : lowerWall,
			"passed" : false
		}

		this.blocks.push(newBlock);
	}
}

//-------------------------------------------------------------------------------------------------

Block.prototype.wallRemoving = function() {
	console.log(this.blocks);
	if(this.blocks.length !== 0 && (this.blocks[0]["upper"].pos.x + this.wallWidth) <= 0) {
		this.blocks.shift();
		console.log(this.blocks);
	};
}

//-------------------------------------------------------------------------------------------------

Block.prototype.updateMeasures = function() {
	this.isHitByBird();
	this.isPassedByBird();
	this.moveWalls();
	this.wallInsertion();
	this.wallRemoving();

}

//-------------------------------------------------------------------------------------------------

Block.prototype.moveWalls = function() {
	this.blocks.forEach((block) => {
		block["upper"].pos.x -= 8;
		block["lower"].pos.x -= 8;
	});
}

//-------------------------------------------------------------------------------------------------

Block.prototype.draw = function(context , img) {
	this.blocks.forEach((block) => {
		context.lineWidth = 5;
		context.beginPath();
		block["upper"].draw(img , context);
		context.moveTo(block["upper"].pos.x , block["upper"].pos.y + block["upper"].height);
		context.lineTo(block["upper"].pos.x + this.wallWidth , block["upper"].pos.y + block["upper"].height);
		context.stroke();
		context.beginPath();		
		block["lower"].draw(img , context);
		context.moveTo(block["lower"].pos.x , block["lower"].pos.y);
		context.lineTo(block["lower"].pos.x + this.wallWidth , block["lower"].pos.y);
		context.stroke();
	})
}

//-------------------------------------------------------------------------------------------------

Block.prototype.isHitByBird = function() {
	for(let i = 0;i < this.blocks.length;i++) {
		let wallUpper = this.blocks[i]["upper"];
		let wallLower = this.blocks[i]["lower"];

		if(!(this.bird.pos.x > (wallUpper.pos.x + this.wallWidth) || 
           (this.bird.pos.x + this.bird.radius) < wallUpper.pos.x || 
           this.bird.pos.y > (wallUpper.pos.y + wallUpper.height) ||
           (this.bird.pos.y + this.bird.radius) < wallUpper.pos.y)) {
			

			this.bird.hit = true;
			return;
		}

		if(!(this.bird.pos.x > (wallLower.pos.x + this.wallWidth) || 
           (this.bird.pos.x + this.bird.radius) < wallLower.pos.x || 
           this.bird.pos.y > (wallLower.pos.y + wallLower.height) ||
           (this.bird.pos.y + this.bird.radius) < wallLower.pos.y)) {
			
			this.bird.hit = true;
			return;
		}
	}

	this.bird.hit = false;
}

//-------------------------------------------------------------------------------------------------

Block.prototype.isPassedByBird = function() {
	this.blocks.forEach((block) => {
		let wall = block["upper"];
		if(!block["passed"] && (this.bird.pos.x > wall.pos.x + this.wallWidth)) {
			block["passed"] = true;
			this.bird.score++;
		}
	})
}
