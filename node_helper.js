"use strict"

var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  socketNotificationReceived: function (noti, payload) {
    switch (noti) {
      case "INIT":
        console.log("[JOKE] MMM-BlaguesAPI Version:", require('./package.json').version)
        this.config = payload
        this.getJoke();
        setInterval(() => {
          this.getJoke();
        }, this.config.fetchInterval);
        break
    }
  },
  getJoke() {
      //console.info("getJoke");
      let apiUrl;
      if (this.config.type === 'random') {
          apiUrl = 'https://www.blagues-api.fr/api/random';
      } else {
          apiUrl = `https://www.blagues-api.fr/api/type/${this.config.type}/random`;
      }
      fetch(apiUrl, {
          method: 'get',
          headers: new Headers({
              'Authorization': 'Bearer ' + `${this.config.blaguesApiToken}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          })
      }).then((response) => {
          response.json().then((joke) => {
              this.sendSocketNotification("JOKE", joke);
          });
      });
  }

})
