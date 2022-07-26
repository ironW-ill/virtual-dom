const makeComponent = (tag) => (attributes, children) => {
  if (!attributes || !attributes.id) {
    throw new Error('Component needs an id')
  }
  
  return {
    tag,
    attributes,
    children
  }
}

const div = makeComponent('div') // Function (anonymous)
const p = makeComponent('p') // Function (anonymous)
const h1 = makeComponent('h1') // Function (anonymous)

const app = (state) => (
  div({ id: 'main'}, [
    div({ id: 'header' }, [
      h1({ id: 'title' }, `Hello ${state.name}`),
      p({ id: 'static' }, 'Static Content')
    ])
  ])
)
console.log(app)
console.log(typeof app)

const setAttributes = (element, attributes) => {
  return Object.keys(attributes).forEach(key =>
    element.setAttribute(key, attributes[key])
  )
}

const renderer = ({ tag, children = "", attributes = {} }) => {
  const el = document.createElement(tag)
  setAttributes(el, attributes)
  // console.log(el)
  // console.log(el.innerText)
  // console.log(typeof children, children)
  if (typeof children === 'string') {
    // console.log(el.innerHTML)
    el.innerHTML = children
  } else {
    children.map(renderer).forEach(el.appendChild.bind(el))
  }

  return el
}

const areObjectsDiffrent = (a, b) => {
  const allKeys = Array.from(new Set([...Object.keys(a), Object.keys(b)]))
  return allKeys.some(k => a[k] !== b[k])
}

const areNodesDiffrent = (a, b) => {
  if (!a || !b || (a.tag !== b.tag)) {
    return true
  }

  const typeA = typeof a.children
  const typeB = typeof b.children

  return typeA !== typeB
    || areObjectsDiffrent(a, b)
    || (typeA === 'string' && a.children != b.children)
}

const diffAndReRender = (previousNode, currentNode) => {
  if (areNodesDiffrent(currentNode, previousNode)) {
    const nodeId = currentNode.attributes.id
    previousNode.children = currentNode

    return document
            .querySelector(`#${nodeId}`)
            .replaceWith(renderer(currentNode))
  } else {
    currentNode.children.forEach((currChildNode, index) => {
      diffAndReRender(previousNode.children[index], currChildNode)
    })
  }
}

let name = "How Code Works"
const virtualDOMTree = app({ name })
const root = document.querySelector('#root')
// console.log(renderer(virtualDOMTree))
root.appendChild(renderer(virtualDOMTree))

setInterval(() => {
  name = (name === "How Code Works") ? "Let's make it work" : "How Code Works"
  const newVirtualDom = app({ name })
  diffAndReRender(virtualDOMTree, newVirtualDom)
}, 1000);
