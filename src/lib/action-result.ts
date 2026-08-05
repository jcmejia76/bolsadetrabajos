export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export function actionOk<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function actionError<T>(error: string): ActionResult<T> {
  return { success: false, error };
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado";
}
