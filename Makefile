NODE_BIN ?= ./node_modules/.bin

TESTS ?=

check: lint test

lint: deps
	$(NODE_BIN)/biome ci

format: deps
	$(NODE_BIN)/biome check --fix

test: deps
	node --test $(TEST_OPTS)

test-cov: TEST_OPTS += --experimental-test-coverage
test-cov: test

.PHONY: check format lint test test-cov

%/node_modules: %/package.json %/pnpm-lock.yaml
	pnpm -C $(@D) install --frozen-lockfile --silent
	touch $@

deps: $(CURDIR)/node_modules

distclean:
	rm -rf $(CURDIR)/node_modules

.PHONY: distclean deps
