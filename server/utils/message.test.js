var expect = require('expect');

var {
    generateMessage
} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Vincent';
        var text = 'Hello World!';


        // store res in variable
        var res = generateMessage(from, text);

        // // assert from match
        // expect(res.from).toBe('Vincent');
        // // assert text match
        // expect(res.text).toBe('Hello World!');
        expect(res).toInclude({
            from,
            text
        });

        // assert createdAt is number
        expect(res.createdAt).toBeA('number');
    });
});
