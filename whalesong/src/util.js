export const isType = [
    "Arguments",
    "Function",
    "String",
    "Number",
    "Date",
    "RegExp",
].reduce((obj, name) => {
    // eslint-disable-next-line
    obj[`is${name}`] = x => toString.call(x) === `[object ${name}]`;
    return obj;
}, {});

export const isString = x => toString.call(x) === "[object String]";
