import fs from 'fs';
import path from 'path';
import { rootDir } from '../util/path';

const p = path.join(
    path.dirname(rootDir),
    'data',
    'products.json'
);

const getProductsFromFile = (cb: { (products: any[]): void; (arg0: never[]): void; }) => {
    fs.readFile(p, (err, fileContent: any) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

class Product {
    title: string;
    description: string;
    price: any;
    imageUrl: any;
    constructor(title: string, imageUrl: any, description: string, price: any) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products: this[]) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb: any) {
        getProductsFromFile(cb);
    }
};
