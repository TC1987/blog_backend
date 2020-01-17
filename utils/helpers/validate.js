// returns errors for every property in the schema instead of
// just a boolean for displaying better error messages on frontend

const validateStrings = (property, data, required, minLength, maxLength, regex, regexReason) => {
	const errors = {};

	if (!data && required) {
		errors.required = `${property} is required`;
	}

	if (minLength && data.length < minLength) {
		errors.length = `${property} must be at least ${minLength} characters`;
	}

	if (maxLength && data.length > maxLength) {
		errors.length = `${property} must be less than ${maxLength} characters`;
	}

	if (regex) {
		if (!regex.test(data)) {
			errors.format = `${property} must ${regexReason}`;
		}
	}

	return errors;
};

const validateNumbers = (property, data, required, min, max) => {
	const errors = {};

	if (!data && required) {
		errors.required = `${property} is required`;
	}

	if (min && data < min) {
		errors.min = `${property} must be greater than ${min}`;
	}

	if (max && data > max) {
		errors.max = `${property} must be less than ${max}`;
	}

	return errors;
};

module.exports = {
	validateNumbers,
	validateStrings
}