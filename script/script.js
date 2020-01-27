document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search');
    const cartBtn = document.querySelector('#cart');
    const wishlistBtn = document.querySelector('#wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');

    const loader = () => {
        goodsWrapper.innerHTML = `<div id="pre-loader">
                                    <img src="img/spinner.svg">
                                  </div>`
    };

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                                <div class="card-img-wrapper">
                                    <img class="card-img-top" src="${img}" alt="">
                                     <button class="card-add-wishlist" data-goods-id="${id}"></button>
                                </div>
                                <div class="card-body justify-content-between">
                                    <a href="#" class="card-title">${title}</a>
                                    <div class="card-price">${price} ₽</div>
                                    <div>
                                        <button class="card-add-cart"
                                            data-goods-id="${id}">Добавить в корзину</button>
                                    </div>
                                </div>
                            </div>`;
        return card;
    };

    const openCart = event => {
        event.preventDefault();
        cart.style.display = 'flex';
        document.addEventListener('keyup', closeCart);
    };

    const closeCart = (event) => {
        const target = event.target;

        if (target.classList.contains('cart') ||
            target.classList.contains('cart-close') ||
            event.key === 'Escape') {
            cart.style.display = 'none';
            document.removeEventListener('keyup', closeCart);
        }
    };

    const renderCard = items => {
        goodsWrapper.textContent = '';
        if(items.length) {
            items.forEach((item) => {
                const {id, title, price, imgMin} = item;
                goodsWrapper.append(createCardGoods(id, title, price, imgMin));
            });
        } else {
            goodsWrapper.textContent = "Извините, мы не нашли товаров по вашему запросу 😔"
        }
    };

    const randomSort = items => {

        return items.sort(() => Math.random() - 0.5);
    }

    const getGoods = (handler, filter) => {
        loader();

        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);

    };

    const choiceCategory = event => {
        event.preventDefault();
        const target = event.target;

        if (target.classList.contains('category-item')) {
            const categoryName = target.dataset.category;
            getGoods(renderCard, goods => {
                return goods.filter(item => item.category.includes(categoryName));
            });
        }

    };

    const searchGoods = event => {
        event.preventDefault();

        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim();

        if (inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i');
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout(() => {
                search.classList.remove('error');
            }, 2000);
        }
        input.value = '';
    }


    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);

    getGoods(renderCard, randomSort);
});
