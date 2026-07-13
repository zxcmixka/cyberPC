const ADMIN_SECRET_KEY = "paho_zxc_admin_secret_key_fortnite_balls_l21kn312kh";

interface TopUpResponse {
  message?: string;
  newBalance?: number;
}

/**
 * Пополнение баланса пользователя
 * @param serverUrl
 * @param userId
 * @param amount - Сумма пополнения
 */
export async function topUpUserBalance(
  serverUrl: string,
  userId: string,
  amount: number,
): Promise<TopUpResponse> {
  if (amount <= 0) {
    throw new Error("Сумма пополнения должна быть больше нуля");
  }

  const response = await fetch(`${serverUrl}/api/users/${userId}/topup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_SECRET_KEY}`,
    },
    body: JSON.stringify({ amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не удалось пополнить баланс");
  }

  return data;
}

/**
 * Бан пользователя
 * @param serverUrl
 * @param userId
 */
export async function banUser(
  serverUrl: string,
  userId: string,
): Promise<{ message: string }> {
  const response = await fetch(`${serverUrl}/api/users/${userId}/ban`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ADMIN_SECRET_KEY}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Не удалось забанить пользователя");
  }

  return data;
}
