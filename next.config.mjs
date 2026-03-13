/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    reactCompiler: true,
    async redirects() {
        return [
            {
                source: '/articles/hft-system',
                destination: '/assets/EECS_159B_HFT_Report.pdf',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
