import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/public/icons/css/all.min.css";
import "@/public/icons/css/tabler-icons.min.css";
import "@/public/scss/app.scss";

const chakraPetch = Chakra_Petch({
	variable: "--chakra",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://betwins.netlify.app"),

	title: {
		default: "Betwins | Online Crypto Gaming & Lottery",
		template: "%s | Betwins",
	},

	description:
		"Official Betwins crypto gaming & lottery template - powered by React & Next.js",
	keywords: ["crypto", "game", "casino", "betting", "affiliate"],

	authors: [
		{
			name: "wowtheme7",
			url: "https://themeforest.net/user/wowtheme7",
		},
	],

	icons: { icon: "/favicon.ico" },

	alternates: { canonical: "https://betwins.netlify.app/" },

	openGraph: {
		url: "https://betwins.netlify.app/",
		siteName: "Betwins",
		images: [
			{
				url: "/images/og-image.png",
				width: 1200,
				height: 630,
				alt: "Betwins Crypto Gaming Preview",
			},
		],
		type: "website",
	},

	twitter: {
		card: "summary_large_image",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${chakraPetch.variable}`}>{children}</body>
		</html>
	);
}
