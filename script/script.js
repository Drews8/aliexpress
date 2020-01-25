document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search');
    const cartBtn = document.querySelector('#cart');
    const wishlistBtn = document.querySelector('#wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');

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
        console.log(card);
        return card;
    };

    const openCart = () => {
        cart.style.display = 'flex';

        /*const escapeBtnClose = function (event) {
            if(event.key === 'Escape'){
                document.removeEventListener('keydown', escapeBtnClose)
                cart.style.display = 'none';
            }
        };
        document.addEventListener('keydown', escapeBtnClose);*/


        /*cart.querySelector('a').addEventListener('click', (event) => {
            console.log("complete");
            event.preventDefault();
        });*/
    };
    const closeCart = (event) => {
        const target = event.target;

        if (target.classList.contains('cart') || target.classList.contains('cart-close')) {
            cart.style.display = 'none';
        }

    };

    goodsWrapper.append(createCardGoods(1, 'Darts', 2000, 'img/temp/Archer.jpg'));
    goodsWrapper.append(createCardGoods(2, 'Flamingo', 3000, 'img/temp/Flamingo.jpg'));
    goodsWrapper.append(createCardGoods(3, 'Socks', 300, 'img/temp/Socks.jpg'));


    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
});
