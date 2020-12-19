
export default function Sound(audio , loop = false) {
	this.audio = audio;
	this.loop  = loop;
}

//-------------------------------------------------------------------------------------------------

Sound.prototype.play = function() {
	this.audio.play();
}

//-------------------------------------------------------------------------------------------------

Sound.prototype.pause = function() {
	this.audio.pause();
}

