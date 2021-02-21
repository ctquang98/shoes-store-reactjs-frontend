export default function(products, property) {
    let result = null;
    if(products.length) {
        result = products.reduce((r, a) => {
            r[a[property]] = [...r[a[property]] || [], a];
            return r;
            }, {});
    }
    return result;
}