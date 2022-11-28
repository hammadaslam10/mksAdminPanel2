const Generator = require('./index');
const gen = new Generator();

gen.addPatternList('k', ['po', 'ro', 'do'])
const pattern = '/F-/CVCVCV/-/CVCVCV/-/CVCVCV/-/000';
console.log(gen.pattern(pattern));
console.log(gen.patternComplexity(pattern));