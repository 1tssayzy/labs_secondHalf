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

    switch (type) {
      case 'highest':
        return this.queue.reduce((a, b) => (b.priority > a.priority ? b : a)).item;
      case 'lowest':
        return this.queue.reduce((a, b) => (b.priority < a.priority ? b : a)).item;
      case 'oldest-fifo':
        return this.queue.reduce((a, b) => (b.id < a.id ? b : a)).item;
      case 'newest-lifo':
        return this.queue.reduce((a, b) => (b.id > a.id ? b : a)).item;
      default:
        throw new Error("Invalid peek type. Use 'highest', 'lowest', 'oldest', or 'newest'.");
    }
  }

  
  dequeue(type) {
    if (this.queue.length === 0) return null;

    let index = 0;

    for (let i = 1; i < this.queue.length; i++) {
      const current = this.queue[i];
      const selected = this.queue[index];

      if (
        (type === 'highest' && current.priority > selected.priority) ||
        (type === 'lowest' && current.priority < selected.priority) ||
        (type === 'oldest' && current.id < selected.id) ||
        (type === 'newest' && current.id > selected.id)
      ) {
        index = i;
      }
    }

    return this.queue.splice(index, 1)[0].item;
  }
}
 
const pq = new BiDirectionalPriorityQueue();


