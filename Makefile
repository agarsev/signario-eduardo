all:
	echo "build o frontend"

build:
	@mkdir -p dist
	NODE_ENV=production parcel build --no-autoinstall 
	electron-builder -l -w

frontend:
	@mkdir -p dist
	NODE_ENV=development parcel build \
			 --no-autoinstall --no-content-hash --no-cache \
			 --no-optimize

clean:
	rm -rf dist

.PHONY: all build frontend clean
