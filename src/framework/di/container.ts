
import { Constructable, ContainerInstance } from 'typedi';


export class Container {

  #container = new ContainerInstance('container');


  set<Type = unknown>(
    constructable: Constructable<Type>,
    value?: Type

  ) {

    if (value === undefined) {
      this.#container.set({
        id: constructable,
        type: constructable,
      });

    } else {
      this.#container.set({
        id: constructable,
        value,
      });

    }

  }

  has(constructable: Constructable<unknown>): boolean {

    return this.#container.has(constructable);

  }

  get<Type = unknown>(
    constructable: Constructable<Type>

  ): Type {

    return this.#container.get(constructable);

  }

}
