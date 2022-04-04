const usernameMinLength = 3;
const usernameMaxLength = 30;

const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]*$/;

const passwordMinLength = 8;
const passwordMaxLength = 30;

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$/;

export {
	usernameMinLength,
	usernameMaxLength,
	usernameRegex,
	passwordMinLength,
	passwordMaxLength,
	passwordRegex,
};
