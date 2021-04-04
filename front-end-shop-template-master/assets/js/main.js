
const buttonsContainer = document.querySelector('.page-content');
const cartCounterLabel = document.querySelector('#cart-counter');

let cartCounter = 0;
let cartPrice = 0;

const btnClickHandler = (e) => {
const target = e.target;

if(target && target.matches('button.item-actions__cart')){

    cartCounterLabel.innerHTML = `${++cartCounter}`;
   if (cartCounter === 1) cartCounterLabel.style.display = 'block';

      const mockData = +target
      .parentElement
      .previousElementSibling
      .innerHTML
        .replace('$', '')    
        .replace(' <sup>', '.')
        .replace('</sup>', '')

    cartPrice =  Math.round((cartPrice * 100) + (mockData * 100)) / 100;

    const restoreHTML = target.innerHTML;

    target.innerHTML = `Added ${cartPrice.toFixed(2)} $`;
    target.disabled = true;
    buttonsContainer.removeEventListener('click', btnClickHandler);

    setTimeout(() => {
      target.innerHTML = restoreHTML;
      target.disabled = false;
      buttonsContainer.addEventListener('click', btnClickHandler);
    }, 2000);
 }   
};

buttonsContainer.addEventListener('click', btnClickHandler);