import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const HeaderThree = () => {
	return (
		<header className="header-alter">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="main-header__menu-box">
							<nav className="navbar p-0">
								<div className="navbar-logo">
									<Link href="/">
										<Image src={logo} alt="Image" />
									</Link>
								</div>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default HeaderThree;
