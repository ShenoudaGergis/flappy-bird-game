export default function Vector(x=0 , y=0) {
	this.x = x;
	this.y = y;
}

//-------------------------------------------------------------------------------------------------

Vector.prototype.add = function(v) {
	this.x += v.x
	this.y += v.y;
}

//-------------------------------------------------------------------------------------------------

Vector.prototype.sub = function(v) {
	this.x -= v.x
	this.y -= v.y;
}

//-------------------------------------------------------------------------------------------------

Vector.prototype.mag = function() {
	return Math.sqrt((this.x ** 2) + (this.y ** 2));
}

//-------------------------------------------------------------------------------------------------

Vector.prototype.mul = function(factor) {
	this.x *= factor;
	this.y *= factor;
}