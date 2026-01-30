import { redirect } from 'next/navigation';

export default function UserDefaultPage() {
  redirect('/tai-khoan/ban-lam-viec');
  return null; // Should not be reached
}
