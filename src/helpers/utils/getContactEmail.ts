export const getContactEmail = () => {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@example.com'
}
