/** @type {import('next').NextConfig} */

const buildRedirect = (source, destination, permanent = true) => {
	return {
		source,
		destination,
		permanent
	};
};

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
	},
	async redirects() {
		return [buildRedirect('/', '/vegetables')];
	}
};
