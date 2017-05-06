if(!window.quotes) throw new Error('Need quotes to work!');

function createQuoteEl(tokens, gaps) {
    return tokens
        .map(token => gaps.find(x => token.index === x) !== undefined ? createHoleEl(token) : createTokenEl(token))
        .reduce((container, el) => {
            container.appendChild(el);
            return container;
        }, document.createElement('div'));
}

function findNextSibling(el, type) {
    let current = el.nextElementSibling;
    while(current && current.tagName !== type) {
        current = current.nextElementSibling;
    }
    return current;
}

function inputKeyupHandler(e) {
    if(e.key === ' ') {
        let nextInput = findNextSibling(e.target, 'INPUT');
        if(nextInput) nextInput.focus();
    }
}

function createHoleEl(token) {
    let input = document.createElement('input');
    input.onblur = e => e.target.value = e.target.value.trim();
    input.onkeypress = e => inputKeyupHandler(e);
    input.autocomplete = false;
    return input;
}

function createTokenEl(token) {
    let span = document.createElement('span');
    span.innerText = token.word;
    return span;
}

function createTagEl(value) {
    let span = document.createElement('tag');
    span.innerText = value;
    span.className = 'tag';
    return span;
}

class State {
    constructor(quotes, questionEl, tagsEl) {
        this.questionEl = document.getElementById('js-question');
        this.tagsEl = document.getElementById('js-tags');
        this.progressEl = document.getElementById('js-progress-bar');
        this.buttonEl = document.getElementById('js-check');

        this.quotes = quotes;
        this.gaps = [];
        this.current = 0;
        this.setCurrent(this.current);
        this.state = 'INPUT';
        this.allCorrect = false;
        this.correct = 0;

        this.buttonEl.onclick = e => this.checkClicked(e);
    }

    checkClicked() {
        if(this.state === 'INPUT') {
            this.mark();
            if(this.allCorrect) {
                this.correct = (this.correct + 1) % (this.quotes.length + 1);
                this.renderProgressBar();
                this.buttonEl.classList.add('correct');
                this.buttonEl.innerText = 'Next';
            } else {
                this.buttonEl.classList.add('incorrect');
                this.buttonEl.innerText = 'Try again';
            }
            this.state = 'REVIEW';
        } else if (this.state === 'REVIEW') {
            if(this.allCorrect) {
                this.setCurrent((this.current + 1) % this.quotes.length);
            }
            this.render();
            this.state = 'INPUT';
        }
        return false;
    }

    mark() {
        let allCorrect = true;
        this.questionEl.querySelectorAll('input')
            .forEach((x, i) => {
                let expected = sanitize(this.currentQuote.tokens[this.gaps[i]].word);
                let answer = document.createElement('div');
                answer.className = 'answer';
                answer.innerHTML = `${this.currentQuote.tokens[this.gaps[i]].word}`;
                if(sanitize(x.value) === expected) {
                    answer.classList.add('correct');
                } else {
                    answer.classList.add('incorrect');
                    allCorrect = false;
                }
                x.parentNode.replaceChild(answer, x);
            });
        this.allCorrect = allCorrect;
        return allCorrect;
    }

    render() {
        requestAnimationFrame(() => requestAnimationFrame(() => this.renderProgressBar()));

        this.questionEl.innerHTML = '';
        this.questionEl.appendChild(createQuoteEl(this.currentQuote.tokens, this.gaps));
        let firstInput = this.questionEl.querySelector('input');
        if(firstInput) firstInput.focus()

        this.tagsEl.innerHTML = '';
        this.currentQuote.tags.map(createTagEl).forEach(tag => this.tagsEl.appendChild(tag));

        this.buttonEl.classList.remove('correct', 'incorrect');
        this.buttonEl.innerText = 'Check';
    }

    renderProgressBar() {
        this.progressEl.style.transform = `scaleX(${this.correct / this.quotes.length})`;
    }

    get currentQuote() {
        return this.quotes[this.current];
    }

    setCurrent(value) {
        let possibleGaps = this.quotes[value].tokens
            .filter(isTokenOfType('WORD'))
            .filter(reject(isTokenCommon));
        this.gaps = shuffle(possibleGaps)
            .slice(0, Math.max(Math.min((possibleGaps.length / 4) * 3), 2))
            .map(x => x.index)
            .sort((a, b) => a - b);
            
        this.current = value;
        this.correct = value;
    }
}

window.quotes = window.quotes.map(quote => {
    quote.tokens = tokenize(quote.quote);
    return quote;
});

let state = new State(window.quotes);
state.render();

window.onkeypress = e => {
    if(e.key === 'Enter') {
        state.buttonEl.click();
    }
}