#!/usr/bin/make -f
.PHONY: test

test:
	node test/node.js
	java -jar ./support/JsTestDriver-1.3.2.jar --tests all --reset
