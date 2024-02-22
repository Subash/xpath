export function getNodeFromPath(path: string, document: Document): Node | undefined {
  const resultType = XPathResult.FIRST_ORDERED_NODE_TYPE;
  const result = document.evaluate(path, document, null, resultType, null);
  return result.singleNodeValue ?? undefined;
}

export function getNodePath(node: Node): string {
  if (!node.parentNode) return "/";
  const parentPath = getNodePath(node.parentNode);
  const nodeNameWithIndex = getNodeKey(node);
  const path = `${parentPath}/${nodeNameWithIndex}`;
  return path.replace("//", "/");
}

export function getNodeByKey(key: string, parent: Node): Node | undefined {
  for (const child of parent.childNodes) {
    if (getNodeKey(child) === key) return child;
  }
}

export function getNodeKey(node: Node): string {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      return getElementNodeKey(node);
    case Node.TEXT_NODE:
      return getTextNodeKey(node);
    case Node.COMMENT_NODE:
      return getCommentNodeKey(node);
    default:
      return getGenericNodeKey(node);
  }
}

function getElementNodeKey(node: Node): string {
  const name = node.nodeName.toLowerCase();
  const siblings = getElementSiblingsOfSameType(node);
  const index = siblings.indexOf(node) + 1;
  return `${name}[${index}]`;
}

function getElementSiblingsOfSameType(node: Node): Node[] {
  const siblings = getElementSiblings(node);
  return siblings.filter((sibling) => sibling.nodeName === node.nodeName);
}

function getElementSiblings(node: Node): Node[] {
  const siblings = getSiblings(node);
  return siblings.filter((sibling) => sibling.nodeType === Node.ELEMENT_NODE);
}

function getSiblings(node: Node): Node[] {
  return getPreviousSiblings(node).concat(node).concat(getNextSiblings(node));
}

function getPreviousSiblings(node: Node): Node[] {
  const siblings: Node[] = [];
  while (node.previousSibling) {
    siblings.unshift(node.previousSibling);
    node = node.previousSibling;
  }
  return siblings;
}

function getNextSiblings(node: Node): Node[] {
  const siblings: Node[] = [];
  while (node.nextSibling) {
    siblings.push(node.nextSibling);
    node = node.nextSibling;
  }
  return siblings;
}

function getTextNodeKey(node: Node): string {
  const siblings = getTextSiblings(node);
  const index = siblings.indexOf(node) + 1;
  return `text()[${index}]`;
}

function getTextSiblings(node: Node): Node[] {
  const siblings = getSiblings(node);
  return siblings.filter((sibling) => sibling.nodeType === Node.TEXT_NODE);
}

function getCommentNodeKey(node: Node): string {
  const siblings = getCommentSiblings(node);
  const index = siblings.indexOf(node) + 1;
  return `comment()[${index}]`;
}

function getCommentSiblings(node: Node): Node[] {
  const siblings = getSiblings(node);
  return siblings.filter((sibling) => sibling.nodeType === Node.COMMENT_NODE);
}

function getGenericNodeKey(node: Node): string {
  const siblings = getSiblings(node);
  const index = siblings.indexOf(node) + 1;
  return `node()[${index}]`;
}
