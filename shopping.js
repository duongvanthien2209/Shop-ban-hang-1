function Products() {
    this.content = null;
    this.data = [];
    this.cart = null;
    this.productItem = null;
    this.search = null;
    this.init = function (cart) {
        this.search = document.getElementById('search-input');

        // Bind function
        this.render = this.render.bind(this);
        this.onClick = this.onClick.bind(this);
        this.reFreshData = this.reFreshData.bind(this);
        this.onSearch = this.onSearch.bind(this);

        this.cart = cart;
        this.content = document.getElementById('main-content');
        axios.get('http://localhost:3000/products').then(res => {
            this.data = res.data;
            this.render(this.data);
            this.content.addEventListener('click', this.onClick);
        });
        this.search.addEventListener('keyup', this.onSearch);
        this.search.addEventListener('change', this.onSearch);
    }

    this.onSearch = function(event) {
        var value = event.target.value;
        var data1 = this.data.filter(item => {
            return item.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });
        this.render(data1);
    }

    this.onClick = function (event) {
        var id = parseInt(event.target.dataset.id);
        if (id) {
            var product = this.data.find(item => item.id === id);
            // Loại sản phẩm ra khỏi danh sách products
            this.data = this.data.filter(item => item.id !== id);
            this.render(this.data);

            if (!product) {
                console.log('Có lỗi xảy ra');
            } else this.productItem = product;
            this.cart.addItem(this.productItem);
        }
    }

    this.reFreshData = async function () {
        var res = await axios.get('http://localhost:3000/products');
        this.data = res.data;
        this.render(this.data);
    }

    this.render = function (data) {
        data = data.filter(item => {
            for (var i of this.cart.data) {
                if (item.id === i.id) return false;
            }
            return true;
        });
        var contents = data.map(item => {
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
    this.products = null;
    this.resetButton = null;
    this.init = function (products) {
        this.products = products;
        this.content = document.getElementById('cart-main');
        this.total = document.getElementById('total');
        this.resetButton = document.getElementById('close-button');

        // Bind function
        this.onClick = this.onClick.bind(this);
        this.onReset = this.onReset.bind(this);

        // Add event listener
        this.resetButton.addEventListener('click', this.onReset);
    }

    this.onReset = function (event) {
        this.data = [];
        this.content.textContent = '';
        this.total.textContent = '0';
        this.products.reFreshData();
    }

    this.addItem = function (item) {
        var item1 = { ...item, value: 1 };
        this.data.push(item1);
        this.render();
    }
    this.render = function () {
        var sum = 0;
        this.content.innerHTML = this.data.map(item => {
            sum += item.value * item.number;
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
    this.onClick = function (event) {
        var id = parseInt(event.target.dataset.id);
        if (id) {
            var next = event.target.dataset.next;
            var prev = event.target.dataset.prev;
            var item = this.data.find(item => item.id === id);
            if (next) {
                item.value += 1;
            }
            if (prev) {
                item.value -= 1;
                item.value = (item.value >= 0) ? item.value : 0;
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

    cartMain.init(products);
    products.init(cartMain);
});