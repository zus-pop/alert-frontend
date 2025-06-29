'use client';

import SystemUserForm from '../components/SystemUserForm';

export default function EditSystemUserPage({ params }: { params: { id: string } }) {
  return <SystemUserForm userId={params.id} />;
}
