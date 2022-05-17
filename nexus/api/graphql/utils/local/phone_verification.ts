
export const getRandomVerificationNumber = () => ("000000" + Math.floor(Math.random() * 1000000)).slice(-6);