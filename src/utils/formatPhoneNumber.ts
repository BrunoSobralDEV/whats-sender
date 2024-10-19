export function formatPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '') + '@c.us';
}