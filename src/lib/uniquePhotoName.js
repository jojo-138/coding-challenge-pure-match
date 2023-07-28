module.exports = (name) => {
	const randomNum = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
	const lastIdxPeriod = name.lastIndexOf('.');
	const type = name.slice(lastIdxPeriod);
	return `${name.slice(0, lastIdxPeriod)}-${randomNum}${type}`;
};
