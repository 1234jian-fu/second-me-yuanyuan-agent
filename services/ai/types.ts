export type AiResponse<T> = {
  data: T;
  provider: string;
  model?: string;
};

export type AiEndpoint = {
  name: string;
  url: string;
  token?: string;
  provider: string;
  model?: string;
};
