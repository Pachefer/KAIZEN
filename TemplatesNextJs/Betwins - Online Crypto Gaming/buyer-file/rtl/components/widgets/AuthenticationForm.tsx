"use client";
import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/actions/auth";

const AuthenticationForm = () => {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<form action={loginUser}>
			<div className="input-wrapper mt-30">
				<label htmlFor="authEmail">Your Email</label>
				<div className="input-single">
					<input
						type="email"
						name="auth-email"
						id="authEmail"
						placeholder="Enter Email"
						required
					/>
					<i className="fa-solid fa-envelope"></i>
				</div>
			</div>

			<div className="input-wrapper mt-30 password-group">
				<label htmlFor="authPassword">Your Password</label>
				<div className="input-single">
					<input
						type={showPassword ? "text" : "password"}
						name="auth-password"
						id="authPassword"
						placeholder="Enter password"
						required
					/>
					<i
						className={`ti ${showPassword ? "ti-eye" : "ti-eye-off"} show-pass`}
						onClick={togglePasswordVisibility}
						style={{ cursor: "pointer" }}
						aria-label="Toggle password visibility"
					></i>
				</div>
			</div>

			<p className="text-end mt-16 forget-pass">
				<Link href="contact-us">Forget Password?</Link>
			</p>
			<p className="create-msg mt-20">
				Don&apos;t have an account? <Link href="sign-up">Sign Up</Link>
			</p>

			<div className="mt-40">
				<button
					type="submit"
					aria-label="submit message"
					title="submit message"
					className="btn--primary"
				>
					Sign In<i className="ti ti-arrow-narrow-right"></i>
				</button>
			</div>
		</form>
	);
};

export default AuthenticationForm;
