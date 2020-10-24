/*jslint
  browser: false, node: true, devel: true, node: true */
/*global
  doConfirm, phantom */
/* eslint-env node */
/* eslint-disable no-alert, no-console */
"use strict";
var system = require('system');



function usage() {
    console.log("Usage: phantomjs " + system.args[0] + "json cfg");
}

function getArgs() {

  if (system.args.length < 2 || system.args[1] === "-h" || system.args[1] === "--help") {
    usage();
    phantom.exit();
  }

  return JSON.parse(system.args.slice(1));
}

function takeShot(page, evalCode, outFile) {

  console.log("INFO: trying to evaluate : " + evalCode);

  if (evalCode && evalCode.length > 0) {
    var evalResult;

    try {
      var evalFx = new Function(evalCode);
      evalResult = page.evaluate(evalFx);
      console.log("INFO: eval result: " + evalResult);
    } catch (e) {
      console.error("ERROR: failed to evaluate: " + e);
      return;
    }
  }
  page.render(outFile);
  console.log("Screenshot done");
  phantom.exit();
}

function getWebsite(cfg) {
  var page = require('webpage').create();

  console.log(JSON.stringify(cfg));

  //viewportSize being the actual size of the headless browser
  page.viewportSize = {width: cfg.viewSize[0],
                       height: cfg.viewSize[1]};
  //the clipRect is the portion of the page you are taking a screenshot of
  page.clipRect = {top: cfg.topLeft[0],
                   left: cfg.topLeft[1],
                   width: cfg.size[0],
                   height: cfg.size[1]};


  page.onResourceRequested = function (request) {
    //console.log('Request ' + JSON.stringify(request, undefined, 4));
    console.log("+++ ask " + request.url);
  };

  page.onResourceReceived = function (response) {
    //console.log('Receive ' + JSON.stringify(response, undefined, 4));
    console.log("--- rx " + response.url);
  };

  page.onLoadFinished = function () {
    console.log("page Load Finished");
    console.log("setting timeout to " + cfg.waitTime);
    setTimeout(takeShot, cfg.waitTime, page, cfg.evalCode, cfg.outFile);
  };

  page.open(cfg.url, function (status) {
    if (status !== "success") {
      console.log(">>> page open FAILED!");
      phantom.exit();
    }
  });

}


function main() {
  var jsonCfg = getArgs();

  getWebsite(jsonCfg);
}

main();

// will exit by callback call...
