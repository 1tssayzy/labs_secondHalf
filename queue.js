class BiDirectionalPriorityQueue {
  constructor() {
    this.queue = [];
    this.counter = 0;
  }

  enqueue(item, priority) {
    this.queue.push({ item, priority, id: this.counter++ });
  }

  peek(type) {
    if (this.queue.length === 0) return null;

    const selectors = {
      highest: (a, b) => b.priority > a.priority,
      lowest: (a, b) => b.priority < a.priority,
      fifo: (a, b) => b.id < a.id,
      lifo: (a, b) => b.id > a.id,
    };
    const selector = selectors[type];
    if (!selector) return null;

    let selected = this.queue[0];

    for (let i = 1; i < this.queue.length; i++) {
      if (selector(this.queue[i], selected)) {
        selected = this.queue[i];
      }
    }
    return selected.item;
  }

  dequeue(type) {
    if (this.queue.length === 0) return null;

    let index = 0;

    for (let i = 1; i < this.queue.length; i++) {
      const current = this.queue[i];
      const selected = this.queue[index];

      if (
        (type === "highest" && current.priority > selected.priority) ||
        (type === "lowest" && current.priority < selected.priority) ||
        (type === "fifo" && current.id < selected.id) ||
        (type === "lifo" && current.id > selected.id)
      ) {
        index = i;
      }
    }

    return this.queue.splice(index, 1)[0].item;
  }
}

const pq = new BiDirectionalPriorityQueue();
