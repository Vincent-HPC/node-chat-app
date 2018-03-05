// verify a value is of a type string and not just  a bunch of spaces
var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
}

module.exports = {
    isRealString
};
