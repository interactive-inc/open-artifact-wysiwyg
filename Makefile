# Update packages
update-packages:
	bunx --bun shadcn@latest add -a -o -y
	bunx npm-check-updates -u
	bun i
	rm src/components/ui/chart.tsx
	rm src/components/ui/resizable.tsx
	bun biome check . --fix --unsafe
