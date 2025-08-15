"use server";

export async function loginUser(formData: FormData) {
	const email = formData.get("auth-email");
	const password = formData.get("auth-password");

	console.log("Login Submitted:", { email, password });
}
