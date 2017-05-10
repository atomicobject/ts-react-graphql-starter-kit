/// <reference path="./steps.d.ts" />

Feature('Home page');

Scenario('basic connectivity and rendering', (I) => {
  I.amOnPage("/")
  I.see("Home")
});