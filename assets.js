import Sound from "./sound.js";
//-------------------------------------------------------------------------------------------------

export default function Loader() {
	this.assets = {
		"images" : [
			{name : "background" , url : "./assets/images/background.png"},
			{name : "bird-0" , url : "./assets/images/birdSprite/frame-0.png"},
			{name : "bird-1" , url : "./assets/images/birdSprite/frame-1.png"},
			{name : "bird-2" , url : "./assets/images/birdSprite/frame-2.png"},
			{name : "bird-3" , url : "./assets/images/birdSprite/frame-3.png"},
			{name : "pipe"    , url : "./assets/images/pipe.png"}
		],
		"sounds" : [
			{name : "background" , url : "./assets/sounds/background-music.mp3"},
			{name : "lose"       , url : "./assets/sounds/birdHit.mp3"},
		],
		"fonts"  : [
			{name : "atari1" , url : "./assets/fonts/AtariClassic-gry3.ttf"},
			{name : "atari2" , url : "./assets/fonts/AtariClassicChunky-PxXP.ttf"},
			{name : "atari3" , url : "./assets/fonts/AtariClassicExtrasmooth-LxZy.ttf"},
			{name : "atari4" , url : "./assets/fonts/AtariClassicSmooth-XzW2.ttf"},
		]
	}
}

//-------------------------------------------------------------------------------------------------

Loader.prototype.loadImages = function() {
	let promises = [];
	this.assets["images"].forEach((item) => {
		let image   = new Image;
		let promise = new Promise((resolve , reject) => {
			image.src    = item["url"];
			image.onload = () => {resolve({"name" : item["name"] , element : image})}
			image.onerror = image.onabort = (error) => {reject({"name" : item["name"] , element : image , error : error})} 
		}) 
		promises.push(promise);
	});
	return Promise.all(promises);
}

//-------------------------------------------------------------------------------------------------

Loader.prototype.loadSounds = function() {
	let promises = [];
	this.assets["sounds"].forEach((item) => {
		let audio = new Audio(item["url"]);
		let promise = new Promise((resolve , reject) => {
			audio.onloadeddata = function() { resolve({"name" : item["name"] , element : new Sound(audio)}); }
			audio.onerror = audio.onabort = function(error) { reject({"name" : item["name"] , element : audio  , error : error}); }
		});
		promises.push(promise);
	});
	return Promise.all(promises);
}

//-------------------------------------------------------------------------------------------------

Loader.prototype.loadFonts = function() {
	let promises = [];
	this.assets["fonts"].forEach((item) => {
		let font = new FontFace(item["name"] , `url(${item["url"]})`);
		promises.push(font.load().then((loadedFont) => {
			document.fonts.add(loadedFont);
			return {"name" : item["name"] , element : item["name"]};
		} , 
		(error) => {
			throw {"name" : item["name"] , element : item["name"] , error : error};
		}))
	});
	return Promise.all(promises);
}

//-------------------------------------------------------------------------------------------------


Loader.prototype.fetch = function() {

	function changeDataView(arr) {
		let newObj = {};
		arr.forEach((item) => {
			newObj[item["name"]] = item["element"];
		})
		return newObj;
	}

	return Promise.all([
		this.loadImages() , 
		this.loadSounds() , 
		this.loadFonts()
		]
	).then((items) => {
		return {
			"images" : changeDataView(items[0]),
			"sounds" : changeDataView(items[1]),
			"fonts"  : changeDataView(items[2])
		}
	})
}