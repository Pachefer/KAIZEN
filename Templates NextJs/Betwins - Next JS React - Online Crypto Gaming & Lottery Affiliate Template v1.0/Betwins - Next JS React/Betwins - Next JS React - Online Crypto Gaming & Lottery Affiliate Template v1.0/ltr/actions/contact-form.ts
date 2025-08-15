"use server";

export async function submitContactForm(formData: FormData) {
	const fullName = formData.get("full-name");
	const email = formData.get("c-email");
	const phone = formData.get("phone-number");
	const message = formData.get("contact-message");

	console.log("Contact Form Submission:", {
		fullName,
		email,
		phone,
		message,
	});
}
