export const PARTUNO_FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvgagrn";

type Fetcher = (
  input: string,
  init?: RequestInit,
) => Promise<Pick<Response, "ok">>;

export async function submitPartunoWaitlist(
  email: string,
  fetcher: Fetcher = fetch,
): Promise<void> {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    throw new Error("Enter a valid email address.");
  }

  const body = new URLSearchParams({
    email: normalizedEmail,
    _subject: "New Partuno early-access signup",
  });

  const response = await fetcher(PARTUNO_FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Unable to join the waitlist.");
  }
}
