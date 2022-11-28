const numbers = '0123456789';
const vovelsUpper = 'AEIOU';
const vovelsLower = 'aeiou';
const consonantsUpper = 'BCDFGHJKLMNPQRSTVWXYZ';
const consonantsLower = 'bcdfghjklmnpqrstvwxyz';
const specialChars = '!§$%?=#+*~-_;./()';
const lettersUpper = vovelsUpper + consonantsUpper;
const lettersLower = vovelsLower + consonantsLower;
const letters = lettersUpper + lettersLower;
const alphaNumeric = numbers + letters;
const alphaNumericSpecial = alphaNumeric + specialChars;
const hex = '0123456789ABCDEF';
const greek = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lamda', 'mi', 'ni', 'ksi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'ypsilon', 'phi', 'khi', 'psi', 'omega'];
const colors = ['blue', 'orange', 'green', 'red', 'purple', 'brown', 'pink', 'gray', 'olive', 'cyan', 'white', 'black'];

module.exports = {
    numbers: numbers,
    vovelsUpper: vovelsUpper,
    vovelsLower: vovelsLower,
    consonantsUpper: consonantsUpper,
    consonantsLower: consonantsLower,
    specialChars: specialChars,
    lettersUpper: lettersUpper,
    lettersLower: lettersLower,
    alphaNumeric: alphaNumeric,
    alphaNumericSpecial: alphaNumericSpecial,
    hex: hex,
    colors: colors,
    greek: greek
}