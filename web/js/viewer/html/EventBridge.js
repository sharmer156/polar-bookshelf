
/**
 * Moves events from the iframe, into the target document. This allows the event
 * listeners to see the event as if it was called inside the parent .page
 * in the parent DOM window.
 */
class EventBridge {

    constructor(targetElement, iframe) {
        this.targetElement = targetElement;
        this.iframe = iframe;
    }

    start() {

        this.iframe.contentDocument.body.addEventListener("keyup", this.eventListener.bind(this));
        this.iframe.contentDocument.body.addEventListener("keydown", this.eventListener.bind(this));
        this.iframe.contentDocument.body.addEventListener("contextmenu", this.eventListener.bind(this));

        this.iframe.contentDocument.body.addEventListener("click", function(event) {

            let anchor = this.getAnchor(event.target);

            if(anchor) {
                console.log("Link click prevented.");
                event.preventDefault();

                let href = anchor.href;

                if(href && (href.startsWith("http:") || href.startsWith("https:"))) {
                    // this is a bit of a hack but basically we listen for URLs
                    // in the iframe and change the main page. This triggers our
                    // electron 'will-navigate' which which prevents it and then
                    // opens the URL in the native browser.
                    document.location.href = href;
                }

            } else {
                this.eventListener.bind(this);
            }

        }.bind(this));

        console.log("Event bridge started on: ", this.iframe.contentDocument.location.href);

    }

    /**
     * Get the anchor for an element. An event target might be nested in an
     * anchor.
     */
    getAnchor(element) {

        if(element == null) {
            return null;
        }

        if(element.tagName === "A") {
            return element;
        }

        return this.getAnchor(element.parentElement);

    }

    eventListener(event) {
        let newEvent = new event.constructor(event.type, event)

        this.targetElement.dispatchEvent(newEvent);
    }

}

module.exports.EventBridge = EventBridge;
