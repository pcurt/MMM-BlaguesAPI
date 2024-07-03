Module.register("MMM-BlaguesAPI", {
    defaults: {
        type: "random",
        fetchInterval: 60 * 1000,
        blaguesApiToken: "",
    },
    getStyles() {
        return [
            this.file('style.css')
        ]
    },
    joke: null,
    notificationReceived(notification, payload, sender) {
      if (notification === 'MODULE_DOM_CREATED') {
        this.sendSocketNotification("INIT", this.config);
      }
    },
    socketNotificationReceived(notification, payload) {
      if (notification === "JOKE") {
        this.joke = payload;
        this.updateDom();
      }
    },

    getDom() {
        const wrapper = document.createElement("div");

        if (this.joke === null) return wrapper;

        this.setupHTMLStructure(wrapper);

        return wrapper;
    },
    setupHTMLStructure(wrapper) {
        const joke = document.createElement("h1");
        joke.className = "bright medium light fadeInJoke";
        joke.innerHTML = this.joke.joke;
        wrapper.appendChild(joke);

        const reply = document.createElement("h2");
        reply.className = "bright medium light fadeInReply";
        reply.innerHTML = this.joke.answer;
        wrapper.appendChild(reply);
    }
});
