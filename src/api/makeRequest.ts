import { auth } from "@clerk/nextjs/server";

export async function makeRequest<TResponse>(url: string): Promise<TResponse> {
  const { getToken } = auth();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to make a request to ${url}`, {
      cause: await response.text(),
    });
  }

  return await response.json();
}
