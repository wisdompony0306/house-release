/**
 * Created by lunachi on 2017/7/5.
 */
function datetimeFormat(value) {
    let valueFormat = '';
    if (value) {
        let fullDate = value.split("-");
        if (fullDate.length >= 3) {
            valueFormat = `${fullDate[0]}年${fullDate[1]}月${fullDate[2]}日`;
        }
    }
    return valueFormat;
}

export default datetimeFormat;

