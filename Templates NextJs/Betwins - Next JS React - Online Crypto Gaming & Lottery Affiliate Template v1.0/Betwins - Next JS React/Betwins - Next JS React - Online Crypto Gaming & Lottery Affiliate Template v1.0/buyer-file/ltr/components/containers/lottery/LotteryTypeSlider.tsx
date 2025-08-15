"use client";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import "swiper/swiper-bundle.css";
import LotteryTypeData from "@/public/data/lottery-type-data";

const LotteryTypeSlider = () => {
	return (
		<div className="row">
			<div className="col-12">
				<div className="lottery__type-wrapper mb-25">
					<div className="lottery__type-slider swiper">
						<Swiper
							modules={[Navigation, Autoplay, FreeMode]}
							loop={true}
							speed={1000}
							slidesPerView={1}
							slidesPerGroup={1}
							spaceBetween={24}
							freeMode={true}
							centeredSlides={true}
							autoplay={{
								delay: 2000,
								disableOnInteraction: false,
								pauseOnMouseEnter: true,
							}}
							navigation={{
								nextEl: ".next-lottery",
								prevEl: ".prev-lottery",
							}}
							breakpoints={{
								576: {
									slidesPerView: 2,
								},
								992: {
									slidesPerView: 3,
								},
							}}
						>
							{LotteryTypeData.map((lottery) => (
								<SwiperSlide key={lottery.id}>
									<div className="lottery__type lt-type-two">
										<div className="thumb">
											<Image src={lottery.image} alt={lottery.title} />
										</div>
										<div className="content">
											<h6 className="fw-6">
												<Link href="/lottery-details">{lottery.title}</Link>
											</h6>
											<p className="mt-16 text-lg">
												<i className="ti ti-wallet"></i>
												{lottery.price}
											</p>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
					<div className="slider-navigation">
						<button
							type="button"
							aria-label="prev slide"
							title="prev slide"
							className="prev-lottery slider-btn"
						>
							<i className="fa-solid fa-angle-left"></i>
						</button>
						<button
							type="button"
							aria-label="next slide"
							title="next slide"
							className="next-lottery slider-btn"
						>
							<i className="fa-solid fa-angle-right"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LotteryTypeSlider;
