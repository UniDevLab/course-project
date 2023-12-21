export const ValidationRegExps = {
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uri: /^https:\/\/(?:www\.[\w-]+\.[a-z]+|[\w-]+\.wixsite\.com|[\w-]+\.editorx\.io)\/.*\/_functions\/.*$/,
};
