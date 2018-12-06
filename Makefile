PACKAGE_NAME = whalesong-js

help:
	@echo "Options"
	@echo "-----------------------------------------------------------------------"
	@echo "help:                     This help"
	@echo "requirements:             Download requirements"
	@echo "publish:                  Publish new version on Pypi"
	@echo "clean:                    Clean compiled files"
	@echo "-----------------------------------------------------------------------"

whalesong-requirements:
	cd whalesong && npm install

scriptlet-requirements:
	cd js-scriptlet && $(MAKE) requirements

requirements:
	@echo "Installing ${PACKAGE_NAME} requirements"
	$(MAKE) whalesong-requirements
	$(MAKE) scriptlet-requirements

whalesong-build:
	cd whalesong && npm run build

scriptlet-build:
	cd js-scriptlet && $(MAKE) build

build:
	@echo "Building ${PACKAGE_NAME}"
	$(MAKE) whalesong-build
	$(MAKE) scriptlet-build

publish:
	$(MAKE) whalesong-requirements
	$(MAKE) whalesong-build
	cp ./README.md whalesong/
	npm publish ./whalesong

clean:
	rm -f whalesong/whatsapp-output/*.js
	rm -rf whalesong/distribution