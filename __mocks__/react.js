//  There is uncertainty around enzyme's support of React.memo
// todo remove later when Enzyme supports this.
const react = require("react");
module.exports = { ...react, memo: x => x };