
const products: any[] = []

class Product {
    title;
    constructor(t: string) {
        this.title = t
    }

    save() {
        products.push(this)
    }

    static fetchAll() {
        return products;
    }
}

export { Product }