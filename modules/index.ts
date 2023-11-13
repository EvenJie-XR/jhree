/**
 * jesium版本号
 */
const version: string = require("../package.json").version;

export { version };

export * from "./jhree"
export * from "./eventManager"