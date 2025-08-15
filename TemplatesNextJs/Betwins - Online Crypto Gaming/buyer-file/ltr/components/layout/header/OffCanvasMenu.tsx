"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimateHeight from "react-animate-height";
import NavbarData from "@/public/data/navbar-data";
import logo from "@/public/images/logo.png";

interface OffCanvasMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

const OffCanvasMenu = ({ isOpen, onClose }: OffCanvasMenuProps) => {
	const [openDropdown, setOpenDropdown] = useState<number | null>(null);

	const handleDropdownToggle = (index: number) => {
		setOpenDropdown((prev) => (prev === index ? null : index));
	};

	const menuWrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isOpen && menuWrapperRef.current) {
			const fadeEls =
				menuWrapperRef.current.querySelectorAll<HTMLElement>(".nav-fade");

			fadeEls.forEach((el, i) => {
				const baseDelay = 1.75;
				const step = 0.25;
				const delay = baseDelay + i * step;
				el.style.animationDelay = `${delay}s`;
			});
		}
	}, [isOpen]);

	return (
		<>
			<div
				className={`mobile-menu d-block d-xl-none ${
					isOpen ? " show-menu" : " "
				}`}
			>
				<nav className="mobile-menu__wrapper" ref={menuWrapperRef}>
					<div className="mobile-menu__header nav-fade">
						<div className="logo">
							<Link href="/" aria-label="home page" title="logo">
								<Image src={logo} alt="Image" />
							</Link>
						</div>
						<button
							aria-label="close mobile menu"
							className="close-mobile-menu"
							onClick={onClose}
						>
							<i className="ti ti-x"></i>
						</button>
					</div>
					<div className="mobile-menu__list">
						<ul className="navbar__list">
							{NavbarData.map((item, index) => {
								if (item.submenu) {
									return (
										<li
											className="navbar__item navbar__item--has-children nav-fade"
											key={index}
										>
											<a
												aria-label="dropdown menu"
												className={`navbar__dropdown-label dropdown-label-alter ${
													openDropdown === index ? "navbar__item-active" : ""
												}`}
												onClick={() => handleDropdownToggle(index)}
											>
												{item.title}
											</a>
											<AnimateHeight
												duration={400}
												height={openDropdown === index ? "auto" : 0}
											>
												<ul className="navbar__sub-menu">
													{item.submenu.map((sub, i) => {
														return (
															<li key={i}>
																<Link href={sub.path}>{sub.title}</Link>
															</li>
														);
													})}
												</ul>
											</AnimateHeight>
										</li>
									);
								} else {
									return (
										<li className="navbar__item nav-fade" key={index}>
											<Link href={item.path}>{item.title}</Link>
										</li>
									);
								}
							})}
						</ul>
					</div>
					<div className="mobile-menu__cta nav-fade d-block d-md-none">
						<Link
							href="sign-up"
							aria-label="create account"
							title="create account"
							className="btn--primary"
						>
							Sign Up <i className="ti ti-arrow-narrow-right"></i>
						</Link>
					</div>
					<div className="mobile-menu__social social nav-fade">
						<Link
							href="https://www.facebook.com/"
							target="_blank"
							aria-label="share us on facebook"
							title="facebook"
						>
							<i className="fa-brands fa-facebook-f"></i>
						</Link>
						<Link
							href="https://instagram.com/"
							target="_blank"
							aria-label="share us on instagram"
							title="instagram"
						>
							<i className="fa-brands fa-instagram"></i>
						</Link>
						<Link
							href="https://x.com/"
							target="_blank"
							aria-label="share us on twitter"
							title="twitter"
						>
							<i className="fa-brands fa-twitter"></i>
						</Link>
						<Link
							href="https://www.linkedin.com/"
							target="_blank"
							aria-label="share us on linkedin"
							title="linkedin"
						>
							<i className="fa-brands fa-linkedin-in"></i>
						</Link>
					</div>
				</nav>
			</div>
			<div
				className={`mobile-menu__backdrop ${
					isOpen ? " mobile-menu__backdrop-active" : " "
				}`}
				onClick={onClose}
			></div>
		</>
	);
};

export default OffCanvasMenu;
