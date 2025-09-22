import { useParams } from 'react-router-dom';

export function useTenant() {
  const { tenant } = useParams<{ tenant: string }>();
  return tenant;
}









