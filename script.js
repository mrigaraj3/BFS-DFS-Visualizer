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

  let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", 15);

  let node = { el: c, x, y, n: [] };

  c.onclick = (ev) => {
    ev.stopPropagation();

    if (mode === "edge") {
      if (!selected) selected = node;
      else {
        createEdge(selected, node);
        selected = null;
      }
    }
  };

  nodes.push(node);
  svg.appendChild(c);
};

// 🔗 Create Edge with Weight
function createEdge(a, b) {
  let weight = prompt("Enter weight:", "1");

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", a.x);
  line.setAttribute("y1", a.y);
  line.setAttribute("x2", b.x);
  line.setAttribute("y2", b.y);

  svg.insertBefore(line, svg.firstChild);

  // weight label
  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", (a.x + b.x) / 2);
  text.setAttribute("y", (a.y + b.y) / 2);
  text.textContent = weight;

  svg.appendChild(text);

  a.n.push(b);
  b.n.push(a);
}

// ⏱ Delay
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// 🔵 BFS
async function runBFS() {
  reset();

  let q = [nodes[0]];
  let vis = new Set();

  while (q.length) {
    let cur = q.shift();
    if (vis.has(cur)) continue;

    vis.add(cur);

    cur.el.classList.add("active");
    await sleep(400);
    cur.el.classList.remove("active");
    cur.el.classList.add("visited");

    for (let n of cur.n) {
      if (!vis.has(n)) q.push(n);
    }
  }
}

// 🔴 DFS
async function runDFS() {
  reset();
  let vis = new Set();

  async function dfs(node) {
    if (vis.has(node)) return;

    vis.add(node);

    node.el.classList.add("active");
    await sleep(400);
    node.el.classList.remove("active");
    node.el.classList.add("visited");

    for (let n of node.n) {
      await dfs(n);
    }
  }

  if (nodes.length) dfs(nodes[0]);
}

// ♻️ Reset
function reset() {
  nodes.forEach(n => {
    n.el.classList.remove("visited", "active");
  });
}
