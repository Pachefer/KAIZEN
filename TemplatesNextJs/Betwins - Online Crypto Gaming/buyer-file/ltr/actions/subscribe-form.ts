"use server";

export async function subscribeUser(formData: FormData) {
	const email = formData.get("sub-email");

	console.log("New subscription:", email);
}
