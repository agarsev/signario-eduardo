all:
	echo "build o frontend"

build: frontend
	@mkdir -p dist
	electron-builder -l -w

frontend:
	@mkdir -p dist
	parcel build --no-autoinstall --no-content-hash --no-cache

clean:
	rm -rf dist

.PHONY: all build frontend clean
