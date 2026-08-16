interface Env {
  RESEND_API_KEY: string;
}

type PagesFunction<E = Env> = (context: {
  request: Request;
  env: E;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
}) => Response | Promise<Response>;
