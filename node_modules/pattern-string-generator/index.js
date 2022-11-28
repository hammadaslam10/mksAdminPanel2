const Lists = require('./lists');

class Generator {
    lists = {
        '0': Lists.numbers,
        'V': Lists.vovelsUpper,
        'v': Lists.vovelsLower,
        'C': Lists.consonantsUpper,
        'c': Lists.consonantsLower,
        'U': Lists.lettersUpper,
        'l': Lists.lettersLower,
        'L': Lists.alphaNumeric,
        's': Lists.specialChars,
        'a': Lists.alphaNumericSpecial,
        'H': Lists.hex,
        'f': Lists.colors,
        'g': Lists.greek
    }

    /**
     * Creates a random String based on the given Pattern. The following placeholders can be used:
     * <li>0 - [0-9]</li>
     * <li>V - [AEIOU]</li>
     * <li>v - [aeiou]</li>
     * <li>C - [BCDFGHJKLMNPQRSTVWXYZ]</li>
     * <li>c - [bcdfghjklmnpqrstvwxyz]</li>
     * <li>U - [ABCDEFGHIJKLMNOPQRSTUVWXYZ]</li>
     * <li>l - [abcdefghijklmnopqrstuvwxyz]</li>
     * <li>L - [ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]</li>
     * <li>A - [0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]</li>
     * <li>s - [!§$%?=#+*~-_,./()]</li>
     * <li>a - [0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!§$%?=#+*~-_,./()]</li>
     * <li>H - [0123456789ABCDEF]</li>
     * <li>f - Random Color</li>
     * <li>g - Random Greek Letter</li>
     *
     * You can add more replacements with the addPatternList method
     *
     * To escape a Portion of the pattern to not pe replaced you can wrap it with /
     * @param pattern
     * @returns {*}
     */
    pattern(pattern) {
        const groups = pattern.split('/');
        let result = '';

        for (let i = 0; i < groups.length; i++) {
            if (i % 2 === 1) { // Group is escaped
                result += groups[i];
            } else {
                for (let c = 0; c < groups[i].length; c++) {
                    if(this.lists.hasOwnProperty(groups[i][c])) {
                        result += this.randomSelection(this.lists[groups[i][c]]);
                    }
                }
            }
        }

        return result;
    }

    /**
     * Calculates the number of possible outcomes for the given pattern.
     * @see pattern
     * @param pattern
     * @returns {*}
     */
    patternComplexity(pattern) {
        const groups = pattern.split('/');
        let result = 1;

        for (let i = 0; i < groups.length; i++) {
            if (i % 2 !== 1) {
                for (let c = 0; c < groups[i].length; c++) {
                    if(this.lists.hasOwnProperty(groups[i][c])) {
                        result *= this.lists[groups[i][c]].length;
                    }
                }
            }
        }
        return result < 9999999 ? result : result.toExponential(2);
    }

    randomSelection(input) {
        return input[Math.floor(Math.random() * input.length)];
    }

    addPatternList(identifier, list) {
        this.lists[identifier] = list;
    }
}




module.exports = Generator;