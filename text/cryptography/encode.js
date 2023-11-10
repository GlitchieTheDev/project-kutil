const xfmt = require("./format");

function encode(str) {
	let encodedStr = "";
	for (let i = 0; i < str.length; i++) {
		let charIndex = xfmt.indexOf(str.charAt(i));
		if (charIndex === -1) {
			encodedStr += "00000";
		} else {
			let numStr = "" + charIndex;
			if (numStr.length === 1) {
				numStr = "0000" + numStr;
			} else if (numStr.length === 2) {
				numStr = "000" + numStr;
			} else if (numStr.length === 3) {
				numStr = "00" + numStr;
			} else if (numStr.length === 4) {
				numStr = "0" + numStr;
			}
			encodedStr += numStr;
		}
	}
	
	if (encodedStr.length % 5 !== 0) {
		throw "the data is either corrupted or not encoded properly"
	}
	let arr = [];
	for (let i = 0; i < encodedStr.length; i += 5) {
		arr.push(encodedStr.substr(i, 5));
	}
	encodedStr = arr.reverse().join("")

	return encodedStr;
}


module.exports = encode;