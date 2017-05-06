const commonWords = ['the', 'and', 'are', 'but', 'him', 'her', 'she', 'you', 'they', 'them', 'had'];

const isTruthy = x => x;
const reject = predicate => x => !predicate(x);
const createToken = (type, word, i) => ({type, word, index: i});
const isTokenOfType = type => x => x.type === type;
const isTokenCommon = x => x.word.length < 3 || commonWords.find(word => sanitize(word) === sanitize(x.word));
const sanitize = x => x.replace(/(\W)/g, "").trim().toLowerCase();
const random = () => Math.random() > 0.5;

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
const tokenizeSegment = (x, i) => {
    let tokenType = 'WORD';
    if(x === ' ') {
        tokenType = 'SPACE'
    } else if(x.match(/^(?:\?|!|&|\.|,)/gm)) {
        tokenType = 'PUNCTUATION;'
    }
    return createToken(tokenType, x, i);
}
const tokenize = input => {
    return input
        .split(/((?:\w|'|-|&)+)/g)
        .filter(isTruthy)
        .map(tokenizeSegment);
}