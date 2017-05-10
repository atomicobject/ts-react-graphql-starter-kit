
type ICodeceptCallback = (i: CodeceptJS.I) => void;

declare const actor: () => CodeceptJS.I;
declare const Feature: (string: string) => void;
declare const Scenario: (string: string, callback: ICodeceptCallback) => void;
declare const Before: (callback: ICodeceptCallback) => void;
declare const After: (callback: ICodeceptCallback) => void;
declare const within: (selector: string, callback: Function) => void;

declare namespace CodeceptJS {
  export interface I {
    Nightmare: (options) => any; 
    haveHeader: (header, value) => any; 
    amOnPage: (url, headers?) => any; 
    seeInTitle: (text) => any; 
    dontSeeInTitle: (text) => any; 
    grabTitle: () => any; 
    seeInCurrentUrl: (url) => any; 
    dontSeeInCurrentUrl: (url) => any; 
    seeCurrentUrlEquals: (url) => any; 
    dontSeeCurrentUrlEquals: (url) => any; 
    see: (text, context?) => any; 
    dontSee: (text, context) => any; 
    seeElement: (locator) => any; 
    dontSeeElement: (locator) => any; 
    seeElementInDOM: (locator) => any; 
    dontSeeElementInDOM: (locator) => any; 
    seeInSource: (text) => any; 
    dontSeeInSource: (text) => any; 
    click: (locator, context) => any; 
    doubleClick: (locator, context) => any; 
    moveCursorTo: (locator, offsetX, offsetY) => any; 
    executeScript: (fn) => any; 
    executeAsyncScript: (fn) => any; 
    resizeWindow: (width, height) => any; 
    checkOption: (field, context) => any; 
    fillField: (field, value) => any; 
    clearField: (field) => any; 
    appendField: (field, value) => any; 
    seeInField: (field, value) => any; 
    dontSeeInField: (field, value) => any; 
    pressKey: (key) => any; 
    seeCheckboxIsChecked: (field) => any; 
    dontSeeCheckboxIsChecked: (field) => any; 
    attachFile: (locator, pathToFile) => any; 
    grabTextFrom: (locator) => any; 
    grabValueFrom: (locator) => any; 
    grabAttributeFrom: (locator, attr) => any; 
    selectOption: (select, option) => any; 
    setCookie: (cookie) => any; 
    seeCookie: (name) => any; 
    dontSeeCookie: (name) => any; 
    grabCookie: (name) => any; 
    clearCookie: (cookie) => any; 
    wait: (sec) => any; 
    waitForText: (text, sec, context) => any; 
    waitForVisible: (locator, sec) => any; 
    waitForElement: (locator, sec) => any; 
    saveScreenshot: (fileName) => any; 
    scrollTo: (locator, offsetX, offsetY) => any; 
    debug: (msg) => any; 
    debugSection: (section, msg) => any; 
    say: (msg) => any; 

  }
}

declare module "codeceptjs" {
    export = CodeceptJS;
}
