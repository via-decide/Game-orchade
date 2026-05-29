const DEFAULT_GOOGLE_SCOPES = "profile email";

export function getGoogleClientId(config = globalThis.ZAYVORA_CONFIG ?? {}) {
  return config.googleClientId ?? config.GOOGLE_CLIENT_ID ?? null;
}

export function signInWithGoogle(options = {}) {
  const googleApi = globalThis.google?.accounts?.oauth2;
  const clientId = options.clientId ?? getGoogleClientId(options.config);
  const scope = options.scope ?? DEFAULT_GOOGLE_SCOPES;

  if (!clientId)
    return Promise.reject(new Error("Missing Google Client ID config"));
  if (!googleApi?.initTokenClient)
    return Promise.reject(new Error("Google Identity Services unavailable"));

  return new Promise((resolve, reject) => {
    const client = googleApi.initTokenClient({
      client_id: clientId,
      scope,
      error_callback: (error) =>
        reject(
          error instanceof Error
            ? error
            : new Error(error?.message ?? "Google authorization rejected"),
        ),
      callback: (response) => {
        if (response?.error)
          return reject(
            new Error(response.error_description ?? response.error),
          );
        if (!response?.access_token)
          return reject(new Error("Google auth response missing access token"));
        resolve({
          accessToken: response.access_token,
          scope: response.scope ?? scope,
          expiresIn: response.expires_in ?? null,
        });
      },
    });
    client.requestAccessToken({ prompt: options.prompt ?? "select_account" });
  });
}
