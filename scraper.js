const request = require('request');
const cheerio = require('cheerio');

const moment = require('moment');
moment().format();

const Profile = require('./data/profile.js');

class Scraper {
    getProfile(userId, callback) {
        this._getHTML(`https://brickadia.com/users/${userId}`, $ => {
            const profile = {};
            profile.userId = userId;
            
            const usernameField = $('.content > div > h1');
            profile.username = usernameField.text();
            
            const genderField = $('.content > div > h1 > i');
            if(genderField.length === 0)
                profile.gender = null;
            else {
                const genderClass = genderField.attr('class');
                if(genderClass === 'fas fa-mars blue')
                    profile.gender = 'male';
                else
                    profile.gender = 'female';
            }
            
            profile.location = null;
            const fields = $('.content > div > p');
            fields.each((_idx, field) => {
                const text = $(field).text();
                
                if(text === 'Currently in-game') {
                    profile.where = 'ingame';
                    profile.lastSeen = new Date();
                } else if(text.startsWith('Last seen')) {
                    const [_, lastSeen] = /^Last seen in-game.*?\(.*?\)$/.exec(text);
                    profile.where = 'outside';
                    profile.lastSeen = moment(lastSeen).toDate();
                } else if (text.startsWith('Location')) {
                    const [_, location] = /^Location: (.*)$/.exec(text);
                    profile.location = location;
                }
            });
            
            const userText = $('.content > .user-text');
            if(userText.length === 0)
                profile.userText = null;
            else
                profile.userText = userText.text();
            
            const profileObject = new Profile(
                profile.userId,
                profile.username,
                profile.gender,
                profile.where,
                profile.lastSeen,
                profile.location,
                profile.userText
            );
            
            callback(profileObject);
        });
    }
    
    _getHTML(page, callback) {
        request(page, (err, resp, body) => {
           const $ = cheerio.load(body);
           callback($);
        });
    }
}

module.exports = Scraper;