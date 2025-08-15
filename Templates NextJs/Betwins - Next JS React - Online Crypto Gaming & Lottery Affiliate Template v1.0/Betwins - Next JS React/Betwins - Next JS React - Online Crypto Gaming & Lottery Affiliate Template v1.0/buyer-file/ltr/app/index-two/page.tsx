import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Header from "@/components/layout/header/Header";
import CounterSection from "@/components/containers/CounterSection";
import WorkSection from "@/components/containers/WorkSection";
import CryptoPlatform from "@/components/containers/CryptoPlatform";
import RecentChampions from "@/components/containers/games/RecentChampions";
import StorySection from "@/components/containers/StorySection";
import ReferSection from "@/components/containers/ReferSection";
import BlogSectionTwo from "@/components/containers/blog/BlogSectionTwo";
import Footer from "@/components/layout/footer/Footer";

const HeroSectionTwo = dynamic(
	() => import("@/components/layout/banner/HeroSectionTwo")
);

const GameSectionThree = dynamic(
	() => import("@/components/containers/games/GameSectionThree")
);

const DiscoverSection = dynamic(
	() => import("@/components/containers/DiscoverSection")
);

const ClientWrapper = dynamic(
	() => import("@/components/widgets/ClientWrapper")
);

export const generateMetadata = async (): Promise<Metadata> => ({
	title: "Home | Betwins - Online Crypto Gaming",
	description:
		"Welcome to Betwins - the ultimate crypto gaming & lottery experience.",
	keywords: ["crypto gaming", "lottery", "betwins", "casino", "blockchain"],
	openGraph: {
		title: "Betwins - Crypto Gaming & Lottery",
		description: "Experience seamless blockchain - based gaming and lotteries.",
		url: "https://betwins.netlify.app/",
		siteName: "Betwins",
		images: [
			{
				url: "/images/og-image.png",
				width: 1200,
				height: 630,
				alt: "Betwins Crypto Gaming",
			},
		],
		type: "website",
	},
	twitter: { card: "summary_large_image" },
});

const page = () => {
	return (
		<div className="page-wrapper a-cursor">
			<Header />
			<HeroSectionTwo />
			<GameSectionThree />
			<DiscoverSection />
			<CounterSection />
			<WorkSection />
			<CryptoPlatform />
			<RecentChampions />
			<StorySection layout="two" />
			<ReferSection layout="two" />
			<BlogSectionTwo />
			<Footer />
			<ClientWrapper />
		</div>
	);
};

export default page;
