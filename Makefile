default: executable
	cp brikkit.conf.default build/brikkit.conf
	mkdir -p build/plugins
	mkdir -p build/conf
	mkdir -p build/saved

debug: executable
	cp brikkit.conf build/brikkit.conf
	
executable:
	echo 'You may ignore the below 2 warnings regarding dynamic requires'
	pkg server.js --output build/brikkit
	cp LICENSE build/LICENSE
