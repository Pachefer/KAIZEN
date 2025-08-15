"use client";
import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/actions/create-account";

const RegisterForm = () => {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<form action={registerUser}>
			<div className="input-group-wrapper">
				<div className="input-wrapper">
					<label htmlFor="authFirstName">First Name</label>
					<div className="input-single">
						<input
							type="text"
							name="auth-first-name"
							id="authFirstName"
							placeholder="Devon"
							required
						/>
						<i className="fa-solid fa-user"></i>
					</div>
				</div>

				<div className="input-wrapper">
					<label htmlFor="authLastName">Last Name</label>
					<div className="input-single">
						<input
							type="text"
							name="auth-last-name"
							id="authLastName"
							placeholder="Lana"
							required
						/>
						<i className="fa-solid fa-user"></i>
					</div>
				</div>
			</div>

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

			<p className="create-msg mt-20">
				Have an account? <Link href="sign-in">Sign In</Link>
			</p>

			<div className="mt-40">
				<button
					type="submit"
					aria-label="submit message"
					title="submit message"
					className="btn--primary"
				>
					Sign Up<i className="ti ti-arrow-narrow-right"></i>
				</button>
			</div>
		</form>
	);
};

export default RegisterForm;
