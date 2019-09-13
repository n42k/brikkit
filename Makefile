default: executable
	cp brikkit.conf.default build/brikkit.conf

debug: executable
	cp brikkit.conf build/brikkit.conf
	cp -rf brickadia build/; exit 0
	
executable:
	rm -rf build
	echo 'You may ignore the below 2 warnings regarding dynamic requires'
	pkg server.js --output build/brikkit
	echo 'You may ignore the above 2 warnings regarding dynamic requires'
	cp LICENSE forever.sh build/
	mkdir -p build/plugins
	mkdir -p build/conf
	mkdir -p build/saved
	mkdir -p build/logs
