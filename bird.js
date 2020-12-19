import Vector from "./vector.js";
import { percentOf } from "./utils.js";
//-------------------------------------------------------------------------------------------------

export default function Bird(canvasWidth , canvasHeight) {
	this.pushedUp     = false;
	this.hit          = false;
	this.score        = 0;   
	this.frame        = 0;
	this.canvasWidth  = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.vel    = new Vector(0 , 0);
	this.radius = percentOf(this.canvasWidth * this.canvasHeight , 0.008);
	this.pos    = new Vector(this.radius * 2 , this.canvasHeight / 2);
	this.tForce    = new Vector(0 , 3);
	this.gForce    = new Vector(0 , 0);
	this.fForce    = new Vector(0 , 0.5);
}

//-------------------------------------------------------------------------------------------------

Bird.prototype.draw = function(context , ...imgs) {
	context.drawImage(imgs[this.frame] , this.pos.x , this.pos.y , this.radius  , this.radius);
	this.frame += 1;
	if(this.frame === 4) this.frame = 0;
}

//-------------------------------------------------------------------------------------------------

Bird.prototype.updateMeasures = function() {
	if(this.pushedUp) this.vel.sub(this.tForce);
	this.vel.add(this.gForce);
	this.pos.add(this.vel);

	this.collide();
}

//-------------------------------------------------------------------------------------------------

Bird.prototype.collide = function() {
	if(this.gForce.y === 0 && this.pushedUp) this.gForce = new Vector(0 , 1.2);
	if(this.pos.y <= 0 ) {
		this.pos.y = 0;
		this.vel.mul(-1);
		this.vel.sub(this.fForce);
	} else if(this.pos.y + this.radius >= this.canvasHeight) {
		this.pos.y = this.canvasHeight - this.radius;
		this.vel.mul(-1);
		this.vel.add(this.fForce);
	}
}

//-------------------------------------------------------------------------------------------------


Bird.prototype.getCentralPoint = function() {
	return { 
		x : this.pos.x + this.radius / 2,
		y : this.pos.y + this.radius / 2,
	}
}