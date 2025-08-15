import dynamic from "next/dynamic";
import Image from "next/image";
import one from "@/public/images/chart.png";
import two from "@/public/images/btc-two.png";
import three from "@/public/images/rocket.png";
import four from "@/public/images/left-th.png";

const RecentChampionTab = dynamic(
	() => import("@/components/widgets/RecentChampionTab")
);

const RecentChampions = () => {
	return (
		<section
			className="ch-list ch-list-alternate ch-fcq pt-120 pb-120"
			style={{ backgroundImage: "url(images/game-bg.png)" }}
		>
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-12 col-xl-10">
						<div
							className="section__header text-center mb-55"
							data-aos="fade-up"
							data-aos-duration="600"
						>
							<span className="fw-6 secondary-text text-xl">
								<strong>Latest,</strong> Betting Winners
							</span>
							<h2 className="title-animation fw-6 mt-25">
								Recent Champions in Action
							</h2>
							<p className="mt-25">
								We celebrate every win, no matter how big or small. Our platform
								is buzzing with excitement as players hit jackpots and score
								massive crypto payouts daily.
							</p>
						</div>
					</div>
				</div>
				<RecentChampionTab />
			</div>

			<div className="chart">
				<Image src={one} alt="Chart" />
			</div>
			<div className="btc">
				<Image src={two} alt="BTC" />
			</div>
			<div className="rocket">
				<Image src={three} alt="Rocket" />
			</div>
			<div className="left-thumb">
				<Image src={four} alt="Thumb" />
			</div>
		</section>
	);
};

export default RecentChampions;
