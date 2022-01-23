/* Magic Mirror
 * Module: MMM-JIRA
 *
 * By Hayk Hakobyan
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');


module.exports = NodeHelper.create({

    start: function () {
        console.log("Starting node_helper for: " + this.name);
    },

    getJIRA: function (config) {
        console.log("jira");
        console.log("jira");
        console.log(config);
        request({
            url: config.url,
            headers: {'Content-Type': 'application/json'},
            auth: {
                'user': config.username,
                'pass': config.password
            }
        }, (error, response, body) => {
            // console.log(body);
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                //	console.log(response.statusCode + result); // for checking
                this.sendSocketNotification('JIRA_RESULT', result);
            } else if (error) {
                console.log(error);
            }
        });
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_JIRA') {
            this.getJIRA(payload);
        }
    }
});
