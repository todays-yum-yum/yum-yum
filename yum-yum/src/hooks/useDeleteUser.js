import { getAuth, deleteUser } from 'firebase/auth';
import { deleteAccount } from '../services/userApi';
import { useUserStore } from '../stores/useUserStore';

export default function useDeleteUser() {
  const auth = getAuth();

  const { reset } = useUserStore();

  const deleteUser = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteAccount(user);
      reset();
    } catch (err) {
      console.error('계정 삭제 실패:', err);
    }
  };

  return { deleteUser }
}
