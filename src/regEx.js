const emailRegEx =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//at least 8 characters long, any character
const passwordRegEx = /^.{8,}$/;

// at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character (., !, @, #, $, %, ^, &, *)
// const passwordRegEx = /^(?=.*\d)(?=.*[.!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

module.exports = { emailRegEx, passwordRegEx };
