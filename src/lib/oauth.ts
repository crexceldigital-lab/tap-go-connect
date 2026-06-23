const STATE_KEY_PREFIX = "tapngo_oauth_state_";

/** Generates a random CSRF state value and stashes it for verification when the provider redirects back. */
export const createOAuthState = (provider: string): string => {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY_PREFIX + provider, state);
  return state;
};

/** Verifies the state returned by the provider matches what we generated, then clears it (single use). */
export const verifyOAuthState = (provider: string, returnedState: string | null): boolean => {
  const expected = sessionStorage.getItem(STATE_KEY_PREFIX + provider);
  sessionStorage.removeItem(STATE_KEY_PREFIX + provider);
  return !!expected && !!returnedState && expected === returnedState;
};

/**
 * Salesforce OAuth 2.0 — standard authorization-code flow.
 * Requires a Connected App in Salesforce (Setup → App Manager → New Connected App)
 * with this exact callback URL added to "Callback URL".
 */
export const SALESFORCE_REDIRECT_PATH = "/integrations/salesforce/callback";

export const buildSalesforceAuthorizeUrl = (clientId: string): string => {
  const state = createOAuthState("salesforce");
  const redirectUri = `${window.location.origin}${SALESFORCE_REDIRECT_PATH}`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "api refresh_token offline_access",
    state,
  });
  return `https://login.salesforce.com/services/oauth2/authorize?${params.toString()}`;
};

/**
 * Zoho CRM OAuth 2.0 — standard authorization-code flow.
 * Requires a Server-based Application in the Zoho API Console with this
 * exact redirect URI registered.
 */
export const ZOHO_REDIRECT_PATH = "/integrations/zoho/callback";

export const buildZohoAuthorizeUrl = (clientId: string): string => {
  const state = createOAuthState("zoho");
  const redirectUri = `${window.location.origin}${ZOHO_REDIRECT_PATH}`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "ZohoCRM.modules.leads.ALL",
    access_type: "offline", // required to receive a refresh_token
    prompt: "consent", // forces the consent screen so a refresh_token is reliably issued even on repeat connects
    state,
  });
  return `https://accounts.zoho.com/oauth/v2/auth?${params.toString()}`;
};
