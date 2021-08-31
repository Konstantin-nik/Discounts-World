var adList = [];
var adItem = {
    id: '',                 //обязательное, уникальный
    description: '',        //обязательное
    createdAt: new Date(),  //обязательное
    link: '',               //обязательное
    vendor: 'vendor',       //обязательное, не пустое
    photoLink: '',          //необязательное
    hashTags: [],           //обязательное
    discount: '',           //обязательное
    validUntil: new Date(), //обязательное
    rating: 0,              //необязательное
    reviews: []             //необязательное
};

class AdList {
    #adItem = {
        id: '',                 //обязательное, уникальный
        description: '',        //обязательное
        createdAt: new Date(),  //обязательное
        link: '',               //обязательное
        vendor: 'vendor',       //обязательное, не пустое
        photoLink: '',          //необязательное
        hashTags: [],           //обязательное
        discount: '',           //обязательное
        validUntil: new Date(), //обязательное
        rating: 0,              //необязательное
        reviews: []             //необязательное
    };

    #adList = [
        adItem = {
            id: '1',
            description: 'Скидка на стулья - до 15%',
            createdAt: new Date('2020-03-15T23:00:00'),
            link: 'https://coolchairs.com',
            vendor: 'Chair Service',
            photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
            hashTags: ['мебель', 'стулья'],
            discount: '15%',
            validUntil: new Date('2021-06-01T23:00:00'),
            rating: 2
        },
        adItem = {
            id: '2',
            description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
            createdAt: new Date('2021-03-15T23:00:00'),
            link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
            vendor: "ЧТУП «ДИСТ-ГРУПП»",
            photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
            hashTags: ['мебель', 'раковина', 'пьедестал'],
            discount: '89,9%',
            validUntil: new Date('2021-06-01T23:00:00'),
            rating: 2
        },
        adItem = {
            id: '3',
            description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
            createdAt: new Date('2021-03-15T23:00:00'),
            link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
            vendor: "ЧТУП «ДИСТ-ГРУПП»",
            photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
            hashTags: ['мебель', 'стул', 'пьедестал'],
            discount: '89,9%',
            validUntil: new Date('2021-06-01T23:00:00'),
            rating: 2
        }
    ];

    constructor(adList) {
        this.#adList = adList.slice();
    }

    addAll(adLists) {
        var self = this;
        var nAdList = [];
        adLists.forEach(function (number) {
            if (AdList.validate(self, number)) {
                self.#adList.push(number);
            }
            else {
                nAdList.push(number);
            }
        })
        return nAdList;
    }

    #compareDates(a, b) {
        return b['createdAt'] - a['createdAt']
    }

    getPage(skip = 0, top = 10, filterConfig) {
        var arr = this.#adList.slice();
        if (filterConfig === undefined) {
            arr.sort(this.#compareDates);
            arr.splice(0, skip);
            arr = arr.slice(0, top);
            return arr;
        }
        else {
            var filtredArr = arr;
            if (filterConfig['hashTags'] !== undefined) {
                filterConfig['hashTags'].forEach(function (item, i, hash) {
                    filtredArr = filtredArr.filter(function (number) {
                        const even = (element) => element === item;
                        if (number['hashTags'].some(even)) {
                            return number;
                        }
                    });
                });
            }
            if (filterConfig['vendor'] !== '' && filterConfig['vendor'] !== undefined) {
                filtredArr = filtredArr.filter(function (number) {
                    if (number['vendor'] === filterConfig['vendor']) {
                        return number;
                    }
                });
            }
            if (filterConfig['dateFrom'] !== undefined) {
                var locConfig = new Date(filterConfig['dateFrom']);
                filtredArr = filtredArr.filter(function (number) {
                    if (number['createdAt'] >= locConfig) {
                        return number;
                    }
                });
            }
            if (filterConfig['dateTo'] !== undefined) {
                var locConfig = new Date(filterConfig['dateTo']);
                filtredArr = filtredArr.filter(function (number) {
                    if (number['createdAt'] <= locConfig) {
                        return number;
                    }
                });
            }
            return filtredArr;
        }
    }

    get(id) {
        return this.#adList.find(function (element) {
            return element['id'] === id;
        });
    }

    add(adItem) {
        if (AdList.validate(this, adItem)) {
            this.#adList.push(adItem);
            return true;
        }
        else {
            return false;
        }
    }

    edit(id, adItem) {
        var element = this.get(id);
        if (
            (adItem['id'] === undefined || adItem['id'] === element['id'])
            && (adItem['vendor'] === undefined || adItem['vendor'] === element['vendor'])
            && (adItem['createdAt'] === undefined
                || adItem['createdAt'] === element['createdAt'])
        ) {
            if (adItem['description'] !== undefined) {
                element['description'] = adItem['description'];
            }
            if (adItem['link'] !== undefined) {
                element['link'] = adItem['link'];
            }
            if (adItem['photoLink'] !== undefined) {
                element['photoLink'] = adItem['photoLink'];
            }
            if (adItem['hashTags'] !== undefined) {
                element['hashTags'] = adItem['hashTags'];
            }
            if (adItem['discount'] !== undefined) {
                element['discount'] = adItem['discount'];
            }
            if (adItem['validUntil'] !== undefined) {
                element['validUntil'] = adItem['validUntil'];
            }
            if (adItem['rating'] !== undefined) {
                element['rating'] = adItem['rating'];
            }
            if (adItem['reviews'] !== undefined) {
                element['reviews'] = adItem['reviews'];
            }
            return true;
        }
        else {
            return false;
        }
    }

    static validate(adList, adItem) {
        if (
            adItem['id'] !== undefined && adItem['description'] !== undefined
            && adItem['createdAt'] !== undefined && adItem['link'] !== undefined
            && adItem['vendor'] !== undefined && adItem['vendor'] !== ""
            && adItem['hashTags'] !== undefined && adItem['discount'] !== undefined
            && adItem['validUntil'] !== undefined
        ) {
            if (
                typeof adItem['id'] === "string"
                && typeof adItem['description'] === "string"
                && typeof adItem['createdAt'] === "object"
                && typeof adItem['link'] === "string"
                && typeof adItem['vendor'] === "string"
                && (typeof adItem['photoLink'] === "string"
                    || typeof adItem['photoLink'] === "undefined")
                && typeof adItem['hashTags'] === "object"
                && typeof adItem['discount'] === "string"
                && typeof adItem['validUntil'] === "object"
                && (typeof adItem['rating'] === "number"
                    || typeof adItem['rating'] === "undefined")
                && (typeof adItem['reviews'] === "object"
                    || typeof adItem['reviews'] === "undefined")
            ) {
                if (adList.get(adItem['id']) === undefined) {
                    return true;
                }
            }
        }
        return false;
    }

    remove(id) {
        var ind = this.#adList.findIndex(function (element) {
            return element['id'] === id;
        });
        if (ind !== -1) {
            this.#adList.splice(ind, 1);
            return true;
        }
        return false;
    }
}




