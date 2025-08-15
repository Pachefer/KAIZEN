import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import LotteryData from "@/public/data/lottery-data";
import leftThumb from "@/public/images/left-th.png";
import chart from "@/public/images/chart.png";

const LotterySectionClient = dynamic(
	() => import("@/components/widgets/LotterySectionClient")
);

const LotterySection = () => {
	return (
		<section className="lt-type pt-120 pb-120">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="lt-type__filter mb-40">
							<div className="filter-group">
								<select className="country-select select" defaultValue="">
									<option value="" disabled hidden>
										Start Date
									</option>
									<option value="jan">22/02/25</option>
									<option value="feb">19/03/25</option>
									<option value="mar">05/12/25</option>
								</select>

								<select className="country-select select" defaultValue="">
									<option value="" disabled hidden>
										End Date
									</option>
									<option value="jan">22/02/25</option>
									<option value="feb">19/03/25</option>
									<option value="mar">05/12/25</option>
								</select>

								<select className="categories-select select" defaultValue="">
									<option value="" disabled hidden>
										Categories
									</option>
									<option value="car">Car</option>
									<option value="bike">Bike</option>
									<option value="laptop">Laptop</option>
									<option value="watch">Watch</option>
								</select>

								<select className="currency-select select" defaultValue="">
									<option value="" disabled hidden>
										Currency
									</option>
									<option value="btc">BTC</option>
									<option value="eth">ETH</option>
									<option value="doge">DOGE</option>
								</select>

								<select className="country-select select" defaultValue="">
									<option value="" disabled hidden>
										Country
									</option>
									<option value="french">France</option>
									<option value="italian">Italy</option>
									<option value="canada">Canada</option>
								</select>
							</div>

							<div className="cta">
								<button className="btn--primary" title="search here">
									Search Here
								</button>
							</div>
						</div>
					</div>
				</div>

				<LotterySectionClient data={LotteryData} />

				<div className="row">
					<div className="col-12">
						<div
							className="pagination-wrapper mt-40"
							data-aos="fade-up"
							data-aos-duration="600"
							data-aos-delay="100"
						>
							<ul className="pagination">
								<li>
									<button>
										<i className="ti ti-chevron-left"></i>
									</button>
								</li>
								<li>
									<Link href="lottery">1</Link>
								</li>
								<li>
									<Link href="lottery" className="active">
										2
									</Link>
								</li>
								<li>
									<Link href="lottery">3</Link>
								</li>
								<li>
									<button>
										<i className="ti ti-chevron-right"></i>
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="left-thumb-th">
				<Image src={leftThumb} alt="Image" />
			</div>
			<div className="chart">
				<Image src={chart} alt="Image" />
			</div>
		</section>
	);
};

export default LotterySection;
