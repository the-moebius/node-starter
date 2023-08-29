
export interface WaitController extends Promise<void> {
  stop: () => void;
}


/**
 * Cancelable waiting function.
 */
export function wait(duration: number): WaitController {

  let timer: NodeJS.Timeout;
  let finish: () => void;

  const controller: WaitController = <WaitController> new Promise(
    resolve => {
      finish = resolve;
      timer = setTimeout(finish, duration);
    }
  );

  controller.stop = () => {
    clearTimeout(timer);
    finish();
  };

  return controller;

}
