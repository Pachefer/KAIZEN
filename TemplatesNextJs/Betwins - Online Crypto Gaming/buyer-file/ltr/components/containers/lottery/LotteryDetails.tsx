import dynamic from "next/dynamic";
import Image from "next/image";
import one from "@/public/images/right-wheel.png";
import two from "@/public/images/left-wheel.png";
const LotteryPick = dynamic(() => import("./LotteryPick"));

const LotteryDetails = () => {
	return (
		<section
			className="lottery-details lottery-alternate lottery pt-120 pb-120"
			style={{ backgroundImage: "url(images/lottery-bg.png)" }}
		>
			<div className="container">
				<div
					className="row gutter-20 justify-content-center mb-55 rtl-header"
					data-aos="fade-up"
					data-aos-duration="600"
				>
					<div className="col-12 col-lg-7 col-xl-8 col-xxl-6">
						<div className="section__content text-center">
							<span className="fw-6 secondary-text text-xl">
								<strong>Pick,</strong> Lucky Numbers
							</span>
							<h2 className="title-animation fw-6 mt-25">
								Pick Your Winning Numbers
							</h2>
						</div>
					</div>
				</div>
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

export default LotteryDetails;
