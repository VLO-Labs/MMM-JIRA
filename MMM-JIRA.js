/* Magic Mirror
 * Module: MMM-JIRA
 *
 * By Hayk Hakobyan
 *
 */
Module.register("MMM-JIRA", {

    // Module config defaults.
    defaults: {
        accessKey: "",       // Free account & API Access Key at currencylayer.com
        source: "USD",       // USD unless you upgrade from free plan
        symbols: "",         // Add in config file
        useHeader: false,    // true if you want a header      
        header: "",          // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 1000, // 1 min

    },

    getStyles: function () {
        return ["MMM-JIRA.css"];
    },

    getScripts: function () {
        return ["moment.js"];
    },

    start: function () {
        Log.info("Starting module: " + this.name);

        //  Set locale.
        this.url = this.config.url;
        this.url += "?jql=";
        let jql = "project='" + this.config.project + "'";
        if (this.config.assignee !== '') {
            jql += " AND assignee='" + this.config.assignee + "'";
        }
        if (this.config.statuses.length > 0) {
            jql += " AND (";
            let statusIterator = 0;
            for (let statusKey in this.config.statuses) {
                if (++statusIterator < this.config.statuses.length) {
                    jql += "status='" + this.config.statuses[statusKey] + "' OR ";
                } else {
                    jql += "status='" + this.config.statuses[statusKey] + "'";
                }
            }
            jql += ")";
        }
        this.url += encodeURIComponent(jql);
        this.url += "&fields=" + this.config.fields;
        this.url += "&maxResults=" + this.config.maxResults;
        this.username = this.config.username;
        this.password = this.config.apiToken;

        this.JIRA = {};
        this.scheduleUpdate();
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("Show me the money . . .");
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        var JIRA = this.JIRA;

        var top = document.createElement("div");
        top.classList.add("list-row");

        // timestamp
        var timestamp = document.createElement("div");
        timestamp.classList.add("small", "bright", "timestamp");
        timestamp.innerHTML = "Open tickets for this sprint";
        wrapper.appendChild(timestamp);

        // this gets the key from the key/pair of the element (hasOwnProperty)
        for (var Key in JIRA.issues) {
            var newElement = document.createElement("div");
            newElement.classList.add("align-left", "xsmall", "bright", "symbol");
            newElement.innerHTML += JIRA.issues[Key].fields.summary + "<br><br>";
            wrapper.appendChild(newElement);

        } // <-- closes key/pair loop

        return wrapper;

    }, // closes getDom

    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function (notification, payload) {
        if (notification === 'HIDE_JIRA') {
            this.hide();
        } else if (notification === 'SHOW_JIRA') {
            this.show(1000);
        }

    },

    processJIRA: function (data) {
        this.JIRA = data;
        this.loaded = true;
    },

    scheduleUpdate: function () {
        setInterval(() => {
            this.getJIRA();
        }, this.config.updateInterval);
        this.getJIRA(this.config.initialLoadDelay);
    },

    getJIRA: function () {
        this.sendSocketNotification('GET_JIRA', {url: this.url, username: this.username, password: this.password});
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "JIRA_RESULT") {
            this.processJIRA(payload);

            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
