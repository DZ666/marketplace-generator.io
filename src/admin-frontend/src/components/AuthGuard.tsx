import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/login');
    }
  }, [authenticated, loading, router]);

  // Отображаем индикатор загрузки или ничего, пока проверяем статус аутентификации
  if (loading || !authenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        {loading ? 'Loading...' : null}
      </div>
    );
  }

  // Если пользователь аутентифицирован, отображаем дочерние компоненты
  return <>{children}</>;
};

export default AuthGuard; 