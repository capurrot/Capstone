import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../../redux/actions";

const ListUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <p>Caricamento utenti...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div>
      <h1>Lista Utenti</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username || user.email || JSON.stringify(user)}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsers;
