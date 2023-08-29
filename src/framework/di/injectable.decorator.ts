
/**
 * An empty decorator is required for Reflection API to work.
 * Otherwise, the TypeDI won't be able to properly inject
 * constructor properties for services.
 */
export function Injectable() {

  return (_: unknown) => {};

}
