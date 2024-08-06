/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
	distDir: 'build',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**'
			}
		]
	},
	typescript: {
		ignoreBuildErrors: true
	}
};
