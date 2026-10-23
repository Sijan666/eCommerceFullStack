const schema = {
    title: {
        column: 'title',
        type: String
    },
    description: {
        column: 'description',
        type: String
    },
    shortDescription: {
        column: 'shortDescription',
        type: String
    },
    price: {
        column: 'price',
        type: Number
    },
    images: {
        column: 'images.url',
        type: String
    },
    discount: {
        column: 'discount',
        type: Number
    },
    stock: {
        column: 'stock',
        type: Number
    },
    status: {
        column: 'status',
        type: String
    },
    sku: {
        column: 'sku',
        type: String
    },
    slug: {
        column: 'slug',
        type: String
    }
};

module.exports = schema;