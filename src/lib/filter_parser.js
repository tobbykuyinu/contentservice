'use strict';

const pick = require('lodash.pick');

class FilterParser {

    /**
     * Filter Parser - handles parsing widgets from contentful to Search API filters
     * @constructor
     * @param widgetObject
     */
    constructor(widgetObject) {
        this.widget = widgetObject;
    }

    generateFilter() {
        const allowedKeys = [
            'widgetName', 'transmission', 'sellerType',
            'category', 'condition', 'fuel', 'model', 'brand',
            'priceFrom', 'priceTo', 'yearFrom',
            'yearTo', 'mileageFrom', 'mileageTo'
        ];
        let filter = {};
        let contentfulData = pick(this.widget, allowedKeys);
        const mapping = this.mapping();

        for (let prop in contentfulData) {
            if (contentfulData.hasOwnProperty(prop) && mapping.hasOwnProperty(prop)) {
                const key = mapping[prop].name;
                filter[key] = mapping[prop].value(contentfulData[prop]);
            }
        }

        return filter;
    }

    /**
     * Fixed value to ID mapping for applicable fields
     * @returns {Object}
     */
    static valueToIdMaps() {
        return {
            transmission: { manual: 1, automatic: 2 },
            condition: { new: 1, used: 2 },
            fuel: { petrol: 1, diesel: 2, gas: 3, electro: 4, hybrid: 5 }
        };
    }

    /**
     * Maps contentful keys to their Search API equivalent
     * @returns {Object}
     */
    mapping() {
        const ids = FilterParser.valueToIdMaps();
        const allToLower = (values) => {
            return values.map(val => { return val.toLowerCase(); });
        };

        return {
            transmission: {
                name: 'attributes.general.transmission.id',
                value: (contentfulValue) => {
                    const value = allToLower(contentfulValue);
                    return value.map(val => { return ids.transmission[val]; });
                }
            },
            sellerType: {
                name: 'user.agent_type',
                value: (contentfulValue) => {
                    return allToLower(contentfulValue);
                }
            },
            category: {
                name: 'categories.code',
                value: (contentfulValue) => {
                    return allToLower(contentfulValue);
                }
            },
            condition: {
                name: 'attributes.general.condition.id',
                value: (contentfulValue) => {
                    const value = allToLower(contentfulValue);
                    return value.map(val => { return ids.condition[val]; });
                }
            },
            fuel: {
                name: 'attributes.general.fuel.id',
                value: (contentfulValue) => {
                    const value = allToLower(contentfulValue);
                    return value.map(val => { return ids.fuel[val]; });
                }
            },
            model: {
                name: 'model.code',
                value: (contentfulValue) => {
                    return allToLower(contentfulValue);
                }
            },
            brand: {
                name: 'brand.code',
                value: (contentfulValue) => {
                    return allToLower(contentfulValue);
                }
            },
            priceFrom: {
                name: 'price.value',
                value: (contentfulValue) => {
                    const priceTo = this.widget.priceTo;
                    let price = { gte: parseInt(contentfulValue) };

                    if (priceTo) {
                        price.lte = parseInt(priceTo);
                    }

                    return price;
                }
            },
            priceTo: {
                name: 'price.value',
                value: (contentfulValue) => {
                    const priceFrom = this.widget.priceFrom;
                    let price = { lte: parseInt(contentfulValue) };

                    if (priceFrom) {
                        price.gte = parseInt(priceFrom);
                    }

                    return price;
                }
            },
            yearFrom: {
                name: 'year',
                value: (contentfulValue) => {
                    const yearTo = this.widget.yearTo;
                    let year = { gte: parseInt(contentfulValue) };

                    if (yearTo) {
                        year.lte = parseInt(yearTo);
                    }

                    return year;
                }
            },
            yearTo: {
                name: 'year',
                value: (contentfulValue) => {
                    const yearFrom = this.widget.yearFrom;
                    let year = { lte: parseInt(contentfulValue) };

                    if (yearFrom) {
                        year.gte = parseInt(yearFrom);
                    }

                    return year;
                }
            },
            mileageFrom: {
                name: 'attributes.general.mileage',
                value: (contentfulValue) => {
                    const mileageTo = this.widget.mileageTo;
                    let mileage = { gte: parseInt(contentfulValue) };

                    if (mileageTo) {
                        mileage.lte = parseInt(mileageTo);
                    }

                    return mileage;
                }
            },
            mileageTo: {
                name: 'attributes.general.mileage',
                value: (contentfulValue) => {
                    const mileageFrom = this.widget.mileageFrom;
                    let mileage = { lte: parseInt(contentfulValue) };

                    if (mileageFrom) {
                        mileage.gte = parseInt(mileageFrom);
                    }

                    return mileage;
                }
            }
        };
    }
}

module.exports = FilterParser;
