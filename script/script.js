document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search'),
        cartBtn = document.querySelector('#cart'),
        wishlistBtn = document.querySelector('#wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart'),
        category = document.querySelector('.category'),
        cardCounter = cartBtn.querySelector('.counter'),
        wishlistCounter = wishlistBtn.querySelector('.counter'),
        basketWrapperElem = document.querySelector('.cart-wrapper'),
        totalPrice = document.querySelector('.cart-total span');

    const wishlist = [];
    const goodsBasket = {};

    const loader = (nameFunction) => {
        const spinner = `<div id="pre-loader">
                          <img src="img/spinner.svg">
                         </div>`;

        if (nameFunction === 'renderBasket') {
            basketWrapperElem.innerHTML = spinner;
        }
        if (nameFunction === 'renderCard') {
            goodsWrapper.innerHTML = spinner;
        }
    };

    const getGoods = (handler, filter) => {
        loader(handler.name);

        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);

    };

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                                <div class="card-img-wrapper">
                                    <img class="card-img-top" src="${img}" alt="">
                                     <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}" 
                                        data-goods-id="${id}"></button>
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

    const createBasketGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = `<div class="goods-img-wrapper">
                    <img class="goods-img" src="${img}" alt="">

                </div>
                <div class="goods-description">
                    <h2 class="goods-title">${title}</h2>
                    <p class="goods-price">${price} ₽</p>

                </div>
                <div class="goods-price-count">
                    <div class="goods-trigger">
                        <button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
                         data-goods-id="${id}"></button>
                        <button class="goods-delete" data-goods-id="${id}"></button>
                    </div>
                    <div class="goods-count">${goodsBasket[id]}</div>
                </div>`;
        return card;
    };

    const renderCard = items => {
        goodsWrapper.textContent = '';
        if (items.length) {
            items.forEach((item) => {
                const {id, title, price, imgMin} = item;
                goodsWrapper.append(createCardGoods(id, title, price, imgMin));
            });
        } else {
            goodsWrapper.textContent = "Извините, мы не нашли товаров по вашему запросу 😔"
        }
    };

    const renderBasket = items => {
        basketWrapperElem.innerHTML = '';
        totalPrice.textContent = 0;
        if (items.length) {
            items.forEach((item) => {
                const {id, title, price, imgMin} = item;
                basketWrapperElem.append(createBasketGoods(id, title, price, imgMin));
                totalPrice.textContent = (price * goodsBasket[id] + +totalPrice.textContent).toFixed(2);
            });
        } else {
            basketWrapperElem.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div>';
        }
    };

    const checkCount = () => {
        wishlistCounter.textContent = wishlist.length;
        cardCounter.textContent = Object.keys(goodsBasket).length;

    };

    //filtration
    const showCardBasket = goods => goods.filter(item => goodsBasket.hasOwnProperty(item.id));

    const randomSort = items => items.sort(() => Math.random() - 0.5);

    const showWishList = () => {
        getGoods(renderCard, goods => goods.filter(item => wishlist.includes(item.id)));
    };

    //work with storages
    const getCookie = name => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const cookieQuery = get => {
        if (get) {
            if (getCookie('goodsBasket')) {
                Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
            }
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`;
        }
        checkCount();
    };

    const storageQuery = (get) => {
        if (get) {
            if (localStorage.getItem('wishlist')) {
                wishlist.push(...JSON.parse(localStorage.getItem('wishlist')));
            }
            checkCount();
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    };

    //events
    const closeCart = (event) => {
        const target = event.target;

        if (target.classList.contains('cart') ||
            target.classList.contains('cart-close') ||
            event.key === 'Escape') {
            cart.style.display = 'none';
            document.removeEventListener('keyup', closeCart);
        }
    };

    const openCart = event => {
        event.preventDefault();
        cart.style.display = 'flex';
        document.addEventListener('keyup', closeCart);
        getGoods(renderBasket, showCardBasket, false);
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
    };

    const addBasket = id => {
        if (goodsBasket[id]) {
            goodsBasket[id] += 1;
        } else {
            goodsBasket[id] = 1;
        }
        checkCount();
        cookieQuery();
    };

    const toogleWishlist = (id, elem) => {

        if (wishlist.indexOf(id) + 1) {
            wishlist.splice(wishlist.indexOf(id), 1);

        } else {
            wishlist.push(id);
        }

        elem.classList.toggle('active');
        checkCount();
        storageQuery();
    };

    const removeGoods = id => {
        delete goodsBasket[id];
        checkCount();
        cookieQuery();
        getGoods(renderBasket, showCardBasket);
    };
    //handlers
    const handlerGoods = event => {
        const target = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            toogleWishlist(target.dataset.goodsId, target);
        }

        if (target.classList.contains('card-add-cart')) {
            addBasket(target.dataset.goodsId);
        }
    };

    const handlerBasket = event => {
        const target = event.target;
        if(target.classList.contains('goods-add-wishlist')){

            toogleWishlist(target.dataset.goodsId, target);
        }

        if(target.classList.contains('goods-delete')){
            removeGoods(target.dataset.goodsId);
        }

    };

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    basketWrapperElem.addEventListener('click', handlerBasket);
    wishlistBtn.addEventListener('click', showWishList);



    getGoods(renderCard, randomSort);
    storageQuery(true);
    cookieQuery(true);
});
