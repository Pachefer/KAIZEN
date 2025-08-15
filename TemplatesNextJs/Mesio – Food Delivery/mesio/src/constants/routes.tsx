export const routes = {
  faq: '/faq', // This route is used to access the FAQ section
  home: '/home', // This route is used for the home page
  shop: '/shop', // This route is used for the shop page
  dish: '/dish', // This route is used to view a specific dish
  onboarding: '/', // This route is used for the onboarding process
  order: '/order', // This route is used to view the order page
  signIn: '/sign-in', // This route is used for the sign-in page
  reviews: '/reviews', // This route is used to view reviews for a dish or restaurant
  signUp: '/sign-up', // This route is used for the sign-up page
  profile: '/profile', // This route is used to view and edit the user's profile
  wishlist: '/wishlist', // This route is used to view the user's wishlist
  checkout: '/checkout', // This route is used to proceed to checkout
  cartEmpty: '/cart-empty', // This route is used when the cart is empty
  editProfile: '/edit-profile', // This route is used to edit the user's profile
  newPassword: '/new-password', // This route is used to set a new password
  shopCategory: '/shop-category', // This route is used to view dishes by category
  commentReply: '/comment-reply', // This route is used to reply to a comment
  orderHistory: '/order-history', // This route is used to view the order history
  myPromocodes: '/my-promocodes', // This route is used to view the user's promocodes
  notifications: '/notifications', // This route is used to view notifications
  leaveAReview: '/leave-a-review', // This route is used to leave a review for a dish or restaurant
  wishlistEmpty: '/wishlist-empty', // This route is used when the wishlist is empty
  accountCreated: '/account-created', // This route is used after account creation
  changePassword: '/change-password', // This route is used to change the user's password
  forgotPassword: '/forgot-password', // This route is used to initiate the forgot password process
  orderSuccessful: '/order-successful', // This route is used after a successful order
  confirmationCode: '/confirmation-code', // This route is used to confirm a code sent to the user
  myPromocodesEmpty: '/my-promocodes-empty', // This route is used when there are no promocodes available
  verifyYourPhoneNumber: '/verify-your-phone-number', // This route is used to verify the user's phone number
  forgotPasswordSentEmail: '/forgot-password-sent-email', // This route is used after sending a forgot password email
} as const;
