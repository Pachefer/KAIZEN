import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import circle from "@/public/images/authentication/circle.png";
import thumb from "@/public/images/authentication/thumb.png";
import numbers from "@/public/images/authentication/numbers.png";

const AuthenticationForm = dynamic(
	() => import("../widgets/AuthenticationForm")
);

const AuthenticationSection = () => {
	return (
		<section className="authentication pt-120 pb-120">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-12 col-lg-6 col-xl-6">
						<div
							className="authentication__inner"
							data-aos="fade-right"
							data-aos-duration="600"
						>
							<div className="authentication__intro">
								<Link
									href="/"
									aria-label="back to home"
									title="back to home"
									className="btn--primary"
								>
									<i className="ti ti-arrow-narrow-left"></i>Back To Home
								</Link>
							</div>
							<div className="authentication__content mt-80">
								<h4 className="title-animation neutral-top fw-6 mb-10">
									Let&apos;s Get Started!
								</h4>
								<p>Sign in to your account and join us</p>
							</div>
							<div className="authentication__form mt-55">
								<AuthenticationForm />
							</div>
						</div>
					</div>

					<div className="col-12 col-lg-6 col-xl-5 offset-xl-1">
						<div
							className="authentication__thumb text-center d-none d-lg-block"
							style={{
								backgroundImage: "url(images/authentication/thumb-sm.png)",
							}}
						>
							<div className="circle-img">
								<Image src={circle} alt="Image" />
							</div>
							<div className="thumb">
								<Image
									src={thumb}
									alt="Image"
									data-aos="zoom-in"
									data-aos-duration="600"
								/>
							</div>
							<div className="number-img">
								<Image src={numbers} alt="Image" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AuthenticationSection;
