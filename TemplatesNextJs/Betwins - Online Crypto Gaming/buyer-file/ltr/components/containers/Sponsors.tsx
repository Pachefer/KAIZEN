"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import SponsorData from "@/public/data/sponsor-data";

const Sponsors = () => {
	return (
		<div className="sponsor pt-80 pb-80 tertiary-bg">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sponsor__inner text-center">
							<h6 className="neutral-top fw-6">
								{" "}
								Trusted By Over <span className="secondary-text">
									12,500
								</span>{" "}
								Best Partner
							</h6>
							<div className="sponsor__slider mt-35">
								<Swiper
									loop={true}
									speed={1000}
									slidesPerView={1}
									slidesPerGroup={1}
									spaceBetween={24}
									freeMode={true}
									centeredSlides={true}
									modules={[Autoplay]}
									autoplay={{
										delay: 2000,
										disableOnInteraction: false,
										pauseOnMouseEnter: true,
									}}
									breakpoints={{
										420: {
											slidesPerView: 2,
										},
										576: {
											slidesPerView: 3,
										},
										992: {
											slidesPerView: 5,
										},
										1400: {
											slidesPerView: 7,
										},
									}}
								>
									{SponsorData.map((item) => {
										return (
											<SwiperSlide key={item.id}>
												<div className="sponsor__slider-single text-center">
													<Image src={item.image} alt={item.alt} />
												</div>
											</SwiperSlide>
										);
									})}
								</Swiper>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sponsors;
