const extractTags = (tags = '') => {
	return tags.split(' ').map(tag => {
		if (tag[tag.length - 1] === ',') {
			return tag.slice(0, tag.length - 1);
		}
		return tag;
	});
};

const getReadTime = content => {
	if (!content) {
		return;
	}

	const numberOfWords = content.split(' ').length;

	switch (numberOfWords) {
	case numberOfWords > 100:
		return '10+';
	case numberOfWords > 50:
		return '5';
	case numberOfWords > 20:
		return '3';
	case numberOfWords > 10:
		return '1';
	default:
		return '< 1';
	}
};

module.exports = {
	extractTags,
	getReadTime
};