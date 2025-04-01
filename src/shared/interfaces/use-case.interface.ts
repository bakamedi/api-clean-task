export interface UseCase<Request, Response> {
  execute(request?: Request, userId?: string): Promise<Response>;
}
