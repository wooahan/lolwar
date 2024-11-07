// File: pages/admin/player-management.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

const PlayerManagement = () => {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication for simplicity
  const authenticate = () => {
    if (password === 'adminpassword') { // Change 'adminpassword' to a secure password
      setIsAuthenticated(true);
    } else {
      alert('Invalid password!');
    }
  };

  // Handler to add or update player information
  const onSubmit = (data) => {
    if (data.id) {
      // Update player logic here
      setPlayers((prev) =>
        prev.map((player) => (player.id === data.id ? { ...player, ...data } : player))
      );
    } else {
      // Add new player logic here
      setPlayers((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    reset();
  };

  // Handler to delete player
  const deletePlayer = (id) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={authenticate}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Player Management</h1>
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('id')} type="hidden" />
        <div>
          <label>Nickname</label>
          <input {...register('nickname', { required: true })} placeholder="Nickname" />
        </div>
        <div>
          <label>Main Position</label>
          <input {...register('mainPosition', { required: true })} placeholder="Main Position" />
        </div>
        <div>
          <label>Secondary Position</label>
          <input {...register('secondaryPosition')} placeholder="Secondary Position" />
        </div>
        <button type="submit">Add/Update Player</button>
      </form>
      <div>
        <h2>Players List</h2>
        {players.length > 0 ? (
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                <p>{player.nickname}</p>
                <p>Main Position: {player.mainPosition}</p>
                <p>Secondary Position: {player.secondaryPosition}</p>
                <button onClick={() => reset(player)}>Edit</button>
                <button onClick={() => deletePlayer(player.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No players registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;
