/**
 * @jest-environment jsdom
 */

import { describe, expect, it } from "@jest/globals";
import { getNodeByKey, getNodeFromPath, getNodeKey, getNodePath } from "../src/xpath";

const html = `
  <!doctype html>
  <html>
    <body>
      <div>
        <p>Hello World</p>
      </div>
      <!-- comment -->
    </body>
  </html>
`;

const document = new DOMParser().parseFromString(html, "text/html");

describe("getNodeFromPath", () => {
  it("should return undefined for invalid path", () => {
    expect(getNodeFromPath("/invalid/path", document)).toBeUndefined();
  });

  it("should return correct node for valid path", () => {
    const node = getNodeFromPath("/html/body/div/p", document);
    expect(node!.textContent).toBe("Hello World");
  });

  it('should return document node for "/" path', () => {
    const node = getNodeFromPath("/", document);
    expect(node).toBe(document);
  });
});

describe("getNodeKey", () => {
  it("should return correct key for element node", () => {
    const node = document.querySelector("p")!;
    const key = getNodeKey(node);
    expect(key).toBe("p[1]");
  });

  it("should return correct key for text node", () => {
    const node = document.querySelector("p")!.firstChild!;
    const key = getNodeKey(node);
    expect(key).toBe("text()[1]");
  });

  it("should return correct key for comment node", () => {
    const node = document.querySelector("body")!.childNodes[3];
    const key = getNodeKey(node);
    expect(key).toBe("comment()[1]");
  });
});

describe("getNodeByKey", () => {
  it("should return undefined for invalid key", () => {
    const node = getNodeByKey("invalid", document);
    expect(node).toBeUndefined();
  });

  it("should return correct node for valid key", () => {
    const node = getNodeByKey("p[1]", document.body.firstElementChild!);
    expect(node!.textContent).toBe("Hello World");
  });
});

describe("getNodePath", () => {
  it('should return "/" for root node', () => {
    expect(getNodePath(document)).toBe("/");
  });

  it("should return correct path for element node", () => {
    const node = document.querySelector("p")!;
    const path = getNodePath(node);
    expect(path).toBe("/html[1]/body[1]/div[1]/p[1]");
  });

  it("should return correct path for text node", () => {
    const node = document.querySelector("p")!.firstChild!;
    const path = getNodePath(node);
    expect(path).toBe("/html[1]/body[1]/div[1]/p[1]/text()[1]");
  });

  it("should return correct path for comment node", () => {
    const node = document.querySelector("body")!.childNodes[3];
    const path = getNodePath(node);
    expect(path).toBe("/html[1]/body[1]/comment()[1]");
  });
});
