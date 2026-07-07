.PHONY: dev test lint build

dev:
	pnpm exec concurrently -c "bgBlue.bold,bgGreen.bold" "pnpm --filter backend dev" "pnpm --filter frontend dev"

test:
	pnpm -r test

lint:
	pnpm -r lint

build:
	pnpm -r build
