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
            this.getJoke();
            setInterval(() => {
                this.getJoke()
            }, this.config.fetchInterval);
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
    },
    getJoke() {
        Log.info("getJoke");
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
                this.joke = joke;
                this.updateDom();
            });
        });
    }
});
