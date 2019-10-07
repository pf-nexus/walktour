import { Coords, getElementCoords, Dims } from "./dom";
import { getViewportStart, getViewportDims } from "./viewport";

export function getCurrentScrollOffset(root: Element): Coords {
  //use documentElement instead of body for scroll-related purposes 
  if (document.body.isSameNode(root)) {
    return {
      x: document.documentElement.scrollLeft,
      y: document.documentElement.scrollTop
    }
  } else {
    return {
      x: root.scrollLeft,
      y: root.scrollTop
    }
  }
}

export function addScrollOffset(root: Element, coords: Coords) {
  const curOffset: Coords = getCurrentScrollOffset(root);
  return {
    x: coords.x + curOffset.x,
    y: coords.y + curOffset.y
  }
}

export function addAppropriateOffset(root: Element, coords: Coords) {
  if (!coords || !root) {
    return;
  }

  if (!document.body.isSameNode(root)) {
    const rootCoords: Coords = getElementCoords(root);
    return addScrollOffset(root, {
      x: coords.x - rootCoords.x,
      y: coords.y - rootCoords.y
    })
  } else {
    return addScrollOffset(root, coords);
  }
}

// apply a common offset calculation where b is centered relative to a. If b is larger than a, the result is that a will be centered within b.
// b is the moveable element: the returned value will specify where to place b to achieve centering.
export function applyCenterOffset(aCoords: Coords, aDims: Dims, b: Dims): Coords {
  return {
    x: aCoords.x + (aDims.width / 2) - (b.width / 2),
    y: aCoords.y + (aDims.height / 2) - (b.height / 2)
  }
}

// get the coordinates the viewport would need to be placed for the element to be centered
export function centerElementInViewport(root: Element, element: HTMLElement): Coords {
  const elementData: ClientRect = element.getBoundingClientRect();
  const elementDims: Dims = {width: elementData.width, height: elementData.height}
  const elementCoords: Coords = getElementCoords(element);

  return applyCenterOffset(elementCoords, elementDims, getViewportDims(root))
}

// get the center coord of the viewport. If element is provided, the return value is the origin 
// which would align that element's center with the viewport center
export function getViewportCenter(root: Element, element?: HTMLElement): Coords {
  if (!root) {
    return;
  }
  const elementData: ClientRect = element && element.getBoundingClientRect();
  const startCoords: Coords = getViewportStart(root);
  const viewportDims: Dims = getViewportDims(root);
  const elementDims: Dims = elementData
    ? { width: elementData.width, height: elementData.height }
    : {width: 0, height: 0}

  return applyCenterOffset(startCoords, viewportDims, elementDims);
}