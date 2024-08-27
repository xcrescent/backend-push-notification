module.exports = function formatMessage(template, dataMap) {
    return template.replace(/{(\w+)}/g, (_, key) => dataMap[key] || '');
};
