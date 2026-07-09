import { useState } from "react";
import { userApi } from "../api";

interface User {
  id: string;
  username: string;
  balance: number;
  isBanned: boolean;
}

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername) return;

    setLoading(true);
    setError(null);

    try {
      const allUsers = await userApi.getAll();

      const existingUser = allUsers.find(
        (u) => u.username.toLowerCase() === cleanUsername.toLowerCase(),
      );
      if (existingUser) {
        onAuthSuccess(existingUser);
      } else {
        const newUser = await userApi.create({ username: cleanUsername });
        alert(`Пользователь @${cleanUsername} успешно зарегистрирован`);
        onAuthSuccess(newUser);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ошибка при связи с сервером Render.");
    } finally {
      setLoading(false);
    }
  };
  return <></>;
}
