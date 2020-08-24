class AwesomeInput extends HTMLElement {
    selftRemove = false;
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });
    }

    async getTemplate() {
        return fetch('error-box.html');
    }

    async connectedCallback() {
        let res = await fetch('error-box/error-box.html')

        this.shadow.innerHTML = await res.text();
        this.errorElement = this.shadow.querySelector('.error-msg');
        this.updateErrorMsg();

        this.shadow.querySelector('.close-button').addEventListener('click', () => {
            
            const event = new CustomEvent('remove', {
                bubbles: true,
                //we need set this option to three, if we wont catch our event outside ShadowDOM
                composed: true
            });

            this.shadow.dispatchEvent(event);

            if (this.selftRemove) {
                this.remove();
            }
        });
    }

    static get observedAttributes() {
        //we need use self-remove, not selfRemove
        return ['self-remove', 'error'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.', name, newValue);
        switch (name) {
            case 'error': {
                this.errorMsg = newValue;
                this.updateErrorMsg();
                break;
            }
            case 'self-remove': {
                this.selftRemove = true;
                break;
            }
        }
    }

    updateErrorMsg() {
        if (this.errorElement) {
            this.errorElement.innerHTML = this.errorMsg;
        }
    }
}

window.customElements.define('error-box', AwesomeInput);