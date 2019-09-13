default: executable
	cp brikkit.conf.default build/brikkit.conf

debug: executable
	cp brikkit.conf build/brikkit.conf
	
executable:
	rm -rf build
	echo 'You may ignore the below 2 warnings regarding dynamic requires'
	pkg server.js --output build/brikkit
	echo 'You may ignore the above 2 warnings regarding dynamic requires'
	cp LICENSE build/LICENSE
	mkdir -p build/plugins
	mkdir -p build/conf
	mkdir -p build/saved
