export default function(money) {
    let result = null;

    if(money && typeof money === 'number' && money % 1 === 0) { // check float or integer (for discount (12.5))
        let moneyArray = money.toString().split('');
        for(let i = moneyArray.length - 3; i > 0; i -= 3) {
            moneyArray.splice(i, 0, '.');
        }
        result = moneyArray.join('');
    }
    return result;
}