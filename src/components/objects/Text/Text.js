import QUOTES from './Quotes.js';

class Text {
  constructor() {
    let box = document.createElement("DIV");
    box.className = 'slideshow-container';
    box.id = 'slideshow';

    box.style.position = 'fixed';
    box.style.bottom = '0';
    box.style.width = '100%';
    box.style.backgroundColor = 'black';
    box.style.opacity = '50%';
    box.style.height = '10%';
    box.style.top = '90%';
    document.body.appendChild(box);

    let quotes = document.createElement("DIV");
    quotes.className = 'quotes';

    quotes.style.padding = '30px';
    quotes.style.textAlign = 'center';
    box.appendChild(quotes);

    let quote = document.createElement("Q");
    quote.className = 'quote';
    quote.id = 'quote';
    quote.innerText = QUOTES[0];
    quote.style.color = 'white';
    quote.style.fontStyle = 'italic';
    quote.style.fontSize = 'large';
    quote.style.top = '50%'
    quotes.appendChild(quote);

    let quoteNum = 0;

    let prev = document.createElement("A");
    prev.className = 'prev';
    prev.onclick = function() {plusSlides(-1)};
    prev.innerHTML = '&#10094;';

    prev.style.cursor = 'pointer';
    prev.style.position = 'absolute';
    prev.style.top = '50%';
    prev.style.width = 'auto';
    prev.style.marginTop = '-30px';
    prev.style.padding = '16px';
    prev.style.color = '#888';
    prev.style.fontWeight = 'bold';
    prev.style.fontSize = '20px';
    prev.style.borderRadius = '0 3px 3px 0';
    prev.style.userSelect = 'none';
    box.appendChild(prev);

    let next = document.createElement("A");
    next.className = 'next';
    next.onclick = function() {plusSlides(1)};
    next.innerHTML = '&#10095;';

    next.style.cursor = 'pointer';
    next.style.position = 'absolute';
    next.style.top = '50%';
    next.style.width = 'auto';
    next.style.marginTop = '-30px';
    next.style.padding = '16px';
    next.style.color = '#888';
    next.style.fontWeight = 'bold';
    next.style.fontSize = '20px';
    next.style.borderRadius = '0 3px 3px 0';
    next.style.userSelect = 'none';
    next.style.right = '0';
    box.appendChild(next);

    auto();

    function plusSlides(n) {
      quoteNum += n;
      if (quoteNum < 0) {
        quoteNum = QUOTES.length - 1;
      }
      quoteNum = quoteNum % QUOTES.length;

      let quote = document.getElementById('quote');
      quote.innerText = QUOTES[quoteNum];
    }

    // automate slideshow
    function auto() {
      plusSlides(1);
      setTimeout(auto, 180000);
    }

  }

  update(timeStamp) {

  }
}

export default Text;
