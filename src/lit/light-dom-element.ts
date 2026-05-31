import { LitElement } from "lit";

/** Lit base class that renders into light DOM so global app styles apply. */
export abstract class LightDomElement extends LitElement {
  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }
}
