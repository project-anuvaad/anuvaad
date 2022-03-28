export default function NFormatterTest(value, type, symbol, commaSeparated = false) {

    var SI_SYMBOL = ["Unit", "Lac", "Cr"];
    const Rformatter = new Intl.NumberFormat('en-IN', {
            // maximumFractionDigits:0,
            useGrouping: true,
            // currencyDisplay : Intl.NumberFormatOptions
            //style: 'currency',
            currency: 'INR'
        })
        // return value;
    switch (type) {
        case "amount":
        case "Amount":
            switch (symbol) {

                case SI_SYMBOL[1]:
                    return `${Rformatter.format((value / 100000).toFixed(2))}` || `${Rformatter.format(0)}`

                case SI_SYMBOL[2]:
                    return `${Rformatter.format((value / 10000000).toFixed(2))}` || `${Rformatter.format(0)}`

                case SI_SYMBOL[0]:
                    if (value <= 9999999) {
                        return `${Rformatter.format(value || 0)}`
                    } else {
                        if (!commaSeparated) {
                            return value;
                            // let nvalue = Rformatter.format((value).toFixed(2) || 0).replace('₹ ', '');
                            // var right = nvalue.substring(nvalue.length - 12, nvalue.length);
                            // var left = nvalue.substring(0, nvalue.length - 12).replace(',', '');
                            // let newVal = (left ? (left + ',') : '') + right;
                            // return parseFloat(newVal.replace(",,", ',').replace(',', ''));
                        } else {
                            let nvalue = Rformatter.format((value).toFixed(2) || 0).replace('₹ ', '');
                            var right = nvalue.substring(nvalue.length - 12, nvalue.length);
                            var left = nvalue.substring(0, nvalue.length - 12).replace(',', '');
                            let newVal = (left ? (left + ',') : '') + right;
                            return newVal.replace(",,", ',');
                        }
                    }

                default:
                    return parseFloat(`${Rformatter.format(value || 0)}`)
            }
        case "number":
        case "Number":
            if (!commaSeparated) {
                return parseInt(value);
            }
            const Nformatter = new Intl.NumberFormat('en-IN');
            return Nformatter.format(Math.round(value));
        case "percentage":
        case "Percentage":
            const Pformatter = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 });
            return `${Pformatter.format(value)} %`;
        case "text":
        case "Text":
            return value;
        default:
            return value;

    }
}
