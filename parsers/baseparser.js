class BaseParser {
    // returns null OR
    // if something useful was parsed, something that varies per parser
    parse(generator, line) {
        throw new Error('Not implemented!');
    }
}

module.exports = BaseParser;
