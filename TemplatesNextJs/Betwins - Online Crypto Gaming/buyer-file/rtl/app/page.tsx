import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Header from "@/components/layout/header/Header";
import HeroSection from "@/components/layout/banner/HeroSection";
import FantasySection from "@/components/containers/FantasySection";
import SelectLottery from "@/components/containers/lottery/SelectLottery";
import AboutTwoSection from "@/components/containers/about/AboutTwoSection";
import LotteryItems from "@/components/containers/lottery/LotteryItems";
import WorkThreeSection from "@/components/containers/WorkThreeSection";
import TestimonialTwo from "@/components/containers/testimonial/TestimonialTwo";
import BlogSection from "@/components/containers/blog/BlogSection";
import Footer from "@/components/layout/footer/Footer";

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
		<div className="page-wrapper rtl a-cursor">
			<Header />
			<HeroSection />
			<FantasySection />
			<SelectLottery />
			<AboutTwoSection />
			<LotteryItems layout="two" showLotteryItems={false} />
			<WorkThreeSection />
			<TestimonialTwo />
			<BlogSection />
			<Footer />
			<ClientWrapper />
		</div>
	);
};

export default page;
