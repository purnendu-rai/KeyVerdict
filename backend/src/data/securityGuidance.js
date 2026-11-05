export const securityTips = Object.freeze([
  Object.freeze({ id: 'passphrases', title: 'Prefer memorable passphrases', category: 'Foundations', description: 'Length creates room for unpredictability without making a secret impossible to remember.', practice: 'Combine several unrelated words and avoid famous quotes or personal details.' }),
  Object.freeze({ id: 'unique-secrets', title: 'Use a different secret everywhere', category: 'Account hygiene', description: 'A breach at one service should not unlock another service.', practice: 'Use a password manager to create and remember unique credentials.' }),
  Object.freeze({ id: 'mfa', title: 'Add another factor', category: 'Resilience', description: 'Multi-factor authentication gives an attacker another barrier to overcome.', practice: 'Prefer passkeys or authenticator apps over SMS when a service supports them.' }),
  Object.freeze({ id: 'phishing', title: 'Pause before signing in', category: 'Awareness', description: 'A familiar-looking page can still be a credential-harvesting trap.', practice: 'Open the service from a saved bookmark instead of a surprise message link.' }),
]);

export const threats = Object.freeze([
  Object.freeze({ id: 'brute-force', name: 'Brute-force attack', description: 'An attacker tries many possible combinations until one works.', defense: 'Use long, unique secrets and enable rate limits or multi-factor authentication.' }),
  Object.freeze({ id: 'dictionary', name: 'Dictionary attack', description: 'Common words, leaked passwords, and predictable substitutions are tested first.', defense: 'Avoid common phrases, names, seasons, and predictable number or symbol swaps.' }),
  Object.freeze({ id: 'credential-stuffing', name: 'Credential stuffing', description: 'Previously leaked username and password pairs are replayed on other services.', defense: 'Never reuse a password and use breach alerts from a trusted password manager.' }),
  Object.freeze({ id: 'password-spraying', name: 'Password spraying', description: 'A few common passwords are tried against many accounts to avoid lockouts.', defense: 'Block weak passwords, monitor unusual sign-ins, and require stronger authentication.' }),
  Object.freeze({ id: 'phishing-threat', name: 'Phishing', description: 'A deceptive message or page persuades someone to disclose a secret directly.', defense: 'Verify the domain, resist urgency, and use passkeys where possible.' }),
]);
