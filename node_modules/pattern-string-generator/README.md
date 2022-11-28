This tiny library allows you to create random Strings, that match a given pattern.

# Installation
<code>npm i pattern-string-generator</code>

# Usage
The generator uses a set of lists, which can be combined to create a wide range of strings.
<pre><code>const Generator = require('pattern-generator-lib');
const generator = new Generator();

const pattern = "/F-/CVCVCV/-/CVCVCV/-/CVCVCV/-/000";
console.log(generator.pattern(pattern)) // F-SIMEKU-BUVAXE-MELEBU-447
</code></pre>

In the example above uppercase vovels are mixed with uppercase consonants and some numbers. You can also exclude parts of the pattern from being replaced by surrounding it with <code>/</code> as shown above. 

# Pre-build Lists
* **0** => Single digit number <code>[0-9]</code>
* **V** => Uppercase vovel <code>[AEIOU]</code>
* **v** => Lowercase vovel <code>[aeiou]</code>
* **C** => Uppercase consonant <code>[BCDFGHJKLMNPQRSTVWXYZ]</code>
* **c** => Lowercase consonant <code>[bcdfghjklmnpqrstvwxyz]</code>
* **U** => Uppercase letter <code>[A-Z]</code>
* **l** => Lowercase letter <code>[a-z]</code>
* **L** => Alphanumeric <code>[A-Za-u0-9]</code>
* **s** => Special Character <code>[!§$%?=#+*~-_;./()]</code>
* **a** => Alphanumeric + Special Character <code>[A-Za-u0-9!§$%?=#+*~-_;./()]</code>
* **H** => Hex <code>[0-9A-F]</code>
* **f** => Random color name
* **g** => Random greek letter name

# Adding your own List
You can add your own List for replacement to the generator. It can either be a string or an array.

<code>generator.addPatternList('k', ['po', 'ro', 'do'])</code>

If you call the pattern method after this line every k in the pattern willbe replaced with either po, ro or do.

# Pattern Complexity
If you want to check, how many possible results your pattern can have you can use the patternComplexity method.