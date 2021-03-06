PACKAGE_NAME = whalesong-js

help:
	@echo "Options"
	@echo "-----------------------------------------------------------------------"
	@echo "help:                     This help"
	@echo "requirements:             Download requirements"
	@echo "build:                    Build application"
	@echo "publish:                  Publish new version on Pypi"
	@echo "clean:                    Clean compiled files"
	@echo "-----------------------------------------------------------------------"

whalesong-requirements:
	cd whalesong && npm install

scriptlet-requirements:
	cd js-scriptlet && $(MAKE) requirements

requirements:
	@echo "Installing ${PACKAGE_NAME} requirements"
	$(MAKE) scriptlet-requirements
	$(MAKE) whalesong-requirements

whalesong-build:
	cd whalesong && npm run build

scriptlet-build:
	cd js-scriptlet && $(MAKE) build

build:
	@echo "Building ${PACKAGE_NAME}"
	$(MAKE) scriptlet-build
	$(MAKE) whalesong-build

publish:
	$(MAKE) clean
	$(MAKE) requirements
	$(MAKE) build
	cp ./README.md whalesong/
	cd whalesong && npm version patch
	npm publish ./whalesong/

clean:
	rm -f whalesong/whatsapp-output/*.js
	rm -rf whalesong/lib