const xfmt = require("./format");
function decode(str) {
	let decoded = '';
	// str = divideString(str).reverse().join("");

	if (str.length % 5 !== 0) {
		throw "the data is either corrupted or not encoded properly"
	}
	let arr = [];
	for (let i = 0; i < str.length; i += 5) {
		arr.push(str.substr(i, 5));
	}
	str = arr.reverse().join("")

	for (let i = 0; i < str.length; i += 5) {
		let num = parseInt(str.substr(i, 5));
		if (num < 10000) {
			num = num.toString().padStart(3, '0');
		} else if (num < 100000) {
			num = num.toString().padStart(5, '0');
		}
		decoded += xfmt.charAt(num);
	}
	return decoded;
}
module.exports = decode;