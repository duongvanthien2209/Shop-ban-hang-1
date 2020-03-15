function Products() {
    this.content = null;
    this.data = [];
    this.cart = null;
    this.productItem = null;
    this.init = function (cart) {
        // Bind function
        this.render = this.render.bind(this);
        this.onClick = this.onClick.bind(this);

        this.cart = cart;
        this.content = document.getElementById('main-content');
        axios.get('http://localhost:3000/products').then(res => {
            this.data = res.data;
            this.render();
            this.content.addEventListener('click', this.onClick);
        });
    }
    this.onClick = function(event) {
        var id = parseInt(event.target.dataset.id);
        if(id)
        {
            var product = this.data.find(item => item.id === id);
            // Loại sản phẩm ra khỏi danh sách products
            this.data = this.data.filter(item => item.id !== id);
            this.render();

            if(!product)
            {
                console.log('Có lỗi xảy ra');
            }else this.productItem = product;
            this.cart.addItem(this.productItem);
        }
    } 
    this.render = function () {
        var contents = this.data.map(item => {
            return `<div class="shopping-item">
                <div class="item-header">
                    <img src="https://picsum.photos/300/200" alt="Picture">
                </div>
                <div class="item-content">
                    <h2>${item.title}</h2>
                    <p>${item.decription}</p>
                </div>
                <div class="item-footer">
                    <p>Giá: <span>${item.number}</span></p>
                </div>
                <div class="item-background">
                    <button data-id="${item.id}">Add to cart</button>
                </div>
            </div>`
        }).join('');
        this.content.innerHTML = contents;
    }
}

function Cart() {
    this.content = null;
    this.data = [];
    this.total = null;
    this.init = function () {
        this.content = document.getElementById('cart-main');
        this.total = document.getElementById('total');

        // Bind function
        this.onClick = this.onClick.bind(this);
    }
    this.addItem = function (item) {
        var item1 = {...item, value: 1};
        this.data.push(item1);
        this.render();
    }
    this.render = function () {
        var sum = 0;
        this.content.innerHTML = this.data.map(item => {
            sum += item.value*item.number;
            return `<li class="cart-item">
            <p>${item.title}</p>
            <div class="cart-item-button">
                <button class="cart-button" data-id="${item.id}" data-next="1">+</button>
                <span>${item.value}</span>
                <button class="cart-button" data-id="${item.id}" data-prev="1">-</button>
            </div>
        </li>`;
        }).join('');
        this.total.textContent = sum;

        this.content.addEventListener('click', this.onClick);
    }
    this.onClick = function(event) {
        var id = parseInt(event.target.dataset.id);
        if(id)
        {
            var next = event.target.dataset.next;
            var prev = event.target.dataset.prev;
            var item = this.data.find(item => item.id === id);
            if(next)
            {
                item.value += 1;
            }
            if(prev)
            {
                item.value -= 1;
                item.value = (item.value >= 0)?item.value:0;
            }
            this.render();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    var products = new Products();
    var cartMain = new Cart();

    // Tạo nút đóng mở cart
    var toggleButton = document.getElementById('toggle');
    var cart = document.getElementById('cart');
    var header = document.getElementById('header');

    toggleButton.addEventListener('click', () => {
        cart.classList.toggle('cart-none');
    });
    // End

    cartMain.init();
    products.init(cartMain);
});