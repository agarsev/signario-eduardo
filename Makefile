all:
	echo "build o frontend"

build: frontend
	@mkdir -p dist
	electron-builder -l -w

frontend:
	@mkdir -p dist
	NODE_ENV=development parcel build \
			 --no-autoinstall --no-content-hash --no-cache \
			 --no-optimize

clean:
	rm -rf dist

.PHONY: all build frontend clean
