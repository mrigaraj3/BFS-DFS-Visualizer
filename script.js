let svg = document.getElementById("svg");
let nodes = [];
let mode = "node";
let selected = null;

// ➕ Add Node
svg.onclick = (e) => {
  if (mode !== "node") return;

  let rect = svg.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 15);

  let node = { el: circle, neighbors: [] };

  circle.onclick = (ev) => {
    ev.stopPropagation();

    if (mode === "edge") {
      if (!selected) {
        selected = node;
      } else {
        createEdge(selected, node);
        selected = null;
      }
    }
  };

  nodes.push(node);
  svg.appendChild(circle);
};

// 🔗 Create Edge
function createEdge(a, b) {
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  line.setAttribute("x1", a.el.getAttribute("cx"));
  line.setAttribute("y1", a.el.getAttribute("cy"));
  line.setAttribute("x2", b.el.getAttribute("cx"));
  line.setAttribute("y2", b.el.getAttribute("cy"));

  svg.insertBefore(line, svg.firstChild);

  a.neighbors.push(b);
  b.neighbors.push(a);
}

// ⏱ Delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🔵 BFS
async function runBFS() {
  reset();
  if (nodes.length === 0) return;

  let queue = [nodes[0]];
  let visited = new Set();

  while (queue.length > 0) {
    let current = queue.shift();

    if (visited.has(current)) continue;

    visited.add(current);

    current.el.classList.add("active");
    await sleep(400);
    current.el.classList.remove("active");
    current.el.classList.add("visited");

    for (let neighbor of current.neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
}

// 🔴 DFS
async function runDFS() {
  reset();
  let visited = new Set();

  async function dfs(node) {
    if (visited.has(node)) return;

    visited.add(node);

    node.el.classList.add("active");
    await sleep(400);
    node.el.classList.remove("active");
    node.el.classList.add("visited");

    for (let neighbor of node.neighbors) {
      await dfs(neighbor);
    }
  }

  if (nodes.length > 0) {
    dfs(nodes[0]);
  }
}

// ♻️ Reset
function reset() {
  nodes.forEach(node => {
    node.el.classList.remove("visited", "active");
  });
}
