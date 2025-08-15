import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import one from "@/public/images/right-wheel.png";
import two from "@/public/images/left-wheel.png";

const LotteryTypeSlider = dynamic(() => import("./LotteryTypeSlider"));
const LotteryPick = dynamic(() => import("./LotteryPick"));

const SelectLottery = () => {
	return (
		<section
			className="lottery-details lottery-alternate lottery pt-120 pb-120"
			style={{ backgroundImage: "url(images/lottery-bg.png)" }}
		>
			<div className="container">
				<div
					className="row gutter-20 align-items-center mb-55 rtl-header"
					data-aos="fade-up"
					data-aos-duration="600"
				>
					<div className="col-12 col-lg-7 col-xl-8 col-xxl-6">
						<div className="section__content">
							<span className="fw-6 secondary-text text-xl">
								<strong>Pick,</strong> Lucky Numbers
							</span>
							<h2 className="title-animation lcr fw-6 mt-25">
								Pick Your Winning Numbers
							</h2>
						</div>
					</div>
					<div className="col-12 col-lg-5 col-xl-4 col-xxl-4 offset-xxl-2">
						<div className="section__content-right">
							<p>
								Explore our featured games at Betwins, where every spin and
								every bet brings you closer to huge...
							</p>
							<div className="mt-25">
								<Link
									href="games"
									aria-label="explore all games"
									title="explore all games"
									className="btn--secondary"
								>
									Explore All Games <i className="ti ti-arrow-narrow-right"></i>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<LotteryTypeSlider />
				<LotteryPick />
			</div>
			<div className="left-thumb">
				<Image src={one} alt="Image" />
			</div>
			<div className="right-thumb">
				<Image src={two} alt="Image" />
			</div>
		</section>
	);
};

export default SelectLottery;
