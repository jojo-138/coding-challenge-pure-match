module.exports = (date1, date2) => {
	const timeDiffInSecs = (date1.getTime() - date2.getTime()) / 1000;
	let timeDiff;

	if (timeDiffInSecs / 31536000 >= 1) {
		// years
		timeDiff = Math.floor(timeDiffInSecs / 31536000).toString() + 'y';
	} else if (timeDiffInSecs / 2629743.83 >= 1) {
		// months
		timeDiff = Math.floor(timeDiffInSecs / 2629743.83).toString() + 'mo';
	} else if (timeDiffInSecs / 604800 >= 1) {
		// weeks
		timeDiff = Math.floor(timeDiffInSecs / 604800).toString() + 'w';
	} else if (timeDiffInSecs / 86400 >= 1) {
		// days
		timeDiff = Math.floor(timeDiffInSecs / 86400).toString() + 'd';
	} else if (timeDiffInSecs / 3600 >= 1) {
		// hours
		timeDiff = Math.floor(timeDiffInSecs / 3600).toString() + 'h';
	} else if (timeDiffInSecs / 60 >= 1) {
		// minutes
		timeDiff = Math.floor(timeDiffInSecs / 60).toString() + 'min';
	} else {
		timeDiff = Math.floor(timeDiffInSecs).toString() + 's';
	}

	return timeDiff + ' ago';
};
