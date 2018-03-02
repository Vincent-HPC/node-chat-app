var expect = require('expect');

var {
    generateMessage,
    generateLocationMessage
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

// pass in from,lat,lng
// from property is correct
// createdAt is a number
// url property what i expect

describe('generateLocationMessage', () => {

    it('should generate correct location object', () => {
        var from = 'Vincent';
        var latitude = 111;
        var longitude = 222;
        var url = 'https://www.google.com/maps?q=111,222';
        var res = generateLocationMessage(from, latitude, longitude);

        expect(res).toInclude({
            from,
            url
        });

        expect(res.createdAt).toBeA('number');
    });
});
