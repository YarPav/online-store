const toCurrency = (price) => {
   return new Intl.NumberFormat('en-US', {
      currency: 'usd',
      style: 'currency'
   }).format(price);
}

document.querySelectorAll('.price').forEach(i => {
   i.textContent = toCurrency(i.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
   $cart.addEventListener('click', e => {
      if (e.target.classList.contains('js-remove')) {
         fetch('/cart/remove/' + e.target.dataset.id, {
            method: 'delete',
             headers: {
                'X-XSRF-TOKEN': e.target.dataset.csrf
             }
         }).then(res => res.json())
             .then(cart => {
                if (cart.courses.length) {
                  const html = cart.courses.map(c => {
                     console.log(c);
                     return `
                        <tr>
                          <td>${c.title}</td>
                          <td>${c.count}</td>
                          <td>
                              <button class="brn btn-small js-remove" data-id="${c.id}">Delete</button>
                          </td>
                      </tr>
                     `;
                  }).join('');
                  $cart.querySelector('tbody').innerHTML = html;
                  $cart.querySelector('.price').textContent = toCurrency(cart.price);
                   console.log('changed');
                } else {
                   $cart.innerHTML = '<p>Cart is empty</p>'
                }
             });
      }
   });
}

// Modify date format

const toDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.js-date').forEach(node => {
    node.textContent = toDate(node.textContent);
});

// Init Materialize tabs

M.Tabs.init(document.querySelectorAll('.tabs'));
