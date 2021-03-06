var loadCount = 0;
var isLoggedIn = false;
var user = {};

var userList = [
    { uname: "admin", pass: "admin", isVendor: false },
    {
        uname: "chairservice", pass: "chair Service",
        isVendor: true, vendorName: "Chair Service"
    },
    { uname: "1", pass: "1", isVendor: true, vendorName: "Chair Service" },
    { uname: "chtup", pass: "chtupven", isVendor: true, vendorName: "ЧТУП «ДИСТ-ГРУПП»" }

]

var filters = {
    hashTags: [],
    vendor: '',
    dateFrom: undefined,
    dateTo: undefined
};

var adItem = {
    id: '',                         //обязательное, уникальный
    description: '',                //обязательное
    createdAt: new Date(),          //обязательное
    link: '',                       //обязательное
    vendor: 'vendor',               //обязательное, не пустое
    photoLink: '',                  //необязательное
    hashTags: [],                   //обязательное
    discount: '',                   //обязательное
    validUntil: new Date(),         //обязательное
    rating: 0,                      //необязательное
    reviews: []                     //необязательное
};

class AdList {
    #adItem = {
        id: '',                     //обязательное, уникальный
        description: '',            //обязательное
        createdAt: new Date(),      //обязательное
        link: '',                   //обязательное
        vendor: 'vendor',           //обязательное, не пустое
        photoLink: '',              //необязательное
        hashTags: [],               //обязательное
        discount: '',               //обязательное
        validUntil: new Date(),     //обязательное
        rating: 0,                  //необязательное
        reviews: [],                //необязательное
        isDelete: false
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
            rating: 0
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
            rating: 0
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
            rating: 0
        }
    ];

    constructor(adList) {
        this.#adList = adList.slice();
    }

    deletePost(id) {
        this.get(id).isDelete = true;
        return true;
    }

    getSize() {
        var size = this.#adList.length;
        return size;
    }

    getFiltredSize(filterConfig) {
        return this.getPage(0, this.getSize(), filterConfig).length;
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

    getFreeId() {
        let find = false;
        for (let i = 1; ; i++) {
            find = true;
            for (let j = 0; j < this.#adList.length; j++) {
                if (parseInt(this.#adList[j].id, 10) === i) {
                    find = false;
                    break;
                }
            }
            if (find === true) {
                return i;
            }
        }
    }

    #compareDates(a, b) {
        return b['createdAt'] - a['createdAt']
    }

    getPage(skip = 0, top = 10, filterConfig) {
        var arr = this.#adList.slice();
        if (filterConfig === undefined) {
            arr = arr.filter(function (number) {
                if (number['isDelete'] === false) {
                    return number;
                }
            });
            arr.sort(this.#compareDates);
            arr.splice(0, skip);
            arr = arr.slice(0, top);
            return arr;
        }
        else {
            arr = arr.filter(function (number) {
                if (number['isDelete'] === false) {
                    return number;
                }
            });
            var filtredArr = arr;
            if (filterConfig['hashTags'] !== undefined) {
                filterConfig['hashTags'].forEach(function (item, i, hash) {
                    filtredArr = filtredArr.filter(function (number) {
                        const even = (element) => element === item || item === "";
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
            filtredArr.sort(this.#compareDates);
            filtredArr.splice(0, skip);
            filtredArr = filtredArr.slice(0, top);
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
            && adItem['description'] !== "" && adItem['link'] !== ""
            && adItem['hashTags'] !== ['']
        ) {
            if (adItem['description'] !== undefined) {
                element['description'] = adItem['description'].slice(0, 250);
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
                && (typeof adItem['validUntil'] === "object"
                    || typeof adItem['validUntil'] === "string")
                && (typeof adItem['rating'] === "number"
                    || typeof adItem['rating'] === "undefined")
                && (typeof adItem['reviews'] === "object"
                    || typeof adItem['reviews'] === "undefined")
                && adItem['description'] !== "" && adItem['link'] !== ""
                && adItem['hashTags'].length !== 0
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

    addReview(review, rate, id) {
        var element = this.get(id);
        if (element['reviews'] === undefined) {
            element['reviews'] = [{ text: review, rate: rate, date: new Date() }];
        }
        else {
            element['reviews'].push({ text: review, rate: rate, date: new Date() });
        }
        var rating = 0;
        for (let i = 0; i < element['reviews'].length; i++) {
            rating += element['reviews'][i].rate;
        }
        rating /= element['reviews'].length;
        rating = Math.trunc(rating * 10) / 10;
        element['rating'] = rating;
    }
}

adList = new AdList([
    adItem = {
        id: '1',
        description: 'Скидка на стулья - до 15%',
        createdAt: new Date('2021-08-15T23:00:00'),
        link: 'https://coolchairs.com',
        vendor: 'Chair Service',
        photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
        hashTags: ['мебель', 'стулья'],
        discount: '15%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        reviews: [{ text: "Супер!", rate: 5, date: 15 }, { text: "Отличный товар и скидка неплохая", rate: 5, date: 15 }],
        isDelete: false
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
        rating: 0,
        isDelete: false
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
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '4',
        description: 'Скидка на стулья - до 15%',
        createdAt: new Date('2020-03-15T23:00:00'),
        link: 'https://coolchairs.com',
        vendor: 'Chair Service',
        photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
        hashTags: ['мебель', 'стулья'],
        discount: '15%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '5',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'раковина', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '6',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'стул', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '7',
        description: 'Скидка на стулья - до 15%',
        createdAt: new Date('2020-03-15T23:00:00'),
        link: 'https://coolchairs.com',
        vendor: 'Chair Service',
        photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
        hashTags: ['мебель', 'стулья'],
        discount: '15%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '8',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'раковина', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '9',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'стул', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '10',
        description: 'Скидка на стулья - до 15%',
        createdAt: new Date('2020-03-15T23:00:00'),
        link: 'https://coolchairs.com',
        vendor: 'Chair Service',
        photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
        hashTags: ['мебель', 'стулья'],
        discount: '15%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '11',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'раковина', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '12',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'стул', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '13',
        description: 'Скидка на стулья - до 15%',
        createdAt: new Date('2020-03-15T23:00:00'),
        link: 'https://coolchairs.com',
        vendor: 'Chair Service',
        photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
        hashTags: ['мебель', 'стулья'],
        discount: '15%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '14',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'раковина', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '15',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'стул', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '16',
        description: 'Скидка на стулья - до 15%',
        createdAt: new Date('2020-03-15T23:00:00'),
        link: 'https://coolchairs.com',
        vendor: 'Chair Service',
        photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
        hashTags: ['мебель', 'стулья'],
        discount: '15%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '17',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'раковина', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '18',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'стул', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '19',
        description: 'Скидка на стулья - до 15%',
        createdAt: new Date('2020-03-15T23:00:00'),
        link: 'https://coolchairs.com',
        vendor: 'Chair Service',
        photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
        hashTags: ['мебель', 'стулья'],
        discount: '15%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '20',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'раковина', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '21',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'стул', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '22',
        description: 'Скидка на стулья - до 15%',
        createdAt: new Date('2020-03-15T23:00:00'),
        link: 'https://coolchairs.com',
        vendor: 'Chair Service',
        photoLink: 'https://images.app.goo.gl/dgAFyP2cEduzkJUP9',
        hashTags: ['мебель', 'стулья'],
        discount: '15%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '23',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'раковина', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    },
    adItem = {
        id: '24',
        description: 'Form 500 пьедестал для раковины универсальный, цв. белый',
        createdAt: new Date('2021-03-15T23:00:00'),
        link: 'https://minus50.by/product/form-500-pedestal-dlya-rakoviny-universalnyj-czv-belyj-1627459176-30',
        vendor: "ЧТУП «ДИСТ-ГРУПП»",
        photoLink: 'https://files.minus50.by/products/129c0ea0-0154-4b25-9964-dd83a1e0416c.JPEG',
        hashTags: ['мебель', 'стул', 'пьедестал'],
        discount: '89,9%',
        validUntil: new Date('2021-06-01T23:00:00'),
        rating: 0,
        isDelete: false
    }
]);

var isFilersS = false;
document.getElementById("show-filters").onclick = function () {
    if (isFilersS) {
        document.getElementById('filter-form').style.display = 'none';
        isFilersS = false;
    }
    else {
        document.getElementById('filter-form').style.display = 'inline';
        var myNode = document.getElementById('vendor-choose');
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        let opt = document.createElement('option');
        opt.innerHTML = "";
        document.getElementById("vendor-choose").appendChild(opt);
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].isVendor) {
                opt = document.createElement('option');
                opt.innerHTML = userList[i].vendorName;
                document.getElementById("vendor-choose").appendChild(opt);
            }
        }
        isFilersS = true;
    }
}

var vendorChoose = document.querySelector('select');
vendorChoose.onchange = function () {
    var vendor = vendorChoose.value;
    filters.vendor = vendor;
    reload();
};

var dateFromChoose = document.getElementById("date-from");
dateFromChoose.onchange = function () {
    var dateFrom = dateFromChoose.value;
    filters.dateFrom = new Date(dateFrom + "T00:00:00");
    reload();
};

var dateToChoose = document.getElementById("date-to");
dateToChoose.onchange = function () {
    var dateTo = dateToChoose.value;
    filters.dateTo = new Date(dateTo + "T00:00:00");
    reload();
};

var hashtagChoose = document.getElementById("edit-hashtag-list");

hashtagChoose.oninput = function () {
    var hashTags = hashtagChoose.value;
    filters.hashTags = hashTags.split(', ');
    reload();
};
/*
function setFilter() {
    document.getElementById('filter-form').style.display = 'none';
    isFilersS = false;
    reload();
}
*/
document.getElementById("add-button").onclick = function () {
    imgFileUrl = '';
    imgFileC = 0;
    document.getElementById('edit-post-form').style.display = 'block';
    while (document.getElementById('gallery').firstChild) {
        document.getElementById('gallery').removeChild(myNode.firstChild);
    }
    document.getElementById('edit-post-form').setAttribute('hId', "");
    document.getElementById('edit-add-label').innerHTML = "Add post";
    document.getElementById('vendor-name').innerHTML = user.vendorName;
    document.getElementById('edit-description').value = "";
    document.getElementById('edit-link').value = "";
    document.getElementById('edit-valid-until').value = "";
    document.getElementById('edit-discount-size').value = "";
    document.getElementById('edit-hashtags').value = "";
    document.getElementById('edit-date').innerHTML = new Date();
}

document.getElementById("edit-post-submit").onclick = function () {
    let adItem1 = {
        description: document.getElementById('edit-description').value.slice(0, 250),
        createdAt: new Date(document.getElementById('edit-date').innerHTML),
        link: document.getElementById('edit-link').value,
        photoLink: imgFileUrl,
        vendor: user.vendorName,
        discount: document.getElementById('edit-discount-size').value,
        validUntil: document.getElementById('edit-valid-until').value,
        hashTags: document.getElementById('edit-hashtags').value.split(', '),
        rating: 0,
        isDelete: false,
        reviews: []
    }
    let r = parseInt(adItem1.discount, 10);
    if (isNaN(r)) {
        document.getElementById('add-edit-error').innerHTML = "Not correct discount";
        return;
    }
    else if ((r > 100) || (r < 1)) {
        document.getElementById('add-edit-error').innerHTML = "Not correct discount";
        return;
    }
    for (let i = 0; i < adItem1.hashTags.length; i++) {
        adItem1.hashTags[i] = adItem1.hashTags[i].trim();
        if (adItem1.hashTags[i] === "" || adItem1.hashTags[i].length > 20) {
            document.getElementById('add-edit-error').innerHTML = "Wrong hashtags";
            return;
        }
    }
    if (document.getElementById('edit-post-form').getAttribute('hId') === "") {
        adItem1.id = adList.getFreeId().toString();
        let isAdd = adList.add(adItem1);
        if (isAdd) {
            document.getElementById('edit-post-form').style.display = 'none';
            document.getElementById('add-edit-error').innerHTML = "";
            imgFileUrl = '';
            imgFileC = 0;
            document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[0]);
            reload();
        }
        else {
            document.getElementById('add-edit-error').innerHTML = "Not correct input";
        }
    }
    else {
        adItem1.id = document.getElementById('edit-post-form').getAttribute('hId');
        let isEdit = adList.edit(adItem1.id, adItem1);
        if (isEdit) {
            document.getElementById('edit-post-form').style.display = 'none';
            document.getElementById('add-edit-error').innerHTML = "";
            imgFileUrl = '';
            imgFileC = 0;
            document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[0]);
            reload();
        }
        else {
            document.getElementById('add-edit-error').innerHTML = "Not correct input";
        }
    }
    reload();
}

var imgFile;
var imgFileUrl = '';
var imgFileC = 0;
{
    let dropArea = document.getElementById('drop-area');
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    function highlight(e) {
        dropArea.classList.add('highlight');
    }
    function unhighlight(e) {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('drop', handleDrop, false)
    function handleDrop(e) {
        console.log(e);
        let dt = e.dataTransfer;
        let files = dt.files;
        handleFiles(files);
    }
    function handleFiles(files) {
        imgFile = files[0];
        previewFile(imgFile);
        console.log(files);
        console.log(imgFile);
    }
    function previewFile(file) {
        if (imgFileC === 0) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                let img = document.createElement('img');
                img.src = reader.result;
                imgFileUrl = reader.result;
                document.getElementById('gallery').appendChild(img);
            }
            imgFileC = 1;
        }
        else {
            document.getElementById('gallery').removeChild(document.getElementById('gallery').childNodes[0]);
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                let img = document.createElement('img');
                img.src = reader.result;
                imgFileUrl = reader.result;
                document.getElementById('gallery').appendChild(img);
            }
            imgFileC = 1;
        }
    }
}

document.getElementById("review-submit-button").onclick = function () {
    let review = user.login + ": " + document.getElementById("review-input").value;
    let rating = parseInt(document.getElementById("rate-input").value, 10);
    if (isNaN(rating)) {
        document.getElementById("wrong-review").innerHTML = "Wrong Rating";
    }
    else if ((rating > 5) || (rating < 1)) {
        document.getElementById("wrong-review").innerHTML = "Wrong Rating";
    }
    else {
        adList.addReview(review, rating, document.getElementById('review-form').getAttribute('hId'));
        document.getElementById('review-form').style.display = 'none';
        document.getElementById("wrong-review").innerHTML = "";
        reload();
    }
}

document.getElementById("login-in-button").onclick = function () {
    let login = document.getElementById("login-user-name").value;
    let password = document.getElementById("login-password").value;
    for (let i = 0; i < userList.length; i++) {
        if ((userList[i].pass === password) && (userList[i].uname === login)) {
            user.login = login;
            user.password = password;
            user.isVendor = userList[i].isVendor;
            if (user.isVendor) {
                user.vendorName = userList[i].vendorName;
            }
            document.getElementById("exit-button").innerHTML = "Exit";
            document.getElementById("user-name").setAttribute('class', 'nav');
            document.getElementById("wrong-password").innerHTML = "";
            document.getElementById('login-form').style.display = 'none';
            document.getElementById("user-name-login").innerHTML = user.login;
            isLoggedIn = true;
            reload();
        }
    }
    if (isLoggedIn === false) {
        document.getElementById("wrong-password").innerHTML = "Wrong login or password";
    }
}

document.getElementById("exit-button").onclick = function () {
    if (isLoggedIn) {
        document.getElementById("exit-button").innerHTML = "Login";
        document.getElementById("user-name").setAttribute('class', 'hide');
        isLoggedIn = false;
        reload();
    }
    else {
        document.getElementById('login-form').style.display = 'block';/*
        document.getElementById("exit-button").innerHTML = "Exit";
        document.getElementById("user-name").setAttribute('class', 'nav');
        isLoggedIn = true;
        reload();//*/
    }
}

function reload() {
    document.getElementById("cont-container").remove()
    let contContainer = document.createElement('div');
    contContainer.setAttribute('id', 'cont-container');
    contContainer.setAttribute('class', 'move-container');
    document.getElementById("content-container").after(contContainer);
    loadCount = 0;
    adListSize = adList.getFiltredSize(filters);
    nextPostsCount = adListSize - loadCount * 10;
    if (adListSize - loadCount * 10 <= 0) {
        var loadBut = document.getElementById("next-ten-posts");
        loadBut.setAttribute('class', 'hide');
    }
    else {
        var loadBut = document.getElementById("next-ten-posts");
        loadBut.setAttribute('class', '');
    }
    displayPostList()
}

var adListSize = adList.getFiltredSize(filters);
var nextPostsCount = adListSize - loadCount * 10;

function displayPostList() {
    adListSize = adList.getFiltredSize(filters);
    nextPostsCount = adListSize - loadCount * 10;
    if (isLoggedIn && user.isVendor) {
        document.getElementById("add-button").style.display = 'inline';
    }
    else {
        document.getElementById("add-button").style.display = 'none';
    }
    if (nextPostsCount > 0) {
        if (nextPostsCount > 10) {
            nextPostsCount = 10;
        }
        var adToLoad = adList.getPage(loadCount * 10 - 1, 10, filters);
        for (let i = 0; i < nextPostsCount; i++) {

            let div = document.createElement('div');
            div.setAttribute('class', 'post-container');
            document.getElementById("cont-container").appendChild(div);

            //let pictureDiv = document.createElement('div');
            //pictureDiv.setAttribute('class', 'picture-container');
            //div.appendChild(pictureDiv);

            let picture = document.createElement('img');
            picture.setAttribute('src', adToLoad[i].photoLink);
            picture.setAttribute('class', 'picture-container');
            div.appendChild(picture);

            let textDiv = document.createElement('div');
            textDiv.setAttribute('id', adToLoad[i].id);
            textDiv.setAttribute('class', 'text-container id-field');
            textDiv.innerHTML = adToLoad[i].description;
            div.appendChild(textDiv);

            let link = document.createElement('a');
            link.setAttribute('href', adToLoad[i].link);
            link.innerHTML = "</br> <p> Ссылка на полное описание </p>";
            textDiv.appendChild(link);

            let vendorName = document.createElement('p');
            vendorName.innerHTML = "Имя вендора: <strong>" + adToLoad[i].vendor + "</strong>";
            textDiv.appendChild(vendorName);

            let hashList = document.createElement('p');
            hashList.innerHTML = "Список Хештегов: <strong>#" + adToLoad[i].hashTags.join(' #') + "</strong>";
            textDiv.appendChild(hashList);

            let discountSize = document.createElement('p');
            discountSize.innerHTML = "Размер скидки: <strong>" + adToLoad[i].discount + "</strong>";
            textDiv.appendChild(discountSize);

            let valid = document.createElement('p');
            valid.innerHTML = "Действует до: <strong>" + adToLoad[i].validUntil + "</strong>";
            if (adToLoad[i].validUntil !== "") {
                textDiv.appendChild(valid);
            }

            let rating = document.createElement('p');
            rating.innerHTML = "Рейтинг: <strong>" + adToLoad[i].rating + "</strong>";
            textDiv.appendChild(rating);

            let reviews = document.createElement('p');
            if (adToLoad[i].reviews === undefined) {
                reviews.innerHTML = "Отзывы: <strong>Нет отзывов</strong>";
            }
            else if (adToLoad[i].reviews.length === 0) {
                reviews.innerHTML = "Отзывы: <strong>Нет отзывов</strong>";
            }
            else {
                var revM = adToLoad[i].reviews.slice();
                revM.reverse();
                revM = revM.slice(0, 5);
                var str = "Отзывы: ";
                for (let i = 0; i < revM.length; i++) {
                    str = str.concat("</br>• " + revM[i].rate + "/5 " + revM[i].text);
                }
                reviews.innerHTML = str;
            }
            textDiv.appendChild(reviews);

            let postModifications = document.createElement('span');
            postModifications.setAttribute('class', 'post-modifications');
            textDiv.appendChild(postModifications);

            let editPost = document.createElement('button');
            editPost.textContent = "Edit";
            editPost.onclick = function () {
                imgFileUrl = '';
                imgFileC = 0;
                document.getElementById('edit-post-form').style.display = 'block';
                while (document.getElementById('gallery').firstChild) {
                    document.getElementById('gallery').removeChild(myNode.firstChild);
                } document.getElementById('edit-post-form').setAttribute('hId', adToLoad[i].id);
                document.getElementById('edit-add-label').innerHTML = "Edit post";
                document.getElementById('vendor-name').innerHTML = adToLoad[i].vendor;
                document.getElementById('edit-description').value = adToLoad[i].description.valueOf();
                document.getElementById('edit-link').value = adToLoad[i].link;
                document.getElementById('edit-hashtags').value = adToLoad[i].hashTags.join(', ');
                document.getElementById('edit-valid-until').value = adToLoad[i].validUntil;
                document.getElementById('edit-discount-size').value = adToLoad[i].discount.split('%')[0];
                document.getElementById('edit-date').innerHTML = adToLoad[i].createdAt;
            }
            if (isLoggedIn && user.isVendor) {
                if (user.vendorName === adToLoad[i].vendor) {
                    editPost.setAttribute('class', 'post-button');
                }
                else {
                    editPost.setAttribute('class', 'post-button hide-but');
                }
            }
            else {
                editPost.setAttribute('class', 'post-button hide-but');
            }
            postModifications.appendChild(editPost);

            let deletePost = document.createElement('button');
            deletePost.textContent = "Delete";
            deletePost.onclick = function () {
                adList.deletePost(deletePost.parentNode.parentNode.id);
                reload();
            }
            if (isLoggedIn && user.isVendor) {
                if (user.vendorName === adToLoad[i].vendor) {
                    deletePost.setAttribute('class', 'post-button');
                }
                else {
                    deletePost.setAttribute('class', 'post-button hide-but');
                }
            }
            else {
                deletePost.setAttribute('class', 'post-button hide-but');
            }
            postModifications.appendChild(deletePost);

            let leaveReview = document.createElement('button');
            leaveReview.textContent = "Leave review";
            leaveReview.onclick = function () {
                document.getElementById('review-form').style.display = 'block';
                document.getElementById('review-form').setAttribute('hId', adToLoad[i].id);
            }
            if (isLoggedIn) {
                leaveReview.setAttribute('class', 'post-button');
            }
            else {
                leaveReview.setAttribute('class', 'post-button hide-but');
            }
            postModifications.appendChild(leaveReview);
            //document.getElementById("cont-container").appendChild(div);
        }
        loadCount++;
        if (adListSize - loadCount * 10 <= 0) {
            var loadBut = document.getElementById("next-ten-posts");
            loadBut.setAttribute('class', 'hide');
        }
    }
}

