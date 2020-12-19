export function percentOf(v , p) {
	return p * v / 100;
}

//-------------------------------------------------------------------------------------------------

export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
