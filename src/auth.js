const DEFAULT_GOOGLE_SCOPES = "profile email";

export function getGoogleClientId(config = globalThis.ZAYVORA_CONFIG ?? {}) {
  return (
    config.googleClientId ??
    config.GOOGLE_CLIENT_ID ??
    config.google_client_id ??
    null
  );
}

export function signInWithGoogle(options = {}) {
  const googleAccounts = globalThis.google?.accounts;
  return config.googleClientId ?? config.GOOGLE_CLIENT_ID ?? null;
}

export function signInWithGoogle(options = {}) {
  const googleApi = globalThis.google?.accounts?.oauth2;
  const clientId = options.clientId ?? getGoogleClientId(options.config);
  const scope = options.scope ?? DEFAULT_GOOGLE_SCOPES;

  if (!clientId)
    return Promise.reject(new Error("Missing Google Client ID config"));
  if (!googleAccounts?.id && !googleAccounts?.oauth2?.initTokenClient)
    return Promise.reject(new Error("Google Identity Services unavailable"));

  if (options.mode === "authorization" || !googleAccounts.id) {
    if (!googleAccounts.oauth2?.initTokenClient)
      return Promise.reject(new Error("Google OAuth token client unavailable"));

    return new Promise((resolve, reject) => {
      const client = googleAccounts.oauth2.initTokenClient({
        client_id: clientId,
        scope,
        error_callback: (error) =>
          reject(new Error(error?.message ?? "Google authorization rejected")),
        callback: (response) => {
          if (response?.error)
            return reject(
              new Error(response.error_description ?? response.error),
            );
          if (!response?.access_token)
            return reject(
              new Error("Google auth response missing access token"),
            );
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

  return new Promise((resolve, reject) => {
    let settled = false;
    googleAccounts.id.initialize({
      client_id: clientId,
      auto_select: options.autoSelect ?? false,
      cancel_on_tap_outside: options.cancelOnTapOutside ?? true,
      ux_mode: options.uxMode ?? "popup",
      callback: (response) => {
        settled = true;
        if (!response?.credential)
          return reject(new Error("Google auth response missing credential"));
        resolve({
          credential: response.credential,
          idToken: response.credential,
          selectBy: response.select_by ?? null,
        });
      },
    });
    googleAccounts.id.prompt((notification) => {
      if (settled) return;
      if (
        notification?.isNotDisplayed?.() ||
        notification?.isSkippedMoment?.()
      ) {
        settled = true;
        reject(
          new Error(
            notification.getNotDisplayedReason?.() ??
              notification.getSkippedReason?.() ??
              "Google sign-in was not completed",
          ),
        );
      }
    });
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
